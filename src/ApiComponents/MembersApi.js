import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../BaseUrl";

//todo ==> GET  members DATA
export const fetchMembers = async (headers) => {
  return await axios({
    method: "GET",
    url: `${BASE_URL}/member/v1/getAllMembersByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10000`,
    headers: headers,
  });
};
