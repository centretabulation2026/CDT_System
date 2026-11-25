"use client";

import React, { useState, useMemo, useRef } from "react";
import { Plus, Trash2, Search, User, Upload, FileText, FileSpreadsheet, CheckCircle2, X } from "lucide-react";

export interface MembreParti {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  photoUrl?: string;
  telephone: string;
  role: string;
  adresse: string;
  nifCin: string;
  departement: string;
  ville: string;
  dateAdhesion: string;
  statut: "actif" | "inactif";
  password?: string;
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

export const ROLES_PARTI = [
  "PDG du Parti",
  "Secrétaire Général",
  "Coordonnateur Départemental",
  "Coordonnateur Communal",
  "Responsable Juridique",
  "Responsable Communication",
  "Trésorier / Finances",
  "Responsable Mobilisation",
  "Délégué de terrain",
  "Militant / Adhérent",
];

export const INITIAL_MEMBRES: MembreParti[] = [];

interface MembersViewProps {
  membresList?: MembreParti[];
  onAddMembre?: (membre: MembreParti) => void;
  onDeleteMembre?: (id: string) => void;
}

export default function MembersView({
  membresList = INITIAL_MEMBRES,
  onAddMembre,
  onDeleteMembre,
}: MembersViewProps) {
  const [membres, setMembres] = useState<MembreParti[]>(membresList);

  // Formulaire : Champs avec photo d'identité
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [role, setRole] = useState(ROLES_PARTI[0]);
  const [adresse, setAdresse] = useState("");
  const [nifCin, setNifCin] = useState("");
  const [departement, setDepartement] = useState(DEPARTEMENTS_HAITI[0]);
  const [ville, setVille] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartement, setFilterDepartement] = useState("all");
  const [filterRole, setFilterRole] = useState("all");
  const [showForm, setShowForm] = useState(false);

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

  React.useEffect(() => {
    if (membresList) {
      setMembres(membresList);
    }
  }, [membresList]);

  const handleSubmit = (e: React.FormEvent) => {
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

    if (!cleanNom || !cleanPrenom || !cleanVille || !cleanEmail) {
      setErrorMessage("Veuillez remplir les champs obligatoires (*) incluant l'adresse e-mail.");
      return;
    }

    const newMembre: MembreParti = {
      id: `membre-${Date.now()}`,
      nom: cleanNom,
      prenom: cleanPrenom,
      email: cleanEmail,
      photoUrl: photoPreview || photoUrl || undefined,
      telephone: cleanTel,
      role: role,
      adresse: cleanAdresse,
      nifCin: cleanNifCin,
      departement: departement,
      ville: cleanVille,
      dateAdhesion: new Date().toLocaleDateString("fr-FR"),
      statut: "actif",
    };

    const updated = [newMembre, ...membres];
    setMembres(updated);
    if (onAddMembre) {
      onAddMembre(newMembre);
    }

    setSuccessMessage(
      `Membre « ${cleanPrenom} ${cleanNom} » enregistré au registre du parti avec succès ! Pour lui attribuer un accès sécurisé au système, configurez ses accès dans l'onglet « Gestion des accès ».`
    );
    setNom("");
    setPrenom("");
    setEmail("");
    setTelephone("");
    setPhotoUrl("");
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setRole(ROLES_PARTI[0]);
    setAdresse("");
    setNifCin("");
    setVille("");

    setTimeout(() => setSuccessMessage(null), 6000);
  };

  const handleDelete = (id: string, fullName: string) => {
    if (confirm(`Confirmez-vous la suppression de « ${fullName} » ?`)) {
      const updated = membres.filter((m) => m.id !== id);
      setMembres(updated);
      if (onDeleteMembre) {
        onDeleteMembre(id);
      }
      setSuccessMessage(`Membre retiré.`);
      setTimeout(() => setSuccessMessage(null), 2500);
    }
  };

