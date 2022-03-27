import React, { useMemo, useState, useEffect } from "react";
import "./form-style.css";
import { useDropzone } from "react-dropzone";
// import web3 from "../Ethereum/web3";
import Ethqf from "../Ethereum/eth_qf";
import { useMoralis } from "react-moralis";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/user";
import axios from "axios";
import web3 from "../Ethereum/web3";
const { create } = require("ipfs-http-client");
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

const baseStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#1a1e2d",
  transition: "border .3s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const Newproject = () => {
  const [Project, setProject] = useState({
    logo: "",
    title: "",
    description: "",
    amount_to_raise: "",
    no_of_installments: "",
    github_url: "",
    website_url: "",
    linkedin_url: "",
    tags: [],
    category: "",
  });

  const dispatch = useDispatch();
  const address = useSelector((state) => state.user.address);
  const isRoundActive = useSelector((state) => state.user.isRoundActive);
  const details = useSelector((state) => state.user.details);
  const { Moralis, authenticate } = useMoralis();

  const [filename, setFilename] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const DropzoneComponent = () => {
    const CaptureFile = async (event) => {
      event.preventDefault();
      const file = event.target.files[0];
      console.log(file);
      setSelectedFile(file);
      setFilename(file.name);
    };

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
    } = useDropzone({});

    const style = useMemo(
      () => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
      }),
      [isDragActive, isDragReject, isDragAccept]
    );

    return (
      <section>
        <div {...getRootProps({ style })}>
          <input
            {...getInputProps()}
            onChange={CaptureFile}
            style={{ height: "4rem", display: "none" }}
          />
          <div>
            {filename.length > 0 ? filename : "Drag and Drop or Browse."}
          </div>
        </div>
      </section>
    );
  };

  const Submit = async (event) => {
    event.preventDefault();

    if (address === "") {
      await authenticate();
      dispatch(setUser(Moralis.User.current().get("ethAddress")));
    }

    const ipfsHash = await ipfs.add(selectedFile);
    setProject({ ...Project, logo: `https://ipfs.io/ipfs/${ipfsHash.path}` });
    console.log(Project, ipfsHash);
  };

  const StoreDetails = async () => {
    const hash = await ipfs.add(JSON.stringify(Project));

    console.log(hash, Project);
    let date = new Date();
    date = date.toLocaleString().toString();

    const accounts = await web3.eth.getAccounts();
    try {
      const ids = await Ethqf.methods.getDetails().call();
      console.log(ids, details);
      // const response = await axios.post(
      //   "http://localhost:8000/setprojectdata",
      //   {
      //     round_id: `${ids[0]}`,
      //     project_id: `${parseInt(ids[1])}`,
      //     owner: `${details._id}`,
      //     status: "Project Listed",
      //     no_of_installments: `${Project.no_of_installments}`,
      //   }
      // );
      await Ethqf.methods
        .createProject(
          `${address}`,
          `https://ipfs.io/ipfs/${hash.path}`,
          parseInt(Project.no_of_installments),
          date,
          Project.amount_to_raise
        )
        .send({
          from: accounts[0],
          // signatureType: biconomy.EIP712_SIGN,
          // gasLimit: 250000,
        });

      // console.log(response);
    } catch (e) {
      alert(e.message);
    }
  };

  useEffect(() => {
    if (Project.logo.length > 0) StoreDetails();
    //eslint-disable-next-line
  }, [Project.logo]);

  const txtarea = {
    padding: "8px 15px",
    borderRadius: "5px !important",
    margin: "5px 0px",
    boxSizing: "border-box",
    fontSize: "18px !important",
    fontWeight: "300",
  };

  console.log(Project, isRoundActive, details);

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
                <div className="Sponsor_img"></div>
                <h1 className="Sponsor_heading__zO1-B">List your project</h1>
                <h4 style={{ textAlign: "center" }}>
                  Showcase your work & get funded by the community!
                </h4>
                <hr className="Sponsor_separator__iyntA" />
                <form onSubmit={Submit}>
                  {" "}
                  <label className="Sponsor_label__2bYvs">
                    Upload Project Logo{" "}
                  </label>
                  <div>
                    <DropzoneComponent />
                  </div>
                  {/* <textarea
                    rows="6"
                    className="Sponsor_input__UHgsl"
                    placeholder="Briefly state the updates made to the project."
                  ></textarea> */}
                  <br />
                  <label className="Sponsor_label__2bYvs">
                    Project Title <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="Sponsor_input__UHgsl"
                    required
                    style={{ height: "4rem", fontSize: "22px" }}
                    value={Project.title}
                    placeholder="Project Title"
                    onChange={(e) =>
                      setProject({
                        ...Project,
                        title: e.target.value,
                      })
                    }
                  />
                  <br />
                  <br />
                  <label className="Sponsor_label__2bYvs">
                    Project Description
                    <span className="text-danger"> *</span>
                  </label>
                  <textarea
                    rows={6}
                    className="Sponsor_input__UHgsl"
                    name="description"
                    style={{
                      fontSize: "22px",
                      margin: "0px",
                      height: "7rem",
                      padding: "0px",
                    }}
                    value={Project.description}
                    placeholder="Describe your project "
                    required
                    onChange={(e) =>
                      setProject({
                        ...Project,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                  <br />
                  <br />
                  <label className="Sponsor_label__2bYvs">
                    Amount to be Raised (in USD){" "}
                    <span className="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    className="Sponsor_input__UHgsl"
                    name="raised_amount"
                    placeholder="Amount to be Raised"
                    required
                    style={{ height: "4rem", fontSize: "22px" }}
                    value={Project.amount_to_raise}
                    onChange={(e) => {
                      if (!parseInt(e.target.value)) {
                        setProject({
                          ...Project,
                          no_of_installments: "",
                          amount_to_raise: "",
                        });
                      } else if (parseInt(e.target.value) < 1000) {
                        console.log("1");
                        setProject({
                          ...Project,
                          no_of_installments: "3",
                          amount_to_raise: e.target.value,
                        });
                      } else if (
                        parseInt(e.target.value) >= 1000 &&
                        parseInt(e.target.value) <= 5000
                      ) {
                        console.log("10");
                        setProject({
                          ...Project,
                          no_of_installments: "5",
                          amount_to_raise: e.target.value,
                        });
                      } else {
                        console.log("100");
                        setProject({
                          ...Project,
                          no_of_installments: "7",
                          amount_to_raise: e.target.value,
                        });
                      }
                      console.log(parseInt(e.target.value));
                    }}
                  />
                  <br />
                  <br />
                  <label className="Sponsor_label__2bYvs">
                    Number of installments
                  </label>
                  <input
                    type="text"
                    className="Sponsor_input__UHgsl"
                    name="installments"
                    disabled
                    style={{ height: "4rem", fontSize: "22px" }}
                    value={Project.no_of_installments}
                    placeholder="Number Of Installments"
                    required
                    // onChange={(e) =>
                    //   setProject({
                    //     ...Project,
                    //     no_of_installments: e.target.value,
                    //   })
                    // }
                  />
                  <br />
                  <br />
                  <label className="Sponsor_label__2bYvs">
                    Github URL <span className="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    name="github_url"
                    className="Sponsor_input__UHgsl"
                    value={Project.github_url}
                    required
                    placeholder="Github URL"
                    onChange={(e) =>
                      setProject({
                        ...Project,
                        github_url: e.target.value,
                      })
                    }
                    style={{ height: "4rem", fontSize: "22px" }}
                  />
                  <br />
                  <br />
                  <label className="Sponsor_label__2bYvs">
                    Project Website
                    <span className="text-danger"> *</span>
                  </label>
                  <input
                    type="text"
                    name="website_url"
                    className="Sponsor_input__UHgsl"
                    value={Project.website_url}
                    placeholder="Website URL"
                    onChange={(e) =>
                      setProject({
                        ...Project,
                        website_url: e.target.value,
                      })
                    }
                    style={{ height: "4rem", fontSize: "22px" }}
                  />
                  <br />
                  <br />
                  <label className="Sponsor_label__2bYvs">
                    LinkedIn URL
                    <span className="text-danger"> *</span>
                  </label>{" "}
                  <input
                    type="text"
                    name="ans"
                    required
                    className="Sponsor_input__UHgsl"
                    value={Project.linkedin_url}
                    placeholder="LinkedIn URL"
                    onChange={(e) =>
                      setProject({
                        ...Project,
                        linkedin_url: e.target.value,
                      })
                    }
                    style={{ height: "4rem", fontSize: "22px" }}
                  />
                  <br />
                  <br />
                  <label className="Sponsor_label__2bYvs">Category</label>
                  <select
                    className="Sponsor_input__UHgsl"
                    value={Project.category}
                    onChange={(e) =>
                      setProject({
                        ...Project,
                        category: e.target.value,
                      })
                    }
                    style={{
                      height: "3rem",
                      margin: "0px",
                      padding: "0px",
                    }}
                  >
                    <option defaultValue>Choose...</option>
                    <option value="DAPP Tech">DAPP Tech</option>
                    <option value="Infra Tech">Infra Tech</option>
                    <option value="NFTs">NFTs</option>
                  </select>
                  <br />
                  <br />
                  <label className="Sponsor_label__2bYvs">Tags</label>{" "}
                  <div>
                    <select
                      className="Sponsor_input__UHgsl"
                      value={Project.tags.at(-1)}
                      onChange={(e) =>
                        setProject({
                          ...Project,
                          tags: [...Project.tags, e.target.value],
                        })
                      }
                      style={{ width: "100%" }}
                    >
                      <option
                        defaultValue
                        style={{
                          margin: "0px",
                          padding: "0px",
                        }}
                      >
                        Choose...
                      </option>
                      <option value="eth 2.0">eth 2.0</option>
                      <option value="Security">Security</option>
                      <option value="Community">Community</option>
                    </select>
                  </div>
                  <div style={{ display: "inline" }}>
                    {Project.tags.map((value, idx) => (
                      <span style={{ padding: "5px" }} key={idx}>
                        {value}
                      </span>
                    ))}
                  </div>
                  <br />
                  <br />
                  <br />
                  <br />
                  {isRoundActive ? (
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
                      No funding round currently active{" "}
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

export default Newproject;
