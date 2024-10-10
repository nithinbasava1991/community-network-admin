import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { BASE_URL } from "../BaseUrl";
import axios from "axios";

const Responsivecarousel = ({ isDrawerOpen }) => {
  const [advertisementData, setAdvertisementData] = useState([]);

  // Apply styles based on the 'isDrawerOpen' prop
  const carouselStyles = {
    width: isDrawerOpen ? "80%" : "100%", // Adjust the width as needed
    transition: "width 0.3s ease-in-out",
  };

  //! Tokens and Headers
  const user = JSON.parse(sessionStorage.getItem("user"));

  const headers = {
    "Content-type": "application/json",
    Authorization: "Bearer " + user.accessToken,
  };

  useEffect(() => {
    const fetchAdvertisementData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/advertisement/v1/getAllAdvertisementByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
          {
            headers: headers, // Include headers in the request
          }
        );
        console.log(response.data.content);
        setAdvertisementData(response.data.content); // Assuming the API response is an array of advertisement objects
      } catch (error) {
        console.error("Error fetching advertisement data:", error);
      }
    };

    fetchAdvertisementData();
  }, []);

  return (
    <>
      <div>
        <div style={carouselStyles}>
          <Carousel
            showThumbs={false}
            infiniteLoop
            autoPlay
            interval={3000}
            transitionTime={500}
          >
            {advertisementData.map((advertisement) => (
              <div key={advertisement.id}>
                <img
                  src={`${BASE_URL}/file/downloadFile/?filePath=${encodeURIComponent(
                    advertisement.filePath
                  )}`}
                  alt={advertisement.name}
                  height={300}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default Responsivecarousel;
