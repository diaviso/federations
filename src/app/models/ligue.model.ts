export interface Ligue {
  id?: number;
  nom: string;
  description: string;
  federation_id: number;
  president: string;
  contact_email: string;
  contact_telephone: string;
  region: string;
  created_at?: Date;
  updated_at?: Date;
  logo_url?: string;
}
