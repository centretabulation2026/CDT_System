import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ success: false, error: "Jeton manquant" }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ success: false, supabaseNotConfigured: true }, { status: 200 });
  }

  try {
    // 1. Chercher dans les mandataires
    const { data: mData, error: mErr } = await supabaseAdmin
      .from("mandataires")
      .select("*, parties:party_id (id, nom, sigle)")
      .eq("activation_token", token)
      .maybeSingle();

    if (mErr) {
      console.warn("Vérification mandataire Supabase warning:", mErr.message);
    }

    if (mData) {
      let nomParti = mData.parties?.nom;
      if (!nomParti) {
        const { data: p } = await supabaseAdmin
          .from("parties")
          .select("nom")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        nomParti = p?.nom || "Parti Octacore";
      }

      return NextResponse.json({
        success: true,
        targetType: "mandataire",
        data: {
          id: mData.id,
          nom: mData.nom,
          prenom: mData.prenom,
          email: mData.email,
          bureauAssigne: mData.bureau_assigne,
          departement: mData.departement,
          ville: mData.ville,
          telephone: mData.telephone || "",
          adresse: mData.adresse || "",
          nifCin: mData.nif_cin || "",
          dateAffectation: mData.date_affectation,
          statut: mData.statut,
          tenantName: nomParti,
        },
      });
    }

    // 2. Chercher dans les partis politiques
    const { data: pData, error: pErr } = await supabaseAdmin
      .from("parties")
      .select("*")
      .eq("activation_token", token)
      .maybeSingle();

    if (pErr) {
      console.warn("Vérification parti Supabase warning:", pErr.message);
    }

    if (pData) {
      return NextResponse.json({
        success: true,
        targetType: "party",
        data: {
          id: pData.id,
          nom: pData.nom,
          sigle: pData.sigle,
          dirigeantNom: pData.dirigeant_nom,
          dirigeantPrenom: pData.dirigeant_prenom,
          email: pData.email,
          activationToken: pData.activation_token,
          statut: pData.statut,
          licenceType: "Licence Officielle",
          dateCreation: pData.date_adhesion,
        },
      });
    }

    return NextResponse.json({ success: false, notFound: true });
  } catch (err: any) {
    console.error("Exception verify-token:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
