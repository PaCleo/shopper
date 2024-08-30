CREATE TABLE IF NOT EXISTS customers (
    customer_code VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE measure_type_enum AS ENUM ('W', 'G');

CREATE TABLE IF NOT EXISTS measures (
    id SERIAL PRIMARY KEY,
    measure_uuid VARCHAR(255) UNIQUE NOT NULL,
    customer_code VARCHAR(255) NOT NULL,
    measure_datetime TIMESTAMP,
    measure_type measure_type_enum,
    measure_value INT NOT NULL,
    has_confirmed BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMP,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_code) REFERENCES customers(customer_code)
);

INSERT INTO customers
    (customer_code)
VALUES
    ('123456'),
    ('654321'),
    ('111111');