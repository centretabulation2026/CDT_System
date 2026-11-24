"use client";

import React, { useState, useMemo, useRef } from "react";
import { Plus, Trash2, Search, User, Upload, CheckCircle2, Clock, Mail, Send, RefreshCw } from "lucide-react";
import { BureauDeVote } from "@/components/bureaux/BureauxView";
import { generateMandataireActivationEmailHtml } from "@/lib/emailTemplates";

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
  onAddMandataire?: (mandataire: Mandataire) => void;
  onDeleteMandataire?: (id: string) => void;
}

export default function MandatairesView({
  mandatairesList = INITIAL_MANDATAIRES,
  bureauxList = [],
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

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartement, setFilterDepartement] = useState("all");

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

    const assignedBureauFinal =
      bureauSelection === "custom"
        ? customBureau.trim() || "Non assigné"
        : bureauSelection;

    const activationToken =
      "mnd-" + Math.random().toString(36).substring(2) + Date.now().toString(36);

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
      statut: "en_attente",
      activationToken: activationToken,
    };

    const updated = [newMandataire, ...mandataires];
    setMandataires(updated);
    if (onAddMandataire) {
      onAddMandataire(newMandataire);
    }

    // Récupération du nom du parti pour l'e-mail
    let nomParti = "Parti Démocratique Uni";
    try {
      const storedUser = localStorage.getItem("cdt_current_user");
      if (storedUser) {
        const u = JSON.parse(storedUser);
        if (u.tenantName) nomParti = u.tenantName;
      }
    } catch (e) {}

    // Envoi automatique de l'e-mail d'activation avec lien sécurisé
    const activationUrl = `${
      typeof window !== "undefined" ? window.location.origin : ""
    }/activation?token=${activationToken}&type=mandataire`;

    const emailHtml = generateMandataireActivationEmailHtml({
      nomParti,
      prenom: cleanPrenom,
      nom: cleanNom,
      bureauAssigne: assignedBureauFinal,
      departement,
      ville: cleanVille,
      email: cleanEmail,
      activationUrl,
    });

    fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: cleanEmail,
        subject: `Activation de votre Espace Mandataire • ${nomParti}`,
        html: emailHtml,
      }),
    }).catch((err) =>
      console.error("Erreur lors de l'envoi de l'e-mail d'activation:", err)
    );

    setSuccessMessage(
      `Mandataire « ${cleanPrenom} ${cleanNom} » enregistré avec succès ! Un e-mail d'activation a été automatiquement envoyé à ${cleanEmail} avec le lien pour définir son mot de passe.`
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
      let nomParti = "Parti Démocratique Uni";
      try {
        const storedUser = localStorage.getItem("cdt_current_user");
        if (storedUser) {
          const u = JSON.parse(storedUser);
          if (u.tenantName) nomParti = u.tenantName;
        }
      } catch (e) {}

      // Utiliser le jeton existant ou en créer un nouveau
      const token =
        m.activationToken ||
        `mnd-${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;

      if (!m.activationToken) {
        const updated = mandataires.map((item) =>
          item.id === m.id ? { ...item, activationToken: token } : item
        );
        setMandataires(updated);
        try {
          localStorage.setItem("cdt_mandataires", JSON.stringify(updated));
        } catch (e) {}
      }

      const activationUrl = `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/activation?token=${token}&type=mandataire`;

      const emailHtml = generateMandataireActivationEmailHtml({
        nomParti,
        prenom: m.prenom,
        nom: m.nom,
        bureauAssigne: m.bureauAssigne,
        departement: m.departement,
        ville: m.ville,
        email: m.email,
        activationUrl,
      });

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: m.email,
          subject: `Rappel : Activation de votre Espace Mandataire • ${nomParti}`,
          html: emailHtml,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setSuccessMessage(`E-mail d'activation renvoyé avec succès à ${m.email}.`);
      } else {
        setErrorMessage("L'envoi a rencontré une difficulté : " + (result.error || ""));
      }
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Échec du renvoi de l'e-mail d'activation.");
    } finally {
      setResendingId(null);
    }
  };

  const handleDelete = (id: string, fullName: string) => {
    if (confirm(`Confirmez-vous la suppression du mandataire « ${fullName} » ?`)) {
      const updated = mandataires.filter((m) => m.id !== id);
      setMandataires(updated);
      if (onDeleteMandataire) {
        onDeleteMandataire(id);
      }
      setSuccessMessage(`Mandataire retiré.`);
      setTimeout(() => setSuccessMessage(null), 2500);
    }
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
    <div className="w-full space-y-6">
      {/* 1. EN-TÊTE ÉPURÉ */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Mandataires
        </h1>
      </div>

      {/* 2. FORMULAIRE PLEINE LARGEUR ÉPURÉ - IDENTIQUE AUX MEMBRES */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="text-xs text-red-600 font-medium">
              {errorMessage}
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
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all font-mono"
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

          {/* Grille des encadrés : Ligne 3 (NIF/CIN & Adresse de résidence) */}
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
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all font-mono"
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
                  setErrorMessage(null);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Effacer
              </button>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer hover:opacity-95 active:scale-95 shadow-sm"
              style={{ backgroundColor: "#000B58" }}
            >
              <Plus className="w-4 h-4" />
              <span>Enregistrer le mandataire</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. TABLEAU DES MANDATAIRES */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Barre de filtres */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, bureau, téléphone, NIF/CIN..."
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

          <div className="text-xs font-mono text-slate-500">
            Affichage : <strong className="text-slate-800">{filteredMandataires.length}</strong> sur {mandataires.length} mandataire(s)
          </div>
        </div>

        {/* Tableau */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
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
                        <div className="w-8 h-8 rounded-full border border-slate-300 bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-700 font-mono">
                          {m.prenom?.[0] || ""}{m.nom?.[0] || ""}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{m.prenom} {m.nom}</div>
                      {m.email && (
                        <div className="text-[11px] font-mono text-slate-500 font-normal">{m.email}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {m.bureauAssigne}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {m.telephone || "—"}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 text-[11px]">
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
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Actif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>En attente</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {m.statut === "en_attente" && (
                          <button
                            type="button"
                            onClick={() => handleResendActivation(m)}
                            disabled={resendingId === m.id}
                            title="Renvoyer l'e-mail d'activation"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#000B58] hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {resendingId === m.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#000B58]" />
                            ) : (
                              <Send className="w-3.5 h-3.5 text-blue-600" />
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
                      Aucun mandataire enregistré pour le moment (0).
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
