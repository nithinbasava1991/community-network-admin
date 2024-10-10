import React, { useEffect, useState } from "react";
import AppBarComponent from "../../Components/AppBarComponent";
import DrawerComponent from "../../Components/DrawerComponent";
import {
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  IconButton,
  Stack,
} from "@mui/material";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid } from "@mui/x-data-grid";
import { BASE_URL } from "../../BaseUrl";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import Swal from "sweetalert2";
import { fetchBulkUpload } from "../../ApiComponents/BlukuploadApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment/moment";

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

const BulkUpload = () => {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleOpenDialog = () => setOpenDialog(true);

  //!for edit
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);


 

  const [fileUploaded, setFileUploaded] = useState(false);

  // Define keys to exclude
  const excludeKeys = [
    "updatedBy",
    "createdBy",
    "updatedDate",
    "id",
    "insertedDate",
  ];

  //! Tokens and Headers
  const user = JSON.parse(sessionStorage.getItem("user"));

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  // Assuming selectedRow includes date fields
  const formatDate = (value) => {
    // Format date using moment if value is a valid date
    return moment(value).isValid() ? moment(value).format("L") : value;
  };

  //!post Method
  const handleFileUpload = async (e) => {

    e.preventDefault(); // Prevent page refresh

    try {

      const formData = new FormData();

      formData.append("file", file);


      const user = JSON.parse(sessionStorage.getItem("user"));

      const accessToken = user.accessToken;


      const response = await axios.post(

        `${BASE_URL}/membership/v1/membershipBulkUploadFile?userId=${user.userId}`,

        formData, // Send form data directly

        {

          headers: {

            "Content-Type": "multipart/form-data",

            Authorization: `Bearer ${accessToken}`, // Include access token in the headers

          },

        }

      );


      console.log(response);

      if (response.status === 200) {

        const fileName = response.data.fileName;

        console.log(fileName);

        setFileName(fileName);

        handleCloseDialog(); // Close dialog on success

        Swal.fire("Success!", "File uploaded successfully!", "success");

        setFileUploaded(true); // Set fileUploaded to true to trigger useEffect

      } else {

        console.error("Unexpected status code:", response.status);

      }

    } catch (error) {

      console.error("Error uploading file:", error);

      Swal.fire(

        "Error!",

        "An error occurred while uploading the file.",

        "error"

      );

    }

  };

  //todo ==> GET  Gotra DATA
  const [filedetails, setFileDetails] = useState([]);

  const fetchFileData = async () => {

    try {

      const BulkFileData = await fetchBulkUpload(headers);

      console.log(BulkFileData);

      // Add unique IDs to each row

      const fileRows = BulkFileData.data.content.map((row, index) => ({

        ...row,

        id: index + 1, // Assuming index starts from 0, you can adjust this if needed

      }));

      setFileDetails(fileRows);

    } catch (error) {

      console.error("Error fetching file data:", error);

    }

  };


  useEffect(() => {

    if (fileUploaded) {

      fetchFileData();

    }

  }, [fileUploaded]);

  const columns = [
    {
      field: "membershipId",
      headerName: "Membership ID",
      width: 150,
      valueGetter: (params) => params.row.membershipId || "No values",
    },
    {
      field: "applicationNumber",
      headerName: "Application Number",
      width: 150,
      valueGetter: (params) => params.row.applicationNumber || "No values",
    },
    {
      field: "membershipCode",
      headerName: "Membership Code",
      width: 150,
      valueGetter: (params) => params.row.membershipCode || "No values",
    },
    {
      field: "fullName",
      headerName: "fullName",
      width: 150,
      valueGetter: (params) => params.row.fullName || "No values",
    },
    {
      field: "referanceMembershipCode",
      headerName: "Reference Membership Code",
      width: 200,
      valueGetter: (params) =>
        params.row.referanceMembershipCode || "No values",
    },

    {
      field: "femaleFamilyCode",
      headerName: "Female Family Code",
      width: 150,
      valueGetter: (params) => params.row.femaleFamilyCode || "No values",
    },

    {
      field: "isAlive",
      headerName: "Is Alive",
      width: 120,
      valueGetter: (params) => params.row.isAlive || "No values",
    },
    // {
    //   field: "chainStatus",
    //   headerName: "Chain Status",
    //   width: 150,
    //   valueGetter: (params) => params.row.chainStatus || "No values",
    // },

    // {
    //   field: "picPath",
    //   headerName: "Pic Path",
    //   width: 150,
    //   valueGetter: (params) => params.row.picPath || "No values",
    // },

    {
      field: "dob",
      headerName: "DOB",
      width: 120,
      valueGetter: (params) => {
        const dob = params.row.dob;
        return moment(dob).format("L");
      },
    },
    {
      field: "age",
      headerName: "Age",
      width: 100,
      valueGetter: (params) => params.row.age || "No values",
    },
    {
      field: "bloodGroup",
      headerName: "Blood Group",
      width: 120,
      valueGetter: (params) => params.row.bloodGroup || "No values",
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      width: 150,
      valueGetter: (params) => params.row.mobileNumber || "No values",
    },
    {
      field: "occupation",
      headerName: "Occupation",
      width: 150,
      valueGetter: (params) => params.row.occupation || "No values",
    },
    {
      field: "gothra",
      headerName: "Gothra",
      width: 120,
      valueGetter: (params) => params.row.gothra || "No values",
    },
    {
      field: "emailId",
      headerName: "Email ID",
      width: 200,
      valueGetter: (params) => params.row.emailId || "No values",
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      valueGetter: (params) => params.row.gender || "No values",
    },
    {
      field: "qualification",
      headerName: "Qualification",
      width: 150,
      valueGetter: (params) => params.row.qualification || "No values",
    },
    {
      field: "relationshipName",

      headerName: "Relationship Name",

      width: 150,

      valueGetter: (params) => params.row.relationshipName || "No values",
    },

    {
      field: "alternativeMobileNumber",

      headerName: "Alternative Mobile Number",

      width: 150,

      valueGetter: (params) =>
        params.row.alternativeMobileNumber || "No values",
    },

    {
      field: "address",

      headerName: "Address",

      width: 200,

      valueGetter: (params) => params.row.address || "No values",
    },

    {
      field: "city",

      headerName: "City",

      width: 120,

      valueGetter: (params) => params.row.city || "No values",
    },

    {
      field: "country",

      headerName: "Country",

      width: 120,

      valueGetter: (params) => params.row.country || "No values",
    },
    {
      field: "insertedDate",
      headerName: "Inserted Date",
      width: 150,
      valueGetter: (params) => {
        const date = params.row.insertedDate
          ? new Date(params.row.insertedDate)
          : null;
        return date ? date.toLocaleDateString() : "No values";
      },
    },
    {
      field: "updatedDate",
      headerName: "updatedDate",
      width: 150,
      valueGetter: (params) => {
        const date = params.row.updatedDate
          ? new Date(params.row.updatedDate)
          : null;
        return date ? date.toLocaleDateString() : "No values";
      },
    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 150,
      valueGetter: (params) => params.row.createdBy?.userName || "No values",
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      width: 150,
      valueGetter: (params) => params.row.updatedBy?.userName || "No values",
    },
    {
      field: "associatedMemberships",
      headerName: "Associated Memberships",
      width: 250,
      valueGetter: (params) => params.row.associatedMemberships || "No values",
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
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="secondary"
          onClick={() => handleDelete(params.row.membershipCode)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  //Todo: edit

  const handleEdit = async (row) => {
    setSelectedRow(row); // Update the selectedRow state with the current row data
    setOpenEditModal(true); // Open the edit modal
    console.log("Selected row:", selectedRow);
    try {
      const response = await axios.put(
        `${BASE_URL}/membership/v1/updateIndividualMembership`,
        selectedRow,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        Swal.fire("Success!", "Membership updated successfully!", "success");
        setOpenEditModal(false); // Close the edit modal
        fetchFileData(); // Refetch the data to update the grid
      } else {
        console.error("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error updating membership:", error);
      Swal.fire(
        "Error!",
        "An error occurred while updating the membership.",
        "error"
      );
    }
  };

  //Todo: delete

  const handleDelete = async (membershipCode) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this membership?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const response = axios.delete(
            `${BASE_URL}/membership/v1/deleteMembershipByCode/${membershipCode}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.accessToken}`,
              },
            }
          );
          // Update the table data after deletion
          const updatedData = filedetails.filter(
            (row) => row.membershipCode !== membershipCode
          );
          setFileDetails(updatedData);
          Swal.fire("Deleted!", "Membership deleted successfully!", "success");
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error!",
            "An error occurred while deleting the membership.",
            "error"
          );
        }
      }
    });
  };

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
                <StyledBreadcrumb component="a" href="#" label="MemberShip" />
                <StyledBreadcrumb
                  label="Bulkupload"
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
                  <Stack direction="row">
                    <Button variant="contained" onClick={handleOpenDialog}>
                      <AddIcon />
                      Browse File
                    </Button>
                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                      <form onSubmit={handleFileUpload}>
                        <DialogTitle>Upload file </DialogTitle>
                        <DialogContent>
                          <input
                            id="contained-button-file"
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          <label htmlFor="contained-button-file">
                            <Button
                              variant="contained"
                              color="primary"
                              component="span"
                              startIcon={<CloudUploadIcon />}
                            >
                              Upload
                            </Button>
                          </label>
                          <span>{file ? fileName : "No file selected"}</span>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                          </Button>
                          <Button type="submit" color="primary">
                            Upload
                          </Button>
                        </DialogActions>
                      </form>
                    </Dialog>
                  </Stack>
                  <br />
                  <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                      rows={filedetails}
                      columns={columns}
                      initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 10 },
                        },
                      }}
                      pageSizeOptions={[10, 50, 100, 500]}
                      sx={{ height: "70vh" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Box>
      </Box>
      {openEditModal && (
        <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <DialogTitle>Edit Membership</DialogTitle>
          <DialogContent>
            {Object.keys(selectedRow)
              .filter((key) => !excludeKeys.includes(key)) // Exclude specified keys
              .map((key, index) => (
                <TextField
                  key={index}
                  label={key.replace(/_/g, " ").replace(/\w\S*/g, (txt) => {
                    return (
                      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                    );
                  })}
                  value={
                    key.includes("date")
                      ? formatDate(selectedRow[key])
                      : selectedRow[key] ?? ""
                  }
                  onChange={(e) => {
                    setSelectedRow({ ...selectedRow, [key]: e.target.value });
                  }}
                  sx={{ marginBottom: 2, padding: 1 }} // Add margin and padding
                />
              ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
            <Button type="submit" onClick={handleEdit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default BulkUpload;
