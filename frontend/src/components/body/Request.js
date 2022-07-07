import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./../../network/axios";
import { bloodTypes } from "./Donate";

const patientStatus = ["normal", "urgent", "immediate"];
export default function Request() {
  const navigate = useNavigate();

  const [hospitals, setHospitals] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [form, setForm] = useState({
    patientStatus: "",
    bloodType: "",
    quantity: "",
    hospitalId: "",
  });
  const [errors, setErrors] = useState({
    patientStatus: "This field is required",
    bloodType: "This field is required",
    quantity: "This field is required",
    hospitalId: "This field is required",
  });

  useEffect(() => {
    getHospitals();
  }, []);

  useEffect(() => {
    const errArr = [];
    Object.values(errors).forEach((err) => {
      if (err !== null) {
        errArr.push(err);
      }
    });
    if (errArr.length > 0) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
    console.log(errors);
  }, [errors]);

  const sendRequest = () => {
    axiosInstance
      .post("request", form)
      .then((response) => {
        alert("Request sent successfully");
        navigate("/");
      })
      .catch((error) => {
        alert("Error sending request");
        console.log(error);
      });
  };

  const getHospitals = () => {
    axiosInstance
      .get("/hospitals")
      .then((response) => {
        setHospitals(response.data.Data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (isValid) {
      sendRequest();
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    switch (e.target.name) {
      case "patientStatus":
        setErrors({
          ...errors,
          patientStatus:
            e.target.value.length === 0
              ? "This field is required"
              : parseInt(e.target.value) === -1
              ? "Invalid blood type"
              : null,
        });
        break;

      case "bloodType":
        setErrors({
          ...errors,
          bloodType:
            e.target.value.length === 0
              ? "This field is required"
              : parseInt(e.target.value) === -1
              ? "Invalid blood type"
              : null,
        });
        break;

      case "quantity":
        setErrors({
          ...errors,
          quantity:
            e.target.value.length === 0
              ? "This field is required"
              : e.target.value < 1
              ? "Invalid quantity value"
              : null,
        });
        break;

      case "hospitalId":
        setErrors({
          ...errors,
          hospitalId:
            e.target.value.length === 0
              ? "This field is required"
              : e.target.value < 1
              ? "Invalid hospital id"
              : null,
        });
        break;

      default:
        break;
    }
  }; // end handleChange

  return (
    <div className="card w-75 mx-auto shadow p-5 m-5">
      <div className="text-center mb-5">
        <h1>Request</h1>
      </div>
      <div>
        <div className="form-group input-group mb-4">
          <div className="form-group input-group mb-4">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-syringe p-1 m-auto"></i>
              </span>
            </div>
            <select
              value={form.bloodType}
              onChange={handleChange}
              className="form-select"
              name="bloodType"
            >
              <option value="-1">Blood Type</option>
              {bloodTypes.map((bloodType, index) => {
                return (
                  <option value={bloodType} key={index}>
                    {bloodType}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="fa fa-user p-1 m-auto"></i>
            </span>
          </div>
          <select
            value={form.patientStatus}
            onChange={handleChange}
            className="form-select"
            name="patientStatus"
          >
            <option value="-1">Patient Status</option>
            {patientStatus.map((status, index) => {
              return (
                <option value={status} key={index}>
                  {status}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-group input-group mb-4">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="fa fa-solid fa-id-badge p-1 m-auto"></i>
            </span>
          </div>
          <input
            onChange={handleChange}
            name="quantity"
            className="form-control"
            placeholder="Quantity"
            type="number"
          />
        </div>
        <div className="form-group input-group mb-4">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="fa fa-solid fa-hospital p-1 m-auto"></i>
            </span>
          </div>
          <select
            onChange={handleChange}
            className="form-select"
            name="hospitalId"
          >
            <option value="-1">Hospital</option>
            {hospitals.map((hospital) => {
              return (
                <option value={hospital.id} key={hospital.id}>
                  {hospital.name} - {hospital.city}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="form-group text-center">
        <button
          type="submit"
          className="my-btn btn btn-dark w-100"
          onClick={handleClick}
          disabled={!isValid}
        >
          Request
        </button>
      </div>
    </div>
  );
}
