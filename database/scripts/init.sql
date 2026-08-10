BEGIN TRANSACTION;
  CREATE TABLE IF NOT EXISTS "user" (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    email VARCHAR(80) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    avatar TEXT,
    deletion_date TIMESTAMP DEFAULT NULL
  );

  CREATE TABLE IF NOT EXISTS event (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(80) NOT NULL,
    image TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    iban VARCHAR(35) NOT NULL
  );

  DO $$ BEGIN
      CREATE TYPE membership_role AS ENUM (
        'host',
        'cashier',
        'guest'
      );
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;

  CREATE TABLE IF NOT EXISTS membership (
    user_id INT REFERENCES "user"(id),
    event_id INT REFERENCES event(id) ON DELETE CASCADE,
    role membership_role NOT NULL DEFAULT 'guest',

    CONSTRAINT pk_membership PRIMARY KEY (user_id, event_id)
  );

  CREATE TABLE IF NOT EXISTS vat (
    "type" CHAR(1) PRIMARY KEY,
    rate SMALLINT NOT NULL,
    deletion_date TIMESTAMP DEFAULT NULL,

    CONSTRAINT chk_rate CHECK (rate >= 0 AND rate <= 100)
  );

  CREATE TABLE IF NOT EXISTS category (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    vat_type CHAR(1) NOT NULL REFERENCES vat("type"),
    picture TEXT NOT NULL,
    deletion_date TIMESTAMP DEFAULT NULL
  );

  CREATE TABLE IF NOT EXISTS product (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    label VARCHAR(80) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    excl_vat_price MONEY NOT NULL,
    deletion_date TIMESTAMP DEFAULT NULL,
    picture TEXT,
    category_id INT NOT NULL REFERENCES category(id),
    event_id INT REFERENCES event(id),

    CONSTRAINT chk_price CHECK (excl_vat_price >= 0::MONEY)
  );

  CREATE TABLE IF NOT EXISTS purchase (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL REFERENCES "user"(id),
    is_served BOOLEAN NOT NULL DEFAULT FALSE
  );

  CREATE TABLE IF NOT EXISTS order_line (
    product_id INT REFERENCES product(id),
    purchase_id INT REFERENCES purchase(id) ON DELETE CASCADE,
    quantity SMALLINT NOT NULL,
    price MONEY NOT NULL,

    CONSTRAINT pk_order_line PRIMARY KEY (product_id, purchase_id),
    CONSTRAINT chk_price CHECK (price >= 0::MONEY),
    CONSTRAINT chk_quantity CHECK (quantity != 0)
  );
COMMIT;