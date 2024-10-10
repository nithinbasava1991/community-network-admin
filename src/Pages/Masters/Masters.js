import { Box, CssBaseline, Grid } from "@mui/material";
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
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import ContactsIcon from "@mui/icons-material/Contacts";
import EventIcon from "@mui/icons-material/Event";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import FeaturedVideoIcon from "@mui/icons-material/FeaturedVideo";
import RequestPageIcon from "@mui/icons-material/RequestPage";

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

const Masters = () => {
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
                label="Masters"
                deleteIcon={<ExpandMoreIcon />}
                onDelete={handleClick}
              />
            </Breadcrumbs>
          </div>

          <div style={{ marginLeft: "50px", padding: "20px",backgroundColor:"white"}}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Link
                  to="/masters/qualification"
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
                      <SchoolIcon sx={{ fontSize: 40 }} />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        123
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Qualification
                      </Typography>
                    </CardActions>
                  </Card>
                </Link>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Link to="/masters/work" style={{ textDecoration: "none" }}>
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
                      <WorkIcon sx={{ fontSize: 40 }} />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        123
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Occupation
                      </Typography>
                    </CardActions>
                  </Card>
                </Link>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Link
                  to="/masters/relationship"
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
                      <ContactsIcon sx={{ fontSize: 40 }} />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        123
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        RelationShip Constant
                      </Typography>
                    </CardActions>
                  </Card>
                </Link>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Link to="/masters/gotra" style={{ textDecoration: "none" }}>
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
                      <AcUnitIcon sx={{ fontSize: 40 }} />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        123
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Gotra
                      </Typography>
                    </CardActions>
                  </Card>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Link
                  to="/masters/eventtype"
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
                      <EventIcon sx={{ fontSize: 40 }} />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        123
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        EventType
                      </Typography>
                    </CardActions>
                  </Card>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Link to="/masters/newstype" style={{ textDecoration: "none" }}>
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
                        News Type
                      </Typography>
                    </CardActions>
                  </Card>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Link
                  to="/masters/promotype"
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
                      <FeaturedVideoIcon sx={{ fontSize: 40 }} />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        123
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Promo Type
                      </Typography>
                    </CardActions>
                  </Card>
                </Link>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Link
                  to="/masters/requesttype"
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
                      <RequestPageIcon sx={{ fontSize: 40 }} />
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        123
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Request Type
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

export default Masters;
