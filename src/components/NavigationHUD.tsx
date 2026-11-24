"use client";

import React from "react";
import Link from "next/link";

interface NavigationHUDProps {
  currentIndex: number;
  totalSlides: number;
  currentTopic: string;
  onPrev: () => void;
  onNext: () => void;
  onToggleOverview: () => void;
  onToggleFullscreen: () => void;
  onPrint: () => void;
  isFullscreen: boolean;
}

export default function NavigationHUD({
  currentIndex,
  totalSlides,
  currentTopic,
  onPrev,
  onNext,
  onToggleOverview,
  onToggleFullscreen,
  onPrint,
  isFullscreen,
}: NavigationHUDProps) {
  const currentFormatted = (currentIndex + 1).toString().padStart(2, "0");
  const totalFormatted = totalSlides.toString().padStart(2, "0");

  return (
    <header className="fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-6 border-b border-white/10 border-l-4 border-sidebarRed z-50 select-none print-hide bg-canvas">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold tracking-[0.15em] text-primary">
          CDT ELECTORAL SYSTEM
        </span>
        <span className="text-white/20 text-xs">/</span>
        <span className="text-[11px] tracking-wider text-accent font-mono">{currentTopic}</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          title="Diapositive précédente (Flèche Gauche)"
          className="border border-white/20 hover:border-primary text-secondary hover:text-primary text-[10px] font-semibold tracking-widest px-3 py-1 cursor-pointer transition-colors"
        >
          PRECEDENT
        </button>

        <div className="border border-white/10 px-2.5 py-0.5">
          <span className="font-mono text-[11px] font-bold text-primary">
            {currentFormatted} / {totalFormatted}
          </span>
        </div>

        <button
          onClick={onNext}
          title="Diapositive suivante (Flèche Droite ou Espace)"
          className="border border-white/20 hover:border-primary text-secondary hover:text-primary text-[10px] font-semibold tracking-widest px-3 py-1 cursor-pointer transition-colors"
        >
          SUIVANT
        </button>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onToggleOverview}
          title="Vue d'ensemble des 17 diapositives (Touche O)"
          className="border border-white/20 hover:border-primary text-secondary hover:text-primary text-[10px] font-semibold tracking-widest px-3 py-1 cursor-pointer transition-colors"
        >
          SOMMAIRE
        </button>

        <Link
          href="/dashboard"
          title="Consulter le tableau de bord interactif"
          className="border border-white/20 hover:border-[#BF0302] text-secondary hover:text-white text-[10px] font-semibold tracking-widest px-3 py-1 cursor-pointer transition-colors"
        >
          TABLEAU DE BORD
        </Link>

        <Link
          href="/login"
          title="Consulter la page de connexion sécurisée"
          className="border border-white/20 hover:border-[#BF0302] text-secondary hover:text-white text-[10px] font-semibold tracking-widest px-3 py-1 cursor-pointer transition-colors"
        >
          CONNEXION
        </Link>

        <button
          onClick={onPrint}
          title="Imprimer ou Exporter en PDF 16:9 (Touche P)"
          className="border border-white/20 hover:border-primary text-secondary hover:text-primary text-[10px] font-semibold tracking-widest px-3 py-1 cursor-pointer transition-colors"
        >
          IMPRIMER / PDF
        </button>

        <button
          onClick={onToggleFullscreen}
          title="Mode plein écran (Touche F)"
          className="border border-white/20 hover:border-primary text-secondary hover:text-primary text-[10px] font-semibold tracking-widest px-3 py-1 cursor-pointer transition-colors"
        >
          {isFullscreen ? "QUITTER PLEIN ECRAN" : "PLEIN ECRAN"}
        </button>
      </div>
    </header>
  );
}
