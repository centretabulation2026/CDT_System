import React from "react";

export default function Slide03Vision() {
  const pillars = [
    {
      idx: "01",
      title: "ORGANISER",
      text: "Assigner chaque mandataire à son bureau de vote de 350 électeurs avec une traçabilité rigoureuse de la chaîne d'autorité.",
    },
    {
      idx: "02",
      title: "COLLECTER",
      text: "Verrouiller la saisie des résultats par des vérifications arithmétiques instantanées et un fonctionnement 100% hors-ligne.",
    },
    {
      idx: "03",
      title: "DOCUMENTER",
      text: "Constituer un coffre-fort probant réunissant les originaux numérisés des procès-verbaux et les éléments de preuve scellés.",
    },
    {
      idx: "04",
      title: "DECIDER",
      text: "Donner aux états-majors et aux juristes une visibilité consolidée, immédiate et documentée pour asseoir leurs prises de parole.",
    },
  ];

  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="text-[11px] font-bold tracking-[0.25em] text-accent border-b border-white/10 pb-2.5">
        LIGNE DIRECTRICE DU PROJET
      </div>

      <div className="py-6 my-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug tracking-tight text-primary max-w-5xl">
          Permettre à chaque organisation politique de disposer d'un environnement numérique centralisé pour organiser ses équipes, collecter les informations électorales, suivre les transmissions et analyser les données disponibles en toute souveraineté.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {pillars.map((p) => (
          <div key={p.idx} className="border border-white/15 p-4 md:p-5">
            <span className="block font-mono text-[10px] font-bold text-accent tracking-widest mb-1.5">
              PILIER {p.idx}
            </span>
            <h3 className="text-base font-extrabold tracking-wider text-primary mb-2">
              {p.title}
            </h3>
            <p className="text-xs text-secondary leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
