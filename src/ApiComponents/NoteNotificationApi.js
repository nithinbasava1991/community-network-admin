import axios from "axios";
import Swal from 'sweetalert2'
import { BASE_URL } from "../BaseUrl";


//todo ==> POST BulkNotification DATA
export const addBlukNotification = async (data, headers) => {
    try {
      return await axios({
        method: "POST",
        url: `${BASE_URL}/bulknotification/v1/createBulkNotification`,
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

  //todo ==> GET  BulkNotification DATA
export const fetchBulkNotification = async ( headers) => {
  
    return await axios({
      method: "GET",
      url: `${BASE_URL}/bulknotification/v1/getAllBulkNotificationByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10000`,
      headers:headers
     
    });
  };

  //todo ==> DELETE  BulkNotification DATA
  export const deleteBulkNotification = async (id, headers) => {
    // Show confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Proceed with deletion if confirmed
        try {
          const res = await axios({
            method: "delete",
            url: `${BASE_URL}/bulknotification/v1/deleteBulkNotificationById/${id}`,
            headers,
          });
  
          if (res.data.responseCode === 200) {
            Swal.fire('Deleted!', res.data.message, 'success');
          } else if (res.data.responseCode === 400) {
            Swal.fire('Error', res.data.errorMessage, 'error');
          }
        } catch (err) {
          Swal.fire('Error', 'Something went wrong while deleting the bulk notification.', 'error');
          console.log(err);
        }
      } else {
        // Log or handle cancellation
        console.log('Delete action was cancelled');
      }
    });
  };