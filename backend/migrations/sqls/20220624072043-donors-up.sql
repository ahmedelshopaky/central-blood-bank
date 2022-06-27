CREATE TYPE BLOOD AS ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-');

CREATE TABLE donors (
    id SERIAL PRIMARY KEY NOT NULL,
    national_id VARCHAR(14) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    city VARCHAR(50),
    email VARCHAR(50) NOT NULL UNIQUE,
    last_donation DATE,
    blood_type BLOOD NOT NULL
);
