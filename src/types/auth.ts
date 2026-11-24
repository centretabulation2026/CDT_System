export type UserType = "superadmin" | "membre" | "mandataire";

export interface CurrentUser {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  userType: UserType;
  roleTitle: string;
  tenantId?: string;
  tenantName?: string;
  bureauAssigne?: string;
  telephone?: string;
  nifCin?: string;
  departement?: string;
  commune?: string;
}

export interface PartyTenant {
  id: string;
  nom: string;
  sigle: string;
  dirigeantNom: string;
  dirigeantPrenom: string;
  email: string;
  activationToken: string;
  statut: "en_attente" | "actif" | "suspendu";
  password?: string;
  licenceType: string;
  dateCreation: string;
  dateActivation?: string;
}
