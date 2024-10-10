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
} from "@mui/material";
import Footer from "../../Components/Footer";
import RootFamilyTree from "./RootFamilyTree";
import Family_tree from "./Family_tree";
import FatherFamilyTree from "./FatherFamilytree";
import HusbandFamilyTree from "./Husbandfamilytree";


const ViewFamilytree = () => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [gender, setGender] = useState("");
  const [isMarried, setIsMarried] = useState(false);
  const [femaleFamilyRefMembershipCode, setFemaleFamilyRefMembershipCode] =
    useState("");
  const [membershipCode, setMembershipCode] = useState("");
  const [viewType, setViewType] = useState("familyTree"); // Possible values: "familyTree", "rootFamilyTree", "fatherFamilyTree", "husbandFamilyTree"
  const navigate = useNavigate();
  const location = useLocation();

  // Extract data from location.state
  const {
    rowData,
    familyTreeData,
    searchResults,
    searchInput: input,
    gender: initialGender,
    isMarried: initialIsMarried,
    femaleFamilyRefMembershipCode: initialFemaleFamilyRefMembershipCode,
  } = location.state || {};

  useEffect(() => {
    if (familyTreeData) setSearchInput(familyTreeData);
    if (input) setSearchInput(input);
    if (initialGender) setGender(initialGender);
    if (initialIsMarried)
      setIsMarried(initialIsMarried === "true" || initialIsMarried === true);
    if (initialFemaleFamilyRefMembershipCode)
      setFemaleFamilyRefMembershipCode(initialFemaleFamilyRefMembershipCode);
    if (rowData?.membershipCode) setMembershipCode(rowData.membershipCode);
  }, [
    familyTreeData,
    input,
    initialGender,
    initialIsMarried,
    initialFemaleFamilyRefMembershipCode,
    rowData,
  ]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleBackButton = () => {
    navigate("/membership/familytree", {
      state: { searchResults: searchResults, searchInput: searchInput },
    });
  };

  const handleFamilyTreeClick = () => {
    setViewType("familyTree");
  };

  const handleRootFamilyTreeClick = () => {
    setViewType("rootFamilyTree");
  };

  const handleFatherFamilyTreeClick = () => {
    setViewType("fatherFamilyTree");
  };

  const handleHusbandFamilyTreeClick = () => {
    setViewType("husbandFamilyTree");
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transition: "margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            marginLeft: open ? { xs: "0", sm: "120px", md: "200px" } : "0",
            padding: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <div style={{ marginTop: "100px" }}>
            <Card
              sx={{
                maxWidth: { xs: "100%", sm: 500 },
                boxShadow: 3,
                padding: 3,
                mt: 2,
              }}
            >
              <CardContent>
                <Stack
                  direction="row" // Set direction to row for horizontal alignment
                  spacing={1}
                  sx={{
                    marginBottom: 2,
                    "& > *": {
                      mb: 0, // Remove bottom margin for buttons
                      p: { xs: 2, sm: 1 },
                    },
                    gap: 1, // Use gap instead of margin for spacing
                    flexWrap: "wrap", // Allow buttons to wrap if the screen is too small
                  }}
                >
                  {/* Buttons to switch views */}
                  {gender === "MALE" && membershipCode && (
                    <>
                      <Button
                        variant="contained"
                        color={
                          viewType === "rootFamilyTree"
                            ? "secondary"
                            : "primary"
                        }
                        onClick={handleRootFamilyTreeClick}
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          mb: 0,
                          p: { xs: 2, sm: 1 },
                        }}
                      >
                        Root Family Tree
                      </Button>

                      <Button
                        variant="contained"
                        color={
                          viewType === "familyTree" ? "primary" : "secondary"
                        }
                        onClick={handleFamilyTreeClick}
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          mb: 0,
                          p: { xs: 2, sm: 1 },
                        }}
                      >
                        Family Tree
                      </Button>
                    </>
                  )}

                  {gender === "FEMALE" && (
                    <>
                      {isMarried && (
                        <Button
                          variant="contained"
                          color={
                            viewType === "husbandFamilyTree"
                              ? "secondary"
                              : "primary"
                          }
                          onClick={handleHusbandFamilyTreeClick}
                          sx={{
                            width: { xs: "100%", sm: "auto" },
                            mb: 0,
                            p: { xs: 2, sm: 1 },
                          }}
                        >
                          Husband Family Tree
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleFatherFamilyTreeClick}
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          mb: 0,
                          p: { xs: 2, sm: 1 },
                        }}
                      >
                        Father Family Tree
                      </Button>
                      <Button
                        variant="contained"
                        color={
                          viewType === "familyTree" ? "primary" : "secondary"
                        }
                        onClick={handleFamilyTreeClick}
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          mb: 0,
                          p: { xs: 2, sm: 1 },
                        }}
                      >
                        Family Tree
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outlined"
                    onClick={handleBackButton}
                    sx={{ mt: 0 }} // Keep margin-top consistent
                  >
                    Back
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </div>

          {/* Conditionally render based on viewType */}
          {membershipCode && (
            <Box sx={{ mt: 4, width: "100%" }}>
              {viewType === "familyTree" && (
                <Family_tree membershipCode={membershipCode} />
              )}
              {viewType === "rootFamilyTree" && (
                <RootFamilyTree membershipCode={membershipCode} />
              )}
              {viewType === "fatherFamilyTree" && (
                <FatherFamilyTree membershipCode={membershipCode} />
              )}
              {viewType === "husbandFamilyTree" && (
                <HusbandFamilyTree membershipCode={membershipCode} />
              )}
            </Box>
          )}
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default ViewFamilytree;
