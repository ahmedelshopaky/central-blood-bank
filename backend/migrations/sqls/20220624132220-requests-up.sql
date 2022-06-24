CREATE TYPE PATIENT_STATUS AS ENUM('immediate', 'urgent', 'normal');
CREATE TYPE REQUEST_STATUS AS ENUM('pending', 'approved', 'rejected');

CREATE TABLE requests (
    id SERIAL PRIMARY KEY NOT NULL,
    patient_status PATIENT_STATUS NOT NULL,
    blood_type BLOOD NOT NULL,
    quantity INT NOT NULL,
    request_status REQUEST_STATUS NOT NULL,
    hospital_id INT REFERENCES hospitals(id) NOT NULL ON DELETE CASCADE,
    blood_stock_id INT REFERENCES blood_stock(id)
);
