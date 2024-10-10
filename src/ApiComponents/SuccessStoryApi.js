import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../BaseUrl";

//todo ==> POST SuccessStory DATA
export const addSuccessStory = async (data, headers) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/success/v1/createSuccessStory`,
      headers,
      data: data,
    });

    console.log(response);

    if (response.data.responseCode === 201) {
      Swal.fire(response.data.message);
    } else if (response.data.responseCode === 400) {
      Swal.fire(response.data.errorMessage);
    }
  } catch (error) {
    console.error("Error creating new success story:", error);
    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: error.message,
    });
  }
};



//todo ==> GET  SuccessStory DATA
export const fetchSuccessStory = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BASE_URL}/success/v1/getAllSuccessStoryByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10000`,
    headers: headers,
  });
};

//todo ==> GET DATA BY SucessStory ID
export const getSuccessStoryId = async (id, headers) => {
  return await axios({
    method: "GET",
    url: `${BASE_URL}/success/v1/getSuccessStoryById/{successstoryId}?successstoryId=${id}`,
    headers: headers,
  });
};

//todo ==> UPDATE SuccessStory DATA
export const updatedSuccessStory = async (updatedData, headers) => {
  console.log(updatedData);
  await axios({
    method: "PUT",
    url: `${BASE_URL}/success/v1/updateSuccessStory`,
    headers: headers,
    data: JSON.stringify(updatedData),
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

//todo ==> DELETE  SuccessStory DATA
export const deleteSuccessStory = async (id, headers) => {
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
          url: `${BASE_URL}/success/v1/deleteSuccessStoryById/${id}`,
          headers: headers,
        });

        if (res.data.responseCode === 200) {
          Swal.fire('Deleted!', res.data.message, 'success');
          return Promise.resolve(true); // Resolve with success
        } else if (res.data.responseCode === 400) {
          Swal.fire('Error', res.data.errorMessage, 'error');
          return Promise.reject(new Error(res.data.errorMessage)); // Reject with error
        }
      } catch (err) {
        Swal.fire('Error', 'Something went wrong while deleting the success story.', 'error');
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
