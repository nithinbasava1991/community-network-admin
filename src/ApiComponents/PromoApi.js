import axios from "axios";
import Swal from 'sweetalert2'
import { BASE_URL } from "../BaseUrl";

//todo ==> POST PROMO DATA
export const postPromoData =async(pdata, headers) => {
  try {
    await axios({
      method: "POST",
      url: `${BASE_URL}/promo/v1/createPromo`,
      headers: headers,
      data: JSON.stringify(pdata),
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        Swal.fire("Promo Successfully Created");
      } else {
        alert(res);
      }
    });
  } catch (error) {
    alert(error);
  }
};


//todo ==> GET  PROMO DATA
// API call for fetching promo data with dynamic pageNumber and pageSize
export const fetchPromo = async (headers, pageNumber, pageSize) => {
  return await axios({
    method: "GET",
    url: `${BASE_URL}/promo/v1/getAllPromoByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10000`,
    headers: headers,
  });
};


//todo ==> GET DATA BY PROMO ID

export const getPromoById=async(headers,id)=>{
   return await axios({
    method:"GET",
    url:`${BASE_URL}/promo/v1/getPromoByPromoId/{promoId}?promoId=${id}`,
    headers:headers,
  })
}


 // todo==> UPDATE PROMO
 export const updatedPromo=async(headers,dataToSend)=>{
   await axios({
    method:"PUT",
    url:`${BASE_URL}/promo/v1/updatePromo`,
    headers:headers,
    data:dataToSend
  }).then(function (res) {
    console.log(res);
    if (res.data.responseCode === 201) {
      Swal.fire("Promo Successfully Updated");
    } else {
      alert(res);
    }
})
.catch(function (error) {
  console.log(error);
});
 }

//todo ==> DELETE  PROMO DATA
export const deletePromo = async (headers, id) => {
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
          url: `${BASE_URL}/promo/v1/deletePromoById/${id}`,
          headers: headers,
        });

        if (res.data.responseCode === 200) {
          Swal.fire('Deleted!', res.data.message, 'success');
          return Promise.resolve(true);  // Resolve with success
        } else if (res.data.responseCode === 400) {
          Swal.fire('Error', res.data.errorMessage, 'error');
          return Promise.reject(new Error(res.data.errorMessage));  // Reject with an error
        }
      } catch (err) {
        Swal.fire('Error', 'Something went wrong while deleting the promo.', 'error');
        console.error(err);
        return Promise.reject(err);  // Reject with an error
      }
    } else {
      console.log('Delete action canceled');
      return Promise.resolve(false);  // Resolve with cancellation
    }
  });
};