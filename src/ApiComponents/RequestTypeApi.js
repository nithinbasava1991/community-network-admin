import axios from "axios";
import Swal from 'sweetalert2'
import { BASE_URL } from "../BaseUrl";

//todo ==> POST Request Type DATA
export const addRequestType = async (data, headers) => {
    try {
      return await axios({
        method: "POST",
        url: `${BASE_URL}/requesttype/v1/createRequestType`,
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

  //todo ==> GET  Request Type DATA
export const fetchRequestType = async ( headers) => {
  
    return await axios({
      method: "GET",
      url: `${BASE_URL}/requesttype/v1/getAllRequestTypeByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10000`,
      headers:headers
     
    });
  };

  //todo ==> GET DATA BY RequestType  ID
export const getRequestTypeId = async (id, headers) => {
    return await axios({
      method: "GET",
      url: `${BASE_URL}/requesttype/v1/getRequestTypeByRequestTypeId/{requesttypeId}?requesttypeId=${id}`,
      headers:headers
    });
  };

  //todo ==> UPDATE RequestType DATA
export const updatedRequestType = async (updatedData, headers) => {
    console.log(updatedData);
   await axios({
    method: "PUT",
    url: `${BASE_URL}/requesttype/v1/updateRequestType`,
    headers:headers,
    data:JSON.stringify(updatedData),
  })
    .then(function (res) {
        console.log(res);
      if (res.data.responseCode === 201) {
        Swal.fire(res.data.message);
      } else if (res.data.responseCode === 400) {
        Swal.fire(res.data.errorMessage);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

//todo ==> DELETE  Request Type DATA
export const deleteRequestType = async (id, headers) => {
  return Swal.fire({
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
      try {
        const res = await axios({
          method: 'DELETE',
          url: `${BASE_URL}/requesttype/v1/deleteRequestTypeById/${id}`,
          headers,
        });

        if (res.data.responseCode === 200) {
          Swal.fire('Deleted!', res.data.message, 'success');
          return Promise.resolve(true); // Resolve with success
        } else if (res.data.responseCode === 400) {
          Swal.fire('Error', res.data.errorMessage, 'error');
          return Promise.reject(new Error(res.data.errorMessage)); // Reject with error
        }
      } catch (err) {
        Swal.fire('Error', 'Something went wrong while deleting the request type.', 'error');
        console.error(err);
        return Promise.reject(err); // Reject with error
      }
    } else {
      // Handle cancel action
      console.log('Delete action canceled');
      return Promise.resolve(false); // Resolve with cancellation
    }
  });
};