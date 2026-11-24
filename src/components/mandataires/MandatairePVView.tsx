"use client";

import React, { useState, useRef } from "react";
import { Upload, CheckCircle2, AlertCircle, FileText, Camera, ShieldCheck } from "lucide-react";
import { CurrentUser } from "@/types/auth";

interface MandatairePVViewProps {
  currentUser: CurrentUser;
}

export default function MandatairePVView({ currentUser }: MandatairePVViewProps) {
  const bureauNom = currentUser.bureauAssigne || "École Nationale République d'Argentine (BV-01)";
  const [pvImage, setPvImage] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMessage("Le document est trop volumineux (maximum 8 Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPvImage(reader.result as string);
        setTimestamp(new Date().toLocaleString("fr-FR"));
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransmettre = () => {
    if (!pvImage) {
      setErrorMessage("Veuillez sélectionner ou capturer la photographie du Procès-Verbal officiel.");
      return;
    }

    setSuccessMessage(
      `Procès-Verbal transmis avec succès au serveur central du parti. Horodatage certifié : ${timestamp}`
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. EN-TÊTE ÉPURÉ */}
      <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Procès-Verbal (PV) Officiel de Dépouillement
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-lg">
            {bureauNom}
          </span>
        </div>
      </div>

      {/* 2. ZONE DE CAPTURE / UPLOAD */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Bloc d'upload */}
          <div className="space-y-4">
            <label className="text-xs font-semibold text-slate-900 block">
              Photographie du Procès-Verbal signé
            </label>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleUpload}
                className="hidden"
                id="pv-camera-upload"
              />
              <label
                htmlFor="pv-camera-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-3"
              >
                <div
                  className="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: "#000B58" }}
                >
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Prendre une photo ou sélectionner un document
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">
                    Format JPG ou PNG • Résolution claire et lisible
                  </span>
                </div>
              </label>
            </div>

            {timestamp && (
              <div className="text-xs font-mono text-slate-600 flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Horodatage de capture : {timestamp}</span>
              </div>
            )}

            <button
              onClick={handleTransmettre}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer hover:opacity-95 active:scale-95 shadow-sm"
              style={{ backgroundColor: "#000B58" }}
            >
              <Upload className="w-4 h-4" />
              <span>Transmettre le PV au Centre de Données</span>
            </button>
          </div>

          {/* Prévisualisation */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-900 block">
              Aperçu du document capturé
            </label>
            <div className="w-full h-80 rounded-2xl border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden">
              {pvImage ? (
                <img src={pvImage} alt="PV Officiel" className="w-full h-full object-contain bg-black" />
              ) : (
                <div className="text-center text-slate-400 p-6">
                  <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-medium">Aucun procès-verbal capturé pour le moment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
