import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const GUIDE_FILE = path.join(DATA_DIR, "party_guides.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readGuidesFromFile(): Record<string, any> {
  try {
    ensureDirectoryExists();
    if (!fs.existsSync(GUIDE_FILE)) {
      return {};
    }
    const raw = fs.readFileSync(GUIDE_FILE, "utf-8");
    return JSON.parse(raw || "{}");
  } catch (err) {
    console.error("Erreur lecture party_guides.json:", err);
    return {};
  }
}

function writeGuidesToFile(guides: Record<string, any>) {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(GUIDE_FILE, JSON.stringify(guides, null, 2), "utf-8");
  } catch (err) {
    console.error("Erreur écriture party_guides.json:", err);
  }
}

// GET /api/party-guide?partyId=...&partyName=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partyId = searchParams.get("partyId") || "";
    const partyName = searchParams.get("partyName") || "";
    const key = (partyId || partyName || "default").trim().toLowerCase();

    // 1. Lire fichier local
    const guides = readGuidesFromFile();
    const localEntry = guides[key] || guides[partyName.trim().toLowerCase()] || guides[partyId.trim().toLowerCase()];

    // 2. Si supabase configuré, tenter de synchroniser
    if (isSupabaseConfigured) {
      try {
        const { data } = await supabaseAdmin
          .from("party_guides")
          .select("*")
          .or(`party_id.eq.${partyId},party_name.eq.${partyName}`)
          .order("updated_at", { ascending: false })
          .limit(1);

        if (data && data.length > 0) {
          const row = data[0];
          return NextResponse.json({
            success: true,
            guideText: row.guide_text,
            updatedAt: row.updated_at,
            updatedBy: row.updated_by,
          });
        }
      } catch (e) {
        // Fallback silencieux vers stockage local
      }
    }

    if (localEntry) {
      return NextResponse.json({
        success: true,
        guideText: localEntry.guideText,
        updatedAt: localEntry.updatedAt,
        updatedBy: localEntry.updatedBy,
      });
    }

    return NextResponse.json({
      success: true,
      guideText: null,
      updatedAt: null,
      updatedBy: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur récupération guide" },
      { status: 500 }
    );
  }
}

// POST /api/party-guide
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { partyId, partyName, guideText, updatedBy } = body;

    const key = (partyId || partyName || "default").trim().toLowerCase();
    const now = new Date().toISOString();

    // 1. Sauvegarder dans le fichier local
    const guides = readGuidesFromFile();
    const entry = {
      partyId: partyId || key,
      partyName: partyName || "Parti",
      guideText: guideText || "",
      updatedAt: now,
      updatedBy: updatedBy || "Administrateur du Parti",
    };
    guides[key] = entry;
    if (partyName) {
      guides[partyName.trim().toLowerCase()] = entry;
    }
    if (partyId) {
      guides[partyId.trim().toLowerCase()] = entry;
    }
    writeGuidesToFile(guides);

    // 2. Si supabase configuré, tenter upsert
    if (isSupabaseConfigured) {
      try {
        await supabaseAdmin.from("party_guides").upsert(
          {
            party_id: partyId || key,
            party_name: partyName || "Parti",
            guide_text: guideText || "",
            updated_at: now,
            updated_by: updatedBy || "Administrateur du Parti",
          },
          { onConflict: "party_id" }
        );
      } catch (e) {
        // Table party_guides optionnelle en local
      }
    }

    return NextResponse.json({
      success: true,
      message: "Guide enregistré avec succès",
      updatedAt: now,
      entry,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Erreur sauvegarde guide" },
      { status: 500 }
    );
  }
}
