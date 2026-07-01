--
-- PostgreSQL database dump
--

\restrict lvbVoyHS9Xn0adZgLcYMoGI6JP0FBNhoqy3U3dSNLtRuJmh7QE5IcNgwLxe8Vly

-- Dumped from database version 17.10 (9f6157c)
-- Dumped by pg_dump version 17.9 (Homebrew)

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
-- Name: EstadoAsistencia; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EstadoAsistencia" AS ENUM (
    'PRESENTE',
    'AUSENTE',
    'TARDE',
    'CITA',
    'HOSPITALIZADO',
    'EN_CUARTO'
);


--
-- Name: RolUsuario; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RolUsuario" AS ENUM (
    'ADMINISTRATIVO',
    'DOCENTE',
    'ESTUDIANTE',
    'ACUDIENTE',
    'DIRECTIVO',
    'PSICORIENTADOR'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Acudiente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Acudiente" (
    id integer NOT NULL,
    "usuarioId" integer,
    nombre text NOT NULL,
    telefono text,
    correo text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    documento text
);


--
-- Name: Acudiente_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Acudiente_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Acudiente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Acudiente_id_seq" OWNED BY public."Acudiente".id;


--
-- Name: Administrativo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Administrativo" (
    id integer NOT NULL,
    "usuarioId" integer NOT NULL,
    cargo text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Administrativo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Administrativo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Administrativo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Administrativo_id_seq" OWNED BY public."Administrativo".id;


--
-- Name: Area; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Area" (
    id integer NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    activo boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: Area_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Area_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Area_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Area_id_seq" OWNED BY public."Area".id;


--
-- Name: AsignacionAcademica; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AsignacionAcademica" (
    id integer NOT NULL,
    "docenteId" integer NOT NULL,
    "grupoId" integer NOT NULL,
    "areaId" integer NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: AsignacionAcademica_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."AsignacionAcademica_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: AsignacionAcademica_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."AsignacionAcademica_id_seq" OWNED BY public."AsignacionAcademica".id;


--
-- Name: Asistencia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Asistencia" (
    id integer NOT NULL,
    "estudianteId" integer NOT NULL,
    "docenteId" integer NOT NULL,
    "grupoId" integer NOT NULL,
    fecha timestamp(3) without time zone NOT NULL,
    estado public."EstadoAsistencia" NOT NULL,
    emocion text,
    observacion text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "asignacionAcademicaId" integer
);


--
-- Name: Asistencia_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Asistencia_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Asistencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Asistencia_id_seq" OWNED BY public."Asistencia".id;


--
-- Name: DashboardEvento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DashboardEvento" (
    id integer NOT NULL,
    titulo text NOT NULL,
    fecha timestamp(3) without time zone NOT NULL,
    color text DEFAULT 'azul'::text,
    orden integer DEFAULT 0 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "creadoPorUsuarioId" integer,
    "actualizadoPorUsuarioId" integer,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: DashboardEvento_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."DashboardEvento_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: DashboardEvento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."DashboardEvento_id_seq" OWNED BY public."DashboardEvento".id;


--
-- Name: DashboardGaleria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DashboardGaleria" (
    id integer NOT NULL,
    titulo text NOT NULL,
    descripcion text,
    "imagenUrl" text,
    orden integer DEFAULT 0 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "creadoPorUsuarioId" integer,
    "actualizadoPorUsuarioId" integer,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: DashboardGaleria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."DashboardGaleria_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: DashboardGaleria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."DashboardGaleria_id_seq" OWNED BY public."DashboardGaleria".id;


--
-- Name: DashboardNoticia; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DashboardNoticia" (
    id integer NOT NULL,
    titulo text NOT NULL,
    descripcion text NOT NULL,
    color text DEFAULT 'azul'::text,
    orden integer DEFAULT 0 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "creadoPorUsuarioId" integer,
    "actualizadoPorUsuarioId" integer,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: DashboardNoticia_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."DashboardNoticia_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: DashboardNoticia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."DashboardNoticia_id_seq" OWNED BY public."DashboardNoticia".id;


--
-- Name: Docente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Docente" (
    id integer NOT NULL,
    "usuarioId" integer NOT NULL,
    documento text,
    telefono text,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Docente_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Docente_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Docente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Docente_id_seq" OWNED BY public."Docente".id;


--
-- Name: Estudiante; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Estudiante" (
    id integer NOT NULL,
    "usuarioId" integer,
    nombre text NOT NULL,
    documento text,
    "grupoId" integer,
    activo boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: EstudianteAcudiente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EstudianteAcudiente" (
    id integer NOT NULL,
    "estudianteId" integer NOT NULL,
    "acudienteId" integer NOT NULL,
    parentesco text
);


--
-- Name: EstudianteAcudiente_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."EstudianteAcudiente_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: EstudianteAcudiente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."EstudianteAcudiente_id_seq" OWNED BY public."EstudianteAcudiente".id;


--
-- Name: Estudiante_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Estudiante_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Estudiante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Estudiante_id_seq" OWNED BY public."Estudiante".id;


--
-- Name: Grupo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Grupo" (
    id integer NOT NULL,
    nombre text NOT NULL,
    grado text,
    "directorDocenteId" integer,
    activo boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Grupo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Grupo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Grupo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Grupo_id_seq" OWNED BY public."Grupo".id;


--
-- Name: Observacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Observacion" (
    id integer NOT NULL,
    "estudianteId" integer,
    "docenteId" integer NOT NULL,
    "grupoId" integer NOT NULL,
    fecha timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tipo text NOT NULL,
    descripcion text NOT NULL,
    "enviarAcudiente" boolean DEFAULT false NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Observacion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Observacion_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Observacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Observacion_id_seq" OWNED BY public."Observacion".id;


--
-- Name: Usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Usuario" (
    id integer NOT NULL,
    nombre text NOT NULL,
    correo text NOT NULL,
    password text NOT NULL,
    rol public."RolUsuario" NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    "creadoEn" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizadoEn" timestamp(3) without time zone NOT NULL
);


--
-- Name: Usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Usuario_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Usuario_id_seq" OWNED BY public."Usuario".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: Acudiente id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Acudiente" ALTER COLUMN id SET DEFAULT nextval('public."Acudiente_id_seq"'::regclass);


--
-- Name: Administrativo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Administrativo" ALTER COLUMN id SET DEFAULT nextval('public."Administrativo_id_seq"'::regclass);


--
-- Name: Area id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Area" ALTER COLUMN id SET DEFAULT nextval('public."Area_id_seq"'::regclass);


--
-- Name: AsignacionAcademica id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AsignacionAcademica" ALTER COLUMN id SET DEFAULT nextval('public."AsignacionAcademica_id_seq"'::regclass);


--
-- Name: Asistencia id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Asistencia" ALTER COLUMN id SET DEFAULT nextval('public."Asistencia_id_seq"'::regclass);


--
-- Name: DashboardEvento id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DashboardEvento" ALTER COLUMN id SET DEFAULT nextval('public."DashboardEvento_id_seq"'::regclass);


--
-- Name: DashboardGaleria id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DashboardGaleria" ALTER COLUMN id SET DEFAULT nextval('public."DashboardGaleria_id_seq"'::regclass);


--
-- Name: DashboardNoticia id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DashboardNoticia" ALTER COLUMN id SET DEFAULT nextval('public."DashboardNoticia_id_seq"'::regclass);


--
-- Name: Docente id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Docente" ALTER COLUMN id SET DEFAULT nextval('public."Docente_id_seq"'::regclass);


--
-- Name: Estudiante id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Estudiante" ALTER COLUMN id SET DEFAULT nextval('public."Estudiante_id_seq"'::regclass);


--
-- Name: EstudianteAcudiente id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EstudianteAcudiente" ALTER COLUMN id SET DEFAULT nextval('public."EstudianteAcudiente_id_seq"'::regclass);


--
-- Name: Grupo id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Grupo" ALTER COLUMN id SET DEFAULT nextval('public."Grupo_id_seq"'::regclass);


--
-- Name: Observacion id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Observacion" ALTER COLUMN id SET DEFAULT nextval('public."Observacion_id_seq"'::regclass);


--
-- Name: Usuario id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Usuario" ALTER COLUMN id SET DEFAULT nextval('public."Usuario_id_seq"'::regclass);


