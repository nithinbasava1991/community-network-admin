import axios from "axios";
import Swal from 'sweetalert2'
import { BASE_URL } from "../BaseUrl";


//todo ==> GET  Bulkupload DATA
export const fetchBulkUpload = async ( headers) => {
  
    return await axios({
      method: "GET",
      url: `https://executivetracking.cloudjiffy.net/Mahaasabha/membership/v1/getAllMembershipByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10000`,
      headers:headers
     
    });
  };