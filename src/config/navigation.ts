export type UserRole =
  | "platform_admin"
  | "owner"
  | "admin"
  | "national_coordinator"
  | "departmental_coordinator"
  | "communal_coordinator"
  | "legal_officer"
  | "observer"
  | "mandataire";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  allowedRoles: UserRole[];
  badgeKey?: string;
  badgeColor?: "red" | "amber" | "blue" | "emerald";
  isReadOnlyFor?: UserRole[];
}

export interface NavigationSection {
  sectionKey: string;
  title: string;
  items: NavigationItem[];
}

// --------------------------------------------------------------------------
// 1. ESPACE PARTI POLITIQUE (TENANT) — /app/*
// --------------------------------------------------------------------------
export const TENANT_NAVIGATION: NavigationSection[] = [
  {
    sectionKey: "pilotage",
    title: "PILOTAGE",
    items: [
      {
        id: "dashboard",
        label: "Tableau de bord",
        href: "/app/dashboard",
        iconName: "LayoutDashboard",
        allowedRoles: [
          "owner",
          "admin",
          "national_coordinator",
          "departmental_coordinator",
          "communal_coordinator",
          "legal_officer",
          "observer",
        ],
        isReadOnlyFor: ["legal_officer", "observer"],
      },
      {
        id: "map",
        label: "Carte interactive",
        href: "/app/map",
        iconName: "Map",
        allowedRoles: [
          "owner",
          "admin",
          "national_coordinator",
          "departmental_coordinator",
          "communal_coordinator",
          "observer",
        ],
        isReadOnlyFor: ["observer"],
      },
      {
        id: "analytics",
        label: "Analyses & Statistiques",
        href: "/app/analytics",
        iconName: "BarChart3",
        allowedRoles: [
          "owner",
          "admin",
          "national_coordinator",
          "departmental_coordinator",
          "communal_coordinator",
          "observer",
        ],
        isReadOnlyFor: ["observer"],
      },
      {
        id: "comparison",
        label: "Comparaison des résultats",
        href: "/app/comparison",
        iconName: "GitCompare",
        allowedRoles: [
          "owner",
          "admin",
          "national_coordinator",
          "departmental_coordinator",
          "communal_coordinator",
          "observer",
        ],
        isReadOnlyFor: ["observer"],
      },
    ],
  },
  {
    sectionKey: "terrain",
    title: "OPÉRATIONS TERRAIN",
    items: [
      {
        id: "submissions",
        label: "Collecte des résultats",
        href: "/app/submissions",
        iconName: "FileCheck2",
        allowedRoles: [
          "owner",
          "admin",
          "national_coordinator",
          "departmental_coordinator",
          "communal_coordinator",
          "legal_officer",
        ],
        badgeKey: "to_verify_count",
        badgeColor: "amber",
        isReadOnlyFor: ["legal_officer"],
      },
      {
        id: "documents",
        label: "Procès-verbaux",
        href: "/app/documents",
        iconName: "FileImage",
        allowedRoles: [
          "owner",
          "admin",
          "national_coordinator",
          "departmental_coordinator",
          "communal_coordinator",
          "legal_officer",
        ],
      },
      {
        id: "incidents",
        label: "Incidents électoraux",
        href: "/app/incidents",
        iconName: "AlertTriangle",
        allowedRoles: [
          "owner",
          "admin",
          "national_coordinator",
          "departmental_coordinator",
          "communal_coordinator",
          "legal_officer",
        ],
        badgeKey: "critical_incidents",
        badgeColor: "red",
      },
    ],
  },
  {
    sectionKey: "contentieux",
    title: "CONTENTIEUX & RAPPORTS",
    items: [
      {
        id: "legal-cases",
        label: "Dossiers juridiques",
        href: "/app/legal-cases",
        iconName: "Scale",
        allowedRoles: ["owner", "admin", "legal_officer"],
      },
      {
        id: "reports",
        label: "Rapports & Exports",
        href: "/app/reports",
        iconName: "FileSpreadsheet",
        allowedRoles: ["owner", "admin", "legal_officer"],
      },
    ],
  },
  {
    sectionKey: "organisation",
    title: "ORGANISATION",
    items: [
      {
        id: "elections",
        label: "Élections & Compétiteurs",
        href: "/app/elections",
        iconName: "Vote",
        allowedRoles: ["owner", "admin"],
      },
      {
        id: "assignments",
        label: "Affectations",
        href: "/app/assignments",
        iconName: "MapPin",
        allowedRoles: [
          "owner",
          "admin",
          "national_coordinator",
          "departmental_coordinator",
          "communal_coordinator",
        ],
      },
      {
        id: "mandataires",
        label: "Mandataires",
        href: "/app/mandataires",
        iconName: "UserCheck",
        allowedRoles: [
          "owner",
          "admin",
          "national_coordinator",
          "departmental_coordinator",
          "communal_coordinator",
        ],
      },
      {
        id: "team",
        label: "Équipes & Utilisateurs",
        href: "/app/team",
        iconName: "Users",
        allowedRoles: ["owner", "admin"],
      },
      {
        id: "settings",
        label: "Paramètres",
        href: "/app/settings",
        iconName: "Settings",
        allowedRoles: [
          "owner",
          "admin",
          "national_coordinator",
          "departmental_coordinator",
          "communal_coordinator",
        ],
        isReadOnlyFor: [
          "national_coordinator",
          "departmental_coordinator",
          "communal_coordinator",
        ],
      },
    ],
  },
];