--
-- Data for Name: Acudiente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Acudiente" (id, "usuarioId", nombre, telefono, correo, "creadoEn", documento) FROM stdin;
3	14	PreubaAcudiente	rgerger	regrger	2026-05-25 04:59:08.733	\N
4	15	Show de Medio tiempo	300000000	show@test.com	2026-05-25 10:33:54.374	\N
6	34	Pachonorrea norrea	3005551234	pachonorrea@test.com	2026-06-11 17:21:10.837	\N
7	35	Pachonorrea	342343	pachon@test.com	2026-06-14 01:22:00.187	\N
2	13	El ciclista feliz	455443534	ciclista@test.com	2026-05-25 04:04:17.44	\N
1	12	Kaiser	5555555	kaiser@test.com	2026-05-25 03:59:11.059	\N
5	20	Acudiente Prueba	3009998888	acudiente@test.com	2026-05-28 17:11:54.976	\N
8	41	Adam Levine	3104330903	adam@test.com	2026-06-18 17:03:04.34	\N
9	40	Anne Hathaway	3114034818	anne@test.com	2026-06-18 17:03:55.419	\N
10	47	Simp Acudiente	31223	simpacu@test.com	2026-06-19 00:58:25.028	\N
11	50	Ana Gómez	3001234567	ana@test.com	2026-06-19 13:46:01.855	9001
\.


--
-- Data for Name: Administrativo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Administrativo" (id, "usuarioId", cargo, "creadoEn") FROM stdin;
\.


--
-- Data for Name: Area; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Area" (id, nombre, descripcion, activo, "creadoEn", "actualizadoEn") FROM stdin;
1	Matemáticas	Área de matemáticas	t	2026-06-06 19:55:22.084	2026-06-06 19:55:22.084
3	Historia	Hitler	t	2026-06-18 02:02:22.106	2026-06-18 02:02:39.788
2	Geografia	Capitales del mundo, paises del mundo	t	2026-06-18 01:47:14.028	2026-06-18 02:21:03.423
4	Lenguaje	lalalalala	t	2026-06-18 21:22:24.478	2026-06-18 21:22:24.478
5	Sociales	comunismo capitalismo	t	2026-06-18 21:47:22.194	2026-06-18 21:47:22.194
6	Astrología	La astrología como visión del mundo Pos Abelardo	t	2026-06-19 00:52:25.172	2026-06-19 00:52:25.172
7	Reumatismo	La gota como futuro de la medicina	t	2026-06-19 00:52:47.613	2026-06-19 00:52:47.613
\.


--
-- Data for Name: AsignacionAcademica; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AsignacionAcademica" (id, "docenteId", "grupoId", "areaId", activo, "creadoEn", "actualizadoEn") FROM stdin;
1	20	1	1	t	2026-06-06 20:28:38.071	2026-06-06 20:28:38.071
2	46	2	2	t	2026-06-18 03:19:46.135	2026-06-18 03:19:46.135
3	17	4	3	t	2026-06-18 16:56:31.14	2026-06-18 16:56:31.14
4	17	3	2	t	2026-06-18 16:56:53.738	2026-06-18 16:57:47.793
5	20	21	1	t	2026-06-18 20:16:18.9	2026-06-18 20:16:18.9
6	20	21	4	t	2026-06-18 21:22:40.067	2026-06-18 21:22:40.067
7	20	21	3	t	2026-06-18 21:46:11.849	2026-06-18 21:46:11.849
8	20	21	5	t	2026-06-18 21:47:36.257	2026-06-18 21:47:36.257
9	50	23	6	t	2026-06-19 01:01:18.448	2026-06-19 01:01:18.448
10	2	23	7	t	2026-06-19 01:01:55.981	2026-06-19 01:01:55.981
\.


--
-- Data for Name: Asistencia; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Asistencia" (id, "estudianteId", "docenteId", "grupoId", fecha, estado, emocion, observacion, "creadoEn", "asignacionAcademicaId") FROM stdin;
1	1	18	2	2026-05-24 20:48:20.741	PRESENTE	😊	Es el mejor estudiante del mundo entero mundial, porque se graduó de UniAndes	2026-05-24 20:48:20.751	\N
2	3	18	2	2026-05-24 20:50:46.973	TARDE	\N	El estudiante dice que estaba en una asamblea del edificio. 	2026-05-24 20:50:46.978	\N
3	8	1	1	2026-05-28 00:00:00	PRESENTE	😊	Asistencia de prueba para validar acceso del acudiente.	2026-06-01 16:18:09.919	\N
4	8	20	1	2026-06-05 00:00:00	PRESENTE	😊	Actualización de prueba para cierre de ticket.	2026-06-05 15:14:18.919	\N
5	8	1	1	2026-06-06 18:30:19.549	PRESENTE	😔		2026-06-06 18:30:19.632	\N
8	1	20	1	2026-06-07 00:00:00	PRESENTE	😊	Participó correctamente.	2026-06-07 18:51:58.032	1
9	2	20	1	2026-06-07 00:00:00	TARDE	\N	No asistió.	2026-06-07 18:51:58.214	1
10	3	20	1	2026-06-07 00:00:00	TARDE	\N	Llegó tarde.	2026-06-07 18:51:58.302	1
17	8	20	1	2026-06-07 00:00:00	PRESENTE	😊	Participó correctamente.	2026-06-07 19:38:52.802	1
18	10	20	1	2026-06-07 00:00:00	AUSENTE	\N	No asistió.	2026-06-07 19:38:52.939	1
19	16	20	21	2026-06-13 23:51:30.24	HOSPITALIZADO	\N	por depresion	2026-06-13 23:51:30.244	\N
20	13	20	21	2026-06-14 21:06:00.307	PRESENTE	😊		2026-06-14 21:06:00.314	\N
21	1	20	21	2026-06-16 00:47:28.354	PRESENTE	😔	Está triste por la separación de sus papás	2026-06-16 00:47:28.39	\N
22	1	20	21	2026-06-18 00:00:00	AUSENTE	\N	\N	2026-06-18 20:17:32.709	5
23	16	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 20:17:32.719	5
24	13	20	21	2026-06-18 00:00:00	AUSENTE	\N	\N	2026-06-18 20:17:32.722	5
25	17	20	21	2026-06-18 00:00:00	AUSENTE	\N	\N	2026-06-18 20:17:32.725	5
26	12	20	21	2026-06-18 00:00:00	AUSENTE	\N	\N	2026-06-18 20:17:32.728	5
27	11	20	21	2026-06-18 00:00:00	AUSENTE	\N	\N	2026-06-18 20:17:32.731	5
40	1	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:27:06.067	6
41	16	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:27:06.095	6
42	13	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:27:06.162	6
43	17	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:27:06.166	6
44	12	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:27:06.169	6
45	11	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:27:06.172	6
52	1	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:46:34.769	7
53	16	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:46:34.862	7
54	13	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:46:34.866	7
55	17	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:46:34.868	7
56	12	20	21	2026-06-18 00:00:00	CITA	\N	\N	2026-06-18 21:46:34.871	7
57	11	20	21	2026-06-18 00:00:00	AUSENTE	\N	\N	2026-06-18 21:46:34.875	7
58	1	20	21	2026-06-18 00:00:00	TARDE	\N	\N	2026-06-18 21:47:53.362	8
59	16	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:47:53.365	8
60	13	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:47:53.367	8
61	17	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:47:53.369	8
62	12	20	21	2026-06-18 00:00:00	PRESENTE	😊	\N	2026-06-18 21:47:53.371	8
63	11	20	21	2026-06-18 00:00:00	EN_CUARTO	\N	\N	2026-06-18 21:47:53.373	8
64	20	50	23	2026-06-19 00:00:00	PRESENTE	😊	\N	2026-06-19 01:02:28.46	9
65	19	50	23	2026-06-19 00:00:00	PRESENTE	😊	\N	2026-06-19 01:02:28.472	9
66	18	50	23	2026-06-19 00:00:00	PRESENTE	😊	\N	2026-06-19 01:02:28.549	9
67	20	2	23	2026-06-19 00:00:00	PRESENTE	😊	\N	2026-06-19 01:39:14.627	10
68	19	2	23	2026-06-19 00:00:00	PRESENTE	😊	\N	2026-06-19 01:39:14.719	10
69	18	2	23	2026-06-19 00:00:00	PRESENTE	😊	\N	2026-06-19 01:39:14.722	10
\.


