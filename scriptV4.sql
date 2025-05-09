-- Script per la creazione delle tabelle per un sistema di gestione di un e-commerce

--Creazione della tabella per la gestione dei ruoli con i relativi inserimenti inziali.
CREATE TABLE roles
(
    role_id SERIAL PRIMARY KEY NOT NULL,
    role_name TEXT NOT NULL UNIQUE
);

INSERT INTO roles
    (role_name)
VALUES
    ('admin'),
    ('users'),
    ('artisan');

--Creazione della tabella per la gestione dei permessi con i relativi inserimenti inziali.
CREATE TABLE permissions
(
    permission_id SERIAL PRIMARY KEY NOT NULL,
    permission_name TEXT NOT NULL UNIQUE
);

INSERT INTO permissions
    (permission_name)
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
CREATE TABLE roles_permissions
(
    permission_id INTEGER REFERENCES permissions(permission_id),
    role_id INTEGER REFERENCES roles(role_id),
    permission_type CHAR,
    PRIMARY KEY (permission_id, role_id)
);

-- TO DO BETTER:
INSERT INTO roles_permissions
    (permission_id, role_id, permission_type)
values
    (1, 1, 'W'),
    (1, 2, 'W'),
    (1, 3, 'W');

--Creazione della tabella per la gestione degli utenti con i relativi inserimentO inziale dell'admin.
CREATE TABLE users
(
    user_id SERIAL PRIMARY KEY NOT NULL,
    user_name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_role INT REFERENCES roles(role_id) NOT NULL
);

INSERT INTO users
    (user_name, surname, email, user_password, user_role)
VALUES
    ('Mario', 'Rossi', 'mario.rossi@gmail.com', 'password123', 2),
    ('Admin', 'Admin', 'admin@gmail.com', 'admin123', 1),
    ('Giovanni', 'Verdi', 'artigiano@gmail.com', 'password123', 3);


CREATE TABLE states(
    state_id SERIAL PRIMARY KEY NOT NULL,
    state_name TEXT NOT NULL UNIQUE
);

INSERT INTO states
    (state_name)
VALUES
    ('in attesa'),
    ('accettato'),
    ('rifiutato'),
    ('completato'),
    ('annullato'),
    ('nuova'),
    ('in lavorazione'),
    ('risolta'),
    ('archiviata');

-- Creazione della tabella per la gestione delle informazioni extra per gli artigiani.
CREATE TABLE info_artisan(
    artisan_id INTEGER REFERENCES users(user_id) PRIMARY KEY,
    iban TEXT NOT NULL,
    craft TEXT NOT NULL, 
    artisan_state INTEGER REFERENCES states(state_id)
);

-- Creazione della tabella per la gestione delle informazioni di spedizione
CREATE TABLE address
(
    addres_id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES users(user_id),
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    cap TEXT NOT NULL,
    province TEXT NOT NULL,
    country TEXT NOT NULL
);

-- Creazione della tabella per la gestione dei prodotti
CREATE TABLE products
(
    product_id SERIAL PRIMARY KEY NOT NULL,
    product_name TEXT NOT NULL,
    photo TEXT NOT NULL,
    photo_description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    category_id INTEGER REFERENCES categories(category_id),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserimento di dati fittizzi per la tabella dei prodotti
INSERT INTO products (product_name, photo, photo_description, price, quantity, category_id)
VALUES
('Smartphone Galaxy X10', '/images/1.jpg', 'Smartphone con display AMOLED da 6.5 pollici', 699.99, 50, 1),
('Laptop UltraBook Z5', '/images/2.jpg', 'Laptop leggero con processore Intel i7', 1299.00, 30, 2),
('Auricolari Wireless Pro', '/images/3.jpg', 'Auricolari Bluetooth con cancellazione del rumore', 149.90, 100, 3),
('Smartwatch Fit360', '/images/4.jpg', 'Orologio smart per il monitoraggio della salute', 199.50, 75, 4),
('Monitor 4K Vision27', '/images/5.jpg', 'Monitor 4K UHD da 27 pollici con HDR', 379.99, 40, 2),
('Tastiera Meccanica RGB', '/images/6.jpg', 'Tastiera da gaming con retroilluminazione RGB', 89.00, 60, 5),
('Mouse Ergonomico Pro', '/images/7.jpg', 'Mouse ergonomico per utilizzo prolungato', 49.95, 80, 5),
('Tablet MediaTab 10', '/images/8.jpg', 'Tablet da 10 pollici con sistema Android', 299.99, 45, 1),
('Cuffie Over-Ear Studio', '/images/9.jpg', 'Cuffie ad alta fedeltà per uso professionale', 219.99, 25, 3),
('Webcam Full HD ZoomCam', '/images/10.jpg', 'Webcam 1080p con microfono integrato', 79.99, 35, 4);


-- Creazione della tabella per la gestione delle categorie
CREATE TABLE categories
(
    category_id SERIAL PRIMARY KEY NOT NULL,
    category_name TEXT NOT NULL UNIQUE
);

INSERT INTO categories (category_name) VALUES
('Gioielli'),
('Ceramica e Terracotta'),
('Lavorazione del Legno'),
('Tessili e Ricami'),
('Accessori Moda'),
('Saponi e Cosmetici Naturali'),
('Carta e Cartoleria'),
('Decorazioni per la Casa'),
('Candele Artigianali'),
('Vetri Artistici'),
('Oggetti in Cuoio'),
('Bambole e Peluche Fatti a Mano'),
('Arte e Dipinti'),
('Mobili Artigianali'),
('Strumenti Musicali Fatti a Mano');


-- Creazione della tabella per la gestione dei prodotti preferiti
CREATE TABLE favorites
(
    user_id INTEGER REFERENCES users(user_id),
    product_id INTEGER REFERENCES products(product_id),
    PRIMARY KEY (user_id, product_id)
);

-- Creazione della tabella per la gestione dei carrelli
CREATE TABLE carts
(
    cart_id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES users(user_id),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creazione della tabella per la gestione dei prodotti nel carrello
CREATE TABLE carts_products
(
    carts_products_id SERIAL PRIMARY KEY NOT NULL,
    cart_id INTEGER REFERENCES carts(cart_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creazione della tabella per la gestione degli ordini
CREATE TABLE orders
(
    order_id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES users(user_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_state INTEGER REFERENCES states(state_id),
    total DECIMAL(10, 2) NOT NULL,
    addres_id INTEGER REFERENCES address(addres_id)
);

-- Creazione della tabella per la gestione dei prodotti negli ordini
CREATE TABLE orders_products
(
    orders_products_id SERIAL PRIMARY KEY NOT NULL,
    order_id INTEGER REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    single_price DECIMAL(10, 2) NOT NULL
);

-- Creazione della tabella per la gestione delle segnalazioni
CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY NOT NULL,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    report_message TEXT NOT NULL,
    report_state INTEGER REFERENCES states(state_id),
    sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolution_date TIMESTAMP,
    admin_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL
);