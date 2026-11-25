"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Building,
  CheckCircle2,
  Copy,
  ExternalLink,
  Trash2,
  Send,
  Clock,
  ShieldCheck,
  AlertCircle,
  Search,
  Mail,
  Loader2,
  Check,
} from "lucide-react";
import { PartyTenant } from "@/types/auth";
import { fetchPartiesFromSupabase, savePartyToSupabase } from "@/lib/supabaseService";
import { isSupabaseConfigured } from "@/lib/supabase";

interface SuperAdminDashboardViewProps {
  onLogout?: () => void;
}

export default function SuperAdminDashboardView({ onLogout }: SuperAdminDashboardViewProps) {
  const [parties, setParties] = useState<PartyTenant[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Champs du formulaire
  const [nomParti, setNomParti] = useState("");
  const [sigle, setSigle] = useState("");
  const [dirigeantPrenom, setDirigeantPrenom] = useState("");
  const [dirigeantNom, setDirigeantNom] = useState("");
  const [email, setEmail] = useState("");
  const [licenceType, setLicenceType] = useState("Licence Électorale Complète 2026 (Payée)");

  const [createdPartyToken, setCreatedPartyToken] = useState<string | null>(null);
  const [createdPartyEmail, setCreatedPartyEmail] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // État de l'intégration du service d'e-mail (Gmail SMTP ou Resend)
  const [emailServiceStatus, setEmailServiceStatus] = useState<{
    configured: boolean;
    fromEmail: string;
    provider?: string;
  } | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailDeliveryStatus, setEmailDeliveryStatus] = useState<{
    success: boolean;
    message: string;
    id?: string;
  } | null>(null);
  const [resendingPartyId, setResendingPartyId] = useState<string | null>(null);
  const [rowFeedback, setRowFeedback] = useState<{
    partyId: string;
    success: boolean;
    message: string;
  } | null>(null);

  // Vérifier la configuration du service d'e-mail au chargement
  useEffect(() => {
    fetch("/api/send-email")
      .then((res) => res.json())
      .then((data) => {
        setEmailServiceStatus({
          configured: Boolean(data.configured),
          fromEmail: data.fromEmail || "centretabulation@gmail.com",
          provider: data.provider,
        });
      })
      .catch((err) => {
        console.error("Erreur vérification e-mail:", err);
      });
  }, []);

  // Chargement des partis depuis Supabase (avec fallback localStorage)
  useEffect(() => {
    async function initParties() {
      if (isSupabaseConfigured) {
        try {
          const supaParties = await fetchPartiesFromSupabase();
          if (supaParties.length > 0) {
            setParties(supaParties);
            localStorage.setItem("cdt_parties", JSON.stringify(supaParties));
            setIsLoaded(true);
            return;
          }
        } catch (e) {
          console.error("Erreur lecture partis Supabase:", e);
        }
      }

      try {
        const stored = localStorage.getItem("cdt_parties");
        if (stored) {
          setParties(JSON.parse(stored));
        } else {
          setParties([]);
        }
      } catch (e) {
        console.error("Erreur chargement partis localStorage:", e);
        setParties([]);
      }
      setIsLoaded(true);
    }

    initParties();
  }, []);

  // Sauvegarde dans Supabase et localStorage
  const saveParties = (newParties: PartyTenant[]) => {
    setParties(newParties);
    try {
      localStorage.setItem("cdt_parties", JSON.stringify(newParties));
    } catch (e) {
      console.error("Erreur sauvegarde partis:", e);
    }
  };

  // Envoi effectif de l'email via Resend
  const triggerResendEmail = async (party: PartyTenant, token: string) => {
    setIsSendingEmail(true);
    setEmailDeliveryStatus(null);

    const activationUrl = typeof window !== "undefined"
      ? `${window.location.origin}/activation?token=${token}`
      : `/activation?token=${token}`;

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: party.email,
          partyData: {
            nomParti: party.nom,
            sigle: party.sigle,
            dirigeantPrenom: party.dirigeantPrenom,
            dirigeantNom: party.dirigeantNom,
            email: party.email,
            activationUrl: activationUrl,
            licenceType: party.licenceType,
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        const msg = `E-mail d'activation délivré automatiquement à ${party.email} via ${
          result.provider === "gmail_smtp" ? "centretabulation@gmail.com" : "Resend"
        }.`;
        setEmailDeliveryStatus({
          success: true,
          message: msg,
          id: result.id,
        });
        return { success: true, message: msg };
      } else {
        let displayError = result.error || "Impossible d'envoyer l'e-mail.";
        if (displayError.includes("535-5.7.8") || displayError.includes("BadCredentials")) {
          displayError = "Authentification Gmail refusée (BadCredentials) : Le mot de passe d'application pour centretabulation@gmail.com est expiré ou le compte associé diffère. Mettez à jour SMTP_PASS dans .env.local avec un mot de passe d'application valide (myaccount.google.com/apppasswords), puis cliquez sur « Renvoyer mail ».";
        } else if (displayError.includes("You can only send testing emails to your own email address")) {
          const matchedEmail = displayError.match(/\(([^)]+)\)/)?.[1] || "worksysmanagement@gmail.com";
          displayError = `Mode Test Resend actif : envoi d'e-mail automatique réservé à votre adresse de test (${matchedEmail}). Pour envoyer à d'autres adresses, configurez le mot de passe d'application Gmail dans .env.local. Vous pouvez tester directement en cliquant sur « Tester le lien client » ou « Copier le lien ».`;
        }

        setEmailDeliveryStatus({
          success: false,
          message: result.missingApiKey
            ? "Clé RESEND_API_KEY non configurée dans .env.local (Ajoutez votre clé pour activer l'envoi réel)."
            : displayError,
        });
        return { success: false, message: displayError };
      }
    } catch (err: any) {
      const errMsg = `Erreur réseau lors de l'appel d'envoi : ${err.message}`;
      setEmailDeliveryStatus({
        success: false,
        message: errMsg,
      });
      return { success: false, message: errMsg };
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleRegisterParty = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setCreatedPartyToken(null);
    setEmailDeliveryStatus(null);

    const cleanNom = nomParti.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPrenom = dirigeantPrenom.trim();
    const cleanNomDirigeant = dirigeantNom.trim();

    if (!cleanNom || !cleanEmail || !cleanPrenom || !cleanNomDirigeant) {
      setErrorMessage("Veuillez remplir les champs obligatoires (*).");
      return;
    }

    // Vérifier si l'email existe déjà
    if (parties.some((p) => p.email.toLowerCase() === cleanEmail)) {
      setErrorMessage("Un parti politique avec cette adresse e-mail est déjà enregistré.");
      return;
    }

    // Génération d'un token sécurisé unique
    const uniqueToken = `act-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;

    const newParty: PartyTenant = {
      id: `party-${Date.now()}`,
      nom: cleanNom,
      sigle: sigle.trim().toUpperCase() || cleanNom.slice(0, 3).toUpperCase(),
      dirigeantPrenom: cleanPrenom,
      dirigeantNom: cleanNomDirigeant,
      email: cleanEmail,
      activationToken: uniqueToken,
      statut: "en_attente",
      licenceType: licenceType,
      dateCreation: new Date().toLocaleDateString("fr-FR"),
    };

    const updated = [newParty, ...parties];
    saveParties(updated);
    await savePartyToSupabase(newParty);

    setCreatedPartyToken(uniqueToken);
    setCreatedPartyEmail(cleanEmail);
    setSuccessMessage(`Parti « ${cleanNom} » enregistré avec succès.`);

    // Réinitialisation du formulaire
    setNomParti("");
    setSigle("");
    setDirigeantPrenom("");
    setDirigeantNom("");
    setEmail("");

    // Transfert automatique du mail via Resend
    await triggerResendEmail(newParty, uniqueToken);
  };

  // Renvoyer l'email d'invitation manuellement pour un parti en attente
  const handleManualResend = async (party: PartyTenant) => {
    setResendingPartyId(party.id);
    setRowFeedback(null);
    setCreatedPartyToken(party.activationToken);
    setCreatedPartyEmail(party.email);

    const res = await triggerResendEmail(party, party.activationToken);
    setRowFeedback({
      partyId: party.id,
      success: res.success,
      message: res.message,
    });
    setResendingPartyId(null);
  };

  const handleDeleteParty = (id: string, nom: string) => {
    if (confirm(`Confirmez-vous la révocation du compte du parti « ${nom} » ?`)) {
      const updated = parties.filter((p) => p.id !== id);
      saveParties(updated);
      setSuccessMessage(`Compte du parti « ${nom} » révoqué.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/activation?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const totalPartis = parties.length;
  const totalActifs = parties.filter((p) => p.statut === "actif").length;
  const totalEnAttente = parties.filter((p) => p.statut === "en_attente").length;

  const filteredParties = parties.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.nom.toLowerCase().includes(q) ||
      p.sigle.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.dirigeantNom.toLowerCase().includes(q) ||
      p.dirigeantPrenom.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans select-none flex flex-col">
      {/* 1. EN-TÊTE SUPÉRIEUR SUPERADMIN */}
      <header
        className="h-16 px-8 flex items-center justify-between text-white sticky top-0 z-30 shadow-md"
        style={{ backgroundColor: "#000B58" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-sm">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9.5px] font-mono tracking-widest text-blue-200 uppercase font-semibold block leading-tight">
              CONSOLE D'ADMINISTRATION GÉNÉRALE
            </span>
            <h1 className="text-sm font-bold tracking-tight leading-tight">
              CDT System — Panel SuperAdmin
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-semibold leading-tight text-white">
              Rodjesky Piton
            </div>
            <div className="text-[10px] text-blue-200 font-mono">
              pitonrodjy@gmail.com • SuperAdmin
            </div>
          </div>

          <button
            onClick={onLogout}
            className="text-xs font-mono text-white/90 hover:text-white border border-white/30 hover:border-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* 2. CORPS PRINCIPAL */}
      <main className="p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {/* TITRE DE SECTION */}
        <div className="pb-2 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Gestion des Partis Politiques & Licences
          </h2>
        </div>

        {/* 3 INDICATEURS CLÉS (DÉMARRENT STRICTEMENT À 0) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider block">
              Partis enregistrés
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {totalPartis}
              </span>
              <span className="text-xs text-slate-400 font-mono">formations</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider block">
              Comptes actifs (Licences actives)
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600 font-mono">
                {totalActifs}
              </span>
              <span className="text-xs text-slate-400 font-mono">actifs</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider block">
              En attente d'activation
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-600 font-mono">
                {totalEnAttente}
              </span>
              <span className="text-xs text-slate-400 font-mono">invitations</span>
            </div>
          </div>
        </div>

        {/* LIEN D'ACTIVATION GÉNÉRÉ (ALERTE SUCCÈS & RÉSULTAT RESEND) */}
        {createdPartyToken && (
          <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/70 space-y-3.5 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Lien d'activation sécurisé pour {createdPartyEmail}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Statut d'envoi automatique */}
                {isSendingEmail ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-800 bg-blue-100/80 px-3 py-1 rounded-full border border-blue-300">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>Envoi de l'e-mail en cours...</span>
                  </div>
                ) : emailDeliveryStatus ? (
                  <div
                    className={`flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full border ${
                      emailDeliveryStatus.success
                        ? "text-emerald-800 bg-emerald-100 border-emerald-300 font-semibold"
                        : "text-amber-800 bg-amber-100 border-amber-300 font-medium"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{emailDeliveryStatus.message}</span>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => setCreatedPartyToken(null)}
                  className="text-emerald-700 hover:text-emerald-950 p-1 text-sm font-bold ml-1 cursor-pointer"
                  title="Fermer ce volet"
                >
                  ✕
                </button>
              </div>
            </div>

            <p className="text-xs text-emerald-800">
              {emailDeliveryStatus?.success
                ? "Un e-mail officiel contenant le lien sécurisé a été transmis au dirigeant du parti. Vous pouvez également copier le lien ci-dessous ou le tester :"
                : "Vous pouvez copier le lien d'activation sécurisé ci-dessous ou le tester directement pour finaliser l'accès du dirigeant :"}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                readOnly
                value={typeof window !== "undefined" ? `${window.location.origin}/activation?token=${createdPartyToken}` : ""}
                className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-emerald-300 rounded-xl text-slate-800 select-all"
              />

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => handleCopyLink(createdPartyToken)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedToken ? "Lien copié !" : "Copier le lien"}</span>
                </button>

                <a
                  href={`/activation?token=${createdPartyToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Tester le lien client</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 3. FORMULAIRE D'ENREGISTREMENT D'UN PARTI CLIENT */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-5 h-5 text-[#000B58]" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Enregistrer un nouveau parti politique client
            </h3>
          </div>

          <form onSubmit={handleRegisterParty} className="space-y-5">
            {errorMessage && (
              <div className="p-3 rounded-xl border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Ligne 1 : Nom du parti et Sigle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-900 block">
                  Nom officiel du parti politique <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nomParti}
                  onChange={(e) => setNomParti(e.target.value)}
                  placeholder="Ex: Parti Démocratique Uni"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-900 block">
                  Sigle officiel
                </label>
                <input
                  type="text"
                  value={sigle}
                  onChange={(e) => setSigle(e.target.value)}
                  placeholder="Ex: PDU"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] font-mono"
                />
              </div>
            </div>

            {/* Ligne 2 : Représentant légal & Adresse e-mail officielle */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-900 block">
                  Prénom du représentant / PDG <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={dirigeantPrenom}
                  onChange={(e) => setDirigeantPrenom(e.target.value)}
                  placeholder="Ex: Rodjesky"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-900 block">
                  Nom du représentant / PDG <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={dirigeantNom}
                  onChange={(e) => setDirigeantNom(e.target.value)}
                  placeholder="Ex: Piton"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-900 block">
                  Adresse e-mail officielle du parti <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="direction@parti.ht"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58]"
                />
              </div>
            </div>

            {/* Ligne 3 : Bouton d'enregistrement */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSendingEmail}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer hover:opacity-95 active:scale-95 shadow-sm disabled:opacity-70"
                style={{ backgroundColor: "#000B58" }}
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enregistrement en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enregistrer parti</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 4. TABLEAU DES PARTIS POLITIQUES CLIENTS */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Barre de recherche */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, sigle, dirigeant, email..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#000B58]"
              />
            </div>

            <div className="text-xs font-mono text-slate-500">
              Affichage : <strong className="text-slate-800">{filteredParties.length}</strong> sur {totalPartis} parti(s)
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                  <th className="py-3 px-4 font-semibold">Parti politique</th>
                  <th className="py-3 px-4 font-semibold">Représentant légal</th>
                  <th className="py-3 px-4 font-semibold">Adresse e-mail</th>
                  <th className="py-3 px-4 font-semibold text-center">Statut du compte</th>
                  <th className="py-3 px-4 font-semibold">Lien d'activation</th>
                  <th className="py-3 px-4 font-semibold">Date d'enregistrement</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredParties.length > 0 ? (
                  filteredParties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{p.nom}</div>
                        <div className="text-[10px] font-mono text-slate-400">{p.sigle}</div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-800">
                        {p.dirigeantPrenom} {p.dirigeantNom}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-700">
                        {p.email}
                      </td>

                      <td className="py-3 px-4 text-center font-mono text-[11px]">
                        {p.statut === "actif" ? (
                          <span className="text-emerald-700 font-semibold">Actif</span>
                        ) : (
                          <span className="text-amber-600 font-semibold">En attente</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.statut === "en_attente" ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleCopyLink(p.activationToken)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border border-slate-200 hover:border-slate-400 rounded-lg bg-white text-slate-700 transition-colors cursor-pointer shadow-2xs"
                                title="Copier le lien d'activation"
                              >
                                <Copy className="w-3 h-3 text-slate-500" />
                                <span>{copiedToken && createdPartyToken === p.activationToken ? "Lien copié !" : "Copier lien"}</span>
                              </button>

                              <button
                                onClick={() => handleManualResend(p)}
                                disabled={resendingPartyId === p.id}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border border-blue-200 hover:border-[#000B58] bg-blue-50/60 hover:bg-blue-50 text-[#000B58] font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                                title="Renvoyer l'e-mail officiel d'activation"
                              >
                                {resendingPartyId === p.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin text-[#000B58]" />
                                ) : (
                                  <Mail className="w-3 h-3 text-[#000B58]" />
                                )}
                                <span>{resendingPartyId === p.id ? "Envoi en cours..." : "Renvoyer mail"}</span>
                              </button>
                            </div>

                            {rowFeedback && rowFeedback.partyId === p.id && (
                              <div
                                className={`text-[11px] font-medium p-2 rounded-lg border leading-tight animate-fade-in ${
                                  rowFeedback.success
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                    : "bg-amber-50 text-amber-900 border-amber-300"
                                }`}
                              >
                                {rowFeedback.message}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono text-slate-400">Activé le {p.dateActivation || p.dateCreation}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {p.dateCreation}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteParty(p.id, p.nom)}
                          title="Révoquer ce parti"
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
                      <p className="text-xs text-slate-500">
                        Aucun parti politique client enregistré pour le moment (0).
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Utilisez le formulaire ci-dessus pour enregistrer votre premier parti client.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
