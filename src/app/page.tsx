"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppSidebar, { MANDATAIRE_MENU } from "@/components/layout/AppSidebar";
import BureauxView, {
  BureauDeVote,
  INITIAL_BUREAUX,
} from "@/components/bureaux/BureauxView";
import PartyDashboardView from "@/components/dashboard/PartyDashboardView";
import AutresPartisView, {
  AutreParti,
  INITIAL_AUTRES_PARTIS,
} from "@/components/autres-partis/AutresPartisView";
import MembersView, {
  MembreParti,
  INITIAL_MEMBRES,
} from "@/components/members/MembersView";
import AccessManagementView from "@/components/access/AccessManagementView";
import MandatairesView, {
  Mandataire,
  INITIAL_MANDATAIRES,
} from "@/components/mandataires/MandatairesView";
import MonBureauView from "@/components/mandataires/MonBureauView";
import MandataireCollecteView from "@/components/mandataires/MandataireCollecteView";
import MandatairePVView from "@/components/mandataires/MandatairePVView";
import MandataireGuideView from "@/components/mandataires/MandataireGuideView";
import MandataireMobileLayout from "@/components/mandataires/MandataireMobileLayout";
import SuperAdminDashboardView from "@/components/superadmin/SuperAdminDashboardView";
import { CurrentUser } from "@/types/auth";
import {
  fetchBureauxFromSupabase,
  saveBureauToSupabase,
  deleteBureauFromSupabase,
  fetchMembresFromSupabase,
  saveMembreToSupabase,
  deleteMembreFromSupabase,
  fetchMandatairesFromSupabase,
  saveMandataireToSupabase,
  deleteMandataireFromSupabase,
} from "@/lib/supabaseService";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function UnifiedElectoralPlatform() {
  const router = useRouter();

  // Utilisateur actuellement authentifié
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Route courante
  const [currentPath, setCurrentPath] = useState<string>("/app/dashboard");

  // Données centralisées partagées entre modules
  const [autresPartis, setAutresPartis] = useState<AutreParti[]>(INITIAL_AUTRES_PARTIS);
  const [membres, setMembres] = useState<MembreParti[]>(INITIAL_MEMBRES);
  const [bureaux, setBureaux] = useState<BureauDeVote[]>(INITIAL_BUREAUX);
  const [mandataires, setMandataires] = useState<Mandataire[]>(INITIAL_MANDATAIRES);

  // VÉRIFICATION STRICTE DE L'AUTHENTIFICATION : TOUJOURS PASSER PAR LE LOGIN
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cdt_current_user");
      if (!stored) {
        router.push("/login");
        return;
      }
      const user = JSON.parse(stored) as CurrentUser;
      if (!user || !user.userType) {
        router.push("/login");
        return;
      }

      // Si le mandataire n'a pas de tenantName en cache ou a l'ancien fallback, résoudre son vrai parti (ex: Parti Octacore)
      if (user.userType === "mandataire" && (!user.tenantName || user.tenantName === "Parti Démocratique Uni")) {
        try {
          const storedParties = localStorage.getItem("cdt_parties");
          if (storedParties) {
            const partiesList = JSON.parse(storedParties);
            if (partiesList && partiesList.length > 0) {
              user.tenantName = partiesList[0].nom;
              localStorage.setItem("cdt_current_user", JSON.stringify(user));
            }
          }
        } catch (e) {}
      }

      // Résoudre le logo du parti s'il n'est pas encore présent
      if (!user.tenantLogoUrl) {
        try {
          const directLogo =
            localStorage.getItem(`cdt_party_logo_${user.tenantName}`) ||
            localStorage.getItem("cdt_party_logo_Parti Octacore") ||
            localStorage.getItem("cdt_current_party_logo");
          if (directLogo) {
            user.tenantLogoUrl = directLogo;
          }
        } catch (e) {}
      }

      setCurrentUser(user);

      // Récupérer le logo officiel du parti depuis l'API serveur pour assurer la synchronisation mandataire <-> administrateur
      const syncPartyLogo = async () => {
        try {
          const pName = user.tenantName || "Parti Octacore";
          const res = await fetch(`/api/party-logo?partyName=${encodeURIComponent(pName)}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.logoUrl && data.logoUrl !== user.tenantLogoUrl) {
              user.tenantLogoUrl = data.logoUrl;
              setCurrentUser({ ...user });
              localStorage.setItem("cdt_current_user", JSON.stringify(user));
              localStorage.setItem(`cdt_party_logo_${pName}`, data.logoUrl);
              localStorage.setItem("cdt_party_logo_Parti Octacore", data.logoUrl);
              localStorage.setItem("cdt_current_party_logo", data.logoUrl);
              window.dispatchEvent(new Event("cdt_party_logo_updated"));
            }
          }
        } catch (err) {}
      };
      syncPartyLogo();

      // Si l'utilisateur est un mandataire, le positionner sur son bureau de vote
      if (user.userType === "mandataire") {
        setCurrentPath("/app/mon-bureau");
      } else {
        setCurrentPath("/app/dashboard");
      }

      // Charger mandataires, membres et bureaux depuis Supabase en priorité
      const loadSupabaseData = async () => {
        if (isSupabaseConfigured) {
          try {
            const [supaMandataires, supaMembres, supaBureaux] = await Promise.all([
              fetchMandatairesFromSupabase(),
              fetchMembresFromSupabase(),
              fetchBureauxFromSupabase(),
            ]);

            // Mettre à jour dynamiquement le parti du mandataire depuis Supabase
            if (user.userType === "mandataire" && (!user.tenantName || user.tenantName === "Parti Démocratique Uni")) {
              try {
                const { data: pData } = await supabase
                  .from("parties")
                  .select("nom")
                  .order("created_at", { ascending: false })
                  .limit(1)
                  .maybeSingle();

                if (pData?.nom) {
                  user.tenantName = pData.nom;
                  setCurrentUser({ ...user });
                  localStorage.setItem("cdt_current_user", JSON.stringify(user));
                }
              } catch (e) {}
            }

            if (supaMandataires && supaMandataires.length > 0) {
              setMandataires(supaMandataires);
              localStorage.setItem("cdt_mandataires", JSON.stringify(supaMandataires));
            }
            if (supaMembres && supaMembres.length > 0) {
              setMembres(supaMembres);
              localStorage.setItem("cdt_membres", JSON.stringify(supaMembres));
            }
            if (supaBureaux && supaBureaux.length > 0) {
              setBureaux(supaBureaux);
            }
          } catch (e) {
            console.error("Erreur chargement Supabase:", e);
          }
        }
      }

      loadSupabaseData();

      // Fallback local initial
      try {
        const storedMandataires = localStorage.getItem("cdt_mandataires");
        if (storedMandataires) {
          setMandataires(JSON.parse(storedMandataires));
        }
      } catch (e) {}

      try {
        const storedMembres = localStorage.getItem("cdt_membres");
        if (storedMembres) {
          setMembres(JSON.parse(storedMembres));
        }
      } catch (e) {}
    } catch (err) {
      router.push("/login");
    } finally {
      setIsAuthChecking(false);
    }
  }, [router]);

  // Déconnexion
  const handleLogout = () => {
    try {
      localStorage.removeItem("cdt_current_user");
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    router.push("/login");
  };

  const handleAddParti = (newParti: AutreParti) => {
    setAutresPartis((prev) => [newParti, ...prev]);
  };

  const handleDeleteParti = (id: string) => {
    setAutresPartis((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddMembre = async (newMembre: MembreParti) => {
    setMembres((prev) => {
      const updated = [newMembre, ...prev];
      try {
        localStorage.setItem("cdt_membres", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    await saveMembreToSupabase(newMembre);
  };

  const handleDeleteMembre = async (id: string) => {
    setMembres((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem("cdt_membres", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    await deleteMembreFromSupabase(id);
  };

  const handleUpdateMembre = async (updatedMembre: MembreParti) => {
    setMembres((prev) => {
      const updated = prev.map((m) => (m.id === updatedMembre.id ? updatedMembre : m));
      try {
        localStorage.setItem("cdt_membres", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    await saveMembreToSupabase(updatedMembre);
  };

  const handleUpdateAllMembres = (updatedList: MembreParti[]) => {
    setMembres(updatedList);
    try {
      localStorage.setItem("cdt_membres", JSON.stringify(updatedList));
    } catch (e) {
      console.error("Erreur mise à jour globale cdt_membres:", e);
    }
  };

  const handleAddBureau = async (newBureau: BureauDeVote) => {
    setBureaux((prev) => [newBureau, ...prev]);
    await saveBureauToSupabase(newBureau);
  };

  const handleDeleteBureau = async (id: string) => {
    setBureaux((prev) => prev.filter((b) => b.id !== id));
    await deleteBureauFromSupabase(id);
  };

  const handleAddMandataire = async (newMandataire: Mandataire) => {
    let isDuplicate = false;
    setMandataires((prev) => {
      if (
        newMandataire.email &&
        prev.some(
          (m) =>
            m.email &&
            m.email.trim().toLowerCase() === newMandataire.email.trim().toLowerCase()
        )
      ) {
        isDuplicate = true;
        return prev;
      }
      const updated = [newMandataire, ...prev];
      try {
        localStorage.setItem("cdt_mandataires", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (!isDuplicate) {
      await saveMandataireToSupabase(newMandataire);
    }
  };

  const handleDeleteMandataire = async (id: string) => {
    setMandataires((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem("cdt_mandataires", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    await deleteMandataireFromSupabase(id);
  };

  const getModuleTitle = (path: string, isMandataire: boolean) => {
    if (isMandataire) {
      switch (path) {
        case "/app/mon-bureau":
          return "Mon Bureau de vote";
        case "/app/collecte":
          return "Saisie des résultats";
        case "/app/pv":
          return "Procès-Verbal (PV)";
        case "/app/guide":
          return "Guide du Mandataire";
        default:
          return "Mon Bureau de vote";
      }
    }

    switch (path) {
      case "/app/dashboard":
        return "Dashboard";
      case "/app/collecte":
      case "/app/results":
        return "Collecte des résultats";
      case "/app/bureaux":
        return "Bureaux de vote";
      case "/app/members":
        return "Membres du parti";
      case "/app/gestion-acces":
        return "Gestion des accès";
      case "/app/mandataires":
        return "Mandataires";
      case "/app/autres-partis":
        return "Autres partis";
      case "/app/pv":
        return "Procès Verbaux";
      case "/app/guide":
        return "Guide des Mandataires";
      default:
        return "Dashboard";
    }
  };

  // Écran d'attente d'authentification
  if (isAuthChecking || !currentUser) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#000B58] text-white font-sans select-none">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-xs font-mono text-blue-200/80 tracking-wider">
            VÉRIFICATION DE L'HABILITATION...
          </p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est le SuperAdmin, afficher le tableau de bord SuperAdmin
  if (currentUser.userType === "superadmin") {
    return <SuperAdminDashboardView onLogout={handleLogout} />;
  }

  // Si l'utilisateur est un mandataire, afficher le format application mobile avec icônes en bas
  if (currentUser.userType === "mandataire") {
    return (
      <MandataireMobileLayout
        currentUser={currentUser}
        currentPath={currentPath}
        onNavigate={(path) => setCurrentPath(path)}
        onLogout={handleLogout}
      >
        {currentPath === "/app/mon-bureau" ? (
          <MonBureauView
            currentUser={currentUser}
            onNavigate={(path) => setCurrentPath(path)}
          />
        ) : currentPath === "/app/collecte" ? (
          <MandataireCollecteView
            currentUser={currentUser}
            autresPartis={autresPartis}
          />
        ) : currentPath === "/app/pv" ? (
          <MandatairePVView currentUser={currentUser} />
        ) : currentPath === "/app/guide" ? (
          <MandataireGuideView currentUser={currentUser} />
        ) : (
          <MonBureauView
            currentUser={currentUser}
            onNavigate={(path) => setCurrentPath(path)}
          />
        )}
      </MandataireMobileLayout>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-800 font-sans select-none">
      {/* 1. SIDEBAR DYNAMIQUE ADAPTÉE AU COMPTE DIRIGEANT DU PARTI */}
      <AppSidebar
        currentPath={currentPath}
        onNavigate={(path) => setCurrentPath(path)}
        tenantName={currentUser.tenantName || "Parti Octacore"}
        spaceTitle="ESPACE PARTI"
        userName={`${currentUser.prenom} ${currentUser.nom}`}
        userRoleLabel={currentUser.roleTitle}
        onLogout={handleLogout}
        tenantLogoUrl={currentUser.tenantLogoUrl}
      />

      {/* 2. ZONE DE CONTENU PRINCIPALE (DIRIGEANT / MEMBRE) */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* En-tête supérieur épuré */}
        <header className="h-14 px-8 flex items-center justify-end border-b border-slate-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-900 leading-tight">
                {currentUser.prenom} {currentUser.nom}
              </div>
              <div className="text-xs text-emerald-600 font-medium truncate max-w-xs">
                {`${currentUser.roleTitle} • Licence Activée`}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs text-slate-600 hover:text-[#000B58] border border-slate-200 px-3 py-1.5 rounded-lg hover:border-slate-400 transition-colors cursor-pointer"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Corps du module actif pour les membres du parti */}
        <main className="p-8 flex-1">
          {currentPath === "/app/dashboard" ? (
            <PartyDashboardView
              onNavigate={(path) => setCurrentPath(path)}
              autresPartis={autresPartis}
              totalBureaux={bureaux.length}
              totalMembres={membres.length}
              totalMandataires={mandataires.length}
            />
          ) : currentPath === "/app/bureaux" ? (
            <BureauxView
              bureauxList={bureaux}
              onAddBureau={handleAddBureau}
              onDeleteBureau={handleDeleteBureau}
            />
          ) : currentPath === "/app/mandataires" ? (
            <MandatairesView
              mandatairesList={mandataires}
              bureauxList={bureaux}
              currentUser={currentUser}
              onAddMandataire={handleAddMandataire}
              onDeleteMandataire={handleDeleteMandataire}
            />
          ) : currentPath === "/app/autres-partis" ? (
            <AutresPartisView
              partisList={autresPartis}
              onAddParti={handleAddParti}
              onDeleteParti={handleDeleteParti}
            />
          ) : currentPath === "/app/members" ? (
            <MembersView
              membresList={membres}
              onAddMembre={handleAddMembre}
              onDeleteMembre={handleDeleteMembre}
            />
          ) : currentPath === "/app/gestion-acces" ? (
            <AccessManagementView
              membresList={membres}
              onUpdateMembre={handleUpdateMembre}
              onUpdateAllMembres={handleUpdateAllMembres}
              tenantName={currentUser.tenantName || "Parti Octacore"}
            />
          ) : currentPath === "/app/guide" ? (
            <MandataireGuideView currentUser={currentUser} />
          ) : (
            <div className="border border-dashed border-slate-300 bg-white rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {getModuleTitle(currentPath, false)}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Module vierge — Prêt pour configuration et développement progressif.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