--
-- Data for Name: DashboardEvento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."DashboardEvento" (id, titulo, fecha, color, orden, activo, "creadoPorUsuarioId", "actualizadoPorUsuarioId", "creadoEn", "actualizadoEn") FROM stdin;
4	Dia de las madres concierto para maricas	2026-06-24 00:00:00	verde	4	t	37	\N	2026-06-17 20:31:49.309	2026-06-17 20:31:49.309
3	Reunión comités de área 12 pm, líder de área la perra mayor	2026-06-17 00:00:00	morado	4	t	37	37	2026-06-17 20:26:53.368	2026-06-17 20:32:51.788
2	Reunión de acudientes	2026-05-31 00:00:00	verde	2	t	37	37	2026-06-17 17:24:52.957	2026-06-17 20:32:55.593
1	Izada de bandera	2026-05-27 00:00:00	azul	1	t	37	37	2026-06-17 13:28:54.831	2026-06-17 20:32:58.714
5	Dia de venezuela	2026-06-25 00:00:00	morado	3	t	37	\N	2026-06-17 21:17:54.112	2026-06-17 21:17:54.112
\.


--
-- Data for Name: DashboardGaleria; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."DashboardGaleria" (id, titulo, descripcion, "imagenUrl", orden, activo, "creadoPorUsuarioId", "actualizadoPorUsuarioId", "creadoEn", "actualizadoEn") FROM stdin;
4	Dias de la tierra	La importancia de Jesus en nuestros corazones y como violó de manera intempestiva a toda su estirpe	https://es.vecteezy.com/foto/11215319-planeta-tierra-con-salida-del-sol-en-el-espacio	5	f	37	37	2026-06-17 20:34:57.38	2026-06-17 21:21:43.423
3	ARDILLA	uNA ARDILLA VOLADORA	https://es.pinterest.com/pin/423690277448100528/	0	f	1	37	2026-06-17 18:20:17.437	2026-06-17 21:21:48.754
2	Jornada cultural	Registro de jornada cultural.	\N	2	f	37	37	2026-06-17 17:24:53.198	2026-06-17 21:21:53.477
5	DIa del programador	\N	data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAEsKADAAQAAAABAAADGwAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgDGwSwAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAgICAgICAwICAwQDAwMEBQQEBAQFBgUFBQUFBggGBgYGBgYICAgICAgICAkJCQkJCQsLCwsLDAwMDAwMDAwMDP/bAEMBAgICAwMDBQMDBQwIBwgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/dAAQAS//aAAwDAQACEQMRAD8A/IOiitmy0uKW2+36jciztSxRG2mSWVhjcI4wRnaCMlmVe2c8UAY1FdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8AwWxf/JdAHK0V1X2HwZ/0GNQ/8FsX/wAl0fYfBn/QY1D/AMFsX/yXQBytFdV9h8Gf9BjUP/BbF/8AJdH2HwZ/0GNQ/wDBbF/8l0AcrRXVfYfBn/QY1D/wWxf/ACXR9h8Gf9BjUP8A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d1RGYBmSJUUkdMcU+1+Ket2umxQLY6c+p21r9ht9aeFjqMNts8oRrJv8vKx/u0doy6rwGGBjzOiu7+1MXzc/tHfb/huzvrda31vc5/qdG3Ly/wBf102PQ9A+I+o6FplvpkumaZqg0+R5dOm1CBpZbF5G3sYSroGXf8+yUOgbkLyc04viH4pggt1huil1b6vLra33zG5N5Mqq7M5JVgduSCvJJySDiuIoqP7RxPKoqo7LRfh+VlbtayH9VpXb5Vqd5d/EPWZgRp9vaaVjV11uP7Cjp5N2sYQGIO7hUyN23GA3TC4UO13x/PrVn9kt9F0fS2kmS5uZ7G1Ky3EqZKsxleQIuSSUiVFJPIIwBwNFEsxxDUoue/8AWnb5dNNgWFpJpqOx6Jr/AMR9Q13TLrTIdL0vShqMkcuoy6fA8Ml68bb180M7Iqh/n2RKi7uccDHndFFY4jE1a8uerK7/AK/XX11NKVGFNcsFY//V/IOiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/1vyDrp45F0HT7a5ijRr+9UyrJIocQwhiq7VYEb2IJ3HoMY5JrmK6a6ik1fSbW7tAZJNPh+z3Ea8sqKzMkgHUqQ2CexHPWgCCLxLq4Yi7na9hb78Nz+9QjuAG+79VwR2qtrNpb21xHJZk/ZrqJZ4gTkqrEgoT32sGXPfFU7Wyu76dba0iaWVjgKoz+foB3J4FaOuPbrNb2Ns4lSxgWAyLyrPuaSQqe43uwB7gUAd34B+Dviv4iaHq3ifSbjS9P0fQrqztNRv9Wv4bC3tnvkneAs8xG4N9ndQE3MWKgKc1tr+z18RR8QdQ+HNw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cO+aGmiVum1vLX9PmVUxicKnvat3SV7J3v10tbrv02L/AIx8Zf8ACWR6dH9jFp/Z4uxkSeZv+1Xkt3/dXG3zdnfOM8ZwOIoorshBQXLE86rVlUlzTd3/AEgoooqjMKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKlH+of/AH1/k1RVKP8AUP8A76/yagCKtDTv9dL/ANe8/wD6Kas+tDTv9dL/ANe8/wD6KagCK16T/wDXJv5iqlW7XpP/ANcm/mKqUAf/0/yDooooA0NR/wBdF/17wf8Aopaz60NR/wBdF/17wf8Aopaz6ACiiigArXu/D+vWFhDqt9pt5bWVzjybmWCRIZMjI2SMoVuPQ1kru3DbnOeMdc17lYam+r+EPFbwX9/f63PYRzavHqeFgSGK6i3PblWcvKrbAN4TClsAnAoA8MooooAK7Wz8FeMPEGgXPiqzhW+stOiJnIu7d7mKC3CqW+ymX7R5UalRuEexV7gDjiq9++D1npzeD/iHqF/fjRMaZaWH9rNE90sMV7cgS2xtocyf6SIwnngFYwCjcyqQAeA0VNcJFFcSRQyCaNHZUkAKh1BwGAbBGRzg81DQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABUo/1D/76/wAmqKpR/qH/AN9f5NQBFWhp3+ul/wCvef8A9FNWfWhp3+ul/wCvef8A9FNQBFa9J/8Ark38xVSrdr0n/wCuTfzFVKAP/9T8g6KKKANDUf8AXRf9e8H/AKKWs+tDUf8AXRf9e8H/AKKWs+gAooooAcjvG6yRsVZSGVlOCCOQQR0IrstX+IPi3XdPfTNSvVeGUqZ2jgghluSnKm5miRZJsHn94zZb5jzzXF0UAFFFFABXqXhLxx4a8KeFtdsI9Fu7rXdc0+40t7yS+jFglrcPG+TZfZi7So0YZG+0ABwrbflwfLaKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACpR/qH/AN9f5NUVSj/UP/vr/JqAIq0NO/10v/XvP/6Kas+tDTv9dL/17z/+imoAitek/wD1yb+YqpVu16T/APXJv5iqlAH/1fyDooooA0NR/wBdF/17wf8Aopaz60NR/wBdF/17wf8Aopaz6ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqUf6h/8AfX+TVFUo/wBQ/wDvr/JqAIq0NO/10v8A17z/APopqz60NO/10v8A17z/APopqAIrXpP/ANcm/mKqVbtek/8A1yb+YqpQB//W/IOiiigDQ1H/AF0X/XvB/wCilrPrQ1H/AF0X/XvB/wCilrPoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACpR/qH/wB9f5NUVSj/AFD/AO+v8moAirQ07/XS/wDXvP8A+imrPrQ07/XS/wDXvP8A+imoAitek/8A1yb+YqpVu16T/wDXJv5iqlAH/9f8g6KKKANDUf8AXRf9e8H/AKKWs+tDUf8AXRf9e8H/AKKWs+gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKlH+of/AH1/k1RVKP8AUP8A76/yagCKtDTv9dL/ANe8/wD6Kas+tDTv9dL/ANe8/wD6KagCK16T/wDXJv5iqlW7XpP/ANcm/mKqUAf/0PyDooooA0NR/wBdF/17wf8Aopaz60NR/wBdF/17wf8Aopaz6ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqUf6h/8AfX+TVFUo/wBQ/wDvr/JqAIq0NO/10v8A17z/APopqz60NO/10v8A17z/APopqAIrXpP/ANcm/mKqVbtek/8A1yb+YqpQB//R/IOiiigDQ1H/AF0X/XvB/wCilrPrQ1H/AF0X/XvB/wCilrPoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACpR/qH/wB9f5NUVSj/AFD/AO+v8moAirQ07/XS/wDXvP8A+imrPrQ07/XS/wDXvP8A+imoAitek/8A1yb+YqpVu16T/wDXJv5iqlAH/9L8g6KKKANDUf8AXRf9e8H/AKKWs+tDUf8AXRf9e8H/AKKWs+gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKlH+of/AH1/k1RVKP8AUP8A76/yagCKtDTv9dL/ANe8/wD6Kas+tDTv9dL/ANe8/wD6KagCK16T/wDXJv5iqlW7XpP/ANcm/mKqUAf/0/yDooooA0NR/wBdF/17wf8Aopaz60NR/wBdF/17wf8Aopaz6ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqUf6h/8AfX+TVFUo/wBQ/wDvr/JqAIq0NO/10v8A17z/APopqz60NO/10v8A17z/APopqAIrXpP/ANcm/mKqVbtek/8A1yb+YqpQB//U/IOiiigDQ1H/AF0X/XvB/wCilrPrQ1H/AF0X/XvB/wCilrPoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACpR/qH/wB9f5NUVSj/AFD/AO+v8moAirQ07/XS/wDXvP8A+imrPrQ07/XS/wDXvP8A+imoAitek/8A1yb+YqpVu16T/wDXJv5iqlAH/9X8g6KKKANDUf8AXRf9e8H/AKKWs+tDUf8AXRf9e8H/AKKWs+gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKlH+of/AH1/k1RVKP8AUP8A76/yagCKtDTv9dL/ANe8/wD6Kas+tDTv9dL/ANe8/wD6KagCK16T/wDXJv5iqlW7XpP/ANcm/mKqUAf/1vyDooooA0NR/wBdF/17wf8Aopaz60NR/wBdF/17wf8Aopaz6ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqUf6h/8AfX+TVFUo/wBQ/wDvr/JqAIq0NO/10v8A17z/APopqz60NO/10v8A17z/APopqAIrXpP/ANcm/mKqVbtek/8A1yb+YqpQB//X/IOiiigDQ1H/AF0X/XvB/wCilrPrQ1H/AF0X/XvB/wCilrPoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACpR/qH/wB9f5NUVSj/AFD/AO+v8moAirQ07/XS/wDXvP8A+imrPrQ07/XS/wDXvP8A+imoAitek/8A1yb+YqpVu16T/wDXJv5iqlAH/9D8g6KKKANDUf8AXRf9e8H/AKKWs+tDUf8AXRf9e8H/AKKWs+gAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKlH+of/AH1/k1RVKP8AUP8A76/yagCKtDTv9dL/ANe8/wD6Kas+tDTv9dL/ANe8/wD6KagCK16T/wDXJv5iqlW7XpP/ANcm/mKqUAf/0fyDooooA0NR/wBdF/17wf8Aopaz60NR/wBdF/17wf8Aopaz6ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqUf6h/8AfX+TVFUo/wBQ/wDvr/JqAIq0NO/10v8A17z/APopqz60NO/10v8A17z/APopqAIrXpP/ANcm/mKqVbtek/8A1yb+YqpQB//S/IOiiigDQ1H/AF0X/XvB/wCilrPqe4mM7KxGNsaJ/wB8KF/pUFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVKP9Q/++v8AJqiqUf6h/wDfX+TUARVoad/rpf8Ar3n/APRTVn1PbzGBmYDO6N0/77Ur/WgCS16T/wDXJv5iqlW7XpP/ANcm/mKqUAf/0/yO8m2/5+B/3w1Hk23/AD8D/vhqqVo29kskYkkJGegFAESxwowZLnaw6EKwNWftEv8A0EJPzkqT+zofV/zH+FH9nQ+r/mP8KAI/tEv/AEEJPzko+0S/9BCT85Kk/s6H1f8AMf4Uf2dD6v8AmP8ACgCP7RL/ANBCT85KPtEv/QQk/OSpP7Oh9X/Mf4VTurQQAOhJUnHPWgCx9ol/6CEn5yUfaJf+ghJ+clZVFAGr9ol/6CEn5yUfaJf+ghJ+clZVFAGr9ol/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W3YI8y8d+DrrwN4ik0WadL22eKK6sb6IEQ3tncKHguIs5+V1PIydrBlySKAONor1v/hW2hW9lozat4ts9MvtbsYr+CG5tbnyUSZ3jQS3ESuF5Q5JXAHJIFcbdeCvFNt4nufByabcXWr2sjxta2sbTu2wbtyCMEshX5gw4KkHpQBy1FdvoHgPWdcuNdsGjktL3QbCS9ltJoXE7tHNFB5AjwGEhaUcEdsYrFu/C3ibT9VTQr/Sb631KQBks5beVLhgQSCsTKGIIB6DtQBhUVZWzu2tHv1hkNtHIkLzBT5aySKzIhfGAzBGIGckKSOhravfB/izTbUXuo6LqFrbtALkSzWs0cZgLKgl3MoGzc6LuzjLKM8igDnKKtxWF9PZz6hDbyyWtq0azzqjGOJpciMO4GFL7TtyRnBx0q4fD+ui5jsjp12Lia3+1xxeRJ5j2+wy+cq4yY9gL7wMbRnOKAMiivT9J+FPiXxM92vhS3utRFho9tqtzmzniYG4VWEEShXMjNuPlMMCVVZl4FU2+GfiibQNJ1zSbK61M6ml7I9vaW0sslstlN5LmXYDgE85wMdKAPPKKOnBr0XVfhvq2k/D/TPH9xcQmDUphH9kXPnwxSGVbeaQdAszW8wT/cz34APOqK6jXPDE+h6PoOsSzpKmvWkt3GiggxLFcyW5ViepJjJ47GsGH/j2uPon/oVAFWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK3NI0SXUwZWby4VON2MknuAP61h16b4dAGjwY778/wDfZoAo/wDCJ2H/AD1m/Nf/AIml/wCETsP+es35r/8AE173per/AATh062i1vwp4pu79IlFzPa+J7C2gklA+ZooJNCnaNSeQrSuQOCx61f/ALb/AGf/APoTPGP/AIV2m/8AzO0AfMWo+GDbwtPZyGQIMlGA3YHUgjr9MVyVe56g1hLe3D6ZDLb2TyubeG4lWeWOIk7EklSOJZGC4DMI0DHkKvQeGHrQAUVcnt0jtbadSd0wcsD0G1sDFU6ACiun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ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAD1+6/0/qKZT1+6/0/qKZQAUUUUAf//U/IOiiigAooooAKuaebBb63OqLK9mJF89YCqymPPzbCwKhsdMjGap0UAekXmu+HNP8I3/AIY0m6vtU+33VvcRm8t0t47MQB8tGqzTZlkDBGI2gKOrZGPN6KKACiiigD6R8Ear4m8C/B7xDrWj6qvhm/u7iyuNP1DT9Qgi1K/hMjW1zpzxwy/aREARcgFVUGI7g25CvzdRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAPX7r/T+oplPX7r/T+oplABRRRQB//9X8g6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAHr91/p/UUynr91/p/UUygAooooA//W/IOiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigB6/df6f1FMp6/df6f1FMoAKKKKAP/1/yDooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAev3X+n9RTKev3X+n9RTKACiiigD/9D8g6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAHr91/p/UUynr91/p/UUygAooooA//R/IOiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigB6/df6f1FMp6/df6f1FMoAKKKKAP/0vyDooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAev3X+n9RTKev3X+n9RTKACiiigD/9P8g6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAHr91/p/UUynr91/p/UUygAooooA//U/IOiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigB6/df6f1FMp6/df6f1FMoAKKKKAP/1fyDooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAev3X+n9RTKev3X+n9RTKACiiigD/9b8g6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAHr91/p/UUynr91/p/UUygAooooA//X/IOiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigB6/df6f1FMp6/df6f1FMoAKKKKAP/0PyDooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAev3X+n9RTKev3X+n9RTKACiiigD/9k=	4	t	37	37	2026-06-17 20:46:42.387	2026-06-17 21:24:23.599
1	Actividad académica	Registro institucional de actividad académica.	\N	1	t	37	37	2026-06-17 13:29:06.781	2026-06-17 21:24:26.766
\.


