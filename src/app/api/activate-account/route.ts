import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, targetType, password } = body as {
      token: string;
      targetType: "party" | "mandataire";
      password: string;
    };

    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: "Jeton ou mot de passe manquant." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Le mot de passe doit comporter au moins 6 caractères." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { success: true, localOnly: true, message: "Configuration locale uniquement." }
      );
    }

    const dateActivation = new Date().toLocaleDateString("fr-FR");

    if (targetType === "mandataire") {
      const { error } = await supabaseAdmin
        .from("mandataires")
        .update({
          statut: "actif",
          password: password,
          date_activation: dateActivation,
        })
        .eq("activation_token", token);

      if (error) {
        console.error("Erreur mise à jour mandataire:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Compte mandataire activé avec succès." });
    } else {
      // Parti politique
      const { error } = await supabaseAdmin
        .from("parties")
        .update({
          statut: "actif",
          password: password,
          date_activation: dateActivation,
        })
        .eq("activation_token", token);

      if (error) {
        console.error("Erreur mise à jour parti:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Compte parti activé avec succès." });
    }
  } catch (err: any) {
    console.error("Exception activate-account:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Erreur serveur inattendue." },
      { status: 500 }
    );
  }
}
