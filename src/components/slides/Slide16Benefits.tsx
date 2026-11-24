import React from "react";

export default function Slide16Benefits() {
  const benefits = [
    {
      num: "01",
      title: "Organisation",
      desc: "Maillage territorial clair de chaque bureau de vote (base 350 électeurs) et chaîne de commandement opérationnelle explicite.",
    },
    {
      num: "02",
      title: "Centralisation",
      desc: "Rapprochement de l'ensemble des flux d'information terrain dans une interface unique accessible aux seuls décideurs désignés.",
    },
    {
      num: "03",
      title: "Rapidité de Transmission",
      desc: "Réduction drastique des délais de collecte : résultats consolidés disponibles quelques minutes après la clôture du dépouillement.",
    },
    {
      num: "04",
      title: "Traçabilité",
      desc: "Chaque chiffre est adossé à son procès-verbal original photographié, horodaté et associé au mandataire signataire.",
    },
    {
      num: "05",
      title: "Analyse Décisionnelle",
      desc: "Tableaux de bord dynamiques et comparateurs par compétiteur permettant des prises de parole appuyées sur des faits mesurés.",
    },
    {
      num: "06",
      title: "Supervision en Direct",
      desc: "Visibilité continue sur la présence des mandataires le matin et alerte immédiate en cas de bureau de vote non couvert.",
    },
    {
      num: "07",
      title: "Documentation Juridique",
      desc: "Constitution méthodique de dossiers de contestation étayés, permettant aux juristes d'agir avant l'expiration des délais légaux.",
    },
    {
      num: "08",
      title: "Continuité Hors Connexion",
      desc: "Fonctionnement garanti en zones blanches et synchronisation transparente dès le rétablissement de la couverture cellulaire.",
    },
  ];

  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="mb-2">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-1">
          SYNTHESE DES BENEFICES
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-1">
          Les Huit Avantages Majeurs de la Solution
        </h2>
        <p className="text-xs md:text-sm text-secondary">
          Une proposition de valeur globale conçue pour répondre point par point aux impératifs d'un état-major politique en campagne.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3 flex-1 my-2">
        {benefits.map((b) => (
          <div key={b.num} className="border border-white/15 p-3.5 flex flex-col justify-between">
            <div>
              <span className="block font-mono text-[10px] font-bold text-accent mb-1">
                {b.num}
              </span>
              <h3 className="text-sm font-bold text-primary mb-1.5">{b.title}</h3>
              <p className="text-[11px] text-secondary leading-relaxed">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
