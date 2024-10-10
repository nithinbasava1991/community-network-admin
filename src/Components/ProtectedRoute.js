// ProtectedRoute component
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        let token = sessionStorage.getItem("user");
        if (!token) {
          // Redirect to the login page if token is not found
          navigate("/");
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking token:", error);
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, [navigate]);

  return isAuthenticated === null ? null : isAuthenticated ? <Component /> : null;
};

export default ProtectedRoute;
