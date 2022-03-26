import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
const Footer = () => {
  return (
    <div>
      <footer
        className="footer-area heding-bg pos-rel pt-100"
        style={{ backgroundImage: "url(assets/img/bg/02.png)" }}
      >
        <div className="container">
          <div className="footer-bottom-area">
            <div className="row mb-30">
              <div
                className="col-xl-2 col-lg-3 col-md-6  wow fadeInUp2 animated"
                data-wow-delay=".1s"
              >
                <div className="footer__widget mb-30">
                  <h5 className="semi-title mb-25">Quick Links</h5>
                  <ul className="fot-list">
                    <li>
                      <a href="/about">About us</a>
                    </li>
                    <li>
                      <a href="/new_project">Create a Project</a>
                    </li>
                    <li>
                      <a href="/projects">View Projects</a>
                    </li>
                    <li>
                      <a href="/contact">Contact us</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="col-xl-2 col-lg-3 col-md-6 wow fadeInUp2 animated"
                data-wow-delay=".3s"
              >
                <div className="footer__widget mb-30 pl-40">
                  <h5 className="semi-title mb-25">Project Categories</h5>
                  <ul className="fot-list">
                    <li>
                      <a href="#/">Education</a>
                    </li>
                    <li>
                      <a href="#/">Design</a>
                    </li>
                    <li>
                      <a href="#/">Film & Video</a>
                    </li>
                    <li>
                      <a href="#/">Technology</a>
                    </li>
                    <li>
                      <a href="#/">Games</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="col-xl-4 col-lg-6 col-md-6  wow fadeInUp2 animated"
                data-wow-delay=".5s"
              >
                <div className="footer__widget mb-25 pl-85">
                  <h5 className="semi-title mb-25">Our Platform</h5>
                  <p className="mb-10">
                    An optimized grants platform to make it easier for the
                    righful projects to receive the necessary deserving funds.
                  </p>
                  <ul className="fot-list address-list">
                    <li>
                      <a href="#/">
                        <i className="far fa-map-marker-alt"></i> 221 B Baker
                        Street
                      </a>
                    </li>
                    <li>
                      <a href="#/">
                        <i className="far fa-envelope"></i> abcd123@gmail.com
                      </a>
                    </li>
                    <li>
                      <a href="#/">
                        <i className="far fa-phone-volume"></i> +91 9876543210
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="col-xl-4 col-lg-6 col-md-6  wow fadeInUp2 animated"
                data-wow-delay=".7s"
              >
                <div className="footer__widget fot_abot mb-30 pl-85">
                  <h5 className="semi-title mb-25">Donate Us</h5>
                  <p className="mb-30">
                    Help us continue fundraising open source projects
                  </p>
                  <div className="subscribe-content foter-subscribe">
                    <form className="subscribe-form">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Your Email"
                      />
                      <button>
                        <ArrowUpwardIcon />{" "}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!--scroll-target-btn--> */}
          <a href="#top-menu" className="scroll-target">
            <ArrowUpwardIcon />{" "}
          </a>
          {/* <!--scroll-target-btn--> */}
          <div className="copy-right-area pt-30">
            <div className="row align-items-center">
              <div className="col-xl-7 col-lg-7 col-md-6">
                <div className="footer-log mb-30">
                  <a
                    href="/"
                    className="footer-logo mb-30"
                    style={{
                      color: "white",
                      fontSize: "38px",
                      fontWeight: "700",
                    }}
                  >
                    FundGoal{" "}
                  </a>
                </div>
              </div>
              <div className="col-xl-5 col-lg-5 col-md-6">
                <div className="copyright mb-30 text-md-right">
                  <p>© 2022 Given. All Rights Reserved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
