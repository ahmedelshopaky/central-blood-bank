CREATE TYPE BLOOD AS ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-');

CREATE TABLE blood_stock (
    blood_type BLOOD NOT NULL,
    expiration_date DATE NOT NULL,
    bank_city VARCHAR(50) NOT NULL,
    id SERIAL PRIMARY KEY NOT NULL,
    donor_id INT REFERENCES donors(id) NOT NULL
);
