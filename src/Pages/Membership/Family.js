import React, { useState, useEffect } from "react";
import axios from "axios";
import AppBarComponent from "../../Components/AppBarComponent";
import DrawerComponent from "../../Components/DrawerComponent";
import {
  Box,
  Card,
  CardContent,
  CssBaseline,
  Breadcrumbs,
  IconButton,
  Button,
} from "@mui/material";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DataGrid } from "@mui/x-data-grid";
import { BASE_URL } from "../../BaseUrl";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";



const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

//! Family Component
const Family = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  //! Drawer Handlers
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };



//! Tokens and Headers
const user = JSON.parse(sessionStorage.getItem("user"));

const headers = {
  "Content-type": "application/json",
  Authorization: "Bearer " + user.accessToken,
};




  const handleOpenDialog = () => {
   // Add your dialog opening logic here
   console.log("Dialog opened!");
  };

  //! Table Columns
  const columns = [
    {
      field: "membershipId",
      headerName: "ID",
      width: 70,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "applicationNumber",
      headerName: "Application Number",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "membershipCode",
      headerName: "Membership Code",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "referanceMembershipCode",
      headerName: "Reference Membership Code",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "isAlive",
      headerName: "Is Alive",
      width: 100,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "chainStatus",
      headerName: "Chain Status",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "fullName",
      headerName: "Full Name",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "dob",
      headerName: "Date of Birth",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "age",
      headerName: "Age",
      width: 100,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "bloodGroup",
      headerName: "Blood Group",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "alternativeMobileNumber",
      headerName: "Alternative Mobile Number",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "gothra",
      headerName: "Gothra",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "emailId",
      headerName: "Email ID",
      width: 200,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "applicationNumber",
      headerName: "Application Number",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "isMarried",
      headerName: "Is Married",
      width: 100,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "femaleFamilyRefMembershipCode",
      headerName: "Female Family Ref Membership Code",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "occupation",
      headerName: "Occupation",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "qualification",
      headerName: "Qualification",
      width: 150,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "address",
      headerName: "Address",
      width: 200,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "city",
      headerName: "City",
      width: 130,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "country",
      headerName: "Country",
      width: 130,
      renderCell: (params) => params.value || "Not Available",
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEdit(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  const handleEdit = (row) => {
    console.log("Edit button clicked for row:", row);

    // Add your edit logic here
  };

  //! Fetch Data from API
  useEffect(() => {
    axios
      .get(
        `https://executivetracking.cloudjiffy.net/Mahaasabha/membership/v1/getAllApplicationNoMembershipByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
        { headers }
      )
      .then((response) => {
        console.log(response);
        const rowsWithId = response.data.content.map((row) => ({
          id: row.membershipId,
          ...row,
        }));
        setRows(rowsWithId); // Set the table data from API
        setLoading(false); // Turn off loading spinner
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CssBaseline />
        <AppBarComponent open={open} handleDrawerOpen={handleDrawerOpen} />
        <DrawerComponent open={open} handleDrawerClose={handleDrawerClose} />

        <Box
          component="section"
          sx={{
            flexGrow: 1,
            transition: "margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            marginLeft: open ? "200px" : "0",
            "@media (max-width: 600px)": {
              marginLeft: open ? "120px" : "0",
            },
          }}
        >
          <div style={{ marginLeft: "70px", marginTop: "80px" }}>
            <div role="presentation" onClick={handleClick}>
              <Breadcrumbs aria-label="breadcrumb">
                <StyledBreadcrumb
                  component="a"
                  href="#"
                  label="Dashboard"
                  icon={<HomeIcon fontSize="small" />}
                />
                <StyledBreadcrumb component="a" href="#" label="Membership" />
                <StyledBreadcrumb
                  label="Family"
                  deleteIcon={<ExpandMoreIcon />}
                  onDelete={handleClick}
                />
              </Breadcrumbs>
            </div>

            <br />
            <div>
              <Card
                sx={{
                  minWidth: 275,

                  boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.75)",
                }}
              >
                <CardContent>
                  <br />

                  <div>
                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                      <Button variant="contained" onClick={handleOpenDialog}>
                        <AddIcon/>
                        Add Family
                      </Button>
                    </Box>
                    <br />
                    <div style={{ height: 400, width: "100%" }}>
                      <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5, 10]}
                        getRowId={(row) => row.membershipId}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default Family;
