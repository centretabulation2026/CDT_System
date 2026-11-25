"use client";

import React from "react";
import { Building, Users, MapPin, ShieldCheck, ArrowRight, FileText, BarChart3, Clock } from "lucide-react";
import { CurrentUser } from "@/types/auth";
import { CollecteIcon } from "@/components/layout/CustomIcons";

interface MonBureauViewProps {
  currentUser: CurrentUser;
  onNavigate?: (path: string) => void;
}

export default function MonBureauView({ currentUser, onNavigate }: MonBureauViewProps) {
  const bureauNom = currentUser.bureauAssigne || "École Nationale République d'Argentine (BV-01)";
  const commune = currentUser.commune || "Port-au-Prince";
  const departement = currentUser.departement || "Ouest";

  return (
    <div className="w-full space-y-6">
      {/* 1. EN-TÊTE ÉPURÉ */}
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Mon Bureau de Vote
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Surveillance active
          </span>
        </div>
      </div>

      {/* 2. CARTE PRINCIPALE DU BUREAU ASSIGNÉ */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: "#000B58" }}
            >
              <Building className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                {bureauNom}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {commune}, Dépt. {departement}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">
                  Norme officielle 350 électeurs
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grille d'informations de surveillance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Capacité maximale
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">350</span>
              <span className="text-xs text-slate-500">électeurs inscrits</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Mandataire accrédité
            </span>
            <div className="mt-2">
              <div className="text-sm font-bold text-slate-900 truncate">
                {currentUser.prenom} {currentUser.nom}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {currentUser.telephone || "Accréditation validée"}
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Horodatage scrutin
            </span>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-700">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Dépouillement & Clôture</span>
            </div>
          </div>
        </div>

        {/* Actions directes pour le mandataire */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate && onNavigate("/app/collecte")}
            className="p-4 border border-slate-200 hover:border-[#000B58] rounded-xl text-left bg-white hover:bg-slate-50 transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="shrink-0 flex items-center justify-center">
                  <CollecteIcon size={26} className="text-[#000B58] group-hover:scale-105 transition-transform" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#000B58]">
                    Saisie des résultats
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Saisir les voix obtenues par chaque parti
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#000B58]" />
            </div>
          </button>

          <button
            onClick={() => onNavigate && onNavigate("/app/pv")}
            className="p-4 border border-slate-200 hover:border-[#000B58] rounded-xl text-left bg-white hover:bg-slate-50 transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="shrink-0 flex items-center justify-center">
                  <FileText size={26} className="text-[#000B58] group-hover:scale-105 transition-transform" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#000B58]">
                    Transmettre le Procès-Verbal (PV)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Photographier et téléverser le PV officiel signé
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#000B58]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
