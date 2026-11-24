import React from "react";
import {
  LayoutDashboard,
  Map,
  BarChart3,
  GitCompare,
  FileCheck2,
  FileImage,
  AlertTriangle,
  Scale,
  FileSpreadsheet,
  Vote,
  MapPin,
  UserCheck,
  Users,
  Settings,
  Building,
  Building2,
  CreditCard,
  Layers,
  Flag,
  Globe,
  ShieldAlert,
  RefreshCw,
  Home,
  HelpCircle,
  Palette,
  FileText,
  PieChart,
  KeyRound,
  LucideProps,
} from "lucide-react";
import { CollecteIcon, BureauxIcon } from "./CustomIcons";

interface IconRendererProps extends LucideProps {
  name: string;
}

export function IconRenderer({ name, ...props }: IconRendererProps) {
  switch (name) {
    case "Dashboard":
    case "LayoutDashboard":
      return <LayoutDashboard {...props} />;
    case "Resultat":
    case "BarChart3":
    case "Collecte":
      return <CollecteIcon className={props.className} size={props.size} />;
    case "Bureaux":
    case "Building":
    case "Building2":
      return <BureauxIcon className={props.className} size={props.size} />;
    case "Membres":
    case "Users":
      return <Users {...props} />;
    case "KeyRound":
    case "Acces":
    case "GestionAcces":
    case "ShieldCheck":
      return <KeyRound {...props} />;
    case "Mandataires":
    case "UserCheck":
      return <UserCheck {...props} />;
    case "ProcesVerbaux":
    case "FileText":
    case "FileCheck2":
      return <FileText {...props} />;
    case "Charte":
    case "Palette":
      return <Palette {...props} />;
    case "Parametres":
    case "Settings":
      return <Settings {...props} />;
    case "Map":
      return <Map {...props} />;
    case "GitCompare":
      return <GitCompare {...props} />;
    case "FileImage":
      return <FileImage {...props} />;
    case "AlertTriangle":
      return <AlertTriangle {...props} />;
    case "Scale":
      return <Scale {...props} />;
    case "FileSpreadsheet":
      return <FileSpreadsheet {...props} />;
    case "Vote":
      return <Vote {...props} />;
    case "MapPin":
      return <MapPin {...props} />;
    case "CreditCard":
      return <CreditCard {...props} />;
    case "Layers":
      return <Layers {...props} />;
    case "Flag":
      return <Flag {...props} />;
    case "Globe":
      return <Globe {...props} />;
    case "ShieldAlert":
      return <ShieldAlert {...props} />;
    case "RefreshCw":
      return <RefreshCw {...props} />;
    case "Home":
      return <Home {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
}
