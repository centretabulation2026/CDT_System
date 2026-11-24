"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export default function MandataireGuideView() {
  return (
    <div className="w-full space-y-6">
      {/* 1. EN-TÊTE ÉPURÉ */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Guide & Procédures Légales du Mandataire
        </h1>
      </div>

      {/* 2. CONTENU DU GUIDE */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 border border-slate-200 rounded-xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#000B58] flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Ouverture du Bureau (06h00)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vérifier que l'urne est vide avant le scellement. Constater la présence des membres du bureau et l'intégrité du registre d'émargement de 350 électeurs.
            </p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#000B58] flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Surveillance du Scrutin
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              S'assurer que chaque électeur vote dans l'isoloir, émarge et trempe son doigt dans l'encre indélébile. Noter immédiatement tout incident ou tentative de fraude.
            </p>
          </div>

          <div className="p-5 border border-slate-200 rounded-xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#000B58] flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Dépouillement & Signature du PV
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assister au décompte public des voix. Vérifier que les résultats sont correctement inscrits sur le PV officiel, signer le document et le photographier immédiatement via l'application.
            </p>
          </div>
        </div>

        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Consigne de sécurité :</strong> En cas de contestation majeure, faites porter mention de votre réserve sur le Procès-Verbal avant de signer. Ne quittez jamais le bureau sans avoir photographié et transmis le PV signé.
          </p>
        </div>
      </div>
    </div>
  );
}