--
-- Data for Name: DashboardNoticia; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."DashboardNoticia" (id, titulo, descripcion, color, orden, activo, "creadoPorUsuarioId", "actualizadoPorUsuarioId", "creadoEn", "actualizadoEn") FROM stdin;
1	Semana cultural PPDA	Actividades académicas, artísticas y deportivas durante la próxima semana.	azul	1	f	37	37	2026-06-17 13:27:57.408	2026-06-17 21:16:53.865
2	Escuela de padres	Encuentro institucional para fortalecer el acompañamiento familiar.	verde	2	f	37	37	2026-06-17 17:24:52.146	2026-06-17 21:16:55.725
3	Buenos dias Familia	Dia de la familia Homosexual	morado	6	f	37	37	2026-06-17 20:25:54.425	2026-06-17 21:16:59.477
5	Kany García	Viene Kani Garcia a cantar con mayuyiis	azul	3	t	37	37	2026-06-17 21:17:24.312	2026-06-17 21:24:05.009
4	Feliz día de la madre weeee	Feliz día de la madre para todas las perras que se dejaron embarazar	azul	5	t	37	37	2026-06-17 20:30:26.291	2026-06-17 21:24:07.671
6	DIa del caballo violador	dqasdasdas	azul	0	t	37	\N	2026-06-17 21:24:53.859	2026-06-17 21:24:53.859
\.


