import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./timer.css";
import {
  setRound,
  setSponsorenrollment,
  setRoundDays,
  setIVDates,
} from "../../redux/user";
import { useDispatch, useSelector } from "react-redux";

const Roundtimer = () => {
  const dispatch = useDispatch();
  const isRoundActive = useSelector((state) => state.user.isRoundActive);
  const [roundTime, setroundTime] = useState("");
  const [round_display, setRounddisplay] = useState({
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
  });

  let timeinterval = useRef(null);

  function getTimeRemaining() {
    const total = Date.parse(roundTime) - Date.parse(new Date());
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

  const showTime = async () => {
    const response = await axios.get("http://localhost:8000/");
    if (response.data.date) {
      await dispatch(setRound(true));

      console.log(response.data.date, typeof response.data.date);
      let x = new Date(response.data.date);
      console.log(x);
      x.setDate(x.getDate() - 16);

      console.log(response.data, x, x.getTime());

      setroundTime(response.data.date);
      dispatch(setIVDates(response.data.installment_voting_dates));
      await dispatch(setSponsorenrollment(x.toString()));
    } else {
      dispatch(setRound(false));
    }
  };

  function updateClock() {
    const t = getTimeRemaining();

    setRounddisplay({
      days: t.days.toString(),
      hours: ("0" + t.hours).slice(-2).toString(),
      minutes: ("0" + t.minutes).slice(-2).toString(),
      seconds: ("0" + t.seconds).slice(-2).toString(),
    });
    dispatch(setRoundDays(t.days.toString()));

    if (t.total <= 0) {
      clearInterval(timeinterval.current);
      console.log("Timer end");
      dispatch(setRound(false));
    }
  }

  //console.log(roundTime);

  useEffect(() => {
    showTime();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isRoundActive) timeinterval.current = setInterval(updateClock, 1000);
    return () => clearInterval(timeinterval.current);
    // eslint-disable-next-line
  }, [round_display, isRoundActive]);

  // console.log(round_display, isRoundActive);

  useEffect(() => {}, [roundTime]);

  return (
    <div>
      {" "}
      <div
        id="clockdiv"
        style={{
          paddingTop: "7.5rem",
          color: "black",
          float: "left",
          width: "100%",
        }}
      >
        {roundTime.length > 0 ? (
          <div className="container" style={{ padding: "2rem" }}>
            <div
              className="row"
              style={{
                fontSize: "36px",
                fontFamily: "Georgia",
                marginLeft: "15rem",
                paddingBottom: "20px",
                fontWeight: "700",
              }}
            >
              Current Round Ends in
            </div>
            <div className="row" style={{ marginLeft: "2.3rem" }}>
              <div style={{ paddingLeft: "5rem" }}>
                <span className="days" style={{ marginBottom: "20px" }}>
                  {round_display.days}
                </span>
                <div className="smalltext">Days</div>
              </div>
              <div style={{ paddingLeft: "5rem" }}>
                <span className="hours" style={{ marginBottom: "20px" }}>
                  {" "}
                  {round_display.hours}
                </span>
                <div className="smalltext">Hours</div>
              </div>
              <div style={{ paddingLeft: "5rem" }}>
                <span className="minutes" style={{ marginBottom: "20px" }}>
                  {round_display.minutes}
                </span>
                <div className="smalltext">Minutes</div>
              </div>
              <div style={{ paddingLeft: "5rem" }}>
                <span className="seconds" style={{ marginBottom: "20px" }}>
                  {" "}
                  {round_display.seconds}
                </span>
                <div className="smalltext">Seconds</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "inline-block",
                padding: "4.4rem 17rem 4.4rem 15rem",
                lineHeight: "1.3",
              }}
            >
              No Active Rounds
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Roundtimer;
