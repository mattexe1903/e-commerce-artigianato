-- Script per la creazione del database e delle tabelle per un sistema di gestione di un e-commerce

--Creazione della tabella per la gestione dei ruoli con i relativi inserimenti inziali.
CREATE TABLE ruoli
(
    id SERIAL PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL UNIQUE
);

INSERT INTO ruoli
    (nome)
VALUES
    ('admin'),
    ('utente'),
    ('artigiano');

--Creazione della tabella per la gestione dei permessi con i relativi inserimenti inziali.
CREATE TABLE permessi
(
    id SERIAL PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL UNIQUE
);

INSERT INTO permessi
    (nome)
VALUES
    ('login'),
    ('registrazione come venditore'),
    ('profilo utente'),
    ('profilo artigiano'),
    ('dashboard admin'),
    ('visualizza prodotti'),
    ('aggiungi prodotto'),
    ('modifica prodotto'),
    ('elimina prodotto'),
    ('visualizza ordini'),
    ('gestisci ordini'),
    ('visualizza carrello'),
    ('gestisci carrello'),
    ('visualizza preferiti'),
    ('gestisci preferiti');

--Creazione della tabella per la gestione dei permessi associati ai ruoli.
CREATE TABLE ruoli_permessi
(
    idPermesso INTEGER REFERENCES permessi(id),
    idRuolo INTEGER REFERENCES ruoli(id),
    permission_type CHAR,
    PRIMARY KEY (idRuolo, idPermesso)
);

-- TO DO BETTER:
INSERT INTO ruoli_permessi
    (idPermesso, idRuolo, permission_type)
values
    (1, 1, 'W'),
    (1, 2, 'W'),
    (1, 3, 'W');

--Creazione della tabella per la gestione degli utenti con i relativi inserimentO inziale dell'admin.
CREATE TABLE utenti
(
    id SERIAL PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL,
    cognome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ruolo INT REFERENCES ruoli(id) NOT NULL
);

INSERT INTO utenti
    (nome, cognome, email, password, ruolo)
VALUES
    ('Mario', 'Rossi', 'mario.rossi@gmail.com', 'password123', 2),
    ('Admin', 'Admin', 'admin@gmail.com', 'admin123', 1),
    ('Giovanni', 'Verdi', 'artigiano@gmail.com', 'password123', 3);

-- Creazione della tabella per la gestione delle informazioni extra per gli artigiani.
CREATE TABLE artigiani_informazioni(
    id INTEGER REFERENCES utenti(id) PRIMARY KEY,
    iban TEXT NOT NULL,
    mansione TEXT NOT NULL
);

-- Creazione della tabella per la gestione delle informazioni di spedizione
CREATE TABLE indirizzo
(
    id SERIAL PRIMARY KEY NOT NULL,
    idUtente INTEGER REFERENCES utenti(id),
    via TEXT NOT NULL,
    citta TEXT NOT NULL,
    cap TEXT NOT NULL,
    provincia TEXT NOT NULL,
    nazione TEXT NOT NULL
);

-- Creazione della tabella per la gestione dei prodotti
CREATE TABLE prodotti
(
    id SERIAL PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL,
    foto TEXT NOT NULL,
    descrizione TEXT NOT NULL,
    prezzo DECIMAL(10, 2) NOT NULL,
    quantita INT NOT NULL,
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creazione della tabella per la gestione dei prodotti preferiti
CREATE TABLE preferiti
(
    idUtente INTEGER REFERENCES utenti(id),
    idProdotto INTEGER REFERENCES prodotti(id),
    PRIMARY KEY (idUtente, idProdotto)
);

--NEWS FROM SCRIPT 2

CREATE TABLE carrello
(
    id SERIAL PRIMARY KEY NOT NULL,
    idUtente INTEGER REFERENCES utenti(id),
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carrello_prodotti
(
    id SERIAL PRIMARY KEY NOT NULL,
    idCarrello INTEGER REFERENCES carrello(id),
    idProdotto INTEGER REFERENCES prodotti(id),
    quantita INTEGER NOT NULL,
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ordine
(
    id SERIAL PRIMARY KEY NOT NULL,
    idUtente INTEGER REFERENCES utenti(id),
    data_ordine TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stato TEXT NOT NULL CHECK (stato IN ('in attesa', 'in lavorazione', 'completato', 'annullato')),
    totale DECIMAL(10, 2) NOT NULL,
    indirizzo INTEGER REFERENCES indirizzo(id)
);

CREATE TABLE ordine_prodotti
(
    id SERIAL PRIMARY KEY NOT NULL,
    idOrdine INTEGER REFERENCES ordine(id),
    idProdotto INTEGER REFERENCES prodotti(id),
    quantita INTEGER NOT NULL,
    prezzo_singolo DECIMAL(10, 2) NOT NULL,
);

CREATE TABLE segnalazioni (
    id SERIAL PRIMARY KEY NOT NULL,
    id_utente INTEGER REFERENCES utenti(id) ON DELETE CASCADE,
    titolo VARCHAR(255) NOT NULL,
    messaggio TEXT NOT NULL,
    stato VARCHAR(50) DEFAULT 'nuova' CHECK (stato IN ('nuova', 'in lavorazione', 'risolta', 'archiviata')),
    data_invio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_risoluzione TIMESTAMP,
    id_admin INTEGER REFERENCES utenti(id) ON DELETE SET NULL
);