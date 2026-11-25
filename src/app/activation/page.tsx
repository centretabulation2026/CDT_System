"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ShieldCheck, AlertCircle, Eye, EyeOff, Lock, ArrowRight, UserCheck } from "lucide-react";
import { PartyTenant } from "@/types/auth";
import { Mandataire } from "@/components/mandataires/MandatairesView";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function ActivationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

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

    async function checkToken() {
      // 1. Recherche via l'API serveur (utilise Supabase Service Role de façon sécurisée)
      try {
        const res = await fetch(`/api/verify-token?token=${encodeURIComponent(token!)}`);
        const json = await res.json();

        if (json.success && json.data) {
          if (json.targetType === "mandataire") {
            setMandataire(json.data);
            setTargetType("mandataire");
            if (json.data.statut === "actif") {
              setErrorStatus("already_active");
            }
          } else {
            setParty(json.data);
            setTargetType("party");
            if (json.data.statut === "actif") {
              setErrorStatus("already_active");
            }
          }
          setLoading(false);
          return;
        }
      } catch (apiErr) {
        console.warn("Échec /api/verify-token:", apiErr);
      }

      // 2. Recherche directe Supabase côté client en secours
      if (isSupabaseConfigured) {
        try {
          const { data: mData } = await supabase
            .from("mandataires")
            .select("*")
            .eq("activation_token", token)
            .maybeSingle();

          if (mData) {
            setMandataire({
              id: mData.id,
              nom: mData.nom,
              prenom: mData.prenom,
              email: mData.email,
              bureauAssigne: mData.bureau_assigne,
              departement: mData.departement,
              ville: mData.ville,
              telephone: mData.telephone || "",
              adresse: mData.adresse || "",
              nifCin: mData.nif_cin || "",
              dateAffectation: mData.date_affectation,
              statut: mData.statut,
            });
            setTargetType("mandataire");
            if (mData.statut === "actif") {
              setErrorStatus("already_active");
            }
            setLoading(false);
            return;
          }

          const { data: pData } = await supabase
            .from("parties")
            .select("*")
            .eq("activation_token", token)
            .maybeSingle();

          if (pData) {
            setParty({
              id: pData.id,
              nom: pData.nom,
              sigle: pData.sigle,
              dirigeantNom: pData.dirigeant_nom,
              dirigeantPrenom: pData.dirigeant_prenom,
              email: pData.email,
              activationToken: pData.activation_token,
              statut: pData.statut,
              licenceType: "Licence Officielle",
              dateCreation: pData.date_adhesion,
            });
            setTargetType("party");
            if (pData.statut === "actif") {
              setErrorStatus("already_active");
            }
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Erreur vérification Supabase client:", err);
        }
      }

      // 3. Fallback localStorage
      try {
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

        setErrorStatus("not_found");
      } catch (e) {
        console.error(e);
        setErrorStatus("not_found");
      } finally {
        setLoading(false);
      }
    }

    checkToken();
  }, [token]);

  const handleActivate = async (e: React.FormEvent) => {
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
      // 1. Appel API serveur pour mise à jour dans Supabase
      const res = await fetch("/api/activate-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          targetType,
          password,
        }),
      });

      const resJson = await res.json();
      if (!resJson.success) {
        throw new Error(resJson.error || "Erreur lors de l'activation.");
      }

      // 2. Synchronisation locale en cache
      try {
        if (targetType === "mandataire") {
          const stored = localStorage.getItem("cdt_mandataires");
          const mandatairesList: Mandataire[] = stored ? JSON.parse(stored) : [];
          const updatedMandataires = mandatairesList.map((m) => {
            if ((mandataire && m.id === mandataire.id) || m.activationToken === token) {
              return {
                ...m,
                statut: "actif" as const,
                password: password,
                dateActivation: new Date().toLocaleDateString("fr-FR"),
                tenantName: m.tenantName || mandataire?.tenantName || "Parti Octacore",
              };
            }
            return m;
          });
          localStorage.setItem("cdt_mandataires", JSON.stringify(updatedMandataires));
        } else {
          const stored = localStorage.getItem("cdt_parties");
          const partiesList: PartyTenant[] = stored ? JSON.parse(stored) : [];
          const updatedParties = partiesList.map((p) => {
            if ((party && p.id === party.id) || p.activationToken === token) {
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
      } catch (cacheErr) {
        console.warn("Mise à jour cache local warning:", cacheErr);
      }

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Erreur lors de l'activation:", err);
      setFormError(err.message || "Une erreur est survenue lors de l'enregistrement.");
      setIsSubmitting(false);
    }
  };

  // 1. ÉTAT CHARGEMENT : Carte blanche centrée et explicite
  if (loading) {
    return (
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-800 text-center space-y-4 my-auto animate-fade-in">
        <div className="w-10 h-10 mx-auto border-3 border-slate-200 border-t-[#000B58] rounded-full animate-spin" />
        <h2 className="text-base font-bold text-slate-900">Vérification de l&apos;invitation...</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Connexion sécurisée en cours au Centre de Tabulation. Veuillez patienter...
        </p>
      </div>
    );
  }

  // 2. ÉTAT LIEN NON TROUVÉ
  if (errorStatus === "not_found") {
    return (
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-800 text-center space-y-5 my-auto animate-fade-in">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Lien invalide ou introuvable</h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Ce lien d&apos;invitation est introuvable ou a déjà été renouvelé par le SuperAdmin.
          </p>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="w-full py-3 px-4 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md hover:opacity-95"
          style={{ backgroundColor: "#000B58" }}
        >
          Retour à la page de connexion
        </button>
      </div>
    );
  }

  // 3. ÉTAT COMPTE DÉJÀ ACTIVÉ
  if (errorStatus === "already_active") {
    return (
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-800 text-center space-y-5 my-auto animate-fade-in">
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
          className="w-full py-3 px-4 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md hover:opacity-95"
          style={{ backgroundColor: "#000B58" }}
        >
          Accéder à la connexion
        </button>
      </div>
    );
  }

  // 4. ÉTAT NORMAL : FORMULAIRE DE DÉFINITION DU MOT DE PASSE
  return (
    <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-800 my-auto animate-fade-in">
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
            Activation réussie !
          </h3>
          <p className="text-xs text-slate-600">
            Votre mot de passe confidentiel a été enregistré. Redirection vers l&apos;écran de connexion...
          </p>
        </div>
      ) : (
        <form onSubmit={handleActivate} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Nouveau mot de passe */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-900 block">
              Définir votre mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caractères minimum"
                className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 2. Confirmer le mot de passe */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-900 block">
              Confirmer le mot de passe <span className="text-red-500">*</span>
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
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden select-none font-sans text-slate-800"
      style={{
        backgroundColor: "#000B58",
        backgroundImage: "linear-gradient(135deg, #000B58 0%, #051147 50%, #010626 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Vagues douces d'arrière-plan */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none">
          <path
            d="M-100 500 C 300 300, 600 700, 1000 450 C 1300 250, 1500 400, 1600 350 L 1600 900 L -100 900 Z"
            fill="#1E3A8A"
          />
        </svg>
      </div>

      <Suspense
        fallback={
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-800 text-center space-y-4 my-auto animate-fade-in">
            <div className="w-10 h-10 mx-auto border-3 border-slate-200 border-t-[#000B58] rounded-full animate-spin" />
            <h2 className="text-base font-bold text-slate-900">Chargement de la page d&apos;activation...</h2>
          </div>
        }
      >
        <ActivationForm />
      </Suspense>
    </div>
  );
}
