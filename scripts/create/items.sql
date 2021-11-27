CREATE TABLE items (
    id SERIAL UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    type TEXT,
    price INTEGER,
    original_price INTEGER,
    expiration_date TEXT,
    note TEXT,
    seller_id INTEGER NOT NULL,
    buyer_id INTEGER DEFAULT NULL,
    shop_lat TEXT NOT NULL,
    shop_long TEXT NOT NULL,
    conformation INTEGER DEFAULT NULL
);