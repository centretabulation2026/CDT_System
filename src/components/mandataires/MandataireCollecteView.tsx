"use client";

import React, { useState } from "react";
import { Plus, CheckCircle2, AlertCircle, Save, Building } from "lucide-react";
import { CurrentUser } from "@/types/auth";
import { AutreParti } from "@/components/autres-partis/AutresPartisView";

interface MandataireCollecteViewProps {
  currentUser: CurrentUser;
  autresPartis?: AutreParti[];
}

export default function MandataireCollecteView({
  currentUser,
  autresPartis = [],
}: MandataireCollecteViewProps) {
  const bureauNom = currentUser.bureauAssigne || "École Nationale République d'Argentine (BV-01)";

  // Votes pour le parti officiel
  const [voixPDU, setVoixPDU] = useState<string>("0");

  // Votes pour les autres partis (clé = parti.id)
  const [voixAutres, setVoixAutres] = useState<{ [id: string]: string }>({});

  // Bulletins nuls et blancs
  const [bulletinsNuls, setBulletinsNuls] = useState<string>("0");
  const [bulletinsBlancs, setBulletinsBlancs] = useState<string>("0");

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calcul du total des votants
  const numPDU = parseInt(voixPDU || "0", 10) || 0;
  const numNuls = parseInt(bulletinsNuls || "0", 10) || 0;
  const numBlancs = parseInt(bulletinsBlancs || "0", 10) || 0;
  const numAutresTotal = Object.values(voixAutres).reduce(
    (acc, val) => acc + (parseInt(val || "0", 10) || 0),
    0
  );
  const totalVotants = numPDU + numAutresTotal + numNuls + numBlancs;

  const handleAutreVoixChange = (id: string, val: string) => {
    setVoixAutres((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (totalVotants > 350) {
      setErrorMessage(
        `Erreur arithmétique : Le total des votes exprimés (${totalVotants}) dépasse la capacité légale du bureau de vote (350 électeurs inscrits maximum).`
      );
      return;
    }

    setSuccessMessage("Résultats du bureau enregistrés et transmis au centre de compilation.");
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4500);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. EN-TÊTE ÉPURÉ */}
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Collecte & Dépouillement des Résultats
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg">
            {bureauNom}
          </span>
        </div>
      </div>

      {/* 2. FORMULAIRE PLEINE LARGEUR */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-xl border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Grille des partis */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Voix obtenues par formation politique
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Notre parti */}
              <div className="space-y-1.5 p-4 rounded-xl border border-blue-200 bg-blue-50/20">
                <label className="text-xs font-bold text-slate-900 block truncate">
                  Parti Démocratique Uni (PDU) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="350"
                  value={voixPDU}
                  onChange={(e) => setVoixPDU(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58]"
                />
              </div>

              {/* Autres partis enregistrés */}
              {autresPartis.map((p) => (
                <div key={p.id} className="space-y-1.5 p-4 rounded-xl border border-slate-200 bg-slate-50/20">
                  <label className="text-xs font-semibold text-slate-900 block truncate">
                    {p.nom} {p.sigle ? `(${p.sigle})` : ""}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="350"
                    value={voixAutres[p.id] || "0"}
                    onChange={(e) => handleAutreVoixChange(p.id, e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58]"
                  />
                </div>
              ))}

              {/* Bulletins Nuls */}
              <div className="space-y-1.5 p-4 rounded-xl border border-slate-200 bg-slate-50/20">
                <label className="text-xs font-semibold text-slate-700 block">
                  Bulletins nuls
                </label>
                <input
                  type="number"
                  min="0"
                  max="350"
                  value={bulletinsNuls}
                  onChange={(e) => setBulletinsNuls(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58]"
                />
              </div>

              {/* Bulletins Blancs */}
              <div className="space-y-1.5 p-4 rounded-xl border border-slate-200 bg-slate-50/20">
                <label className="text-xs font-semibold text-slate-700 block">
                  Bulletins blancs
                </label>
                <input
                  type="number"
                  min="0"
                  max="350"
                  value={bulletinsBlancs}
                  onChange={(e) => setBulletinsBlancs(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58]"
                />
              </div>
            </div>
          </div>

          {/* Récapitulatif arithmétique */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-500">Total votants comptabilisés :</span>
              <span className={`text-base font-bold ${totalVotants > 350 ? "text-red-600" : "text-slate-900"}`}>
                {totalVotants} / 350
              </span>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer hover:opacity-95 active:scale-95 shadow-sm"
              style={{ backgroundColor: "#000B58" }}
            >
              <Save className="w-4 h-4" />
              <span>Valider et transmettre les résultats</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
