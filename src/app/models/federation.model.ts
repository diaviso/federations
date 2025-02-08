export interface Federation {
  id: number;
  nom: string;
  description: string;
  date_creation: Date;
  president: string;
  logo_url?: string;
  contact_email: string;
  contact_telephone: string;
  adresse: string;
  created_at?: Date;
  updated_at?: Date;
}
