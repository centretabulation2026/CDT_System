-- ========================================================
-- CDT SYSTEM - SCHÉMA DE BASE DE DONNÉES SUPABASE (PostgreSQL)
-- ========================================================

-- 1. Table des Partis Politiques (Tenants)
CREATE TABLE IF NOT EXISTS public.parties (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    sigle TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    date_adhesion TEXT NOT NULL,
    statut TEXT NOT NULL DEFAULT 'en_attente',
    email TEXT NOT NULL UNIQUE,
    password TEXT,
    dirigeant_nom TEXT NOT NULL,
    dirigeant_prenom TEXT NOT NULL,
    activation_token TEXT,
    date_activation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table des Bureaux de Vote
CREATE TABLE IF NOT EXISTS public.bureaux_vote (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    nom TEXT NOT NULL,
    departement TEXT NOT NULL,
    ville TEXT NOT NULL,
    adresse TEXT,
    electeurs_inscrits INTEGER DEFAULT 350,
    statut TEXT DEFAULT 'actif',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table des Membres du Parti
CREATE TABLE IF NOT EXISTS public.membres (
    id TEXT PRIMARY KEY,
    party_id TEXT REFERENCES public.parties(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT,
    role TEXT NOT NULL,
    adresse TEXT,
    nif_cin TEXT,
    departement TEXT NOT NULL,
    ville TEXT NOT NULL,
    date_adhesion TEXT NOT NULL,
    statut TEXT DEFAULT 'actif',
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table des Mandataires de Terrain
CREATE TABLE IF NOT EXISTS public.mandataires (
    id TEXT PRIMARY KEY,
    party_id TEXT REFERENCES public.parties(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL,
    telephone TEXT,
    photo_url TEXT,
    bureau_assigne TEXT NOT NULL,
    bureau_id TEXT REFERENCES public.bureaux_vote(id) ON DELETE SET NULL,
    adresse TEXT,
    nif_cin TEXT,
    departement TEXT NOT NULL,
    ville TEXT NOT NULL,
    date_affectation TEXT NOT NULL,
    statut TEXT DEFAULT 'en_attente',
    activation_token TEXT,
    date_activation TEXT,
    password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Table des Procès-Verbaux (PV) et Résultats
CREATE TABLE IF NOT EXISTS public.proces_verbaux (
    id TEXT PRIMARY KEY,
    bureau_id TEXT REFERENCES public.bureaux_vote(id) ON DELETE CASCADE,
    mandataire_id TEXT REFERENCES public.mandataires(id) ON DELETE SET NULL,
    party_id TEXT REFERENCES public.parties(id) ON DELETE CASCADE,
    inscrits INTEGER DEFAULT 0,
    votants INTEGER DEFAULT 0,
    bulletins_nuls INTEGER DEFAULT 0,
    suffrages_exprimes INTEGER DEFAULT 0,
    photo_pv_url TEXT,
    statut_validation TEXT DEFAULT 'soumis',
    notes TEXT,
    date_saisie TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Table des Résultats détaillés par candidat
CREATE TABLE IF NOT EXISTS public.resultats_candidats (
    id BIGSERIAL PRIMARY KEY,
    pv_id TEXT REFERENCES public.proces_verbaux(id) ON DELETE CASCADE,
    parti_nom TEXT NOT NULL,
    parti_sigle TEXT NOT NULL,
    candidat_nom TEXT NOT NULL,
    voix INTEGER DEFAULT 0,
    pourcentage NUMERIC(5,2) DEFAULT 0.00
);

-- Activer Row Level Security (RLS) sur toutes les tables
ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bureaux_vote ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mandataires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proces_verbaux ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resultats_candidats ENABLE ROW LEVEL SECURITY;

-- Politiques RLS (accès complet)
CREATE POLICY "Acces complet aux parties" ON public.parties FOR ALL USING (true);
CREATE POLICY "Acces complet aux bureaux" ON public.bureaux_vote FOR ALL USING (true);
CREATE POLICY "Acces complet aux membres" ON public.membres FOR ALL USING (true);
CREATE POLICY "Acces complet aux mandataires" ON public.mandataires FOR ALL USING (true);
CREATE POLICY "Acces complet aux proces_verbaux" ON public.proces_verbaux FOR ALL USING (true);
CREATE POLICY "Acces complet aux resultats_candidats" ON public.resultats_candidats FOR ALL USING (true);

-- Permissions de lecture/écriture pour les rôles API Supabase (anon, authenticated, service_role)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
