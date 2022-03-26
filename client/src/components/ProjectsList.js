import React, { useState, useEffect } from "react";
import Ethqf from "../Ethereum/eth_qf";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./searchbar.css";
import { useSelector } from "react-redux";

import OneProject from "./OneProject";

const ProjectsList = () => {
  const navigate = useNavigate();

  const isRoundActive = useSelector((state) => state.user.isRoundActive);
  const redux_details = useSelector((state) => state.user.details);
  const usd = useSelector((state) => state.user.usd);
  const [Projects, SetProjects] = useState([]);

  const [search, setSearch] = useState("");

  const getProjectData = async () => {
    let id = await Ethqf.methods.round_id().call();
    let range = await Ethqf.methods.roundProjectids(id).call();
    console.log(id, range);
    let projStatus;
    SetProjects([]);
    let temp = [];
    projStatus = await axios.get("http://localhost:8000/getprojectdata", {
      params: { round_id: id },
    });

    console.log(projStatus.data.response);

    for (let index = range.start; index <= range.end; index++) {
      let details = await Ethqf.methods.projects(index).call();
      let res = await fetch(`${details.ipfsHash}`);
      let response = await res.json();
      response.ownerinfo = {};
      response.crowdfundAmount = Web3.utils.fromWei(
        `${details.crowdfundAmount}`,
        "ether"
      );
      let info = await projStatus.data.response.find(
        (data) => data.project_id === `${index}`
      );
      response.status = info.status;
      response.adm_value = info.adm_value;
      response.sponsors_voted = info.sponsors_voted;
      if (info.owner) {
        response.ownerinfo = info.owner;
      } else {
        response.ownerinfo = redux_details;
      }
      response.owner = details.owner;
      response.id = index;
      temp.push(response);
    }
    temp.map((data) => SetProjects((prevState) => [...prevState, data]));
  };

  const getData = async () => {
    await getProjectData();
  };

  useEffect(() => {
    getData();

    //eslint-disable-next-line
  }, [isRoundActive]);

  // if (Projects.length === 0) return null;
  console.log(Projects, isRoundActive);

  const searchfilter = Projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );
  console.log(searchfilter);
  return (
    <div>
      <main>
        <section
          className="page-title-area"
          style={{ backgroundImage: "url(/assets/img/bg/page-title-bg.jpg)" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-xl-10 offset-xl-1">
                <div className="page-title-wrapper text-center">
                  <h1
                    className="page-title wow fadeInUp2 animated"
                    data-wow-delay=".1s"
                  >
                    Latest Projects
                  </h1>
                </div>
                <ul
                  className="breadcrumb-list wow fadeInUp2 animated"
                  data-wow-delay=".3s"
                  style={{ justifyContent: "center", display: "flex" }}
                >
                  <li
                    onClick={() => navigate("/")}
                    style={{
                      color: "white",
                      fontSize: "28px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Home <i className="far fa-chevron-right"></i>
                  </li>
                  <li
                    className="active"
                    style={{
                      color: "#fde857",
                      fontSize: "28px",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/projects")}
                  >
                    Projects
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="quote-btn d-none d-xl-block"
              style={{
                float: "right",
                marginTop: "10rem",
                marginBottom: "10px",
              }}
            >
              <button
                onClick={() => navigate("/new_project")}
                className="theme_btn theme_btn_bg"
              >
                Create New Project
              </button>
            </div>
          </div>
        </section>
        <section className="project-01-area pt-125 pb-100">
          <div className="container">
            <div className="row mb-50 align-items-center">
              <div className="col-xl-10 col-lg-9 col-md-9 col-sm-8">
                <h3>Showing All {Projects.length} Results</h3>
              </div>
              <div className="container">
                <div className="row height d-flex justify-content-center align-items-center">
                  <div className="col-md-6">
                    <div
                      className="form"
                      // style={{ backgroundColor: "#F9F9F9" }}
                    >
                      {" "}
                      <i className="fa fa-search"></i>{" "}
                      <input
                        type="text"
                        className="form-control form-input"
                        style={{ fontSize: "21px" }}
                        placeholder="Search anything..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />{" "}
                      <span className="left-pan">
                        <i className="fa fa-microphone"></i>
                      </span>{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {Projects.length > 0 ? (
              <div className="row">
                {Projects &&
                  searchfilter.map((data, key) => {
                    return <OneProject data={data} usd={usd} key={key} />;
                  })}
              </div>
            ) : isRoundActive ? (
              <>
                <h1
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "red",
                    fontFamily: "Georgia",
                  }}
                >
                  No Projects Listed Yet
                </h1>
              </>
            ) : (
              <>
                <h1
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "red",
                    fontFamily: "Georgia",
                  }}
                >
                  No Funding Round Currently Active
                </h1>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProjectsList;
