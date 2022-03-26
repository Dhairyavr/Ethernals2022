import React, { useEffect, useState } from "react";
import "./installments.css";
import InstallmentUpdate from "./InstallmentUpdate";
import Ethqf from "../../Ethereum/eth_qf";
import { useSelector } from "react-redux";
const Installments = ({
  project,
  installment_id,
  installment_date,
  installment_details,
}) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [status, setStatus] = useState("Pending");

  const usd = useSelector((state) => state.user.usd);
  const address = useSelector((state) => state.user.address);

  const handleClickOpenUpdate = () => {
    setOpenUpdate(true);
  };
  const handleCloseOpenUpdate = () => {
    setOpenUpdate(false);
  };

  const GetInstallmentMoney = async () => {
    let date = new Date();
    date = date.toLocaleString().toString();

    if (parseInt(installment_id) + 1 === 1) {
      const temp = await Ethqf.methods
        .projects(parseInt(project.project_id))
        .call();

      let details = await Ethqf.methods
        .projectDetails(parseInt(project.project_id))
        .call();

      console.log(details, project.id);

      let amt =
        (parseInt((parseInt(details[3]) / parseInt(details[1])) * details[0]) +
          parseInt(details[2])) /
        parseInt(project.no_of_installments);

      console.log(amt, amt / Math.pow(10, 18));

      if (
        parseInt(temp.amountToRaise) <
        parseInt(
          parseFloat(parseInt(amt) / Math.pow(10, 18)) *
            parseInt(project.no_of_installments) *
            parseInt(usd)
        )
      ) {
        amt =
          parseFloat(parseInt(temp.amountToRaise) / parseInt(usd)) /
          parseInt(project.no_of_installments);

        //  await Ethqf.methods.retrieveFirstInstallment(`${address}`,project.project_id,parseInt(amt),date).send({from:address})
      } else {
        //  await Ethqf.methods.retrieveFirstInstallment(`${address}`,project.project_id,parseInt(amt),date).send({from:address})
      }
    } else {
      await Ethqf.methods
        .retrieveInstallment(`${address}`, project.project_id, date)
        .send({ from: address });
    }
  };

  let currentDate = new Date();
  const [startEnd, setStartEnd] = useState({
    start: null,
    end: null,
  });

  console.log(installment_date, project, installment_details, installment_id);

  useEffect(() => {
    setStartEnd({
      start: new Date(installment_date),
      end: new Date(
        new Date(installment_date).setMinutes(
          new Date(installment_date).getMinutes() + 3
        )
      ),
    });

    // eslint-disable-next-line
  }, [setStartEnd]);

  return (
    <div className="col-6">
      <div className="card card-1">
        <div className="card__icon">
          <i className="fas fa-bolt"></i>
        </div>
        <p className="card__exit">
          <i className="fas fa-times"></i>
        </p>
        <span className="card__title" style={{ margin: "0px" }}>
          <span
            style={{
              color: "black",
              fontSize: "20px",
              fontWeight: "700",
              marginRight: "10px",
            }}
          >
            Installment Status :
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            {/* Pending/Approved/ Awaiting Update */}
            {status}
          </span>
          <br />
          <br />
          <span
            style={{
              color: "black",
              fontSize: "18px",
              fontWeight: "700",
              marginRight: "10px",
            }}
          >
            {startEnd.start &&
              `Start Date : ${startEnd.start.toLocaleString()}`}{" "}
            <br />
            {startEnd.start && `End Date : ${startEnd.end.toLocaleString()}`}
          </span>
        </span>
        <br />
        <div className="card__apply">
          <button
            className="theme_btn theme_btn_bg "
            onClick={handleClickOpenUpdate}
            style={{
              marginTop: "2.5rem",
              width: "13rem",
              height: "4rem",
              padding: "0px",
              fontSize: "14px",
              marginRight: "2rem",
            }}
            disabled={
              startEnd.start &&
              (startEnd.start.getTime() <= currentDate.getTime() &&
              startEnd.end.getTime() >= currentDate.getTime()
                ? false
                : true)
            }
          >
            Provide an Update <i className="fas fa-arrow-right"></i>
          </button>
          {openUpdate && (
            <InstallmentUpdate
              openUpdate={openUpdate}
              handleCloseOpenUpdate={handleCloseOpenUpdate}
              project={project}
              installment_id={installment_id}
            />
          )}
          <button
            className="theme_btn theme_btn_bg "
            style={{
              marginTop: "2.5rem",
              width: "13rem",
              height: "4rem",
              padding: "0px",
              fontSize: "14px",
            }}
            onClick={GetInstallmentMoney}
          >
            Retreive Payout{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Installments;
