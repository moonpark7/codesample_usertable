import React, { useState, useEffect, Fragment } from "react";
import userService from "./userService";
import { get } from "../../services/lookUpService";
import UserTable from "./UserTable";
import Pagination from "rc-pagination";
import { onGlobalError } from "../../services/serviceHelpers";
import "rc-pagination/assets/index.css";
import debug from "sabio-debug";
import {
  TextField,
  InputAdornment,
  Card,
  Divider,
  Grid,
  MenuItem,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const _logger = debug.extend("users");

export default function Users() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const [activePage, setActivePage] = useState(1);
  const [users, setUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [filteredData, setFilteredData] = useState(users);
  const [userRoleId, setUserRoleId] = useState("");
  const [roleTypeData, setRoleTypeData] = useState([]);

  useEffect(() => {
    userService
      .getUsers(pagination.pageIndex, pagination.pageSize)
      .then(onGetUserSuccess)
      .catch(onGetUsersError);
  }, []);

  useEffect(() => {
    if (userRoleId && userRoleId > 0) {
      userService
        .getUsersByRole(userRoleId, pagination.pageIndex, pagination.pageSize)
        .then(onGetUserSuccess)
        .catch(onGetUsersError);
    }
    //_logger(userRoleId, "test id");
  }, [userRoleId]);

  useEffect(() => {
    let lookup = {
      Types: ["RoleTypes"],
    };
    get(lookup).then(onGetRolesSuccess).catch(onGlobalError);
  }, []);

  let onGetRolesSuccess = (response) => {
    //_logger(response, "GET ALL ROLES");

    let roleTypes = response.item.roleTypes;
    setRoleTypeData(roleTypes);
  };

  let onGetUserSuccess = (response) => {
    let userItems = [];
    let totalCount = 0;

    userItems = response.data.item.pagedItems;
    totalCount = response.data.item.totalCount;

    setFilteredData(userItems);
    setUsers(userItems);
    setPagination({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
    });
    //_logger(userItems);
    //_logger(totalCount);
  };

  let onGetUsersError = (error) => {
    _logger(error);
  };

  let onPageChange = (pageNumber) => {
    if (userRoleId > 0 && userRoleId !== null) {
      userService
        .getUsersByRole(userRoleId, pageNumber - 1, pagination.pageSize)
        .then(onGetUserSuccess)
        .catch(onGetUsersError);
    } else {
      userService
        .getUsers(pageNumber - 1, pagination.pageSize)
        .then(onGetUserSuccess)
        .catch(onGetUsersError);
    }

    setActivePage(pageNumber);
  };

  let mapUser = (user) => (
    <UserTable user={user} key={user.id} handleRefresh={handleRefresh} />
  );

  let mapRoles = (role) => (
    <MenuItem key={`${role.name}_${role.id}`} value={role.id}>
      {role.name}
    </MenuItem>
  );

  let handleRefresh = (props) => {
    _logger(props);
    if (userRoleId && userRoleId > 0) {
      userService
        .getUsersByRole(userRoleId, activePage - 1, pagination.pageSize)
        .then(onGetUserSuccess)
        .catch(onGetUsersError);
    } else {
      userService
        .getUsers(activePage - 1, pagination.pageSize)
        .then(onGetUserSuccess)
        .catch(onGetUsersError);
    }
  };

  const handleChange = (e) => {
    let value = e.target.value.toLowerCase();
    let result = [];
    _logger(e.target.value);
    result = users.filter((data) => {
      return data.email.search(value) !== -1;
    });
    setFilteredData(result);
    setInputValue(e.target.value);
  };

  const selectorChange = (e) => {
    // _logger(e.target.value);
    let roleId = e.target.value;

    setUserRoleId(roleId);
  };

  return (
    <Fragment>
      <div className="d-flex align-items-center ml-2 mr-2">
        <div className="mr-auto p-3">
          <h3 className="pl-5 text-black">Users</h3>
        </div>
        <Grid className="p-2 pt-3" item xs={6} md={4} lg={3}>
          <TextField
            select
            fullWidth
            className="p-1 bg-white"
            label="Role Type"
            value={userRoleId}
            onChange={selectorChange}
            variant="outlined"
            size="small"
          >
            {roleTypeData.map(mapRoles)}
          </TextField>
        </Grid>

        <Grid className="p-2 pt-3" item xs={6} md={4} lg={3}>
          <TextField
            className="app-search-input p-3"
            fullWidth
            size="small"
            value={inputValue}
            onChange={handleChange}
            inputProps={{ "aria-label": "search" }}
            placeholder="Search Emails…"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="app-search-icon" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </div>
      <Divider />
      <Card className="card-box text-center">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>{filteredData.map(mapUser)}</tbody>
        </table>
      </Card>

      <Divider />
      <Pagination
        total={pagination.totalCount}
        pageSize={pagination.pageSize}
        current={activePage}
        onChange={onPageChange}
        className="px-5 py-4"
      />
    </Fragment>
  );
}
