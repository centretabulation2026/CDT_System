"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IconRenderer } from "./IconHelper";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

export interface TenantMenuItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  badge?: string;
}

export const TENANT_EXACT_MENU: TenantMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/app/dashboard",
    iconName: "LayoutDashboard",
  },
  {
    id: "collecte",
    label: "Collecte des résultats",
    href: "/app/collecte",
    iconName: "BarChart3",
  },
  {
    id: "bureaux",
    label: "Bureaux de vote",
    href: "/app/bureaux",
    iconName: "Building",
  },
  {
    id: "membres",
    label: "Membres du parti",
    href: "/app/members",
    iconName: "Users",
  },
  {
    id: "gestion-acces",
    label: "Gestion des accès",
    href: "/app/gestion-acces",
    iconName: "KeyRound",
  },
  {
    id: "mandataires",
    label: "Mandataires",
    href: "/app/mandataires",
    iconName: "UserCheck",
  },
  {
    id: "autres-partis",
    label: "Autres partis",
    href: "/app/autres-partis",
    iconName: "Flag",
  },
  {
    id: "pv",
    label: "Procès Verbaux",
    href: "/app/pv",
    iconName: "FileText",
  },
  {
    id: "guide",
    label: "Guide Mandataires",
    href: "/app/guide",
    iconName: "Pushpin",
  },
];

export const MANDATAIRE_MENU: TenantMenuItem[] = [
  {
    id: "mon-bureau",
    label: "Mon Bureau de vote",
    href: "/app/mon-bureau",
    iconName: "Building",
  },
  {
    id: "collecte",
    label: "Saisie des résultats",
    href: "/app/collecte",
    iconName: "BarChart3",
  },
  {
    id: "pv",
    label: "Procès-Verbal (PV)",
    href: "/app/pv",
    iconName: "FileText",
  },
  {
    id: "guide",
    label: "Guide du Mandataire",
    href: "/app/guide",
    iconName: "Pushpin",
  },
];

interface AppSidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  tenantName?: string;
  spaceTitle?: string;
  userName?: string;
  userRoleLabel?: string;
  menuItems?: TenantMenuItem[];
  onLogout?: () => void;
  tenantLogoUrl?: string;
}

