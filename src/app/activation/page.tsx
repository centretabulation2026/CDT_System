"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ShieldCheck, AlertCircle, Eye, EyeOff, Lock, ArrowRight, UserCheck } from "lucide-react";
import { PartyTenant } from "@/types/auth";
import { Mandataire } from "@/components/mandataires/MandatairesView";

function ActivationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const typeParam = searchParams.get("type");

  const [party, setParty] = useState<PartyTenant | null>(null);
  const [mandataire, setMandataire] = useState<Mandataire | null>(null);
  const [targetType, setTargetType] = useState<"party" | "mandataire" | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<"not_found" | "already_active" | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrorStatus("not_found");
      setLoading(false);
      return;
    }

    try {
      // 1. Si type=mandataire explicitement ou si présent dans cdt_mandataires
      const storedMandataires = localStorage.getItem("cdt_mandataires");
      if (storedMandataires) {
        const mandatairesList: Mandataire[] = JSON.parse(storedMandataires);
        const foundMandataire = mandatairesList.find((m) => m.activationToken === token);
        if (foundMandataire) {
          setMandataire(foundMandataire);
          setTargetType("mandataire");
          if (foundMandataire.statut === "actif") {
            setErrorStatus("already_active");
          }
          setLoading(false);
          return;
        }
      }

      // 2. Recherche dans les partis (cdt_parties)
      const storedParties = localStorage.getItem("cdt_parties");
      if (storedParties) {
        const partiesList: PartyTenant[] = JSON.parse(storedParties);
        const foundParty = partiesList.find((p) => p.activationToken === token);
        if (foundParty) {
          setParty(foundParty);
          setTargetType("party");
          if (foundParty.statut === "actif") {
            setErrorStatus("already_active");
          }
          setLoading(false);
          return;
        }
      }

      // Aucun compte trouvé avec ce jeton
      setErrorStatus("not_found");
    } catch (e) {
      console.error(e);
      setErrorStatus("not_found");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!party && !mandataire) return;

    if (!password || password.length < 6) {
      setFormError("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (targetType === "mandataire" && mandataire) {
        // Enregistrement mot de passe mandataire
        const stored = localStorage.getItem("cdt_mandataires");
        const mandatairesList: Mandataire[] = stored ? JSON.parse(stored) : [];

        const updatedMandataires = mandatairesList.map((m) => {
          if (m.id === mandataire.id || m.activationToken === token) {
            return {
              ...m,
              statut: "actif" as const,
              password: password,
              dateActivation: new Date().toLocaleDateString("fr-FR"),
            };
          }
          return m;
        });

        localStorage.setItem("cdt_mandataires", JSON.stringify(updatedMandataires));
      } else if (party) {
        // Enregistrement mot de passe parti
        const stored = localStorage.getItem("cdt_parties");
        const partiesList: PartyTenant[] = stored ? JSON.parse(stored) : [];

        const updatedParties = partiesList.map((p) => {
          if (p.id === party.id) {
            return {
              ...p,
              statut: "actif" as const,
              password: password,
              dateActivation: new Date().toLocaleDateString("fr-FR"),
            };
          }
          return p;
        });

        localStorage.setItem("cdt_parties", JSON.stringify(updatedParties));
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      console.error("Erreur lors de l'activation:", err);
      setFormError("Une erreur est survenue lors de l'enregistrement.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center space-y-3 text-white">
        <div className="w-8 h-8 mx-auto border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-xs font-mono text-blue-200">Vérification du lien d'invitation...</p>
      </div>
    );
  }

  if (errorStatus === "not_found") {
    return (
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-800 text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Lien invalide ou expiré</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Ce lien d&apos;invitation et d&apos;activation est introuvable ou a déjà été révoqué par le SuperAdmin.
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="w-full py-3 px-4 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md"
          style={{ backgroundColor: "#000B58" }}
        >
          Retour à la page de connexion
        </button>
      </div>
    );
  }

  if (errorStatus === "already_active") {
    return (
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-800 text-center space-y-5">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
            {targetType === "mandataire" && mandataire
              ? `Mandataire • ${mandataire.bureauAssigne}`
              : party
              ? `${party.sigle} — ${party.nom}`
              : "Compte CDT System"}
          </span>
          <h1 className="text-lg font-bold text-slate-900 mt-1">
            {targetType === "mandataire" ? "Compte mandataire déjà activé" : "Compte déjà activé"}
          </h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            {targetType === "mandataire"
              ? "Votre compte mandataire a déjà été activé. Vous pouvez vous connecter directement avec vos identifiants pour accéder à votre interface de terrain."
              : "Le compte officiel de votre parti politique a déjà été activé. Vous pouvez vous connecter directement avec vos identifiants."}
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="w-full py-3 px-4 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md"
          style={{ backgroundColor: "#000B58" }}
        >
          Accéder à la connexion
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-800 my-auto">
      {/* En-tête épuré */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
          {targetType === "mandataire"
            ? "Activez votre Espace Mandataire"
            : "Activez votre Espace Parti"}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {targetType === "mandataire"
            ? "Définissez votre mot de passe confidentiel pour vos opérations de terrain"
            : "Définissez le mot de passe confidentiel pour votre parti"}
        </p>
      </div>

      {/* Informations pré-remplies du mandataire ou du parti (Read-only) */}
      {targetType === "mandataire" && mandataire ? (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-5 space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Mandataire officiel :</span>
            <span className="font-bold text-slate-900 truncate max-w-[200px]">
              {mandataire.prenom} {mandataire.nom}
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Bureau assigné :</span>
            <span className="font-semibold text-slate-800 truncate max-w-[200px]">
              {mandataire.bureauAssigne}
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Département & Ville :</span>
            <span className="font-medium text-slate-700">
              {mandataire.departement} — {mandataire.ville}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">E-mail officiel :</span>
            <span className="font-mono text-slate-800 text-[11px] truncate max-w-[200px]">
              {mandataire.email}
            </span>
          </div>
        </div>
      ) : party ? (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-5 space-y-2 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Parti politique :</span>
            <span className="font-bold text-slate-900 truncate max-w-[200px]">
              {party.nom} ({party.sigle})
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Représentant officiel :</span>
            <span className="font-semibold text-slate-800">
              {party.dirigeantPrenom} {party.dirigeantNom}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">E-mail officiel :</span>
            <span className="font-mono text-slate-800 text-[11px] truncate max-w-[200px]">
              {party.email}
            </span>
          </div>
        </div>
      ) : null}

      {/* Message de succès */}
      {isSuccess ? (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-emerald-900">
            {targetType === "mandataire" ? "Espace Mandataire Activé !" : "Espace Parti Activé !"}
          </h3>
          <p className="text-xs text-emerald-700">
            Votre mot de passe a été enregistré avec succès. Redirection vers la page de connexion...
          </p>
        </div>
      ) : (
        /* Formulaire de définition du mot de passe */
        <form onSubmit={handleActivate} className="space-y-4">
          {formError && (
            <div className="text-xs text-red-600 font-medium text-center bg-red-50 p-2.5 rounded-xl border border-red-200">
              {formError}
            </div>
          )}

          {/* 1. Nouveau mot de passe */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-900 block">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                className="w-full pl-3.5 pr-10 py-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 2. Confirmer le mot de passe */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-900 block">
              Confirmer le mot de passe
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répétez le mot de passe"
              className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all font-mono"
            />
          </div>

          {/* Bouton d'activation */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-70 shadow-md mt-5 hover:opacity-95 active:scale-95"
            style={{ backgroundColor: "#000B58" }}
          >
            {isSubmitting ? (
              <span className="font-mono">ACTIVATION EN COURS...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>
                  {targetType === "mandataire"
                    ? "Activer mon Espace Mandataire"
                    : "Activer mon Espace Parti"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ActivationPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#000B58] via-[#051147] to-[#010626] overflow-hidden select-none font-sans text-slate-800">
      {/* Vagues douces d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <path
            d="M-100 500 C 300 300, 600 700, 1000 450 C 1300 250, 1500 400, 1600 350 L 1600 900 L -100 900 Z"
            fill="#1E3A8A"
          />
        </svg>
      </div>

      <Suspense
        fallback={
          <div className="text-center text-white space-y-2">
            <div className="w-8 h-8 mx-auto border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-xs font-mono text-blue-200">Chargement de la page d'activation...</p>
          </div>
        }
      >
        <ActivationForm />
      </Suspense>
    </div>
  );
}
