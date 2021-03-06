import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import defaultuser from "./default-user.png";
import Avatar from "@mui/material/Avatar";
import { setDetails } from "../../redux/user";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./Dboard.css";

const Personalinfo = () => {
  const dispatch = useDispatch();

  const details1 = useSelector((state) => state.user.details);
  const address = useSelector((state) => state.user.address);

  const { Moralis } = useMoralis();

  const [flag, Setflag] = useState(false);
  const [details, Setdetails] = useState({
    wallet_address: address,
    profile_img: null,
    email: "",
    fname: "",
    lname: "",
    website: "",
    description: "",
  });
  const [display, setdisplay] = useState(null);
  const [file, Setfile] = useState(null);

  const frm = {
    backgroundColor: "white",
    border: "5px solid black",
    width: "80%",
    padding: "50px 70px",
    borderTopLeftRadius: "30px",
    borderTopRightRadius: "30px",
    borderBottomLeftRadius: "30px",
    borderBottomRightRadius: "30px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.075)",
  };

  const frmItem = {
    borderRadius: "20px",
    marginBottom: "25px",
    padding: "20px 20px",
  };

  const Setdata = async (e) => {
    e.preventDefault();
    console.log(file, details.profile_img);
    Setdetails({
      ...details,
      profile_img: null,
    });
    Setdetails({
      ...details,
      profile_img: file,
    });
    console.log("if");
    if (file) {
      const f = await new Moralis.File(file.name, file);
      await f.saveIPFS({ useMasterKey: true });
      console.log(f.ipfs());
      Setdetails({ ...details, profile_img: `${f.ipfs()}` });
    }
    Setflag(true);
  };

  const Change = (e) => {
    let reader = new window.FileReader();
    let temp = e.target.files[0];
    console.log(e.target.files[0]);
    setdisplay(URL.createObjectURL(e.target.files[0]));
    reader.readAsArrayBuffer(temp);
    Setfile(temp);
  };

  useEffect(() => {
    if (details1) {
      Setdetails(details1);
      setdisplay(details1.profile_img);
    }
    // eslint-disable-next-line
  }, [details1]);

  const Senddata = async () => {
    if (flag) {
      const response = await axios.post(
        "http://localhost:8000/setuserinfo",
        details
      );
      dispatch(
        setDetails({
          wallet_address: details.wallet_address,
          email: details.email,
          fname: details.fname,
          lname: details.lname,
          website: details.website,
          profile_img: details.profile_img,
          description: details.description,
        })
      );
      console.log(response);
      Setflag(false);
    }
  };

  useEffect(() => {
    Senddata();
    // eslint-disable-next-line
  }, [flag]);

  console.log(details, file, flag, display);

  return (
    <div className="col" style={{ width: "100%" }}>
      <div className="registration-form" style={frm}>
        <h3>My Information</h3>

        <form onSubmit={Setdata}>
          <div className="row">
            <div className="col-3" style={{ margin: "0px", padding: "0px" }}>
              <Avatar
                alt="Remy Sharp"
                style={{ margin: "0px", padding: "0px", lineHeight: "0" }}
                src={display ? display : defaultuser}
                variant="square"
                sx={{ width: 126, height: 126 }}
              />
            </div>
            <div className="col-3">
              <input
                type="file"
                style={{ border: "1px solid white" }}
                onChange={Change}
              />
            </div>
          </div>
          <br />
          <br />
          <div className="form-group">
            <input
              style={frmItem}
              type="email"
              className="Sponsor_input__UHgsl"
              name="email"
              value={details.email}
              onChange={(e) =>
                Setdetails({ ...details, email: e.target.value })
              }
              placeholder="Email"
            />
          </div>
          <div className="form-group">
            <input
              style={frmItem}
              type="text"
              className="Sponsor_input__UHgsl"
              name="fname"
              value={details.fname}
              onChange={(e) =>
                Setdetails({ ...details, fname: e.target.value })
              }
              placeholder="FirstName"
            />
          </div>
          <div className="form-group">
            <input
              style={frmItem}
              type="text"
              className="Sponsor_input__UHgsl"
              name="lname"
              value={details.lname}
              onChange={(e) =>
                Setdetails({ ...details, lname: e.target.value })
              }
              placeholder="LastName"
            />
          </div>
          <div className="form-group">
            <input
              style={frmItem}
              type="text"
              className="Sponsor_input__UHgsl"
              name="website"
              value={details.website}
              onChange={(e) =>
                Setdetails({ ...details, website: e.target.value })
              }
              placeholder="Website"
            />
          </div>
          <div className="form-group">
            <textarea
              style={{ height: "5rem" }}
              type="textarea"
              className="Sponsor_input__UHgsl"
              name="description"
              value={details.description}
              onChange={(e) =>
                Setdetails({ ...details, description: e.target.value })
              }
              placeholder="Description"
            />
          </div>

          <button className="theme_btn theme_btn_bg" type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default Personalinfo;
