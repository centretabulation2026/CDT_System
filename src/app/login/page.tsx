"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import { CurrentUser, PartyTenant } from "@/types/auth";
import { SystemLogoIcon } from "@/components/layout/CustomIcons";

export default function LoginPage() {
  const router = useRouter();

  // Par défaut, pré-rempli avec les identifiants SuperAdmin pour faciliter les tests
  const [email, setEmail] = useState("pitonrodjy@gmail.com");
  const [password, setPassword] = useState("Pitonrp8$");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setErrorMessage("Veuillez saisir votre adresse e-mail.");
      return;
    }
    if (!cleanPassword) {
      setErrorMessage("Veuillez saisir votre mot de passe.");
      return;
    }

    setIsLoading(true);

    let loggedUser: CurrentUser | null = null;

    // 1. Authentification SuperAdmin de la plateforme
    if (cleanEmail === "pitonrodjy@gmail.com") {
      if (cleanPassword === "Pitonrp8$") {
        loggedUser = {
          id: "usr-superadmin",
          nom: "Piton",
          prenom: "Rodjesky",
          email: "pitonrodjy@gmail.com",
          userType: "superadmin",
          roleTitle: "Super Administrateur Plateforme",
        };
      } else {
        setIsLoading(false);
        setErrorMessage("Mot de passe incorrect pour le compte SuperAdmin.");
        return;
      }
    } else {
      // 2. Recherche dans les partis politiques créés via le SuperAdmin
      try {
        const storedParties = localStorage.getItem("cdt_parties");
        const parties: PartyTenant[] = storedParties ? JSON.parse(storedParties) : [];

        const matchingParty = parties.find((p) => p.email.toLowerCase() === cleanEmail);

        if (matchingParty) {
          if (matchingParty.statut === "en_attente") {
            setIsLoading(false);
            setErrorMessage(
              "Ce compte n'a pas encore été activé. Veuillez utiliser le lien d'invitation sécurisé pour définir votre mot de passe."
            );
            return;
          }

          if (matchingParty.password === cleanPassword) {
            loggedUser = {
              id: `usr-party-${matchingParty.id}`,
              nom: matchingParty.dirigeantNom,
              prenom: matchingParty.dirigeantPrenom,
              email: matchingParty.email,
              userType: "membre",
              roleTitle: "PDG du Parti",
              tenantId: matchingParty.id,
              tenantName: matchingParty.nom,
              telephone: "+509 3712-4589",
              departement: "Ouest",
              commune: "Port-au-Prince",
            };
          } else {
            setIsLoading(false);
            setErrorMessage("Mot de passe incorrect.");
            return;
          }
        }
      } catch (err) {
        console.error("Erreur lecture partis:", err);
      }

      // 3. Recherche dans les mandataires de terrain enregistrés
      if (!loggedUser) {
        try {
          const storedMandataires = localStorage.getItem("cdt_mandataires");
          if (storedMandataires) {
            const mandataires = JSON.parse(storedMandataires);
            const matchingMandataire = mandataires.find(
              (m: any) => m.email && m.email.toLowerCase() === cleanEmail
            );
            if (matchingMandataire) {
              // Vérification du statut d'activation
              if (matchingMandataire.statut === "en_attente") {
                setIsLoading(false);
                setErrorMessage(
                  "Ce compte mandataire n'a pas encore été activé. Veuillez cliquer sur le lien reçu par e-mail pour définir votre mot de passe sécurisé."
                );
                return;
              }

              const expectedPassword = matchingMandataire.password || "Mandataire2026$";
              if (cleanPassword === expectedPassword) {
                loggedUser = {
                  id: matchingMandataire.id || `usr-mandataire-${Date.now()}`,
                  nom: matchingMandataire.nom || "Mandataire",
                  prenom: matchingMandataire.prenom || "Terrain",
                  email: cleanEmail,
                  userType: "mandataire",
                  roleTitle: "Mandataire de terrain",
                  bureauAssigne: matchingMandataire.bureauAssigne || "Non assigné",
                  telephone: matchingMandataire.telephone || "",
                  commune: matchingMandataire.ville || "Port-au-Prince",
                  departement: matchingMandataire.departement || "Ouest",
                };
              } else {
                setIsLoading(false);
                setErrorMessage("Mot de passe incorrect pour le compte mandataire.");
                return;
              }
            }
          }
        } catch (err) {
          console.error("Erreur lecture mandataires:", err);
        }
      }

      // 4. Recherche dans les membres du parti enregistrés
      if (!loggedUser) {
        try {
          const storedMembres = localStorage.getItem("cdt_membres");
          if (storedMembres) {
            const membres = JSON.parse(storedMembres);
            const matchingMembre = membres.find(
              (m: any) => m.email && m.email.toLowerCase() === cleanEmail
            );
            if (matchingMembre) {
              // Vérification si le compte a reçu des accès depuis Gestion des accès
              if (!matchingMembre.password) {
                setIsLoading(false);
                setErrorMessage(
                  "Ce membre n'a pas encore d'accès configuré. L'administrateur du parti doit lui attribuer ses accès dans l'onglet « Gestion des accès »."
                );
                return;
              }

              if (matchingMembre.statut === "inactif") {
                setIsLoading(false);
                setErrorMessage("Ce compte membre a été désactivé par l'administrateur du parti.");
                return;
              }

              const expectedPassword = matchingMembre.password;
              if (cleanPassword === expectedPassword) {
                loggedUser = {
                  id: matchingMembre.id || `usr-membre-${Date.now()}`,
                  nom: matchingMembre.nom || "Membre",
                  prenom: matchingMembre.prenom || "Parti",
                  email: cleanEmail,
                  userType: "membre",
                  roleTitle: matchingMembre.role || "Membre du Parti",
                  telephone: matchingMembre.telephone || "",
                  commune: matchingMembre.ville || "Port-au-Prince",
                  departement: matchingMembre.departement || "Ouest",
                };
              } else {
                setIsLoading(false);
                setErrorMessage("Mot de passe incorrect pour le compte membre.");
                return;
              }
            }
          }
        } catch (err) {
          console.error("Erreur lecture membres:", err);
        }
      }
    }

    // Si aucun compte trouvé
    if (!loggedUser) {
      setIsLoading(false);
      setErrorMessage(
        "Identifiants non reconnus. Aucun compte actif n'est associé à cette adresse e-mail."
      );
      return;
    }

    // Sauvegarde de la session active
    try {
      localStorage.setItem("cdt_current_user", JSON.stringify(loggedUser));
    } catch (err) {
      console.error("Erreur sauvegarde session:", err);
    }

    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 400);
    }, 300);
  };

  const handleFillSuperAdmin = () => {
    setEmail("pitonrodjy@gmail.com");
    setPassword("Pitonrp8$");
    setErrorMessage(null);
  };

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

      {/* CARTE DE CONNEXION (SEULEMENT EMAIL & MOT DE PASSE) */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-slate-800 my-auto">
        {/* En-tête de connexion */}
        <div className="text-center mb-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-3 flex items-center justify-center">
            <SystemLogoIcon className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
            CDT SYSTEM — ACCÈS CENTRALISÉ
          </span>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Connexion au Système
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vos identifiants déterminent automatiquement votre niveau d&apos;accès
          </p>
        </div>

        {/* Formulaire strict : Email + Mot de passe */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Adresse e-mail */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-900 block">
              Adresse e-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nom@domaine.com"
              className="w-full px-3.5 py-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all"
            />
          </div>

          {/* 2. Mot de passe */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-900 block">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe confidentiel"
                className="w-full pl-3.5 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-70 shadow-md mt-5 hover:opacity-95 active:scale-95"
            style={{ backgroundColor: "#000B58" }}
          >
            {isLoading ? (
              <span className="font-mono">AUTHENTIFICATION EN COURS...</span>
            ) : loginSuccess ? (
              <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> CONNEXION RÉUSSIE
              </span>
            ) : (
              <span>Se connecter au Système →</span>
            )}
          </button>
        </form>

        {/* Raccourci d'assistance pour le SuperAdmin */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">
            Console Plateforme
          </span>
          <button
            type="button"
            onClick={handleFillSuperAdmin}
            className="text-[11px] font-medium text-[#000B58] hover:underline cursor-pointer"
          >
            Remplir compte SuperAdmin
          </button>
        </div>
      </div>
    </div>
  );
}
