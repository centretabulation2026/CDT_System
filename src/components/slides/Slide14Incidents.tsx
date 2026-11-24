import React from "react";

export default function Slide14Incidents() {
  const steps = [
    {
      seq: "01",
      title: "Signalement Immédiat",
      desc: "Le mandataire constate l'anomalie dans son bureau de 350 électeurs et déclenche une fiche d'incident sur son terminal.",
      tag: "Qualification immédiate du fait",
    },
    {
      seq: "02",
      title: "Documentation Factuelle",
      desc: "Ajout de photographies des pièces litigieuses, témoignages précis, relevé d'émargement et description circonstanciée.",
      tag: "Preuves photographiques horodatées",
    },
    {
      seq: "03",
      title: "Scellement Numérique",
      desc: "Enregistrement inaltérable : horodatage technique, localisation du terminal et empreinte numérique cryptographique.",
      tag: "Intégrité de la preuve préservée",
    },
    {
      seq: "04",
      title: "Examen par les Juristes",
      desc: "Le pôle juridique au QG central analyse la matérialité de l'incident, vérifie la conformité aux textes électoraux et classe le grief.",
      tag: "Filtrage et qualification juridique",
    },
    {
      seq: "05",
      title: "Constitution du Recours",
      desc: "Export automatique d'un bordereau de pièces prêtes pour mémoire contentieux à déposer auprès du juge de l'élection dans les délais impartis.",
      tag: "Dossier de plaidoirie complet",
    },
  ];

  const benefits = [
    {
      label: "GAIN DECISIF 01",
      text: "Fin des allégations sans preuve : chaque incident est adossé à un bureau précis et un ensemble de pièces objectives.",
    },
    {
      label: "GAIN DECISIF 02",
      text: "Maîtrise des délais légaux : les avocats disposent des éléments dès la clôture sans attendre l'acheminement physique.",
    },
    {
      label: "GAIN DECISIF 03",
      text: "Crédibilité institutionnelle : recours structurés respectant les standards de preuve des cours souveraines.",
    },
  ];

  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="mb-2">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-1">
          GESTION DU CONTENTIEUX
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-1">
          Incidents et Documentation Juridique
        </h2>
        <p className="text-xs md:text-sm text-secondary">
          Transformer une observation de terrain en un dossier de recours rigoureux, documenté et opposable devant les juridictions compétentes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 my-2">
        {steps.map((s) => (
          <div key={s.seq} className="border border-white/15 p-3 flex flex-col justify-between">
            <div>
              <span className="block font-mono text-[10px] font-bold text-accent mb-1">{s.seq}</span>
              <h3 className="text-xs md:text-sm font-bold text-primary mb-1">{s.title}</h3>
              <p className="text-[11px] text-secondary leading-snug mb-3">{s.desc}</p>
            </div>
            <div className="font-mono text-[9px] text-muted border-t border-white/10 pt-1.5">
              {s.tag}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {benefits.map((b) => (
          <div key={b.label} className="border border-white/10 p-2.5">
            <span className="block font-mono text-[9px] font-bold text-accent mb-1">
              {b.label}
            </span>
            <p className="text-[11px] text-secondary leading-snug">{b.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
