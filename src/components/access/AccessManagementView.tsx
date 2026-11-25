"use client";

import React, { useState, useMemo } from "react";
import {
  KeyRound,
  ShieldCheck,
  Search,
  User,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
  Copy,
  UserCheck,
  UserX,
} from "lucide-react";
import { MembreParti, ROLES_PARTI } from "@/components/members/MembersView";
import { generateMemberAccessEmailHtml } from "@/lib/emailTemplates";

interface AccessManagementViewProps {
  membresList: MembreParti[];
  onUpdateMembre?: (updatedMembre: MembreParti) => void;
  onUpdateAllMembres?: (updatedList: MembreParti[]) => void;
  tenantName?: string;
}

export default function AccessManagementView({
  membresList = [],
  onUpdateMembre,
  onUpdateAllMembres,
  tenantName = "Parti Octacore",
}: AccessManagementViewProps) {
  // Sélection du membre pour l'attribution d'accès
  const [selectedMembreId, setSelectedMembreId] = useState<string>("");

  // Champs d'accès
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [statut, setStatut] = useState<"actif" | "inactif">("actif");
  const [sendEmailNotification, setSendEmailNotification] = useState<boolean>(true);

  // Visibilité des mots de passe
  const [showFormPassword, setShowFormPassword] = useState<boolean>(true);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [id: string]: boolean }>({});

  // États d'envoi et notifications
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filtres du tableau
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterAccess, setFilterAccess] = useState<string>("all"); // 'all' | 'with_access' | 'without_access' | 'inactive'

  // Membre actuellement sélectionné dans le formulaire
  const currentSelectedMembre = useMemo(() => {
    return membresList.find((m) => m.id === selectedMembreId) || null;
  }, [membresList, selectedMembreId]);

  // Synchronisation des champs quand un membre est sélectionné
  const handleSelectMembre = (id: string) => {
    setSelectedMembreId(id);
    setErrorMessage(null);
    setSuccessMessage(null);

    const target = membresList.find((m) => m.id === id);
    if (target) {
      setEmail(target.email || "");
      setPassword(target.password || generateSuggestedPassword());
      setRole(target.role || ROLES_PARTI[0]);
      setStatut(target.statut || "actif");
    } else {
      setEmail("");
      setPassword("");
      setRole("");
      setStatut("actif");
    }
  };

  // Générateur de mot de passe sécurisé
  const generateSuggestedPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let randomPart = "";
    for (let i = 0; i < 6; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `Parti2026$${randomPart}`;
  };

  // Statistiques globales
  const stats = useMemo(() => {
    const total = membresList.length;
    const withActiveAccess = membresList.filter(
      (m) => m.email && m.email.trim() !== "" && m.statut === "actif"
    ).length;
    const withInactiveAccess = membresList.filter(
      (m) => m.email && m.email.trim() !== "" && m.statut === "inactif"
    ).length;
    const withoutAccess = membresList.filter(
      (m) => !m.email || m.email.trim() === ""
    ).length;

    return { total, withActiveAccess, withInactiveAccess, withoutAccess };
  }, [membresList]);

  // Envoi d'un e-mail d'accès
  const sendAccessEmail = async (
    targetMembre: MembreParti,
    userEmail: string,
    userPass?: string
  ): Promise<boolean> => {
    try {
      const emailHtml = generateMemberAccessEmailHtml({
        nomParti: tenantName,
        membrePrenom: targetMembre.prenom,
        membreNom: targetMembre.nom,
        role: targetMembre.role,
        email: userEmail,
        password: userPass,
        loginUrl: `${window.location.origin}/login`,
      });

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: userEmail,
          subject: `Vos accès sécurisés à l'Espace Parti • ${tenantName}`,
          html: emailHtml,
        }),
      });

      const result = await res.json();
      return result.success;
    } catch (err) {
      console.error("Erreur envoi email accès:", err);
      return false;
    }
  };

  // Soumission du formulaire d'attribution
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentSelectedMembre) {
      setErrorMessage("Veuillez sélectionner un membre dans la liste déroulante.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMessage("L'adresse e-mail de connexion est obligatoire.");
      return;
    }

    // Vérification de collision d'email avec un autre membre
    const emailConflict = membresList.find(
      (m) => m.id !== currentSelectedMembre.id && m.email && m.email.toLowerCase() === cleanEmail
    );
    if (emailConflict) {
      setErrorMessage(
        `Cette adresse e-mail est déjà assignée à « ${emailConflict.prenom} ${emailConflict.nom} » (${emailConflict.role}).`
      );
      return;
    }

    setIsSubmitting(true);

    const updatedMembre: MembreParti = {
      ...currentSelectedMembre,
      email: cleanEmail,
      password: cleanPassword || "Membre2026$",
      role: role.trim() || currentSelectedMembre.role,
      statut: statut,
    };

    // Mise à jour de la liste
    const updatedList = membresList.map((m) =>
      m.id === updatedMembre.id ? updatedMembre : m
    );

    if (onUpdateMembre) {
      onUpdateMembre(updatedMembre);
    }
    if (onUpdateAllMembres) {
      onUpdateAllMembres(updatedList);
    }

    // Sauvegarde immédiate dans localStorage
    try {
      localStorage.setItem("cdt_membres", JSON.stringify(updatedList));
    } catch (err) {
      console.error("Erreur sauvegarde cdt_membres:", err);
    }

    // Envoi par email si la case est cochée
    let emailSent = false;
    if (sendEmailNotification) {
      emailSent = await sendAccessEmail(
        updatedMembre,
        cleanEmail,
        cleanPassword || "Membre2026$"
      );
    }

    setIsSubmitting(false);

    if (sendEmailNotification && emailSent) {
      setSuccessMessage(
        `Accès configuré avec succès pour « ${updatedMembre.prenom} ${updatedMembre.nom} ». Un e-mail d'invitation avec ses identifiants a été envoyé à ${cleanEmail}.`
      );
    } else {
      setSuccessMessage(
        `Accès configuré avec succès pour « ${updatedMembre.prenom} ${updatedMembre.nom} » (${cleanEmail}).`
      );
    }

    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // Renvoyer les accès d'un membre depuis le tableau
  const handleResendCredentials = async (membre: MembreParti) => {
    if (!membre.email) return;

    setSendingEmailId(membre.id);
    const success = await sendAccessEmail(
      membre,
      membre.email,
      membre.password || "Membre2026$"
    );
    setSendingEmailId(null);

    if (success) {
      setSuccessMessage(
        `Identifiants renvoyés avec succès à « ${membre.prenom} ${membre.nom} » (${membre.email}).`
      );
    } else {
      setErrorMessage(
        `Impossible d'envoyer l'e-mail à ${membre.email}. Vérifiez votre connexion SMTP.`
      );
    }
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 4000);
  };

  // Basculer le statut d'un compte (Actif / Suspendu)
  const handleToggleStatus = (membre: MembreParti) => {
    const newStatus: "actif" | "inactif" = membre.statut === "actif" ? "inactif" : "actif";
    const updatedMembre: MembreParti = { ...membre, statut: newStatus };
    const updatedList = membresList.map((m) =>
      m.id === membre.id ? updatedMembre : m
    );

    if (onUpdateMembre) onUpdateMembre(updatedMembre);
    if (onUpdateAllMembres) onUpdateAllMembres(updatedList);

    try {
      localStorage.setItem("cdt_membres", JSON.stringify(updatedList));
    } catch (err) {
      console.error(err);
    }

    setSuccessMessage(
      `Statut de « ${membre.prenom} ${membre.nom} » mis à jour : ${newStatus === "actif" ? "Actif" : "Suspendu"}.`
    );
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Révoquer l'accès d'un membre
  const handleRevokeAccess = (membre: MembreParti) => {
    if (
      confirm(
        `Confirmez-vous la révocation des accès de « ${membre.prenom} ${membre.nom} » ? Le membre ne pourra plus se connecter avec cette adresse e-mail.`
      )
    ) {
      const updatedMembre: MembreParti = {
        ...membre,
        email: "",
        password: "",
        statut: "inactif",
      };
      const updatedList = membresList.map((m) =>
        m.id === membre.id ? updatedMembre : m
      );

      if (onUpdateMembre) onUpdateMembre(updatedMembre);
      if (onUpdateAllMembres) onUpdateAllMembres(updatedList);

      try {
        localStorage.setItem("cdt_membres", JSON.stringify(updatedList));
      } catch (err) {
        console.error(err);
      }

      if (selectedMembreId === membre.id) {
        setEmail("");
        setPassword("");
        setStatut("inactif");
      }

      setSuccessMessage(`Accès révoqué pour « ${membre.prenom} ${membre.nom} ».`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // Filtrage du tableau des membres
  const filteredMembres = useMemo(() => {
    return membresList.filter((m) => {
      const hasAccess = Boolean(m.email && m.email.trim() !== "");
      const isActive = m.statut === "actif";

      // Filtre statut
      if (filterAccess === "with_access" && (!hasAccess || !isActive)) return false;
      if (filterAccess === "without_access" && hasAccess) return false;
      if (filterAccess === "inactive" && (!hasAccess || isActive)) return false;

      // Filtre recherche
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchName = `${m.prenom} ${m.nom}`.toLowerCase().includes(query);
        const matchEmail = (m.email || "").toLowerCase().includes(query);
        const matchRole = (m.role || "").toLowerCase().includes(query);
        const matchCity = (m.ville || "").toLowerCase().includes(query);
        return matchName || matchEmail || matchRole || matchCity;
      }

      return true;
    });
  }, [membresList, filterAccess, searchQuery]);

  return (
    <div className="w-full space-y-6">
      {/* 1. EN-TÊTE ÉPURÉ */}
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#000B58]" />
            Gestion des accès
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Attribuez des identifiants et des habilitations de connexion aux membres enregistrés dans le système.
          </p>
        </div>
      </div>

      {/* 2. STATISTIQUES RAPIDES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Total des membres
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
            {stats.total}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Membres inscrits dans le registre du parti
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-semibold block">
            Accès actifs
          </span>
          <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
            {stats.withActiveAccess}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Comptes habilités avec identifiants valides
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 font-semibold block">
            Sans accès attribué
          </span>
          <div className="text-2xl font-bold text-amber-600 mt-1 font-mono">
            {stats.withoutAccess}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Membres sans identifiants de connexion
          </span>
        </div>
      </div>

      {/* 3. FORMULAIRE D'ATTRIBUTION D'ACCÈS À UN MEMBRE EXISTANT */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs p-6">
        <div className="pb-4 mb-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#000B58]" />
            Attribuer ou modifier un accès pour un membre existant
          </h2>
          {currentSelectedMembre && (
            <span className="text-[11px] font-mono text-[#000B58] bg-blue-50 px-2.5 py-1 rounded-full font-semibold">
              Membre sélectionné : {currentSelectedMembre.prenom} {currentSelectedMembre.nom}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="text-xs text-red-600 font-medium flex items-center gap-2 bg-red-50 p-3 rounded-xl border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="text-xs text-emerald-700 font-medium flex items-center gap-2 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* SÉLECTEUR DU MEMBRE EXISTANT */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-900 block">
              1. Sélectionner un membre du système <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedMembreId}
              onChange={(e) => handleSelectMembre(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all cursor-pointer font-medium"
            >
              <option value="">
                {membresList.length === 0
                  ? "-- Aucun membre enregistré (ajoutez d'abord des membres dans l'onglet « Membres du parti ») --"
                  : `-- Choisir un membre existant dans la liste (${membresList.length}) --`}
              </option>
              {membresList.map((m) => {
                const hasAcc = Boolean(m.email && m.email.trim() !== "");
                return (
                  <option key={m.id} value={m.id}>
                    {m.prenom} {m.nom} — {m.role} ({m.ville || m.departement}) — {hasAcc ? `[Accès: ${m.email}]` : "[Sans accès]"}
                  </option>
                );
              })}
            </select>
          </div>

          {/* APERÇU RAPIDE DU MEMBRE SÉLECTIONNÉ */}
          {currentSelectedMembre && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl border border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {currentSelectedMembre.photoUrl ? (
                    <img
                      src={currentSelectedMembre.photoUrl}
                      alt={currentSelectedMembre.nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {currentSelectedMembre.prenom} {currentSelectedMembre.nom}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {currentSelectedMembre.role} • {currentSelectedMembre.ville} ({currentSelectedMembre.departement})
                  </div>
                  {currentSelectedMembre.telephone && (
                    <div className="text-[10px] font-mono text-slate-500">
                      Tél : {currentSelectedMembre.telephone}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block text-[10px] font-mono uppercase px-2.5 py-1 rounded-full font-semibold border ${
                    currentSelectedMembre.email && currentSelectedMembre.statut === "actif"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : currentSelectedMembre.email && currentSelectedMembre.statut === "inactif"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {currentSelectedMembre.email && currentSelectedMembre.statut === "actif"
                    ? "Accès actif"
                    : currentSelectedMembre.email && currentSelectedMembre.statut === "inactif"
                    ? "Accès suspendu"
                    : "Sans accès"}
                </span>
              </div>
            </div>
          )}

          {/* LIGNE DES IDENTIFIANTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 items-end">
            {/* E-mail de connexion */}
            <div className="lg:col-span-4 space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Adresse e-mail (Identifiant de connexion) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="membre@domaine.com"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all font-mono"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="lg:col-span-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-900 block">
                  Mot de passe d'accès <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setPassword(generateSuggestedPassword())}
                  className="text-[10px] font-mono text-[#000B58] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Générer
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showFormPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Défaut: Membre2026$"
                  className="w-full pl-9 pr-9 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowFormPassword(!showFormPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Rôle / Habilitation */}
            <div className="lg:col-span-4 space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 block">
                Rôle système / Habilitation <span className="text-red-500">*</span>
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
          </div>

          {/* CHECKBOX ENVOI EMAIL ET STATUT */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sendEmailNotification}
                  onChange={(e) => setSendEmailNotification(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#000B58] focus:ring-[#000B58] cursor-pointer"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Envoyer automatiquement les identifiants par e-mail au membre
                </span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Statut :</span>
                <button
                  type="button"
                  onClick={() => setStatut(statut === "actif" ? "inactif" : "actif")}
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold border transition-all cursor-pointer ${
                    statut === "actif"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-amber-50 text-amber-700 border-amber-300"
                  }`}
                >
                  {statut === "actif" ? "Actif (Accès autorisé)" : "Suspendu (Accès bloqué)"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedMembreId && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMembreId("");
                    setEmail("");
                    setPassword("");
                    setRole("");
                    setErrorMessage(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !selectedMembreId}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer hover:opacity-95 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#000B58" }}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Enregistrement en cours...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Enregistrer et accorder l'accès</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 4. TABLEAU DES ACCÈS DES MEMBRES */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Barre de recherche et filtre */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, rôle ou e-mail..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#000B58]"
              />
            </div>

            <select
              value={filterAccess}
              onChange={(e) => setFilterAccess(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-[#000B58] cursor-pointer"
            >
              <option value="all">Tous les membres ({membresList.length})</option>
              <option value="with_access">Avec accès actif ({stats.withActiveAccess})</option>
              <option value="without_access">Sans accès configuré ({stats.withoutAccess})</option>
              <option value="inactive">Accès suspendus ({stats.withInactiveAccess})</option>
            </select>
          </div>

          <div className="text-xs font-mono text-slate-500">
            Affichage : <strong className="text-slate-800">{filteredMembres.length}</strong> membre(s)
          </div>
        </div>

        {/* Tableau */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-4 font-semibold">Membre</th>
                <th className="py-3 px-4 font-semibold">Rôle au parti</th>
                <th className="py-3 px-4 font-semibold">Identifiant (E-mail)</th>
                <th className="py-3 px-4 font-semibold">Mot de passe</th>
                <th className="py-3 px-4 font-semibold">Statut de l'accès</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredMembres.length > 0 ? (
                filteredMembres.map((m) => {
                  const hasAccess = Boolean(m.email && m.email.trim() !== "");
                  const isVisiblePass = visiblePasswords[m.id] || false;

                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      {/* Photo et Nom */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {m.photoUrl ? (
                            <img
                              src={m.photoUrl}
                              alt={`${m.prenom} ${m.nom}`}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full border border-slate-300 bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-700 font-mono shrink-0">
                              {m.prenom?.[0] || ""}{m.nom?.[0] || ""}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 leading-tight">
                              {m.prenom} {m.nom}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {m.ville} ({m.departement})
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Rôle */}
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {m.role}
                      </td>

                      {/* E-mail */}
                      <td className="py-3 px-4 font-mono">
                        {hasAccess ? (
                          <span className="text-slate-900 font-semibold">{m.email}</span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            Aucun e-mail configuré
                          </span>
                        )}
                      </td>

                      {/* Mot de passe */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {hasAccess ? (
                          <div className="flex items-center gap-2">
                            <span>{isVisiblePass ? m.password || "Membre2026$" : "••••••••••••"}</span>
                            <button
                              onClick={() =>
                                setVisiblePasswords((prev) => ({
                                  ...prev,
                                  [m.id]: !prev[m.id],
                                }))
                              }
                              className="text-slate-400 hover:text-slate-700 cursor-pointer"
                              title={isVisiblePass ? "Masquer" : "Afficher"}
                            >
                              {isVisiblePass ? (
                                <EyeOff className="w-3.5 h-3.5" />
                              ) : (
                                <Eye className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(m.password || "Membre2026$");
                                setSuccessMessage(`Mot de passe copié pour ${m.prenom} ${m.nom}.`);
                                setTimeout(() => setSuccessMessage(null), 2500);
                              }}
                              className="text-slate-400 hover:text-[#000B58] cursor-pointer"
                              title="Copier le mot de passe"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Statut de l'accès */}
                      <td className="py-3 px-4">
                        {hasAccess ? (
                          m.statut === "actif" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                              Suspendu
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                            Non configuré
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Configurer / Modifier l'accès */}
                          <button
                            onClick={() => handleSelectMembre(m.id)}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300 transition-all cursor-pointer inline-flex items-center gap-1"
                            title="Configurer ou modifier les accès"
                          >
                            <KeyRound className="w-3 h-3 text-[#000B58]" />
                            <span>{hasAccess ? "Modifier" : "Donner accès"}</span>
                          </button>

                          {/* Renvoyer identifiants par e-mail */}
                          {hasAccess && (
                            <button
                              onClick={() => handleResendCredentials(m)}
                              disabled={sendingEmailId === m.id}
                              className="p-1.5 text-slate-500 hover:text-[#000B58] rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                              title="Renvoyer les identifiants par e-mail"
                            >
                              {sendingEmailId === m.id ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#000B58]" />
                              ) : (
                                <Send className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          {/* Basculer statut Actif / Suspendu */}
                          {hasAccess && (
                            <button
                              onClick={() => handleToggleStatus(m)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                              title={m.statut === "actif" ? "Suspendre l'accès" : "Réactiver l'accès"}
                            >
                              {m.statut === "actif" ? (
                                <UserX className="w-3.5 h-3.5" />
                              ) : (
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                            </button>
                          )}

                          {/* Révoquer */}
                          {hasAccess && (
                            <button
                              onClick={() => handleRevokeAccess(m)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                              title="Révoquer complètement l'accès"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="text-xs text-slate-500 font-medium">
                      {membresList.length === 0
                        ? "Aucun membre n'est encore enregistré dans le système. Veuillez d'abord ajouter des membres dans l'onglet « Membres du parti » pour pouvoir leur attribuer un accès."
                        : "Aucun membre ne correspond aux critères de recherche."}
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
