import React, { useEffect, useState } from "react";
import AppBarComponent from "../../Components/AppBarComponent";
import DrawerComponent from "../../Components/DrawerComponent";
import {
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import axios from "axios";
import { BASE_URL } from "../../BaseUrl";
import Swal from "sweetalert2";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AssociatedMemberForm from "./AssociatedMemberForm";
import { Paper } from "@mui/material";
import { fetchBulkUpload } from "../../ApiComponents/IndividualApi";

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


const Individual = () => {
  //!Appbar and Drawer
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  //!dialog
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const commonMarginStyle = {
    marginLeft: open ? "240px" : "0",
    "@media (max-width: 600px)": {
      marginLeft: open ? "120px" : "0",
    },
    "@media (min-width: 601px) and (max-width: 960px)": {
      marginLeft: open ? "40px" : "0",
    },
    "@media (min-width: 961px) and (max-width: 1280px)": {
      marginLeft: open ? "60px" : "0",
    },
  };

  const [formData, setFormData] = useState({
    membershipCode: "",
    isAlive: "",
    fullName: "",
    dob: "",
    age: "",
    occupation: "",
    mobileNumber: "",
    gothra: "",
    emailId: "",
    gender: "",
    qualification: "",
  });
  const [errors, setErrors] = useState({});


  //! Tokens and Headers
  const user = JSON.parse(sessionStorage.getItem("user"));

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Clear error message for the field being changed
    const updatedErrors = { ...errors };
    delete updatedErrors[name];

    setErrors(updatedErrors);
    setFormData({ ...formData, [name]: value });
  };

  // State variable to control the visibility of the second dialog
  const [openAssociatedDialog, setOpenAssociatedDialog] = useState(false);

  // Function to open the second dialog
  const handleOpenAssociatedDialog = () => {
    setOpenAssociatedDialog(true);
  };

  // Function to close the second dialog
  const handleCloseAssociatedDialog = () => {
    setOpenAssociatedDialog(false);
  };

  // // Adjust state structure
  // const [associatedMembers, setAssociatedMembers] = useState([]);

 

  // const handleDeleteMember = (index) => {
  //   const updatedMembers = [...associatedMembers];
  //   updatedMembers.splice(index, 1);
  //   setAssociatedMembers(updatedMembers);
  // };

  //Todo:file
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isFileSelected, setIsFileSelected] = useState(false);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile); // Update file state
    setFileName(selectedFile.name); // Update file name state
    setIsFileSelected(true); // Set isFileSelected to true when file is selected
  };

  // ...

  const handleFileUpload = async () => {
    if (!file) {
      // No file selected, display an error message within the dialog
      Swal.fire({
        target: document.getElementById("your-dialog-id"),
        icon: "error",
        title: "Oops...",
        text: "Please select a file before uploading.",
      });
      return;
    }

    // Add additional validation for file type, size, etc. if needed

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${BASE_URL}/file/uploadFile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + user.accessToken,
          },
        }
      );

      console.log("File upload successful:", response.data);
      setIsFileSelected(false);
      // Clear file state if needed
      setFile(null);
      setFileName("");

      if (response.status === 200) {
        // Assuming your API returns the filePath in the response
        const fileName = response.data.fileName;

        // Update the userData object with the fileName
        setFormData({
          ...formData,
          fileName: fileName,
        });

        // Show the success message in front of the dialog
        Swal.fire({
          target: document.getElementById("your-dialog-id"), // Replace with your actual dialog ID
          icon: "success",
          title: response.data.message,
        });
      } else {
        console.error("Unexpected status code:", response.status);
        // Handle unexpected status codes if needed
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error, e.g., show an error message to the user
    }
  };

 



  //!second dialog

  const [associatedMemberships, setAssociatedMemberships] = useState([]);
  const [associatedMemberErrors, setAssociatedMemberErrors] = useState({});

  const handleChangeAssociatedMember = (event) => {
    const { name, value } = event.target;

    // For other fields, update formData as usual

    setFormData({
      ...formData,

      [name]: value,
    });
  };

  const handleSubmitAssociatedMembers = (event) => {
    event.preventDefault();
    console.log(formData);
    let errors = {};
    let formIsValid = true;

    // Full Name validation
    if (!formData.fullName) {
      formIsValid = false;
      errors["fullName"] = "Full Name is required.";
    }

    // Date of Birth validation
    if (!formData.dob) {
      formIsValid = false;
      errors["dob"] = "Date of Birth is required.";
    }

    // Blood Group validation (if needed)
    if (!formData.bloodGroup) {
      formIsValid = false;
      errors["bloodGroup"] = "Blood Group is required.";
    }

    // Occupation validation
    if (!formData.occupation) {
      formIsValid = false;
      errors["occupation"] = "Occupation is required.";
    }

    // Mobile Number validation
    if (!formData.mobileNumber) {
      formIsValid = false;
      errors["mobileNumber"] = "Mobile Number is required.";
    } else if (!/^\d{10}$/i.test(formData.mobileNumber)) {
      formIsValid = false;
      errors["mobileNumber"] = "Mobile Number is invalid.";
    }

    // Email validation
    if (!formData.emailId) {
      formIsValid = false;
      errors["emailId"] = "Email is required.";
    } else if (!/\S+@\S+\.\S+/i.test(formData.emailId)) {
      formIsValid = false;
      errors["emailId"] = "Email is invalid.";
    }

    // Gender validation
    if (!formData.gender) {
      formIsValid = false;
      errors["gender"] = "Gender is required.";
    }

    // Gothra validation
    if (!formData.gothra) {
      formIsValid = false;
      errors["gothra"] = "Gothra is required.";
    }

    // Qualification validation
    if (!formData.qualification) {
      formIsValid = false;
      errors["qualification"] = "Qualification is required.";
    }

    // Set errors if any
    setAssociatedMemberErrors(errors);

    // If form is valid, submit
    if (formIsValid) {
      // Construct relationships array
      const relationships = [
        {
          relationshipName: formData.relationship,
        },
      ];

      // Construct associated membership object
      const newMembership = {
        fullName: formData.fullName,
        dob: formData.dob,
        age: formData.age,
        bloodGroup: formData.bloodGroup,
        occupation: formData.occupation,
        mobileNumber: formData.mobileNumber,
        emailId: formData.emailId,
        gender: formData.gender,
        gothra: formData.gothra,
        qualification: formData.qualification,
        relationships: relationships,
      };
      // Update associated memberships state with new membership
      setAssociatedMemberships([...associatedMemberships, newMembership]);
    
      // Clear form fields
      setFormData({
        fullName: "",
        dob: "",
        bloodGroup: "",
        occupation: "",
        mobileNumber: "",
        emailId: "",
        gender: "",
        gothra: "",
        qualification: "",
      });

      // Close the dialog
      handleCloseAssociatedDialog();
    }
  };

  const handleDeleteMember = (index) => {
    // Copy the associatedMemberships array
    const updatedMemberships = [...associatedMemberships];
    // Remove the member at the specified index
    updatedMemberships.splice(index, 1);
    // Update the state with the updated array
    setAssociatedMemberships(updatedMemberships);
  };


  

