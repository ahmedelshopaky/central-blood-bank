CREATE TABLE donors (
    id SERIAL PRIMARY KEY NOT NULL,
    national_id VARCHAR(14) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    last_donation DATE
);