--
-- Data for Name: Docente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Docente" (id, "usuarioId", documento, telefono, "creadoEn") FROM stdin;
1	2	1053839016	3114034818	2026-05-19 23:00:25.346
2	6	123456	0000007	2026-05-21 21:51:04.198
17	8	314198	11111111	2026-05-23 04:23:04.517
16	9	12345689891	12345678	2026-05-22 16:06:05.734
18	11	104561234	31224452342	2026-05-23 14:43:59.376
19	16	30289892	30289892	2026-05-28 12:56:35.6
20	18	100100	12345678	2026-05-28 16:18:37.98
21	25	1001001001001	3108937070	2026-06-04 16:12:05.357
22	21	1053	222222	2026-06-07 18:59:54.891
45	28			2026-06-08 23:18:58.301
46	15	12345	12344	2026-06-09 00:28:53.334
47	13	12	434	2026-06-09 00:33:19.805
48	27	234324	434	2026-06-09 00:51:14.027
44	26	12344	12323	2026-06-08 23:06:23.787
49	42	1111111	3435454	2026-06-18 20:14:21.033
50	43	48163264128	300000000	2026-06-19 00:51:30.773
51	49	2001	3111111111	2026-06-19 13:46:01.356
\.


--
-- Data for Name: Estudiante; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Estudiante" (id, "usuarioId", nombre, documento, "grupoId", activo, "creadoEn") FROM stdin;
2	7	Manuel Medrano	55555	6	t	2026-05-22 03:02:43.844
3	5	Urapanes	666666	2	t	2026-05-22 04:03:27.902
8	10	Estudiante Nuevo	3090000001	1	t	2026-05-22 17:21:47.56
10	19	Estudiante Prueba	100100100	1	t	2026-05-28 16:22:17.969
11	31	mayuyis	666	21	t	2026-06-09 14:10:37.039
12	30	fracturas embajada	6666	21	t	2026-06-09 14:10:47.347
13	29	Hijo de Lina	66666	21	t	2026-06-09 14:10:55.919
14	32	Sergito Macho Opresor	200000001	1	t	2026-06-10 03:34:11.504
15	33	Diego Norrea Norrea	10	1	t	2026-06-11 17:07:27.422
16	27	Antonella Petro	3454545	21	t	2026-06-13 21:18:15.468
17	36	Tu tia Marta sin cancer	543210	21	t	2026-06-13 21:36:28.628
1	3	Agujetas Cardona Guapacha	1981918198	21	t	2026-05-22 03:01:15.399
18	46	Simp 3	23	23	t	2026-06-19 00:57:42.654
19	45	Simp 2	46	23	t	2026-06-19 00:57:59.939
20	44	Simp 1	92	23	t	2026-06-19 00:58:10.943
21	48	Juan Pérez	1001	1	t	2026-06-19 13:46:00.63
\.


--
-- Data for Name: EstudianteAcudiente; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."EstudianteAcudiente" (id, "estudianteId", "acudienteId", parentesco) FROM stdin;
1	8	2	Madre
14	2	2	\N
17	1	2	\N
18	8	1	\N
19	3	4	\N
21	1	5	\N
24	17	5	\N
25	14	2	\N
26	16	5	\N
28	1	7	Padre
29	12	5	Tío
31	11	4	Tío
32	3	1	Hermano
33	10	3	Abuelo
34	1	8	Padre
35	1	9	Madre
36	20	10	Padre
37	19	10	Padre
38	18	10	Padre
39	21	11	MADRE
\.


--
-- Data for Name: Grupo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Grupo" (id, nombre, grado, "directorDocenteId", activo, "creadoEn") FROM stdin;
1	6-2	Sexto	1	t	2026-05-21 14:33:09.645
5	8-3	Octavo	\N	t	2026-05-21 22:31:40.036
7	6	Cuarto	\N	t	2026-05-22 15:09:27.313
8	El retiro	20-2	\N	t	2026-05-22 15:30:16.081
15	Alpin de chocolate	Sexto	19	t	2026-06-07 17:04:03.508
10	Vulcano	8	16	t	2026-05-22 16:07:36.291
12	Vulcano65	8	16	t	2026-05-22 16:09:09.069
13	Prueba	prueba	\N	t	2026-05-22 16:10:55.585
14	PruebaPrueba	pruebaprueba	16	t	2026-05-22 16:13:12.561
20	8-A	Octavo	20	t	2026-06-07 17:50:17.674
22	2-2	Segundo	20	t	2026-06-07 18:00:08.593
21	10-3	Décimo	20	t	2026-06-07 17:54:53.3
17	1-A	Primero	22	t	2026-06-07 17:14:11.99
6	3-1	Tercero	\N	f	2026-05-21 22:32:21.597
23	11-D	Once	50	t	2026-06-19 00:53:23.978
3	4-3	Cuarto	17	f	2026-05-21 22:25:32.148
16	11-4	Once	16	t	2026-06-07 17:13:23.367
11	4-2	Cuarto	22	t	2026-05-22 16:08:15.291
4	5-1	Quinto	21	f	2026-05-21 22:28:33.863
19	6-4	Sexto	22	t	2026-06-07 17:41:10.446
2	10-A	Decimo	18	f	2026-05-21 22:24:47.694
18	2-3	Segundo	22	t	2026-06-07 17:40:43.479
\.


--
-- Data for Name: Observacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Observacion" (id, "estudianteId", "docenteId", "grupoId", fecha, tipo, descripcion, "enviarAcudiente", "creadoEn") FROM stdin;
2	1	18	2	2026-05-24 21:45:01.822	INDIVIDUAL	Quiero felicitar a sus papás Mateo y Cristina, nunca había tenido un estudiante tan brillante, ojalá no sea infiel cuando tenga 33 años. 	f	2026-05-24 21:45:01.825
3	\N	18	2	2026-05-24 21:47:56.294	GENERAL	Pruebaaaa1siahorasi verdaderamente consola	f	2026-05-24 21:47:56.296
1	\N	18	2	2026-05-24 21:43:35.335	GENERAL	Buen comportamiento en clase	f	2026-05-24 21:43:35.339
4	8	1	1	2026-05-28 00:00:00	INDIVIDUAL	El estudiante participó activamente en clase y entregó la actividad completa.	f	2026-06-01 15:50:24.308
5	8	1	1	2026-05-28 00:00:00	INDIVIDUAL	El estudiante mostró buena disposición para trabajar en equipo.	f	2026-06-01 15:51:04.635
6	1	18	2	2026-05-28 00:00:00	INDIVIDUAL	El estudiante requiere mejorar la entrega oportuna de actividades.	f	2026-06-01 15:51:25.582
7	3	18	2	2026-05-28 00:00:00	INDIVIDUAL	El estudiante presentó avances en la actividad, aunque necesita reforzar la argumentación.	f	2026-06-01 15:51:48.613
8	\N	1	1	2026-05-28 00:00:00	GENERAL	El grupo tuvo buena disposición general durante la clase.	f	2026-06-01 15:52:13.352
9	8	1	1	2026-05-28 00:00:00	INDIVIDUAL	El estudiante participó activamente en clase y entregó la actividad completa.	f	2026-06-01 15:58:43.664
10	3	18	2	2026-05-28 00:00:00	INDIVIDUAL	El estudiante presentó avances, aunque necesita reforzar la argumentación.	f	2026-06-01 15:59:03.938
11	\N	1	1	2026-05-28 00:00:00	GENERAL	El grupo tuvo buena disposición general durante la clase.	f	2026-06-01 15:59:20.206
12	16	20	21	2026-06-13 23:51:06.144	INDIVIDUAL	Llora toda la clase porque James no la quiere. 	f	2026-06-13 23:51:06.16
13	10	1	1	2026-06-16 04:08:05.398	INDIVIDUAL	El estudiante participó activamente en clase y entregó la actividad completa al finalizar la clase. 	f	2026-06-16 04:08:05.403
14	1	20	21	2026-06-23 00:12:42.2	INDIVIDUAL	Mate no se que hacer con tanto amor que no nos dimos, y que cada dia aguarda por ti. 	t	2026-06-23 00:12:42.345
\.


