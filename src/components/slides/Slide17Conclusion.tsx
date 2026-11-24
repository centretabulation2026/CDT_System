import React from "react";

export default function Slide17Conclusion() {
  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="text-[10px] font-bold tracking-[0.25em] text-accent border-b border-white/10 pb-2.5">
        EPILOGUE INSTITUTIONNEL
      </div>

      <div className="my-auto max-w-5xl py-6">
        <span className="block text-[11px] font-bold tracking-[0.2em] text-accent mb-4">
          ENGAGEMENT DU PROJET
        </span>
        <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug tracking-tight text-primary">
          « Donner aux organisations politiques les moyens de mieux organiser, suivre et documenter leurs opérations électorales grâce au numérique. »
        </blockquote>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="border border-white/15 p-3.5">
          <span className="block text-[10px] font-bold tracking-wider text-accent mb-1">
            MAITRISE METHODIQUE
          </span>
          <p className="text-xs text-secondary leading-relaxed">
            Remplacer le stress et l'approximation logistique par la rigueur d'un dispositif structuré, bureau par bureau (350 électeurs).
          </p>
        </div>
        <div className="border border-white/15 p-3.5">
          <span className="block text-[10px] font-bold tracking-wider text-accent mb-1">
            INTEGRITE REPUBLICAINE
          </span>
          <p className="text-xs text-secondary leading-relaxed">
            Une démarche respectueuse des institutions, reposant sur des preuves matérielles tangibles et vérifiables.
          </p>
        </div>
        <div className="border border-white/15 p-3.5">
          <span className="block text-[10px] font-bold tracking-wider text-accent mb-1">
            OUVERTURE & DEPLOIEMENT
          </span>
          <p className="text-xs text-secondary leading-relaxed">
            Plateforme prête pour des séances de démonstration technique et le cadrage des futures échéances électorales.
          </p>
        </div>
      </div>

      <div className="flex justify-between border-t border-white/10 pt-2.5 text-[9px] font-semibold tracking-wider text-muted font-mono">
        <span>PLATEFORME INTEGREE DE SUIVI ET DE GESTION DES OPERATIONS ELECTORALES</span>
        <span className="text-accent">REMERCIEMENTS POUR VOTRE ATTENTION — PLACE AUX ECHANGES</span>
      </div>
    </div>
  );
}
