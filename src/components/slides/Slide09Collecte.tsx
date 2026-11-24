"use client";

import React, { useState } from "react";

export default function Slide09Collecte() {
  const [registered, setRegistered] = useState(350);
  const [votants, setVotants] = useState(272);
  const [nuls, setNuls] = useState(4);
  const [blancs, setBlancs] = useState(2);
  const [candA, setCandA] = useState(124);
  const [candB, setCandB] = useState(98);
  const [candC, setCandC] = useState(32);
  const [candD, setCandD] = useState(12);

  const totalExprimes = candA + candB + candC + candD;
  const sommeTotale = totalExprimes + nuls + blancs;
  const isCoherent = sommeTotale === votants;
  const participationPct = registered > 0 ? ((votants / registered) * 100).toFixed(2) : "0.00";

  const sidebarNavItems = [
    { label: "TABLEAU DE BORD" },
    { label: "MANDATAIRES (350)" },
    { label: "BUREAUX DE VOTE" },
    { label: "COLLECTE JOUR J", active: true },
    { label: "PROCES-VERBAUX" },
    { label: "INCIDENTS (18)" },
    { label: "POLE JURIDIQUE" },
  ];

  return (
    <div className="w-full h-full p-6 md:p-10 flex flex-col justify-between">
      <div className="mb-2">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-0.5">
          INTERFACE DE SAISIE SUR BASE 350 ELECTEURS
        </span>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-primary mb-0.5">
          Collecte des Résultats : Saisie & Contrôles Arithmétiques
        </h2>
        <p className="text-xs text-secondary">
          Formulaire de dépouillement dans le cockpit du parti avec sidebar carmin (#BF0302) et contrôle arithmétique.
        </p>
      </div>

      <div className="border border-white/20 flex flex-1 my-1 overflow-hidden">
        {/* SIDEBAR ROUGE CARMIN (#BF0302) */}
        <aside
          className="w-44 shrink-0 flex flex-col justify-between p-3 select-none"
          style={{ backgroundColor: "#BF0302" }}
        >
          <div>
            <div className="border-b border-white/30 pb-2 mb-2.5">
              <span className="block text-[10px] font-extrabold tracking-widest text-white">
                CDT SYSTEM
              </span>
              <span className="block text-[8px] tracking-wider text-white/80 font-mono">
                SAISIE RESULTATS
              </span>
            </div>

            <nav className="space-y-1">
              {sidebarNavItems.map((item) => (
                <div
                  key={item.label}
                  className={`text-[8.5px] font-mono tracking-wider px-2 py-1 transition-colors ${
                    item.active
                      ? "text-white font-bold border-l-2 border-white"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </nav>
          </div>

          <div className="border-t border-white/30 pt-1.5 font-mono text-[8px] text-white/90">
            <div>MANDATAIRE CONNECTE</div>
            <div className="text-white font-bold">BV-042 [ 350 INSCRITS ]</div>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL DU BORDEREAU */}
        <div className="flex-1 p-3.5 flex flex-col justify-between overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-white/10 pb-2 mb-2 text-xs">
            <div>
              <span className="block text-[8px] font-bold tracking-wider text-muted mb-0.5">
                IDENTIFIANT DU BUREAU
              </span>
              <span className="font-mono font-bold text-primary text-[11px]">
                BV-042 / ECOLE PUBLIQUE DU CENTRE
              </span>
            </div>
            <div>
              <span className="block text-[8px] font-bold tracking-wider text-muted mb-0.5">
                COMMUNE & DEPARTEMENT
              </span>
              <span className="font-mono font-bold text-primary text-[11px]">
                SAINT-PIERRE — LITTORAL
              </span>
            </div>
            <div>
              <span className="block text-[8px] font-bold tracking-wider text-muted mb-0.5">
                MANDATAIRE ACCREDITE
              </span>
              <span className="font-mono font-bold text-primary text-[11px]">
                JEAN-LUC D. (MATRICULE M-9041)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-4 flex-1">
            <div className="space-y-2">
              <div className="border border-accent p-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="block text-[11px] font-bold text-primary">
                      Nombre d'électeurs inscrits (Facultatif)
                    </span>
                    <span className="block text-[9px] text-warning max-w-sm mt-0.5 leading-snug">
                      EXIGENCE STRICTE : Toute saisie impose une source officielle et une photo justificative.
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-lg font-extrabold text-primary">
                      {registered}
                    </span>
                    <span className="block text-[8px] tracking-wider text-accent">
                      ELECTEURS DE REFERENCE
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-white/15 p-2.5 flex justify-between items-center">
                <div>
                  <span className="block text-[11px] font-bold text-primary">
                    Total des Votants (Émargements constatés)
                  </span>
                  <span className="text-[9px] text-muted">
                    Citoyens ayant déposé une enveloppe
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-lg font-extrabold text-primary">
                    {votants}
                  </span>
                  <span className="block text-[8px] text-accent font-mono">
                    PARTICIPATION : {participationPct} %
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="border border-white/15 p-2 text-center">
                  <span className="block text-[9px] text-muted mb-0.5">Bulletins Nuls</span>
                  <span className="block font-mono text-sm font-bold text-primary">{nuls}</span>
                </div>
                <div className="border border-white/15 p-2 text-center">
                  <span className="block text-[9px] text-muted mb-0.5">Bulletins Blancs</span>
                  <span className="block font-mono text-sm font-bold text-primary">{blancs}</span>
                </div>
                <div className="border border-accent p-2 text-center">
                  <span className="block text-[9px] text-accent mb-0.5">Suffrages Exprimés</span>
                  <span className="block font-mono text-sm font-bold text-primary">
                    {totalExprimes}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="text-[9px] font-bold tracking-widest text-accent mb-1.5">
                  REPARTITION DES VOIX PAR COMPETITEUR
                </div>

                <div className="space-y-1 text-xs">
                  <div className="grid grid-cols-[90px_1fr_60px_50px] p-1.5 border border-white/10 items-center text-[10px]">
                    <span className="font-mono font-bold text-primary">COMPETITEUR A</span>
                    <span className="text-secondary truncate">Parti Démocratique Uni</span>
                    <span className="font-mono font-bold text-primary text-right">{candA} VOIX</span>
                    <span className="font-mono text-accent text-right">
                      {totalExprimes > 0 ? ((candA / totalExprimes) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="grid grid-cols-[90px_1fr_60px_50px] p-1.5 border border-white/10 items-center text-[10px]">
                    <span className="font-mono font-bold text-primary">COMPETITEUR B</span>
                    <span className="text-secondary truncate">Alliance pour le Progrès</span>
                    <span className="font-mono font-bold text-primary text-right">{candB} VOIX</span>
                    <span className="font-mono text-accent text-right">
                      {totalExprimes > 0 ? ((candB / totalExprimes) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="grid grid-cols-[90px_1fr_60px_50px] p-1.5 border border-white/10 items-center text-[10px]">
                    <span className="font-mono font-bold text-primary">COMPETITEUR C</span>
                    <span className="text-secondary truncate">Union Républicaine</span>
                    <span className="font-mono font-bold text-primary text-right">{candC} VOIX</span>
                    <span className="font-mono text-accent text-right">
                      {totalExprimes > 0 ? ((candC / totalExprimes) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="grid grid-cols-[90px_1fr_60px_50px] p-1.5 border border-white/10 items-center text-[10px]">
                    <span className="font-mono font-bold text-primary">COMPETITEUR D</span>
                    <span className="text-secondary truncate">Mouvement Populaire</span>
                    <span className="font-mono font-bold text-primary text-right">{candD} VOIX</span>
                    <span className="font-mono text-accent text-right">
                      {totalExprimes > 0 ? ((candD / totalExprimes) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`border p-2 mt-2 ${
                  isCoherent ? "border-success" : "border-danger"
                }`}
              >
                <span
                  className={`block text-[8px] font-bold tracking-wider mb-0.5 ${
                    isCoherent ? "text-success" : "text-danger"
                  }`}
                >
                  AUDIT DE CONFORMITE ARITHMETIQUE SYSTEME
                </span>
                <div className="font-mono text-[10px] text-primary">
                  {totalExprimes} (Exprimés) + {nuls} (Nuls) + {blancs} (Blancs) = {sommeTotale}{" "}
                  {isCoherent ? "== " + votants + " (Total Votants)" : "≠ " + votants + " (ERREUR !)"}
                </div>
                <div
                  className={`text-[8px] font-mono mt-0.5 ${
                    isCoherent ? "text-success" : "text-danger"
                  }`}
                >
                  {isCoherent
                    ? "STATUT : EQUATION VALIDE — SAISIE CONFORME AUX REGLES DU DEPOUILLEMENT"
                    : "STATUT : INCOHERENCE DETECTEE — TRANSMISSION BLOQUEE"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
