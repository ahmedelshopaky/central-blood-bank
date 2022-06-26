CREATE TYPE BLOOD AS ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-');

CREATE TABLE blood_stocks (
    blood_type BLOOD NOT NULL,
    expiration_date DATE NOT NULL,
    blood_bank_id INT REFERENCES blood_banks(id) NOT NULL,
    id SERIAL PRIMARY KEY NOT NULL,
    donor_national_id VARCHAR(14) REFERENCES donors(national_id) NOT NULL
);
