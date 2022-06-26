import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className="navbar fixed-top navbar-expand-sm navbar-light bg-light px-5 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Central Blood Bank
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav w-100 d-flex justify-content-between">
            <div className="d-flex flex-row">
              <Link
                className="nav-link active"
                aria-current="page"
                to="register"
              >
                Register
              </Link>
              <Link
                className="nav-link active"
                aria-current="page"
                to="donate"
              >
                Donate
              </Link>
              <Link
                className="nav-link active"
                aria-current="page"
                to="request"
              >
                Request
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
