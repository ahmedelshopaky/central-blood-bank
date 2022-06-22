CREATE TYPE BLOOD AS ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-');

CREATE TABLE blood_stock (
    id SERIAL PRIMARY KEY NOT NULL,
    donor_id INT REFERENCES donors(id),
    date DATE NOT NULL,
    blood_type BLOOD NOT NULL,
    bank_city VARCHAR(50) NOT NULL
);
