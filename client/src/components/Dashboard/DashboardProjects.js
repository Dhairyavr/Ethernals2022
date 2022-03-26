import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./Dboard.css";

const DashboardProjects = ({ data }) => {
  console.log(data);
  return (
    <div
      className="col-4"
      style={{
        marginBottom: "15px",
      }}
    >
      <Card
        sx={{ maxWidth: 345 }}
        style={{
          border: "3px solid black",
          borderRadius: "20px",
          width: "15rem",
          backgroundColor: "#f2f2f2",
        }}
      >
        <img
          src={data.logo}
          className="card-img-top"
          alt="..."
          style={{
            borderRadius: "20px",
            height: "12rem",
            position: "relative",
          }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            <h5
              className="card-title "
              style={{
                margin: "7px",
                fontWeight: "900",
                fontFamily: "Georgia",
              }}
            >
              {data.title}
            </h5>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <span
              className=""
              style={{
                fontWeight: "500",
                fontSize: "18px",
                marginLeft: "7px",
                fontFamily: "Georgia",
              }}
            >
              Goal: <span>$ {data.amount_to_raise}</span>
              <br />
              Raised: <span>${data.crowdfundAmount}</span>
            </span>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProjects;
