import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useDispatch, useSelector } from "react-redux";
import { setDetails, setUser } from "../redux/user";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const {
    Moralis,
    authenticate,
    isAuthenticated,
    user,
    logout,
    isAuthenticating,
  } = useMoralis();
  const dispatch = useDispatch();

  const addr = useSelector((state) => state.user.address);

  const Setdata = async (add) => {
    console.log(add);
    axios
      .get("http://localhost:8000/userinfo", {
        params: { wallet_address: add },
      })
      .then((response) => {
        console.log(response.data.response[0], response.data.response.length);

        if (response.data.response.length > 0) {
          dispatch(
            setDetails({
              wallet_address: add,
              email: response.data.response[0].email,
              fname: response.data.response[0].fname,
              lname: response.data.response[0].lname,
              website: response.data.response[0].website,
              profile_img: response.data.response[0].profile_img,
              description: response.data.response[0].description,
              _id: response.data.response[0]._id,
            })
          );
        }
      });
  };

  useEffect(() => {
    if (isAuthenticated && addr.length === 0 && !isAuthenticating) {
      console.log(user.get("ethAddress"));
      dispatch(setUser(user.get("ethAddress")));

      Setdata(user.get("ethAddress"));
    }

    //eslint-disable-next-line
  }, [isAuthenticated, addr]);
  useEffect(() => {
    Moralis.onAccountsChanged(async (add) => {
      console.log(add);
      dispatch(setUser(add[0]));
      axios
        .get("http://localhost:8000/userinfo", {
          params: { wallet_address: add[0] },
        })
        .then((response) => {
          delete response.data.response[0]._id;
          return response;
        })
        .then((response) => {
          console.log(response.data.response[0], response.data.response.length);

          if (response.data.response.length > 0) {
            dispatch(
              setDetails({
                wallet_address: add,
                email: response.data.response[0].email,
                fname: response.data.response[0].fname,
                lname: response.data.response[0].lname,
                website: response.data.response[0].website,
                profile_img: response.data.response[0].profile_img,
                description: response.data.response[0].description,
                _id: response.data.response[0]._id,
              })
            );
          } else {
            dispatch(
              setDetails({
                wallet_address: add,
                email: "abcd@gmail.com",
                fname: "Bob",
                lname: "Smith",
                website: "https://google.com",
                profile_img: null,
                description: "hello everyone",
                _id: "",
              })
            );
          }
        })
        .then(() => {
          window.location.reload();
        });
    });
    //eslint-disable-next-line
  }, []);
  console.log(user, isAuthenticated, isAuthenticating);

  return (
    <div>
      <header id="top-menu" style={{ background: " #1a1e2d" }}>
        <div className="main-header-area main-head-02">
          <div className="container custom-container">
            <div className="row align-items-center justify-content-between">
              <div className="col-xl-2 col-lg-2 col-md-6 col-6">
                <div className="logo">
                  <a
                    className="logo-img"
                    href="/"
                    style={{
                      color: "white",
                      fontSize: "38px",
                      fontWeight: "700",
                    }}
                  >
                    FundGoal
                  </a>
                </div>
              </div>
              <div className="col-xl-7 col-lg-9 d-none d-lg-block text-lg-center text-xl-right">
                <div className="main-menu d-none d-lg-block">
                  <nav>
                    <ul>
                      <li>
                        <a href="/">Home</a>
                      </li>
                      <li>
                        <a href="/about">About</a>
                      </li>

                      <li>
                        <a href="/projects">Projects</a>
                      </li>
                      <li>
                        <a href="/sponsor">Sponsor</a>
                      </li>
                      <li>
                        <a href="/contact">Contact</a>
                      </li>
                      {addr.length > 0 && !isAuthenticating && (
                        <li>
                          <a href="/dashboard">Dashboard</a>
                        </li>
                      )}
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-xl-3 col-lg-1 col-md-6 col-6 text-right">
                <div className="hamburger-menu d-lg-block d-xl-none">
                  <a href="#/">
                    <i className="far fa-bars"></i>
                  </a>
                </div>
                <div
                  className="theme_btn theme_btn_bg"
                  onClick={() => {
                    addr.length > 0 ? (
                      <>
                        {logout()}
                        {dispatch(setUser(""))}
                        {dispatch(
                          setDetails({
                            wallet_address: "",
                            email: "abcd@gmail.com",
                            fname: "Bob",
                            lname: "Smith",
                            website: "https://google.com",
                            profile_img: null,
                            description: "hello everyone",
                            _id: "",
                          })
                        )}
                        {navigate("/")}
                      </>
                    ) : (
                      authenticate()
                    );
                  }}
                >
                  {addr.length > 0 ? (
                    <>
                      {addr[0]}
                      {addr[1]}
                      {addr[2]}
                      {addr[3]}
                      {addr[4]}
                      {addr[5]}.....
                      {addr.slice(-4)}{" "}
                    </>
                  ) : (
                    "Connect Wallet"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
