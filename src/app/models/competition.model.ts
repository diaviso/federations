export type CompetitionType = 'championnat' | 'coupe' | 'tournoi';
export type CompetitionStatus = 'a_venir' | 'en_cours' | 'termine';
export type CompetitionScope = 'federation' | 'ligue';

export interface Competition {
  id?: number;
  nom: string;
  description?: string;
  date_debut: Date;
  date_fin: Date;
  lieu: string;
  type_competition: CompetitionType;
  statut: CompetitionStatus;
  scope: CompetitionScope;
  federation_id?: number;
  ligue_id?: number;
  logo_url?: string;
  created_at?: Date;
  updated_at?: Date;
}
