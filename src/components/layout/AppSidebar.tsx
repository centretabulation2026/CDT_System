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
    iconName: "ShieldCheck",
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
}

export default function AppSidebar({
  currentPath = "/app/dashboard",
  onNavigate,
  tenantName = "Parti Démocratique Uni",
  spaceTitle = "ESPACE PARTI",
  userName = "Rodjesky Piton",
  userRoleLabel = "PDG du Parti",
  menuItems,
  onLogout,
}: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const activeMenu = menuItems && menuItems.length > 0 ? menuItems : TENANT_EXACT_MENU;

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
          <div className="shrink-0 text-white flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 21h18M3 10h18M5 10v11M9 10v11M15 10v11M19 10v11M12 2L2 7h20L12 2z" />
            </svg>
          </div>

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
