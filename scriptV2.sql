--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2025-05-19 14:40:14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 18650)
-- Name: address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.address (
    addres_id integer NOT NULL,
    user_id integer,
    street_address text NOT NULL,
    city text NOT NULL,
    cap text NOT NULL,
    province text NOT NULL,
    country text NOT NULL
);


ALTER TABLE public.address OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 18655)
-- Name: address_addres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.address_addres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.address_addres_id_seq OWNER TO postgres;

--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 216
-- Name: address_addres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.address_addres_id_seq OWNED BY public.address.addres_id;


--
-- TOC entry 217 (class 1259 OID 18656)
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    cart_id integer NOT NULL,
    user_id integer,
    creation_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 18660)
-- Name: carts_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_cart_id_seq OWNER TO postgres;

--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 218
-- Name: carts_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_cart_id_seq OWNED BY public.carts.cart_id;


--
-- TOC entry 219 (class 1259 OID 18661)
-- Name: carts_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts_products (
    carts_products_id integer NOT NULL,
    cart_id integer,
    product_id integer,
    quantity integer NOT NULL,
    creation_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.carts_products OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 18665)
-- Name: carts_products_carts_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_products_carts_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_products_carts_products_id_seq OWNER TO postgres;

--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 220
-- Name: carts_products_carts_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_products_carts_products_id_seq OWNED BY public.carts_products.carts_products_id;


--
-- TOC entry 221 (class 1259 OID 18666)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_name text NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 18671)
-- Name: categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_category_id_seq OWNER TO postgres;

--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 222
-- Name: categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_category_id_seq OWNED BY public.categories.category_id;


--
-- TOC entry 223 (class 1259 OID 18672)
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    user_id integer NOT NULL,
    product_id integer NOT NULL
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 18675)
-- Name: info_artisan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.info_artisan (
    artisan_id integer NOT NULL,
    iban text NOT NULL,
    craft text NOT NULL,
    artisan_state integer
);


ALTER TABLE public.info_artisan OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 18680)
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    product_id integer,
    user_id integer
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 18683)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    user_id integer,
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    order_state integer,
    total numeric(10,2) NOT NULL,
    addres_id integer
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 18687)
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 227
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- TOC entry 228 (class 1259 OID 18688)
-- Name: orders_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders_products (
    orders_products_id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    single_price numeric(10,2) NOT NULL
);


ALTER TABLE public.orders_products OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18691)
-- Name: orders_products_orders_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_products_orders_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_products_orders_products_id_seq OWNER TO postgres;

--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 229
-- Name: orders_products_orders_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_products_orders_products_id_seq OWNED BY public.orders_products.orders_products_id;


--
-- TOC entry 230 (class 1259 OID 18698)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    product_name text NOT NULL,
    photo text NOT NULL,
    photo_description text NOT NULL,
    price numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    category_id integer,
    creation_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18704)
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO postgres;

--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 231
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- TOC entry 232 (class 1259 OID 18705)
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    report_id integer NOT NULL,
    user_id integer,
    title character varying(255) NOT NULL,
    report_message text NOT NULL,
    report_state integer,
    sent_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    resolution_date timestamp without time zone,
    admin_id integer
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 18711)
-- Name: reports_report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reports_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_report_id_seq OWNER TO postgres;

--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 233
-- Name: reports_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reports_report_id_seq OWNED BY public.reports.report_id;


--
-- TOC entry 234 (class 1259 OID 18712)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    role_id integer NOT NULL,
    role_name text NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 18720)
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_role_id_seq OWNER TO postgres;

--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 235
-- Name: roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_role_id_seq OWNED BY public.roles.role_id;


--
-- TOC entry 236 (class 1259 OID 18721)
-- Name: states; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.states (
    state_id integer NOT NULL,
    state_name text NOT NULL
);


ALTER TABLE public.states OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 18726)
-- Name: states_state_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.states_state_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.states_state_id_seq OWNER TO postgres;

--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 237
-- Name: states_state_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.states_state_id_seq OWNED BY public.states.state_id;


--
-- TOC entry 238 (class 1259 OID 18727)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    user_name text NOT NULL,
    surname text NOT NULL,
    email text NOT NULL,
    user_password text NOT NULL,
    creation_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_role integer NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 18733)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 239
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 4750 (class 2604 OID 18734)
-- Name: address addres_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address ALTER COLUMN addres_id SET DEFAULT nextval('public.address_addres_id_seq'::regclass);


--
-- TOC entry 4751 (class 2604 OID 18735)
-- Name: carts cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts ALTER COLUMN cart_id SET DEFAULT nextval('public.carts_cart_id_seq'::regclass);


--
-- TOC entry 4753 (class 2604 OID 18736)
-- Name: carts_products carts_products_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products ALTER COLUMN carts_products_id SET DEFAULT nextval('public.carts_products_carts_products_id_seq'::regclass);


--
-- TOC entry 4755 (class 2604 OID 18737)
-- Name: categories category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq'::regclass);


