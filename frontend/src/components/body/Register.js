import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./../../network/axios";
import { bloodTypes } from "./Donate";

export const emailRegExp = /(.+)@(.+){2,}\.(.+){2,}/;
export const nameRegExp = /^[a-zA-Z ]+$/;
export const nationalIdRegExp =
  /^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$/;
const dateRegExp = /^\d{4}[/-](0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])$/;

export default function Register() {
  const navigate = useNavigate();

  const [donatedBerfore, setDonatedBerfore] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [form, setForm] = useState({
    name: "",
    nationalId: "",
    email: "",
    city: "",
    // lastDonation: null,
    bloodType: "",
  });
  const [errors, setErrors] = useState({
    name: "This field is required",
    nationalId: "This field is required",
    email: "This field is required",
    city: "This field is required",
    bloodType: "",
  });
  const [errorsLabels, setErrorsLabels] = useState({
    name: "",
    nationalId: "",
    email: "",
    city: "",
    bloodType: "",
  });

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
      .post("register", form)
      .then((response) => {
        alert("Successfully registered");
        navigate("/");
      })
      .catch((error) => {
        alert("Error registering");
        console.log(error);
      });
  };

  const handleBlur = (e) => {
    switch (e.target.name) {
      case "name":
        setErrorsLabels({ ...errorsLabels, name: errors.name });
        break;
      case "nationalId":
        setErrorsLabels({
          ...errorsLabels,
          nationalId: errors.nationalId,
        });
        break;
      case "email":
        setErrorsLabels({ ...errorsLabels, email: errors.email });
        break;
      case "city":
        setErrorsLabels({ ...errorsLabels, city: errors.city });
        break;
      case "bloodType":
        setErrorsLabels({ ...errorsLabels, bloodType: errors.bloodType });
        break;
      case "lastDonation":
        setErrorsLabels({
          ...errorsLabels,
          lastDonation: errors.lastDonation,
        });
        break;
      default:
        break;
    }
    console.log(errorsLabels);
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

      case "nationalId":
        setErrors({
          ...errors,
          nationalId:
            e.target.value.length === 0
              ? "This field is required"
              : !e.target.value.match(nationalIdRegExp)
              ? "Invalid national id"
              : null,
        });
        break;

      case "email":
        setErrors({
          ...errors,
          email:
            e.target.value.length === 0
              ? "This field is required"
              : !e.target.value.match(emailRegExp)
              ? "Invalid E-mail"
              : null,
        });
        break;

      case "city":
        setErrors({
          ...errors,
          city:
            e.target.value.length === 0
              ? "This field is required"
              : !e.target.value.match(nameRegExp) ||
                e.target.value.length < 5 ||
                e.target.value > 50
              ? "Invalid city name"
              : null,
        });
        break;

      case "checkbox":
        setDonatedBerfore(!donatedBerfore);
        if (!donatedBerfore) {
          setErrors({
            ...errors,
            lastDonation: "This field is required",
          });
        }
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

      case "lastDonation":
        setErrors({
          ...errors,
          lastDonation:
            e.target.value.length === 0
              ? "This field is required"
              : !e.target.value.match(dateRegExp)
              ? "Invalid date"
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
        <h1>Register</h1>
      </div>
      <div>
        <div>
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-solid fa-id-badge p-1 m-auto"></i>
              </span>
            </div>
            <input
              onBlur={handleBlur}
              onChange={handleChange}
              name="nationalId"
              className="form-control"
              placeholder="National ID"
              type="number"
            />
          </div>
          <span className="text-danger">{errorsLabels.nationalId} &nbsp;</span>
        </div>
        <div>
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-user p-1 m-auto"></i>
              </span>
            </div>
            <input
              onChange={handleChange}
              onBlur={handleBlur}
              name="name"
              className="form-control"
              placeholder="Name"
              type="text"
            />
          </div>
          <span className="text-danger">{errorsLabels.name} &nbsp;</span>
        </div>
        <div>
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-solid fa-envelope p-1 m-auto"></i>
              </span>
            </div>
            <input
              onChange={handleChange}
              onBlur={handleBlur}
              name="email"
              className="form-control"
              placeholder="E-mail"
              type="email"
            />
          </div>
          <span className="text-danger">{errorsLabels.email} &nbsp;</span>
        </div>
        <div>
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-solid fa-home p-1 m-auto"></i>
              </span>
            </div>
            <input
              onChange={handleChange}
              onBlur={handleBlur}
              name="city"
              className="form-control"
              placeholder="City"
              type="text"
            />
          </div>
          <span className="text-danger">{errorsLabels.city} &nbsp;</span>
        </div>
        <div>
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-syringe p-1 m-auto"></i>
              </span>
            </div>
            <select
              value={form.bloodType}
              onChange={handleChange}
              onBlur={handleBlur}
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
          <span className="text-danger">{errorsLabels.bloodType} &nbsp;</span>
        </div>

        <div className="form-group input-group mb-1">
          <input
            name="checkbox"
            className="form-check-input mx-1"
            type="checkbox"
            value=""
            id="flexCheckDefault"
            onChange={handleChange}
          />
          <label className="form-check-label mx-1" htmlFor="flexCheckDefault">
            Have you donated before?
          </label>
        </div>
        <div className="mb-1" hidden={!donatedBerfore}>
          <div className="form-group input-group">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <span className="m-auto">Last Donation</span>
              </span>
            </div>
            <input
              onChange={handleChange}
              onBlur={handleBlur}
              name="lastDonation"
              className="form-control"
              placeholder="Last Donation"
              type="date"
              // disabled={!donatedBerfore}
            />
          </div>
          <span className="text-danger">{errorsLabels.lastDonation} &nbsp;</span>
        </div>
      </div>
      <div className="form-group text-center">
        <button
          type="submit"
          className="my-btn btn btn-dark w-100"
          onClick={handleClick}
          disabled={!isValid}
        >
          Register
        </button>
      </div>
    </div>
  );
}
