import React from "react";

export default function Slide10PV() {
  const steps = [
    {
      seq: "ETAPE 01",
      title: "Photographie In Situ",
      desc: "Prise de vue du procès-verbal physique de dépouillement dès signature par les membres du bureau de 350 électeurs.",
      meta: "Capture guidée pour lisibilité intégrale",
    },
    {
      seq: "ETAPE 02",
      title: "Extraction Métadonnées",
      desc: "Adjonction automatique des marqueurs techniques : date et heure à la seconde, coordonnées GPS si disponibles, ID mandataire.",
      meta: "Empreinte numérique calculée (SHA-256)",
    },
    {
      seq: "ETAPE 03",
      title: "Transmission Chiffrée",
      desc: "Envoi du fichier image original non compressé vers le compartiment de stockage cloud sécurisé du parti.",
      meta: "Canal TLS protégé de bout en bout",
    },
    {
      seq: "ETAPE 04",
      title: "Conservation & Audit",
      desc: "Archivage dans le coffre-fort documentaire du parti politique. Historique d'accès audité et inaltérabilité garantie.",
      meta: "Consultable immédiatement par les juristes",
    },
  ];

  return (
    <div className="w-full h-full p-8 md:p-14 flex flex-col justify-between">
      <div className="mb-2">
        <span className="block text-[10px] font-bold tracking-[0.2em] text-accent mb-1">
          TRAÇABILITE DES ACTES
        </span>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mb-1">
          Procès-Verbaux et Preuves : Du Terrain au Scellement
        </h2>
        <p className="text-xs md:text-sm text-secondary">
          La valeur d'un résultat repose sur l'authenticité de son document source original et l'intégrité de ses métadonnées.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 my-2">
        {steps.map((s) => (
          <div key={s.seq} className="border border-white/15 p-3.5 flex flex-col justify-between">
            <div>
              <span className="block font-mono text-[9px] font-bold tracking-widest text-accent mb-1">
                {s.seq}
              </span>
              <h3 className="text-xs md:text-sm font-bold text-primary mb-1">{s.title}</h3>
              <p className="text-[11px] text-secondary leading-relaxed mb-3">{s.desc}</p>
            </div>
            <div className="text-[9px] font-mono text-muted border-t border-white/10 pt-2">
              {s.meta}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-accent p-3.5">
        <div className="flex justify-between border-b border-white/10 pb-1.5 mb-2.5 font-mono text-[10px]">
          <span className="text-accent font-bold tracking-wider">
            METADONNEES CERTIFIEES DU PROCES-VERBAL ATTACHE (SIMULATION)
          </span>
          <span className="text-muted">DOCUMENT REF : PV-LITTORAL-042-2026.JPG</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
          <div className="flex">
            <span className="text-muted w-44 shrink-0">HORODATAGE CAPTURE :</span>
            <span className="text-primary">19 NOVEMBRE 2026 — 20:14:38 UTC</span>
          </div>
          <div className="flex">
            <span className="text-muted w-44 shrink-0">GEOLOCALISATION :</span>
            <span className="text-primary">LAT 6°21'44'' N / LON 2°25'50'' E (RAYON 5M)</span>
          </div>
          <div className="flex">
            <span className="text-muted w-44 shrink-0">SIGNATAIRE TERRAIN :</span>
            <span className="text-primary">JEAN-LUC D. (MATRICULE M-9041)</span>
          </div>
          <div className="flex">
            <span className="text-muted w-44 shrink-0">EMPREINTE SHA-256 :</span>
            <span className="text-primary truncate">
              E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