  const handleExportExcel = () => {
    if (filteredMembres.length === 0) {
      alert("Aucun membre à exporter.");
      return;
    }

    const headers = [
      "Nom",
      "Prénom",
      "Rôle",
      "Adresse e-mail",
      "Téléphone",
      "NIF / CIN",
      "Département",
      "Ville / Commune",
      "Adresse",
      "Date d'adhésion",
      "Statut",
    ];

    const rows = filteredMembres.map((m) => [
      `"${m.nom.replace(/"/g, '""')}"`,
      `"${m.prenom.replace(/"/g, '""')}"`,
      `"${m.role.replace(/"/g, '""')}"`,
      `"${(m.email || "").replace(/"/g, '""')}"`,
      `"${(m.telephone || "").replace(/"/g, '""')}"`,
      `"${(m.nifCin || "").replace(/"/g, '""')}"`,
      `"${m.departement.replace(/"/g, '""')}"`,
      `"${m.ville.replace(/"/g, '""')}"`,
      `"${(m.adresse || "").replace(/"/g, '""')}"`,
      `"${m.dateAdhesion}"`,
      `"${m.statut === "actif" ? "Actif" : "Inactif"}"`,
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
    link.setAttribute("download", `membres_du_parti_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    if (filteredMembres.length === 0) {
      alert("Aucun membre à exporter.");
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

    const rowsHtml = filteredMembres
      .map(
        (m, i) => `
        <tr>
          <td style="text-align: center; color: #64748b; font-weight: 600;">${i + 1}</td>
          <td style="font-weight: 700; color: #0f172a;">${m.prenom} ${m.nom}</td>
          <td style="font-weight: 600; color: #000B58;">${m.role}</td>
          <td>${m.email || "—"}</td>
          <td>${m.telephone || "—"}</td>
          <td style="color: #475569;">${m.nifCin || "—"}</td>
          <td>${m.ville} (${m.departement})</td>
          <td style="color: #475569;">${m.adresse || "—"}</td>
          <td style="text-align: center; font-weight: 600; color: #166534;">Actif</td>
        </tr>
      `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Registre Officiel des Membres du Parti</title>
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
            <h1 class="title">REGISTRE OFFICIEL DES MEMBRES</h1>
            <div class="subtitle">Organisation & Direction Politique</div>
          </div>
          <div class="meta">
            <div>Document officiel généré le <strong>${dateStr}</strong></div>
            <div>Total membres inscrits : <strong>${filteredMembres.length}</strong></div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 25px; text-align: center;">N°</th>
              <th>Nom & Prénom</th>
              <th style="width: 140px;">Rôle</th>
              <th>Adresse e-mail</th>
              <th style="width: 95px;">Téléphone</th>
              <th style="width: 85px;">NIF / CIN</th>
              <th style="width: 130px;">Département & Ville</th>
              <th>Adresse</th>
              <th style="width: 60px; text-align: center;">Statut</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div>Document certifié conforme • Registre politique</div>
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

  const filteredMembres = useMemo(() => {
    return membres.filter((m) => {
      const matchSearch =
        searchQuery === "" ||
        m.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        m.telephone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.nifCin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.ville.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.departement.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = filterDepartement === "all" || m.departement === filterDepartement;
      const matchRole = filterRole === "all" || m.role === filterRole;

      return matchSearch && matchDept && matchRole;
    });
  }, [membres, searchQuery, filterDepartement, filterRole]);

  return (
    <div className="w-full space-y-6">
      {/* 1. EN-TÊTE AVEC BOUTON ENREGISTRER EN VERT EN HAUT À DROITE */}
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Membres du parti
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
              <span>Enregistrer un membre</span>
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
              <div className="text-xs text-red-600 font-medium">
                {errorMessage}
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
                  id="member-photo-upload"
                />
                <label
                  htmlFor="member-photo-upload"
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
                placeholder="membre@domaine.com"
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

            {/* 6. Rôle au sein du parti */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Rôle au sein du parti <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all cursor-pointer"
              >
                {ROLES_PARTI.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
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

          {/* Grille des encadrés : Ligne 3 (NIF/CIN, Mot de passe, Adresse de résidence) */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
            {/* 9. NIF / CIN */}
            <div className="lg:col-span-4 space-y-1.5">
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
            <div className="lg:col-span-8 space-y-1.5">
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
          </div>

          {/* Boutons d'action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {(nom || prenom || email || telephone || ville || adresse || nifCin) && (
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
                  setRole(ROLES_PARTI[0]);
                  setAdresse("");
                  setNifCin("");
                  setVille("");
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
              <span>Enregistrer le membre</span>
            </button>
          </div>
        </form>
      </div>
      )}

      {/* 3. TABLEAU DES MEMBRES */}
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
                placeholder="Rechercher un membre..."
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

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-[#000B58] cursor-pointer"
            >
              <option value="all">Tous les rôles</option>
              {ROLES_PARTI.map((r) => (
                <option key={r} value={r}>
                  {r}
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
                <th className="py-3 px-4 font-semibold">Rôle</th>
                <th className="py-3 px-4 font-semibold">Téléphone</th>
                <th className="py-3 px-4 font-semibold">NIF / CIN</th>
                <th className="py-3 px-4 font-semibold">Département & Ville</th>
                <th className="py-3 px-4 font-semibold">Adresse</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMembres.length > 0 ? (
                filteredMembres.map((membre) => (
                  <tr key={membre.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      {membre.photoUrl ? (
                        <img
                          src={membre.photoUrl}
                          alt={`${membre.prenom} ${membre.nom}`}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full border border-slate-300 bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                          {membre.prenom?.[0] || ""}{membre.nom?.[0] || ""}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{membre.prenom} {membre.nom}</div>
                      {membre.email && (
                        <div className="text-[11px] text-slate-500 font-normal">{membre.email}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {membre.role}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {membre.telephone || "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-[11px]">
                      {membre.nifCin || "—"}
                    </td>
                    <td className="py-3 px-4">
                      {membre.ville} ({membre.departement})
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {membre.adresse || "—"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(membre.id, `${membre.prenom} ${membre.nom}`)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-xs text-slate-500">
                      Aucun membre enregistré pour le moment.
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
