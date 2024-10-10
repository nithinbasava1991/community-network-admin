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
import DialogTitle from "@mui/material/DialogTitle";
import { DataGrid } from "@mui/x-data-grid";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import Swal from "sweetalert2";
import {
  addAdvertise,
  deleteAdvertise,
  fetchAdvertise,
  getAdvertiseById,
  updatedAdvertise,
} from "../../ApiComponents/BannerApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Footer from "../../Components/Footer";
import { BASE_URL } from "../../BaseUrl";

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

const Banner = () => {
  //!table display
  const [advertisement, setAdvertisement] = useState([]);
  //!Appbar and Drawer
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const ImageUrl = `${BASE_URL}/file/downloadFile/?filePath=`;

  //!dialog
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAdverstisementId(undefined); // Reset advertisementId when closing the dialog
    setUserData({
      advertisementName: "",
      description: "",
      filePath: "", // Reset any other relevant state values
    });
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

  //! Tokens and Headers
  const user = JSON.parse(sessionStorage.getItem("user"));

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  //Todo:file
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile); // Update file state
    setFileName(selectedFile.name); // Update file name state
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
  
      if (response.status === 200) {
        // Assuming your API returns the filePath in the response
        const fileName = response.data.fileName;
  
        // Update the userData object with the fileName
        setUserData({
          ...userdata,
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
  
  



  //! validation
  const [userdata, setUserData] = useState({
    advertisementName: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  //! OnChange handler for form fields
  // ...

  const changehandler = (e) => {
    setUserData({
      ...userdata,
      [e.target.name]: e.target.value,
      createdBy: { userId: user.userId },
    });
    // Clear validation error for the changed field
    setField(e.target.name);
  };

  //! Validation Form
  const setField = (field) => {
    if (!!errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userdata.advertisementName || userdata.advertisementName === "") {
      newErrors.advertisementName = "Advertisement name cannot be empty";
    }

    if (!userdata.description || userdata.description === "") {
      newErrors.description = "Description cannot be empty";
    }
    // Add validation for other fields if needed

    setErrors(newErrors);
    return newErrors;
  };

  //todo:formsubmit (Post AdvertisementData)
  const handlePostSubmit = async (e) => {
    e.preventDefault();
  
    // Validate if file is selected
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
  
    // Set createdBy explicitly before sending data to the server
    setUserData((prevData) => ({
      ...prevData,
      createdBy: { userId: user.userId },
    }));
  
    const formErrors = validateForm();
  
    if (Object.keys(formErrors).length === 0) {
      try {
        await addAdvertise(userdata, headers); // Wait for addAdvertise to complete
        await fetchAdvertisementData(); // Fetch advertisement data after addition
  
        // Close the dialog after successful form submission
        handleCloseDialog();
  
        setUserData({
          advertisementName: "",
          description: "",
        });
        // Reset the file state back to null
        setFile(null);
      } catch (error) {
        console.error("Error adding advertisement:", error);
        // Handle error, e.g., show an error message to the user
      }
    } else {
      // Errors found, update the state with the validation errors
      setErrors(formErrors);
    }
  };
  
  

  //todo ==> GET  Advertisement Data
  useEffect(() => {
    fetchAdvertisementData();
  }, []);

  const fetchAdvertisementData = async () => {
    try {
      const advertisementData = await fetchAdvertise(headers); // Assuming fetchAdvertise function is asynchronous
      const mappedAdvertisementData = advertisementData.data.content.map(
        (advertisementItem) => ({
          ...advertisementItem,
          id: advertisementItem.advertisementId,
        })
      );

      setAdvertisement(mappedAdvertisementData);
    } catch (error) {
      console.error("Error fetching advertisement data:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "advertisementName",
      headerName: "Advertisement Name",
      width: 200,
    },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "photoPath",
      headerName: "File Path",
      width: 200,
      renderCell: (params) =>
        params.row.filePath === null ? (
          "NO IMAGE FOUND"
        ) : (
          <img
            src={ImageUrl + params.row.filePath}
            alt={params.row.fileName}
            style={{ width: 100, height: 50 }}
          />
        ),
    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 150,
      renderCell: (params) => (
        <div>
          {params.row.createdBy ? params.row.createdBy.userName : "N/A"}
        </div>
      ),
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      width: 150,
      renderCell: (params) => (
        <div>
          {params.row.updatedBy ? params.row.updatedBy.userName : "N/A"}
        </div>
      ),
    },
    {
      field: "insertedDate",
      headerName: "Inserted Date",
      width: 150,
      valueGetter: (params) => {
        const date = params.row.insertedDate
          ? new Date(params.row.insertedDate)
          : null;
        return date ? date.toLocaleDateString() : "N/A";
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
        return date ? date.toLocaleDateString() : "N/A";
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
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
          onClick={() => handleDelete(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  //todo:get by id
  const [advertisementId, setAdverstisementId] = useState();
  const handleEdit = async (id) => {
    console.log(`Edit button clicked for ID: ${id}`);
    try {
      const res = await getAdvertiseById(id, headers);
      console.log(res);
      let det = res.data;
      console.log(det);
      setAdverstisementId(det.advertisementId);
      setUserData({
        advertisementName: det.advertisementName,
        description: det.description,
        fileName: det.fileName,
      });
      // Open the dialog after fetching the data
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching advertisement by ID:", error);
      // Handle error, e.g., show an error message to the user
    }
  };

  //Todo:handleUpdate
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    try {
      const dataToSend = {
        advertisementId: advertisementId,
        advertisementName: userdata.advertisementName,
        description: userdata.description,
        updatedBy: { userId: user.userId },
        fileName: userdata.fileName, // Include the filePath in the dataToSend object
      };

      console.log(dataToSend);

      // Check if a new file is selected
      if (file) {
        // Upload the new file
        await handleFileUpload();
        // Update filePath in dataToSend with the new fileName
        dataToSend.filePath = userdata.fileName;
      } else if (!userdata.fileName) {
        // No new file selected and the old file was null
        // Handle this case based on your requirements
        // For example, you could prompt the user to select a file
        console.log("No file selected for upload");
        return; // Exit early since no file is selected
      }

      await updatedAdvertise(dataToSend, headers);

      fetchAdvertisementData();

      // Open the dialog after fetching the data
      setOpenDialog(false);

      setUserData({
        advertisementName: "",
        description: "",
      });

      // Reset promoId when closing the dialog
      setAdverstisementId(undefined);
      // Reset the file state back to null
      setFile(null);
    } catch (error) {
      console.error("Error fetching advertisement by ID:", error);
      // Handle error, e.g., show an error message to the user
    }
  };

  // const handleDelete = async (id,headers) => {
  //   await deleteAdvertise(id, headers);
  //   // Implement your delete logic here
  //   console.log("Delete clicked for ID:", id);
  //   fetchAdvertisementData();
  // };

  const handleDelete = async (id) => {
    try {
      const result = await deleteAdvertise(id, headers);
  
      if (result) {
        // If deletion is successful, optimistically update the state
        setAdvertisement((prevAds) => prevAds.filter((ad) => ad.id !== id));
  
        // Optionally, re-fetch updated data from the server
        await fetchAdvertisementData();
      } else {
        // Handle if the user cancels the deletion
        console.log('Deletion canceled by the user');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      // Optionally, re-fetch data to ensure the table is consistent
      await fetchAdvertisementData();
    }
  };
  

  return (
    <>
    <div style={{backgroundColor:"#EEEEEE"}}>
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
                <StyledBreadcrumb
                  component="a"
                  href="#"
                  label="Advertisement"
                />
                <StyledBreadcrumb
                  label="Banner"
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
                      Add Banner
                    </Button>
                    <Dialog
                      open={openDialog || advertisementId !== undefined}
                      onClose={handleCloseDialog}
                      PaperProps={{
                        component: "form",
                        onSubmit: (e) =>
                          advertisementId !== undefined
                            ? handleUpdateSubmit(e)
                            : handlePostSubmit(e),
                      }}
                      id="your-dialog-id"
                    >
                      <DialogTitle>
                        {" "}
                        {advertisementId !== undefined
                          ? "Edit Banner"
                          : "Add Banner"}
                      </DialogTitle>
                      <DialogContent>
                        <TextField
                          autoFocus
                          required
                          margin="dense"
                          id="advertisementName"
                          label="advertisementName"
                          name="advertisementName"
                          type="text"
                          fullWidth
                          variant="standard"
                          value={userdata.advertisementName}
                          onChange={changehandler} // Add onChange
                          error={!!errors.advertisementName}
                          helperText={errors.advertisementName}
                        />
                        <TextField
                          autoFocus
                          margin="dense"
                          id="description"
                          name="description"
                          label="Description"
                          type="text"
                          fullWidth
                          variant="standard"
                          value={userdata.description}
                          onChange={changehandler} // Add onChange
                          error={!!errors.description}
                          helperText={errors.description}
                        />
                        <br />
                        <br />
                        <br />
                        <Stack direction="row" alignItems="center" spacing={2}>
                          {/* File input and upload button */}
                          <input
                            accept="image/*"
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
                              Browse File 
                            </Button>
                          </label>
                          {/* Display file name */}
                          <span>
                            {file  ? userdata.fileName : "No file selected"}
                          </span>
                          {/* Button to submit file */}
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFileUpload}
                            disabled={!file}
                          >
                            Upload File
                          </Button>
                        </Stack>
                      </DialogContent>
                      <DialogActions>
                        <Button variant="contained" type="submit">
                          {advertisementId !== undefined ? "Update" : "Submit"}
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleCloseDialog()}
                        >
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Stack>
                  <br />
                  <div>
                    <div style={{ height: 400, width: "100%" }}>
                      <DataGrid
                        rows={advertisement}
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
      <Box
        sx={{
          transition: "margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
          ...commonMarginStyle,
        }}
      >
        <Footer />
      </Box>
    </div>
      
    </>
  );
};

export default Banner;
