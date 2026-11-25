import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const LOGO_FILE = path.join(DATA_DIR, "party_logos.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readLogosFromFile(): Record<string, any> {
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(LOGO_FILE)) {
      return {};
    }
    const raw = fs.readFileSync(LOGO_FILE, "utf-8");
    return JSON.parse(raw || "{}");
  } catch (err) {
    console.error("Erreur lecture party_logos.json:", err);
    return {};
  }
}

function writeLogosToFile(logos: Record<string, any>) {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(LOGO_FILE, JSON.stringify(logos, null, 2), "utf-8");
  } catch (err) {
    console.error("Erreur écriture party_logos.json:", err);
  }
}

// GET /api/party-logo?partyId=...&partyName=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partyId = searchParams.get("partyId") || "";
    const partyName = searchParams.get("partyName") || "";
    const cleanName = partyName.trim().toLowerCase();
    const cleanId = partyId.trim().toLowerCase();

    // 1. Lire fichier local
    const logos = readLogosFromFile();
    let logoUrl =
      (cleanName && logos[cleanName]) ||
      (cleanId && logos[cleanId]) ||
      logos["current"] ||
      logos["parti octacore"] ||
      null;

    // 2. Vérifier si un fichier public/party-logo.png existe sur le serveur
    const publicLogoPath = path.join(process.cwd(), "public", "party-logo.png");
    if (!logoUrl && fs.existsSync(publicLogoPath)) {
      try {
        const fileBuf = fs.readFileSync(publicLogoPath);
        logoUrl = `data:image/png;base64,${fileBuf.toString("base64")}`;
      } catch (e) {}
    }

    // 3. Si Supabase est configuré et pas de logo local, tenter depuis la base
    if (!logoUrl && isSupabaseConfigured) {
      try {
        const query = supabaseAdmin
          .from("parties")
          .select("id, nom, logo_url")
          .order("created_at", { ascending: false });

        if (partyName) {
          query.ilike("nom", partyName.trim());
        }

        const { data } = await query.limit(1).maybeSingle();
        if (data?.logo_url) {
          logoUrl = data.logo_url;
        }
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      logoUrl: logoUrl || null,
      partyName: partyName || "Parti Octacore",
    });
  } catch (err: any) {
    console.error("Erreur GET /api/party-logo:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// POST /api/party-logo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partyId, partyName, logoUrl } = body;

    if (!logoUrl) {
      return NextResponse.json(
        { success: false, error: "logoUrl manquant" },
        { status: 400 }
      );
    }

    const cleanName = (partyName || "Parti Octacore").trim().toLowerCase();
    const cleanId = (partyId || "").trim().toLowerCase();

    // 1. Sauvegarder dans le fichier local
    const logos = readLogosFromFile();
    logos["current"] = logoUrl;
    if (cleanName) logos[cleanName] = logoUrl;
    if (cleanId) logos[cleanId] = logoUrl;
    logos["parti octacore"] = logoUrl;

    writeLogosToFile(logos);

    // 2. Sauvegarder également une copie physique dans public/party-logo.png
    if (typeof logoUrl === "string" && logoUrl.startsWith("data:image/")) {
      try {
        const publicDir = path.join(process.cwd(), "public");
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        const base64Data = logoUrl.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        fs.writeFileSync(path.join(publicDir, "party-logo.png"), buffer);
      } catch (fErr) {
        console.error("Erreur écriture public/party-logo.png:", fErr);
      }
    }

    // 3. Si Supabase est configuré, mettre à jour dans Supabase
    if (isSupabaseConfigured) {
      try {
        if (partyId) {
          await supabaseAdmin
            .from("parties")
            .update({ logo_url: logoUrl })
            .eq("id", partyId);
        } else if (partyName) {
          await supabaseAdmin
            .from("parties")
            .update({ logo_url: logoUrl })
            .ilike("nom", partyName.trim());
        }
      } catch (supaErr) {
        console.error("Erreur mise à jour Supabase parties logo_url:", supaErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Logo du parti enregistré avec succès",
      logoUrl,
    });
  } catch (err: any) {
    console.error("Erreur POST /api/party-logo:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
