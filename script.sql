CREATE TABLE utenti (
    id SERIAL PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL,
    cognome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    ruolo TEXT NOT NULL CHECK (ruolo IN ('admin', 'cliente', 'artigiano')),
    preferiti INTEGER[]
);

CREATE TABLE prodotti (
    id SERIAL PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL,
    foto IMG NOT NULL,
    descrizione TEXT NOT NULL,
    prezzo DECIMAL(10, 2) NOT NULL,
    quantita INT NOT NULL,
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artigiani (
    idUtente INTEGER REFERENCES utenti(id),
    iban INTEGER NOT NULL,
    mestiere TEXT NOT NULL
);

CREATE TABLE carrello (
    id SERIAL PRIMARY KEY NOT NULL,
    idUtente INTEGER REFERENCES utenti(id),
    idProdotto INTEGER REFERENCES prodotti(id),
    quantita INT NOT NULL CHECK (quantita > 0),
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ordine (
    id SERIAL PRIMARY KEY NOT NULL,
    idUtente INTEGER REFERENCES utenti(id),
    data_ordine TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stato TEXT NOT NULL CHECK (stato IN ('in attesa', 'in lavorazione', 'completato', 'annullato')),
    totale DECIMAL(10, 2) NOT NULL,
    indirizzo INTEGER REFERENCES indirizzo(id),
    prodotti INTEGER[] NOT NULL
);

CREATE TABLE indirizzo (
    id SERIAL PRIMARY KEY NOT NULL,
    idUtente INTEGER REFERENCES utenti(id),
    via TEXT NOT NULL,
    citta TEXT NOT NULL,
    cap TEXT NOT NULL,
    provincia TEXT NOT NULL,
    nazione TEXT NOT NULL
);