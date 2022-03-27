import React, { useState } from "react";
import Dtitle from "../Dtitle";

import "./Myprojects.css";
import { useSelector } from "react-redux";
import InstallmentsModal from "./InstallmentsModal";

const MyProjects = () => {
  const myprojects = useSelector((state) => state.user.myprojects);
  const roundDays = useSelector((state) => state.user.roundDays);

  const installment_voting_dates = useSelector(
    (state) => state.user.installment_voting_dates
  );

  const [open, setOpen] = useState(false);
  const [openModalId, setOpenModalId] = useState("");
  console.log(myprojects, installment_voting_dates);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dtitle title="My Listed Projects" />
      <section className="mt-5">
        <div className="container-layout-content container">
          <div className="content-page-wrap">
            <div className="main-page-content base-layout row has-no-sidebar">
              {myprojects.map((data, key) => {
                return (
                  <div
                    className="content-page col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12"
                    key={key}
                  >
                    <div
                      className="wpneo-listings-dashboard wpneo-shadow wpneo-padding15 wpneo-clearfix"
                      style={{
                        border: "3px solid black",
                        borderRadius: "30px",
                        backgroundColor: "#00bf96",
                      }}
                    >
                      <div className="wpneo-listing-img">
                        <a
                          href="https://gaviaspreview.com/wp/krowd/?post_type=product&p=9724"
                          title="real estate"
                        >
                          {" "}
                          <img
                            width="128"
                            style={{
                              height: "200px",
                              backgroundColor: "black",
                            }}
                            src={data.logo}
                            className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                            alt=""
                          />
                        </a>
                        {/* <div className="overlay">
                          <div>
                            <div
                              className="wp-crowd-btn wp-crowd-btn-primary"
                              // style={{ backgroundColor: "yellow" }}
                            >
                              View
                            </div>
                          </div>
                        </div> */}
                      </div>
                      <div className="wpneo-listing-content clearfix">
                        <div className="wpneo-admin-title float-left">
                          <h3>
                            <a href="https://gaviaspreview.com/wp/krowd/?post_type=product&p=9724 ">
                              {data.title}
                            </a>
                          </h3>

                          <span
                            className="wpneo-author"
                            style={{
                              fontSize: "20px",
                              fontWeight: "500",
                              color: "blue",
                              padding: "0px",
                            }}
                          >
                            {data.description
                              .split(/\s+/)
                              .slice(0, 12)
                              .join(" ")}{" "}
                            .....
                          </span>
                        </div>
                        <div className="wpneo-admin-location float-right">
                          <div className="wpneo-fields-action">
                            <div>
                              <span
                                className="wp-crowd-btn wp-crowd-btn-primary"
                                onClick={() => {
                                  handleClickOpen();
                                  setOpenModalId(data.project_id);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                View Installments
                              </span>
                              {openModalId === data.project_id && (
                                <InstallmentsModal
                                  open={open}
                                  handleClose={() => {
                                    handleClose();
                                    setOpenModalId("");
                                  }}
                                  data={data}
                                />
                              )}
                              {/* <BootstrapDialog
                                onClose={handleClose}
                                aria-labelledby="customized-dialog-title"
                                open={open}
                                sx={{
                                  boxShadow: "10px",
                                  border: "2px solid white",
                                }}
                                maxWidth="xl"
                              >
                                <BootstrapDialogTitle
                                  id="customized-dialog-title"
                                  onClose={handleClose}
                                  style={{
                                    backgroundColor: "black",
                                    color: "white",
                                    fontSize: "24px",
                                    fontWeight: "700",
                                  }}
                                >
                                  Installments
                                </BootstrapDialogTitle>
                                <DialogContent
                                  dividers
                                  style={{
                                    backgroundColor: "black",
                                    color: "white",
                                    height: "40rem",
                                    width: "70rem",
                                  }}
                                >
                                  <Typography
                                    style={{ color: "white" }}
                                    gutterBottom
                                    component={"span"}
                                  >
                                    <div className="row">
                                      {data &&
                                        [
                                          ...Array(
                                            parseInt(data.no_of_installments)
                                          ),
                                        ].map((x, i) => (
                                          <Installments
                                            key={i}
                                            project={data}
                                            installment_id={i}
                                            installment_date={
                                              data.no_of_installments === "3"
                                                ? installment_voting_dates[0]
                                                    .installment_start_3[i]
                                                : data.no_of_installments ===
                                                  "5"
                                                ? installment_voting_dates[0]
                                                    .installment_start_5[i]
                                                : installment_voting_dates[0]
                                                    .installment_start_7[i]
                                            }
                                          />
                                        ))}
                                    </div>
                                  </Typography>
                                </DialogContent>
                              </BootstrapDialog> */}
                            </div>
                          </div>
                        </div>
                        <div className="wpneo-percent-rund-wrap">
                          <div
                            className="crowdfound-fund-raised"
                            style={{ marginLeft: "0px" }}
                          >
                            <div className="wpneo-meta-desc">
                              <span className="woocommerce-Price-amount amount">
                                <bdi
                                  style={{
                                    fontSize: "22px",
                                    color: "black",
                                    fontWeight: "700",
                                  }}
                                >
                                  <span
                                    className="woocommerce-Price-currencySymbol"
                                    style={{ marginRight: "5px" }}
                                  >
                                    &#36;
                                  </span>
                                  <span
                                    style={{
                                      color: "green",
                                      fontSize: "22px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    {data.crowdfundAmount}
                                  </span>
                                </bdi>
                              </span>
                            </div>
                            <div
                              className="wpneo-meta-name"
                              style={{
                                color: "black",
                                fontSize: "20px",
                                fontWeight: "500",
                              }}
                            >
                              Fund Raised
                            </div>
                          </div>

                          <div className="crowdfound-funding-goal">
                            <div className="wpneo-meta-desc">
                              <span className="woocommerce-Price-amount amount">
                                <bdi
                                  style={{
                                    color: "black",
                                    fontSize: "22px",
                                    fontWeight: "700",
                                  }}
                                >
                                  <span
                                    className="woocommerce-Price-currencySymbol"
                                    style={{ marginRight: "5px" }}
                                  >
                                    &#36;
                                  </span>
                                  <span
                                    style={{
                                      color: "green",
                                      fontSize: "22px",
                                      fontWeight: "700",
                                    }}
                                  >
                                    {data.amount_to_raise}
                                  </span>
                                </bdi>
                              </span>
                            </div>
                            <div
                              className="wpneo-meta-name"
                              style={{
                                color: "black",
                                fontSize: "20px",
                                fontWeight: "500",
                              }}
                            >
                              Funding Goal
                            </div>
                          </div>

                          <div className="crowdfound-time-remaining">
                            <div
                              className="wpneo-meta-desc"
                              style={{
                                color: "black",
                                fontSize: "20px",
                                fontWeight: "700",
                              }}
                            >
                              {roundDays}
                            </div>
                            <div
                              className="wpneo-meta-name"
                              style={{
                                color: "black",
                                fontSize: "20px",
                                fontWeight: "500",
                              }}
                            >
                              Days to go
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyProjects;
