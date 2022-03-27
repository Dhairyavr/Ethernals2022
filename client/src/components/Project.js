import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WebIcon from "@mui/icons-material/Web";
import BigNumber from "bignumber.js";
import web3 from "../Ethereum/web3";
import Ethqf from "../Ethereum/eth_qf";
import { useSelector } from "react-redux";
import defaultuser from "./Dashboard/default-user.png";
import "./update_collection.css";
import axios from "axios";
import UpdateDetails from "./Voting/UpdateDetails";

const Project = () => {
  const address = useSelector((state) => state.user.address);
  const installment_voting_dates = useSelector(
    (state) => state.user.installment_voting_dates
  );
  const usd = useSelector((state) => state.user.usd);
  const redux_details = useSelector((state) => state.user.details);

  const [amount, Setamount] = useState(0);
  const [contri, Setcontri] = useState([]);
  const [crowdfundAmount, SetcrowdfundAmount] = useState(0);
  const [matchAmount, SetmatchAmount] = useState("0");
  const [percentRaised, SetpercentRaised] = useState(0.0);
  const [updateDetails, SetupdateDetails] = useState([]);
  const [sponsors_voted, Setsponsors_voted] = useState([]);

  const { state } = useLocation();
  let { data } = state;

  const [projDetails, setprojDetails] = useState(data);

  const getContributionData = async () => {
    if (typeof projDetails !== "object") {
      console.log("Not a object");
      let projStatus = await axios.get("http://localhost:8000/getprojectdata", {
        params: { round_id: "0" },
      });
      let temp_id = data;
      console.log(projStatus.data.response);

      let details = await Ethqf.methods.projects(temp_id).call();
      let res = await fetch(`${details.ipfsHash}`);
      let response = await res.json();
      response.ownerinfo = {};
      response.crowdfundAmount = web3.utils.fromWei(
        `${details.crowdfundAmount}`,
        "ether"
      );
      let info = await projStatus.data.response.find(
        (data1) => data1.project_id === `${temp_id}`
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
      response.id = temp_id;
      data = response;
      setprojDetails(response);
    }
    // console.log(data.id, data);

    const response = await axios.post(
      "https://api.thegraph.com/subgraphs/name/dhairyavr/ethernalshack",
      {
        query: `query { contributions (where:{contributor:"${address}"}) {
      id
      contributor
      amount
      project_id
      date
    }}`,
      }
    );
    let temp = await response.data.data.contributions.filter(
      (val) => parseInt(val.project_id) === parseInt(data.id)
    );
    Setcontri(temp);
    let ethqf_projectdetails;
    // console.log(response, temp, contri);
    if (typeof projDetails !== "object") {
      ethqf_projectdetails = data.id;
    } else {
      ethqf_projectdetails = projDetails.id;
    }
    // console.log(ethqf_projectdetails.id, temp);
    let details = await Ethqf.methods
      .projectDetails(parseInt(ethqf_projectdetails))
      .call();
    console.log(details);
    let amt;
    if (parseInt(details[2]) > 0) {
      if (details[0] === "0") {
        amt = parseInt(details[1]);
      } else {
        amt = parseInt(
          (parseInt(details[3]) / parseInt(details[1])) * details[0]
        );
        SetmatchAmount(amt);
      }
      SetcrowdfundAmount(parseInt(details[2]));
      // console.log(amt, contri);
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

    const upd = await axios.get("http://localhost:8000/getinstallmentdata", {
      params: { project_id: data.id },
    });
    // console.log(upd.data);
    SetupdateDetails(upd.data.details);

    const arr = await Ethqf.methods.getRoundSpecificSponsors(0).call();
    console.log(arr);
    arr.map((val) => Setsponsors_voted([...sponsors_voted, val.toLowerCase()]));
  };

  useEffect(() => {
    getContributionData();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (percentRaised) {
      if (percentRaised > 100.0) {
        SetpercentRaised(100.0);
      }
    }
  }, [percentRaised]);

  const ConfirmContribution = async (e) => {
    e.preventDefault();
    if (parseFloat(amount) <= 0.0) {
      alert("Enter valid donation amount");
      return;
    }
    if (address === "") {
      alert("Connect your wallet");
      return;
    }
    if (percentRaised >= 100.0) {
      alert("Project currently has met its fundraising goal");
      return;
    }
    // console.log(parseFloat(amount));
    let date = new Date();
    date = date.toLocaleString().toString();

    let _sqrtAmount = new BigNumber(
      Math.sqrt(parseFloat(amount) * Math.pow(10, 18))
    ).toFixed(0);
    let sq_amount;
    // console.log(_sqrtAmount);
    if (typeof projDetails === "object") {
      sq_amount = new BigNumber(
        await Ethqf.methods.projectSqrtAmount(parseInt(projDetails.id)).call()
      ).toFixed(0);
    }
    // console.log(sq_amount);

    sq_amount = Math.pow(
      parseInt(sq_amount) + parseInt(_sqrtAmount),
      2
    ).toFixed(0);
    //const accounts = await web3.eth.getAccounts();
    // console.log(data.id, sq_amount, _sqrtAmount, address, parseFloat(amount));
    let final_amount = await web3.utils.toWei(`${parseFloat(amount)}`, "ether");

    try {
      await Ethqf.methods
        .makeContribution(
          `${address}`,
          parseInt(projDetails.id),
          web3.utils.toWei(`${parseFloat(amount)}`, "ether"),
          sq_amount.toString(),
          _sqrtAmount.toString(),
          date
        )
        .send({
          from: address,
          value: final_amount.toString(),
        });
    } catch (e) {
      alert(e);
      return;
    }
    window.location.reload();
  };

  console.log(data, percentRaised, projDetails, contri);

  if (typeof projDetails !== "object") {
    return null;
  }
  return (
    <div>
      <main>
        <section
          className="page-title-area"
          style={{
            backgroundImage: "url(assets/img/bg/page-title-bg.jpg)",
          }}
        >
          <div className="right-border-shape">
            <img src="assets/img/shape/02.png" alt="" />
          </div>
          <div className="container">
            <div className="row">
              <div className="col-xl-10 offset-xl-1">
                <div className="page-title-wrapper text-center">
                  <h1
                    className="page-title wow fadeInUp2 animated"
                    data-wow-delay=".1s"
                  >
                    Project Details
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="project-image-area grey-bg pt-130 pb-100"
          style={{
            backgroundImage: "url(assets/img/shape/09.png)",
          }}
        >
          <div className="container">
            <div className="row no-gutters">
              <div className="col-xl-7">
                <div
                  className="project-img white-bg mb-30 wow fadeInUp2 animated"
                  data-wow-delay=".1s"
                >
                  <img
                    src={projDetails.logo}
                    alt="Img"
                    style={{ height: "612px" }}
                  />
                </div>
              </div>
              <div
                className="col-xl-5 wow fadeInUp2 animated"
                data-wow-delay=".1s"
              >
                <div className="projects project-cart white-bg mb-30">
                  <div
                    className="projects__content"
                    style={{
                      height: "612px",
                      paddingRight: "20px",
                      paddingBottom: "20px",
                      paddingTop: "20px",
                    }}
                  >
                    <h3 style={{ marginBottom: "1rem" }}>
                      {projDetails.title}
                    </h3>
                    <div className="projects__manager d-sm-flex align-items-center mb-40">
                      <div className="manager-img mr-20">
                        <img
                          src={
                            projDetails.ownerinfo.profile_img
                              ? projDetails.ownerinfo.profile_img
                              : defaultuser
                          }
                          alt="dasd"
                          style={{
                            height: "70px",
                            width: "70px",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                      <div
                        className="name"
                        style={{
                          fontSize: "15px",
                          fontFamily: "Georgia",
                          fontWeight: "600",
                        }}
                      >
                        <h5>
                          {projDetails.ownerinfo.fname}{" "}
                          {projDetails.ownerinfo.lname}
                        </h5>
                        <span>{projDetails.ownerinfo.email}</span>
                        <br />
                        {
                          <>
                            {projDetails.owner[0]}
                            {projDetails.owner[1]}
                            {projDetails.owner[2]}
                            {projDetails.owner[3]}
                            {projDetails.owner[4]}
                            {projDetails.owner[5]}.....
                            {projDetails.owner.slice(-4)}{" "}
                          </>
                        }{" "}
                      </div>
                    </div>
                    <div className="skill mb-20">
                      <p className="skill-para">
                        Raised{" "}
                        <span>
                          $
                          {(
                            usd *
                            web3.utils.fromWei(
                              `${parseFloat(crowdfundAmount)}`,
                              "ether"
                            )
                          ).toFixed(5)}
                        </span>
                      </p>
                      <p className="skill-para">
                        Total Match Amount :
                        <span>
                          $
                          {(
                            usd *
                            web3.utils.fromWei(
                              `${parseFloat(matchAmount)}`,
                              "ether"
                            )
                          ).toFixed(3)}
                        </span>
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          aria-valuenow="95"
                          aria-valuemin="0"
                          style={{ width: `${percentRaised}%` }}
                          aria-valuemax="95"
                        >
                          <h5 style={{ fontSize: "24px" }}>
                            {percentRaised} %
                          </h5>
                        </div>
                      </div>
                    </div>
                    <p>
                      {projDetails.description
                        .split(/\s+/)
                        .slice(0, 10)
                        .join(" ")}
                      ......
                    </p>
                    {projDetails.status === "Project Listed" ? (
                      <ul className="cart-list d-sm-flex align-items-center">
                        <li>
                          <form className="cart-plus-minus">
                            <div className="plus-minus pos-rel">
                              <input
                                type="text"
                                value={amount}
                                onChange={(e) => Setamount(e.target.value)}
                              />
                              <div className="updown plus">
                                <i
                                  className="far fa-chevron-left"
                                  onClick={() => Setamount((prev) => prev - 1)}
                                ></i>
                              </div>
                              <div className="updown minus">
                                <i
                                  className="far fa-chevron-right"
                                  onClick={() => Setamount((prev) => prev + 1)}
                                ></i>
                              </div>
                            </div>
                          </form>
                        </li>

                        <li>
                          <div
                            className="theme_btn theme_btn_bg"
                            data-animation="fadeInLeft"
                            data-delay=".5s"
                            onClick={ConfirmContribution}
                          >
                            Donate now
                          </div>
                        </li>
                      </ul>
                    ) : (
                      <span style={{ color: "red", fontWeight: "700" }}>
                        Project is Disqualified
                      </span>
                    )}

                    <span
                      style={{
                        padding: "0px",
                        margin: "0px",
                        fontWeight: "700",
                        fontSize: "20px",
                        marginLeft: "35px",
                        color: "#02b663",
                      }}
                    >
                      ${(amount * usd).toFixed(5)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          className="our-overview-area pos-rel  wow fadeInUp2 animated"
          data-wow-delay=".1s"
        >
          <div className="container">
            <div className="row">
              <div className="col-xl-12">
                <ul
                  className="nav nav-tabs nav-tabs-02"
                  id="myTab"
                  role="tablist"
                >
                  <li className="nav-item">
                    <a
                      className="nav-link theme_btn active"
                      id="home-tab"
                      data-toggle="tab"
                      href="#home-01"
                      role="tab"
                      aria-controls="home-01"
                      aria-selected="true"
                    >
                      Description
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link theme_btn"
                      id="profile-tab"
                      data-toggle="tab"
                      href="#profile-01"
                      role="tab"
                      aria-controls="profile-01"
                      aria-selected="false"
                    >
                      Updates
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link theme_btn"
                      id="contact-tab"
                      data-toggle="tab"
                      href="#contact-02"
                      role="tab"
                      aria-controls="contact-02"
                      aria-selected="false"
                    >
                      Backer List
                    </a>
                  </li>
                  {/* {sponsors_voted.length > 0 &&
                    sponsors_voted.includes(address) && (
                      <li className="nav-item">
                        <a
                          className="nav-link theme_btn"
                          id="review-tab"
                          data-toggle="tab"
                          href="#review-01"
                          role="tab"
                          aria-controls="review-01"
                          aria-selected="false"
                        >
                          Review Project
                        </a>
                      </li>
                    )} */}
                </ul>
                <div className="tab-content" id="myTabContent">
                  <div
                    className="tab-pane fade show active"
                    id="home-01"
                    role="tabpanel"
                    aria-labelledby="home-tab"
                  >
                    <section
                      className="project-image-text-area pt-35 pb-90 wow fadeInUp animated"
                      data-wow-delay=".3s"
                    >
                      <div className="container">
                        <div className="row">
                          <div className="col-xl-12 col-lg-8 col-md-12">
                            <div className="image-content-left">
                              <div className="left-content-box mb-45">
                                <h3
                                  className="img-title mb-10"
                                  style={{ color: "white" }}
                                >
                                  {projDetails.title}{" "}
                                </h3>
                                <p
                                  className="mb-40"
                                  style={{ fontSize: "20px", color: "#f9f9f9" }}
                                >
                                  {projDetails.description}
                                </p>
                              </div>
                              <span
                                style={{
                                  fontSize: "18px",
                                  fontFamily: "Georgia",
                                  fontWeight: "600",
                                  color: "grey",
                                }}
                              >
                                <GitHubIcon />
                                {"  "}
                                <a
                                  href={projDetails.github_url}
                                  style={{ color: "grey" }}
                                >
                                  {projDetails.github_url}
                                </a>
                                <a
                                  href={projDetails.linkedin_url}
                                  style={{ marginLeft: "2rem", color: "grey" }}
                                >
                                  <LinkedInIcon />
                                  {projDetails.linkedin_url}
                                </a>
                                <a
                                  href={projDetails.website_url}
                                  style={{ marginLeft: "2rem", color: "grey" }}
                                >
                                  <WebIcon />
                                  {projDetails.website_url}
                                </a>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="profile-01"
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                  >
                    <section className="project-image-text-area pb-90 pt-25">
                      <div className="container">
                        <div className="row">
                          <div className="col-xl-12 col-lg-12 col-md-12">
                            {/* <div class="demo-card demo-card--step1">
                                  <div class="head">
                                    <div class="number-box">
                                      <span>04</span>
                                    </div>
                                    <h2>
                                      <span class="small">Subtitle</span>{" "}
                                      Consistency
                                    </h2>
                                  </div>
                                  <div class="body">
                                    <p>
                                      Lorem ipsum dolor sit amet, consectetur
                                      adipisicing elit. Soluta reiciendis
                                      deserunt doloribus consequatur, laudantium
                                      odio dolorum laboriosam.
                                    </p>
                                    <img
                                      src="http://placehold.it/1000x500"
                                      alt="Graphic"
                                    />
                                  </div>
                                </div> */}

                            {/* <div class="demo-card demo-card--step1">
                                  <div class="head">
                                    <div class="number-box">
                                      <span>05</span>
                                    </div>
                                    <h2>
                                      <span class="small">Subtitle</span>{" "}
                                      Conversion
                                    </h2>
                                  </div>
                                  <div class="body">
                                    <p>
                                      Lorem ipsum dolor sit amet, consectetur
                                      adipisicing elit. Soluta reiciendis
                                      deserunt doloribus consequatur, laudantium
                                      odio dolorum laboriosam.
                                    </p>
                                    <img
                                      src="http://placehold.it/1000x500"
                                      alt="Graphic"
                                    />
                                  </div>
                                </div> */}

                            {/* <ul class="timeline mb-100">
                              <li
                                className="timeline-list wow fadeInUp2 animated"
                                data-wow-delay=".1s"
                              >
                                <div className="update-content">
                                  <h4 className="left-line">
                                    Best Seller Products
                                  </h4>
                                  <p>
                                    Sed ut perspiciatis unde omnis iste natus
                                    error sit voluptatem accusantium dolore
                                    laudantium, totam rem aperiam, eaque ipsa
                                    quae ab illo inventore veritatis
                                  </p>
                                </div>
                              </li> */}

                            <section
                              id="cd-timeline"
                              className="cd-container"
                              style={{ margin: "0px" }}
                            >
                              {updateDetails.length > 0 &&
                                updateDetails.map((val, idx) => (
                                  <UpdateDetails
                                    data={val}
                                    idx={idx}
                                    key={idx}
                                    installment_start={
                                      projDetails.no_of_installments === "3"
                                        ? installment_voting_dates[0]
                                            .installment_start_3[idx]
                                        : projDetails.no_of_installments === "5"
                                        ? installment_voting_dates[0]
                                            .installment_start_5[idx]
                                        : installment_voting_dates[0]
                                            .installment_start_7[idx]
                                    }
                                    voting_end={
                                      projDetails.no_of_installments === "3"
                                        ? installment_voting_dates[0]
                                            .voting_end_3[idx]
                                        : projDetails.no_of_installments === "5"
                                        ? installment_voting_dates[0]
                                            .voting_end_5[idx]
                                        : installment_voting_dates[0]
                                            .voting_end_7[idx]
                                    }
                                  />
                                ))}
                            </section>
                            {/* </ul> */}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="contact-02"
                    role="tabpanel"
                    aria-labelledby="contact-tab"
                  >
                    <div className="backer-list-table pt-45 pb-130">
                      <table className="table">
                        <thead>
                          <tr>
                            <th
                              scope="col"
                              style={{ fontWeight: "700", fontSize: "20px" }}
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              style={{ fontWeight: "700", fontSize: "20px" }}
                            >
                              Donation Amount
                            </th>
                            <th
                              scope="col"
                              style={{ fontWeight: "700", fontSize: "20px" }}
                            >
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody style={{ color: "#92A9BD", fontWeight: "700" }}>
                          {contri &&
                            contri.map((val, key) => {
                              return (
                                <tr key={key} style={{ fontSize: "18px" }}>
                                  <td>{val.contributor}</td>
                                  <td>
                                    {web3.utils.fromWei(
                                      `${parseFloat(val.amount)}`,
                                      "ether"
                                    )}
                                    <span
                                      style={{
                                        fontWeight: "700",
                                        marginLeft: "3px",
                                      }}
                                    >
                                      MATIC
                                    </span>

                                    <span style={{ marginLeft: "20px" }}>
                                      ${" "}
                                      {usd *
                                        web3.utils.fromWei(
                                          `${parseFloat(val.amount)}`,
                                          "ether"
                                        )}
                                    </span>
                                  </td>
                                  <td>{val.date}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* <div
                    className="tab-pane fade"
                    id="review-01"
                    role="tabpanel"
                    aria-labelledby="review-tab"
                  >
                    <div>
                      <ReviewProjects
                        project_id={projDetails.id}
                        curr_adm_value={projDetails.adm_value}
                        sponsors_voted={projDetails.sponsors_voted}
                      />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Project;
