"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ADMIN_NAVIGATION } from "@/config/navigation";
import { IconRenderer } from "./IconHelper";
import {
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ArrowRightLeft,
} from "lucide-react";

interface AdminSidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  pendingPaymentsCount?: number;
}

export default function AdminSidebar({
  currentPath = "/admin/dashboard",
  onNavigate,
  pendingPaymentsCount = 3,
}: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleItemClick = (href: string) => {
    if (onNavigate) {
      onNavigate(href);
    }
  };

  return (
    <aside
      className={`relative h-screen shrink-0 flex flex-col justify-between transition-all duration-300 z-30 select-none shadow-2xl text-white ${
        collapsed ? "w-20 p-3" : "w-72 p-5"
      }`}
      style={{ backgroundColor: "#000B58" }}
    >
      {/* Bouton de rétractation (Collapse) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Agrandir" : "Réduire"}
        className="absolute -right-3.5 top-8 w-7 h-7 rounded-full bg-[#000B58] border border-white/40 text-white flex items-center justify-center shadow-lg hover:border-white transition-all cursor-pointer z-40"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* 1. EN-TÊTE SUPER ADMIN (aucun background sous icône ni sous texte) */}
      <div className="space-y-4">
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div className="shrink-0 flex items-center justify-center text-amber-300">
            <ShieldAlert className="w-7 h-7" />
          </div>

          {!collapsed && (
            <div className="truncate">
              <span className="block text-[10px] tracking-[0.2em] font-mono text-amber-300 font-bold uppercase">
                SUPER ADMIN CONSOLE
              </span>
              <h1 className="text-sm font-bold tracking-tight text-white truncate">
                Gouvernance SaaS
              </h1>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="py-1 px-0 text-xs text-white/90 flex items-center justify-between border-t border-b border-white/10">
            <span className="font-mono text-[9px] text-blue-200/70">ENVIRONNEMENT :</span>
            <span className="text-[9px] font-bold text-emerald-300 font-mono">
              PRODUCTION MULTI-TENANT
            </span>
          </div>
        )}
      </div>

      {/* 2. CORPS : GESTION SAAS, CATALOGUE CENTRAL, SÉCURITÉ */}
      <div
        className="flex-1 overflow-y-auto space-y-4 my-2 no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {ADMIN_NAVIGATION.map((section) => (
          <div key={section.sectionKey} className="space-y-0.5">
            {!collapsed ? (
              <div className="px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-blue-200/70 font-mono uppercase">
                {section.title}
              </div>
            ) : (
              <div className="border-t border-white/10 my-2 mx-2" />
            )}

            {section.items.map((item) => {
              const isActive = currentPath === item.href;
              const hasBadge =
                item.badgeKey === "payments_pending" && pendingPaymentsCount > 0;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.href)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-all cursor-pointer group ${
                    isActive
                      ? "text-white font-semibold border-l-2 border-white pl-2.5"
                      : "text-white/70 hover:text-white border-l-2 border-transparent"
                  } ${collapsed ? "justify-center border-l-0" : ""}`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <IconRenderer
                      name={item.iconName}
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive
                          ? "text-white"
                          : "text-blue-200/70 group-hover:text-white"
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!collapsed && hasBadge && (
                    <span className="text-[10px] font-bold font-mono text-amber-300">
                      ({pendingPaymentsCount})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. PIED DE PAGE SUPER ADMIN */}
      <div className="space-y-3 pt-3 border-t border-white/10">
        {!collapsed && (
          <button
            onClick={() => {
              if (onNavigate) onNavigate("/app/dashboard");
            }}
            className="w-full flex items-center justify-between py-1.5 px-1 text-xs text-blue-200 hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-300" />
              <span className="text-[11px] font-medium">BASCULER VERS ESPACE PARTI</span>
            </div>
            <span className="text-[10px] text-white/60 font-mono">→</span>
          </button>
        )}

        <div className={`flex items-center gap-2.5 py-1.5 px-1 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-7 h-7 rounded-full border border-amber-400/50 flex items-center justify-center font-bold text-[10px] text-amber-300 shrink-0">
            SA
          </div>
          {!collapsed && (
            <div className="text-left truncate">
              <div className="text-xs font-semibold text-white truncate">Admin Plateforme</div>
              <div className="text-[10px] text-amber-300/80 font-mono">Super Administrateur</div>
            </div>
          )}
        </div>

        {!collapsed ? (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 py-1.5 px-3 border border-white/20 hover:border-white text-[10px] font-mono tracking-wider text-white/80 hover:text-white transition-all rounded-lg"
          >
            <LogOut className="w-3 h-3" />
            <span>QUITTER CONSOLE</span>
          </Link>
        ) : (
          <Link
            href="/login"
            title="Quitter console"
            className="w-8 h-8 mx-auto flex items-center justify-center border border-white/20 hover:border-white text-white/80 hover:text-white rounded-lg"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        )}
      </div>
    </aside>
  );
}