// --------------------------------------------------------------------------
// 2. ESPACE SUPER ADMIN — /admin/*
// --------------------------------------------------------------------------
export const ADMIN_NAVIGATION: NavigationSection[] = [
  {
    sectionKey: "gestion-saas",
    title: "GESTION SAAS",
    items: [
      {
        id: "admin-dashboard",
        label: "Vue d'ensemble",
        href: "/admin/dashboard",
        iconName: "LayoutDashboard",
        allowedRoles: ["platform_admin"],
      },
      {
        id: "admin-tenants",
        label: "Organisations (Partis)",
        href: "/admin/tenants",
        iconName: "Building2",
        allowedRoles: ["platform_admin"],
      },
      {
        id: "admin-payments",
        label: "Paiements & Preuves",
        href: "/admin/payments",
        iconName: "CreditCard",
        allowedRoles: ["platform_admin"],
        badgeKey: "payments_pending",
        badgeColor: "amber",
      },
      {
        id: "admin-subscriptions",
        label: "Formules & Abonnements",
        href: "/admin/subscriptions",
        iconName: "Layers",
        allowedRoles: ["platform_admin"],
      },
    ],
  },
  {
    sectionKey: "catalogue-central",
    title: "CATALOGUE CENTRAL",
    items: [
      {
        id: "admin-elections",
        label: "Élections Officielles",
        href: "/admin/elections",
        iconName: "Vote",
        allowedRoles: ["platform_admin"],
      },
      {
        id: "admin-competitors",
        label: "Partis & Compétiteurs",
        href: "/admin/competitors",
        iconName: "Flag",
        allowedRoles: ["platform_admin"],
      },
      {
        id: "admin-geography",
        label: "Découpage géographique",
        href: "/admin/geography",
        iconName: "Globe",
        allowedRoles: ["platform_admin"],
      },
    ],
  },
  {
    sectionKey: "securite",
    title: "SÉCURITÉ",
    items: [
      {
        id: "admin-audit",
        label: "Journaux d'audit globaux",
        href: "/admin/audit",
        iconName: "ShieldAlert",
        allowedRoles: ["platform_admin"],
      },
    ],
  },
];

// --------------------------------------------------------------------------
// 3. ESPACE MANDATAIRE TERRAIN (MOBILE) — /field/*
// --------------------------------------------------------------------------
export const FIELD_NAVIGATION = [
  {
    id: "field-stations",
    label: "Mes Bureaux",
    href: "/field/stations",
    iconName: "MapPin",
  },
  {
    id: "field-entry",
    label: "Saisir PV",
    href: "/field/entry",
    iconName: "FileCheck2",
  },
  {
    id: "field-incidents",
    label: "Incidents",
    href: "/field/incidents",
    iconName: "AlertTriangle",
  },
  {
    id: "field-sync",
    label: "Synchronisation",
    href: "/field/sync",
    iconName: "RefreshCw",
  },
];

// --------------------------------------------------------------------------
// FILTRAGE SELON LE RÔLE (RBAC)
// --------------------------------------------------------------------------
export function getFilteredTenantNavigation(role: UserRole): NavigationSection[] {
  return TENANT_NAVIGATION.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.allowedRoles.includes(role)),
  })).filter((section) => section.items.length > 0);
}

export function hasPermission(item: NavigationItem, role: UserRole): boolean {
  return item.allowedRoles.includes(role);
}

export const ROLE_LABELS: Record<UserRole, string> = {
  platform_admin: "Super Admin Plateforme",
  owner: "Président / Propriétaire",
  admin: "Secrétaire Général / Admin",
  national_coordinator: "Coordonnateur National",
  departmental_coordinator: "Coordonnateur Départemental",
  communal_coordinator: "Coordonnateur Communal",
  legal_officer: "Responsable Juridique",
  observer: "Observateur Accrédité",
  mandataire: "Mandataire Terrain (350)",
};
