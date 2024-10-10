import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AppBarComponent from "../../Components/AppBarComponent";
import DrawerComponent from "../../Components/DrawerComponent";
import {
  Box,
  Button,
  CssBaseline,
  Stack,
  Typography,
  Breadcrumbs,
  Chip,
  Card,
  CardContent,
  CardHeader
} from "@mui/material";
import { emphasize, styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ManOutlinedIcon from '@mui/icons-material/ManOutlined';
import Woman2OutlinedIcon from '@mui/icons-material/Woman2Outlined';
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

const PersonalInfo = () => {
  const [open, setOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [error, setError] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const user = JSON.parse(sessionStorage.getItem("user"));

  const navigate = useNavigate();
  const location = useLocation();
  const { membershipInfo } = location.state || {};

  if (!membershipInfo) {
    return <Typography>No data available.</Typography>;
  }

  const {
    fullName,
    parentsDTO = [],
    spouseDto = [],
    childrenDto = [],
    siblingsDto = [],
  } = membershipInfo;

  const handleBack = () => {
    navigate("/membership/familytree");
  };

  const handlePersonClick = async (person) => {
    try {
      console.log("Fetching personal info for:", person.membershipCode);

      const headers = {
        Authorization: "Bearer " + user.accessToken,
        "Content-Type": "application/json",
      };

      const response = await axios.get(
        `${BASE_URL}/membership/v1/findMembershipAssociationByMembershipCode/{membershipCode}?membershipCode=${person.membershipCode}`,
        { headers }
      );

      console.log("Personal info response:", response.data);
      setSelectedPerson(response.data);
      setError(null);
    } catch (error) {
      console.error(
        "Error fetching personal info data:",
        error.response ? error.response.data : error.message
      );
      setError("Error fetching personal info data. Please try again.");
    }
  };

  const renderNames = (namesArray) => {
    if (!Array.isArray(namesArray)) {
      return <Typography>No data available</Typography>;
    }
    return namesArray.length > 0 ? (
      namesArray.map((item) => {
        const backgroundColor = item.isAlive ? "lightgreen" : "lightcoral"; // Light green for alive, light red for not alive

        return (
          <div
            key={item.membershipCode}
            style={{
              cursor: "pointer",
              color: "blue",
              display: "flex",
              alignItems: "center",
              backgroundColor, // Apply background color based on isAlive status
              padding: "4px", // Add padding for better visual appearance
              marginBottom: "5px", // Space between names
              borderRadius: "4px", // Rounded corners for a better look
            }}
            onClick={() => handlePersonClick(item)}
          >
            {item.gender === "MALE" && <ManOutlinedIcon sx={{ marginRight: 1, color: "blue" }} />}
            {item.gender === "FEMALE" && <Woman2OutlinedIcon sx={{ marginRight: 1, color: "pink" }} />}
            {item.fullName}
          </div>
        );
      })
    ) : (
      <Typography>No data available</Typography>
    );
  };

  const renderMotherName = (parentsArray) => {
    if (!Array.isArray(parentsArray) || parentsArray.length === 0) {
      return <Typography>No data available</Typography>;
    }

    const father = parentsArray.find((parent) => parent.gender === "MALE");
    if (father && Array.isArray(father.spouses) && father.spouses.length > 0) {
      return renderNames(father.spouses);
    }

    return <Typography>No data available</Typography>;
  };

  const personToDisplay = selectedPerson || membershipInfo;

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
                <StyledBreadcrumb component="a" href="#" label="Membership" />
                <StyledBreadcrumb
                  label="Personal Info"
                  deleteIcon={<ExpandMoreIcon />}
                  onDelete={handleClick}
                />
              </Breadcrumbs>
            </div>

            <br />
            <br />
          </div>
        </Box>

        {/* Back Button on top of the cards */}
        <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: "center", ml: -50 }}>
          <Button variant="contained" onClick={handleBack}>
            Back
          </Button>
        </Stack>

        <Box
          sx={{
            padding: 4,
            backgroundColor: "#f4f4f4",
            width: "40%",
            margin: "0 auto",
            fontFamily: "Arial, sans-serif",
            textAlign: "center", // Center the text and cards on desktop
            marginTop: "80px", // Margin to push it down from top
            "@media (max-width: 600px)": {
              margin: "0", // Reset margin for mobile view
              paddingLeft: "16px", // Add padding to the left for mobile view
              paddingRight: "16px", // Add padding to the right for mobile view
              marginLeft:"60px",
              width: "300px",
            },
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: "bold", color: "#333", marginBottom: 2 }}
          >
            Personal Details of {personToDisplay.fullName}
          </Typography>

          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}

          <Card sx={{ marginBottom: 3 }}>
            <CardHeader
              title="Parents"
              sx={{ backgroundColor: "#eee" }}
            />
            <CardContent>
              <Typography sx={{ color: "#555" }}>
                 {renderNames(personToDisplay.parentsDTO)}
              </Typography>
              <Typography sx={{ color: "#555" }}>
                 {renderMotherName(personToDisplay.parentsDTO)}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ marginBottom: 3 }}>
            <CardHeader
              title="Spouse"
              sx={{ backgroundColor: "#eee" }}
            />
            <CardContent>
              {renderNames(personToDisplay.spouseDto)}
            </CardContent>
          </Card>

          <Card sx={{ marginBottom: 3 }}>
            <CardHeader
              title="Siblings"
              sx={{ backgroundColor: "#eee" }}
            />
            <CardContent>
              <Typography sx={{ paddingLeft: 2, color: "#555" }}>
                {renderNames(personToDisplay.siblingsDto)}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ marginBottom: 3 }}>
            <CardHeader
              title="Children"
              sx={{ backgroundColor: "#eee" }}
            />
            <CardContent>
              <Typography sx={{ paddingLeft: 2, color: "#555" }}>
                {renderNames(personToDisplay.childrenDto)}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <br />
      <Box
        sx={{
          transition: "margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
          marginLeft: open ? "200px" : "0",
          "@media (max-width: 600px)": {
            marginLeft: open ? "120px" : "0",
          },
        }}
      >
        <Footer />
      </Box>
    </>
  );
};

export default PersonalInfo;
