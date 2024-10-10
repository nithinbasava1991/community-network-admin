import axios from "axios";
import Swal from 'sweetalert2';

export const findMembershipByFullName = async (fullName, headers) => {
  try {
    const response = await axios.get(`https://executivetracking.cloudjiffy.net/Mahaasabha/membership/v1/findMembershipByFullName?fullName=${fullName}`, {
      headers: headers
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Could not fetch membership data.',
    });
    throw error;
  }
};
