import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import userService from "./userService";
import { Button } from "@material-ui/core";
const _logger = debug.extend("users");
import debug from "sabio-debug";

const UserTable = (props) => {
  const [user, setUser] = useState(props.user);

  const onStatusClick = (e) => {
    e.preventDefault();

    let userId = props.user.id;
    let prevStatus = props.user.statusType.name;

    let currentStatus = prevStatus === "Active" ? 2 : 1;
    let currentStatusName = currentStatus === 1 ? "Active" : "Inactive";

    // Active = 1, Inactive = 2
    // _logger(currentStatus, "status");

    userService
      .updateUser(userId, currentStatus)
      .then(onUpdatesucess)
      .catch(onUpdateError);

    const newStatus = { id: currentStatus, name: currentStatusName };
    setUser({ ...user, statusType: newStatus });
  };

  let onUpdatesucess = (response) => {
    _logger("updateStatus call was made", response);
    props.handleRefresh(props);
  };

  let onUpdateError = (error) => {
    _logger(error);
  };

  const getUserRole = (props) => {
    let role = props.user.roles;

    let newRoleArr = [];

    if (role && role.length > 0) {
      role.map((arr) => {
        newRoleArr.push(arr);
      });
    } else {
      return "-";
    }

    return newRoleArr.join(", ");
  };

  return (
    <Fragment>
      <tr>
        <th scope="row">{user.id}</th>
        <td>{user.email}</td>
        <td>{getUserRole(props)}</td>
        <td>
          <Button
            variant="contained"
            color={user.statusType.name === "Active" ? "primary" : "secondary"}
            size="medium"
            onClick={onStatusClick}
          >
            {user.statusType.name}
          </Button>
        </td>
      </tr>
    </Fragment>
  );
};

UserTable.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    statusType: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
  target: PropTypes.shape({
    accessKey: PropTypes.number.isRequired,
  }),
  handleRefresh: PropTypes.func.isRequired,
};

export default UserTable;