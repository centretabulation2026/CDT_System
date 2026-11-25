"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Save,
  Edit3,
  CheckCircle2,
  Clock,
  RotateCcw,
  Eye,
  ShieldCheck,
  Building2,
  AlertCircle,
} from "lucide-react";
import { PushpinIcon } from "@/components/layout/CustomIcons";
import { CurrentUser } from "@/types/auth";

interface MandataireGuideViewProps {
  currentUser?: CurrentUser | null;
}

const DEFAULT_GUIDE_TEXT = `Directives Générales & Consignes Légales pour les Mandataires du Parti

1. Présence et Ouverture du Bureau de Vote
Chaque mandataire accrédité doit impérativement se présenter au bureau de vote assigné dès 05h30 muni de son mandat officiel, de sa pièce d'identité (CIN ou NIF) et de son smartphone chargé. Vous devez assister à l'ouverture solennelle du bureau à 06h00 précises, vérifier avec les membres du bureau électoral que l'urne est rigoureusement vide avant son scellement et constater l'intégrité de la liste d'émargement officielle.

2. Surveillance Continue et Régularité du Scrutin
Tout au long de la journée électorale, veillez scrupuleusement au respect du secret du vote et au bon déroulement des opérations :
- Chaque électeur doit obligatoirement passer dans l'isoloir avant de déposer son bulletin dans l'urne.
- L'électeur doit signer ou apposer son empreinte sur la liste d'émargement et tremper obligatoirement son index gauche dans l'encre indélébile.
- Vous ne devez en aucun cas manipuler les bulletins de vote ni chercher à influencer le vote des électeurs.
- En cas d'irrégularité constatée, de tentative de fraude ou de perturbation, exigez immédiatement l'inscription d'une mention au procès-verbal d'incident et informez la coordination du parti.

3. Dépouillement, Vérification des Résultats et Procès-Verbal (PV)
À la clôture du bureau de vote (16h00 ou dès que tous les électeurs présents dans la file ont voté) :
- Assistez sans interruption au décompte public de l'ensemble des bulletins de vote.
- Surveillez attentivement la qualification des suffrages exprimés, des bulletins nuls et des bulletins blancs.
- Vérifiez avec une vigilance absolue que le décompte des voix attribuées à notre formation politique sur le Procès-Verbal (PV) correspond exactement aux bulletins physiques dépouillés.
- Avant de signer le Procès-Verbal officiel, assurez-vous que toutes les mentions et les chiffres sont complets et sans rature. En cas de désaccord majeur, formulez vos réserves explicites sur le PV avant d'y apposer votre signature.

4. Numérisation et Transmission Immédiate via l'Application
Dès que le PV est signé par les membres du bureau :
- Prenez une photographie nette et lisible du Procès-Verbal dans l'onglet "Procès-Verbal (PV)".
- Saisissez les résultats chiffrés obtenus par notre parti et les autres candidats dans l'onglet "Saisie des résultats" et validez la transmission.
- Conservez précieusement votre copie physique originale jusqu'à sa remise à la direction de campagne du parti.

En cas d'urgence ou de situation imprévue, contactez immédiatement la cellule d'assistance électorale de la direction du parti.`;

