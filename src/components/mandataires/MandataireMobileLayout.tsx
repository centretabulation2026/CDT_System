"use client";

import React from "react";
import { LogOut, Building, FileText } from "lucide-react";
import { CurrentUser } from "@/types/auth";
import { BureauxIcon, CollecteIcon, PushpinIcon } from "@/components/layout/CustomIcons";

interface MandataireMobileLayoutProps {
  currentUser: CurrentUser;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

interface TabItem {
  id: string;
  path: string;
  title: string;
  renderIcon: (isActive: boolean) => React.ReactNode;
}

export default function MandataireMobileLayout({
  currentUser,
  currentPath,
  onNavigate,
  onLogout,
  children,
}: MandataireMobileLayoutProps) {
  const partyName = currentUser.tenantName || "Parti Octacore";

  // Récupération dynamique du logo de l'entreprise / parti
  const [partyLogo, setPartyLogo] = React.useState<string | null>(
    currentUser.tenantLogoUrl || null
  );

  React.useEffect(() => {
    let isMounted = true;
    const loadPartyLogo = async () => {
      // 1. Priorité au logo transmis dans currentUser
      if (currentUser.tenantLogoUrl) {
        setPartyLogo(currentUser.tenantLogoUrl);
      }

      // 2. Tenter de lire dans localStorage
      try {
        const storedDirect =
          localStorage.getItem(`cdt_party_logo_${partyName}`) ||
          localStorage.getItem("cdt_party_logo_Parti Octacore") ||
          localStorage.getItem("cdt_current_party_logo");
        if (storedDirect && isMounted) {
          setPartyLogo(storedDirect);
        }

        const storedParties = localStorage.getItem("cdt_parties");
        if (storedParties) {
          const list = JSON.parse(storedParties);
          const match = list.find(
            (p: any) =>
              (currentUser.tenantId && p.id === currentUser.tenantId) ||
              (p.nom &&
                (p.nom.trim().toLowerCase() === partyName.trim().toLowerCase() ||
                 p.nom.trim().toLowerCase() === "parti octacore"))
          );
          if (match?.logoUrl && isMounted) {
            setPartyLogo(match.logoUrl);
          }
        }
      } catch (e) {}

      // 3. Récupération auprès de l'API serveur partagée (permet au mandataire de voir le logo uploadé par l'administrateur)
      try {
        const res = await fetch(`/api/party-logo?partyName=${encodeURIComponent(partyName)}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.logoUrl && isMounted) {
            setPartyLogo(data.logoUrl);
            try {
              localStorage.setItem(`cdt_party_logo_${partyName}`, data.logoUrl);
              localStorage.setItem("cdt_party_logo_Parti Octacore", data.logoUrl);
              localStorage.setItem("cdt_current_party_logo", data.logoUrl);
            } catch (e) {}
          }
        }
      } catch (e) {}
    };

    loadPartyLogo();
    window.addEventListener("cdt_party_logo_updated", loadPartyLogo);
    window.addEventListener("storage", loadPartyLogo);
    return () => {
      isMounted = false;
      window.removeEventListener("cdt_party_logo_updated", loadPartyLogo);
      window.removeEventListener("storage", loadPartyLogo);
    };
  }, [currentUser, partyName, currentUser.tenantLogoUrl]);

  // Configuration des 4 onglets obligatoires du mandataire
  const tabs: TabItem[] = [
    {
      id: "mon-bureau",
      path: "/app/mon-bureau",
      title: "Mon Bureau de vote",
      renderIcon: (isActive: boolean) => (
        <BureauxIcon
          size={26}
          className={`transition-all duration-200 ${
            isActive
              ? "text-[#000B58] scale-110 drop-shadow-xs"
              : "text-blue-400 hover:text-[#000B58] scale-100"
          }`}
        />
      ),
    },
    {
      id: "collecte",
      path: "/app/collecte",
      title: "Saisie des résultats",
      renderIcon: (isActive: boolean) => (
        <CollecteIcon
          size={26}
          className={`transition-all duration-200 ${
            isActive
              ? "text-[#000B58] scale-110 drop-shadow-xs"
              : "text-blue-400 hover:text-[#000B58] scale-100"
          }`}
        />
      ),
    },
    {
      id: "pv",
      path: "/app/pv",
      title: "Procès-Verbal (PV)",
      renderIcon: (isActive: boolean) => (
        <FileText
          size={26}
          strokeWidth={isActive ? 2.4 : 1.9}
          className={`transition-all duration-200 ${
            isActive
              ? "text-[#000B58] scale-110 drop-shadow-xs"
              : "text-blue-400 hover:text-[#000B58] scale-100"
          }`}
        />
      ),
    },
    {
      id: "guide",
      path: "/app/guide",
      title: "Guide du Mandataire",
      renderIcon: (isActive: boolean) => (
        <PushpinIcon
          size={26}
          className={`transition-all duration-200 ${
            isActive
              ? "text-[#000B58] scale-110 drop-shadow-xs"
              : "text-blue-400 hover:text-[#000B58] scale-100"
          }`}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col relative pb-24 font-sans select-none">
      {/* 1. EN-TÊTE SUPÉRIEUR SUR TOUTE LA LARGEUR */}
      <header className="sticky top-0 z-30 h-16 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 lg:px-12 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          {/* Logo officiel du parti défini par l'administrateur (lecture seule pour le mandataire) */}
          <div className="shrink-0 select-none">
            {partyLogo ? (
              <div className="w-10 h-10 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                <img
                  src={partyLogo}
                  alt={partyName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl border border-slate-200 bg-slate-100 flex items-center justify-center shrink-0 text-slate-400 shadow-xs">
                {/* Silhouette de profil vide "none" */}
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2a5 5 0 100 10 5 5 0 000-10zm-7 18a7 7 0 0114 0H5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <div>
            <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-none">
              Espace Mandataire
            </div>
            <div className="text-sm font-bold text-[#000B58] tracking-tight mt-0.5">
              {partyName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {currentUser.prenom} {currentUser.nom}
            </div>
            <div className="text-xs text-emerald-600 font-medium">
              {currentUser.bureauAssigne || "BV Assigné"}
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title="Déconnexion"
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. CORPS PRINCIPAL SUR TOUTE LA LARGEUR DE LA PAGE */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-6 overflow-y-auto">
        {children}
      </main>

      {/* 3. BARRE INFÉRIEURE D'ONGLETS SUR TOUTE LA LARGEUR DE LA PAGE (ICÔNES SEULEMENT, EN BLEU, SANS AUCUN BACKGROUND) */}
      <nav
        aria-label="Navigation mandataire"
        className="fixed bottom-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3 px-4 sm:px-8 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,11,88,0.07)]"
      >
        <div className="w-full flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive = currentPath === tab.path;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigate(tab.path)}
                title={tab.title}
                className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent border-none shadow-none cursor-pointer transition-transform active:scale-95 group"
                style={{
                  backgroundColor: "transparent",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {/* Icône seule, en bleu, sans aucun background */}
                {tab.renderIcon(isActive)}

                {/* Petit indicateur discret sous l'icône active */}
                <span
                  className={`h-1 rounded-full transition-all duration-200 mt-1 ${
                    isActive ? "w-4 bg-[#000B58]" : "w-0 bg-transparent opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
