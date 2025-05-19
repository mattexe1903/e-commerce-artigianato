-- 1. Tabella Roles
CREATE TABLE roles
(
    role_id SERIAL PRIMARY KEY,
    role_name TEXT NOT NULL UNIQUE
);

-- 2. Tabella States
CREATE TABLE states
(
    state_id SERIAL PRIMARY KEY,
    state_name TEXT NOT NULL UNIQUE
);

-- 3. Tabella Users
CREATE TABLE users
(
    user_id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_role INTEGER,
    FOREIGN KEY (user_role) REFERENCES roles(role_id)
);

-- 4. Tabella Categories
CREATE TABLE categories
(
    category_id SERIAL PRIMARY KEY,
    category_name TEXT NOT NULL UNIQUE
);

-- 5. Tabella Address
CREATE TABLE address
(
    addres_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    street_address TEXT NOT NULL,
    city TEXT NOT NULL,
    cap TEXT NOT NULL,
    province TEXT NOT NULL,
    country TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 6. Tabella Carts
CREATE TABLE carts
(
    cart_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 7. Tabella Products
CREATE TABLE products
(
    product_id SERIAL PRIMARY KEY,
    product_name TEXT NOT NULL,
    photo TEXT NOT NULL,
    photo_description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    category_id INTEGER,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 8. Tabella Favorites
CREATE TABLE favorites
(
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 9. Tabella Info_Artisan
CREATE TABLE info_artisan
(
    artisan_id INTEGER PRIMARY KEY,
    iban TEXT NOT NULL,
    craft TEXT NOT NULL,
    artisan_state INTEGER,
    FOREIGN KEY (artisan_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (artisan_state) REFERENCES states(state_id)
);

-- 10. Tabella Inventory
CREATE TABLE inventory
(
    product_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 11. Tabella Orders
CREATE TABLE orders
(
    order_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_state INTEGER,
    total NUMERIC(10, 2) NOT NULL,
    address_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES address(addres_id),
    FOREIGN KEY (order_state) REFERENCES states(state_id)
);

-- 12. Tabella Orders_Products
CREATE TABLE orders_products
(
    orders_products_id SERIAL PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    single_price NUMERIC(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 13. Tabella Carts_Products
CREATE TABLE carts_products
(
    carts_products_id SERIAL PRIMARY KEY,
    cart_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- 14. Tabella Reports
CREATE TABLE reports
(
    report_id SERIAL PRIMARY KEY,
    user_id INTEGER,
    title VARCHAR(255) NOT NULL,
    report_message TEXT NOT NULL,
    report_state INTEGER,
    sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    admin_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (report_state) REFERENCES states(state_id)
);

-- popolamento iniziale delle tabelle
INSERT INTO roles
    (role_id, role_name)
VALUES
    (1, 'admin'),
    (2, 'users'),
    (3, 'artisan');

INSERT INTO states
    (state_id, state_name)
VALUES
    (1, 'in attesa'),
    (2, 'accettato'),
    (3, 'rifiutato'),
    (4, 'completato'),
    (5, 'annullato'),
    (6, 'nuova'),
    (7, 'in lavorazione'),
    (8, 'risolta'),
    (9, 'archiviata');

INSERT INTO categories
    (category_id, category_name)
VALUES
    (1, 'Gioielli'),
    (2, 'Ceramica e Terracotta'),
    (3, 'Lavorazione del Legno'),
    (4, 'Tessili e Ricami'),
    (5, 'Accessori Moda'),
    (6, 'Saponi e Cosmetici Naturali'),
    (7, 'Carta e Cartoleria'),
    (8, 'Decorazioni per la Casa'),
    (9, 'Candele Artigianali'),
    (10, 'Vetri Artistici'),
    (11, 'Oggetti in Cuoio'),
    (12, 'Bambole e Peluche Fatti a Mano'),
    (13, 'Arte e Dipinti'),
    (14, 'Mobili Artigianali'),
    (15, 'Strumenti Musicali Fatti a Mano');

INSERT INTO products
    (product_id, product_name, photo, photo_description, price, quantity, category_id, creation_date)
VALUES
    (1, 'Borsa in Pelle Fatto a Mano', '/images/1.jpg', 'Borsa artigianale realizzata in vera pelle italiana', 85.99, 12, 1, '2025-05-09 11:27:56'),
    (2, 'Scultura in Legno di Ulivo', '/images/2.jpg', 'Scultura decorativa intagliata a mano da legno d’ulivo', 129.00, 5, 2, '2025-05-09 11:27:56'),
    (3, 'Orecchini in Ceramica Raku', '/images/3.jpg', 'Orecchini fatti a mano con tecnica raku tradizionale', 49.90, 20, 3, '2025-05-09 11:27:56'),
    (4, 'Tovaglia Ricamata a Mano', '/images/4.jpg', 'Tovaglia in lino con ricami floreali artigianali', 99.50, 8, 4, '2025-05-09 11:27:56'),
    (5, 'Cornice Artistica Dipinta', '/images/5.jpg', 'Cornice in legno dipinta a mano con motivi floreali', 39.99, 15, 2, '2025-05-09 11:27:56'),
    (6, 'Candela Profumata Naturale', '/images/6.jpg', 'Candela artigianale a base di cera di soia e oli essenziali', 19.00, 30, 5, '2025-05-09 11:27:56'),
    (7, 'Vaso in Ceramica Smaltato', '/images/7.jpg', 'Vaso decorativo modellato e smaltato a mano', 59.95, 10, 2, '2025-05-09 11:27:56'),
    (8, 'Taccuino in Carta Riciclata', '/images/8.jpg', 'Taccuino fatto a mano con copertina in tessuto', 24.99, 18, 1, '2025-05-09 11:27:56'),
    (9, 'Portagioie in Legno Intarsiato', '/images/9.jpg', 'Scatola portagioie realizzata con intarsi lignei artigianali', 69.99, 6, 3, '2025-05-09 11:27:56'),
    (10, 'Quadro ad Acquerello', '/images/10.jpg', 'Dipinto originale su carta realizzato con tecnica ad acquerello', 79.99, 4, 4, '2025-05-09 11:27:56');