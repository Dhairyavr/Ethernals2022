import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Ethqf from "../../Ethereum/eth_qf";
import { useSelector } from "react-redux";
import axios from "axios";
const UpdateDetails = ({ data, idx, voting_end, installment_start }) => {
  const address = useSelector((state) => state.user.address);
  const isRoundActive = useSelector((state) => state.user.isRoundActive);

  const [contributors, Setcontributors] = useState([]);
  const [startEnd, setStartEnd] = useState({
    start: null,
    end: null,
  });
  let currentDate = new Date();

  const getAddresses = async () => {
    const addr = await Ethqf.methods.getcontributedTo(data.project_id).call();
    console.log(addr);
    Setcontributors(addr);
    addr.map((val) => Setcontributors([...contributors, val.toUpperCase()]));
  };

  const Vote = async (e) => {
    e.preventDefault();
    console.log(e.target.name);

    const status = await Ethqf.methods
      .getContributorVotingStatus(
        parseInt(data.project_id),
        parseInt(data.installment_id),
        address
      )
      .call();

    console.log(status);
    if (status) {
      alert("Your vote has already been submitted");
      return;
    } else {
      let date = new Date();
      date = date.toLocaleString().toString();
      const vote = e.target.name === "yes" ? 1 : 0;

      if (data.yes === 0 && data.no === 0) {
        console.log(vote, date, parseInt(data.project_id));
        try {
          await Ethqf.methods
            .castFirstVote(`${address}`, parseInt(data.project_id), vote, date)
            .send({ from: address });
        } catch (e) {
          alert(e.message);
          return;
        }
      } else {
        console.log(vote, date, parseInt(data.project_id));

        try {
          await Ethqf.methods
            .castVote(`${address}`, parseInt(data.project_id), vote)
            .send({ from: address });
        } catch (e) {
          alert(e.message);
          return;
        }
      }
      await axios.post("http://localhost:8000/setvote", {
        choice: e.target.name,
        project_id: data.project_id,
        installment_id: idx,
      });
      window.location.reload();
    }
  };

  useEffect(() => {
    getAddresses();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setStartEnd({
      start: new Date(installment_start).setMinutes(
        new Date(installment_start).getMinutes() + 3
      ),
      end: new Date(voting_end),
    });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {}, [contributors]);

  console.log(data, idx, voting_end, installment_start);
  return (
    <div className="cd-timeline-block">
      <div className="cd-timeline-img cd-movie"></div>

      <div className="cd-timeline-content" style={{ padding: "0px" }}>
        <h2 style={{ padding: "10px" }}>Update on Installment No. {idx + 1}</h2>
        <div
          id={`carouselExampleIndicators${idx}`}
          className="carousel slide"
          data-ride="carousel"
          data-interval={false}
        >
          <ol className="carousel-indicators">
            {data.image_url.length > 0 && (
              <li
                data-target={`#carouselExampleIndicators${idx}`}
                data-slide-to="0"
                className="active"
              ></li>
            )}
            {data.video_url.length > 0 && (
              <li
                data-target={`#carouselExampleIndicators${idx}`}
                data-slide-to="1"
              ></li>
            )}
            {data.description.length > 0 && (
              <li
                data-target={`#carouselExampleIndicators${idx}`}
                data-slide-to="2"
              ></li>
            )}
          </ol>
          <div className="carousel-inner">
            {data.image_url.length > 0 && (
              <div className="carousel-item active">
                <a href={data.image_url} target="_blank" rel="noreferrer">
                  <img
                    className="d-block w-100"
                    src={data.image_url}
                    alt="First slide"
                  />
                </a>
              </div>
            )}
            {data.video_url.length > 0 && (
              <div className="carousel-item">
                <embed
                  className="d-block w-100"
                  src={data.video_url}
                  alt="Second slide"
                />
              </div>
            )}
            {data.description.length > 0 && (
              <div className="carousel-item">{data.description}</div>
            )}
          </div>
          <a
            className="carousel-control-prev"
            href={`#carouselExampleIndicators${idx}`}
            role="button"
            data-slide="prev"
            style={{ color: "white", fontWeight: "700" }}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
              style={{ color: "white", fontWeight: "700" }}
            ></span>
            <span className="sr-only">Previous</span>
          </a>
          <a
            className="carousel-control-next"
            href={`#carouselExampleIndicators${idx}`}
            role="button"
            data-slide="next"
            style={{ color: "white", fontWeight: "700" }}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
              style={{ color: "white", fontWeight: "700" }}
            ></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
        <br />

        <span className="cd-date">Jan 18</span>
      </div>
      {contributors.includes(address.toUpperCase()) &&
      !isRoundActive &&
      startEnd.start &&
      startEnd.start.getTime() <= currentDate.getTime() &&
      startEnd.end.getTime() >= currentDate.getTime() ? (
        <>
          <Button
            variant="contained"
            style={{ margin: "10px", backgroundColor: "#02b663" }}
            name="yes"
            onClick={Vote}
          >
            Satisfied with the work
          </Button>
          <Button
            variant="contained"
            style={{ margin: "10px" }}
            color="error"
            name="no"
            onClick={Vote}
          >
            Terminate the Development
          </Button>
        </>
      ) : null}
    </div>
  );
};

export default UpdateDetails;
