import { supabase, supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { PartyTenant } from "@/types/auth";
import { BureauDeVote } from "@/components/bureaux/BureauxView";
import { MembreParti } from "@/components/members/MembersView";
import { Mandataire } from "@/components/mandataires/MandatairesView";

// ========================================================
// 1. GESTION DES PARTIS POLITIQUES
// ========================================================

export async function fetchPartiesFromSupabase(): Promise<PartyTenant[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("parties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur fetchPartiesFromSupabase:", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      nom: row.nom,
      sigle: row.sigle,
      dirigeantNom: row.dirigeant_nom,
      dirigeantPrenom: row.dirigeant_prenom,
      email: row.email,
      activationToken: row.activation_token,
      statut: row.statut as "actif" | "en_attente" | "suspendu",
      password: row.password,
      licenceType: "Licence Officielle",
      dateCreation: row.date_adhesion,
      dateActivation: row.date_activation,
      logoUrl: row.logo_url,
    }));
  } catch (err) {
    console.error("Exception fetchPartiesFromSupabase:", err);
    return [];
  }
}

export async function savePartyToSupabase(party: PartyTenant): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const payload = {
      id: party.id,
      nom: party.nom,
      sigle: party.sigle,
      code: party.sigle.toLowerCase() + "-" + Date.now().toString(36),
      date_adhesion: party.dateCreation || new Date().toLocaleDateString("fr-FR"),
      statut: party.statut,
      email: party.email.toLowerCase().trim(),
      password: party.password || null,
      dirigeant_nom: party.dirigeantNom,
      dirigeant_prenom: party.dirigeantPrenom,
      activation_token: party.activationToken || null,
      date_activation: party.dateActivation || null,
      logo_url: party.logoUrl || null,
    };

    const { error } = await supabaseAdmin.from("parties").upsert(payload);
    if (error) {
      console.error("Erreur savePartyToSupabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Exception savePartyToSupabase:", err);
    return false;
  }
}

export async function activatePartyInSupabase(
  token: string,
  newPassword: string
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabaseAdmin
      .from("parties")
      .update({
        statut: "actif",
        password: newPassword,
        date_activation: new Date().toLocaleDateString("fr-FR"),
      })
      .eq("activation_token", token);

    if (error) {
      console.error("Erreur activatePartyInSupabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Exception activatePartyInSupabase:", err);
    return false;
  }
}

// ========================================================
// 2. GESTION DES BUREAUX DE VOTE
// ========================================================

export async function fetchBureauxFromSupabase(): Promise<BureauDeVote[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("bureaux_vote")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur fetchBureauxFromSupabase:", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      numero: row.code || "",
      nom: row.nom,
      ville: row.ville || "",
      adresse: row.adresse || "",
      capaciteElecteurs: row.electeurs_inscrits || 350,
      statut: (row.statut === "actif" || row.statut === "en_attente" ? row.statut : "actif") as "actif" | "en_attente",
      dateCreation: row.created_at
        ? new Date(row.created_at).toLocaleDateString("fr-FR")
        : new Date().toLocaleDateString("fr-FR"),
    }));
  } catch (err) {
    console.error("Exception fetchBureauxFromSupabase:", err);
    return [];
  }
}

export async function saveBureauToSupabase(bureau: BureauDeVote): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const payload = {
      id: bureau.id,
      code: bureau.numero || "BV-" + Math.floor(1000 + Math.random() * 9000),
      nom: bureau.nom,
      departement: "Ouest",
      ville: bureau.ville,
      adresse: bureau.adresse || null,
      electeurs_inscrits: bureau.capaciteElecteurs || 350,
      statut: bureau.statut || "actif",
    };

    const { error } = await supabaseAdmin.from("bureaux_vote").upsert(payload);
    if (error) {
      console.error("Erreur saveBureauToSupabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Exception saveBureauToSupabase:", err);
    return false;
  }
}

export async function deleteBureauFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabaseAdmin.from("bureaux_vote").delete().eq("id", id);
    if (error) {
      console.error("Erreur deleteBureauFromSupabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Exception deleteBureauFromSupabase:", err);
    return false;
  }
}

// ========================================================
// 3. GESTION DES MEMBRES DU PARTI
// ========================================================

