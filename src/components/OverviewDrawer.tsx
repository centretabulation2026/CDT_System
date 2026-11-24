"use client";

import React from "react";
import { SlideMeta } from "@/types/presentation";

interface OverviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideMeta[];
  currentIndex: number;
  onSelectSlide: (index: number) => void;
}

export default function OverviewDrawer({
  isOpen,
  onClose,
  slides,
  currentIndex,
  onSelectSlide,
}: OverviewDrawerProps) {
  if (!isOpen) return null;

  return (
    <aside className="fixed inset-0 z-50 p-8 md:p-12 flex flex-col border border-white/15 print-hide bg-canvas">
      <div className="flex justify-between items-center border-b border-white/15 border-l-4 border-sidebarRed pl-3 pb-3 mb-6">
        <span className="text-sm font-bold tracking-[0.2em] text-primary">
          SOMMAIRE DES 17 DIAPOSITIVES
        </span>
        <button
          onClick={onClose}
          title="Fermer le sommaire (Echap)"
          className="border border-white/20 hover:border-primary text-secondary hover:text-primary text-[10px] font-semibold tracking-widest px-3 py-1 cursor-pointer transition-colors"
        >
          FERMER
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 overflow-y-auto pr-2 flex-1">
        {slides.map((s, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={s.id}
              onClick={() => {
                onSelectSlide(idx);
                onClose();
              }}
              className={`border p-3 cursor-pointer flex flex-col justify-between min-h-[90px] transition-colors ${
                isActive
                  ? "border-accent"
                  : "border-white/15 hover:border-accent/60"
              }`}
            >
              <span className="block font-mono text-[10px] font-bold text-accent mb-1">
                SLIDE {(idx + 1).toString().padStart(2, "0")}
              </span>
              <span className="text-[11px] font-semibold text-primary leading-snug line-clamp-2">
                {s.title}
              </span>
              <span className="text-[9px] font-mono text-muted tracking-wider truncate mt-1">
                {s.topic}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
