import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tree, TreeNode } from "react-organizational-chart";
import styled from "styled-components";
import backwardimage from "../../images/left-arrow.png";
import { IconButton, Box, CssBaseline } from "@mui/material";
import AppBarComponent from "../../Components/AppBarComponent";
import DrawerComponent from "../../Components/DrawerComponent";
import Footer from "../../Components/Footer";
import axios from "axios";
import ManOutlinedIcon from '@mui/icons-material/ManOutlined';
import Woman2OutlinedIcon from '@mui/icons-material/Woman2Outlined';
import { BASE_URL } from "../../BaseUrl";

// Styled icons with colors
const StyledManIcon = styled(ManOutlinedIcon)`
  color: blue;
`;

const StyledWomanIcon = styled(Woman2OutlinedIcon)`
  color: pink;
`;

// Styled node with dynamic background color
const StyledNode = styled.div`
  padding: 10px;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid #ccc;
  margin-top: 10px;
  width: fit-content;
  background-color: ${props => props.backgroundColor || '#f9f9f9'};

  @media only screen and (max-width: 768px) {
    font-size: 14px;
  }
`;

const SpouseNode = styled(StyledNode)`
  margin-left: 20px;
`;

const FatherFamilyTree = () => {
  const [open, setOpen] = useState(false);
  const [familyTreeData, setFamilyTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { membershipCode } = location.state || {}; // Access membershipCode from location.state
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);


  useEffect(() => {
    const fetchFamilyTree = async () => {
      if (membershipCode) {
        try {
          const headers = {
            "Content-type": "application/json",
            Authorization: "Bearer " + user?.accessToken,
          };
          const response = await axios.get(
            `${BASE_URL}/membership/v1/findFatherRootFamilyTreeByMembershipCode/${membershipCode}`,
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
  }, [membershipCode, user?.accessToken]);

  const goToDashboard = () => {
    navigate("/viewfamily", {
      state: {
        rowData: { membershipCode },
        familyTreeData,
        searchInput: "", // Update if necessary
        gender: familyTreeData && familyTreeData[0] && familyTreeData[0].gender === "MALE" ? "MALE" : "FEMALE",
        isMarried: familyTreeData ? familyTreeData[0].isMarried : false,
      },
    });
  };

  const renderFamilyTree = (data) => {
    if (!data) return null;

    const renderedNodes = new Set();

    const renderTreeNodes = (node) => {
      if (!node || renderedNodes.has(node.fullName)) return null;
      renderedNodes.add(node.fullName);

      // Determine the icon based on gender
      const genderIcon = node.gender === "MALE" ? <StyledManIcon /> : <StyledWomanIcon />;

      // Determine the background color based on isAlive
      const backgroundColor = node.isAlive ? 'lightgreen' : 'lightcoral';

      const spouseNodes = (node.spouseMemberships || []).map((spouse) => (
        <TreeNode
          key={spouse.membershipId}
          label={
            <SpouseNode backgroundColor={backgroundColor}>
              {genderIcon}
              {spouse.fullName}
              {spouse.relationships?.length > 0 &&
                ` - ${spouse.relationships[0].relationshipName}`}
            </SpouseNode>
          }
        />
      ));

      const childNodes = (node.childrenMemberships || []).map((child) =>
        renderTreeNodes(child)
      );

      return (
        <TreeNode
          key={node.membershipId}
          label={
            <StyledNode backgroundColor={backgroundColor}>
              {genderIcon}
              {node.fullName}
              {node.relationships?.length > 0 &&
                ` - ${node.relationships[0].relationshipName}`}
            </StyledNode>
          }
        >
          {spouseNodes}
          {childNodes}
        </TreeNode>
      );
    };

    return (
      <Tree lineWidth={"2px"} lineColor={"green"} lineBorderRadius={"10px"}>
        {renderTreeNodes(data)}
      </Tree>
    );
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "70px",
              marginTop: "90px",
            }}
          >
            {/* <IconButton onClick={goToDashboard}>
              <img src={backwardimage} alt="Back to Dashboard" />
            </IconButton> */}
            <br />
            <br />
            <div style={{ margin: "auto", textAlign: "center" }}>
              {loading && <p>Loading family tree...</p>}
              {error && <p>{error}</p>}
              {!loading && !error && familyTreeData && familyTreeData.length > 0 ? (
                renderFamilyTree(familyTreeData[0])
              ) : (
                <p>No data found</p>
              )}
            </div>
          </div>
        </Box>
      </Box>
      {/* <Box
        sx={{
          transition: "margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
          marginLeft: open ? "200px" : "0",
          "@media (max-width: 600px)": {
            marginLeft: open ? "120px" : "0",
          },
        }}
      >
        <Footer />
      </Box> */}
    </>
  );
};

export default FatherFamilyTree;