export async function fetchMembresFromSupabase(): Promise<MembreParti[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur fetchMembresFromSupabase:", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      nom: row.nom,
      prenom: row.prenom,
      email: row.email,
      telephone: row.telephone || "",
      role: row.role,
      adresse: row.adresse || "",
      nifCin: row.nif_cin || "",
      departement: row.departement,
      ville: row.ville,
      dateAdhesion: row.date_adhesion,
      statut: row.statut as "actif" | "inactif",
      password: row.password || undefined,
    }));
  } catch (err) {
    console.error("Exception fetchMembresFromSupabase:", err);
    return [];
  }
}

export async function saveMembreToSupabase(membre: MembreParti): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const payload = {
      id: membre.id,
      nom: membre.nom,
      prenom: membre.prenom,
      email: membre.email.toLowerCase().trim(),
      telephone: membre.telephone || null,
      role: membre.role,
      adresse: membre.adresse || null,
      nif_cin: membre.nifCin || null,
      departement: membre.departement,
      ville: membre.ville,
      date_adhesion: membre.dateAdhesion || new Date().toLocaleDateString("fr-FR"),
      statut: membre.statut || "actif",
      password: membre.password || null,
    };

    const { error } = await supabaseAdmin.from("membres").upsert(payload);
    if (error) {
      console.error("Erreur saveMembreToSupabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Exception saveMembreToSupabase:", err);
    return false;
  }
}

export async function deleteMembreFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabaseAdmin.from("membres").delete().eq("id", id);
    if (error) {
      console.error("Erreur deleteMembreFromSupabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Exception deleteMembreFromSupabase:", err);
    return false;
  }
}

// ========================================================
// 4. GESTION DES MANDATAIRES DE TERRAIN
// ========================================================

export async function fetchMandatairesFromSupabase(): Promise<Mandataire[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from("mandataires")
      .select("*, parties:party_id (nom, sigle)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur fetchMandatairesFromSupabase:", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      nom: row.nom,
      prenom: row.prenom,
      email: row.email,
      telephone: row.telephone || "",
      photoUrl: row.photo_url || undefined,
      bureauAssigne: row.bureau_assigne,
      adresse: row.adresse || "",
      nifCin: row.nif_cin || "",
      departement: row.departement,
      ville: row.ville,
      dateAffectation: row.date_affectation,
      statut: row.statut as "actif" | "en_attente",
      activationToken: row.activation_token || undefined,
      dateActivation: row.date_activation || undefined,
      password: row.password || undefined,
      partyId: row.party_id || undefined,
      tenantName: row.parties?.nom || undefined,
    }));
  } catch (err) {
    console.error("Exception fetchMandatairesFromSupabase:", err);
    return [];
  }
}

export async function saveMandataireToSupabase(
  mandataire: Mandataire
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const payload = {
      id: mandataire.id,
      nom: mandataire.nom,
      prenom: mandataire.prenom,
      party_id: mandataire.partyId || null,
      email: mandataire.email.toLowerCase().trim(),
      telephone: mandataire.telephone || null,
      photo_url: mandataire.photoUrl || null,
      bureau_assigne: mandataire.bureauAssigne,
      adresse: mandataire.adresse || null,
      nif_cin: mandataire.nifCin || null,
      departement: mandataire.departement,
      ville: mandataire.ville,
      date_affectation:
        mandataire.dateAffectation || new Date().toLocaleDateString("fr-FR"),
      statut: mandataire.statut || "en_attente",
      activation_token: mandataire.activationToken || null,
      date_activation: mandataire.dateActivation || null,
      password: mandataire.password || null,
    };

    const { error } = await supabaseAdmin.from("mandataires").upsert(payload);
    if (error) {
      console.error("Erreur saveMandataireToSupabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Exception saveMandataireToSupabase:", err);
    return false;
  }
}

export async function activateMandataireInSupabase(
  token: string,
  newPassword: string
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabaseAdmin
      .from("mandataires")
      .update({
        statut: "actif",
        password: newPassword,
        date_activation: new Date().toLocaleDateString("fr-FR"),
      })
      .eq("activation_token", token);

    if (error) {
      console.error("Erreur activateMandataireInSupabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Exception activateMandataireInSupabase:", err);
    return false;
  }
}

export async function deleteMandataireFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabaseAdmin.from("mandataires").delete().eq("id", id);
    if (error) {
      console.error("Erreur deleteMandataireFromSupabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Exception deleteMandataireFromSupabase:", err);
    return false;
  }
}
