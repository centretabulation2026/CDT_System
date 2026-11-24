"use client";

import React, { useState } from "react";

export default function Slide07Catalogue() {
  const officialCompetitors = [
    { code: "CMP-A", name: "Parti Démocratique Uni", type: "Parti Client Actif" },
    { code: "CMP-B", name: "Alliance pour le Progrès", type: "Parti Client Actif" },
    { code: "CMP-C", name: "Union Républicaine", type: "Candidature Officielle" },
    { code: "CMP-D", name: "Mouvement Populaire", type: "Candidature Officielle" },
    { code: "CMP-E", name: "Coalition des Indépendants", type: "Candidature Officielle" },
  ];

  const [partyASelection, setPartyASelection] = useState<string[]>([
    "CMP-A",
    "CMP-B",
    "CMP-C",
    "CMP-D",
  ]);

  const [partyBSelection, setPartyBSelection] = useState<string[]>([
    "CMP-A",
    "CMP-B",
    "CMP-E",
  ]);

  const toggleA = (code: string) => {
    setPartyASelection((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const toggleB = (code: string) => {
    setPartyBSelection((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="mb-2">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-1">
          REFERENTIEL ET STRATEGIE
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-1">
          Gestion des Partis et des Compétiteurs
        </h2>
        <p className="text-xs md:text-sm text-secondary">
          Un catalogue centralisé garantit l'exactitude des candidatures officielles, tout en laissant chaque parti libre de son périmètre de veille.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-6 flex-1 my-1">
        <div className="flex flex-col justify-between">
          <div>
            <span className="block text-[10px] font-bold tracking-widest text-accent mb-1">
              REFERENTIEL CENTRAL ET NEUTRE
            </span>
            <h3 className="text-base font-bold text-primary mb-1">Catalogue Électoral Officiel</h3>
            <p className="text-xs text-secondary mb-3">
              Maintenu par l'administration système à partir des listes électorales officielles validées.
            </p>

            <div className="border border-white/15 text-xs">
              <div className="grid grid-cols-[80px_1fr_140px] px-3 py-2 font-mono text-[10px] font-bold text-accent border-b border-white/15">
                <span>CODE</span>
                <span>FORMATION OFFICIELLE</span>
                <span>STATUT</span>
              </div>
              {officialCompetitors.map((comp) => (
                <div
                  key={comp.code}
                  className="grid grid-cols-[80px_1fr_140px] px-3 py-2 border-b border-white/5 last:border-b-0 items-center text-[11px]"
                >
                  <span className="font-mono font-bold text-primary">{comp.code}</span>
                  <span className="text-secondary">{comp.name}</span>
                  <span className="text-muted text-[10px]">{comp.type}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[10px] font-mono text-muted border-t border-white/10 pt-2">
            BASE DE DONNEES COMMUNE : AUCUNE DONNEE DE VOTE STOCKEE DANS LE REGISTRE PUBLIC
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border border-white/15 p-3.5">
              <span className="block font-mono text-[9px] font-bold tracking-wider text-accent mb-1">
                ESPACE PRIVE DU PARTI A (INTERACTIF)
              </span>
              <h4 className="text-xs font-bold text-primary mb-1">
                Sélection Souveraine : {partyASelection.length} compétiteurs suivis
              </h4>
              <p className="text-[11px] text-secondary mb-2">
                Le Parti A choisit librement les formations à observer. Cliquez pour tester :
              </p>
              <div className="flex flex-wrap gap-1.5">
                {officialCompetitors.map((c) => {
                  const isSelected = partyASelection.includes(c.code);
                  return (
                    <button
                      key={c.code}
                      onClick={() => toggleA(c.code)}
                      className={`border px-2 py-1 font-mono text-[10px] cursor-pointer transition-colors ${
                        isSelected
                          ? "border-accent text-primary"
                          : "border-white/10 text-muted line-through"
                      }`}
                    >
                      {c.code} : {c.name.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border border-white/15 p-3.5">
              <span className="block font-mono text-[9px] font-bold tracking-wider text-accent mb-1">
                ESPACE PRIVE DU PARTI B (INTERACTIF)
              </span>
              <h4 className="text-xs font-bold text-primary mb-1">
                Sélection Souveraine : {partyBSelection.length} compétiteurs suivis
              </h4>
              <p className="text-[11px] text-secondary mb-2">
                Un parti peut suivre des concurrents même si ceux-ci ne sont pas clients de la plateforme :
              </p>
              <div className="flex flex-wrap gap-1.5">
                {officialCompetitors.map((c) => {
                  const isSelected = partyBSelection.includes(c.code);
                  return (
                    <button
                      key={c.code}
                      onClick={() => toggleB(c.code)}
                      className={`border px-2 py-1 font-mono text-[10px] cursor-pointer transition-colors ${
                        isSelected
                          ? "border-accent text-primary"
                          : "border-white/10 text-muted line-through"
                      }`}
                    >
                      {c.code} : {c.name.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-2 font-mono text-[10px] text-muted">
            REGLE FONDAMENTALE : Les sélections sont totalement indépendantes et confidentielles.
          </div>
        </div>
      </div>
    </div>
  );
}
