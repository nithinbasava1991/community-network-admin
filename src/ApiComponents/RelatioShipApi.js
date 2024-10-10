import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../BaseUrl";

//todo ==> POST RelationShipConstant  DATA
export const addRelation = async (data, headers) => {
  try {
    return await axios({
      method: "POST",
      url: `${BASE_URL}/relationshipconstant/v1/createRelationshipConstant`,
      headers,
      data:data,
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

//todo ==> GET  RelationShipConstant DATA
export const fetchRelationShipApi = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BASE_URL}/relationshipconstant/v1/getAllRelationshipConstantByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10000`,
    headers: headers,
  });
};

//todo ==> GET DATA BY  RelationShipConstant  ID
export const getRelationById = async (id, headers) => {
    return await axios({
      method: "GET",
      url: `${BASE_URL}/relationshipconstant/v1/getRelationshipConstantByRelationshipConstantId/{relationshipConstantId}?relationshipConstantId=${id}`,
      headers:headers
    });
  };


   //todo ==> UPDATE RelationShipConstant DATA
export const updatedRelationShip = async (updatedData, headers) => {
    console.log(updatedData);
   await axios({
    method: "PUT",
    url: `${BASE_URL}/relationshipconstant/v1/updateRelationshipConstant`,
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


//todo ==> DELETE  RelationShipConstant DATA
export const deleteRelationShip = async (id, headers) => {
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
          url: `${BASE_URL}/relationshipconstant/v1/deleteRelationshipConstantById/${id}`,
          headers,
        });

        if (res.data.responseCode === 200) {
          Swal.fire('Deleted!', res.data.message, 'success');
        } else if (res.data.responseCode === 400) {
          Swal.fire('Error', res.data.errorMessage, 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Something went wrong while deleting the relationship.', 'error');
        console.log(err);
      }
    } else {
      // Handle cancellation if needed
      console.log('Delete action was cancelled');
    }
  });
};