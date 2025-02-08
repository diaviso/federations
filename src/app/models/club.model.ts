export interface Club {
  id?: number;
  nom: string;
  description?: string;
  president: string;
  ligue_id: number;
  logo_url?: string;
  contact_email: string;
  contact_telephone: string;
  adresse: string;
  created_at?: Date;
  updated_at?: Date;
}
