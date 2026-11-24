"use client";

import React, { useState, useEffect, useCallback } from "react";
import NavigationHUD from "@/components/NavigationHUD";
import OverviewDrawer from "@/components/OverviewDrawer";
import { SlideMeta } from "@/types/presentation";

import Slide01Cover from "@/components/slides/Slide01Cover";
import Slide02Context from "@/components/slides/Slide02Context";
import Slide03Vision from "@/components/slides/Slide03Vision";
import Slide04Solution from "@/components/slides/Slide04Solution";
import Slide05Users from "@/components/slides/Slide05Users";
import Slide06Spaces from "@/components/slides/Slide06Spaces";
import Slide07Catalogue from "@/components/slides/Slide07Catalogue";
import Slide08Mandataires from "@/components/slides/Slide08Mandataires";
import Slide09Collecte from "@/components/slides/Slide09Collecte";
import Slide10PV from "@/components/slides/Slide10PV";
import Slide11Offline from "@/components/slides/Slide11Offline";
import Slide12Dashboard from "@/components/slides/Slide12Dashboard";
import Slide13Analysis from "@/components/slides/Slide13Analysis";
import Slide14Incidents from "@/components/slides/Slide14Incidents";
import Slide15Security from "@/components/slides/Slide15Security";
import Slide16Benefits from "@/components/slides/Slide16Benefits";
import Slide17Conclusion from "@/components/slides/Slide17Conclusion";

const slidesData: { meta: SlideMeta; component: React.ComponentType }[] = [
  { meta: { id: "slide-1", number: 1, topic: "COUVERTURE", title: "Plateforme intégrée de suivi et de gestion des opérations électorales" }, component: Slide01Cover },
  { meta: { id: "slide-2", number: 2, topic: "CONTEXTE OPERATIONNEL", title: "Contexte Opérationnel : Les Défis Électoraux des Organisations" }, component: Slide02Context },
  { meta: { id: "slide-3", number: 3, topic: "NOTRE VISION", title: "Notre Vision : Centralisation, Sérénité et Rigueur" }, component: Slide03Vision },
  { meta: { id: "slide-4", number: 4, topic: "ARCHITECTURE GLOBALE", title: "Présentation de la Solution : Les Sept Capacités Clés" }, component: Slide04Solution },
  { meta: { id: "slide-5", number: 5, topic: "MATRICE DES ROLES", title: "Les Utilisateurs : Matrice Hiérarchique & Rôles Définis" }, component: Slide05Users },
  { meta: { id: "slide-6", number: 6, topic: "ESPACES SYSTEME", title: "Les Quatre Espaces de la Plateforme" }, component: Slide06Spaces },
  { meta: { id: "slide-7", number: 7, topic: "CATALOGUE ELECTORAL", title: "Gestion des Partis et des Compétiteurs" }, component: Slide07Catalogue },
  { meta: { id: "slide-8", number: 8, topic: "ORGANISATION TERRAIN", title: "Organisation des Mandataires : Maillage & Affectations (Base 350)" }, component: Slide08Mandataires },
  { meta: { id: "slide-9", number: 9, topic: "COLLECTE ET CONTROLE", title: "Collecte des Résultats : Saisie & Contrôles Arithmétiques" }, component: Slide09Collecte },
  { meta: { id: "slide-10", number: 10, topic: "CHAINE DE PREUVE", title: "Procès-Verbaux et Preuves : Du Terrain au Scellement" }, component: Slide10PV },
  { meta: { id: "slide-11", number: 11, topic: "RESILIENCE HORS-LIGNE", title: "Fonctionnement Hors Connexion : Résilience en Zone Blanche" }, component: Slide11Offline },
  { meta: { id: "slide-12", number: 12, topic: "COCKPIT DU PARTI", title: "Tableau de Bord Exécutif : Tour de Contrôle du Jour J" }, component: Slide12Dashboard },
  { meta: { id: "slide-13", number: 13, topic: "ANALYSE GRANULAIRE", title: "Analyse et Comparaison des Résultats Consolidés" }, component: Slide13Analysis },
  { meta: { id: "slide-14", number: 14, topic: "POLE JURIDIQUE", title: "Incidents et Documentation Juridique" }, component: Slide14Incidents },
  { meta: { id: "slide-15", number: 15, topic: "CONFIDENTIALITE", title: "Confidentialité et Cloisonnement Multi-Organisations" }, component: Slide15Security },
  { meta: { id: "slide-16", number: 16, topic: "VALEUR STRATEGIQUE", title: "Les Huit Avantages Majeurs de la Solution" }, component: Slide16Benefits },
  { meta: { id: "slide-17", number: 17, topic: "CONCLUSION", title: "Conclusion & Engagement du Projet" }, component: Slide17Conclusion },
];

export default function PresentationPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = slidesData.length;

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index);
      if (typeof window !== "undefined") {
        window.location.hash = `slide-${index + 1}`;
      }
    }
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, goToSlide]);

  const toggleFullscreen = useCallback(() => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isOverviewOpen) {
          setIsOverviewOpen(false);
          return;
        }
      }
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "Backspace") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goToSlide(totalSlides - 1);
      } else if (e.key === "o" || e.key === "O") {
        e.preventDefault();
        setIsOverviewOpen((prev) => !prev);
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "p" || e.key === "P") {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          handlePrint();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide, totalSlides, isOverviewOpen, toggleFullscreen, handlePrint]);

  const activeSlide = slidesData[currentIndex];
  const CurrentSlideComponent = activeSlide.component;
  const progressPct = ((currentIndex + 1) / totalSlides) * 100;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-canvas text-primary">
      <NavigationHUD
        currentIndex={currentIndex}
        totalSlides={totalSlides}
        currentTopic={activeSlide.meta.topic}
        onPrev={prevSlide}
        onNext={nextSlide}
        onToggleOverview={() => setIsOverviewOpen((prev) => !prev)}
        onToggleFullscreen={toggleFullscreen}
        onPrint={handlePrint}
        isFullscreen={isFullscreen}
      />
      <div className="fixed top-12 left-0 right-0 h-[2px] border-b border-white/5 z-40 print-hide">
        <div className="h-full border-b-2 border-accent transition-all duration-300 ease-out" style={{ width: `${progressPct}%` }} />
      </div>
      <main className="absolute top-12 bottom-0 left-0 right-0 flex items-center justify-center p-3 md:p-6 print-hide">
        <div className="relative w-full max-w-[var(--slide-width)] aspect-[16/9] border border-white/10 overflow-hidden no-scrollbar">
          <CurrentSlideComponent />
        </div>
      </main>
      <OverviewDrawer
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        slides={slidesData.map((s) => s.meta)}
        currentIndex={currentIndex}
        onSelectSlide={goToSlide}
      />
    </div>
  );
}
