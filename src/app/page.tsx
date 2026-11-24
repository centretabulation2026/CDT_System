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
import SuperAdminDashboardView from "@/components/superadmin/SuperAdminDashboardView";
import { CurrentUser } from "@/types/auth";

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
      setCurrentUser(user);

      // Si l'utilisateur est un mandataire, le positionner sur son bureau de vote
      if (user.userType === "mandataire") {
        setCurrentPath("/app/mon-bureau");
      } else {
        setCurrentPath("/app/dashboard");
      }

      // Charger mandataires depuis localStorage
      try {
        const storedMandataires = localStorage.getItem("cdt_mandataires");
        if (storedMandataires) {
          setMandataires(JSON.parse(storedMandataires));
        }
      } catch (e) {
        console.error("Erreur lecture cdt_mandataires:", e);
      }

      // Charger membres depuis localStorage
      try {
        const storedMembres = localStorage.getItem("cdt_membres");
        if (storedMembres) {
          setMembres(JSON.parse(storedMembres));
        }
      } catch (e) {
        console.error("Erreur lecture cdt_membres:", e);
      }
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

  const handleAddMembre = (newMembre: MembreParti) => {
    setMembres((prev) => {
      const updated = [newMembre, ...prev];
      try {
        localStorage.setItem("cdt_membres", JSON.stringify(updated));
      } catch (e) {
        console.error("Erreur sauvegarde cdt_membres:", e);
      }
      return updated;
    });
  };

  const handleDeleteMembre = (id: string) => {
    setMembres((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem("cdt_membres", JSON.stringify(updated));
      } catch (e) {
        console.error("Erreur suppression cdt_membres:", e);
      }
      return updated;
    });
  };

  const handleUpdateMembre = (updatedMembre: MembreParti) => {
    setMembres((prev) => {
      const updated = prev.map((m) => (m.id === updatedMembre.id ? updatedMembre : m));
      try {
        localStorage.setItem("cdt_membres", JSON.stringify(updated));
      } catch (e) {
        console.error("Erreur mise à jour cdt_membres:", e);
      }
      return updated;
    });
  };

  const handleUpdateAllMembres = (updatedList: MembreParti[]) => {
    setMembres(updatedList);
    try {
      localStorage.setItem("cdt_membres", JSON.stringify(updatedList));
    } catch (e) {
      console.error("Erreur mise à jour globale cdt_membres:", e);
    }
  };

  const handleAddBureau = (newBureau: BureauDeVote) => {
    setBureaux((prev) => [newBureau, ...prev]);
  };

  const handleDeleteBureau = (id: string) => {
    setBureaux((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAddMandataire = (newMandataire: Mandataire) => {
    setMandataires((prev) => {
      const updated = [newMandataire, ...prev];
      try {
        localStorage.setItem("cdt_mandataires", JSON.stringify(updated));
      } catch (e) {
        console.error("Erreur sauvegarde cdt_mandataires:", e);
      }
      return updated;
    });
  };

  const handleDeleteMandataire = (id: string) => {
    setMandataires((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem("cdt_mandataires", JSON.stringify(updated));
      } catch (e) {
        console.error("Erreur suppression cdt_mandataires:", e);
      }
      return updated;
    });
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

  const isMandataire = currentUser.userType === "mandataire";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-800 font-sans select-none">
      {/* 1. SIDEBAR DYNAMIQUE ADAPTÉE AU PROFIL (MEMBRE DU PARTI OU MANDATAIRE) */}
      <AppSidebar
        currentPath={currentPath}
        onNavigate={(path) => setCurrentPath(path)}
        tenantName={currentUser.tenantName || "Parti Démocratique Uni"}
        spaceTitle={isMandataire ? "ESPACE MANDATAIRE" : "ESPACE PARTI"}
        userName={`${currentUser.prenom} ${currentUser.nom}`}
        userRoleLabel={
          isMandataire
            ? `Mandataire • ${currentUser.bureauAssigne || "Terrain"}`
            : currentUser.roleTitle
        }
        menuItems={isMandataire ? MANDATAIRE_MENU : undefined}
        onLogout={handleLogout}
      />

      {/* 2. ZONE DE CONTENU PRINCIPALE */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* En-tête supérieur */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-slate-200 bg-white sticky top-0 z-20">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              {isMandataire
                ? "ESPACE MANDATAIRE — OPÉRATIONS DE TERRAIN"
                : "ESPACE PARTI — COMPTE DIRIGEANT"}
            </span>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              {getModuleTitle(currentPath, isMandataire)}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-900 leading-tight">
                {currentUser.prenom} {currentUser.nom}
              </div>
              <div className="text-[10px] text-emerald-600 font-mono font-medium truncate max-w-xs">
                {isMandataire
                  ? currentUser.bureauAssigne || "Mandataire de terrain"
                  : `${currentUser.roleTitle} • Licence Activée`}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs font-mono text-slate-600 hover:text-[#000B58] border border-slate-200 px-2.5 py-1 rounded-md hover:border-slate-400 transition-colors cursor-pointer"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Corps du module actif selon le profil */}
        <main className="p-8 flex-1">
          {isMandataire ? (
            /* ================= VUES DÉDIÉES AU MANDATAIRE ================= */
            currentPath === "/app/mon-bureau" ? (
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
              <MandataireGuideView />
            ) : (
              <MonBureauView
                currentUser={currentUser}
                onNavigate={(path) => setCurrentPath(path)}
              />
            )
          ) : (
            /* ================= VUES DU MEMBRE / DIRIGEANT ================= */
            currentPath === "/app/dashboard" ? (
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
                tenantName={currentUser.tenantName || "Parti Démocratique Uni"}
              />
            ) : (
              <div className="border border-dashed border-slate-300 bg-white rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {getModuleTitle(currentPath, false)}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Module vierge — Prêt pour configuration et développement progressif.
                </p>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
