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
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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
import { fetchStaff, updateStaff } from "../../ApiComponents/StaffApi";
import EditIcon from "@mui/icons-material/Edit";
import { CheckCircleOutlineOutlined, CancelOutlined } from "@mui/icons-material";
import Footer from "../../Components/Footer";
import axios from "axios";
import useFetchRoles from "./useFetchRoles";
import { BASE_URL } from "../../BaseUrl";
import Swal from 'sweetalert2'

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



const Staff = () => {

  //!Appbar and Drawer
  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState({});
  const [selectedRole, setSelectedRole] = useState("");
  const [roleError, setRoleError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    mobileNumber: "",
    email: "",
    role: "",
  });
  const [formErrors, setFormErrors] = useState({
    userName: "",
    fullName: "",
    mobileNumber: "",
    email: "",
  });

  const user = JSON.parse(sessionStorage.getItem("user"));

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const validateRole = () => {
    if (!selectedRole) {
      setRoleError("Role is required");
      return false;
    } else {
      setRoleError("");
      return true;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "User Name is required";
      isValid = false;
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
      isValid = false;
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile Number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = "Mobile Number is invalid";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    const isValidForm = validateForm() && validateRole();

    if (isValidForm) {
      try {
        const response = await axios.post("YOUR_API_ENDPOINT", formData, {
          headers: headers,
        });

        if (response.status === 200) {
          console.log("Form submitted successfully:", response.data);
          handleCloseDialog();
          setFormData({
            userName: "",
            fullName: "",
            mobileNumber: "",
            email: "",
            role: "",
          });
          setFormErrors({
            userName: "",
            fullName: "",
            mobileNumber: "",
            email: "",
          });
        } else {
          console.error("Error submitting form: Unexpected status code");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const staffData = await fetchStaff(headers);
      const mappedStaffData = staffData.data.content.map((staffItem) => ({
        ...staffItem,
        id: staffItem.userId,
        status: staffItem.active,
      }));
      setStaff(mappedStaffData);
    } catch (error) {
      console.error("Error fetching staff data:", error);
    }
  };

  const toggleStatus = async (staffId) => {
    try {
      const updatedStaff = staff.map((item) =>
        item.id === staffId ? { ...item, status: !item.status } : item
      );
      setStaff(updatedStaff);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const columns = [
    { field: "userId", headerName: "userId", width: 100 },
    {
      field: "fullName",
      headerName: "Full Name",
      width: 200,
      valueGetter: (params) => params.row.fullName || "N/A", // Handle null values
    },
    { field: "userName", headerName: "User Name", width: 150 },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      width: 150,
      valueGetter: (params) =>
        params.row.mobileNumber ? params.row.mobileNumber : "N/A", // Handle null values
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      valueGetter: (params) =>
        params.row.email ? params.row.email : "N/A", // Handle null values
    },
    {
      field: "roleName",
      headerName: "Role Name",
      width: 150,
      valueGetter: (params) =>
        params.row.roleDto && params.row.roleDto.roleName
          ? params.row.roleDto.roleName
          : "N/A",
    },
    {
      field: "createdBy.userName",
      headerName: "Created By",
      width: 150,
      valueGetter: (params) =>
        params.row.createdBy ? params.row.createdBy.userName : "N/A", // Handle null values
    },
    {
      field: "updatedBy.userName",
      headerName: "Updated By",
      width: 150,
      valueGetter: (params) =>
        params.row.updatedBy ? params.row.updatedBy.userName : "N/A", // Handle null values
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
              onClick={() => toggleStatus(params.row.id)}
            >
              <CheckCircleOutlineOutlined />
            </IconButton>
          ) : (
            <IconButton
              color="error"
              onClick={() => toggleStatus(params.row.id)}
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
        <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
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

  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setFormData({
      userName: staff.userName,
      fullName: staff.fullName,
      mobileNumber: staff.mobileNumber,
      email: staff.email,
      role: staff.roleDto?.roleName || "",
    });
    setSelectedRole(staff.roleDto?.roleName || "");
    setFormErrors({
      userName: "",
      fullName: "",
      mobileNumber: "",
      email: "",
    });
    setRoleError("");
    handleOpenDialog();
  };

  const { roles } = useFetchRoles(headers);

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setRoleError("");
  };


    //todo ==> UPDATE Staff DATA
    const handleUpdateSubmit = async (e) => {
      e.preventDefault();
    
      const isValidForm = validateForm() && validateRole();
    
      if (isValidForm) {
        try {
          // Construct the JSON object as per the API requirements
          const updatedData = {
            userId: selectedStaff.userId,
            active: selectedStaff.status, // Assuming status field reflects if the user is active
            email: formData.email,
            fullName: formData.fullName,
            mobileNumber: formData.mobileNumber,
            password: selectedStaff.password, // Assuming the password is already available in selectedStaff
            roleDto: { roleId: roles.find((role) => role.roleName === selectedRole).roleId }, // Find the correct roleId
            updatedBy: { userId: user.userId }, // Assuming `user` is the logged-in user
            userName: formData.userName,
          };
    
          // Send the PUT request to the update API endpoint
          const response = await axios.put(
            `${BASE_URL}/userprofile/v1/updateUserProfile`,
            updatedData,
            { headers }
          );
    
          if (response.status === 200) {
            // Close the dialog
            handleCloseDialog();
    
            // Show SweetAlert2 alert after dialog is closed
            Swal.fire({
              title: 'Success!',
              text: 'Staff updated successfully.',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              setFormData({
                userName: "",
                fullName: "",
                mobileNumber: "",
                email: "",
                role: "",
              });
              fetchStaffData(); // Refresh the staff data
            });
          } else {
            // Show SweetAlert2 alert for unexpected status code
            Swal.fire({
              title: 'Error!',
              text: 'Error updating staff: Unexpected status code.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        } catch (error) {
          // Show SweetAlert2 alert for error
          Swal.fire({
            title: 'Error!',
            text: 'Error updating staff: ' + error.message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      }
    };
    
    
    
  

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBarComponent open={open} handleDrawerOpen={handleDrawerOpen} />
        <DrawerComponent open={open} handleDrawerClose={handleDrawerClose} />
      <Box component="section"
          sx={{
            flexGrow: 1,
            transition: "margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            marginLeft: open ? "200px" : "0",
            "@media (max-width: 600px)": {
              marginLeft: open ? "120px" : "0",
            },
          }}>
      <div style={{ marginLeft: "70px", marginTop: "80px" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, ...commonMarginStyle }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <StyledBreadcrumb component="a" href="/" label="Home" icon={<HomeIcon fontSize="small" />} />
          <StyledBreadcrumb label="Staff" />
        </Breadcrumbs>
        <Card>
          <CardContent>
            <Stack direction="row" justifyContent="flex-start" sx={{ mb: 2 }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
                Add Staff
              </Button>
            </Stack>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid rows={staff} columns={columns} pageSize={5} />
            </div>
          </CardContent>
        </Card>
      </Box>
      </div>
      </Box>
      <Footer sx={{ mt: "auto" }} />
      
      {/* Dialog for Add/Edit Staff */}
      <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ component: "form" }}>
        <DialogTitle>{selectedStaff.userId ? "Update Staff" : "Add Staff"}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="User Name"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            error={!!formErrors.userName}
            helperText={formErrors.userName}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={!!formErrors.fullName}
            helperText={formErrors.fullName}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Mobile Number"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            error={!!formErrors.mobileNumber}
            helperText={formErrors.mobileNumber}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!formErrors.email}
            helperText={formErrors.email}
            fullWidth
            variant="standard"
          />

          {/* Role Dropdown */}
          <FormControl variant="standard" fullWidth error={!!roleError}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={selectedRole}
              onChange={handleRoleChange}
            >
              {roles.map((role) => (
                <MenuItem key={role.roleId} value={role.roleName}>
                  {role.roleName}
                </MenuItem>
              ))}
            </Select>
            {roleError && <FormHelperText error>{roleError}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="submit" onClick={selectedStaff.userId ? handleUpdateSubmit : handlePostSubmit}>
            {selectedStaff.userId ? "Update" : "Submit"}
          </Button>
          <Button onClick={handleCloseDialog} variant="contained">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Staff;