//!final form submit 
const handleSubmit = (event) => {
  event.preventDefault();

  // Construct relationships array
  const relationships = [
    {
      relationshipName: formData.relationship,
    },
  ];

  // Construct associated membership object
  const newMembership = {
    fullName: formData.fullName,
    dob: formData.dob,
    age: formData.age,
    bloodGroup: formData.bloodGroup,
    occupation: formData.occupation,
    mobileNumber: formData.mobileNumber,
    alternativeMobileNumber: "",
    gothra: formData.gothra,
    emailId: formData.emailId,
    gender: formData.gender,
    qualification: formData.qualification,
    isAlive: formData.isAlive,
    chainStatus: false,
    reason: "",
    relationships: relationships,
  };

  // Construct the final data object to be submitted
  const formDataWithAssociatedMemberships = {
    picName: null,
    fullName: formData.fullName,
    dob: formData.dob,
    age: formData.age,
    bloodGroup: formData.bloodGroup,
    occupation: formData.occupation,
    mobileNumber: formData.mobileNumber,
    alternativeMobileNumber: "",
    gothra: formData.gothra,
    emailId: formData.emailId,
    gender: formData.gender,
    qualification: formData.qualification,
    isAlive: true,
    chainStatus: false,
    reason: "ROOT",
    createdBy: { userId: 2 }, // Assuming you have the user ID
    associatedMemberships: [newMembership], // Include the associated membership data
  };

  // Submit the form data
  console.log(formDataWithAssociatedMemberships);

  // Reset the form data to initial values
   // Clear form fields
   setFormData({
    fullName: "",
    dob: "",
    bloodGroup: "",
    occupation: "",
    mobileNumber: "",
    emailId: "",
    gender: "",
    gothra: "",
    qualification: "",
  });


  // You can perform further actions like sending this data to a backend API using axios
};


 //todo ==> GET  Gotra DATA
 const [filedetails, setFileDetails] = useState([]);

 useEffect(() => {
   fetchFileData();
 }, []);

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

 const columns = [
   {
     field: "membershipId",
     headerName: "Membership ID",
     width: 150,
     valueGetter: (params) => params.row.membershipId || "No values",
   },
   {
     field: "membershipCode",
     headerName: "Membership Code",
     width: 150,
     valueGetter: (params) => params.row.membershipCode || "No values",
   },
   {
     field: "referenceMembershipCode",
     headerName: "Reference Membership Code",
     width: 200,
     valueGetter: (params) => params.row.referenceMembershipCode || "No values",
   },
   {
     field: "isAlive",
     headerName: "Is Alive",
     width: 120,
     valueGetter: (params) => params.row.isAlive || "No values",
   },
   {
     field: "chainStatus",
     headerName: "Chain Status",
     width: 150,
     valueGetter: (params) => params.row.chainStatus || "No values",
   },
   {
     field: "reason",
     headerName: "Reason",
     width: 150,
     valueGetter: (params) => params.row.reason || "No values",
   },
   {
     field: "picPath",
     headerName: "Pic Path",
     width: 150,
     valueGetter: (params) => params.row.picPath || "No values",
   },
   {
     field: "fullName",
     headerName: "Full Name",
     width: 150,
     valueGetter: (params) => params.row.fullName || "No values",
   },
   {
     field: "dob",
     headerName: "DOB",
     width: 120,
     valueGetter: (params) => params.row.dob || "No values",
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
 ];
















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
                  label="Individual"
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
                      Add Individual
                    </Button>
                    <Dialog
                      open={openDialog}
                      onClose={handleCloseDialog}
                      component="form"
                      // onSubmit={handleSubmit}
                    >
                      <DialogTitle>Add Individual</DialogTitle>
                      <br />
                      <DialogContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Membership Code"
                              name="membershipCode"
                              value={formData.membershipCode}
                              onChange={handleChange}
                              fullWidth
                            />
                            <span style={{ color: "red" }}>
                              {errors["membershipCode"]}
                            </span>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl
                              sx={{ m: 1 }}
                              variant="standard"
                              fullWidth
                            >
                              <InputLabel>Is Alive</InputLabel>
                              <Select
                                name="isAlive"
                                value={formData.isAlive}
                                onChange={handleChange}
                              >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="yes">Yes</MenuItem>
                                <MenuItem value="no">No</MenuItem>
                              </Select>
                            </FormControl>
                            <span style={{ color: "red" }}>
                              {errors["isAlive"]}
                            </span>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Full Name"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleChange}
                              fullWidth
                            />
                            <span style={{ color: "red" }}>
                              {errors["fullName"]}
                            </span>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Date of Birth"
                              name="dob"
                              type="date"
                              value={formData.dob}
                              onChange={handleChange}
                              fullWidth
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                            <span style={{ color: "red" }}>
                              {errors["dob"]}
                            </span>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Age"
                              name="age"
                              value={formData.age}
                              onChange={handleChange}
                              fullWidth
                            />
                            <span style={{ color: "red" }}>
                              {errors["age"]}
                            </span>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Occupation"
                              name="occupation"
                              value={formData.occupation}
                              onChange={handleChange}
                              fullWidth
                            />
                            <span style={{ color: "red" }}>
                              {errors["occupation"]}
                            </span>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Mobile Number"
                              name="mobileNumber"
                              type="tel"
                              value={formData.mobileNumber}
                              onChange={handleChange}
                              fullWidth
                            />
                            <span style={{ color: "red" }}>
                              {errors["mobileNumber"]}
                            </span>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Gothra"
                              name="gothra"
                              value={formData.gothra}
                              onChange={handleChange}
                              fullWidth
                            />
                            <span style={{ color: "red" }}>
                              {errors["gothra"]}
                            </span>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Email"
                              name="emailId"
                              type="email"
                              value={formData.emailId}
                              onChange={handleChange}
                              fullWidth
                            />
                            <span style={{ color: "red" }}>
                              {errors["emailId"]}
                            </span>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl
                              sx={{ m: 1 }}
                              variant="standard"
                              fullWidth
                            >
                              <InputLabel>Gender</InputLabel>
                              <Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                              >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                              </Select>
                            </FormControl>
                            <span style={{ color: "red" }}>
                              {errors["gender"]}
                            </span>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Qualification"
                              name="qualification"
                              value={formData.qualification}
                              onChange={handleChange}
                              fullWidth
                            />
                            <span style={{ color: "red" }}>
                              {errors["qualification"]}
                            </span>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Blood group"
                              name="bloodGroup"
                              value={formData.bloodGroup}
                              onChange={handleChange}
                              fullWidth
                            />
                            <span style={{ color: "red" }}>
                              {errors["bloodGroup"]}
                            </span>
                          </Grid>
                          <Grid item xs={12}>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <label
                                htmlFor="contained-button-file"
                                style={{ marginRight: "10px" }}
                              >
                                <Button
                                  variant="contained"
                                  color="primary"
                                  component="span"
                                  startIcon={<CloudUploadIcon />}
                                >
                                  {isFileSelected
                                    ? "Upload File"
                                    : "Browse File"}
                                </Button>
                                <input
                                  accept="image/*"
                                  id="contained-button-file"
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={handleFileChange}
                                />
                              </label>
                              {/* Display file name */}
                              <span>
                                {file ? formData.fileName : "No file selected"}
                              </span>
                              {/* Upload button */}
                              <Button
                                type="button"
                                variant="contained"
                                onClick={handleFileUpload}
                                disabled={!isFileSelected}
                                style={{ marginLeft: "10px" }}
                              >
                                Upload
                              </Button>
                            </div>
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              variant="outlined"
                              onClick={handleOpenAssociatedDialog}
                            >
                              Add Associated members
                            </Button>
                            <Dialog
                              open={openAssociatedDialog}
                              onClose={handleCloseAssociatedDialog}
                            >
                              <DialogTitle>Add Associated Members</DialogTitle>
                              <DialogContent>
                                {/* Form for adding associated members */}
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      label="Full Name"
                                      name="fullName"
                                      value={formData.fullName || ""}
                                      onChange={handleChangeAssociatedMember}
                                      fullWidth
                                      error={!!associatedMemberErrors.fullName}
                                      helperText={
                                        associatedMemberErrors.fullName
                                      }
                                    />
                                  </Grid>

                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      name="dob"
                                      type="date"
                                      value={formData.dob || ""}
                                      onChange={handleChangeAssociatedMember}
                                      fullWidth
                                      error={!!associatedMemberErrors.dob}
                                      helperText={associatedMemberErrors.dob}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      label="Blood Group"
                                      name="bloodGroup"
                                      value={formData.bloodGroup || ""}
                                      onChange={handleChangeAssociatedMember}
                                      fullWidth
                                      error={
                                        !!associatedMemberErrors.bloodGroup
                                      }
                                      helperText={
                                        associatedMemberErrors.bloodGroup
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      label="Occupation"
                                      name="occupation"
                                      value={formData.occupation || ""}
                                      onChange={handleChangeAssociatedMember}
                                      fullWidth
                                      error={
                                        !!associatedMemberErrors.occupation
                                      }
                                      helperText={
                                        associatedMemberErrors.occupation
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      label="Mobile Number"
                                      name="mobileNumber"
                                      type="tel"
                                      value={formData.mobileNumber || ""}
                                      onChange={handleChangeAssociatedMember}
                                      fullWidth
                                      error={
                                        !!associatedMemberErrors.mobileNumber
                                      }
                                      helperText={
                                        associatedMemberErrors.mobileNumber
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      label="Email"
                                      name="emailId"
                                      type="email"
                                      value={formData.emailId || ""}
                                      onChange={handleChangeAssociatedMember}
                                      fullWidth
                                      error={!!associatedMemberErrors.emailId}
                                      helperText={
                                        associatedMemberErrors.emailId
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      label="Qualification"
                                      name="qualification"
                                      value={formData.qualification || ""}
                                      onChange={handleChangeAssociatedMember}
                                      fullWidth
                                      error={
                                        !!associatedMemberErrors.qualification
                                      }
                                      helperText={
                                        associatedMemberErrors.qualification
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      label="Gothra"
                                      name="gothra"
                                      value={formData.gothra || ""}
                                      onChange={handleChangeAssociatedMember}
                                      fullWidth
                                      error={!!associatedMemberErrors.gothra}
                                      helperText={associatedMemberErrors.gothra}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      label="Reason"
                                      name="reason"
                                      value={formData.reason || ""}
                                      onChange={handleChangeAssociatedMember}
                                      fullWidth
                                      error={!!associatedMemberErrors.reason}
                                      helperText={associatedMemberErrors.reason}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <FormControl
                                      sx={{ m: 1 }}
                                      variant="standard"
                                      fullWidth
                                    >
                                      <InputLabel>Is Alive</InputLabel>
                                      <Select
                                        name="isAlive"
                                        value={formData.isAlive || ""}
                                        onChange={handleChangeAssociatedMember}
                                        error={!!associatedMemberErrors.isAlive}
                                      >
                                        <MenuItem value={true}>Yes</MenuItem>
                                        <MenuItem value={false}>No</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <FormControl
                                      sx={{ m: 1 }}
                                      variant="standard"
                                      fullWidth
                                    >
                                      <InputLabel>Gender</InputLabel>
                                      <Select
                                        name="gender"
                                        value={formData.gender || ""}
                                        onChange={handleChangeAssociatedMember}
                                        error={!!associatedMemberErrors.gender}
                                      >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">
                                          Female
                                        </MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <FormControl
                                      sx={{ m: 1 }}
                                      variant="standard"
                                      fullWidth
                                    >
                                      <InputLabel>Relationship</InputLabel>
                                      <Select
                                        name="relationship"
                                        value={formData.relationship || ""}
                                        onChange={handleChangeAssociatedMember}
                                        error={
                                          !!associatedMemberErrors.relationship
                                        }
                                      >
                                        <MenuItem value="">Select</MenuItem>
                                        <MenuItem value="Wife">Wife</MenuItem>
                                        <MenuItem value="Husband">
                                          Husband
                                        </MenuItem>
                                        {/* Add more relationship options as needed */}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={handleCloseAssociatedDialog}
                                  variant="contained"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={handleSubmitAssociatedMembers}
                                >
                                  Submit
                                </Button>
                              </DialogActions>
                            </Dialog>

                            <TableContainer component={Paper}>
                              <Table aria-label="Associated Members">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Full Name</TableCell>

                                    <TableCell>Relationship</TableCell>

                                    <TableCell>Mobile Number</TableCell>

                                    <TableCell>Email</TableCell>
                                    <TableCell>Action</TableCell>
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  {associatedMemberships.map(
                                    (member, index) => {
                                      console.log("Member data:", member); // Add this line for logging
                                      return (
                                        <TableRow key={index}>
                                          <TableCell>
                                            {member.fullName}
                                          </TableCell>
                                          <TableCell>
                                            {member.relationships.map(
                                              (relationship, index) => (
                                                <span key={index}>
                                                  {
                                                    relationship.relationshipName
                                                  }
                                                </span>
                                              )
                                            )}
                                          </TableCell>

                                          <TableCell>
                                            {member.mobileNumber}
                                          </TableCell>
                                          <TableCell>
                                            {member.emailId}
                                          </TableCell>
                                          <TableCell>
                                            <Button
                                              variant="outlined"
                                              color="secondary"
                                              onClick={() =>
                                                handleDeleteMember(index)
                                              }
                                            >
                                              Delete
                                            </Button>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    }
                                  )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>
                        </Grid>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialog} variant="contained">
                          Cancel
                        </Button>
                        <Button type="submit" variant="contained" onClick={handleSubmit}>
                          Submit
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Stack>
                  <br />
                  <div>
                    <div style={{ height: 400, width: "100%" }}>
                      <DataGrid
                        rows={filedetails}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                          },
                        }}
                        pageSizeOptions={[10,50,100]}
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

export default Individual;
