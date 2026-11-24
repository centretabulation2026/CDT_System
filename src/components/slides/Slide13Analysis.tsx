import React from "react";

export default function Slide13Analysis() {
  const levels = [
    "01 / BUREAU DE VOTE UNITAIRE (350 ÉLECTEURS)",
    "02 / CENTRE DE VOTE (GROUPEMENT DE BUREAUX)",
    "03 / COMMUNE ADMINISTRATIVE",
    "04 / DEPARTEMENT / CIRCONSCRIPTION",
    "05 / SYNTHESE DU TERRITOIRE NATIONAL",
  ];

  const benchmarks = [
    {
      name: "Parti Démocratique Uni (Candidat A)",
      score: "218 420 voix",
      share: "44,81 %",
      trend: "En tête dans 44 communes",
    },
    {
      name: "Alliance pour le Progrès (Candidat B)",
      score: "182 110 voix",
      share: "37,36 %",
      trend: "En tête dans 28 communes",
    },
    {
      name: "Union Républicaine (Candidat C)",
      score: "58 340 voix",
      share: "11,97 %",
      trend: "Progression en zone urbaine",
    },
    {
      name: "Mouvement Populaire (Candidat D)",
      score: "28 530 voix",
      share: "5,86 %",
      trend: "Score localisé",
    },
  ];

  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="mb-2">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-1">
          OBSERVATION STRATEGIQUE
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-1">
          Analyse et Comparaison des Résultats Consolidés
        </h2>
        <p className="text-xs md:text-sm text-secondary">
          Consulter et comparer les suffrages collectés à chaque niveau du territoire sans jamais se substituer aux proclamations officielles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 flex-1 my-1">
        <div className="flex flex-col justify-between">
          <div>
            <span className="block text-[10px] font-bold tracking-widest text-accent mb-2">
              ECHELONS DE REGROUPEMENT
            </span>
            <div className="space-y-2">
              {levels.map((lvl, idx) => (
                <div
                  key={lvl}
                  className={`border p-2.5 font-mono text-[10px] ${
                    idx === levels.length - 1
                      ? "border-accent text-primary font-bold"
                      : "border-white/15 text-secondary"
                  }`}
                >
                  {lvl}
                </div>
              ))}
            </div>
          </div>
          <div className="font-mono text-[10px] text-muted border-t border-white/10 pt-2">
            GRANULARITE DESCENDANTE : DU PAYS AU BUREAU DE 350 INSCRITS
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="block text-[10px] font-bold tracking-widest text-accent mb-2">
              SYNTHESE COMPARATIVE DES COMPETITEURS SUIVIS (DONNEES DE DEMONSTRATION)
            </span>

            <div className="border border-white/15 text-xs">
              <div className="grid grid-cols-[1.3fr_110px_130px_1fr] p-2.5 font-mono text-[9px] font-bold text-accent border-b border-white/15">
                <span>COMPETITEURS SUIVIS</span>
                <span>TOTAL SUFFRAGES</span>
                <span>POURCENTAGE EXPRIME</span>
                <span>TENDANCE RELATIVE</span>
              </div>
              {benchmarks.map((b) => (
                <div
                  key={b.name}
                  className="grid grid-cols-[1.3fr_110px_130px_1fr] p-2.5 border-b border-white/5 last:border-b-0 items-center text-[11px]"
                >
                  <span className="font-semibold text-primary">{b.name}</span>
                  <span className="font-mono text-primary">{b.score}</span>
                  <span className="font-mono text-accent">{b.share}</span>
                  <span className="text-[10px] text-muted">{b.trend}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/15 p-2.5 text-[10px] text-muted leading-relaxed font-mono mt-2">
            RESERVE INSTITUTIONNELLE FONDAMENTALE : Les résultats affichés ci-dessus représentent exclusivement les consolidations internes de l'organisation politique, établies à partir des procès-verbaux de ses propres mandataires. La plateforme ne certifie pas les résultats officiels et ne remplace en aucun cas les proclamations souveraines des commissions électorales ou cours compétentes.
          </div>
        </div>
      </div>
    </div>
  );
}
