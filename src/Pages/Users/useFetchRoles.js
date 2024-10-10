import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../BaseUrl";

const useFetchRoles = (headers) => {
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);

  // Fetch roles from API
  const fetchRoles = async () => {
    try {
      const response = await axios.get(
       ` ${BASE_URL}/role/v1/getAllRoles`,
        { headers: headers }
      );
      setRoles(response.data); // Assuming response.data contains the list of roles
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []); // Empty dependency array to run only once when the component mounts

  return { roles, error };
};

export default useFetchRoles;