export default function AppSidebar({
  currentPath = "/app/dashboard",
  onNavigate,
  tenantName = "Parti Octacore",
  spaceTitle = "ESPACE PARTI",
  userName = "Rodjesky Piton",
  userRoleLabel = "PDG du Parti",
  menuItems,
  onLogout,
  tenantLogoUrl,
}: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const activeMenu = menuItems && menuItems.length > 0 ? menuItems : TENANT_EXACT_MENU;

  // Récupération dynamique et mise à jour du logo de l'entreprise / parti
  const [partyLogo, setPartyLogo] = useState<string | null>(tenantLogoUrl || null);

  React.useEffect(() => {
    let isMounted = true;
    const loadPartyLogo = async () => {
      if (tenantLogoUrl) {
        setPartyLogo(tenantLogoUrl);
        return;
      }
      try {
        const storedDirect =
          localStorage.getItem(`cdt_party_logo_${tenantName}`) ||
          localStorage.getItem("cdt_party_logo_Parti Octacore") ||
          localStorage.getItem("cdt_current_party_logo");
        if (storedDirect && isMounted) {
          setPartyLogo(storedDirect);
          // Auto-synchronisation vers l'API serveur pour assurer l'accès immédiat aux mandataires
          fetch("/api/party-logo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              partyName: tenantName || "Parti Octacore",
              logoUrl: storedDirect,
            }),
          }).catch(() => {});
        }

        const storedParties = localStorage.getItem("cdt_parties");
        if (storedParties) {
          const list = JSON.parse(storedParties);
          const match = list.find(
            (p: any) =>
              p.nom && p.nom.trim().toLowerCase() === tenantName.trim().toLowerCase()
          );
          if (match?.logoUrl && isMounted) {
            setPartyLogo(match.logoUrl);
            return;
          }
        }

        // Récupération depuis l'API serveur partagée
        const res = await fetch(`/api/party-logo?partyName=${encodeURIComponent(tenantName)}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.logoUrl && isMounted) {
            setPartyLogo(data.logoUrl);
            localStorage.setItem(`cdt_party_logo_${tenantName}`, data.logoUrl);
            localStorage.setItem("cdt_party_logo_Parti Octacore", data.logoUrl);
            localStorage.setItem("cdt_current_party_logo", data.logoUrl);
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
  }, [tenantName, tenantLogoUrl]);

  // Fonction utilitaire pour compresser/redimensionner le logo (évite QuotaExceededError et limite de taille API)
  const compressLogoImage = (file: File, maxSize = 300): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/png"));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const res = await compressLogoImage(file);
        setPartyLogo(res);

        try {
          localStorage.setItem(`cdt_party_logo_${tenantName}`, res);
          localStorage.setItem("cdt_party_logo_Parti Octacore", res);
          localStorage.setItem("cdt_current_party_logo", res);

          const storedUser = localStorage.getItem("cdt_current_user");
          if (storedUser) {
            const u = JSON.parse(storedUser);
            u.tenantLogoUrl = res;
            localStorage.setItem("cdt_current_user", JSON.stringify(u));
          }

          const storedParties = localStorage.getItem("cdt_parties");
          if (storedParties) {
            const list = JSON.parse(storedParties);
            const updated = list.map((p: any) => {
              if (
                p.nom &&
                (p.nom.trim().toLowerCase() === tenantName.trim().toLowerCase() ||
                 p.nom.trim().toLowerCase() === "parti octacore")
              ) {
                return { ...p, logoUrl: res };
              }
              return p;
            });
            localStorage.setItem("cdt_parties", JSON.stringify(updated));
          }
        } catch (storageErr) {
          console.error("Erreur stockage local:", storageErr);
        }

        window.dispatchEvent(new Event("cdt_party_logo_updated"));

        // Sauvegarde automatique sur l'API serveur pour diffusion immédiate à tous les mandataires
        await fetch("/api/party-logo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            partyName: tenantName || "Parti Octacore",
            logoUrl: res,
          }),
        });
      } catch (err) {
        console.error("Erreur upload logo:", err);
      }
    }
  };

  const initials =
    userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "RP";

  const handleItemClick = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
  };

  return (
    <aside
      className={`relative h-screen shrink-0 flex flex-col justify-between transition-all duration-300 z-30 select-none shadow-2xl text-white font-sans ${
        collapsed ? "w-16 p-2.5" : "w-[285px] p-4"
      }`}
      style={{ backgroundColor: "#000B58" }}
    >
      {/* Bouton de rétractation (Desktop Collapse Toggle) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Agrandir le menu" : "Réduire le menu"}
        className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-[#000B58] border border-white/40 text-white flex items-center justify-center shadow-lg hover:border-white transition-all cursor-pointer z-40"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* 1. EN-TÊTE : LOGO & NOM DU PARTI */}
      <div className="space-y-3">
        <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : ""}`}>
          <label
            htmlFor="sidebar-party-logo-upload"
            className="cursor-pointer group relative block shrink-0"
            title="Logo officiel de l'entreprise (Cliquer pour téléverser)"
          >
            <input
              type="file"
              id="sidebar-party-logo-upload"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            {partyLogo ? (
              <div className="w-9 h-9 rounded-xl bg-white overflow-hidden flex items-center justify-center border border-white/30 shadow-xs group-hover:ring-2 group-hover:ring-blue-300 transition-all shrink-0">
                <img
                  src={partyLogo}
                  alt={tenantName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/60 group-hover:bg-white/20 group-hover:text-white transition-all shadow-xs shrink-0">
                {/* Silhouette de profil vide "none" */}
                <svg
                  className="w-5 h-5"
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
          </label>

          {!collapsed && (
            <div className="truncate">
              <span className="block text-[9px] tracking-[0.2em] font-mono text-blue-200/90 uppercase font-medium">
                {spaceTitle}
              </span>
              <h1 className="text-xs font-semibold tracking-tight text-white truncate">
                {tenantName}
              </h1>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 pt-0.5" />
      </div>

      {/* 2. CORPS DU MENU : OPTIONS PLUS ÉPURÉES & COMPACTES AVEC ÉCART AUGMENTÉ */}
      <nav
        className="flex-1 space-y-3.5 my-3 overflow-y-auto no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {activeMenu.map((item) => {
          const isActive = currentPath === item.href;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.href)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-bold transition-all cursor-pointer rounded-xl group ${
                isActive
                  ? "bg-white/15 text-white shadow-xs"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              } ${collapsed ? "justify-center px-2 py-2" : ""}`}
            >
              <div className="flex items-center gap-3 truncate">
                <IconRenderer
                  name={item.iconName}
                  size={22}
                  className="w-[22px] h-[22px] shrink-0 text-white"
                  strokeWidth={2.2}
                />
                {!collapsed && (
                  <span className="truncate tracking-tight font-bold text-white text-[13px]">
                    {item.label}
                  </span>
                )}
              </div>

              {!collapsed && item.badge && (
                <span className="text-xs font-mono text-amber-300 font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. PIED DE SIDEBAR : PROFIL UTILISATEUR */}
      <div className="space-y-2.5 pt-2.5 border-t border-white/10">
        <div className="relative">
          <div
            className={`flex items-center gap-2 py-1 px-1 ${
              collapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center font-bold text-[10px] text-white shrink-0">
                {initials}
              </div>
              {!collapsed && (
                <div className="text-left truncate">
                  <div className="text-xs font-semibold text-white truncate leading-tight">
                    {userName}
                  </div>
                  <div className="text-[10px] text-blue-200/80 font-mono tracking-wide truncate">
                    {userRoleLabel}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {!collapsed ? (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 border border-white/20 hover:border-white text-[10px] font-mono tracking-wider text-white/80 hover:text-white transition-all rounded-lg cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>DÉCONNEXION</span>
          </button>
        ) : (
          <button
            onClick={onLogout}
            title="Déconnexion"
            className="w-7 h-7 mx-auto flex items-center justify-center border border-white/20 hover:border-white text-white/80 hover:text-white rounded-lg cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
}
