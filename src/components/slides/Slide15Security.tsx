import React from "react";

export default function Slide15Security() {
  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="mb-2">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-1">
          SECURITE DES DONNEES
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-1">
          Confidentialité et Cloisonnement Multi-Organisations
        </h2>
        <p className="text-xs md:text-sm text-secondary">
          Une étanchéité absolue garantit que les données stratégiques, les mandataires et les PV de chaque parti restent strictement privés.
        </p>
      </div>

      <div className="flex flex-col gap-3 flex-1 my-1">
        <div className="border border-accent p-3">
          <span className="block text-[9px] font-bold tracking-widest text-accent mb-0.5">
            SOCLE PARTAGE UNIQUE (LECTURE SEULE)
          </span>
          <h3 className="text-sm md:text-base font-bold text-primary mb-1">
            Catalogue Électoral Officiel Neutre
          </h3>
          <p className="text-[11px] text-secondary">
            Contient exclusivement les données publiques : liste officielle des candidats et découpage des bureaux de vote (350 électeurs par bureau). Aucune donnée de vote n'y est stockée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_1fr] items-center gap-3">
          <div className="border border-white/15 p-3.5">
            <span className="block font-mono text-[9px] font-bold text-accent mb-0.5">
              COFFRE-FORT NUMERIQUE 01
            </span>
            <h4 className="text-sm font-bold text-primary mb-0.5">Organisation Politique A</h4>
            <span className="block text-[9px] tracking-wider text-success mb-2.5">
              ESPACE PRIVATIF CHIFFRE
            </span>
            <div className="space-y-1 font-mono text-[10px] text-secondary mb-2.5">
              <div>Mandataires & coordonnées : Privés</div>
              <div>Résultats internes & bordereaux : Privés</div>
              <div>Procès-verbaux & photos : Privés</div>
              <div>Incidents & dossiers contentieux : Privés</div>
              <div>Compétiteurs suivis : Choix confidentiel</div>
            </div>
            <div className="border-t border-white/10 pt-1.5 text-[9px] text-muted font-mono">
              Cloisonnement par Row-Level Security (PostgreSQL / Supabase)
            </div>
          </div>

          <div className="text-center border-t md:border-t-0 md:border-l md:border-r border-white/15 py-2 md:py-4 px-2">
            <span className="block font-mono text-[9px] font-bold text-accent tracking-widest mb-1">
              ETANCHEITE ABSOLUE
            </span>
            <span className="text-[8px] text-muted font-mono">AUCUN PARTAGE CROISE</span>
          </div>

          <div className="border border-white/15 p-3.5">
            <span className="block font-mono text-[9px] font-bold text-accent mb-0.5">
              COFFRE-FORT NUMERIQUE 02
            </span>
            <h4 className="text-sm font-bold text-primary mb-0.5">Organisation Politique B</h4>
            <span className="block text-[9px] tracking-wider text-success mb-2.5">
              ESPACE PRIVATIF CHIFFRE
            </span>
            <div className="space-y-1 font-mono text-[10px] text-secondary mb-2.5">
              <div>Mandataires & coordonnées : Privés</div>
              <div>Résultats internes & bordereaux : Privés</div>
              <div>Procès-verbaux & photos : Privés</div>
              <div>Incidents & dossiers contentieux : Privés</div>
              <div>Compétiteurs suivis : Choix confidentiel</div>
            </div>
            <div className="border-t border-white/10 pt-1.5 text-[9px] text-muted font-mono">
              Cloisonnement par Row-Level Security (PostgreSQL / Supabase)
            </div>
          </div>
        </div>

        <div className="border border-white/10 p-2 text-center font-mono text-[9px] text-secondary">
          <span className="text-accent font-bold">ENGAGEMENTS MAJEURS :</span> Aucune visibilité croisée entre partis / Aucun accès aux chiffres concurrents / Propriété exclusive de vos données et PV
        </div>
      </div>
    </div>
  );
}
