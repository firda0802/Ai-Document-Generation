CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'free',
    'premium'
);


--
-- Name: subscription_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.subscription_status AS ENUM (
    'active',
    'canceled',
    'past_due',
    'trialing'
);


--
-- Name: check_usage_limit(text, text, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_usage_limit(_user_id text, _limit_type text, _free_limit integer, _premium_limit integer) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  current_usage INTEGER;
  user_role app_role;
  usage_limit INTEGER;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = _user_id;
  
  IF user_role = 'premium' THEN
    usage_limit := _premium_limit;
  ELSE
    usage_limit := _free_limit;
  END IF;
  
  SELECT COALESCE(
    CASE _limit_type
      WHEN 'documents' THEN documents_generated
      WHEN 'chat' THEN chat_messages
      WHEN 'presentations' THEN presentations_generated
      WHEN 'spreadsheets' THEN spreadsheets_generated
      WHEN 'voiceovers' THEN voiceovers_generated
      WHEN 'images' THEN images_generated
    END, 0
  ) INTO current_usage
  FROM public.usage_tracking
  WHERE user_id = _user_id AND date = CURRENT_DATE;
  
  RETURN current_usage < usage_limit OR usage_limit = -1;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'free');
  RETURN NEW;
END;
$$;


--
-- Name: has_role(text, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id text, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: increment_usage(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.increment_usage(_user_id text, _usage_type text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.usage_tracking (user_id, date, documents_generated, chat_messages, presentations_generated, spreadsheets_generated, voiceovers_generated, images_generated)
  VALUES (
    _user_id,
    CURRENT_DATE,
    CASE WHEN _usage_type = 'documents' THEN 1 ELSE 0 END,
    CASE WHEN _usage_type = 'chat' THEN 1 ELSE 0 END,
    CASE WHEN _usage_type = 'presentations' THEN 1 ELSE 0 END,
    CASE WHEN _usage_type = 'spreadsheets' THEN 1 ELSE 0 END,
    CASE WHEN _usage_type = 'voiceovers' THEN 1 ELSE 0 END,
    CASE WHEN _usage_type = 'images' THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    documents_generated = CASE WHEN _usage_type = 'documents' THEN usage_tracking.documents_generated + 1 ELSE usage_tracking.documents_generated END,
    chat_messages = CASE WHEN _usage_type = 'chat' THEN usage_tracking.chat_messages + 1 ELSE usage_tracking.chat_messages END,
    presentations_generated = CASE WHEN _usage_type = 'presentations' THEN usage_tracking.presentations_generated + 1 ELSE usage_tracking.presentations_generated END,
    spreadsheets_generated = CASE WHEN _usage_type = 'spreadsheets' THEN usage_tracking.spreadsheets_generated + 1 ELSE usage_tracking.spreadsheets_generated END,
    voiceovers_generated = CASE WHEN _usage_type = 'voiceovers' THEN usage_tracking.voiceovers_generated + 1 ELSE usage_tracking.voiceovers_generated END,
    images_generated = CASE WHEN _usage_type = 'images' THEN usage_tracking.images_generated + 1 ELSE usage_tracking.images_generated END,
    updated_at = now();
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: file_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.file_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    file_type text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    thumbnail_url text,
    file_size integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT file_history_file_type_check CHECK ((file_type = ANY (ARRAY['document'::text, 'presentation'::text, 'spreadsheet'::text])))
);


--
-- Name: generated_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.generated_files (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    file_type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    full_name text,
    avatar_url text,
    email text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    stripe_customer_id text NOT NULL,
    stripe_subscription_id text,
    status public.subscription_status DEFAULT 'trialing'::public.subscription_status NOT NULL,
    plan_type text NOT NULL,
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    trial_end timestamp with time zone,
    canceled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT subscriptions_plan_type_check CHECK ((plan_type = ANY (ARRAY['monthly'::text, 'yearly'::text])))
);


--
-- Name: usage_tracking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usage_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    documents_generated integer DEFAULT 0 NOT NULL,
    chat_messages integer DEFAULT 0 NOT NULL,
    presentations_generated integer DEFAULT 0 NOT NULL,
    spreadsheets_generated integer DEFAULT 0 NOT NULL,
    voiceovers_generated integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    images_generated integer DEFAULT 0 NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id text NOT NULL,
    role public.app_role DEFAULT 'free'::public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: file_history file_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.file_history
    ADD CONSTRAINT file_history_pkey PRIMARY KEY (id);


--
-- Name: generated_files generated_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generated_files
    ADD CONSTRAINT generated_files_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);


--
-- Name: usage_tracking usage_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage_tracking
    ADD CONSTRAINT usage_tracking_pkey PRIMARY KEY (id);


--
-- Name: usage_tracking usage_tracking_user_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usage_tracking
    ADD CONSTRAINT usage_tracking_user_id_date_key UNIQUE (user_id, date);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_key UNIQUE (user_id);


--
-- Name: idx_file_history_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_file_history_created_at ON public.file_history USING btree (created_at DESC);


--
-- Name: idx_file_history_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_file_history_user_id ON public.file_history USING btree (user_id);


--
-- Name: file_history update_file_history_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_file_history_updated_at BEFORE UPDATE ON public.file_history FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: generated_files update_generated_files_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_generated_files_updated_at BEFORE UPDATE ON public.generated_files FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: file_history Users can create their own files; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own files" ON public.file_history FOR INSERT WITH CHECK (((auth.uid())::text = user_id));


--
-- Name: generated_files Users can create their own files; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own files" ON public.generated_files FOR INSERT WITH CHECK (((auth.uid())::text = user_id));


--
-- Name: file_history Users can delete their own files; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own files" ON public.file_history FOR DELETE USING (((auth.uid())::text = user_id));


--
-- Name: generated_files Users can delete their own files; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own files" ON public.generated_files FOR DELETE USING (((auth.uid())::text = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (((auth.uid())::text = user_id));


--
-- Name: usage_tracking Users can insert their own usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own usage" ON public.usage_tracking FOR INSERT WITH CHECK (((auth.uid())::text = user_id));


--
-- Name: file_history Users can update their own files; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own files" ON public.file_history FOR UPDATE USING (((auth.uid())::text = user_id));


--
-- Name: generated_files Users can update their own files; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own files" ON public.generated_files FOR UPDATE USING (((auth.uid())::text = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (((auth.uid())::text = user_id));


--
-- Name: usage_tracking Users can update their own usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own usage" ON public.usage_tracking FOR UPDATE USING (((auth.uid())::text = user_id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (((auth.uid())::text = user_id));


--
-- Name: file_history Users can view their own files; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own files" ON public.file_history FOR SELECT USING (((auth.uid())::text = user_id));


--
-- Name: generated_files Users can view their own files; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own files" ON public.generated_files FOR SELECT USING (((auth.uid())::text = user_id));


--
-- Name: user_roles Users can view their own role; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own role" ON public.user_roles FOR SELECT USING (((auth.uid())::text = user_id));


--
-- Name: subscriptions Users can view their own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own subscription" ON public.subscriptions FOR SELECT USING (((auth.uid())::text = user_id));


--
-- Name: usage_tracking Users can view their own usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own usage" ON public.usage_tracking FOR SELECT USING (((auth.uid())::text = user_id));


--
-- Name: file_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.file_history ENABLE ROW LEVEL SECURITY;

--
-- Name: generated_files; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.generated_files ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: usage_tracking; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


