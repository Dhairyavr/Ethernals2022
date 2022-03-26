import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dboard.css";

const Dtitle = ({ title, myprojects }) => {
  const navigate = useNavigate();
  console.log(myprojects);
  return (
    <div>
      <section
        className="page-title-area"
        style={{
          backgroundImage: "url(assets/img/bg/page-title-bg.jpg)",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-10 offset-xl-1">
              <div className="page-title-wrapper text-center">
                <h1
                  className="page-title wow fadeInUp2 animated"
                  data-wow-delay=".1s"
                >
                  {title}
                </h1>
              </div>
              <ul
                className="breadcrumb-list wow fadeInUp2 animated"
                data-wow-delay=".3s"
                style={{ justifyContent: "center", display: "flex" }}
              >
                <li
                  style={{
                    fontSize: "24px",
                    color: "white",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/dashboard")}
                >
                  Home {"\u00A0"}
                  {"\u00A0"}|{" "}
                </li>
                <li
                  style={{
                    fontSize: "24px",
                    color: "white",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/myprojects")}
                >
                  My Projects {"\u00A0"}
                  {"\u00A0"}|
                </li>
                <li
                  style={{
                    fontSize: "24px",
                    color: "white",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/mycontributions")}
                >
                  My Contributions
                </li>
              </ul>{" "}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dtitle;
