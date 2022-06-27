CREATE TABLE cities_distances (
    id SERIAL PRIMARY KEY NOT NULL,
    hospital_id INT REFERENCES hospitals(id) NOT NULL,
    blood_bank_id INT REFERENCES blood_banks(id) NOT NULL,
    distance INT NOT NULL
);
