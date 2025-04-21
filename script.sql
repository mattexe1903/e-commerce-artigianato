CREATE TABLE utenti (
    id SERIAL PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL,
    cognome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    ruolo TEXT NOT NULL CHECK (ruolo IN ('admin', 'cliente', 'artigiano'))
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

CREATE TABLE prodotti (
    id SERIAL PRIMARY KEY NOT NULL,
    nome TEXT NOT NULL,
    foto TEXT NOT NULL,  -- corretto IMG -> TEXT
    descrizione TEXT NOT NULL,
    prezzo DECIMAL(10, 2) NOT NULL,
    quantita INT NOT NULL,
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE preferiti (
  idUtente INTEGER REFERENCES utenti(id),
  idProdotto INTEGER REFERENCES prodotti(id),
  PRIMARY KEY (idUtente, idProdotto)
);

CREATE TABLE artigiani (
    idUtente INTEGER REFERENCES utenti(id),
    iban TEXT NOT NULL,  -- meglio usare TEXT per evitare problemi con numeri grandi
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
    indirizzo INTEGER REFERENCES indirizzo(id)
);

CREATE TABLE ordine_prodotti (
    idOrdine INTEGER REFERENCES ordine(id),
    idProdotto INTEGER REFERENCES prodotti(id),
    quantita INTEGER NOT NULL,
    PRIMARY KEY (idOrdine, idProdotto)
);