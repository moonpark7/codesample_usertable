import axios from "axios";
import { API_HOST_PREFIX } from "./serviceHelpers";

const endpoint = `${API_HOST_PREFIX}/api/users`;


export let getUsers = (pageIndex,pageSize) => {
  const config = {
    method: "Get",
    url: `${endpoint}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config);
};

export let getUsersByRole = (roleId, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint}/role/${roleId}/paginate/?pageIndex=${pageIndex}&pageSize=${pageSize}&roleId=${roleId}`,
    withCredentials: true,
    crossdomain: true,
    headers: {"Content-Type": "application/json"}
  };
  
  return axios(config);
};

export let updateUser = (id,status) => {
    const config = {
      method: "Put",
      url: `${endpoint}/${id}/status/${status}`,
      withCredentials: true,
      crossdomain: true,
      headers: { "Content-Type": "application/json" },
    };
  
    return axios(config);
  };


export default { getUsers, updateUser, getUsersByRole};
