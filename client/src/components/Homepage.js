import React, { useEffect } from "react";
import Roundtimer from "./timer/Roundtimer";
import { io } from "socket.io-client";
import Sponsortimer from "./timer/Sponsortimer";
import { useDispatch } from "react-redux";
import { setSponsorenrollment, setUSD } from "../redux/user";
import axios from "axios";
const Homepage = () => {
  const dispatch = useDispatch();

  const getUSDValue = async () => {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/pricemulti?fsyms=MATIC&tsyms=USD"
    );
    dispatch(setUSD(parseFloat(response.data.MATIC.USD).toFixed(2)));
  };

  useEffect(() => {
    getUSDValue();

    const socket = io("http://localhost:8000", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    socket.on("round-end", (msg) => {
      console.log("Round has ended", msg);
    });
    socket.on("sponsor-end", (msg) => {
      dispatch(setSponsorenrollment(""));
      console.log("Sponsor enrollment has ended", msg);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <aside className="slide-bar">
        <div className="close-mobile-menu">
          <a href="#/">
            <i className="fas fa-times"></i>
          </a>
        </div>

        <div className="offset-sidebar">
          <div className="offset-widget offset-logo mb-30">
            <a href="index.html">
              <img src="assets/img/logo/header_logo_one.png" alt="logo" />
            </a>
          </div>
          <div className="offset-widget mb-40">
            <div className="info-widget">
              <h4 className="offset-title mb-20">About Us</h4>
              <p className="mb-30">
                But I must explain to you how all this mistaken idea of
                denouncing pleasure and praising pain was born and will give you
                a complete account of the system and expound the actual
                teachings of the great explore
              </p>
              <a className="theme_btn theme_btn_bg" href="/contact">
                Contact Us
              </a>
            </div>
          </div>
          <div className="offset-widget mb-30 pr-10">
            <div className="info-widget info-widget2">
              <h4 className="offset-title mb-20">Contact Info</h4>
              <p>
                {" "}
                <i className="fal fa-address-book"></i> 23/A, Miranda City
                Likaoli Prikano, Dope
              </p>
              <p>
                {" "}
                <i className="fal fa-phone"></i> +0989 7876 9865 9{" "}
              </p>
              <p>
                {" "}
                <i className="fal fa-envelope-open"></i> info@example.com{" "}
              </p>
            </div>
          </div>
        </div>

        <nav className="side-mobile-menu">
          <ul id="mobile-menu-active">
            <li className="has-dropdown">
              <a href="index.html">Home</a>
            </li>
            <li>
              <a href="/about">About Us</a>
            </li>

            <li className="has-dropdown">
              <a href="/projects">Project</a>
            </li>
            <li className="has-dropdown">
              <a href="#/">Blogs</a>
            </li>
            <li className="has-dropdown">
              <a href="#/">Pages</a>
            </li>
            <li>
              <a href="contact.html">Contacts Us</a>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="body-overlay"></div>

      <main>
        <div className="slider-area pos-rel">
          <div className="slider-active slider-initialized slick-slider">
            <div className="slider-list draggable">
              <div className="slider-track">
                <div
                  className="slider-height pos-rel  align-items-center slick slide"
                  style={{
                    backgroundColor: "#000D6B",
                    backgroundImage:
                      "url('https://bs-uploads.toptal.io/blackfish-uploads/components/blog_post_page/content/cover_image_file/cover_image/686249/REDESIGN-State-of-the-Equity-Crowdfunding_Luke-Newsletter-f44f6e115aa5de08b4d685ea19a534bd.png')",
                    position: "relative",
                    backgroundPosition: "0% 0%",
                    backgroundPositionX: "30rem",
                    left: "0px",
                    padding: "0px",
                    margin: "0px",
                    opacity: "0.8",
                    top: "0px",
                    width: "100%",
                  }}
                  data-slick-index="0"
                >
                  <div
                    className=""
                    style={{
                      width: "100%",
                      margin: "0px",
                      paddingTop: "10rem",
                      paddingRight: "0px",
                      marginRight: "0px",
                    }}
                  >
                    <div className="">
                      <div
                        className="container"
                        style={{ width: "100%", paddingLeft: "19rem" }}
                      >
                        <div className="row">
                          <div className="col-xl-7">
                            <div className="slider__content text-left">
                              <h4
                                className="sub-title pl-75 pr-75"
                                style={{ color: "black" }}
                              >
                                Quadratic Funding{" "}
                              </h4>
                              <h3
                                className="main-title "
                                data-animation="fadeInUp2"
                                data-delay=".2s"
                                style={{ color: "black" }}
                              >
                                Change The World <br />
                                For Better Future.
                                <br />
                                <span
                                  style={{
                                    fontSize: "3rem",
                                    marginTop: "0px",
                                    fontWeight: "500",
                                    color: "black",
                                  }}
                                >
                                  With Your Contribution
                                </span>
                              </h3>

                              <ul className="btn-list">
                                <li>
                                  <a
                                    className="theme_btn theme_btn_bg"
                                    href="/about"
                                    data-animation="fadeInLeft"
                                    data-delay=".5s"
                                  >
                                    explore more{" "}
                                    <i className="far fa-arrow-right"></i>
                                  </a>
                                </li>
                                <li>
                                  <a
                                    className="theme_btn theme_btn_bg"
                                    href="/projects"
                                    data-animation="fadeInLeft"
                                    data-delay=".5s"
                                  >
                                    donate now{" "}
                                    <i className="far fa-arrow-right"></i>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="row"
                      style={{ width: "100%", paddingRight: "0px" }}
                    >
                      <div className="" style={{ width: "50%" }}>
                        <Roundtimer />
                      </div>
                      <div className="" style={{ width: "50%" }}>
                        <Sponsortimer />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="feature-area grey-bg pos-rel pt-130 pb-100">
          <div className="round-shape">
            <img src="assets/img/shape/01.png" alt="" />
          </div>
          <div className="container">
            <div className="row">
              <div
                className="col-xl-10 offset-xl-1 wow fadeInUp2 animated"
                data-wow-delay=".1s"
              >
                <div className="section-title text-center mb-85">
                  <h6 className="left-line pl-75 pr-75">Features Categories</h6>
                  <h2>
                    Explore Our Quadratic Funding <br />
                  </h2>
                  <h3>
                    <span>Features Open Source Projects</span>
                  </h3>
                </div>
              </div>
            </div>
            <div className="row justify-content-lg-between">
              <div
                className="col-xl-2 col-lg-4 col-md-4 custom-col wow fadeInUp2 animated"
                data-wow-delay=".1s"
              >
                <div className="features white-bg pos-rel text-center mb-30">
                  <div className="features__icon mb-20">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h6>IT Security</h6>
                </div>
              </div>
              <div
                className="col-xl-2 col-lg-4 col-md-4 custom-col wow fadeInUp2 animated"
                data-wow-delay=".3s"
              >
                <div className="features white-bg pos-rel text-center mb-30">
                  <div className="features__icon mb-20">
                    <i className="fas fa-gamepad"></i>
                  </div>
                  <h6>Gaming</h6>
                </div>
              </div>
              <div
                className="col-xl-2 col-lg-4 col-md-4 custom-col wow fadeInUp2 animated"
                data-wow-delay=".5s"
              >
                <div className="features white-bg pos-rel text-center mb-30">
                  <div className="features__icon mb-20">
                    <i className="fas fa-photo-video"></i>
                  </div>
                  <h6>Multimedia</h6>
                </div>
              </div>
              <div
                className="col-xl-2 col-lg-4 col-md-4 custom-col wow fadeInUp2 animated"
                data-wow-delay=".7s"
              >
                <div className="features white-bg pos-rel text-center mb-30">
                  <div className="features__icon mb-20">
                    <i className="fas fa-tools"></i>
                  </div>
                  <h6>Development Tools</h6>
                </div>
              </div>
              <div
                className="col-xl-2 col-lg-4 col-md-4 custom-col wow fadeInUp2 animated"
                data-wow-delay=".9s"
              >
                <div className="features white-bg pos-rel text-center mb-30">
                  <div className="features__icon mb-20">
                    {/* <i className="flaticon-project-management"></i> */}
                    <i className="fas fa-tablet-alt"></i>{" "}
                  </div>
                  <h6>Applications</h6>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="donation-area pt-125 pb-100"
          style={{ backgroundImage: "url(assets/img/events/01.jpg)" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-xl-8 offset-xl-2">
                <div className="donation-wrapper">
                  <div
                    className="section-title white-title text-center mb-40 wow fadeInUp2 animated"
                    data-wow-delay=".1s"
                  >
                    <h6 className="left-line pl-75 pr-75">Donate Now</h6>
                    <h2>
                      Raise Your Hand To The
                      <br />
                      <span>Right Place</span>
                    </h2>
                  </div>
                  <ul
                    className="btn-list text-center mb-30 wow fadeInUp2 animated"
                    data-wow-delay=".3s"
                  >
                    <li>
                      <a
                        className="theme_btn theme_btn_bg"
                        href="/about"
                        data-animation="fadeInLeft"
                        data-delay=".7s"
                      >
                        explore more <i className="far fa-arrow-right"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        className="theme_btn theme_btn_bg"
                        href="/projects"
                        data-animation="fadeInLeft"
                        data-delay=".7s"
                      >
                        donate now <i className="far fa-arrow-right"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
