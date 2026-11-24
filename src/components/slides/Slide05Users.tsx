import React from "react";

export default function Slide05Users() {
  const roles = [
    {
      lvl: "RANG 01",
      title: "Super Administrateur",
      scope: "PORTAL CENTRAL & GOUVERNANCE",
      desc: "Gestion de l'infrastructure globale, validation des organisations politiques clientes et maintenance du catalogue officiel des élections.",
      perimeter: "Système global multi-organisations",
    },
    {
      lvl: "RANG 02",
      title: "Responsable du Parti",
      scope: "DIRECTION POLITIQUE DU PARTI",
      desc: "Accès intégral au cockpit du parti, définition de la stratégie de veille sur les compétiteurs et validation finale des déclarations.",
      perimeter: "Ensemble du parti client",
    },
    {
      lvl: "RANG 03",
      title: "Coordonnateur National",
      scope: "DIRECTION DES OPERATIONS JOUR J",
      desc: "Pilotage national en temps réel de la couverture territoriale, supervision de l'avancement de la collecte et arbitrage logistique.",
      perimeter: "Territoire national complet",
    },
    {
      lvl: "RANG 04",
      title: "Coordonnateur Départemental",
      scope: "SUPERVISION INTERMEDIAIRE",
      desc: "Coordination des communes rattachées au département, relance des zones en retard et validation intermédiaire des alertes remontées.",
      perimeter: "Département d'affectation",
    },
    {
      lvl: "RANG 05",
      title: "Coordonnateur Communal",
      scope: "COMMANDEMENT DE TERRAIN",
      desc: "Supervision directe des centres de vote et des mandataires de sa commune. Gestion des remplacements en cas d'absence au poste.",
      perimeter: "Commune et centres locaux",
    },
    {
      lvl: "RANG 06",
      title: "Mandataire de Bureau",
      scope: "ACTEUR DU BUREAU DE VOTE",
      desc: "Affecté à un bureau unitaire de 350 électeurs. Saisie locale des résultats du dépouillement, photographie du PV et signalement immédiat d'incidents.",
      perimeter: "1 bureau (350 électeurs)",
    },
    {
      lvl: "RANG 07",
      title: "Responsable Juridique",
      scope: "POLE CONTENTIEUX & AUDIT",
      desc: "Accès spécialisé en consultation et extraction des PV originaux scellés et des dossiers d'incidents documentés pour instruire les recours officiels.",
      perimeter: "Coffre-fort des preuves & litiges",
    },
  ];

  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="mb-2">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-1">
          ORGANIGRAMME ET PRIVILEGES
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-1">
          Les Utilisateurs : Matrice Hiérarchique & Rôles Définis
        </h2>
        <p className="text-xs md:text-sm text-secondary">
          Sept profils d'accès aux responsabilités strictement cloisonnées pour garantir la chaîne de commandement.
        </p>
      </div>

      <div className="flex flex-col gap-1.5 flex-1 my-1">
        {roles.map((r) => (
          <div
            key={r.lvl}
            className="grid grid-cols-1 md:grid-cols-[70px_220px_1fr_210px] items-center gap-3 border border-white/15 px-3 py-1.5"
          >
            <span className="font-mono text-[9px] font-bold tracking-wider text-accent">
              {r.lvl}
            </span>
            <div>
              <h3 className="text-xs md:text-sm font-bold text-primary">{r.title}</h3>
              <span className="block text-[8px] font-semibold tracking-wider text-muted">
                {r.scope}
              </span>
            </div>
            <p className="text-[11px] text-secondary leading-snug">{r.desc}</p>
            <div className="font-mono text-[9px] text-accent md:text-right border-t md:border-t-0 md:border-l border-white/10 md:pl-3 pt-1 md:pt-0">
              {r.perimeter}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
