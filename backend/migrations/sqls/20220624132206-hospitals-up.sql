CREATE TABLE hospitals (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL UNIQUE,
    city VARCHAR(50) NOT NULL
);
