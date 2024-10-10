import { Box, Container, CssBaseline, Grid } from "@mui/material";
import React, { useState } from "react";
import AppBarComponent from "../../Components/AppBarComponent";
import DrawerComponent from "../../Components/DrawerComponent";
import Footer from "../../Components/Footer";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import YouTubeIcon from '@mui/icons-material/YouTube';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import NewspaperIcon from '@mui/icons-material/Newspaper';

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

const Advertisement = () => {

  //!Appbar and Drawer
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

  return (
    <>
    <div style={{backgroundColor:"white"}}>
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
          <div
            role="presentation"
            onClick={handleClick}
            style={{ marginLeft: "70px", marginTop: "80px" }}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb
                component="a"
                href="#"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />

              <StyledBreadcrumb
                label="Advertisement"
                deleteIcon={<ExpandMoreIcon />}
                onDelete={handleClick}
              />
            </Breadcrumbs>
          </div>

          <div style={{ marginLeft: "50px", padding: "20px",backgroundColor:"white" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Link
                  to="/advertisement/promo"
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    sx={{
                      width: "100%",
                      height: "120px",
                      border: "0.5px solid lightGray",
                      mt: 5,
                      "&:hover": { backgroundColor: "whiteSmoke" },
                    }}
                  >
                    <CardActions
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                      }}
                    >
                      <YouTubeIcon sx={{ fontSize: 40 }} />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        123
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Promo
                      </Typography>
                    </CardActions>
                  </Card>
                </Link>
              </Grid>

              <Grid item xs={12} sm={3}>
              <Link to="/advertisement/banner"
                  style={{ textDecoration: "none" }}>
                <Card
                  sx={{
                    width: "100%",
                    height: "120px",
                    border: "0.5px solid lightGray",
                    mt: 5,
                    "&:hover": { backgroundColor: "whiteSmoke" },
                  }}
                >
                  <CardActions
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <AdsClickIcon sx={{ fontSize: 40 }} />
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      123
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Banner
                    </Typography>
                  </CardActions>
                </Card>
                </Link>
              </Grid>

              <Grid item xs={12} sm={3}>
              <Link to="/advertisement/success" style={{ textDecoration: "none" }}>
                <Card
                  sx={{
                    width: "100%",
                    height: "120px",
                    border: "0.5px solid lightGray",
                    mt: 5,
                    "&:hover": { backgroundColor: "whiteSmoke" },
                  }}
                >
                  <CardActions
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <AutoStoriesIcon sx={{ fontSize: 40 }} />
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      123
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                    success story
                    </Typography>
                  </CardActions>
                </Card>
                </Link>
              </Grid>

              <Grid item xs={12} sm={3}>
              <Link to="/advertisement/event" style={{ textDecoration: "none" }}>
                <Card
                  sx={{
                    width: "100%",
                    height: "120px",
                    border: "0.5px solid lightGray",
                    mt: 5,
                    "&:hover": { backgroundColor: "whiteSmoke" },
                  }}
                >
                  <CardActions
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <AccountBalanceIcon sx={{ fontSize: 40 }} />
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      123
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Event
                    </Typography>
                  </CardActions>
                </Card>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3}>
              <Link to="/advertisement/news" style={{ textDecoration: "none" }}>
                <Card
                  sx={{
                    width: "100%",
                    height: "120px",
                    border: "0.5px solid lightGray",
                    mt: 5,
                    "&:hover": { backgroundColor: "whiteSmoke" },
                  }}
                >
                  <CardActions
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <NewspaperIcon sx={{ fontSize: 40 }} />
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      123
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      News
                    </Typography>
                  </CardActions>
                </Card>
                </Link>
              </Grid>
            </Grid>
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

export default Advertisement;