--
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Usuario" (id, nombre, correo, password, rol, activo, "creadoEn", "actualizadoEn") FROM stdin;
31	mayuyis	mayuyis@test.com	$2b$10$dLOkJxH.A9n4.XQ7BtlGz.Da1nT.qGI959YIl4R1JiZhpaQOw29hu	ESTUDIANTE	t	2026-06-09 14:09:48.321	2026-06-09 14:09:48.321
1	Mateo Cardona	mateo@test.com	$2b$10$8BQJX57SRiT4Q7jmXlKCduZ1hBkOk6BVR.SKZEMbZlV6xsj9gL.AO	ADMINISTRATIVO	t	2026-05-18 11:12:52.532	2026-05-27 22:11:25.719
16	Mauritania	mauritania@test.com	$2b$10$i1cSlWU4uN.xlhJ4p816vO02VglK1IK8C.dyUY7beNFZ.E0JObmXK	DOCENTE	t	2026-05-28 12:55:55.216	2026-05-28 12:55:55.216
18	Docente Prueba	docente@test.com	$2b$10$sgO4TVYnUiGr22qBsEJ6WekW2mtoAYTxSx49bFEVhrKztcZzzAZFi	DOCENTE	t	2026-05-28 16:15:41.799	2026-05-28 16:15:41.799
19	Estudiante Prueba	estudiante@test.com	$2b$10$bN8kANfENNAaORsD6gE5reieiZ0tG0wgJwX5rdWeb8RuAkxkPY3kq	ESTUDIANTE	t	2026-05-28 16:15:54.398	2026-05-28 16:15:54.398
32	Sergito Macho Opresor	sergito@test.com	$2b$10$Rgn8/BITFR9DQg63QR3pe.lLRJbvXu4rQVx4zvIgpgsdlwDPEWFMq	ESTUDIANTE	t	2026-06-10 03:30:09.35	2026-06-10 03:30:09.35
33	Diego Norrea Norrea	norrea@test.com	$2b$10$WzCvZR8jTw1B5hM3C95B9.jcDdgv1THePAJvkee.kXFJEoAdxwOr.	ESTUDIANTE	t	2026-06-11 17:06:38.79	2026-06-11 17:06:38.79
34	Pachonorrea norrea	pachonorrea@test.com	$2b$10$10vuQ3GvDUeohkReTuICJOY.X8AeBzdugLF1HSa2.jaxmGDr.A/dm	ACUDIENTE	t	2026-06-11 17:20:29.421	2026-06-11 17:20:29.421
3	Agujetas	agujetas@test.com	$2b$10$A2bkAt1rKG3mpJVp6IoIOO69sqHUo4klxsTDsY.y8Ps7EuqWCIGxW	ESTUDIANTE	t	2026-05-19 15:42:53.464	2026-05-21 14:17:05.242
22	Firmes por la patria	eltigre@test.com	$2b$10$WuoiLsnfjLLklSRxAItruuQvs/LHN1GPMBOPJQVE1qeA6oigzHe3W	ESTUDIANTE	t	2026-06-04 02:58:33.017	2026-06-06 03:31:49.915
35	Pachonorrea	pachon@test.com	$2b$10$EO7VtDIbElk1HBqsLDUk0.LKERsz5gAcYShyoy2GScdvhpj04w3Tm	ACUDIENTE	t	2026-06-12 18:52:06.016	2026-06-12 18:53:41.84
37	Directivo	directivo@test.com	$2b$10$k6dnKHng9Honsa4fl7K8AeF5Mzfj5M8b2fVMuWPAkiHpZOO2IRZIK	DIRECTIVO	t	2026-06-13 22:57:57.874	2026-06-13 22:57:57.874
26	Jake	yeik@test.com	$2b$10$JCdO.oOI/tIwczxm0iMUV.rcCK3suU0U36DkWeS74pxDoKYuxALkW	DOCENTE	t	2026-06-06 03:16:07.687	2026-06-07 18:38:43.515
2	Cristina	cristina@test.com	$2b$10$XfOkR14gQcu6z.8IkNmy8OUAcq3v/Lh44VmMgHRxX.PJ8RJrJdeJm	ADMINISTRATIVO	t	2026-05-19 02:26:58.59	2026-05-21 21:29:56.398
25	onelia montoya de guapacha	one@test.com	$2b$10$ydsH6xTwCDhB9HACPJtUguSDOk4EuQlXhmiCljcVmveRI1qd1HtOC	ADMINISTRATIVO	t	2026-06-04 16:10:01.869	2026-06-07 18:41:55.281
17	Admin Prueba	admin@test.com	$2b$10$RQRFvFBjyU3ST8465Rarz.l8qS0CPSAFv1ySzRGfVGYCt80SVor.K	ADMINISTRATIVO	t	2026-05-28 16:15:29.397	2026-06-07 18:42:00.447
21	Yibuti	yibuti@test.com	$2b$10$pgyR2yDLhDLV8qGBbOS/6e3odMgm6ty2o3.vjv5iSrn.NjBsMl.vu	DOCENTE	t	2026-06-03 14:59:11.031	2026-06-07 18:52:47.227
38	Psicorientador	psicorientador@test.com	$2b$10$5UMWA9gfcZZwWWqKgtYFY.Pgfxr/trpGj3VytCceKFTsjbejL7HxS	PSICORIENTADOR	t	2026-06-13 22:58:49.789	2026-06-13 22:58:49.789
7	Manuel Medrano	manuel@test.com	$2b$10$kRM.MLVMsa5yihbbVOUE0.SLTWA6BmroeErWSClQygLmEBo4ZwY0m	ESTUDIANTE	t	2026-05-22 03:02:18.549	2026-05-22 03:02:18.549
5	Urapanes	urapanes@test.com	$2b$10$9WyL3sfSaFfixOpdyF9zPe9PF4zGqEaoMz1x6/DsXf/fDQoHreghC	ESTUDIANTE	t	2026-05-19 22:24:59.993	2026-05-22 03:22:07.814
15	Show de Medio tiempo	show@test.com	$2b$10$To9CNl6DNuLsWM07hh4iFeU2osYDwlejovWekwJXj3EOAZaWED2Uu	DOCENTE	t	2026-05-25 10:32:56.131	2026-06-09 00:02:05.231
6	Pibija Cardona Guapacha	pibijita@test.com	$2b$10$K4u2GDBKd/9XY5LQQ7uiGesz/1kPcgmjD5Zf2ds4/jFuwcB4pvNtm	DOCENTE	t	2026-05-21 21:50:21.666	2026-05-22 15:06:49.044
8	Kani Garcia		$2b$10$TFZR4lr5DvlzTWl3jcqUHe/4JBJqvDm94.c3Znc7kHRAJiOGJaJ.i	DOCENTE	t	2026-05-22 15:07:29.384	2026-05-22 15:07:29.384
9	Upa upa	upa@test.com	$2b$10$dnuIduhLxH3jE8YltLhRKucjx52kN.Vkj6GyLJMa4xQuWIhLDMQIK	DOCENTE	t	2026-05-22 15:55:28.43	2026-05-22 15:55:28.43
10	Estudiante Nuevo	estudiante.nuevo@test.com	$2b$10$8z3drWm91u2TLhB7H.150u5UCSbTCo0T3iA.mgi2BuEczHqVbvo3m	ESTUDIANTE	t	2026-05-22 17:20:58.231	2026-05-22 17:20:58.231
36	Tu tia Marta sin cancer	marta@test.com	$2b$10$JQv6vn0lKB9WslKIzGslz.CCKvIijtQGGelCZPoLyJqNCzJ675QeS	ESTUDIANTE	f	2026-06-13 21:31:44.366	2026-06-13 23:10:41.399
11	Eti	Eti@test.com	$2b$10$COKtvJXAmQL0kE862COUGOXal3QOWRCXLgzJ4CQvKDtfNxU/vUHGm	DOCENTE	t	2026-05-23 14:43:40.038	2026-05-23 14:46:08.911
12	Kaiser	kaiser@test.com	$2b$10$iKRZOfYtY8km1VdJAlNaiu3b3tDxlQBCBQVOVMqeFAindqG0YSVfK	ACUDIENTE	t	2026-05-24 23:38:04.14	2026-05-24 23:38:04.14
14	PreubaAcudiente	dmfkmsdlf	$2b$10$tt.f7aH8PZ5WHc2GGC/whOdT6OuZCsDuD6es/3efoiFOpyDTWwXyu	ACUDIENTE	t	2026-05-25 04:58:56.268	2026-05-25 04:58:56.268
13	El ciclista feliz	ciclista@test.com	$2b$10$jdbfkH80runUAP63nqTVYu16CMXoDs9Og7sIfFakYj4JqXVhvKdJ6	DOCENTE	t	2026-05-25 04:01:38.167	2026-06-09 00:02:13.429
39	Tienda 20 de Julio	tienda@test.com	$2b$10$6nxEeDbHBwNXlyfmK/s/P.x2rCQipXmNGOMRPIT8VDmrPfeyM8/aS	ACUDIENTE	t	2026-06-14 20:58:39.544	2026-06-14 20:58:39.544
40	Anne Hathaway	anne@test.com	$2b$10$l8soLQHBtU769CICitIxC.DOBYjaEp.RLfkwUFmhxd3c9AepbNi8.	ACUDIENTE	t	2026-06-18 17:02:24.229	2026-06-18 17:02:24.229
41	Adam Levine	adam@test.com	$2b$10$9M4e7KDzWEcavZtwigQiS.2JXNNhVla31QCTjs/sdMhtElQ5VEdPC	ACUDIENTE	t	2026-06-18 17:02:45.325	2026-06-18 17:02:45.325
20	Acudiente Prueba 2	acudiente@test.com	$2b$10$kF5iJ6jtlYBfHB/k.EASSOZHahK/jP/uwXApw9/Bw4gxQ.kko6WqC	ACUDIENTE	t	2026-05-28 16:16:11.103	2026-06-06 04:10:51.647
42	Juan con vertigo	juan@test.com	$2b$10$drwDPm4dOKXPkRrDbGWJH.EXacvG4N54ZgIqO7ewnecB3Ok3Fjvc6	DOCENTE	t	2026-06-18 20:14:07.807	2026-06-18 20:14:07.807
43	Aleja la Medium	aleja@test.com	$2b$10$RXq6H01rltncMJl9JBlJ1ObihSEZLTOjjyFX.wVEUyMWGx1j0AesW	DOCENTE	t	2026-06-19 00:50:59.258	2026-06-19 00:50:59.258
23	Petro y su travesti	travesti@test.com	$2b$10$uq86LjAXzbF12Xmux6WTS.i6VGhJ2kvH43ILDrZdUCkUkTOXkoReW	DOCENTE	t	2026-06-04 02:59:59.016	2026-06-09 01:04:55.539
28	Jorge Bala	balita@test.com	$2b$10$b4QjHnNnD/CHK0DKtuj2COHnSc2nKRXK61oupZpzWaqWyvVLvTwmm	DOCENTE	f	2026-06-07 17:44:14.177	2026-06-09 01:41:44.494
27	Antonella Petro	antonella@test.com	$2b$10$JTYnrXlvPM6KG/t/1feNVO8eEoavYAu/BPuCOj.zQ2yBjVqbzfTMC	ESTUDIANTE	t	2026-06-06 18:32:30.333	2026-06-09 02:53:16.91
29	Hijo de Lina	fat@test.com	$2b$10$MudicaLn8i8xXSpXKBbBRO2AaqVHFbIHkk7J1CbdCLVph6X4KA7Ua	ESTUDIANTE	t	2026-06-09 14:08:31.826	2026-06-09 14:08:31.826
30	fracturas embajada	fractura@test.com	$2b$10$.94pEN5BjSxi32a7EOQM3.GgX5fSJI5.T6xrovq.8y7uajXXWnArG	ESTUDIANTE	t	2026-06-09 14:09:09.621	2026-06-09 14:09:09.621
44	Simp 1	simp1@test.com	$2b$10$xHFSP7vnlb2BrC5zwL6J6.bf0ScaOb15abZHcf5tGZ51PhT3UkW1G	ESTUDIANTE	t	2026-06-19 00:55:39.354	2026-06-19 00:55:39.354
45	Simp 2	simp2@test.com	$2b$10$96CK4jK5qOyTHtCclIT4n.UVyA1KUsoejmlqlZ1diK.ZMp1Hm1f9i	ESTUDIANTE	t	2026-06-19 00:56:00.853	2026-06-19 00:56:00.853
46	Simp 3	simp3@test.com	$2b$10$LK2o/FUAAcdfQSxRRC5pC.jIyXcWJggAbb.cU/oHTHJQbnNZ3ShJe	ESTUDIANTE	t	2026-06-19 00:56:21.85	2026-06-19 00:56:21.85
47	Simp Acudiente	simpacu@test.com	$2b$10$V0ZlWKYbRS.n6rfoEqm0F.rvS8CCOdYGWX9aLhjG2LVP0q5waLw6G	ACUDIENTE	t	2026-06-19 00:56:48.157	2026-06-19 00:56:48.157
48	Juan Pérez	juan1@test.com	$2b$10$fsnAwQUxmlg/W52/8B3ce.3ROPPDaxmOCSaMYwqSH5pfOBhlE.DR2	ESTUDIANTE	t	2026-06-19 13:46:00.417	2026-06-19 13:46:00.417
49	Carlos Ruiz	carlos@test.com	$2b$10$MnJFFA4AMTN0WWW05Ir3feJR/xgeI4ORMjIn9XwGsLQHxDNIhjGPK	DOCENTE	t	2026-06-19 13:46:01.135	2026-06-19 13:46:01.135
50	Ana Gómez	ana@test.com	$2b$10$ZCdXrEQrXap5G6SR2HJ2CO.igNxD5rDi5TkUkBTS0pa29yRz7SNvi	ACUDIENTE	t	2026-06-19 13:46:01.642	2026-06-19 13:46:01.642
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
85e5739e-7030-4c40-9038-b250c493635d	26cbbd9f2963c7dd5c015263fd15af718c0dea3d985a3587d2a9d15f67d02848	2026-05-18 05:54:26.379065+00	20260512121849_init	\N	\N	2026-05-18 05:54:23.08478+00	1
febd3ea7-1e18-42c7-9382-e3ae19dcc7c0	e815963c9e3ba0fb9c85cc8bc5b9524a784fb5834c8b36debbfba5ee6b3319a2	2026-06-06 18:48:05.376185+00	20260606184804_crear_modelo_area	\N	\N	2026-06-06 18:48:04.795147+00	1
54ddf977-0066-4415-87e4-71a4dd63d7ef	2caf6634a195b3ea0af81dd4c8b2ce69108e7690f8c24d0cd0951db399ab0ae2	2026-06-06 20:10:48.661887+00	20260606201047_crear_modelo_asignacion_academica	\N	\N	2026-06-06 20:10:47.51998+00	1
c9a35d39-029f-4433-b600-f76ccac3f27d	42ef9f7fe04357c0a0809f31720136234fd8f8e6c9546e50a5923422b76a91ac	2026-06-06 21:12:22.239957+00	20260606211221_relacionar_asistencia_con_asignacion_academica	\N	\N	2026-06-06 21:12:21.645326+00	1
3c4bf8b1-ab23-4c4e-ab79-a0696a3273f2	2c8a4fa20e4e2bf4d468cd773c530000fd57c18cf7086b7899ae2c0f4a1033fe	2026-06-07 19:16:12.365547+00	20260607191611_agregar_unique_asistencia_asignacion_fecha	\N	\N	2026-06-07 19:16:11.886097+00	1
27756bcc-555f-409a-a16c-96e677f62638	1e2b95c75973db479e4e362853110ecbf2ad66bf2b03c4704216f566b3cf2f2f	2026-06-13 22:21:01.300543+00	20260613222100_add_roles_directivo_psicorientador	\N	\N	2026-06-13 22:21:00.6986+00	1
cb130b0d-7fde-4b85-91bc-05e78e0e4d43	d05e7e1419094e2a29afa06722898822866a23870d44a1944acd54d2f583bcb0	2026-06-17 13:08:13.096607+00	20260617130811_add_dashboard_module	\N	\N	2026-06-17 13:08:12.03547+00	1
caf211a6-d18a-4fd0-972a-8d9b52b0b671	4b44cabf15be0f3a9ddc002e80ca1f41eb605366659e2903c7b84f1655355d3b	2026-06-19 12:56:45.352031+00	20260619125643_agregar_documento_acudiente	\N	\N	2026-06-19 12:56:44.487845+00	1
\.


