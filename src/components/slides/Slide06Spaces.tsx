import React from "react";
import Link from "next/link";

export default function Slide06Spaces() {
  const spaces = [
    {
      num: "ESPACE 01",
      title: "Site Public Institutionnel",
      sub: "PORTAIL EXTERNE D'INFORMATION",
      desc: "Point d'entrée ouvert au public, aux organisations et aux observateurs. Présentation des garanties déontologiques, des fonctionnalités et formulaire de contact.",
      specs: [
        "Public : Visiteurs, dirigeants, presse",
        "Fonction : Information & prise de contact",
        "Sécurité : Vitrine isolée du réseau métier",
      ],
    },
    {
      num: "ESPACE 02",
      title: "Portail d'Inscription & Paiement",
      sub: "ENREGISTREMENT ET SOUSCRIPTION",
      desc: "Espace d'adhésion pour les partis politiques déclarés. Vérification des pièces d'habilitation, validation contractuelle, choix des forfaits et paiement sécurisé.",
      specs: [
        "Public : Secrétariats généraux & trésoriers",
        "Fonction : Vérification KYC & activation",
        "Sécurité : Chiffrement des transactions",
      ],
    },
    {
      num: "ESPACE 03",
      title: "Dashboard Super Admin",
      sub: "SUPERVISION TECHNIQUE CENTRALE",
      desc: "Console de gouvernance globale. Administration des instances, surveillance de la disponibilité des serveurs, maintenance du catalogue électoral et découpages.",
      specs: [
        "Public : Administrateurs système habilités",
        "Fonction : Référentiel électoral & monitoring",
        "Sécurité : Double authentification stricte",
      ],
    },
    {
      num: "ESPACE 04",
      title: "Espace Souverain du Parti",
      sub: "COCKPIT DE COMMANDEMENT METIER",
      desc: "L'environnement privé, étanche et souverain de l'organisation politique : gestion de l'organigramme, affectation des mandataires, collecte des 350 électeurs, PV et analyses.",
      specs: [
        "Public : États-majors, cadres & mandataires",
        "Fonction : Conduite intégrale des opérations",
        "Sécurité : Chiffrement multi-tenant étanche",
      ],
    },
  ];

  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="mb-3">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-1">
          ARCHITECTURE APPLICATIVE
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-1">
          Les Quatre Espaces de la Plateforme
        </h2>
        <p className="text-xs md:text-sm text-secondary">
          Quatre environnements dédiés répondant chacun à une mission spécifique de la chaîne de valeur électorale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 my-2">
        {spaces.map((s) => (
          <div key={s.num} className="border border-white/15 p-4 flex flex-col justify-between">
            <div>
              <span className="block font-mono text-[9px] font-bold tracking-widest text-accent mb-1">
                {s.num}
              </span>
              <h3 className="text-sm md:text-base font-bold text-primary mb-1">{s.title}</h3>
              <span className="block text-[9px] font-semibold tracking-wider text-muted mb-3">
                {s.sub}
              </span>
              <p className="text-xs text-secondary leading-relaxed mb-4">{s.desc}</p>
            </div>
            <div className="border-t border-white/10 pt-2 flex flex-col gap-1 font-mono text-[9px] text-muted">
              {s.specs.map((spec, i) => (
                <div key={i}>{spec}</div>
              ))}
              {s.num === "ESPACE 02" && (
                <div className="pt-1.5">
                  <Link
                    href="/login"
                    className="inline-block border border-accent/60 hover:border-accent text-accent hover:text-white px-2 py-0.5 tracking-wider transition-colors"
                  >
                    TESTER LE PORTAIL DE CONNEXION →
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
