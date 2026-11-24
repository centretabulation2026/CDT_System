import React from "react";

export default function Slide02Context() {
  const challenges = [
    {
      num: "01",
      title: "Coordination des Mandataires",
      desc: "Déployer, orienter et certifier la présence physique d'un représentant dans chaque bureau de 350 électeurs dès l'ouverture du scrutin sans visibilité centrale.",
      risk: "Bureaux orphelins non détectés le matin",
    },
    {
      num: "02",
      title: "Collecte Dispersée des Résultats",
      desc: "Multiplication de canaux informels (appels saturés, SMS, messageries) entraînant des erreurs de retranscription, des doublons et des calculs erronés.",
      risk: "Incohérences arithmétiques internes",
    },
    {
      num: "03",
      title: "Délais de Transmission",
      desc: "Acheminement physique lent des bordereaux et coupures fréquentes des réseaux de communication dans les zones géographiques isolées.",
      risk: "Retards de plusieurs heures au QG",
    },
    {
      num: "04",
      title: "Absence de Centralisation",
      desc: "Fragmentation de l'information entre coordinateurs communaux, départementaux et la direction nationale, empêchant toute synthèse fiable en temps réel.",
      risk: "Brouillard informationnel des dirigeants",
    },
    {
      num: "05",
      title: "Gestion Documentaire Complexe",
      desc: "Photographies de procès-verbaux floues, non indexées, égarées dans des fils de discussion et inaptes à servir de justificatifs exploitables.",
      risk: "Perte de la preuve matérielle originale",
    },
    {
      num: "06",
      title: "Suivi Difficile des Incidents",
      desc: "Remontées d'irrégularités imprécises, dépourvues d'horodatage ou de localisation certifiée, rendant impossible la constitution de recours dans les délais légaux.",
      risk: "Forclusion des recours contentieux",
    },
  ];

  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="mb-4">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-1">
          DIAGNOSTIC DU TERRAIN
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-2">
          Contexte Opérationnel : Les Défis Électoraux des Organisations
        </h2>
        <p className="text-xs md:text-sm text-secondary max-w-4xl leading-relaxed">
          La gestion du jour du scrutin constitue une épreuve logistique majeure où l'absence d'outils unifiés expose les partis à des frictions critiques.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 flex-1 my-2">
        {challenges.map((c) => (
          <div key={c.num} className="border border-white/15 p-4 flex flex-col justify-between">
            <div>
              <span className="block font-mono text-[10px] font-bold tracking-widest text-accent mb-1">
                DEFIS {c.num}
              </span>
              <h3 className="text-sm md:text-base font-bold text-primary mb-2">{c.title}</h3>
              <p className="text-xs text-secondary leading-relaxed mb-3">{c.desc}</p>
            </div>
            <div className="font-mono text-[10px] text-danger border-t border-white/10 pt-2 tracking-wide">
              Risque : {c.risk}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-2 text-[10px] text-muted font-mono">
        OBSERVATION : REPONSE LOGISTIQUE ET SOUVERAINE NECESSAIRE POUR SECURISER LA COLLECTE
      </div>
    </div>
  );
}
