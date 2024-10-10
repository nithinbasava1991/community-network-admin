import axios from "axios";
import Swal from 'sweetalert2'
import { BASE_URL } from "../BaseUrl";


//todo ==> POST CreateMembership DATA
export const CreateMembership = async (data, headers) => {
    try {
      return await axios({
        method: "POST",
        url: `${BASE_URL}/membership/v1/createMembership`,
        headers,
        data: data,
      }).then(function (res) {
        console.log(res);
        if (res.data.responseCode === 201) {
          Swal.fire(res.data.message);
        } else if (res.data.responseCode === 400) {
          Swal.fire(res.data.errorMessage);
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  //todo ==> GET  Bulkupload DATA
export const fetchBulkUpload = async ( headers) => {
  
  return await axios({
    method: "GET",
    url: `${BASE_URL}/membership/v1/getAllMembershipByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10000`,
    headers:headers
   
  });
};