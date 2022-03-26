import React, { useState, useEffect } from "react";
import Dtitle from "../Dtitle";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import axios from "axios";
import Button from "@mui/material/Button";
import Ethqf from "../../../Ethereum/eth_qf";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        style={{ color: "white" }}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? (
          <LastPageIcon style={{ color: "white", fontSize: "32px" }} />
        ) : (
          <FirstPageIcon style={{ color: "white", fontSize: "32px" }} />
        )}
      </IconButton>
      <IconButton
        style={{ color: "white", fontSize: "32px" }}
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight style={{ color: "white", fontSize: "32px" }} />
        ) : (
          <KeyboardArrowLeft style={{ color: "white", fontSize: "32px" }} />
        )}
      </IconButton>
      <IconButton
        style={{ color: "white", fontSize: "32px" }}
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft style={{ color: "white", fontSize: "32px" }} />
        ) : (
          <KeyboardArrowRight style={{ color: "white", fontSize: "32px" }} />
        )}
      </IconButton>
      <IconButton
        style={{ color: "white", fontSize: "32px" }}
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? (
          <FirstPageIcon style={{ color: "white", fontSize: "32px" }} />
        ) : (
          <LastPageIcon style={{ color: "white", fontSize: "32px" }} />
        )}
      </IconButton>
    </Box>
  );
}

const MyContributions = () => {
  const navigate = useNavigate();

  const address = useSelector((state) => state.user.address);
  const usd = useSelector((state) => state.user.usd);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [data, setData] = useState([]);
  const [projStatuses, setProjStatuses] = useState([]);
  // Avoid a layout jump when reaching the last page with empty rows.
  let emptyRows;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getDetails = async () => {
    const response = await Ethqf.getPastEvents("Contribution", {
      fromBlock: 0,
      filter: { contributor: address },
    });

    const response1 = await Ethqf.getPastEvents("Refund", {
      fromBlock: 0,
      filter: { contributor: address },
    });

    let ids = new Set();
    for (let val of response) {
      if (
        response1.filter(
          (d) =>
            d.returnValues.date.toString() ===
            response[0].returnValues.date.toString()
        ).length === 0
      ) {
        setData((oldArray) => [...oldArray, val.returnValues]);
        ids.add(val.returnValues.project_id);
      }
    }
    ids = [...ids];
    console.log(ids);
    emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - response.length) : 0;

    const projStatus = await axios.get(
      `http://localhost:8000/dashboarddata?${ids
        .map((n, index) => `project_ids[${index}]=${n}`)
        .join("&")}`
    );
    setProjStatuses(projStatus.data.ownerDetails);
  };

  useEffect(() => {
    getDetails();

    return () => {
      setData([]);
    };

    //eslint-disable-next-line
  }, []);

  console.log(data, projStatuses);

  const getRefund = async (e, donationAmount, id, date) => {
    let amt;

    const installment_ids = await Ethqf.methods
      .getProjectInstallmentDetails(parseInt(e.target.name))
      .call();
    amt = (installment_ids[1] / installment_ids[0]) * donationAmount;
    console.log(installment_ids, amt, id, date);
    await Ethqf.methods
      .refundContribution(amt, address, parseInt(id), date.toString())
      .send({ from: address });
  };

  // if (projStatuses.length === 0) return null;

  return (
    <div>
      <Dtitle title="My Contributions" />

      <TableContainer
        component={Paper}
        style={{ padding: "5rem", backgroundColor: "#000D6B" }}
      >
        <Table
          sx={{
            minWidth: 500,
            border: "5px solid black",
            borderRadius: "30px",
          }}
          aria-label="custom pagination table"
        >
          <TableHead>
            <TableRow
              style={{
                backgroundColor: "black",
                border: "2px solid white",
                borderRadius: "50px",
              }}
            >
              <TableCell style={{ color: "white", fontSize: "22px" }}>
                Project ID
              </TableCell>
              <TableCell style={{ color: "white", fontSize: "22px" }}>
                Date
              </TableCell>
              <TableCell style={{ color: "white", fontSize: "22px" }}>
                Donation Amount
              </TableCell>

              <TableCell style={{ color: "white", fontSize: "22px" }}>
                Status
              </TableCell>
              <TableCell style={{ color: "white", fontSize: "22px" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody
            style={{
              backgroundColor: "grey",
              color: "black",
              border: "2px solid white",
            }}
          >
            {(data.length > 5
              ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : data
            ).map((row, key) => (
              <TableRow key={key} style={{ border: "2px solid white" }}>
                <TableCell style={{ width: 200, fontSize: "20px" }}>
                  {row.project_id}
                </TableCell>
                <TableCell style={{ width: 360, fontSize: "20px" }}>
                  {row.date}
                </TableCell>
                <TableCell style={{ width: 360, fontSize: "20px" }}>
                  {parseInt(row.amount) / Math.pow(10, 18)}{" "}
                  <i className="fab fa-ethereum"></i>
                  {"\u00A0"} {"\u00A0"}
                  {(usd * (parseInt(row.amount) / Math.pow(10, 18))).toFixed(
                    3
                  )}{" "}
                  $
                </TableCell>
                <TableCell style={{ width: 250, fontSize: "20px" }}>
                  {" "}
                  {
                    projStatuses.length > 0 &&
                      projStatuses.filter(
                        (data) => data.project_id === row.project_id
                      )[0].status
                    // === "Disqualified" ? (
                    //   <>
                  }
                  <Button
                    variant="contained"
                    name={`${row.project_id}`}
                    onClick={(e) =>
                      getRefund(
                        e,
                        parseInt(row.amount),
                        row.project_id,
                        row.date
                      )
                    }
                  >
                    Get Refund
                  </Button>
                  {/* //   </>
                  // ) : (
                    // projStatuses.filter(
                    //   (data) => data.project_id === row.project_id
                    // )[0].status
                  } */}
                </TableCell>
                <TableCell style={{ fontSize: "20px", width: 250 }}>
                  {" "}
                  <span
                    style={{ cursor: "pointer", fontWeight: "700" }}
                    onClick={() =>
                      navigate(`/projectDetails`, {
                        state: { data: `${row.project_id}` },
                      })
                    }
                  >
                    View Project
                  </span>
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow
                style={{ height: 53 * emptyRows, border: "2px solid white" }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            {/* <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  style: { color: "grey", fontSize: "18px" },
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                style={{
                  color: "white",
                  backgroundColor: "black",
                  border: "2px solid white",
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              /> */}
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                style={{ color: "white", fontSize: "21px" }}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                //component={Box}
                labelDisplayedRows={({ page }) => {
                  return (
                    <span style={{ color: "white", fontSize: "19px" }}>
                      Page: {page}
                    </span>
                  );
                }}
                backIconButtonProps={{
                  color: "secondary",
                }}
                nextIconButtonProps={{ color: "secondary" }}
                showFirstButton={true}
                showLastButton={true}
                labelRowsPerPage={<span>Rows per page :</span>}
                sx={{
                  ".MuiTablePagination-toolbar": {
                    backgroundColor: "black",
                  },
                  ".MuiTablePagination-selectLabel, .MuiTablePagination-input":
                    {
                      fontWeight: "bold",
                      color: "white",
                      fontSize: "18px",
                    },
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MyContributions;
