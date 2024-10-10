import axios from "axios";
import Swal from 'sweetalert2'
import { BASE_URL } from "../BaseUrl";


//todo ==> GET  request DATA
export const fetchRequestMain = async ( headers) => {
  
    return await axios({
      method: "GET",
      url: `${BASE_URL}/request/v1/getAllRequestByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10000`,
      headers:headers
     
    });
  };