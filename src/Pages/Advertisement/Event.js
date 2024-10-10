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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../../BaseUrl";
import {
  addEvent,
  deleteEvent,
  fetchEvent,
  getEventId,
  updatedEvent,
} from "../../ApiComponents/EventApi";

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

const Event = () => {
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
    setEventId(undefined);
    // Revert the filename back to its original value
    setUserdata((prevData) => ({
      ...prevData,
      fileName: originalFileName,
    }));
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
  const ImageUrl = `${BASE_URL}/file/downloadFile/?filePath=`;

  //! Tokens and Headers
  const user = JSON.parse(sessionStorage.getItem("user"));

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  //Todo:file
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [originalFileName, setOriginalFileName] = useState("");

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
        setUserdata({
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

  const [userdata, setUserdata] = useState({
    eventName: "",
    description: "",
  });

  // State for field errors
  const [errors, setErrors] = useState({
    eventName: "",
    description: "",
  });

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!userdata.eventName.trim()) {
      newErrors.eventName = "eventName is required";
      isValid = false;
    }

    if (!userdata.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Update changehandler function to set user input in state
  const changehandler = (e) => {
    const { name, value } = e.target;

    // Clear the error for the changed field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setUserdata((prevData) => ({
      ...prevData,
      [name]: value,
      createdBy: { userId: user.userId }, // Add createdBy field
    }));
  };

  //todo ==> POST Event DATA
  const handlePostSubmit = async (event) => {
    event.preventDefault();

    // Validate if file is selected
    if (!file) {
      // No file selected, display an error message
      Swal.fire({
        target: document.getElementById("your-dialog-id"),
        icon: "error",
        title: "Oops...",
        text: "Please select a file before uploading.",
      });
      return;
    }

    // Set createdBy explicitly before sending data to the server
    setUserdata((prevData) => ({
      ...prevData,
      createdBy: { userId: user.userId },
    }));

    if (validateForm()) {
      try {
        // Call addEvent function with userdata and headers
        await addEvent(userdata, headers);

        // Log userdata
        console.log(userdata);

        // Close the dialog after a successful submission
        setOpenDialog(false);

        //! Fetch event data
        fetchEventData();

        // Reset userdata state
        setUserdata({
          eventName: "",
          description: "",
        });

        // Reset the file state back to null
        setFile(null);
      } catch (error) {
        console.error("Error creating new event:", error);

        // Set the submission error state
        setErrors({
          eventName: "Error creating Event Name",
          description: "Error creating new Event Description",
        });
      }
    }
  };

  //todo ==> GET Event Data
  const [event, setEvent] = useState([]);
  // Fetch data and update rows
  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    try {
      const eventData = await fetchEvent(headers); // Assuming fetchAdvertise function is asynchronous
      const mappedEventData = eventData.data.content.map((eventItem) => ({
        ...eventItem,
        id: eventItem.eventId,
      }));

      setEvent(mappedEventData);
    } catch (error) {
      console.error("Error fetching Event data:", error);
    }
  };

  const columns = [
    { field: "eventId", headerName: "eventId", width: 70 },
    {
      field: "eventName",
      headerName: "eventName",
      width: 200,
    },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "filePath",
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
  const [eventId, setEventId] = useState();
  const handleEdit = async (id) => {
    console.log(`Edit button clicked for ID: ${id}`);
    try {
      const res = await getEventId(id, headers);
      console.log(res);
      let det = res.data;
      console.log(det);
      setEventId(det.eventId);
      setUserdata({
        eventId: det.eventId,
        eventName: det.eventName,
        description: det.description,
        fileName: det.fileName,
      });

      // Store the original filename
      setOriginalFileName(det.fileName);
      // Open the dialog after fetching the data
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching event by ID:", error);
      // Handle error, e.g., show an error message to the user
    }
  };

  //Todo:handleUpdate
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    try {
      const dataToSend = {
        eventId:userdata.eventId,
        eventName: userdata.eventName,
        description: userdata.description,
        updatedBy: { userId: user.userId },
        fileName: userdata.fileName, // Replace fileName with fileName
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

      // Assuming you have a function named `updateSuccessStory` for updating success stories
      await updatedEvent(dataToSend, headers);

      // Fetch success story data after the update
      fetchEventData();

      // Open the dialog after fetching the data
      setOpenDialog(false);

      // Reset userData when closing the dialog
      setUserdata({
        eventName: "",
        description: "",
      });

      // Reset successstoryId when closing the dialog
      setEventId(undefined);
      // Reset the file state back to null
      setFile(null);
    } catch (error) {
      console.error("Error updating event:", error);
      // Handle error, e.g., show an error message to the user
    }
  };

  //Todo delete
  const handleDelete = async (id) => {
    try {
      // Call deleteEvent and wait for the result
      const result = await deleteEvent(id, headers);
      
      if (result) {
        // If deletion is successful, optimistically update the state
        setEvent((prevEvents) => prevEvents.filter((event) => event.id !== id));
        
        // Fetch updated data from the server
        await fetchEventData();
      } else {
        // Handle if the user cancels the deletion
        console.log('Deletion canceled by the user');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      // Optionally, re-fetch data to ensure the state is consistent
      await fetchEventData();
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
                  label="Event"
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
                      Add Event
                    </Button>
                    <Dialog
                      open={openDialog}
                      onClose={handleCloseDialog}
                      PaperProps={{
                        component: "form",
                      }}
                      id="your-dialog-id"
                    >
                      <DialogTitle>
                        {eventId !== undefined ? "Edit Event" : "Add Event"}
                      </DialogTitle>
                      <DialogContent>
                        <TextField
                          autoFocus
                          required
                          margin="dense"
                          id="eventName"
                          name="eventName"
                          label="eventName"
                          type="text"
                          fullWidth
                          variant="standard"
                          value={userdata.eventName}
                          onChange={(e) => {
                            changehandler(e);
                          }}
                          error={!!errors.eventName}
                          helperText={errors.eventName}
                        />

                        <TextField
                          autoFocus
                          required
                          margin="dense"
                          id="description"
                          name="description"
                          label="Description"
                          type="text"
                          fullWidth
                          variant="standard"
                          value={userdata.description}
                          onChange={(e) => {
                            changehandler(e);
                          }}
                          error={!!errors.description}
                          helperText={errors.description}
                        />

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
                              Upload
                            </Button>
                          </label>
                          {/* Display file name */}
                          <span>
                            {file ? userdata.fileName : "No file selected"}
                          </span>
                          {/* Button to submit file */}
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFileUpload}
                            disabled={!file}
                          >
                            File Submit
                          </Button>
                        </Stack>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialog} variant="contained">
                          Cancel
                        </Button>
                        {eventId ? (
                          <Button
                            type="submit"
                            variant="contained"
                            onClick={handleUpdateSubmit}
                          >
                            Update
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            variant="contained"
                            onClick={handlePostSubmit}
                          >
                            Submit
                          </Button>
                        )}
                      </DialogActions>
                    </Dialog>
                  </Stack>
                  <br />
                  <div>
                    <div style={{ height: 400, width: "100%" }}>
                      <DataGrid
                        rows={event}
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
    </div>
      
    </>
  );
};

export default Event;
