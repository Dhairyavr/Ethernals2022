import React, { useState, useEffect } from "react";
import web3 from "../Ethereum/web3";
import Ethqf from "../Ethereum/eth_qf";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import defaultuser from "./Dashboard/default-user.png";
const OneProject = ({ data, usd }) => {
  const navigate = useNavigate();

  const [percentRaised, SetpercentRaised] = useState(0.0);
  // const address = useSelector((state) => state.user.address);
  const days = useSelector((state) => state.user.roundDays);
  const GetDetails = async () => {
    let details = await Ethqf.methods.projectDetails(parseInt(data.id)).call();
    console.log(details);
    let amt;
    if (parseInt(details[2]) > 0) {
      if (details[0] === "0") {
        amt = parseInt(details[1]);
      } else {
        amt = parseInt(
          (parseInt(details[3]) / parseInt(details[1])) * details[0]
        );
      }
      console.log(amt);
      SetpercentRaised(
        parseFloat(
          ((usd * web3.utils.fromWei(`${parseFloat(amt)}`, "ether")).toFixed(
            3
          ) /
            parseInt(data.amount_to_raise)) *
            100
        ).toFixed(3)
      );
    }
  };

  useEffect(() => {
    GetDetails();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (percentRaised) {
      if (percentRaised > 100.0) {
        SetpercentRaised(100.0);
      }
    }
  }, [percentRaised]);

  return (
    <div className="col-xl-4 col-lg-4 col-md-6">
      <div
        className="projects projects-02  mb-30 wow fadeInUp2 animated"
        data-wow-delay=".2s"
        style={{
          backgroundColor: "#F9F9F9",
          border: "3px solid black",
          borderRadius: "30px",
        }}
      >
        <div className="projects__thumb pos-rel" style={{ margin: "3px" }}>
          <img
            src={data.logo}
            alt=""
            style={{
              height: "280px",
              borderRadius: "40px",
            }}
          />
        </div>
        <div className="projects__content">
          <h4
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate("/projectDetails", {
                state: { data, usd },
              })
            }
          >
            {data.title}
          </h4>
          <div className="skill mb-30">
            <p>
              Raised{" "}
              <span>
                ${(usd * parseFloat(data.crowdfundAmount)).toFixed(5)}
              </span>
            </p>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${percentRaised}%` }}
              >
                <h5 style={{ fontSize: "20px" }}>{percentRaised} %</h5>
              </div>
            </div>
          </div>
          <div className="projects__content--manager">
            <ul
              className="project-manager"
              style={{ marginLeft: "0px", padding: "0px" }}
            >
              <li
                style={{
                  paddingRight: "0px",
                  marginRight: "0px",
                }}
              >
                <img
                  src={
                    data.ownerinfo.profile_img
                      ? data.ownerinfo.profile_img
                      : defaultuser
                  }
                  alt=""
                  style={{ height: "50px", width: "50px", borderRadius: "50%" }}
                />
                <span
                  style={{
                    fontSize: "20px",
                    marginLeft: "5px",
                    fontWeight: "600",
                  }}
                >
                  {
                    <>
                      {data.owner[0]}
                      {data.owner[1]}
                      {data.owner[2]}
                      {data.owner[3]}
                      {data.owner[4]}
                      {data.owner[5]}.....
                      {data.owner.slice(-4)}{" "}
                    </>
                  }
                </span>
              </li>
              <li>
                <p
                  className="time"
                  style={{ marginLeft: "12px", fontSize: "18px" }}
                >
                  <i className="far fa-clock"></i> {days} Days Left
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneProject;