--
-- TOC entry 4756 (class 2604 OID 18738)
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- TOC entry 4758 (class 2604 OID 18739)
-- Name: orders_products orders_products_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders_products ALTER COLUMN orders_products_id SET DEFAULT nextval('public.orders_products_orders_products_id_seq'::regclass);


--
-- TOC entry 4759 (class 2604 OID 18741)
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- TOC entry 4761 (class 2604 OID 18742)
-- Name: reports report_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports ALTER COLUMN report_id SET DEFAULT nextval('public.reports_report_id_seq'::regclass);


--
-- TOC entry 4763 (class 2604 OID 18743)
-- Name: roles role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN role_id SET DEFAULT nextval('public.roles_role_id_seq'::regclass);


--
-- TOC entry 4764 (class 2604 OID 18744)
-- Name: states state_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.states ALTER COLUMN state_id SET DEFAULT nextval('public.states_state_id_seq'::regclass);


--
-- TOC entry 4765 (class 2604 OID 18745)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4768 (class 2606 OID 18747)
-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (addres_id);


--
-- TOC entry 4770 (class 2606 OID 18749)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (cart_id);


--
-- TOC entry 4772 (class 2606 OID 18751)
-- Name: carts_products carts_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products
    ADD CONSTRAINT carts_products_pkey PRIMARY KEY (carts_products_id);


--
-- TOC entry 4774 (class 2606 OID 18753)
-- Name: categories categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);


--
-- TOC entry 4776 (class 2606 OID 18755)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);


--
-- TOC entry 4778 (class 2606 OID 18757)
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (user_id, product_id);


--
-- TOC entry 4780 (class 2606 OID 18759)
-- Name: info_artisan info_artisan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info_artisan
    ADD CONSTRAINT info_artisan_pkey PRIMARY KEY (artisan_id);


--
-- TOC entry 4782 (class 2606 OID 18761)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4784 (class 2606 OID 18763)
-- Name: orders_products orders_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders_products
    ADD CONSTRAINT orders_products_pkey PRIMARY KEY (orders_products_id);


--
-- TOC entry 4786 (class 2606 OID 18769)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- TOC entry 4788 (class 2606 OID 18771)
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (report_id);


--
-- TOC entry 4790 (class 2606 OID 18775)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- TOC entry 4792 (class 2606 OID 18777)
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- TOC entry 4794 (class 2606 OID 18779)
-- Name: states states_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey PRIMARY KEY (state_id);


--
-- TOC entry 4796 (class 2606 OID 18781)
-- Name: states states_state_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_state_name_key UNIQUE (state_name);


--
-- TOC entry 4798 (class 2606 OID 18783)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4800 (class 2606 OID 18785)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4801 (class 2606 OID 18912)
-- Name: address address_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4803 (class 2606 OID 18791)
-- Name: carts_products carts_products_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products
    ADD CONSTRAINT carts_products_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(cart_id);


--
-- TOC entry 4804 (class 2606 OID 18796)
-- Name: carts_products carts_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products
    ADD CONSTRAINT carts_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 4802 (class 2606 OID 18927)
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4805 (class 2606 OID 18806)
-- Name: favorites favorites_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- TOC entry 4806 (class 2606 OID 18811)
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 4809 (class 2606 OID 18816)
-- Name: inventory fk_inventory_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4810 (class 2606 OID 18821)
-- Name: inventory fk_inventory_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT fk_inventory_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4807 (class 2606 OID 18902)
-- Name: info_artisan info_artisan_artisan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info_artisan
    ADD CONSTRAINT info_artisan_artisan_id_fkey FOREIGN KEY (artisan_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4808 (class 2606 OID 18831)
-- Name: info_artisan info_artisan_artisan_state_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info_artisan
    ADD CONSTRAINT info_artisan_artisan_state_fkey FOREIGN KEY (artisan_state) REFERENCES public.states(state_id);


--
-- TOC entry 4811 (class 2606 OID 18836)
-- Name: orders orders_addres_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_addres_id_fkey FOREIGN KEY (addres_id) REFERENCES public.address(addres_id);


--
-- TOC entry 4812 (class 2606 OID 18841)
-- Name: orders orders_order_state_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_state_fkey FOREIGN KEY (order_state) REFERENCES public.states(state_id);


--
-- TOC entry 4814 (class 2606 OID 18942)
-- Name: orders_products orders_products_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders_products
    ADD CONSTRAINT orders_products_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4815 (class 2606 OID 18932)
-- Name: orders_products orders_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders_products
    ADD CONSTRAINT orders_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4813 (class 2606 OID 18937)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4816 (class 2606 OID 18861)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id);


--
-- TOC entry 4817 (class 2606 OID 18866)
-- Name: reports reports_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- TOC entry 4818 (class 2606 OID 18871)
-- Name: reports reports_report_state_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_report_state_fkey FOREIGN KEY (report_state) REFERENCES public.states(state_id);


--
-- TOC entry 4819 (class 2606 OID 18876)
-- Name: reports reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4820 (class 2606 OID 18891)
-- Name: users users_user_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_role_fkey FOREIGN KEY (user_role) REFERENCES public.roles(role_id);


-- Completed on 2025-05-19 14:40:15

--
-- PostgreSQL database dump complete
--