export default function MandataireGuideView({ currentUser }: MandataireGuideViewProps) {
  const partyName = currentUser?.tenantName || "Parti Octacore";
  const partyId = currentUser?.tenantId || partyName.toLowerCase().replace(/\s+/g, "-");
  const storageKey = `cdt_party_guide_${partyName.trim().toLowerCase()}`;

  // Déterminer si l'utilisateur est un administrateur du parti ayant le droit d'éditer
  const canEdit = currentUser?.userType === "membre" || currentUser?.userType === "superadmin";

  const [guideText, setGuideText] = useState<string>(DEFAULT_GUIDE_TEXT);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string>("");

  // 1. Charger le guide initialement
  useEffect(() => {
    // Vérifier d'abord le localStorage
    const savedLocal = localStorage.getItem(storageKey);
    const savedFallback = localStorage.getItem("cdt_party_guide_octacore");

    if (savedLocal) {
      setGuideText(savedLocal);
    } else if (savedFallback) {
      setGuideText(savedFallback);
    }

    const savedDate = localStorage.getItem(`${storageKey}_date`);
    if (savedDate) {
      setLastSaved(savedDate);
    }

    // Tenter de charger depuis l'API backend
    async function loadFromApi() {
      try {
        const res = await fetch(`/api/party-guide?partyId=${encodeURIComponent(partyId)}&partyName=${encodeURIComponent(partyName)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.guideText) {
            setGuideText(data.guideText);
            if (data.updatedAt) {
              const formattedDate = new Date(data.updatedAt).toLocaleString("fr-FR", {
                dateStyle: "medium",
                timeStyle: "short",
              });
              setLastSaved(formattedDate);
            }
          }
        }
      } catch (err) {
        // En cas d'erreur réseau, le localStorage a déjà servi de source
      }
    }
    loadFromApi();

    // Écouter les mises à jour automatiques émises par d'autres onglets ou composants
    const handleGuideUpdate = (e: any) => {
      if (e.detail?.guideText) {
        setGuideText(e.detail.guideText);
        if (e.detail.updatedAt) {
          setLastSaved(e.detail.updatedAt);
        }
      }
    };

    window.addEventListener("cdt_guide_updated", handleGuideUpdate);
    window.addEventListener("storage", handleGuideUpdate);

    return () => {
      window.removeEventListener("cdt_guide_updated", handleGuideUpdate);
      window.removeEventListener("storage", handleGuideUpdate);
    };
  }, [storageKey, partyId, partyName]);

  // 2. Sauvegarde par l'administrateur du parti
  const handleSaveGuide = async () => {
    setIsSaving(true);
    const nowFormatted = new Date().toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    try {
      // 1. Sauvegarde locale immédiate
      localStorage.setItem(storageKey, guideText);
      localStorage.setItem("cdt_party_guide_octacore", guideText);
      localStorage.setItem(`${storageKey}_date`, nowFormatted);
      setLastSaved(nowFormatted);

      // Diffuser l'événement pour synchronisation automatique immédiate
      window.dispatchEvent(
        new CustomEvent("cdt_guide_updated", {
          detail: {
            partyName,
            guideText,
            updatedAt: nowFormatted,
          },
        })
      );

      // 2. Appel serveur en arrière-plan
      await fetch("/api/party-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partyId,
          partyName,
          guideText,
          updatedBy: `${currentUser?.prenom || ""} ${currentUser?.nom || ""}`.trim() || "Administrateur",
        }),
      });

      setIsEditing(false);
      setSaveSuccessMessage("Consignes du parti enregistrées et synchronisées avec succès !");
      setTimeout(() => setSaveSuccessMessage(""), 4500);
    } catch (err) {
      console.error("Erreur sauvegarde guide:", err);
      // Même en cas d'erreur serveur, la sauvegarde locale est effective
      setIsEditing(false);
      setSaveSuccessMessage("Consignes enregistrées localement !");
      setTimeout(() => setSaveSuccessMessage(""), 4500);
    } finally {
      setIsSaving(false);
    }
  };

  // Réinitialiser au texte par défaut
  const handleResetToDefault = () => {
    if (confirm("Voulez-vous réinitialiser le texte aux directives officielles par défaut ?")) {
      setGuideText(DEFAULT_GUIDE_TEXT);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#000B58] text-white flex items-center justify-center shrink-0 shadow-xs">
              <PushpinIcon className="w-4 h-4 text-white" size={18} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Guide & Consignes du Mandataire
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-500 pl-10.5">
            Directives officielles édictées par la direction de{" "}
            <span className="font-semibold text-slate-800">{partyName}</span> pour l'ensemble des mandataires en bureau de vote.
          </p>
        </div>

        {/* ACTIONS POUR L'ADMINISTRATEUR DU PARTI */}
        {canEdit && (
          <div className="flex items-center gap-2 pl-10.5 sm:pl-0">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  title="Rétablir les consignes standard"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Rétablir défaut</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Aperçu</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveGuide}
                  disabled={isSaving}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#000B58] hover:bg-blue-900 rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Enregistrement..." : "Enregistrer"}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#000B58] hover:bg-blue-900 rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Modifier les consignes du parti</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* NOTIFICATION DE SUCCÈS */}
      {saveSuccessMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{saveSuccessMessage}</span>
        </div>
      )}

      {/* BANDEAU D'ÉTAT DU DOCUMENT */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100/70 text-[#000B58] font-bold text-[11px]">
            <Building2 className="w-3.5 h-3.5" />
            {partyName}
          </span>
          <span className="text-slate-400">•</span>
          <span className="font-medium text-slate-700">Document officiel en vigueur</span>
        </div>

        {lastSaved && (
          <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Dernière mise à jour : {lastSaved}</span>
          </div>
        )}
      </div>

      {/* CONTENU PRINCIPAL : ÉDITEUR OU TEXTE CONTINU */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {canEdit && isEditing ? (
          /* ================= MODE ÉDITION (ADMINISTRATEUR) ================= */
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Edit3 className="w-4 h-4 text-[#000B58]" />
                <span>Zone d'édition des consignes aux mandataires</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {guideText.length} caractères • {guideText.split(/\s+/).filter(Boolean).length} mots
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Rédigez ou ajustez ici le texte unique de consignes. Les modifications enregistrées seront automatiquement consultables par tous les mandataires accrédités du parti sur leur espace.
            </p>

            <textarea
              value={guideText}
              onChange={(e) => setGuideText(e.target.value)}
              rows={20}
              placeholder="Saisissez ici les directives et consignes à l'attention des mandataires de votre parti..."
              className="w-full p-4 text-[13px] leading-relaxed text-slate-800 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#000B58]/20 focus:border-[#000B58] transition-all font-sans resize-y"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 italic">
                Conseil : Structurez vos consignes par paragraphes clairs pour une lecture rapide sur mobile.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveGuide}
                  disabled={isSaving}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#000B58] hover:bg-blue-900 rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Enregistrement..." : "Enregistrer et publier"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ================= MODE LECTURE (MANDATAIRE & CONSULTATION) ================= */
          <div className="p-8 sm:p-10 space-y-6">
            {/* EN-TÊTE DU DOCUMENT */}
            <div className="text-center pb-6 border-b border-slate-100 space-y-2">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-[#000B58] mb-1">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Consignes Officielles pour les Mandataires
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Formation Politique : <strong className="text-slate-800">{partyName}</strong>
              </p>
            </div>

            {/* CORPS DU TEXTE CONTINU SANS BOÎTES D'ÉTAPES */}
            <div className="prose prose-slate max-w-none">
              <div className="text-[13px] sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-wrap selection:bg-blue-100 selection:text-[#000B58]">
                {guideText}
              </div>
            </div>

            {/* PIED DU DOCUMENT */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-slate-600">Document authentifié par la Direction du Parti</span>
              </div>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-[#000B58] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Modifier ce texte</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
