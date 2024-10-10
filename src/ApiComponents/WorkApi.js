import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../BaseUrl";

//todo ==> POST Occupation DATA
export const addOccupation = async (data, headers) => {
  try {
    return await axios({
      method: "POST",
      url: `${BASE_URL}/gotra/v1/createOccupation`,
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

//todo ==> GET  Occupation DATA
export const fetchOccupationApi = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BASE_URL}/gotra/v1/getAllOccupationByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10000`,
    headers: headers,
  });
};

//todo ==> GET DATA BY Occupation ID
export const getOccupationById = async (id, headers) => {
    return await axios({
      method: "GET",
      url: `${BASE_URL}/gotra/v1/getOccupationByOccupationId/{occupationId}?occupationId=${id}`,
      headers:headers
    });
  };


   //todo ==> UPDATE Occupation DATA
export const updatedOccupation = async (updatedData, headers) => {
    console.log(updatedData);
   await axios({
    method: "PUT",
    url: `${BASE_URL}/gotra/v1/updateOccupation`,
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


//todo ==> DELETE  Occupation DATA
export const delete_OccupationWork = async (id, headers) => {
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
          url: `${BASE_URL}/gotra/v1/deleteOccupationById/${id}`,
          headers: headers,
        });

        if (res.data.responseCode === 200) {
          Swal.fire('Deleted!', res.data.message, 'success');
          return Promise.resolve(true); // Resolve with success
        } else if (res.data.responseCode === 400) {
          Swal.fire('Error!', res.data.errorMessage, 'error');
          return Promise.reject(new Error(res.data.errorMessage)); // Reject with error
        }
      } catch (err) {
        Swal.fire('Error!', 'Something went wrong.', 'error');
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