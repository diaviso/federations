import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Observable, from, map } from 'rxjs';

export interface Ligue {
  id?: number;
  federation_id: number;
  nom: string;
  description: string;
  president: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  code_postal: string;
  site_web?: string;
  logo_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class LigueService {
  private supabase: SupabaseClient;
  private STORAGE_BUCKET = 'logos';

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getLiguesByFederation(federationId: number): Observable<Ligue[]> {
    return from(
      this.supabase
        .from('ligue')
        .select('*')
        .eq('federation_id', federationId)
        .order('nom')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  getLigue(id: number): Observable<Ligue> {
    return from(
      this.supabase
        .from('ligue')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Ligue non trouvée');
        return data;
      })
    );
  }

  async uploadLogo(file: File, ligueId: number): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${ligueId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await this.supabase.storage
      .from(this.STORAGE_BUCKET)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from(this.STORAGE_BUCKET)
      .getPublicUrl(filePath);

    // Mise à jour de l'URL du logo dans la table ligues
    const { error: updateError } = await this.supabase
      .from('ligue')
      .update({ logo_url: publicUrl })
      .eq('id', ligueId);

    if (updateError) {
      throw updateError;
    }

    return publicUrl;
  }

  async deleteLogo(ligueId: number, logoUrl: string): Promise<void> {
    // Extraction du nom du fichier de l'URL
    const fileName = logoUrl.split('/').pop();
    if (!fileName) throw new Error('URL du logo invalide');

    // Suppression du fichier du stockage
    const { error: deleteError } = await this.supabase.storage
      .from(this.STORAGE_BUCKET)
      .remove([fileName]);

    if (deleteError) {
      throw deleteError;
    }

    // Mise à jour de la ligue pour supprimer l'URL du logo
    const { error: updateError } = await this.supabase
      .from('ligue')
      .update({ logo_url: null })
      .eq('id', ligueId);

    if (updateError) {
      throw updateError;
    }
  }

  createLigue(ligue: Omit<Ligue, 'id' | 'created_at' | 'updated_at'>): Observable<Ligue> {
    console.log(ligue);
    return from(
      this.supabase
        .from('ligue')
        .insert([ligue])
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Erreur lors de la création de la ligue');
        return data;
      })
    );
  }

  updateLigue(id: number, ligue: Partial<Ligue>): Observable<Ligue> {
    return from(
      this.supabase
        .from('ligue')
        .update(ligue)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Ligue non trouvée');
        return data;
      })
    );
  }

  deleteLigue(id: number): Observable<void> {
    return from(
      this.supabase
        .from('ligue')
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  searchLigues(federationId: number, query: string): Observable<Ligue[]> {
    return from(
      this.supabase
        .from('ligue')
        .select('*')
        .eq('federation_id', federationId)
        .or(`nom.ilike.%${query}%, description.ilike.%${query}%, ville.ilike.%${query}%`)
        .order('nom')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }
}
