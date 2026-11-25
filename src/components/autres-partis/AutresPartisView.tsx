"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Flag,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Building2,
  Quote,
  Shield,
  Layers,
  FileText,
  FileSpreadsheet,
  X,
} from "lucide-react";

export interface AutreParti {
  id: string;
  nom: string; // Obligatoire
  slogan: string;
  logoUrl?: string; // Logo du parti (URL ou image prévisualisée)
  sigle?: string;
  dateEnregistrement: string;
  statut: "actif" | "enregistre";
}

export const INITIAL_AUTRES_PARTIS: AutreParti[] = [];

interface AutresPartisViewProps {
  partisList?: AutreParti[];
  onAddParti?: (parti: AutreParti) => void;
  onDeleteParti?: (id: string) => void;
}

export default function AutresPartisView({
  partisList = INITIAL_AUTRES_PARTIS,
  onAddParti,
  onDeleteParti,
}: AutresPartisViewProps) {
  const [partis, setPartis] = useState<AutreParti[]>(partisList);

  // Formulaire
  const [nom, setNom] = useState("");
  const [slogan, setSlogan] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronisation si la liste parente change
  React.useEffect(() => {
    if (partisList) {
      setPartis(partisList);
    }
  }, [partisList]);

  // Gestion du téléversement d'image logo
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("Le logo est trop lourd (maximum 2 Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setLogoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanNom = nom.trim();
    const cleanSlogan = slogan.trim();

    if (!cleanNom) {
      setErrorMessage("Le nom du parti est obligatoire.");
      return;
    }

    // Déduction d'un sigle court à partir des initiales si pas de logo
    const sigle =
      cleanNom
        .split(" ")
        .filter((w) => w.length > 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 4) || cleanNom.slice(0, 3).toUpperCase();

    const newParti: AutreParti = {
      id: `autre-parti-${Date.now()}`,
      nom: cleanNom,
      slogan: cleanSlogan || "Aucun slogan renseigné",
      logoUrl: logoPreview || logoUrl.trim() || undefined,
      sigle: sigle,
      dateEnregistrement: new Date().toLocaleDateString("fr-FR"),
      statut: "enregistre",
    };

    const updated = [newParti, ...partis];
    setPartis(updated);
    if (onAddParti) {
      onAddParti(newParti);
    }

    setSuccessMessage(`Le parti « ${cleanNom} » a été enregistré dans le système.`);

    // Réinitialisation
    setNom("");
    setSlogan("");
    setLogoUrl("");
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  const handleDelete = (id: string, partiNom: string) => {
    if (confirm(`Confirmez-vous la suppression du parti « ${partiNom} » du répertoire ?`)) {
      const updated = partis.filter((p) => p.id !== id);
      setPartis(updated);
      if (onDeleteParti) {
        onDeleteParti(id);
      }
      setSuccessMessage(`Le parti « ${partiNom} » a été retiré.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleExportExcel = () => {
    if (filteredPartis.length === 0) {
      alert("Aucun parti politique à exporter.");
      return;
    }

    const headers = [
      "Nom du parti",
      "Sigle",
      "Slogan",
      "Date d'enregistrement",
      "Statut",
    ];

    const rows = filteredPartis.map((p) => [
      `"${p.nom.replace(/"/g, '""')}"`,
      `"${(p.sigle || "").replace(/"/g, '""')}"`,
      `"${(p.slogan || "").replace(/"/g, '""')}"`,
      `"${p.dateEnregistrement}"`,
      `"${p.statut === "actif" ? "Actif" : "Enregistré"}"`,
    ]);

    const csvContent =
      "\uFEFF" +
      headers.join(";") +
      "\n" +
      rows.map((row) => row.join(";")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `formations_politiques_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (filteredPartis.length === 0) {
      alert("Aucun parti politique à exporter.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Veuillez autoriser les fenêtres pop-up pour afficher l'export PDF.");
      return;
    }

    const dateStr = new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const rowsHtml = filteredPartis
      .map(
        (p, i) => `
        <tr>
          <td style="text-align: center; color: #64748b; font-weight: 600;">${i + 1}</td>
          <td style="font-weight: 700; color: #0f172a;">${p.nom}</td>
          <td style="font-weight: 600; color: #000B58; text-align: center;">${p.sigle || "—"}</td>
          <td style="color: #475569; font-style: italic;">${p.slogan || "—"}</td>
          <td style="text-align: center; color: #64748b;">${p.dateEnregistrement}</td>
          <td style="text-align: center; font-weight: 600; color: #166534;">Enregistré</td>
        </tr>
      `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Répertoire Officiel des Formations Politiques</title>
        <style>
          @page { size: A4 landscape; margin: 15mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 20px;
            font-size: 11px;
            line-height: 1.4;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #000B58;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .title { font-size: 18px; font-weight: 800; color: #000B58; margin: 0; }
          .subtitle { font-size: 12px; color: #475569; margin-top: 3px; font-weight: 500; }
          .meta { text-align: right; font-size: 10px; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th {
            background-color: #f1f5f9;
            color: #1e293b;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 0.5px;
            padding: 9px 8px;
            border: 1px solid #cbd5e1;
            text-align: left;
          }
          td {
            padding: 8px;
            border: 1px solid #e2e8f0;
            font-size: 10.5px;
          }
          tr:nth-child(even) td { background-color: #f8fafc; }
          .footer {
            margin-top: 25px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #64748b;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">RÉPERTOIRE DES FORMATIONS POLITIQUES CONCURRENTES</h1>
            <div class="subtitle">Centre de Tabulation Électoral • Suivi des Partis & Candidats</div>
          </div>
          <div class="meta">
            <div>Document officiel généré le <strong>${dateStr}</strong></div>
            <div>Total formations enregistrées : <strong>${filteredPartis.length}</strong></div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 25px; text-align: center;">N°</th>
              <th>Nom de la formation politique</th>
              <th style="width: 100px; text-align: center;">Sigle</th>
              <th>Slogan officiel</th>
              <th style="width: 130px; text-align: center;">Date d'enregistrement</th>
              <th style="width: 90px; text-align: center;">Statut</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div>Document certifié conforme • Centre de Tabulation Électoral</div>
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

  const filteredPartis = useMemo(() => {
    return partis.filter((p) => {
      return (
        searchQuery === "" ||
        p.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slogan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sigle && p.sigle.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [partis, searchQuery]);

  return (
    <div className="w-full space-y-6">
      {/* 1. EN-TÊTE AVEC BOUTON ENREGISTRER EN VERT EN HAUT À DROITE */}
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Autres partis
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
              <span>Enregistrer un parti</span>
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

      {/* 2. FORMULAIRE D'ENREGISTREMENT AFFICHÉ LORS DU CLIC SUR LE BOUTON VERT */}
      {showForm && (
        <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden animate-in fade-in duration-200">
          {/* Corps du formulaire */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errorMessage && (
              <div className="w-full text-red-600 text-xs font-medium">
                {errorMessage}
              </div>
            )}

          {/* Grille sur toute la largeur (12 colonnes) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* 1. LOGO DU PARTI (Col 1-3) */}
            <div className="md:col-span-3 space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Logo du parti
              </label>

              <div className="flex items-center gap-3">
                {/* Boîte de prévisualisation du logo */}
                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo aperçu"
                      className="w-full h-full object-cover"
                    />
                  ) : logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo aperçu"
                      className="w-full h-full object-cover"
                      onError={() => setLogoUrl("")}
                    />
                  ) : (
                    <div className="text-center p-1">
                      <ImageIcon className="w-5 h-5 mx-auto text-slate-400" />
                      <span className="text-[9px] text-slate-400 block mt-0.5">
                        Aucun logo
                      </span>
                    </div>
                  )}
                </div>

                {/* Bouton de sélection de fichier */}
                <div className="flex-1 space-y-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="party-logo-upload"
                  />
                  <label
                    htmlFor="party-logo-upload"
                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Choisir un logo</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 2. NOM DU PARTI (Col 4-7) - OBLIGATOIRE */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Nom du parti <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Nom officiel du parti"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all shadow-xs"
              />
            </div>

            {/* 3. SLOGAN DU PARTI (Col 8-12) */}
            <div className="md:col-span-4 space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Slogan du parti
              </label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="Ex: Slogan de campagne"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Pied du formulaire */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {(nom || slogan || logoPreview || logoUrl) && (
              <button
                type="button"
                onClick={() => {
                  setNom("");
                  setSlogan("");
                  setLogoUrl("");
                  setLogoPreview(null);
                  setErrorMessage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
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
              <span>Enregistrer le parti</span>
            </button>
          </div>
        </form>
      </div>
      )}

      {/* 3. TABLEAU DES AUTRES PARTIS SUR TOUTE LA LARGEUR */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Barre de recherche et boutons d'export */}
        <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un parti politique..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#000B58]"
            />
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
                <th className="py-3 px-4 font-semibold">Logo</th>
                <th className="py-3 px-4 font-semibold">Nom du parti</th>
                <th className="py-3 px-4 font-semibold">Slogan</th>
                <th className="py-3 px-4 font-semibold">Date d'enregistrement</th>
                <th className="py-3 px-4 font-semibold text-center">Statut</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPartis.length > 0 ? (
                filteredPartis.map((parti) => (
                  <tr
                    key={parti.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    {/* Logo ou avatar initiales */}
                    <td className="py-3 px-4">
                      {parti.logoUrl ? (
                        <img
                          src={parti.logoUrl}
                          alt={parti.nom}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg border border-slate-300 bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                          {parti.sigle || parti.nom.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </td>

                    {/* Nom du parti */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{parti.nom}</span>
                        {parti.sigle && (
                          <span className="text-xs text-slate-500 font-normal">
                            ({parti.sigle})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Slogan */}
                    <td className="py-3 px-4 text-slate-600 italic max-w-md">
                      <div className="flex items-center gap-1.5">
                        <Quote className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{parti.slogan}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-500">
                      {parti.dateEnregistrement}
                    </td>

                    {/* Statut */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800">
                        Enregistré
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(parti.id, parti.nom)}
                        title="Retirer ce parti"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Flag className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-xs text-slate-600">
                      Aucun parti politique enregistré pour le moment.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Enregistrez un nouveau parti politique ci-dessus.
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
