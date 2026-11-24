"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FIELD_NAVIGATION } from "@/config/navigation";
import { IconRenderer } from "./IconHelper";
import {
  Wifi,
  WifiOff,
  Database,
  ArrowRightLeft,
} from "lucide-react";

interface FieldBottomNavProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  pendingSyncCount?: number;
  assignedStation?: string;
  onSwitchToDesktop?: () => void;
}

export default function FieldBottomNav({
  currentTab = "field-stations",
  onTabChange,
  pendingSyncCount = 3,
  assignedStation = "BV-042 [ 350 inscrits ] — Delmas",
  onSwitchToDesktop,
}: FieldBottomNavProps) {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <>
      {/* 1. BANDEAU SUPÉRIEUR PERMANENT : ÉTAT DE CONNEXION & FILE INDEXEDDB (aucun background lourd) */}
      <header
        className="fixed top-0 left-0 right-0 h-14 text-white border-b border-white/15 z-50 px-4 flex items-center justify-between shadow-md select-none"
        style={{ backgroundColor: "#000B58" }}
      >
        <div className="flex items-center gap-3 truncate">
          {/* Indicateur de connectivité interactif (texte net et icône, sans background lourd) */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            title="Cliquez pour simuler le mode Hors-Ligne / En ligne"
            className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider cursor-pointer"
          >
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">EN LIGNE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 animate-pulse">HORS-LIGNE</span>
              </>
            )}
          </button>

          {/* Compteur de file d'attente IndexedDB */}
          <div className="flex items-center gap-1.5 text-blue-200 text-xs font-mono truncate">
            <Database className="w-3.5 h-3.5 shrink-0 text-blue-300" />
            <span className="truncate">
              <strong>{pendingSyncCount}</strong> PV en attente IndexedDB
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-block text-[11px] font-mono text-white/90">
            {assignedStation}
          </span>

          {onSwitchToDesktop && (
            <button
              onClick={onSwitchToDesktop}
              className="py-1 px-2 text-[10px] font-mono text-white/80 hover:text-white flex items-center gap-1 border border-white/20 rounded-md transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3 h-3" />
              <span className="hidden md:inline">ESPACE PARTI</span>
            </button>
          )}

          <Link
            href="/login"
            className="text-[10px] font-mono text-white/70 hover:text-white px-1"
          >
            QUITTER
          </Link>
        </div>
      </header>

      {/* 2. BOTTOM NAVIGATION BAR FIXE À 4 ONGLETS (aucun background sous texte ni icône) */}
      <nav
        className="fixed bottom-0 left-0 right-0 h-16 text-white border-t border-white/15 z-50 px-2 flex items-center justify-around shadow-2xl select-none"
        style={{ backgroundColor: "#000B58" }}
      >
        {FIELD_NAVIGATION.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 transition-all cursor-pointer ${
                isActive
                  ? "text-white font-bold border-t-2 border-white -mt-0.5"
                  : "text-white/60 hover:text-white border-t-2 border-transparent"
              }`}
            >
              <IconRenderer
                name={tab.iconName}
                size={20}
                className={`w-5 h-5 mb-1 ${
                  isActive ? "text-white" : "text-blue-200/70"
                }`}
              />
              <span className="text-[10px] font-medium tracking-tight truncate">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