--
-- Name: Acudiente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Acudiente_id_seq"', 11, true);


--
-- Name: Administrativo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Administrativo_id_seq"', 1, false);


--
-- Name: Area_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Area_id_seq"', 7, true);


--
-- Name: AsignacionAcademica_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."AsignacionAcademica_id_seq"', 10, true);


--
-- Name: Asistencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Asistencia_id_seq"', 69, true);


--
-- Name: DashboardEvento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."DashboardEvento_id_seq"', 5, true);


--
-- Name: DashboardGaleria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."DashboardGaleria_id_seq"', 5, true);


--
-- Name: DashboardNoticia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."DashboardNoticia_id_seq"', 6, true);


--
-- Name: Docente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Docente_id_seq"', 51, true);


--
-- Name: EstudianteAcudiente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."EstudianteAcudiente_id_seq"', 39, true);


--
-- Name: Estudiante_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Estudiante_id_seq"', 21, true);


--
-- Name: Grupo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Grupo_id_seq"', 23, true);


--
-- Name: Observacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Observacion_id_seq"', 14, true);


--
-- Name: Usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Usuario_id_seq"', 50, true);


--
-- Name: Acudiente Acudiente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Acudiente"
    ADD CONSTRAINT "Acudiente_pkey" PRIMARY KEY (id);


