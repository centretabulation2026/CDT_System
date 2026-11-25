"use client";

import React, { useState, useMemo, useRef } from "react";
import { Plus, Trash2, Search, User, Upload, CheckCircle2, Clock, Mail, RefreshCw, AlertCircle, X, FileSpreadsheet, FileText, Eye, EyeOff, Lock } from "lucide-react";
import { BureauDeVote } from "@/components/bureaux/BureauxView";
import { generateMandataireActivationEmailHtml } from "@/lib/emailTemplates";
import { CurrentUser } from "@/types/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface Mandataire {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  photoUrl?: string;
  telephone: string;
  bureauAssigne: string;
  adresse: string;
  nifCin: string;
  departement: string;
  ville: string;
  dateAffectation: string;
  statut: "actif" | "en_attente";
  activationToken?: string;
  dateActivation?: string;
  password?: string;
  partyId?: string;
  tenantName?: string;
}

export const DEPARTEMENTS_HAITI = [
  "Ouest",
  "Nord",
  "Sud",
  "Artibonite",
  "Centre",
  "Nord-Ouest",
  "Nord-Est",
  "Sud-Est",
  "Grand'Anse",
  "Nippes",
];

export const INITIAL_MANDATAIRES: Mandataire[] = [];

interface MandatairesViewProps {
  mandatairesList?: Mandataire[];
  bureauxList?: BureauDeVote[];
  currentUser?: CurrentUser;
  onAddMandataire?: (mandataire: Mandataire) => void;
  onDeleteMandataire?: (id: string) => void;
}

