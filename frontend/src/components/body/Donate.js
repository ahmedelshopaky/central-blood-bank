import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axiosInstance from "./../../network/axios";
import { nameRegExp, nationalIdRegExp } from "./Register";

export default function Donate() {
  // const navigate = useNavigate();

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const [bloodBanks, setBloodBanks] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [form, setForm] = useState({
    bloodType: "",
    bloodBankId: "",
    name: "",
    donorNationalId: "",
    bloodVirusTest: "",
  });
  const [errors, setErrors] = useState({
    bloodType: "This field is required",
    bloodBankId: "This field is required",
    name: "This field is required",
    donorNationalId: "This field is required",
    bloodVirusTest: "This field is required",
  });

  useEffect(() => {
    getBloodBaks();
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
  }, [errors]);

  const sendRequest = () => {
    axiosInstance
      .post("donate", form)
      .then((response) => {
        // navigate("/");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const getBloodBaks = () => {
    axiosInstance
      .get("/blood-banks")
      .then((response) => {
        setBloodBanks(response.data.Data);
      })
      .catch((error) => {
        console.log(error.response.data);
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
      case "name":
        setErrors({
          ...errors,
          name:
            e.target.value.length === 0
              ? "This field is required"
              : !e.target.value.match(nameRegExp) ||
                e.target.value.length < 5 ||
                e.target.value > 50
              ? "Invalid name"
              : null,
        });
        break;

      case "donorNationalId":
        setErrors({
          ...errors,
          donorNationalId:
            e.target.value.length === 0
              ? "This field is required"
              : !e.target.value.match(nationalIdRegExp)
              ? "Invalid national id"
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

      case "bloodBankId":
        setErrors({
          ...errors,
          bloodBankId:
            e.target.value.length === 0
              ? "This field is required"
              : parseInt(e.target.value) === -1
              ? "Invalid blood bank"
              : null,
        });
        break;

      case "bloodVirusTest":
        setErrors({
          ...errors,
          bloodVirusTest:
            e.target.value.length === 0
              ? "This field is required"
              : parseInt(e.target.value) === -1
              ? "Invalid blood virus test"
              : null,
        });
        break;

      default:
        break;
    }
  }; // end handleChange

  return (
    <div className="card w-75 mx-auto shadow p-5 mt-5">
      <div className="text-center mb-5">
        <h1>Donate</h1>
      </div>
      <div>
        <div className="form-group input-group mb-4">
          <div className="form-group input-group mb-4">
            <div className="input-group-prepend w-25">
              <span className="input-group-text">
                <i className="fa fa-syringe p-1 m-auto"></i>
              </span>
            </div>
            <select
              onChange={handleChange}
              className="form-select"
              name="bloodType"
            >
              <option value="-1">Blood Type</option>
              {bloodTypes.map((bloodType) => {
                return (
                  <option value={bloodType} key={bloodType}>
                    {bloodType}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="input-group-prepend w-25">
            <span className="input-group-text">
              <i className="fa fa-solid fa-hospital p-1 m-auto"></i>
            </span>
          </div>
          <select
            onChange={handleChange}
            className="form-select"
            name="bloodBankId"
          >
            <option value="-1">Blood Bank</option>
            {bloodBanks.map((bloodBank) => {
              return (
                <option value={bloodBank.id} key={bloodBank.id}>
                  {bloodBank.name} - {bloodBank.city}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-group input-group mb-4">
          <div className="form-group input-group mb-4">
            <div className="input-group-prepend w-25">
              <span className="input-group-text">
                <i className="fa fa-user p-1 m-auto"></i>
              </span>
            </div>
            <input
              onChange={handleChange}
              name="name"
              className="form-control"
              placeholder="Donor Name"
              type="text"
            />
          </div>
          <div className="input-group-prepend w-25">
            <span className="input-group-text">
              <i className="fa fa-solid fa-id-badge p-1 m-auto"></i>
            </span>
          </div>
          <input
            onChange={handleChange}
            name="donorNationalId"
            className="form-control"
            placeholder="National ID"
            type="number"
          />
        </div>
        <div className="form-group input-group mb-4">
          <div className="input-group-prepend w-25">
            <span className="input-group-text">
              <i className="fa fa-solid fa-microscope p-1 m-auto"></i>
            </span>
          </div>
          <select
            className="form-select"
            onChange={handleChange}
            name="bloodVirusTest"
          >
            <option value="-1">Blood Virus Test</option>
            <option value="positive">Positive (+ve)</option>
            <option value="negative">Negative (-ve)</option>
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
          Donate
        </button>
      </div>
    </div>
  );
}
