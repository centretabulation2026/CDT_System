"use client";

import React from "react";
import {
  Users,
  UserCheck,
  Flag,
  Building2,
  ArrowRight,
  Plus,
  Quote,
  ShieldCheck,
  FileCheck2,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { AutreParti } from "@/components/autres-partis/AutresPartisView";

interface PartyDashboardViewProps {
  onNavigate?: (path: string) => void;
  autresPartis: AutreParti[];
  totalBureaux?: number;
  totalMembres?: number;
  totalMandataires?: number;
}

export default function PartyDashboardView({
  onNavigate,
  autresPartis = [],
  totalBureaux = 0,
  totalMembres = 0,
  totalMandataires = 0,
}: PartyDashboardViewProps) {
  return (
    <div className="w-full space-y-6">
      {/* 1. EN-TÊTE DU DASHBOARD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Tableau de bord — Espace Parti
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate && onNavigate("/app/autres-partis")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5 text-[#000B58]" />
            <span>+ Ajouter un autre parti</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate("/app/bureaux")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors cursor-pointer hover:opacity-95"
            style={{ backgroundColor: "#000B58" }}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Gérer les bureaux</span>
          </button>
        </div>
      </div>

      {/* 2. LES 4 INDICATEURS CLÉS (TOUS CALIBRÉS À 0) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : NOMBRE DE MEMBRES DU PARTI */}
        <div
          onClick={() => onNavigate && onNavigate("/app/members")}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-[#000B58]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">
              Membres du parti
            </span>
            <Users className="w-5 h-5 text-slate-400 group-hover:text-[#000B58] transition-colors" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {totalMembres}
              </span>
              <span className="text-xs text-slate-400 font-medium font-mono">
                0 ce mois
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Adhérents enregistrés & militants actifs
            </p>
          </div>
        </div>

        {/* KPI 2 : NOMBRE DE MANDATAIRES */}
        <div
          onClick={() => onNavigate && onNavigate("/app/mandataires")}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-[#000B58]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">
              Mandataires de terrain
            </span>
            <UserCheck className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {totalMandataires}
              </span>
              <span className="text-xs font-mono text-slate-400">
                0 affecté
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Accrédités pour la surveillance des bureaux (base 350)
            </p>
          </div>
        </div>

        {/* KPI 3 : AUTRES PARTIS ENREGISTRÉS */}
        <div
          onClick={() => onNavigate && onNavigate("/app/autres-partis")}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-[#000B58]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">
              Autres partis enregistrés
            </span>
            <Flag className="w-5 h-5 text-slate-400 group-hover:text-purple-700 transition-colors" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {autresPartis.length}
              </span>
              <span className="text-xs text-slate-400 font-medium font-mono">
                0 formation
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Partis concurrents et observateurs dans le système
            </p>
          </div>
        </div>

        {/* KPI 4 : BUREAUX DE VOTE */}
        <div
          onClick={() => onNavigate && onNavigate("/app/bureaux")}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-[#000B58]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider font-mono">
              Bureaux de vote
            </span>
            <Building2 className="w-5 h-5 text-slate-400 group-hover:text-amber-700 transition-colors" />
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {totalBureaux}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (0 électeur)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Centres cartographiés par le parti
            </p>
          </div>
        </div>
      </div>

      {/* 3. SECTION SPÉCIFIQUE : AUTRES PARTIS ENREGISTRÉS DANS LE SYSTÈME */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* En-tête de section */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Flag className="w-5 h-5 text-[#000B58] shrink-0" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Autres partis politiques enregistrés dans le système
            </h2>
          </div>

          <button
            onClick={() => onNavigate && onNavigate("/app/autres-partis")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#000B58] hover:underline cursor-pointer"
          >
            <span>Accéder au module complet ({autresPartis.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Grille des cartes des partis */}
        <div className="p-6">
          {autresPartis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {autresPartis.map((parti) => (
                <div
                  key={parti.id}
                  className="border border-slate-200 hover:border-[#000B58]/30 rounded-xl p-4 bg-white hover:bg-slate-50/60 transition-all flex items-start gap-4 shadow-xs"
                >
                  {/* Logo du parti */}
                  <div className="shrink-0">
                    {parti.logoUrl ? (
                      <img
                        src={parti.logoUrl}
                        alt={parti.nom}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-xs font-mono"
                        style={{ backgroundColor: "#000B58" }}
                      >
                        {parti.sigle || parti.nom.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Détails du parti (Nom et Slogan) */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xs font-bold text-slate-900 truncate">
                        {parti.nom}
                      </h3>
                      {parti.sigle && (
                        <span className="text-[10px] font-mono text-slate-500 font-semibold shrink-0">
                          {parti.sigle}
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 flex items-start gap-1.5 text-slate-600">
                      <Quote className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] italic text-slate-600 line-clamp-2 leading-relaxed">
                        {parti.slogan}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Enregistré le {parti.dateEnregistrement}</span>
                      <span className="text-emerald-600 font-medium">Actif au scrutin</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <Flag className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Aucun autre parti enregistré pour le moment.
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Utilisez le module « Autres partis » pour renseigner vos concurrents et partenaires électoraux.
              </p>
              <button
                onClick={() => onNavigate && onNavigate("/app/autres-partis")}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
                style={{ backgroundColor: "#000B58" }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enregistrer un parti</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. VUE OPÉRATIONNELLE : DÉPLOIEMENT DES MANDATAIRES & BUREAUX (BASE 350) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Synthèse Mandataires */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#000B58]" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Déploiement des Mandataires (Base 350)
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Chaque mandataire est calibré pour surveiller un bureau légal de 350 électeurs. Le parti dispose actuellement de{" "}
            <strong className="text-slate-900 font-bold">{totalMandataires} mandataire accrédité</strong> pour sécuriser le dépouillement et la transmission des procès-verbaux.
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">Bureaux couverts</span>
              <span className="text-slate-900 font-mono font-bold">{totalBureaux} / {totalBureaux} bureau</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#000B58] rounded-full" style={{ width: totalBureaux > 0 ? "100%" : "0%" }}></div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => onNavigate && onNavigate("/app/mandataires")}
              className="text-xs font-semibold text-[#000B58] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Accéder aux mandataires</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Synthèse Membres du Parti */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#000B58]" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Structure des Membres du Parti
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
              <span className="text-lg font-bold text-slate-900 font-mono block">0</span>
              <span className="text-[10px] text-slate-500 font-medium">Bureau politique</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
              <span className="text-lg font-bold text-slate-900 font-mono block">0</span>
              <span className="text-[10px] text-slate-500 font-medium">Mandataires</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
              <span className="text-lg font-bold text-slate-900 font-mono block">{totalMembres}</span>
              <span className="text-[10px] text-slate-500 font-medium">Militants de base</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => onNavigate && onNavigate("/app/members")}
              className="text-xs font-semibold text-[#000B58] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Voir la liste des membres</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
