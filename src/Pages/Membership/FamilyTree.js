import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppBarComponent from "../../Components/AppBarComponent";
import DrawerComponent from "../../Components/DrawerComponent";
import {
  Box,
  Card,
  CardContent,
  CssBaseline,
  Stack,
  Button,
  Typography,
  InputBase,
  IconButton,
  Grid,
  Breadcrumbs,
  Chip,
} from "@mui/material";
import { emphasize, styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ManOutlinedIcon from "@mui/icons-material/ManOutlined";
import Woman2OutlinedIcon from "@mui/icons-material/Woman2Outlined";
import Footer from "../../Components/Footer";
import axios from "axios";
import { findMembershipByFullName } from "../../ApiComponents/FamilTreeApi";
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

const FamilyTree = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [formattedData, setFormattedData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const { searchResults = [], searchInput = "" } = location.state || {};

  useEffect(() => {
    if (searchResults.length === 0) return; // Or any other condition
    const data = searchResults.map((item, index) => ({
      id: item.id || index + 1,
      fullName: item.fullName || "N/A",
      dob: item.dob || "N/A",
      gender: item.gender || "N/A",
      membershipCode: item.membershipCode || "N/A",
      femaleFamilyRefMembershipCode: item.femaleFamilyRefMembershipCode || "N/A",
      isAlive: item.isAlive === true,
      isMarried: item.isMarried === true,
    }));
    setRows(data);
    setFormattedData(data);
    setInput(searchInput);
  }, [searchResults, searchInput]);
  

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user?.accessToken,
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
    if (!event.target.value) setRows([]);
    setError("");
  };

  const handleClearInput = () => {
    setInput("");
    setRows([]);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input) {
      setError("Please enter the name.");
      setRows([]);
      return;
    }
    try {
      const data = await findMembershipByFullName(input, headers);
      const formattedData = data.map((item, index) => ({
        id: item.id || index + 1,
        fullName: item.fullName || "N/A",
        dob: item.dob || "N/A",
        gender: item.gender || "N/A",
        membershipCode: item.membershipCode || "N/A",
        femaleFamilyRefMembershipCode:
          item.femaleFamilyRefMembershipCode || "N/A",
        isAlive: item.isAlive === true,
        isMarried: item.isMarried === true,
      }));
      setRows(formattedData);
      setFormattedData(formattedData);
      setError("");
      navigate("/membership/familytree", {
        state: { searchResults: formattedData, searchInput: input },
      });
    } catch (error) {
      setError("Error fetching data. Please try again.");
    }
  };

  const handleViewFamily = async (row) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/membership/v1/findRootFamilyTreeByMembershipCode/${row.membershipCode}`,
        { headers }
      );
      navigate("/viewfamily", {
        state: {
          rowData: row,
          familyTreeData: response.data,
          searchResults: rows,
          searchInput: input,
          gender: row.gender,
          isMarried: row.isMarried,
          femaleFamilyRefMembershipCode: row.femaleFamilyRefMembershipCode,
          membershipCode: row.membershipCode
        },
      });
    } catch (error) {
      console.error("Error fetching family tree data:", error);
    }
  };

  const handlePersonalInfo = async (row) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/membership/v1/findMembershipAssociationByMembershipCode/${row.membershipCode}?membershipCode=${row.membershipCode}`,
        { headers }
      );
      navigate("/personalinfo", { state: { membershipInfo: response.data } });
    } catch (error) {
      setError("Error fetching personal info data. Please try again.");
    }
  };

  const getCardBackgroundColor = (isAlive) => (isAlive ? "#e8f5e9" : "#fce4ec");
  const getGenderIcon = (gender) =>
    gender === "MALE" ? <ManOutlinedIcon color="primary" /> : gender === "FEMALE" ? <Woman2OutlinedIcon color="secondary" /> : null;

  const handleDebug = () => {
    console.log("isMarried values:", formattedData.map(item => item.isMarried));
  };

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
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb
                component="a"
                href="#"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />
              <StyledBreadcrumb component="a" href="#" label="Membership" />
              <StyledBreadcrumb
                label="FamilyTree"
                deleteIcon={<ExpandMoreIcon />}
                onDelete={handleClick}
              />
            </Breadcrumbs>

            <Card
              sx={{
                minWidth: 275,
                boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.75)",
                marginLeft: "-20px",
                "@media (max-width: 400px)": {
                  marginLeft: "0px",
                },
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                      width: "100%",
                      borderRadius: "9999px",
                      boxShadow: 1,
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 15px",
                      flexWrap: "wrap",
                    }}
                  >
                    <IconButton type="submit" aria-label="search">
                      <SearchIcon style={{ fill: "blue" }} />
                    </IconButton>
                    <InputBase
                      placeholder="Search a FullName"
                      inputProps={{ "aria-label": "search google" }}
                      sx={{ ml: 1, flex: 1 }}
                      value={input}
                      onChange={handleInputChange}
                    />
                    {input && (
                      <IconButton
                        sx={{ p: "10px" }}
                        onClick={handleClearInput}
                        aria-label="clear"
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </Box>
                </Stack>

                {error && (
                  <Typography
                    color="error"
                    sx={{ marginTop: "10px", textAlign: "center" }}
                  >
                    {error}
                  </Typography>
                )}

                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  {rows.length > 0 ? (
                    rows.map((row) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={row.id}>
                        <Card
                          sx={{
                            backgroundColor: getCardBackgroundColor(row.isAlive),
                            padding: 2,
                          }}
                        >
                          <CardContent>
                            {getGenderIcon(row.gender)}
                            <Typography variant="h6" sx={{ marginTop: 1 }}>
                              {row.fullName}
                            </Typography>
                            <Typography variant="body2">
                              DOB: {row.dob}
                            </Typography>
                            <Typography variant="body2">
                              Membership Code: {row.membershipCode}
                            </Typography>
                            <Typography variant="body2">
                              Ref Code: {row.femaleFamilyRefMembershipCode}
                            </Typography>
                            <Typography variant="body2">
                              Status: {row.isAlive ? "Alive" : "Deceased"}
                            </Typography>
                            <Typography variant="body2">
                              Married: {row.isMarried ? "Yes" : "No"}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleViewFamily(row)}
                              >
                                View Family
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handlePersonalInfo(row)}
                              >
                                Personal Info
                              </Button>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Typography variant="body1" sx={{ textAlign: "center",marginLeft:"30px" }}>
                      No data available
                    </Typography>
                  )}
                </Grid>
              </CardContent>
            </Card>
           
          </div>
        </Box>
        <div>
        <Footer />
        </div>
        
      </Box>
    </>
  );
};

export default FamilyTree;
