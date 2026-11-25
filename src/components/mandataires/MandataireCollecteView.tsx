"use client";

import React from "react";
import { CurrentUser } from "@/types/auth";
import { AutreParti } from "@/components/autres-partis/AutresPartisView";

interface MandataireCollecteViewProps {
  currentUser?: CurrentUser;
  autresPartis?: AutreParti[];
}

export default function MandataireCollecteView({
  currentUser,
  autresPartis = [],
}: MandataireCollecteViewProps) {
  return (
    <div className="w-full min-h-[400px]">
      {/* Page vierge - En attente des nouvelles idées et spécifications */}
    </div>
  );
}
