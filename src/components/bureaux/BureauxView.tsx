"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  MapPin,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Hash,
  Users,
  ShieldAlert,
  Download,
  Filter,
  FileText,
  FileSpreadsheet,
  X,
} from "lucide-react";

export interface BureauDeVote {
  id: string;
  numero: string; // Facultatif
  nom: string; // Obligatoire
  ville: string; // Obligatoire
  adresse: string; // Adresse complète
  capaciteElecteurs: number; // Toujours 350 (base électorale 350)
  mandataireAssigne?: string;
  statut: "actif" | "en_attente";
  dateCreation: string;
}

// Données initiales réalistes pour alimenter le système
export const INITIAL_BUREAUX: BureauDeVote[] = [];

interface BureauxViewProps {
  bureauxList?: BureauDeVote[];
  onAddBureau?: (bureau: BureauDeVote) => void;
  onDeleteBureau?: (id: string) => void;
}

export default function BureauxView({
  bureauxList = INITIAL_BUREAUX,
  onAddBureau,
  onDeleteBureau,
}: BureauxViewProps = {}) {
  const [bureaux, setBureaux] = useState<BureauDeVote[]>(bureauxList);

  React.useEffect(() => {
    if (bureauxList) {
      setBureaux(bureauxList);
    }
  }, [bureauxList]);

  // Champs du formulaire
  const [nom, setNom] = useState("");
  const [ville, setVille] = useState("");
  const [adresse, setAdresse] = useState("");
  const [numero, setNumero] = useState("");

  // Gestion des erreurs et du message de confirmation
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Recherche et filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVille, setSelectedVille] = useState("all");
  const [showForm, setShowForm] = useState(false);

  // Liste unique des villes pour le filtre
  const uniqueVilles = useMemo(() => {
    const list = Array.from(new Set(bureaux.map((b) => b.ville).filter(Boolean)));
    return list.sort();
  }, [bureaux]);

  // Filtrage dynamique des bureaux
  const filteredBureaux = useMemo(() => {
    return bureaux.filter((b) => {
      const matchSearch =
        searchQuery === "" ||
        b.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.ville.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.adresse.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.numero.toLowerCase().includes(searchQuery.toLowerCase());

      const matchVille = selectedVille === "all" || b.ville === selectedVille;

      return matchSearch && matchVille;
    });
  }, [bureaux, searchQuery, selectedVille]);

  // Statistiques de la plateforme
  const totalBureaux = bureaux.length;
  const totalElecteursControles = totalBureaux * 350;
  const totalVilles = uniqueVilles.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation stricte des champs obligatoires
    const cleanNom = nom.trim();
    const cleanVille = ville.trim();
    const cleanAdresse = adresse.trim();
    const cleanNumero = numero.trim();

    if (!cleanNom) {
      setErrorMessage("Le nom du bureau de vote est obligatoire.");
      return;
    }

    if (!cleanVille) {
      setErrorMessage("La ville / commune du bureau de vote est obligatoire.");
      return;
    }

    const newBureau: BureauDeVote = {
      id: `bv-${Date.now()}`,
      numero: cleanNumero,
      nom: cleanNom,
      ville: cleanVille,
      adresse: cleanAdresse,
      capaciteElecteurs: 350,
      mandataireAssigne: "Non assigné",
      statut: "actif",
      dateCreation: new Date().toLocaleDateString("fr-FR"),
    };

    const updated = [newBureau, ...bureaux];
    setBureaux(updated);
    if (onAddBureau) {
      onAddBureau(newBureau);
    }
    setSuccessMessage(
      `Le bureau « ${cleanNom} » (${cleanVille}) a été enregistré avec succès.`
    );

    // Réinitialisation des champs du formulaire
    setNom("");
    setVille("");
    setAdresse("");
    setNumero("");

    // Disparition du message de succès après 4 secondes
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  const handleDeleteBureau = (id: string, bureauNom: string) => {
    if (confirm(`Confirmez-vous la suppression du bureau « ${bureauNom} » ?`)) {
      const updated = bureaux.filter((b) => b.id !== id);
      setBureaux(updated);
      if (onDeleteBureau) {
        onDeleteBureau(id);
      }
      setSuccessMessage(`Le bureau « ${bureauNom} » a été supprimé.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleExportExcel = () => {
    if (filteredBureaux.length === 0) {
      alert("Aucun bureau de vote à exporter.");
      return;
    }

    const headers = [
      "Code / N°",
      "Nom du bureau",
      "Ville / Commune",
      "Adresse",
      "Norme Inscrits",
      "Mandataire Assigné",
      "Statut",
      "Date d'enregistrement",
    ];

    const rows = filteredBureaux.map((b) => [
      `"${(b.numero || "Non défini").replace(/"/g, '""')}"`,
      `"${b.nom.replace(/"/g, '""')}"`,
      `"${b.ville.replace(/"/g, '""')}"`,
      `"${(b.adresse || "Non renseignée").replace(/"/g, '""')}"`,
      `"${b.capaciteElecteurs} électeurs"`,
      `"${(b.mandataireAssigne || "Non assigné").replace(/"/g, '""')}"`,
      `"${b.statut === "actif" ? "Actif" : "En attente"}"`,
      `"${b.dateCreation}"`,
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
    link.setAttribute("download", `bureaux_de_vote_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (filteredBureaux.length === 0) {
      alert("Aucun bureau de vote à exporter.");
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

    const rowsHtml = filteredBureaux
      .map(
        (b, i) => `
        <tr>
          <td style="text-align: center; color: #64748b; font-weight: 600;">${i + 1}</td>
          <td style="font-weight: 700; color: #0f172a;">${b.numero || "—"}</td>
          <td style="font-weight: 600; color: #000B58;">${b.nom}</td>
          <td>${b.ville}</td>
          <td style="color: #475569;">${b.adresse || "—"}</td>
          <td style="text-align: center; font-weight: 600;">${b.capaciteElecteurs}</td>
          <td>${b.mandataireAssigne || "Non assigné"}</td>
        </tr>
      `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Liste Officielle des Bureaux de Vote</title>
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
          .stats-strip {
            display: flex;
            gap: 20px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 16px;
            margin-bottom: 16px;
            font-size: 11px;
          }
          .stats-strip strong { color: #000B58; }
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
            <h1 class="title">RÉPERTOIRE OFFICIEL DES BUREAUX DE VOTE</h1>
            <div class="subtitle">Centre de Tabulation Électoral • Surveillance & Déploiement</div>
          </div>
          <div class="meta">
            <div>Document extrait le <strong>${dateStr}</strong></div>
            <div>Total : <strong>${filteredBureaux.length} bureau(x)</strong></div>
          </div>
        </div>

        <div class="stats-strip">
          <div>Total des bureaux : <strong>${filteredBureaux.length}</strong></div>
          <div>Capacité électorale couverte : <strong>${(filteredBureaux.length * 350).toLocaleString("fr-FR")} électeurs (base 350/BV)</strong></div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 25px; text-align: center;">N°</th>
              <th style="width: 80px;">Code / N°</th>
              <th>Nom du bureau de vote</th>
              <th style="width: 140px;">Ville / Commune</th>
              <th>Adresse</th>
              <th style="width: 75px; text-align: center;">Capacité</th>
              <th style="width: 160px;">Mandataire assigné</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div>Document certifié conforme pour la supervision électorale</div>
          <div>Centre de Tabulation Électoral</div>
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

  return (
    <div className="w-full space-y-6">
      {/* 1. EN-TÊTE AVEC BOUTON ENREGISTRER EN VERT EN HAUT À DROITE */}
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Bureaux de vote
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
              <span>Enregistrer un bureau</span>
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

      {/* 2. STATISTIQUES EN PLEINE LARGEUR */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              Bureaux enregistrés
            </span>
            <Building2 className="w-4 h-4 text-[#000B58]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {totalBureaux}
            </span>
            <span className="text-xs text-slate-500">centres</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              Villes & Communes
            </span>
            <MapPin className="w-4 h-4 text-[#000B58]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {totalVilles}
            </span>
            <span className="text-xs text-slate-500">zones</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              Capacité électorale (Base 350)
            </span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">
              {totalElecteursControles.toLocaleString("fr-FR")}
            </span>
            <span className="text-xs text-slate-500">électeurs max</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">
              Mandataires à déployer
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">
              {totalBureaux}
            </span>
            <span className="text-xs text-slate-500">titulaires (1/BV)</span>
          </div>
        </div>
      </div>

      {/* 3. FORMULAIRE D'ENREGISTREMENT AFFICHÉ LORS DU CLIC SUR LE BOUTON VERT */}
      {showForm && (
        <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden animate-in fade-in duration-200">
          {/* Corps du formulaire */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Notifications Toast / Alertes */}
            {errorMessage && (
              <div className="w-full text-red-600 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Grille sur toute la largeur (4 colonnes) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* 1. NOM DU BUREAU (OBLIGATOIRE) */}
              <div className="lg:col-span-4 space-y-1.5">
                <label className="text-xs font-semibold text-slate-900 block">
                  Nom du bureau de vote <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: École Nationale République d'Argentine"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all shadow-xs"
                />
              </div>

              {/* 2. VILLE / COMMUNE (OBLIGATOIRE) */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-900 block">
                  Ville / Commune <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  placeholder="Ex: Port-au-Prince, Delmas, Cap-Haïtien..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all shadow-xs"
                />
              </div>

              {/* 3. ADRESSE (CHAMP D'ADRESSE) */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-slate-900 block">
                  Adresse complète
                </label>
                <input
                  type="text"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  placeholder="Ex: Rue Capois, Angle Rue Oswald Durand"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all shadow-xs"
                />
              </div>

              {/* 4. NUMÉRO DU BUREAU (FACULTATIF) */}
              <div className="lg:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-900 block">
                  Numéro / Code
                </label>
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="Ex: BV-042 (optionnel)"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Pied du formulaire avec bouton d'enregistrement */}
            <div className="pt-2 flex items-center justify-end gap-3">
              {(nom || ville || adresse || numero) && (
                <button
                  type="button"
                  onClick={() => {
                    setNom("");
                    setVille("");
                    setAdresse("");
                    setNumero("");
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
                <span>Enregistrer le bureau</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. TABLEAU DES BUREAUX ENREGISTRÉS SUR TOUTE LA LARGEUR */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Barre d'outils, filtre et recherche */}
        <div className="p-4 bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un bureau de vote..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#000B58]"
              />
            </div>

            {/* Sélecteur de ville */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedVille}
                onChange={(e) => setSelectedVille(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-[#000B58] cursor-pointer"
              >
                <option value="all">Toutes les villes ({totalBureaux})</option>
                {uniqueVilles.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
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

        {/* Tableau Responsive */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs">
                <th className="py-3 px-4 font-semibold">Code / N°</th>
                <th className="py-3 px-4 font-semibold">Nom du bureau</th>
                <th className="py-3 px-4 font-semibold">Ville / Commune</th>
                <th className="py-3 px-4 font-semibold">Adresse</th>
                <th className="py-3 px-4 font-semibold text-center">Norme Inscrits</th>
                <th className="py-3 px-4 font-semibold">Mandataire (350)</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBureaux.length > 0 ? (
                filteredBureaux.map((bureau) => (
                  <tr
                    key={bureau.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    {/* Numéro ou code */}
                    <td className="py-3 px-4 font-semibold">
                      {bureau.numero ? (
                        <span className="font-bold text-slate-900">
                          {bureau.numero}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">
                          Non défini
                        </span>
                      )}
                    </td>

                    {/* Nom du bureau */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400 group-hover:text-[#000B58] transition-colors shrink-0" />
                        <span>{bureau.nom}</span>
                      </div>
                    </td>

                    {/* Ville */}
                    <td className="py-3 px-4 text-slate-800 font-medium">
                      {bureau.ville}
                    </td>

                    {/* Adresse */}
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {bureau.adresse ? (
                        bureau.adresse
                      ) : (
                        <span className="text-slate-400 italic">Non renseignée</span>
                      )}
                    </td>

                    {/* Norme 350 */}
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {bureau.capaciteElecteurs} électeurs
                    </td>

                    {/* Mandataire */}
                    <td className="py-3 px-4 text-slate-600">
                      {bureau.mandataireAssigne}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteBureau(bureau.id, bureau.nom)}
                        title="Supprimer ce bureau de vote"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-xs text-slate-600">
                      Aucun bureau de vote enregistré pour le moment.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Remplissez le formulaire ci-dessus pour ajouter le premier bureau de vote.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pied de tableau avec récapitulatif légal */}
        <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 font-medium gap-2">
          <span>
            Calibrage légal du scrutin : 1 bureau = 350 électeurs = 1 mandataire titulaire.
          </span>
          <span className="text-slate-500">
            Total sous surveillance : <strong className="text-slate-900">{totalElecteursControles.toLocaleString("fr-FR")} électeurs</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
