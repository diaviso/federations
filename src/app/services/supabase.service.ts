import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Federation } from '../models/federation.model';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
  async getFederations() {
    const { data, error } = await this.supabase
      .from('federations')
      .select('*');
    if (error) throw error;
    return data;
  }

  async createFederation(federation: Federation) {
    const { data, error } = await this.supabase
      .from('federations')
      .insert(federation)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateFederation(federation: Federation) {
    const { data, error } = await this.supabase
      .from('federations')
      .update(federation)
      .eq('id', federation.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteFederation(id: number) {
    const { error } = await this.supabase
      .from('federations')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
