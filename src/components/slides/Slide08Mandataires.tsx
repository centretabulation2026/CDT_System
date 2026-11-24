import React from "react";

export default function Slide08Mandataires() {
  const treeLevels = [
    { lvl: "ECHELON 01", name: "CIRCONSCRIPTION / REGION", stat: "12 Régions supervisées" },
    { lvl: "ECHELON 02", name: "DEPARTEMENT", stat: "77 Départements administratifs" },
    { lvl: "ECHELON 03", name: "COMMUNE", stat: "546 Communes répertoriées" },
    { lvl: "ECHELON 04", name: "CENTRE DE VOTE", stat: "1 180 Lieux d'implantation (écoles, mairies)" },
    {
      lvl: "ECHELON UNITAIRE 05",
      name: "BUREAU DE VOTE (350 ELECTEURS)",
      stat: "2 450 Bureaux de vote affectables",
      active: true,
    },
  ];

  const ledgerSample = [
    {
      id: "BV-012",
      place: "Commune de Grand-Bourg — École Publique A",
      agent: "Michel S. (Validé & Actif)",
      status: "COUVERT [ 350 ELECTEURS ]",
      ok: true,
    },
    {
      id: "BV-013",
      place: "Commune de Grand-Bourg — École Publique B",
      agent: "Aïcha K. (Validé & Actif)",
      status: "COUVERT [ 350 ELECTEURS ]",
      ok: true,
    },
    {
      id: "BV-014",
      place: "Commune de Belle-Vue — Salle Polyvalente",
      agent: "Non affecté",
      status: "NON COUVERT — ACTION REQUISE",
      ok: false,
    },
  ];

  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="mb-2">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-1">
          DEPLOIEMENT TERRITORIAL
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-1">
          Organisation des Mandataires : Maillage & Affectations
        </h2>
        <p className="text-xs md:text-sm text-secondary">
          Assurer la couverture intégrale de chaque bureau de vote (base 350 électeurs) et superviser les affectations en temps réel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-6 flex-1 my-1">
        <div className="border border-white/15 p-4 flex flex-col justify-between">
          <span className="block text-[10px] font-bold tracking-widest text-accent mb-2">
            ARBORESCENCE DU DECOUPAGE ADMINISTRATIF
          </span>
          <div className="space-y-1">
            {treeLevels.map((t, idx) => (
              <React.Fragment key={t.lvl}>
                <div
                  className={`border p-2 ${
                    t.active ? "border-accent" : "border-white/10"
                  }`}
                >
                  <span className="block font-mono text-[9px] text-accent">{t.lvl}</span>
                  <span className="block text-xs font-bold text-primary">{t.name}</span>
                  <span className="text-[10px] text-muted">{t.stat}</span>
                </div>
                {idx < treeLevels.length - 1 && (
                  <div className="text-center font-mono text-muted text-[10px] py-0.5">|</div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-[10px] font-mono text-muted border-t border-white/10 pt-2">
            MAILLE UNITAIRE INDIVISIBLE : 1 BUREAU = 1 MANDATAIRE = 350 INSCRITS
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="block text-[10px] font-bold tracking-widest text-accent mb-2">
              SUPERVISION DU TAUX D'AFFECTATION (EXEMPLE DE SIMULATION)
            </span>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="border border-white/15 p-3">
                <span className="block text-[9px] font-bold tracking-wider text-muted mb-1">
                  TOTAL DES BUREAUX
                </span>
                <span className="block text-2xl font-extrabold font-mono text-primary mb-1">
                  2 450
                </span>
                <span className="text-[10px] text-secondary">857 500 électeurs potentiels</span>
              </div>
              <div className="border border-accent p-3">
                <span className="block text-[9px] font-bold tracking-wider text-muted mb-1">
                  BUREAUX COUVERTS
                </span>
                <span className="block text-2xl font-extrabold font-mono text-primary mb-1">
                  2 376
                </span>
                <span className="text-[10px] text-secondary">Taux de couverture : 97,0 %</span>
              </div>
              <div className="border border-danger p-3">
                <span className="block text-[9px] font-bold tracking-wider text-muted mb-1">
                  SANS MANDATAIRE
                </span>
                <span className="block text-2xl font-extrabold font-mono text-primary mb-1">
                  74
                </span>
                <span className="text-[10px] text-danger">Alerte : Remplacement requis</span>
              </div>
            </div>

            <div className="border border-white/15">
              <div className="font-mono text-[10px] font-bold text-accent p-2 border-b border-white/15">
                REGISTRE DES AFFECTATIONS DU DEPARTEMENT NORD
              </div>
              {ledgerSample.map((l) => (
                <div
                  key={l.id}
                  className="grid grid-cols-[60px_1fr_160px_140px] p-2 border-b border-white/5 last:border-b-0 text-[10px] items-center"
                >
                  <span className="font-mono font-bold text-primary">{l.id}</span>
                  <span className="text-secondary">{l.place}</span>
                  <span className="text-muted">{l.agent}</span>
                  <span
                    className={`text-right font-mono text-[9px] ${
                      l.ok ? "text-success" : "text-danger"
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-2 font-mono text-[10px] text-muted">
            FONCTIONNALITE : ALERTE AUTOMATIQUE EN CAS D'ABSENCE AU POSTE 30 MIN AVANT L'OUVERTURE
          </div>
        </div>
      </div>
    </div>
  );
}
