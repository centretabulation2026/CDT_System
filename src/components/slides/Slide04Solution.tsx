import React from "react";

export default function Slide04Solution() {
  const capabilities = [
    {
      num: "01",
      title: "Organisation des Équipes",
      desc: "Structuration hiérarchique du national jusqu'au coordinateur de centre de vote.",
    },
    {
      num: "02",
      title: "Affectation des Mandataires",
      desc: "Association nominative d'un mandataire par bureau unitaire de 350 électeurs.",
    },
    {
      num: "03",
      title: "Collecte des Résultats",
      desc: "Formulaire de bordereau avec contrôles de cohérence et conformité mathématique.",
    },
    {
      num: "04",
      title: "Conservation des PV",
      desc: "Archivage sécurisé haute résolution avec métadonnées d'intégrité inaltérables.",
    },
    {
      num: "05",
      title: "Suivi des Opérations",
      desc: "Monitoring en continu du taux de participation et de la cadence de dépouillement.",
    },
    {
      num: "06",
      title: "Analyse des Données",
      desc: "Comparateurs géographiques et agrégation descendante bureau / commune / département.",
    },
    {
      num: "07",
      title: "Documentation des Incidents",
      desc: "Qualification factuelle des anomalies et constitution rapide de dossiers juridiques.",
      span: true,
    },
  ];

  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="mb-3">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-1">
          ECOSYSTEME GLOBAL
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-1">
          Présentation de la Solution : Les Sept Capacités Clés
        </h2>
        <p className="text-xs md:text-sm text-secondary">
          Une infrastructure unifiée articulée autour d'un socle d'opérations électorales en temps réel.
        </p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        <div className="border border-accent/40 p-3 md:p-4">
          <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-1">
            SOCLE CENTRAL
          </span>
          <h3 className="text-base md:text-lg font-extrabold tracking-wider text-primary mb-1">
            MOTEUR INTEGRE DE GESTION ELECTORALE
          </h3>
          <p className="text-xs text-secondary mb-1">
            Noyau de calcul, de validation arithmétique et d'archivage des données électorales
          </p>
          <div className="font-mono text-[9px] tracking-widest text-muted">
            CHEVILLES TECHNIQUES : ISOLATION STRICTE DES DONNEES / SYNCHRONISATION FIABLE
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {capabilities.map((c) => (
            <div
              key={c.num}
              className={`border border-white/15 p-3 flex flex-col justify-between ${
                c.span ? "col-span-2" : ""
              }`}
            >
              <div>
                <span className="block font-mono text-[10px] font-bold text-accent mb-1">
                  {c.num}
                </span>
                <h4 className="text-xs md:text-sm font-bold text-primary mb-1">{c.title}</h4>
                <p className="text-[11px] text-secondary leading-snug">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
