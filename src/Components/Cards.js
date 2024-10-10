import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";

export default function Cards({ backgroundColor, name, image }) {
  return (
    <Card
      sx={{
        backgroundColor,
        minWidth: 50,
        maxHeight: 150,
        boxShadow: "10px 10px 5px 0px rgba(0,0,0,0.75)",
      }}
    >
      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side - Image */}
        <Box>
          <img
            src={image}
            alt={name}
            style={{ width: "90%", height: "90%",  }}
          />
        </Box>
        {/* Right side - Name */}
        <Box sx={{ marginLeft: "auto",marginTop:"20px" }}>
          <Typography variant="h6" component="div">
           123
          </Typography>
          <Typography variant="h6" component="div">
            {name}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