export default function MandatairesView({
  mandatairesList = INITIAL_MANDATAIRES,
  bureauxList = [],
  currentUser,
  onAddMandataire,
  onDeleteMandataire,
}: MandatairesViewProps) {
  const [mandataires, setMandataires] = useState<Mandataire[]>(mandatairesList);

  // Formulaire (identique aux membres, avec photo d'identité et bureau assigné)
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [bureauSelection, setBureauSelection] = useState("Non assigné");
  const [customBureau, setCustomBureau] = useState("");
  const [adresse, setAdresse] = useState("");
  const [nifCin, setNifCin] = useState("");
  const [departement, setDepartement] = useState(DEPARTEMENTS_HAITI[0]);
  const [ville, setVille] = useState("");

  // Mot de passe d'accès défini directement par l'administrateur
  const generateRandomPassword = () => {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let rand = "";
    for (let i = 0; i < 5; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `Mandataire2026$${rand}`;
  };

  const [password, setPassword] = useState(generateRandomPassword);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [topAlertMessage, setTopAlertMessage] = useState<string | null>(null);
  const topAlertTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartement, setFilterDepartement] = useState("all");
  const [showForm, setShowForm] = useState(false);

  React.useEffect(() => {
    if (mandatairesList) {
      setMandataires(mandatairesList);
    }
  }, [mandatairesList]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrorMessage("La photo est trop volumineuse (maximum 3 Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanNom = nom.trim();
    const cleanPrenom = prenom.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanTel = telephone.trim();
    const cleanVille = ville.trim();
    const cleanAdresse = adresse.trim();
    const cleanNifCin = nifCin.trim();
    const cleanPassword = password.trim() || generateRandomPassword();

    if (!cleanNom || !cleanPrenom || !cleanVille || !cleanEmail || !cleanPassword) {
      setErrorMessage("Veuillez remplir les champs obligatoires (*) incluant l'adresse e-mail et le mot de passe d'accès.");
      return;
    }

    // VÉRIFICATION D'UNICITÉ STRICTE : IMPOSSIBLE QU'UN MANDATAIRE SOIT MANDATÉ PAR DEUX PARTIS DIFFÉRENTS
    let existingMandataire = mandataires.find(
      (m) => m.email && m.email.trim().toLowerCase() === cleanEmail
    );

    if (!existingMandataire) {
      try {
        const storedAll = localStorage.getItem("cdt_mandataires");
        if (storedAll) {
          const allList: Mandataire[] = JSON.parse(storedAll);
          existingMandataire = allList.find(
            (m) => m.email && m.email.trim().toLowerCase() === cleanEmail
          );
        }
      } catch (err) {}
    }

    if (!existingMandataire && mandatairesList) {
      existingMandataire = mandatairesList.find(
        (m) => m.email && m.email.trim().toLowerCase() === cleanEmail
      );
    }

    if (!existingMandataire && isSupabaseConfigured) {
      try {
        const { data: supaM } = await supabase
          .from("mandataires")
          .select("id, email")
          .ilike("email", cleanEmail)
          .maybeSingle();
        if (supaM) {
          existingMandataire = supaM as any;
        }
      } catch (err) {}
    }

    if (existingMandataire) {
      const duplicateError = "Ce mandataire est déjà sélectionné";
      setTopAlertMessage(duplicateError);
      setErrorMessage(duplicateError);

      if (topAlertTimeoutRef.current) {
        clearTimeout(topAlertTimeoutRef.current);
      }
      topAlertTimeoutRef.current = setTimeout(() => {
        setTopAlertMessage(null);
      }, 6000);

      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const assignedBureauFinal =
      bureauSelection === "custom"
        ? customBureau.trim() || "Non assigné"
        : bureauSelection;

    // Récupération dynamique du parti politique actif (ex: Parti Octacore)
    let nomParti = currentUser?.tenantName || "Parti Octacore";
    let partyId = currentUser?.tenantId || "";
    try {
      const storedUser = localStorage.getItem("cdt_current_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.tenantName) nomParti = u.tenantName;
        if (u.tenantId) partyId = u.tenantId;
      }
    } catch (e) {}

    const newMandataire: Mandataire = {
      id: `mandataire-${Date.now()}`,
      nom: cleanNom,
      prenom: cleanPrenom,
      email: cleanEmail,
      photoUrl: photoPreview || photoUrl || undefined,
      telephone: cleanTel,
      bureauAssigne: assignedBureauFinal,
      adresse: cleanAdresse,
      nifCin: cleanNifCin,
      departement: departement,
      ville: cleanVille,
      dateAffectation: new Date().toLocaleDateString("fr-FR"),
      statut: "actif", // Mot de passe défini directement par l'administrateur
      password: cleanPassword,
      partyId: partyId,
      tenantName: nomParti,
    };

    const updated = [newMandataire, ...mandataires];
    setMandataires(updated);
    if (onAddMandataire) {
      onAddMandataire(newMandataire);
    }

    // Envoi des identifiants officiels au mandataire
    const loginUrl = `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/login`;

    const credentialsEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #000B58; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #000B58; margin: 0; font-size: 20px; font-weight: 800;">Espace Mandataire Officiel</h2>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px;">${nomParti} • Accréditation Électorale</p>
        </div>

        <p style="font-size: 14px; color: #1e293b; line-height: 1.5;">
          Bonjour <strong>${cleanPrenom} ${cleanNom}</strong>,
        </p>

        <p style="font-size: 13px; color: #334155; line-height: 1.6;">
          Votre compte mandataire officiel a été créé et activé par l'administrateur de votre parti. Vos identifiants sécurisés sont disponibles ci-dessous :
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 6px 0; font-size: 13px; color: #0f172a;">
            <strong>Identifiant (E-mail) :</strong> <span style="color: #000B58; font-weight: bold;">${cleanEmail}</span>
          </p>
          <p style="margin: 6px 0; font-size: 13px; color: #0f172a;">
            <strong>Mot de passe d'accès :</strong> <span style="color: #000B58; font-weight: bold;">${cleanPassword}</span>
          </p>
          <p style="margin: 6px 0; font-size: 13px; color: #0f172a;">
            <strong>Bureau de vote assigné :</strong> <span>${assignedBureauFinal}</span>
          </p>
          <p style="margin: 6px 0; font-size: 13px; color: #0f172a;">
            <strong>Localisation :</strong> <span>${cleanVille} (${departement})</span>
          </p>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${loginUrl}" style="background-color: #000B58; color: #ffffff; padding: 12px 28px; font-size: 13px; font-weight: bold; border-radius: 8px; text-decoration: none; display: inline-block;">
            Accéder à mon Espace Mandataire
          </a>
        </div>

        <p style="font-size: 11px; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 24px;">
          Centre de Tabulation Électoral (CDT) — Surveillance et intégrité du scrutin électoral.
        </p>
      </div>
    `;

    fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: cleanEmail,
        subject: `Vos identifiants d'accès • Espace Mandataire ${nomParti}`,
        html: credentialsEmailHtml,
      }),
    }).catch((err) =>
      console.error("Erreur lors de l'envoi des identifiants mandataire:", err)
    );

    setSuccessMessage(
      `Mandataire « ${cleanPrenom} ${cleanNom} » enregistré et activé avec succès. Ses identifiants de connexion ont été envoyés à ${cleanEmail}.`
    );
    setNom("");
    setPrenom("");
    setEmail("");
    setTelephone("");
    setPhotoUrl("");
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setBureauSelection("Non assigné");
    setCustomBureau("");
    setAdresse("");
    setNifCin("");
    setVille("");
    setPassword(generateRandomPassword());

    setTimeout(() => setSuccessMessage(null), 6000);
  };

  const handleResendActivation = async (m: Mandataire) => {
    if (!m.email) {
      setErrorMessage("Ce mandataire n'a pas d'adresse e-mail valide.");
      return;
    }
    setResendingId(m.id);
    setErrorMessage(null);

    try {
      let nomParti = currentUser?.tenantName || m.tenantName || "Parti Octacore";
      try {
        const storedUser = localStorage.getItem("cdt_current_user");
        if (storedUser) {
          const u = JSON.parse(storedUser);
          if (u.tenantName) nomParti = u.tenantName;
        }
      } catch (e) {}

      const loginUrl = `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/login`;

      const credentialsEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; border-bottom: 2px solid #000B58; padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #000B58; margin: 0; font-size: 20px; font-weight: 800;">Espace Mandataire Officiel</h2>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">${nomParti} • Accréditation Électorale</p>
          </div>

          <p style="font-size: 14px; color: #1e293b; line-height: 1.5;">
            Bonjour <strong>${m.prenom} ${m.nom}</strong>,
          </p>

          <p style="font-size: 13px; color: #334155; line-height: 1.6;">
            Voici vos identifiants d'accès sécurisés à votre Espace Mandataire officiel pour le scrutin électoral :
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 6px 0; font-size: 13px; color: #0f172a;">
              <strong>Identifiant (E-mail) :</strong> <span style="color: #000B58; font-weight: bold;">${m.email}</span>
            </p>
            <p style="margin: 6px 0; font-size: 13px; color: #0f172a;">
              <strong>Mot de passe d'accès :</strong> <span style="color: #000B58; font-weight: bold;">${m.password || "Mandataire2026$"}</span>
            </p>
            <p style="margin: 6px 0; font-size: 13px; color: #0f172a;">
              <strong>Bureau de vote assigné :</strong> <span>${m.bureauAssigne}</span>
            </p>
            <p style="margin: 6px 0; font-size: 13px; color: #0f172a;">
              <strong>Localisation :</strong> <span>${m.ville} (${m.departement})</span>
            </p>
          </div>

          <div style="text-align: center; margin: 28px 0;">
            <a href="${loginUrl}" style="background-color: #000B58; color: #ffffff; padding: 12px 28px; font-size: 13px; font-weight: bold; border-radius: 8px; text-decoration: none; display: inline-block;">
              Accéder à mon Espace Mandataire
            </a>
          </div>

          <p style="font-size: 11px; color: #64748b; line-height: 1.5; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 24px;">
            Centre de Tabulation Électoral (CDT) — Surveillance et intégrité du scrutin électoral.
          </p>
        </div>
      `;

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: m.email,
          subject: `Vos identifiants d'accès • Espace Mandataire ${nomParti}`,
          html: credentialsEmailHtml,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setSuccessMessage(`Identifiants renvoyés avec succès à ${m.email}.`);
      } else {
        setErrorMessage("L'envoi a rencontré une difficulté : " + (result.error || ""));
      }
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Échec du renvoi des identifiants.");
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = (id: string, fullName: string) => {
    if (confirm(`Confirmez-vous la suppression du mandataire ${fullName} ?`)) {
      const updated = mandataires.filter((m) => m.id !== id);
      setMandataires(updated);
      if (onDeleteMandataire) {
        onDeleteMandataire(id);
      }
      setSuccessMessage("Mandataire supprimé avec succès.");
      setTimeout(() => setSuccessMessage(null), 2500);
    }
  };

  const currentPartyName = useMemo(() => {
    let name = currentUser?.tenantName || "Parti Octacore";
    try {
      const storedUser = localStorage.getItem("cdt_current_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.tenantName) name = u.tenantName;
      }
    } catch (e) {}
    return name;
  }, [currentUser]);

  // EXPORT EXCEL (VERT SOLIDE)
  const handleExportExcel = () => {
    if (filteredMandataires.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    const headers = [
      "Nom",
      "Prénom",
      "Email",
      "Téléphone",
      "Bureau Assigné",
      "Département",
      "Ville",
      "NIF / CIN",
      "Adresse",
      "Statut",
      "Date d'enregistrement"
    ];

    const rows = filteredMandataires.map((m) => [
      `"${(m.nom || "").replace(/"/g, '""')}"`,
      `"${(m.prenom || "").replace(/"/g, '""')}"`,
      `"${(m.email || "").replace(/"/g, '""')}"`,
      `"${(m.telephone || "").replace(/"/g, '""')}"`,
      `"${(m.bureauAssigne || "").replace(/"/g, '""')}"`,
      `"${(m.departement || "").replace(/"/g, '""')}"`,
      `"${(m.ville || "").replace(/"/g, '""')}"`,
      `"${(m.nifCin || "").replace(/"/g, '""')}"`,
      `"${(m.adresse || "").replace(/"/g, '""')}"`,
      `"${m.statut === "actif" ? "Actif" : "En attente"}"`,
      `"${m.dateAffectation || ""}"`
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const safeParty = currentPartyName.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("download", `mandataires_${safeParty}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // EXPORT PDF (ROUGE)
  const handleExportPDF = () => {
    if (filteredMandataires.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Veuillez autoriser les fenêtres contextuelles pour exporter le PDF.");
      return;
    }

    const dateStr = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const rowsHtml = filteredMandataires
      .map(
        (m, idx) => `
        <tr>
          <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
          <td><strong>${m.prenom} ${m.nom}</strong><br><span style="font-size: 10px; color: #64748b;">${m.email || ""}</span></td>
          <td>${m.bureauAssigne || "Non assigné"}</td>
          <td>${m.telephone || "—"}</td>
          <td>${m.nifCin || "—"}</td>
          <td>${m.ville || "—"} (${m.departement || "—"})</td>
          <td>${m.adresse || "—"}</td>
          <td style="text-align: center;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; ${
              m.statut === "actif"
                ? "background: #dcfce7; color: #166534;"
                : "background: #fef3c7; color: #92400e;"
            }">
              ${m.statut === "actif" ? "Actif" : "En attente"}
            </span>
          </td>
        </tr>
      `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Liste des Mandataires - ${currentPartyName}</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 20px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 2px solid #000B58;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }
          .title {
            font-size: 20px;
            font-weight: 800;
            color: #000B58;
            margin: 0;
            letter-spacing: -0.5px;
          }
          .subtitle {
            font-size: 12px;
            color: #475569;
            margin-top: 4px;
            font-weight: 500;
          }
          .meta {
            text-align: right;
            font-size: 11px;
            color: #64748b;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }
          th {
            background-color: #f8fafc;
            color: #1e293b;
            font-weight: 700;
            text-align: left;
            padding: 8px 8px;
            border-top: 1px solid #cbd5e1;
            border-bottom: 1px solid #cbd5e1;
          }
          td {
            padding: 8px 8px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: middle;
          }
          tr:nth-child(even) {
            background-color: #fbfcfe;
          }
          .footer {
            margin-top: 24px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 8px;
          }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">RÉPERTOIRE OFFICIEL DES MANDATAIRES</h1>
            <div class="subtitle">${currentPartyName} • Total : ${filteredMandataires.length} mandataire(s)</div>
          </div>
          <div class="meta">
            <div>Document officiel généré le <strong>${dateStr}</strong></div>
            <div>Centre de Tabulation Électoral</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 25px; text-align: center;">N°</th>
              <th>Nom & Prénom</th>
              <th>Bureau assigné</th>
              <th>Téléphone</th>
              <th>NIF / CIN</th>
              <th>Département & Ville</th>
              <th>Adresse</th>
              <th style="width: 80px; text-align: center;">Statut</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div>Document certifié conforme • ${currentPartyName}</div>
          <div>Page 1 / 1</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const filteredMandataires = useMemo(() => {
    return mandataires.filter((m) => {
      const matchSearch =
        searchQuery === "" ||
        m.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.telephone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nifCin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.ville.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.departement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.bureauAssigne.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = filterDepartement === "all" || m.departement === filterDepartement;

      return matchSearch && matchDept;
    });
  }, [mandataires, searchQuery, filterDepartement]);

  return (
    <div className="w-full space-y-6 relative">
      {/* ALERTE ÉMERGEANT DU HAUT EN ROUGE SI MANDATAIRE DÉJÀ SÉLECTIONNÉ */}
      {topAlertMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-slide-down-alert flex items-center justify-between gap-4 px-6 py-4 bg-white border-2 border-red-500 text-red-600 rounded-2xl shadow-2xl max-w-lg w-[92%] sm:w-auto">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 bg-transparent" />
            <span className="font-bold text-sm tracking-tight text-red-600">
              {topAlertMessage}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setTopAlertMessage(null)}
            className="text-red-400 hover:text-red-700 bg-transparent p-1 transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-4 h-4 bg-transparent" />
          </button>
        </div>
      )}

      {/* 1. EN-TÊTE AVEC BOUTON ENREGISTRER EN VERT EN HAUT À DROITE */}
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Mandataires
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-xs cursor-pointer shrink-0"
        >
          {showForm ? (
            <>
              <X className="w-4 h-4 text-white" />
              <span>Fermer le formulaire</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 text-white" />
              <span>Enregistrer un mandataire</span>
            </>
          )}
        </button>
      </div>

      {/* Message de succès global (visible même si le formulaire est fermé) */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
          <span>{successMessage}</span>
        </div>
      )}

      {/* 2. FORMULAIRE AFFICHÉ LORS DU CLIC SUR LE BOUTON VERT */}
      {showForm && (
        <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-6 animate-in fade-in duration-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 bg-transparent" />
                <span>{errorMessage}</span>
              </div>
            )}

          {successMessage && (
            <div className="text-xs text-emerald-600 font-medium">
              {successMessage}
            </div>
          )}

          {/* Grille des encadrés : Ligne 1 */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 items-end">
            {/* 1. Photo d'identité */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Photo d'identité
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="mandataire-photo-upload"
                />
                <label
                  htmlFor="mandataire-photo-upload"
                  className="px-3 py-2 border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-all shadow-xs inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>{photoPreview ? "Modifier" : "Choisir photo"}</span>
                </label>
              </div>
            </div>

            {/* 2. Nom */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom de famille"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all"
              />
            </div>

            {/* 3. Prénom */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all"
              />
            </div>

            {/* 4. Adresse e-mail (Obligatoire pour la connexion) */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Adresse e-mail (Connexion) <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mandataire@domaine.com"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all"
              />
            </div>
          </div>

          {/* Grille des encadrés : Ligne 2 */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 5. Téléphone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Numéro de téléphone
              </label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="Numéro de téléphone"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all"
              />
            </div>

            {/* 6. Bureau assigné */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Bureau assigné
              </label>
              {bureauxList.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value={bureauSelection}
                    onChange={(e) => setBureauSelection(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all cursor-pointer"
                  >
                    <option value="Non assigné">Non assigné</option>
                    {bureauxList.map((b) => (
                      <option key={b.id} value={`${b.nom} (${b.ville})`}>
                        {b.nom} — {b.ville} {b.numero ? `[${b.numero}]` : ""}
                      </option>
                    ))}
                    <option value="custom">Saisie manuelle d'un bureau...</option>
                  </select>
                  {bureauSelection === "custom" && (
                    <input
                      type="text"
                      value={customBureau}
                      onChange={(e) => setCustomBureau(e.target.value)}
                      placeholder="Nom du bureau assigné"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#000B58]"
                    />
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={bureauSelection === "Non assigné" ? "" : bureauSelection}
                  onChange={(e) => setBureauSelection(e.target.value || "Non assigné")}
                  placeholder="Ex: École Nationale République d'Argentine"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all"
                />
              )}
            </div>

            {/* 7. Département */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Département <span className="text-red-500">*</span>
              </label>
              <select
                value={departement}
                onChange={(e) => setDepartement(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all cursor-pointer"
              >
                {DEPARTEMENTS_HAITI.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* 8. Ville */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Ville / Commune <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                placeholder="Ville ou commune"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all"
              />
            </div>
          </div>

          {/* Grille des encadrés : Ligne 3 (NIF/CIN, Adresse & Mot de passe) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 items-end">
            {/* 9. NIF / CIN */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                NIF / CIN
              </label>
              <input
                type="text"
                value={nifCin}
                onChange={(e) => setNifCin(e.target.value)}
                placeholder="NIF ou CIN"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all"
              />
            </div>

            {/* 10. Adresse de résidence */}
            <div className="lg:col-span-5 space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Adresse de résidence
              </label>
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Adresse complète"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all"
              />
            </div>

            {/* 11. Mot de passe d'accès */}
            <div className="lg:col-span-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900 block">
                  Mot de passe d'accès <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setPassword(generateRandomPassword())}
                  className="text-[10px] font-mono text-[#000B58] hover:underline cursor-pointer flex items-center gap-1"
                  title="Générer un nouveau mot de passe sécurisé"
                >
                  <RefreshCw className="w-3 h-3" />
                  Générer
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Défaut: Mandataire2026$"
                  className="w-full pl-9 pr-9 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  title={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {(nom || prenom || email || telephone || ville || adresse || nifCin || bureauSelection !== "Non assigné" || photoPreview) && (
              <button
                type="button"
                onClick={() => {
                  setNom("");
                  setPrenom("");
                  setEmail("");
                  setTelephone("");
                  setPhotoUrl("");
                  setPhotoPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                  setBureauSelection("Non assigné");
                  setCustomBureau("");
                  setAdresse("");
                  setNifCin("");
                  setVille("");
                  setPassword(generateRandomPassword());
                  setErrorMessage(null);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Effacer
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Fermer
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer hover:opacity-95 active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Enregistrer le mandataire</span>
            </button>
          </div>
        </form>
      </div>
      )}

      {/* 3. TABLEAU DES MANDATAIRES */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Barre de filtres et boutons d'export */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un mandataire..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#000B58]"
              />
            </div>

            <select
              value={filterDepartement}
              onChange={(e) => setFilterDepartement(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-[#000B58] cursor-pointer"
            >
              <option value="all">Tous les départements</option>
              {DEPARTEMENTS_HAITI.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Boutons d'exportation PDF (Rouge) et Excel (Vert solide) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportPDF}
              title="Exporter au format PDF"
              className="px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Export PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              title="Exporter sous format Excel"
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#107c41] hover:bg-[#0e6b37] active:scale-95 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-white" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Tableau */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs">
                <th className="py-3 px-4 font-semibold">Photo</th>
                <th className="py-3 px-4 font-semibold">Nom & Prénom</th>
                <th className="py-3 px-4 font-semibold">Bureau assigné</th>
                <th className="py-3 px-4 font-semibold">Téléphone</th>
                <th className="py-3 px-4 font-semibold">NIF / CIN</th>
                <th className="py-3 px-4 font-semibold">Département & Ville</th>
                <th className="py-3 px-4 font-semibold">Adresse</th>
                <th className="py-3 px-4 font-semibold">Statut</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMandataires.length > 0 ? (
                filteredMandataires.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      {m.photoUrl ? (
                        <img
                          src={m.photoUrl}
                          alt={`${m.prenom} ${m.nom}`}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                          {m.prenom?.[0] || ""}{m.nom?.[0] || ""}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{m.prenom} {m.nom}</div>
                      {m.email && (
                        <div className="text-[11px] text-slate-500 font-normal">{m.email}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {m.bureauAssigne}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {m.telephone || "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-[11px]">
                      {m.nifCin || "—"}
                    </td>
                    <td className="py-3 px-4">
                      {m.ville} ({m.departement})
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {m.adresse || "—"}
                    </td>
                    <td className="py-3 px-4">
                      {m.statut === "actif" ? (
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
                          Actif
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800">
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {m.email && (
                          <button
                            type="button"
                            onClick={() => handleResendActivation(m)}
                            disabled={resendingId === m.id}
                            title="Renvoyer les identifiants de connexion"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#000B58] hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {resendingId === m.id ? (
                              <RefreshCw className="w-4 h-4 animate-spin text-[#000B58]" />
                            ) : (
                              <Mail className="w-4 h-4 text-slate-500 hover:text-[#000B58]" />
                            )}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(m.id, `${m.prenom} ${m.nom}`)}
                          title="Supprimer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="text-xs text-slate-500">
                      Aucun mandataire trouvé.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
