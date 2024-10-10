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
import Footer from "../../Components/Footer";
import { addBlukNotification, deleteBulkNotification, fetchBulkNotification } from "../../ApiComponents/NoteNotificationApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteSuccessStory } from "../../ApiComponents/SuccessStoryApi";

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




const NoteNotification = () => {
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

  //! Tokens and Headers
  const user = JSON.parse(sessionStorage.getItem("user"));

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  //!validation
  const [formData, setFormData] = useState({
    message: "",
    status: "",
    title: "",
    topic: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    message: "",
    status: "",
    title: "",
    topic: "",
  });

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Add your validation logic here
    if (!formData.message) {
      errors.message = "Message is required";
      isValid = false;
    }

    if (!formData.status) {
      errors.status = "Status is required";
      isValid = false;
    }

    if (!formData.title) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!formData.topic) {
      errors.topic = "Topic is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const setField = (fieldName, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
      createdBy: { userId: user.userId },
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));
  };

  //todo ==> POST BulkNotification DATA
  const onSubmitHandler = async (event) => {
    event.preventDefault();
  
    const isValid = validateForm();
  
    if (isValid) {
      await postNotification();
      resetForm();
      handleCloseDialog(); // Close the dialog after submitting
      fetchBulkNotificationData();
    }
  };

  const postNotification = async () => {
    try {
      const postData = {
        email: formData.email,
        message: formData.message,
        status: formData.status,
        title: formData.title,
        topic: formData.topic,
        createdBy: formData.createdBy,
      };

      const response = await addBlukNotification(postData, headers);

      console.log("Notification posted successfully:", response.data);
    } catch (error) {
      console.error("Error posting notification:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      message: "",
      status: "",
      title: "",
      topic: "",
    });
  };

  //todo ==> GET  BulkNotification DATA
  const [bulknotification, setBulkNotification] = useState([]);

  // Fetch data and update rows
  useEffect(() => {
    fetchBulkNotificationData();
  }, []);


  const fetchBulkNotificationData = async () => {
    try {
      const bulknotificationData = await fetchBulkNotification(headers); // Assuming fetchAdvertise function is asynchronous
      console.log(bulknotificationData);
      const mappedBulkNotificationData = bulknotificationData.data.content.map(
        (bluknotificationItem) => ({
          ...bluknotificationItem,
          id: bluknotificationItem.bulkNotificationId,
        })
      );

      setBulkNotification(mappedBulkNotificationData);
    } catch (error) {
      console.error("Error fetching advertisement data:", error);
    }
  };

  const columns = [
    { field: "bulkNotificationId", headerName: " ID", width: 150 },
    { field: "topic", headerName: "Topic", width: 150 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "message", headerName: "Message", width: 200 },
    // { field: "result", headerName: "Result", width: 120 },
    { field: "status", headerName: "Status", width: 120 },
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


  const handleDelete=async(id) => {
    await deleteBulkNotification(id, headers)
    console.log(`Edit button clicked for ID: ${id}`);
    fetchBulkNotificationData();
  }


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
                  label="Notification"
                />
                <StyledBreadcrumb
                  label="Bulk Notification"
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
                      Add Notification
                    </Button>
                    <Dialog
                      open={openDialog}
                      onClose={handleCloseDialog}
                      PaperProps={{
                        component: "form",
                      }}
                    >
                      <DialogTitle>Add Notification</DialogTitle>
                      <DialogContent>
                        <TextField
                          autoFocus
                          required
                          margin="dense"
                          id="message"
                          name="message"
                          label="Message"
                          fullWidth
                          variant="standard"
                          value={formData.message}
                          onChange={(e) => setField("message", e.target.value)}
                          error={!!validationErrors.message}
                          helperText={validationErrors.message}
                        />
                        <TextField
                          required
                          margin="dense"
                          id="status"
                          name="status"
                          label="Status"
                          fullWidth
                          variant="standard"
                          value={formData.status}
                          onChange={(e) => setField("status", e.target.value)}
                          error={!!validationErrors.status}
                          helperText={validationErrors.status}
                        />
                        <TextField
                          required
                          margin="dense"
                          id="title"
                          name="title"
                          label="Title"
                          fullWidth
                          variant="standard"
                          value={formData.title}
                          onChange={(e) => setField("title", e.target.value)}
                          error={!!validationErrors.title}
                          helperText={validationErrors.title}
                        />
                        <TextField
                          required
                          margin="dense"
                          id="topic"
                          name="topic"
                          label="Topic"
                          fullWidth
                          variant="standard"
                          value={formData.topic}
                          onChange={(e) => setField("topic", e.target.value)}
                          error={!!validationErrors.topic}
                          helperText={validationErrors.topic}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialog} variant="contained">
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          onClick={onSubmitHandler}
                        >
                          Submit
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Stack>
                  <br />
                  <div>
                    <div style={{ height: 400, width: "100%" }}>
                      <DataGrid
                        rows={bulknotification}
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

export default NoteNotification;
