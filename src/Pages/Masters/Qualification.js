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
import {
  addQualification,
  deleteQualification,
  fetchQualificationApi,
  getQualificationById,
  updatedQualification,
} from "../../ApiComponents/QualificationApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

const Qualification = () => {
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
    qualificationName: "",
    description: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    qualificationName: "",
    description: "",
  });

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Add your validation logic here
    if (!formData.qualificationName) {
      errors.qualificationName = "qualificationName is required";
      isValid = false;
    }

    if (!formData.description) {
      errors.description = "description is required";
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

  //todo ==> POST Qualification DATA
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      await postQualification();
      resetForm();
      handleCloseDialog(); // Close the dialog after submitting
      fetchQualificationData();
    }
  };

  const postQualification = async () => {
    const postData = {
      qualificationName: formData.qualificationName,
      description: formData.description,
      createdBy: formData.createdBy,
    };

    await addQualification(postData, headers);
  };

  const resetForm = () => {
    setFormData({
      qualificationName: "",
      description: "",
    });
  };

  //todo ==> GET  Qualification DATA
  const [qualification, setQualification] = useState([]);

  // Fetch data and update rows
  useEffect(() => {
    fetchQualificationData();
  }, []);

  const fetchQualificationData = async () => {
    try {
      const qualificationData = await fetchQualificationApi(headers); // Assuming fetchAdvertise function is asynchronous
      const mappedQualificationData = qualificationData.data.content.map(
        (qualificationItem) => ({
          ...qualificationItem,
          id: qualificationItem.qualificationId,
        })
      );

      setQualification(mappedQualificationData);
    } catch (error) {
      console.error("Error fetching qualification data:", error);
    }
  };

  const columns = [
    { field: "qualificationId", headerName: " ID", width: 150 },
    { field: "qualificationName", headerName: "qualification", width: 150 },
    { field: "description", headerName: "Description", width: 150 },

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

  //todo:getQualification by id
  const [qualificationId, setQualificationId] = useState();
  const handleEdit = async (id) => {
    console.log(`Edit button clicked for ID: ${id}`);
    try {
      const res = await getQualificationById(id, headers);
      console.log(res);
      let det = res.data;
      console.log(det);
      setQualificationId(det.qualificationId);
      setFormData({
        qualificationName: det.qualificationName,
        description: det.description,
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
        qualificationId: qualificationId,
        qualificationName: formData.qualificationName,
        description: formData.description,
        updatedBy: { userId: user.userId },
      };

      console.log(dataToSend);

      await updatedQualification(dataToSend, headers);

      fetchQualificationData();

      // Open the dialog after fetching the data
      setOpenDialog(false);

      setFormData({
        qualificationName: "",
        description: "",
      });

      // Reset promoId when closing the dialog
      setQualificationId(undefined);
    } catch (error) {
      console.error("Error fetching advertisement by ID:", error);
      // Handle error, e.g., show an error message to the user
    }
  };

  //todo ==> DELETE  Qualification DATA
  const handleDelete = async (id) => {
    try {
      // Call deleteQualification and wait for the result
      const result = await deleteQualification(id, headers);
      
      if (result) {
        // If deletion is successful, optimistically update the state
        setQualification((prevQualifications) => prevQualifications.filter((qualification) => qualification.id !== id));
        
        // Fetch updated data from the server
        await fetchQualificationData();
      } else {
        // Handle if the user cancels the deletion
        console.log('Deletion canceled by the user');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      // Optionally, re-fetch data to ensure the state is consistent
      await fetchQualificationData();
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
                <StyledBreadcrumb component="a" href="#" label="Masters" />
                <StyledBreadcrumb
                  label="Qualification"
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
                      Add Qualification
                    </Button>
                    <Dialog
                      open={openDialog || qualificationId !== undefined}
                      onClose={handleCloseDialog}
                      PaperProps={{
                        component: "form",
                      }}
                    >
                      <DialogTitle>
                        {" "}
                        {qualificationId !== undefined
                          ? "Edit Qualification"
                          : "Add Qualification"}
                      </DialogTitle>
                      <DialogContent>
                        <TextField
                          autoFocus
                          required
                          margin="dense"
                          id="qualificationName"
                          name="qualificationName"
                          label="QualificationName"
                          fullWidth
                          variant="standard"
                          value={formData.qualificationName}
                          onChange={(e) =>
                            setField("qualificationName", e.target.value)
                          }
                          error={!!validationErrors.qualificationName}
                          helperText={validationErrors.qualificationName}
                        />
                        <TextField
                          required
                          margin="dense"
                          id="description"
                          name="description"
                          label="Description"
                          fullWidth
                          variant="standard"
                          value={formData.description}
                          onChange={(e) =>
                            setField("description", e.target.value)
                          }
                          error={!!validationErrors.description}
                          helperText={validationErrors.description}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialog} variant="contained">
                          Cancel
                        </Button>
                        {qualificationId ? (
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
                            onClick={onSubmitHandler}
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
                        rows={qualification}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize:10},
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

export default Qualification;
