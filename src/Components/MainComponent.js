// MainComponent.js
import React, { useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppBarComponent from "./AppBarComponent";
import DrawerComponent from "./DrawerComponent";
import Footer from "./Footer";
import Grid from "@mui/material/Grid";
import Responsivecarousel from "./Responsivecarousel";
import Cards from "./Cards";
import promo from "../images/megaphone.png";
import banner from "../images/advertising.png";
import event from "../images/event.png";
import news from "../images/newspaper.png";
import story from "../images/success.png";
import male from "../images/male.png";
import female from "../images/female.png";
import members from "../images/diversity.png";

const MainComponent = () => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
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

  // Array of objects containing names and image URLs
  const data = [
    { name: "Promo", image: promo },
    { name: "Banner", image: banner },
    { name: "Event", image: event },
    { name: "News", image: news },
    { name: "Success Story", image: story },
    { name: "Male", image: male },
    { name: "Female", image: female },
    { name: "MemberShip", image: members },
  ];

  return (
    <>
      <div style={{ backgroundColor: "white" }}>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <CssBaseline />
          <AppBarComponent open={open} handleDrawerOpen={handleDrawerOpen} />
          <DrawerComponent open={open} handleDrawerClose={handleDrawerClose} />

          {/* Content container */}
          <Box
            sx={{
              flexGrow: 1,
              transition: "margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
              marginLeft: open ? "185px" : "0",
              "@media (max-width: 600px)": {
                marginLeft: open ? "120px" : "0",
              },
            }}
          >
            {/* Your main content goes here */}
            <br />
            <br />
            <br />
            <div style={{ marginLeft: "65px",padding: "30px" }}>
              <Responsivecarousel />
            </div>

            <br />
            <br />
            <div
              style={{
                marginLeft: "69px",
                marginRight: "10px",
                marginBottom: "20px", // Add margin at the bottom for gap
                "@media (max-width: 600px)": {
                  marginLeft: "10px", // Adjust for smaller screens
                },
                "@media (min-width: 601px) and (max-width: 960px)": {
                  marginLeft: "40px", // Adjust for medium screens
                },
                "@media (min-width: 961px) and (max-width: 1280px)": {
                  marginLeft: "60px", // Adjust for larger screens
                },
              }}
            >
              <Grid container spacing={3}>
                {data.map((item, index) => (
                  <Grid item xs={12} sm={3} key={index}>
                    <Cards name={item.name} image={item.image} />
                  </Grid>
                ))}
              </Grid>
            </div>
          </Box>

          <br />
          <br />

          {/* Footer component */}
          <Box
            sx={{
              transition: "margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
              ...commonMarginStyle,
              marginTop: "auto", // Push footer to the bottom
              // marginBottom: "20px", // Add margin at the bottom for gap
            }}
          >
            <Footer />
          </Box>
        </Box>
      </div>
    </>
  );
};

export default MainComponent;
