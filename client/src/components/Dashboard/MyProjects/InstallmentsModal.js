import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import Installments from "../../Installment/Installments";
import { styled } from "@mui/material/styles";
import axios from "axios";
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
            color: "black",
          }}
        >
          <CloseIcon style={{ color: "white" }} />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const InstallmentsModal = ({ open, handleClose, data }) => {
  const installment_voting_dates = useSelector(
    (state) => state.user.installment_voting_dates
  );
  const [installmentData, setInstallmentData] = useState(null);

  const getInstallmentData = async () => {
    const resp = await axios.get("http://localhost:8000/getinstallmentdata", {
      params: { project_id: data.project_id },
    });
    console.log(resp.data.details);
    setInstallmentData(resp.data.details);
  };

  useEffect(() => {
    getInstallmentData();
    // eslint-disable-next-line
  }, []);

  console.log(installmentData);

  return (
    <div>
      <BootstrapDialog
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
              {installmentData !== null &&
                [...Array(parseInt(data.no_of_installments))].map((x, i) => (
                  <Installments
                    key={i}
                    project={data}
                    installment_id={i}
                    installment_date={
                      data.no_of_installments === "3"
                        ? installment_voting_dates[0].installment_start_3[i]
                        : data.no_of_installments === "5"
                        ? installment_voting_dates[0].installment_start_5[i]
                        : installment_voting_dates[0].installment_start_7[i]
                    }
                    installment_details={
                      installmentData.length > i ? installmentData[i] : null
                    }
                  />
                ))}
            </div>
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};

export default InstallmentsModal;
