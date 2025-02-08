export type LicenceType = 'joueur' | 'entraineur' | 'arbitre' | 'dirigeant';
export type LicenceStatus = 'active' | 'suspendue' | 'expiree';

export interface Licence {
  id?: number;
  numero_licence: string;
  nom_licencie: string;
  prenom_licencie: string;
  date_naissance?: Date;
  club_id: number;
  type_licence: LicenceType;
  date_debut: Date;
  date_fin: Date;
  statut: LicenceStatus;
  created_at?: Date;
  updated_at?: Date;
}
