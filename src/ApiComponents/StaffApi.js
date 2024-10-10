import axios from "axios";
import Swal from 'sweetalert2'
import { BASE_URL } from "../BaseUrl";


//todo ==> GET  Staff DATA
export const fetchStaff = async ( headers) => {
  
    return await axios({
      method: "GET",
      url: `${BASE_URL}/userprofile/v1/getAllUserProfileByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10000`,
      headers:headers
     
    });
  };


  //todo ==> UPDATE Staff DATA
 
