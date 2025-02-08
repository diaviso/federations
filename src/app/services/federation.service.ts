import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Federation } from '../models/federation.model';
import { Observable, from, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FederationService {
  private readonly BUCKET_NAME = 'logos';
  private readonly TABLE_NAME = 'federation';

  constructor(private supabase: SupabaseService) {
    //this.createBucketIfNotExists();
  }

  /*private async createBucketIfNotExists() {
    const { data: buckets } = await this.supabase.getClient().storage.listBuckets();
    if (!buckets?.find(b => b.name === this.BUCKET_NAME)) {
      await this.supabase.getClient().storage.createBucket(this.BUCKET_NAME, {
        public: true
      });
    }
  }*/

  private sanitizeFileName(fileName: string): string {
    // Remove accents/diacritics
    const normalized = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Replace spaces and special characters with underscores
    const sanitized = normalized.replace(/[^a-zA-Z0-9.]/g, '_');
    // Ensure unique filename by adding timestamp
    const timestamp = Date.now();
    const extension = sanitized.split('.').pop();
    const baseName = sanitized.split('.').slice(0, -1).join('.');
    return `${timestamp}_${baseName}.${extension}`;
  }

  getAllFederations(): Observable<Federation[]> {
    return from(
      this.supabase.getClient()
        .from(this.TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  getFederationById(id: number): Observable<Federation> {
    return from(
      this.supabase.getClient()
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Federation not found');
        return data;
      })
    );
  }

  async createFederation(federation: Federation, logoFile?: File): Promise<Federation> {
    let logoUrl = '';
   
    if (logoFile) {
    
      const sanitizedFileName = this.sanitizeFileName(logoFile.name);
    
      
      const { data: uploadData, error: uploadError } = await this.supabase.getClient().storage
        .from(this.BUCKET_NAME)
        .upload(sanitizedFileName, logoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.log('fi leu erreur bi neik')
        throw uploadError; 


      };
      
      const { data: { publicUrl } } = this.supabase.getClient().storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(uploadData.path);
      
      logoUrl = publicUrl;
    }else{
      console.log('---------xxxxxxxxxxxxxxxxxxxxxxxxxx--------------')
    }
    console.log(federation);
    const { data, error } = await this.supabase.getClient()
      .from(this.TABLE_NAME)
      .insert([{ ...federation, logo_url: logoUrl }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateFederation(id: number, federation: Partial<Federation>, logoFile?: File): Promise<Federation> {
    const updates: Partial<Federation> = { ...federation };

    if (logoFile) {
      // Delete old logo if exists
      const oldFederation = await firstValueFrom(this.getFederationById(id));
      if (oldFederation?.logo_url) {
        const oldLogoPath = oldFederation.logo_url.split('/').pop();
        if (oldLogoPath) {
          await this.supabase.getClient().storage
            .from(this.BUCKET_NAME)
            .remove([oldLogoPath]);
        }
      }

      // Upload new logo
      const sanitizedFileName = this.sanitizeFileName(logoFile.name);
      const { data: uploadData, error: uploadError } = await this.supabase.getClient().storage
        .from(this.BUCKET_NAME)
        .upload(sanitizedFileName, logoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = this.supabase.getClient().storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(uploadData.path);
      
      updates.logo_url = publicUrl;
    }

    const { data, error } = await this.supabase.getClient()
      .from(this.TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteFederation(id: number): Promise<void> {
    // Delete logo if exists
    const federation = await firstValueFrom(this.getFederationById(id));
    if (federation?.logo_url) {
      const logoPath = federation.logo_url.split('/').pop();
      if (logoPath) {
        await this.supabase.getClient().storage
          .from(this.BUCKET_NAME)
          .remove([logoPath]);
      }
    }

    const { error } = await this.supabase.getClient()
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
