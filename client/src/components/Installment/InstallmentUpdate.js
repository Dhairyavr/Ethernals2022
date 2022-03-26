import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase/firebase";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            backgroundColor: "black",
          }}
        >
          <CloseIcon style={{ color: "white" }} />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function InstallmentUpdate({
  openUpdate,
  handleCloseOpenUpdate,
  project,
  installment_id,
}) {
  const [data, setData] = useState({
    image: null,
    video: null,
    description: "",
  });
  const [transferData, setTransferData] = useState({
    image: "",
    video: "",
    description: "",
  });

  const [progress, setProgress] = useState({ image: 0, video: 0 });

  const SubmitData = (e) => {
    console.log(data);
    e.preventDefault();
    const storage = getStorage(app);

    const metadata = {
      contentType: "image/jpeg",
    };

    if (data.image) {
      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, "images/" + data.image.name);
      const uploadTask = uploadBytesResumable(storageRef, data.image, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress({ ...progress, image: prog });
          console.log("Upload is " + prog + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;

            default:
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;

            default:
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setTransferData({ ...transferData, image: downloadURL });
          });
        }
      );
    }

    if (data.video) {
      const storageRefVideo = ref(storage, "videos/" + data.video.name);
      const uploadTaskVideo = uploadBytesResumable(
        storageRefVideo,
        data.video,
        metadata
      );

      uploadTaskVideo.on(
        "state_changed",
        (snapshot) => {
          const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress({ ...progress, video: prog });
          console.log("Upload is " + prog + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;

            default:
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;

            default:
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTaskVideo.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            setTransferData({ ...transferData, video: downloadURL });
          });
        }
      );
    }

    setTransferData({ ...transferData, description: data.description });
  };

  const storeUpdate = async () => {
    let obj = transferData;
    obj.round_id = project.round_id;
    obj.project_id = project.project_id;
    obj.installment_id = installment_id.toString();
    console.log(obj);
    const response = await axios.post(
      "http://localhost:8000/setInstallmentData",
      obj
    );

    console.log(response);
  };

  useEffect(() => {
    if (
      transferData.description.length > 0 ||
      transferData.image.length > 0 ||
      transferData.video.length > 0
    ) {
      storeUpdate();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <BootstrapDialog
      onClose={handleCloseOpenUpdate}
      aria-labelledby="customized-dialog-title"
      open={openUpdate}
      sx={{
        boxShadow: "10px",
        border: "2px solid white",
      }}
      maxWidth="lg"
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleCloseOpenUpdate}
        style={{
          backgroundColor: "black",
          color: "white",
          fontSize: "24px",
          fontWeight: "700",
        }}
      >
        Update the current progress
      </BootstrapDialogTitle>
      <DialogContent
        dividers
        style={{
          backgroundColor: "black",
          color: "white",
          height: "30rem",
          width: "50rem",
        }}
      >
        <Typography gutterBottom component={"span"}>
          <form onSubmit={SubmitData}>
            <span
              style={{ color: "white", fontSize: "18px", fontWeight: "500" }}
            >
              Upload Any Video
            </span>
            <Button
              variant="contained"
              component="label"
              style={{ width: "100%", height: "3rem", margin: "10px 0 30px 0" }}
            >
              Upload Video
              <input
                type="file"
                hidden
                onChange={(e) => {
                  setData({ ...data, video: e.target.files[0] });
                }}
              />
            </Button>
            <LinearProgress
              color="success"
              style={{ color: "green" }}
              variant="determinate"
              value={progress.video}
            />

            <br />
            <span
              style={{ color: "white", fontSize: "18px", fontWeight: "500" }}
            >
              Upload Any Image
            </span>
            <Button
              variant="contained"
              component="label"
              style={{ width: "100%", height: "3rem" }}
            >
              Upload Image
              <input
                type="file"
                hidden
                onChange={(e) => {
                  setData({ ...data, image: e.target.files[0] });
                }}
              />
            </Button>
            <br />
            <br />
            <LinearProgress
              color="success"
              style={{ color: "green" }}
              variant="determinate"
              value={progress.image}
            />

            <br />
            <br />
            <span
              style={{ color: "white", fontSize: "18px", fontWeight: "500" }}
            >
              {" "}
              Provide Details About the Update
            </span>
            <textarea
              style={{
                height: "7rem",
                backgroundColor: "rgba(243, 244, 246, 0.8)",
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: "22px",
                borderRadius: "6px",
                padding: "8px 16px",
                color: "#12022f",
                marginTop: "8px",
              }}
              type="textarea"
              name="description"
              placeholder="Description"
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
            <br />
            <br />
            <Button
              type="submit"
              variant="contained"
              color="success"
              style={{ margin: "0 auto", display: "flex" }}
            >
              {" "}
              Submit Progress
            </Button>
          </form>
        </Typography>
      </DialogContent>
    </BootstrapDialog>
  );
}
