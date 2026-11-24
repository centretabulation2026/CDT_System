"use client";

import React, { useState } from "react";
import { Vote, ChevronDown, Check } from "lucide-react";

export interface Election {
  id: string;
  name: string;
  date: string;
  type: string;
  status: "active" | "closed" | "upcoming";
}

const DEMO_ELECTIONS: Election[] = [
  {
    id: "elec-2025-10",
    name: "Élection du 27 Oct. 2025",
    date: "27 Octobre 2025",
    type: "Scrutin Général (base 350)",
    status: "active",
  },
  {
    id: "elec-2025-leg",
    name: "Législatives & Sénatoriales 2025",
    date: "15 Novembre 2025",
    type: "Législatives",
    status: "upcoming",
  },
  {
    id: "elec-2024-mun",
    name: "Scrutin Municipal 2024",
    date: "12 Décembre 2024",
    type: "Municipales",
    status: "closed",
  },
];

interface ElectionSwitcherProps {
  currentElectionId?: string;
  onElectionChange?: (election: Election) => void;
  collapsed?: boolean;
}

export default function ElectionSwitcher({
  currentElectionId = "elec-2025-10",
  onElectionChange,
  collapsed = false,
}: ElectionSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(currentElectionId);

  const selectedElection =
    DEMO_ELECTIONS.find((e) => e.id === selectedId) || DEMO_ELECTIONS[0];

  const handleSelect = (election: Election) => {
    setSelectedId(election.id);
    setIsOpen(false);
    if (onElectionChange) {
      onElectionChange(election);
    }
  };

  if (collapsed) {
    return (
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={selectedElection.name}
        className="w-8 h-8 mx-auto flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
      >
        <Vote className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 px-1 text-white text-left cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2.5 truncate">
          <Vote className="w-4 h-4 text-blue-200 shrink-0" />
          <div className="truncate">
            <span className="block text-xs font-semibold leading-tight truncate text-white">
              {selectedElection.name}
            </span>
            <span className="block text-[10px] text-blue-200/70 font-mono tracking-wider">
              {selectedElection.type}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/70 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute left-0 right-0 top-full mt-1.5 z-40 border border-white/20 rounded-xl p-1.5 shadow-2xl space-y-1"
            style={{ backgroundColor: "#000B58" }}
          >
            <div className="px-2.5 py-1 text-[9px] font-mono tracking-widest text-blue-200/80 border-b border-white/10">
              ÉLECTIONS DISPONIBLES
            </div>
            {DEMO_ELECTIONS.map((elec) => {
              const isSelected = elec.id === selectedId;
              return (
                <button
                  key={elec.id}
                  onClick={() => handleSelect(elec)}
                  className={`w-full flex items-center justify-between p-2 text-left text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "text-white font-bold border-l-2 border-white pl-2"
                      : "text-white/70 hover:text-white border-l-2 border-transparent"
                  }`}
                >
                  <div className="truncate">
                    <div className="truncate font-medium">{elec.name}</div>
                    <div className="text-[9px] font-mono text-blue-200/70">
                      {elec.date} • {elec.type}
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
