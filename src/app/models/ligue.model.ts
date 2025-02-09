export interface Ligue {
  id: number;
  federation_id: number;
  nom: string;
  description: string;
  date_creation?: Date;
  president: string;
  logo_url?: string;
  email: string;
  telephone: string;
  adresse: string;
  code_postal: string;
  created_at?: Date;
  updated_at?: Date;
}
