import React from "react";

export default function Slide11Offline() {
  const phases = [
    {
      badge: "PHASE 01",
      title: "Saisie Locale Complète",
      sub: "ZONE SANS COUVERTURE RESEAU",
      desc: "Le mandataire saisit l'ensemble des données du bureau de 350 électeurs et capture la photographie du procès-verbal directement sur son smartphone, sans nécessiter d'accès à Internet.",
      footer: "Contrôles d'intégrité arithmétique actifs en local",
    },
    {
      badge: "PHASE 02",
      title: "Stockage Chiffré Local",
      sub: "PERSISTANCE DU TERMINAL",
      desc: "Les données de vote, les métadonnées de saisie et les clichés sont enregistrés de façon chiffrée dans la base de données locale du téléphone du mandataire.",
      footer: "Données protégées contre l'extinction de l'appareil",
    },
    {
      badge: "PHASE 03",
      title: "Auto-Synchronisation",
      sub: "SIGNAL 2G / 3G / 4G DETECTE",
      desc: "Dès que le mandataire capte à nouveau un signal mobile ou rejoint un point d'accès Wi-Fi, la file d'attente locale est synchronisée automatiquement avec la base centrale.",
      footer: "Accusé de réception formel retourné au mandataire",
    },
  ];

  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="mb-2">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-1">
          CONTINUITE DU SERVICE
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-1">
          Fonctionnement Hors Connexion : Résilience en Zone Blanche
        </h2>
        <p className="text-xs md:text-sm text-secondary">
          Les opérations électorales ne doivent subir aucune interruption en cas d'absence ou de défaillance du réseau de télécommunication.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 flex-1 my-2">
        {phases.map((p, idx) => (
          <React.Fragment key={p.badge}>
            <div className="border border-white/15 p-4 md:p-5 flex-1 h-full flex flex-col justify-between">
              <div>
                <span className="block font-mono text-[10px] font-bold tracking-widest text-accent mb-1.5">
                  {p.badge}
                </span>
                <h3 className="text-base font-bold text-primary mb-1">{p.title}</h3>
                <span className="block text-[9px] font-semibold tracking-wider text-muted mb-3">
                  {p.sub}
                </span>
                <p className="text-xs text-secondary leading-relaxed mb-4">{p.desc}</p>
              </div>
              <div className="border-t border-white/10 pt-2 text-[10px] font-mono text-success">
                {p.footer}
              </div>
            </div>
            {idx < phases.length - 1 && (
              <div className="hidden md:block font-mono text-xl text-accent px-1">→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="border border-white/15 p-2.5 font-mono text-[10px] text-muted tracking-wide">
        PROTOCOLE TECHNIQUE : Base relationnelle locale autonome, requêtes idempotentes (zéro doublon), reprise sur incident sans perte de données.
      </div>
    </div>
  );
}
