import React from "react";

export default function Slide01Cover() {
  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.16em] text-muted border-b border-white/10 pb-3">
        <span>DOCUMENT DE PRESENTATION DE DIRECTION</span>
        <span className="text-white/20">—</span>
        <span>SPECIFICATION OPERATIONNELLE</span>
        <span className="text-white/20">—</span>
        <span className="text-accent">USAGE EXCLUSIF DES ETATS-MAJORS</span>
      </div>

      <div className="my-auto">
        <span className="block text-xs font-bold tracking-[0.24em] text-accent mb-3">
          ARCHITECTURE NUMERIQUE DES OPERATIONS ELECTORALES
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-primary leading-[1.15] max-w-5xl mb-5">
          Plateforme intégrée de suivi et de gestion des opérations électorales
        </h1>
        <p className="text-base md:text-xl text-secondary font-normal max-w-3xl leading-relaxed mb-10">
          Une solution numérique pour organiser, superviser et documenter les opérations électorales.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-white/15 p-4">
            <span className="block font-mono text-[11px] font-bold text-accent mb-1.5">01</span>
            <span className="block text-[11px] font-bold tracking-wider text-primary mb-1.5">
              DEPLOIEMENT TERRITORIAL
            </span>
            <p className="text-xs text-secondary leading-relaxed">
              Organisation unitaire par bureau de vote calibré à 350 électeurs inscrits.
            </p>
          </div>
          <div className="border border-white/15 p-4">
            <span className="block font-mono text-[11px] font-bold text-accent mb-1.5">02</span>
            <span className="block text-[11px] font-bold tracking-wider text-primary mb-1.5">
              COLLECTE VERIFIEE
            </span>
            <p className="text-xs text-secondary leading-relaxed">
              Saisie contrôlée, traçabilité arithmétique et résilience totale hors-connexion.
            </p>
          </div>
          <div className="border border-white/15 p-4">
            <span className="block font-mono text-[11px] font-bold text-accent mb-1.5">03</span>
            <span className="block text-[11px] font-bold tracking-wider text-primary mb-1.5">
              MEMOIRE JURIDIQUE
            </span>
            <p className="text-xs text-secondary leading-relaxed">
              Conservation certifiée des procès-verbaux originaux et des pièces probantes.
            </p>
          </div>
          <div className="border border-white/15 p-4">
            <span className="block font-mono text-[11px] font-bold text-accent mb-1.5">04</span>
            <span className="block text-[11px] font-bold tracking-wider text-primary mb-1.5">
              SOUVERAINETE PRIVEE
            </span>
            <p className="text-xs text-secondary leading-relaxed">
              Cloisonnement strict et étanchéité absolue des données entre formations politiques.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between border-t border-white/10 pt-3 text-[10px] font-semibold tracking-wider text-muted">
        <span>NOTICE : SYSTEME RESERVE A L'USAGE INTERNE DES ORGANISATIONS POLITIQUES</span>
        <span className="text-accent">UTILISEZ LES TOUCHES [ GAUCHE / DROITE ] POUR NAVIGUER</span>
      </div>
    </div>
  );
}
