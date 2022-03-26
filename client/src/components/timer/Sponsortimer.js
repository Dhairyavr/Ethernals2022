import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSponsorenrollment } from "../../redux/user";
import "./timer.css";
const Sponsortimer = () => {
  const dispatch = useDispatch();

  const [sponsorDate, setSponsordate] = useState(null);
  let sponsor_time = useSelector((state) => state.user.sponsorenrollment);

  const [sponsor_display, setSponsordisplay] = useState({
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
  });

  let timeinterval = useRef(null);

  function getTimeRemaining() {
    const total = Date.parse(sponsorDate) - Date.parse(new Date());

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  function updateClock() {
    const t = getTimeRemaining();

    setSponsordisplay({
      days: t.days.toString(),
      hours: ("0" + t.hours).slice(-2).toString(),
      minutes: ("0" + t.minutes).slice(-2).toString(),
      seconds: ("0" + t.seconds).slice(-2).toString(),
    });

    if (t.total <= 0) {
      clearInterval(timeinterval.current);
      console.log("Timer end");
      dispatch(setSponsorenrollment(""));
    }
    // console.log(sponsor_display);
  }

  // console.log(sponsor_display, sponsor_time);

  useEffect(() => {
    if (sponsor_time.length > 0) setSponsordate(sponsor_time);
    // eslint-disable-next-line
  }, [sponsor_time]);

  useEffect(() => {
    if (sponsor_time.length > 0)
      timeinterval.current = setInterval(updateClock, 1000);
    return () => clearInterval(timeinterval.current);
    // eslint-disable-next-line
  }, [sponsor_display, sponsorDate]);

  return (
    <div>
      <div
        id="clockdiv"
        style={{
          paddingTop: "7.5rem",
          color: "black",
          float: "left",
          width: "100%",
        }}
      >
        {sponsor_time.length > 0 ? (
          <>
            <div
              className="container"
              style={{ padding: "2rem", backgroundColor: "#fed857" }}
            >
              <div
                className="row"
                style={{
                  fontSize: "36px",
                  fontFamily: "Georgia",
                  marginLeft: "13rem",
                  paddingBottom: "20px",
                  fontWeight: "700",
                }}
              >
                Sponsor Enrollment Ends in
              </div>
              <div className="row" style={{ marginLeft: "2.3rem" }}>
                <div style={{ paddingLeft: "5rem" }}>
                  <span
                    className="days"
                    style={{
                      marginBottom: "20px",
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    {sponsor_display.days}
                  </span>
                  <div className="smalltext">Days</div>
                </div>
                <div style={{ paddingLeft: "5rem" }}>
                  <span
                    className="hours"
                    style={{
                      marginBottom: "20px",
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    {" "}
                    {sponsor_display.hours}
                  </span>
                  <div className="smalltext">Hours</div>
                </div>
                <div style={{ paddingLeft: "5rem" }}>
                  <span
                    className="minutes"
                    style={{
                      marginBottom: "20px",
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    {sponsor_display.minutes}
                  </span>
                  <div className="smalltext">Minutes</div>
                </div>
                <div style={{ paddingLeft: "5rem" }}>
                  <span
                    className="seconds"
                    style={{
                      marginBottom: "20px",
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    {" "}
                    {sponsor_display.seconds}
                  </span>
                  <div className="smalltext">Seconds</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              backgroundColor: "#fed857",
              display: "inline-block",
              padding: "2rem",
              lineHeight: "1.3",
            }}
          >
            Sponsor Enrollment for the current round has ended
          </div>
        )}
      </div>
    </div>
  );
};

export default Sponsortimer;
