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
import { fetchMembers } from "../../ApiComponents/MembersApi";
import { BASE_URL } from "../../BaseUrl";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CheckCircleOutlineOutlined,
  CancelOutlined,
} from "@mui/icons-material";
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

const Members = () => {
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

  const ImageUrl = `${BASE_URL}/file/downloadFile/?filePath=`;

  //todo ==> GET Members Data

  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembersData();
  }, []);

  const fetchMembersData = async () => {
    try {
      const membersData = await fetchMembers(headers);
      const mappedMembersData = membersData.data.content.map((membersItem) => ({
        ...membersItem,
        id: membersItem.memberId,
      }));

      setMembers(mappedMembersData);
    } catch (error) {
      console.error("Error fetching members data:", error);
    }
  };

  const handleStatusToggle = async (memberId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/members/toggleStatus/${memberId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle status");
      }

      const updatedMembers = members.map((member) =>
        member.memberId === memberId
          ? { ...member, status: !member.status }
          : member
      );
      setMembers(updatedMembers);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const columns = [
    { field: "memberId", headerName: "ID", width: 70 },
    {
      field: "fullName",
      headerName: "fullName",
      width: 200,
    },
    { field: "userName", headerName: "userName", width: 200 },
    { field: "gender", headerName: "gender", width: 200 },
    { field: "mobileNumber", headerName: "mobileNumber", width: 200 },
    { field: "mailId", headerName: "mailId", width: 200 },
    {
      field: "profilePicPath",
      headerName: "File Path",
      width: 200,
      renderCell: (params) =>
        params.row.profilePicPath === null ? (
          "NO IMAGE FOUND"
        ) : (
          <img
            src={ImageUrl + params.row.profilePicPath}
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
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <>
          <Chip
            label={params.row.status ? "Active" : "Inactive"}
            color={params.row.status ? "success" : "error"}
          />
          {params.row.status ? (
            <IconButton
              color="success"
              onClick={() => handleStatusToggle(params.row.id)}
            >
              <CheckCircleOutlineOutlined />
            </IconButton>
          ) : (
            <IconButton
              color="error"
              onClick={() => handleStatusToggle(params.row.id)}
            >
              <CancelOutlined />
            </IconButton>
          )}
        </>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      renderCell: (params) => (
        <IconButton color="primary">
          <EditIcon />
        </IconButton>
      ),
    },
    // {
    //   field: "delete",
    //   headerName: "Delete",
    //   width: 100,
    //   renderCell: (params) => (
    //     <IconButton color="secondary">
    //       <DeleteIcon />
    //     </IconButton>
    //   ),
    // },
    
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
                <StyledBreadcrumb component="a" href="#" label="Users" />
                <StyledBreadcrumb
                  label="members"
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
                        rows={members}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize:10 },
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

export default Members;
