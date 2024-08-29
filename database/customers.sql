CREATE TABLE IF NOT EXISTS customers (
    customer_code SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE measure_type_enum AS ENUM ('W', 'G');

CREATE TABLE IF NOT EXISTS measures (
    id SERIAL PRIMARY KEY,
    measure_uuid VARCHAR(255) NOT NULL,
    customer_code INT,
    measure_datetime TIMESTAMP,
    measure_type measure_type_enum,
    measure_value INT,
    has_confirmed BOOLEAN,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_code) REFERENCES customers(customer_code)
);

CREATE TABLE IF NOT EXISTS measure_corrections (
    id SERIAL PRIMARY KEY,
    measure_uuid VARCHAR(255) NOT NULL,
    confirmed_value INT,
    confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (measure_uuid) REFERENCES measures(measure_uuid)
);

INSERT INTO customers(name, email) VALUES ('test', 'test@me.com');