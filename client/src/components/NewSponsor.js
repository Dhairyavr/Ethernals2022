import React, { useState } from "react";
import { useSelector } from "react-redux";
import Ethqf from "../Ethereum/eth_qf";
import web3 from "../Ethereum/web3";
import "./form.css";

const txtarea = {
  padding: "8px 15px",
  borderRadius: "5px !important",
  margin: "5px 0px",
  boxSizing: "border-box",
  fontSize: "18px !important",
  fontWeight: "300",
};

const NewSponsor = () => {
  const [sponsorDetails, setsponsorDetails] = useState({
    reason: "",
    amount: "0",
    comments: "",
  });

  const address = useSelector((state) => state.user.address);

  const sponsor_enrollment = useSelector(
    (state) => state.user.sponsorenrollment
  );

  const Submit = async (e) => {
    e.preventDefault();
    if (parseFloat(sponsorDetails.amount) < 0.0) {
      alert("Enter valid amount");
      return;
    }
    try {
      let val = web3.utils.toWei(sponsorDetails.amount, "ether").toString();
      console.log(sponsorDetails, address, val);

      await Ethqf.methods.enrollSponsor(0, address, val).send({
        from: address,
        value: val,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <main>
        <div>
          <div>
            <div className="Sponsor_container__2p-M9" style={txtarea}>
              <div
                className="Sponsor_white_container__2GPca"
                style={{ backgroundColor: "white" }}
              >
                <div className="Sponsor_flag__3MEuB"></div>
                <h1 className="Sponsor_heading__zO1-B">
                  Sponsor Current Funding Round
                </h1>
                <h4 style={{ textAlign: "center" }}>
                  Thank you for your interest in supporting open source projects
                  on EthQF. Complete the form below to sponsor the current
                  funding round.
                </h4>
                <hr className="Sponsor_separator__iyntA" />
                <form onSubmit={Submit}>
                  {" "}
                  <label className="Sponsor_label__2bYvs">
                    Why do you want to sponsor public open source projects on
                    EthQF ?
                  </label>
                  <textarea
                    style={{ height: "7rem" }}
                    value={sponsorDetails.reason}
                    onChange={(e) =>
                      setsponsorDetails({
                        ...sponsorDetails,
                        reason: e.target.value,
                      })
                    }
                    className="Sponsor_input__UHgsl"
                    placeholder="Briefly state why do you want to become a sponsor in a round"
                  ></textarea>
                  <br />
                  <br />
                  <label className="Sponsor_label__2bYvs">
                    Enter Amount <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="Sponsor_input__UHgsl"
                    required
                    value={sponsorDetails.amount}
                    onChange={(e) =>
                      setsponsorDetails({
                        ...sponsorDetails,
                        amount: e.target.value,
                      })
                    }
                    placeholder="Enter Sponsor Amount in Ethers"
                    style={{ height: "3.5rem" }}
                  />
                  <br />
                  <br />
                  <label className="Sponsor_label__2bYvs">Extra Comments</label>
                  <input
                    type="text"
                    className="Sponsor_input__UHgsl"
                    value={sponsorDetails.comments}
                    onChange={(e) =>
                      setsponsorDetails({
                        ...sponsorDetails,
                        comments: e.target.value,
                      })
                    }
                    placeholder="Enter your comments"
                    style={{ height: "6rem" }}
                  />
                  <br />
                  <br />
                  {sponsor_enrollment.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <button type="submit" className="theme_btn theme_btn_bg">
                        Register
                      </button>
                    </div>
                  ) : (
                    <h3
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "red",
                        fontFamily: "Georgia",
                      }}
                    >
                      Sponsor Enrollment period has ended{" "}
                      <i
                        className="fas fa-exclamation-circle"
                        style={{ marginLeft: "1rem" }}
                      ></i>
                    </h3>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewSponsor;
