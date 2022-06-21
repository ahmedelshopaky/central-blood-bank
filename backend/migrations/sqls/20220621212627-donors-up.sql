CREATE TABLE donors (
    id SERIAL PRIMARY KEY NOT NULL,
    nationalId VARCHAR(14) NOT NULL,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    lastDonation DATE NULL
);