--
-- Name: Administrativo Administrativo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Administrativo"
    ADD CONSTRAINT "Administrativo_pkey" PRIMARY KEY (id);


--
-- Name: Area Area_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Area"
    ADD CONSTRAINT "Area_pkey" PRIMARY KEY (id);


--
-- Name: AsignacionAcademica AsignacionAcademica_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AsignacionAcademica"
    ADD CONSTRAINT "AsignacionAcademica_pkey" PRIMARY KEY (id);


--
-- Name: Asistencia Asistencia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Asistencia"
    ADD CONSTRAINT "Asistencia_pkey" PRIMARY KEY (id);


--
-- Name: DashboardEvento DashboardEvento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DashboardEvento"
    ADD CONSTRAINT "DashboardEvento_pkey" PRIMARY KEY (id);


--
-- Name: DashboardGaleria DashboardGaleria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DashboardGaleria"
    ADD CONSTRAINT "DashboardGaleria_pkey" PRIMARY KEY (id);


--
-- Name: DashboardNoticia DashboardNoticia_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DashboardNoticia"
    ADD CONSTRAINT "DashboardNoticia_pkey" PRIMARY KEY (id);


--
-- Name: Docente Docente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Docente"
    ADD CONSTRAINT "Docente_pkey" PRIMARY KEY (id);


--
-- Name: EstudianteAcudiente EstudianteAcudiente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EstudianteAcudiente"
    ADD CONSTRAINT "EstudianteAcudiente_pkey" PRIMARY KEY (id);


--
-- Name: Estudiante Estudiante_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Estudiante"
    ADD CONSTRAINT "Estudiante_pkey" PRIMARY KEY (id);


--
-- Name: Grupo Grupo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Grupo"
    ADD CONSTRAINT "Grupo_pkey" PRIMARY KEY (id);


--
-- Name: Observacion Observacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Observacion"
    ADD CONSTRAINT "Observacion_pkey" PRIMARY KEY (id);


--
-- Name: Usuario Usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Acudiente_documento_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Acudiente_documento_key" ON public."Acudiente" USING btree (documento);


--
-- Name: Acudiente_usuarioId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Acudiente_usuarioId_key" ON public."Acudiente" USING btree ("usuarioId");


--
-- Name: Administrativo_usuarioId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Administrativo_usuarioId_key" ON public."Administrativo" USING btree ("usuarioId");


--
-- Name: Area_nombre_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Area_nombre_key" ON public."Area" USING btree (nombre);


--
-- Name: AsignacionAcademica_docenteId_grupoId_areaId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "AsignacionAcademica_docenteId_grupoId_areaId_key" ON public."AsignacionAcademica" USING btree ("docenteId", "grupoId", "areaId");


--
-- Name: Asistencia_estudianteId_asignacionAcademicaId_fecha_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Asistencia_estudianteId_asignacionAcademicaId_fecha_key" ON public."Asistencia" USING btree ("estudianteId", "asignacionAcademicaId", fecha);


--
-- Name: Docente_documento_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Docente_documento_key" ON public."Docente" USING btree (documento);


--
-- Name: Docente_usuarioId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Docente_usuarioId_key" ON public."Docente" USING btree ("usuarioId");


--
-- Name: EstudianteAcudiente_estudianteId_acudienteId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "EstudianteAcudiente_estudianteId_acudienteId_key" ON public."EstudianteAcudiente" USING btree ("estudianteId", "acudienteId");


--
-- Name: Estudiante_documento_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Estudiante_documento_key" ON public."Estudiante" USING btree (documento);


--
-- Name: Estudiante_usuarioId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Estudiante_usuarioId_key" ON public."Estudiante" USING btree ("usuarioId");


--
-- Name: Usuario_correo_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Usuario_correo_key" ON public."Usuario" USING btree (correo);


--
-- Name: Acudiente Acudiente_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Acudiente"
    ADD CONSTRAINT "Acudiente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Administrativo Administrativo_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Administrativo"
    ADD CONSTRAINT "Administrativo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AsignacionAcademica AsignacionAcademica_areaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AsignacionAcademica"
    ADD CONSTRAINT "AsignacionAcademica_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES public."Area"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AsignacionAcademica AsignacionAcademica_docenteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AsignacionAcademica"
    ADD CONSTRAINT "AsignacionAcademica_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES public."Docente"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AsignacionAcademica AsignacionAcademica_grupoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AsignacionAcademica"
    ADD CONSTRAINT "AsignacionAcademica_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES public."Grupo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Asistencia Asistencia_asignacionAcademicaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Asistencia"
    ADD CONSTRAINT "Asistencia_asignacionAcademicaId_fkey" FOREIGN KEY ("asignacionAcademicaId") REFERENCES public."AsignacionAcademica"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Asistencia Asistencia_docenteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Asistencia"
    ADD CONSTRAINT "Asistencia_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES public."Docente"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Asistencia Asistencia_estudianteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Asistencia"
    ADD CONSTRAINT "Asistencia_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES public."Estudiante"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Asistencia Asistencia_grupoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Asistencia"
    ADD CONSTRAINT "Asistencia_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES public."Grupo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Docente Docente_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Docente"
    ADD CONSTRAINT "Docente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EstudianteAcudiente EstudianteAcudiente_acudienteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EstudianteAcudiente"
    ADD CONSTRAINT "EstudianteAcudiente_acudienteId_fkey" FOREIGN KEY ("acudienteId") REFERENCES public."Acudiente"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EstudianteAcudiente EstudianteAcudiente_estudianteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EstudianteAcudiente"
    ADD CONSTRAINT "EstudianteAcudiente_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES public."Estudiante"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Estudiante Estudiante_grupoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Estudiante"
    ADD CONSTRAINT "Estudiante_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES public."Grupo"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Estudiante Estudiante_usuarioId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Estudiante"
    ADD CONSTRAINT "Estudiante_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES public."Usuario"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Grupo Grupo_directorDocenteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Grupo"
    ADD CONSTRAINT "Grupo_directorDocenteId_fkey" FOREIGN KEY ("directorDocenteId") REFERENCES public."Docente"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Observacion Observacion_docenteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Observacion"
    ADD CONSTRAINT "Observacion_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES public."Docente"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Observacion Observacion_estudianteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Observacion"
    ADD CONSTRAINT "Observacion_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES public."Estudiante"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Observacion Observacion_grupoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Observacion"
    ADD CONSTRAINT "Observacion_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES public."Grupo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict lvbVoyHS9Xn0adZgLcYMoGI6JP0FBNhoqy3U3dSNLtRuJmh7QE5IcNgwLxe8Vly

