import React from "react";
import Link from "next/link";

export default function Slide12Dashboard() {
  const kpis = [
    { label: "BUREAUX COUVERTS", value: "2 376 / 2 450", sub: "96,98 % du réseau" },
    {
      label: "PV RECEPTIONNES",
      value: "1 892 PV",
      sub: "662 200 électeurs (base 350)",
      highlight: true,
    },
    { label: "EN ATTENTE", value: "558 PV", sub: "Relances actives" },
    { label: "MANDATAIRES", value: "2 341", sub: "Actifs sur terminal" },
    { label: "INCIDENTS", value: "18", sub: "12 sous revue / 6 clos", alert: true },
  ];

  const hourlyBars = [
    { time: "18H00", stat: "94 PV", height: "15%" },
    { time: "19H00", stat: "420 PV", height: "38%" },
    { time: "20H00", stat: "890 PV", height: "72%" },
    { time: "21H00", stat: "1 486 PV", height: "90%", active: true },
    { time: "22H00", stat: "1 892 PV", height: "98%" },
  ];

  const geoProgress = [
    { name: "LITTORAL", pct: 88 },
    { name: "CENTRE", pct: 79 },
    { name: "NORD", pct: 65 },
    { name: "OUEST", pct: 71 },
  ];

  const sidebarNavItems = [
    { label: "TABLEAU DE BORD", active: true },
    { label: "MANDATAIRES (350)" },
    { label: "BUREAUX DE VOTE" },
    { label: "COLLECTE JOUR J" },
    { label: "PROCES-VERBAUX" },
    { label: "INCIDENTS (18)" },
    { label: "POLE JURIDIQUE" },
    { label: "ARCHIVES / EXPORT" },
  ];

  return (
    <div className="w-full h-full p-6 md:p-10 flex flex-col justify-between">
      <div className="mb-2">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-0.5">
          PILOTAGE DECISIONNEL & INTERFACE METIER
        </span>
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-primary mb-0.5">
            Tableau de Bord Exécutif : Tour de Contrôle du Jour J
          </h2>
          <Link
            href="/dashboard"
            className="border border-accent/60 hover:border-accent text-accent hover:text-white px-2.5 py-1 text-[9px] font-mono tracking-wider transition-colors"
          >
            OUVRIR LA DEMO DU DASHBOARD →
          </Link>
        </div>
        <p className="text-xs text-secondary">
          Interface opérationnelle du parti intégrant la barre latérale de commandement (sidebar carmin #BF0302).
        </p>
      </div>

      {/* Cadre de l'application avec sa sidebar rouge carmin */}
      <div className="border border-white/20 flex flex-1 my-1 overflow-hidden">
        {/* SIDEBAR ROUGE CARMIN DEMANDEE (#BF0302) */}
        <aside
          className="w-48 shrink-0 flex flex-col justify-between p-3.5 select-none"
          style={{ backgroundColor: "#BF0302" }}
        >
          <div>
            <div className="border-b border-white/30 pb-2.5 mb-3">
              <span className="block text-[11px] font-extrabold tracking-widest text-white">
                CDT SYSTEM
              </span>
              <span className="block text-[8px] tracking-wider text-white/80 font-mono">
                COCKPIT DU PARTI
              </span>
            </div>

            <nav className="space-y-1">
              {sidebarNavItems.map((item) => (
                <div
                  key={item.label}
                  className={`text-[9px] font-mono tracking-wider px-2 py-1.5 transition-colors ${
                    item.active
                      ? "text-white font-bold border-l-2 border-white"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </nav>
          </div>

          <div className="border-t border-white/30 pt-2 font-mono text-[8px] text-white/90">
            <div>SESSION SECURISEE</div>
            <div className="text-white font-bold">PARTI POLITIQUE A</div>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL DU DASHBOARD */}
        <div className="flex-1 p-3.5 flex flex-col justify-between overflow-y-auto">
          {/* Ligne des KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2.5">
            {kpis.map((k) => (
              <div
                key={k.label}
                className={`border p-2 ${
                  k.highlight
                    ? "border-accent"
                    : k.alert
                    ? "border-warning"
                    : "border-white/15"
                }`}
              >
                <span className="block text-[8px] font-bold tracking-wider text-muted mb-0.5">
                  {k.label}
                </span>
                <span className="block font-mono text-base md:text-lg font-extrabold text-primary mb-0.5">
                  {k.value}
                </span>
                <span className="text-[8px] text-secondary">{k.sub}</span>
              </div>
            ))}
          </div>

          {/* Grille inférieure (Rythme horaire + Découpage géo) */}
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-3 flex-1">
            <div className="border border-white/10 p-2.5 flex flex-col justify-between">
              <span className="block text-[8px] font-bold tracking-wider text-accent mb-1.5">
                CADENCE HORAIRE DE REMONTEE DES PV
              </span>
              <div className="flex items-end justify-around h-24 border-b border-white/15 pb-1">
                {hourlyBars.map((b) => (
                  <div key={b.time} className="flex flex-col items-center w-10 h-full justify-end">
                    <div
                      className={`w-5 border ${
                        b.active ? "border-accent" : "border-white/20"
                      } border-b-0`}
                      style={{ height: b.height }}
                    />
                    <span className="font-mono text-[8px] text-muted mt-1">{b.time}</span>
                    <span className="font-mono text-[7px] text-secondary">{b.stat}</span>
                  </div>
                ))}
              </div>
              <div className="text-[8px] font-mono text-muted pt-1">
                Pic d'activité : 20h00 - 21h30 (fermeture et dépouillements)
              </div>
            </div>

            <div className="border border-white/10 p-2.5 flex flex-col justify-between">
              <span className="block text-[8px] font-bold tracking-wider text-accent mb-1.5">
                TRANSMISSION PAR DEPARTEMENT
              </span>
              <div className="space-y-1.5">
                {geoProgress.map((g) => (
                  <div key={g.name} className="grid grid-cols-[80px_1fr_30px] items-center gap-2 text-[9px]">
                    <span className="text-secondary truncate">{g.name}</span>
                    <div className="h-1 border-b border-white/10">
                      <div className="h-1 border-b border-accent" style={{ width: `${g.pct}%` }} />
                    </div>
                    <span className="font-mono text-primary text-right">{g.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="text-[8px] font-mono text-muted pt-1">
                Actualisation en temps réel (Push WebSocket / Supabase)
              </div>
            </div>
          </div>

          <div className="font-mono text-[8px] text-muted tracking-widest text-center mt-2 border-t border-white/10 pt-1.5">
            DONNEES FICTIVES DE DEMONSTRATION — VISUEL ILLUSTRATIF DU SYSTEME
          </div>
        </div>
      </div>
    </div>
  );
}
