import React, { useEffect, useState } from "react";
import AppBarComponent from "../../Components/AppBarComponent";
import DrawerComponent from "../../Components/DrawerComponent";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Box, Button, CssBaseline, Stack, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import Footer from "../../Components/Footer";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  fetchPromo,
  postPromoData,
  getPromoById,
  updatedPromo,
  deletePromo,
} from "../../ApiComponents/PromoApi";

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

const Promo = () => {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  // const [selectedRow, setSelectedRow] = useState(null);

  const [promoId, setPromoId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPromoId(undefined); // Reset promoId when closing the dialog
    setUserdata({
      promoName: "",
      description: "",
      youTube: "",
    });
  };

  // State for field values
  const [userdata, setUserdata] = useState({
    promoName: "",
    description: "",
    youTube: "",
  });

  // State for field errors
  const [errors, setErrors] = useState({
    promoName: "",
    description: "",
    youTube: "",
  });

  //! Tokens and Headers
  const user = JSON.parse(sessionStorage.getItem("user"));

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Example validation - you can replace this with your own validation rules
    if (!userdata.promoName.trim()) {
      newErrors.promoName = "Promo Name is required";
      isValid = false;
    }

    if (!userdata.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!userdata.youTube.trim()) {
      newErrors.youTube = "YouTube Link is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Update changehandler function to set user input in state
  const changehandler = (e) => {
    const { name, value } = e.target;
    setUserdata((prevData) => ({
      ...prevData,
      [name]: value,
      createdBy: { userId: user.userId }, // Add createdBy field
    }));
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

  //todo ==> POST PROMO DATA
  const handlePostSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const promoData = {
          description: userdata.description,
          promoName: userdata.promoName,
          createdBy: { userId: user.userId },
          youTube: userdata.youTube,
        };

        // Use POST method for creating a new promo
        await postPromoData(promoData, headers);

        // Close the dialog after a successful submission
        setOpenDialog(false);

        //!need not refersh the page
        fetchPromoData();

        console.log("New promo created successfully:", promoData);
        setUserdata({
          promoName: "",
          description: "",
          youTube: "",
        });
      } catch (error) {
        console.error("Error creating new promo:", error);
      }
    }
  };

  //todo ==> GET  PROMO DATA
  const [promo, setPromo] = useState([]);

  useEffect(() => {
    // Fetch data when the component mounts and whenever the page changes
    fetchPromoData();
  }, []);

  const fetchPromoData = async () => {
    try {
      const promoData = await fetchPromo(headers);
      const mappedPromoData = promoData.data.content.map((promoItem) => ({
        ...promoItem,
        id: promoItem.promoId,
      }));

       // Update state with the fetched promo data
      setPromo(mappedPromoData);
    } catch (error) {
      console.error("Error fetching promo data:", error);
    }
  };

  //! tabel
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "promoName", headerName: "Promo Name", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    {
      field: "youTube",
      headerName: "YouTube",
      width: 120,
      renderCell: (params) =>
        params.row.youTube ? (
          <iframe
            width="90"
            height="80"
            src={`https://www.youtube.com/embed/${params.row.youTube}`}
            title={`YouTube Video - ${params.row.promoName}`}
          ></iframe>
        ) : null,
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

  //todo ==> GET DATA BY PROMO ID

  const handleEdit = async (id) => {
    console.log(`Edit button clicked for ID: ${id}`);
    const res = await getPromoById(headers, id);
    console.log(res);
    let det = res.data;
    console.log(det);
    setPromoId(det.promoId);
    setUserdata({
      promoName: det.promoName,
      description: det.description,
      youTube: det.youTube,
    });
    // Open the dialog after fetching the data
    setOpenDialog(true);
  };

  //Todo:handleEdit
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        const dataToSend = {
          description: userdata.description,
          promoId: promoId,
          promoName: userdata.promoName,
          updatedBy: { userId: user.userId },
          youTube: userdata.youTube,
        };

        // Use updatedPromo method and wait for the update to complete
        await updatedPromo(headers, dataToSend);

        // Fetch updated promo data after closing the dialog
        fetchPromoData();

        // Close the dialog after a successful update
        setOpenDialog(false);

        console.log("Promo data updated successfully:", dataToSend);
        setUserdata({
          promoName: "",
          description: "",
          youTube: "",
        });

        // Reset promoId when closing the dialog
        setPromoId(undefined);
      } catch (error) {
        console.error("Error updating promo:", error);
      }
    }
  };

  //todo ==> DELETE  PROMO DATA

  const handleDelete = async (id) => {
    try {
      // Call deletePromo and wait for the result
      const result = await deletePromo(headers, id);
  
      if (result) {
        // If deletion is successful, optimistically update the state
        setPromo((prevPromo) => prevPromo.filter((promoItem) => promoItem.id !== id));
  
        // Fetch updated data from the server
        await fetchPromoData();
      } else {
        // Handle if the user cancels the deletion
        console.log('Deletion canceled by the user');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      // Optionally, re-fetch data to ensure the table is consistent
      await fetchPromoData();
    }
  };
  



  

  return (
    <>
      <div style={{ backgroundColor: "#EEEEEE" }}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          <CssBaseline />
          <AppBarComponent open={open} handleDrawerOpen={handleDrawerOpen} />
          <DrawerComponent open={open} handleDrawerClose={handleDrawerClose} />
          <Box
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
                    label="Promo"
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
                        Add Promo
                      </Button>
                      <Dialog
                        open={openDialog || promoId !== undefined}
                        onClose={handleCloseDialog}
                        PaperProps={{
                          component: "form",
                          onSubmit: (e) =>
                            promoId !== undefined
                              ? handleUpdateSubmit(e)
                              : handlePostSubmit(e),
                        }}
                      >
                        <DialogTitle>
                          {promoId !== undefined ? "Edit Promo" : "Add Promo"}
                        </DialogTitle>
                        <DialogContent>
                          <TextField
                            autoFocus
                            margin="dense"
                            id="promoName"
                            name="promoName"
                            label="Promo Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={userdata.promoName}
                            onChange={(e) => {
                              changehandler(e);
                              setErrors({ ...errors, promoName: "" });
                            }}
                            error={!!errors.promoName}
                            helperText={errors.promoName}
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
                            onChange={(e) => {
                              changehandler(e);
                              setErrors({ ...errors, description: "" });
                            }}
                            error={!!errors.description}
                            helperText={errors.description}
                          />
                          <TextField
                            autoFocus
                            margin="dense"
                            id="youTube"
                            name="youTube"
                            label="YouTube"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={userdata.youTube}
                            onChange={(e) => {
                              changehandler(e);
                              setErrors({ ...errors, youTube: "" });
                            }}
                            error={!!errors.youTube}
                            helperText={errors.youTube}
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button variant="contained" type="submit">
                            {promoId !== undefined ? "Update" : "Submit"}
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
                    <div style={{ height: 400, width: "100%" }}>
                      <DataGrid
                        rows={promo}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                          },
                        }}
                        pageSizeOptions={[10,50,100]}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Box>
          <Box
            sx={{
              transition: "margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
              ...commonMarginStyle,
            }}
          >
            <Footer />
          </Box>
        </Box>
      </div>
    </>
  );
};

export default Promo;
