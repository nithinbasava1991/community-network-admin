import React, { useEffect, useState } from "react";
import AppBarComponent from "../../Components/AppBarComponent";
import DrawerComponent from "../../Components/DrawerComponent";
import {
  Box,
  Button,
  Card,
  CardContent,
  CssBaseline,
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
import { fetchRequestMain } from "../../ApiComponents/RequestMainApi";
import Footer from "../../Components/Footer";

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

const RequestMain = () => {
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

  //todo ==> GET Request Data

  const [request, setRequest] = useState([]);

  useEffect(() => {
    fetchRequestData();
  }, []);

  const fetchRequestData = async () => {
    try {
      const requestData = await fetchRequestMain(headers);
      const mappedRequestData = requestData.data.content.map((requestItem) => ({
        ...requestItem,
        id: requestItem.requestId,
      }));

      setRequest(mappedRequestData);
    } catch (error) {
      console.error("Error requset members data:", error);
    }
  };

  const columns = [
    { field: "requestId", headerName: "Request ID", width: 150 },
    { field: "requestName", headerName: "Request Name", width: 200 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "status", headerName: "Status", width: 120 },
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
      field: "acceptedBy",
      headerName: "Accepted By",
      width: 150,
      valueGetter: (params) => params.row.acceptedBy || "N/A",
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      width: 150,
      valueGetter: (params) => params.row.updatedBy || "N/A",
    },
    {
      field: "requestedByUserName",
      headerName: "Requested By User Name",
      width: 200,
      valueGetter: (params) => params.row.requestedBy?.userName || "N/A",
    },
    {
      field: "requestTypeName",
      headerName: "Request Type Name",
      width: 200,
      valueGetter: (params) =>
        params.row.requestTypeDto?.requestTypeName || "N/A",
    },
  ];

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
                <StyledBreadcrumb component="a" href="#" label="Request" />
                <StyledBreadcrumb
                  label="RequestMain"
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
                  {/* <Stack direction="row">
                    <Button variant="contained" onClick={handleOpenDialog}>
                      <AddIcon />
                      Add Banner
                    </Button>
                    <Dialog
                      open={openDialog}
                      onClose={handleCloseDialog}
                      PaperProps={{
                        component: "form",
                        onSubmit: (event) => {
                          event.preventDefault();
                          const formData = new FormData(event.currentTarget);
                          const formJson = Object.fromEntries(
                            formData.entries()
                          );
                          const email = formJson.email;
                          console.log(email);
                          handleCloseDialog();
                        },
                      }}
                    >
                      <DialogTitle>Subscribe</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          To subscribe to this website, please enter your email
                          address here. We will send updates occasionally.
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          margin="dense"
                          id="name"
                          name="email"
                          label="Email Address"
                          type="email"
                          fullWidth
                          variant="standard"
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button type="submit">Subscribe</Button>
                      </DialogActions>
                    </Dialog>
                  </Stack> */}
                  <br />
                  <div>
                    <div style={{ height: 400, width: "100%" }}>
                      <DataGrid
                        rows={request}
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

export default RequestMain;
