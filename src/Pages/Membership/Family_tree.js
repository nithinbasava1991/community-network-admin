import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IconButton,
  Box,
  CssBaseline,
  CircularProgress,
  Typography,
} from "@mui/material";
import AppBarComponent from "../../Components/AppBarComponent";
import DrawerComponent from "../../Components/DrawerComponent";
import Footer from "../../Components/Footer";
import axios from "axios";
import backwardimage from "../../images/left-arrow.png";
import { Tree, TreeNode } from "react-organizational-chart";
import ManOutlinedIcon from "@mui/icons-material/ManOutlined";
import Woman2OutlinedIcon from "@mui/icons-material/Woman2Outlined";
import { useMediaQuery } from "@mui/material";
import { BASE_URL } from "../../BaseUrl";

// Utility function to transform JSON data into tree nodes
const transformDataToTree = (data, handleClick) => {
  const {
    parentsDTO,
    siblingsDto,
    spouseDto,
    childrenDto,
    fullName,
    isAlive,
    gender,
  } = data;

  const createNode = (person, label, children = []) => (
    <TreeNode
      label={
        <div
          onClick={() =>
            handleClick(label, person.fullName, person.membershipCode)
          }
          style={{
            cursor: "pointer",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            backgroundColor: person.isAlive ? "lightgreen" : "lightcoral",
            flexWrap: "wrap", // Ensure text wraps properly
          }}
        >
          {person.gender === "MALE" ? (
            <ManOutlinedIcon style={{ color: "blue", marginRight: "8px" }} />
          ) : (
            <Woman2OutlinedIcon style={{ color: "pink", marginRight: "8px" }} />
          )}
          <span style={{ flex: "1", textAlign: "left" }}>
            {label}: {person.fullName}
          </span>
        </div>
      }
      key={person.membershipId}
    >
      {children}
    </TreeNode>
  );

  const parentsNodes = parentsDTO.map((parent) =>
    createNode(
      parent,
      parent.gender === "MALE" ? "Father" : "Mother",
      parent.spouses.map((spouse) => createNode(spouse, "Spouse"))
    )
  );

  const siblingsNodes = siblingsDto.map((sibling) =>
    createNode(sibling, sibling.gender === "MALE" ? "Brother" : "Sister")
  );

  const spouseNodes = spouseDto.map((spouse) => createNode(spouse, "Spouse"));

  const childrenNodes = childrenDto.map((child) =>
    createNode(child, child.gender === "MALE" ? "Son" : "Daughter")
  );

  return (
    <Tree
      lineWidth={"2px"}
      lineColor={"#000"}
      lineBorderRadius={"10px"}
      style={{
        overflowX: "auto", // Ensure horizontal scrolling if needed
        width: "100%", // Ensure full width on mobile
        whiteSpace: "nowrap", // Prevent wrapping to ensure scrolling
      }}
    >
      {createNode({ fullName, membershipCode: "", isAlive, gender }, "Self", [
        ...parentsNodes,
        ...spouseNodes,
        ...siblingsNodes,
        ...childrenNodes,
      ])}
    </Tree>
  );
};

// Main component
const Family_tree = () => {
  const [open, setOpen] = useState(false);
  const [familyTreeData, setFamilyTreeData] = useState(null);
  const [nestedFamilyTreeData, setNestedFamilyTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const rowData = location.state?.membershipCode || {};
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isMobile = useMediaQuery("(max-width:600px)");
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleClick = async (label, fullName, membershipCode) => {
    console.log(`${label}: ${fullName}, Membership Code: ${membershipCode}`);

    // Fetch nested family tree data
    try {
      const headers = {
        "Content-type": "application/json",
        Authorization: `Bearer ${user?.accessToken}`,
      };
      const response = await axios.get(
        `${BASE_URL}/membership/v1/findMembershipAssociationByMembershipCode/${membershipCode}?membershipCode=${membershipCode}`,
        { headers }
      );
      setNestedFamilyTreeData(response.data);
      setCurrentNode({ label, fullName, membershipCode });
    } catch (error) {
      console.error("Error fetching nested family tree data:", error);
      setError("Error fetching nested family tree data");
    }
  };

  useEffect(() => {
    const fetchFamilyTree = async () => {
      if (rowData) {
        try {
          const headers = {
            "Content-type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
          };
          const response = await axios.get(
            `${BASE_URL}/membership/v1/findMembershipAssociationByMembershipCode/${rowData}?membershipCode=${rowData}`,
            { headers }
          );
          setFamilyTreeData(response.data);
        } catch (error) {
          console.error("Error fetching family tree data:", error);
          setError("Error fetching family tree data");
        } finally {
          setLoading(false);
        }
      } else {
        setError("No membership code provided.");
        setLoading(false);
      }
    };

    fetchFamilyTree();
  }, [rowData, user?.accessToken]);

  const goToDashboard = () => {
    navigate("/viewfamily", {
      state: {
        rowData: location.state.previousData.rowData,
        familyTreeData: familyTreeData,
        searchInput: location.state.previousData.searchInput,
        gender: location.state.previousData.gender,
        isMarried: location.state.previousData.isMarried,
        buttons: location.state.previousData.buttons,
      },
    });
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
            "@media (max-width: 1024px)": {
              marginLeft: open ? "150px" : "0",
            },
            "@media (max-width: 768px)": {
              marginLeft: open ? "100px" : "0",
            },
            "@media (max-width: 600px)": {
              marginLeft: open ? "70px" : "0",
              padding: "10px",
            },
            padding: "20px",
          }}
        >
          <div style={{ marginLeft: "70px", marginTop: "80px" }}>
            {/* <IconButton onClick={goToDashboard}>
              <img src={backwardimage} alt="Back to Dashboard" />
            </IconButton> */}
            <br />
            <br />
            <div style={{ margin: "auto", textAlign: "center" }}>
              {loading && <CircularProgress />}
              {error && <Typography color="error">{error}</Typography>}
              {!loading && !error && familyTreeData ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ overflowX: "auto", width: "100%" }}>
                    {transformDataToTree(familyTreeData, handleClick)}
                  </Box>
                  {nestedFamilyTreeData && (
                    <div
                      style={{
                        marginTop: "20px",
                        borderTop: "2px solid #000",
                        paddingTop: "20px",
                        marginLeft: isMobile ? "20px" : "0", // Apply margin-left only on mobile devices
                        overflowX: "auto",
                        width: "100%",
                      }}
                    >
                      <Typography variant="h6">
                        Nested Family Tree of {currentNode.fullName}
                      </Typography>
                      <Box sx={{ overflowX: "auto", width: "100%" }}>
                        {transformDataToTree(nestedFamilyTreeData, handleClick)}
                      </Box>
                    </div>
                  )}
                </div>
              ) : (
                <Typography>No data found</Typography>
              )}
            </div>
          </div>
        </Box>
      </Box>
      {/* <Box
        sx={{
          transition: "margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
          marginLeft: open ? "240px" : "0",
        }}
      >
        <Footer />
      </Box> */}
    </>
  );
};

export default Family_tree;
