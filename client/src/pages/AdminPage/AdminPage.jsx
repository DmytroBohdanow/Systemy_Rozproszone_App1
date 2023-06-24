import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/authProvider";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Modal from "react-bootstrap/Modal";
import { DisplayNewAdminForm } from "./AdminForm";
import { DisplayNewUserForm } from "./UserForm";

const AdminPage = () => {
  const { user } = useAuth();
  const [usersData, setUsersData] = useState([]);
  const [adminsData, setAdminsData] = useState([]);
  const [currentAdminData, setCurrentAdminData] = useState(null);
  const [radioValue, setRadioValue] = useState("");
  const [newAdminId, setNewAdminId] = useState("");
  const [newUserId, setNewUserId] = useState("");
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newUserUsername, setNewUserUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserPESEL, setNewUserPESEL] = useState("");
  const [newAdminError, setNewAdminError] = useState("");
  const [newUserError, setNewUserError] = useState("");
  const [newUserResponse, setNewUserResponse] = useState("");
  const [newAdminResponse, setNewAdminResponse] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState("");
  const [userDeleteError, setUserDeleteError] = useState("");
  const [afterDeleteMsg, setAfterDeleteMsg] = useState("");
  const radios = [
    { name: "Admin list", value: "1" },
    { name: "User list", value: "2" },
    { name: "Create new admin", value: "3" },
    { name: "Create new user", value: "4" },
  ];

  const fetchUsers = async () => {
    await axios
      .get("/api/users/all", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setUsersData(response.data.users);
      });
  };

  const fetchAdmins = async () => {
    await axios
      .get("/api/admins/all", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setAdminsData(response.data.admins);
      });
  };

  const fetchCurrentAdminData = async () => {
    await axios
      .post("/api/admins", user, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setCurrentAdminData(response.data.admin);
      });
  };

  useEffect(() => {
    fetchCurrentAdminData();
    fetchUsers();
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (radioValue === "1") {
      fetchCurrentAdminData();
      fetchAdmins();
    } else if (radioValue === "2") {
      fetchUsers();
    }
  }, [radioValue]);

  const displayUsersList = () => {
    const handleDeleteModalOpen = (username) => {
      setUserToDelete(username);
      setDeleteModal(true);
    };

    const handleDeleteModalClose = () => {
      setDeleteModal(false);
      setUserToDelete("");
    };

    const handleDeleteModalDelete = async (username) => {
      await axios
        .post(
          "/api/user/delete",
          { username: username },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => {
          if (response.error) {
            setUserDeleteError(response.error);
          } else {
            fetchUsers();
            handleDeleteModalClose();
            setAfterDeleteMsg(response.data.message);

            document
              .getElementById("adminDataCard")
              .scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
              setAfterDeleteMsg("");
            }, 10000);
          }
        })
        .catch((error) => {
          setUserDeleteError(error);
        });
    };

    if (usersData.length > 0) {
      return (
        <>
          {afterDeleteMsg ? (
            <Alert
              variant="info"
              className="mt-2 w-50 container"
              id="afterDeleteMsg"
            >
              {afterDeleteMsg}
            </Alert>
          ) : (
            <></>
          )}
          {usersData.map((userData, index) => {
            return (
              <div key={"user" + index}>
                <Card className="w-50 container mt-4 mb-5" border="secondary">
                  <Card.Body>
                    <Card.Title className="mb-4">
                      <h1>User #{index + 1}</h1>
                    </Card.Title>
                    <table className="table w-75">
                      <tbody>
                        <tr>
                          <th scope="row">Username:</th>
                          <td>{userData.username}</td>
                        </tr>
                        <tr>
                          <th scope="row">Unique ID:</th>
                          <td>{userData.userId}</td>
                        </tr>
                        <tr>
                          <th scope="row">Account type:</th>
                          <td>{userData.accountType}</td>
                        </tr>
                        <tr>
                          <th scope="row">First name:</th>
                          <td>{userData.firstName}</td>
                        </tr>
                        <tr>
                          <th scope="row">Last name:</th>
                          <td>{userData.lastName}</td>
                        </tr>
                        <tr>
                          <th scope="row">PESEL:</th>
                          <td>{userData.PESEL}</td>
                        </tr>
                      </tbody>
                    </table>
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => handleDeleteModalOpen(userData.username)}
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
          <Modal
            show={deleteModal}
            onHide={handleDeleteModalClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Delete {userToDelete}?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure that you want to delete {userToDelete} user? IT'S
              IRREVERSIBLE
              {userDeleteError ? (
                <Alert
                  variant="danger"
                  className="mt-2 w-50 justify-content-center"
                >
                  {userDeleteError}
                </Alert>
              ) : (
                <></>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleDeleteModalClose}>
                Close
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteModalDelete(userToDelete)}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    } else {
      return (
        <Alert variant="warning" className="mt-2 w-50 justify-content-center">
          No users found. Try to create one to see something in that cathegory
        </Alert>
      );
    }
  };

  const displayAdminsList = () => {
    if (adminsData.length > 0) {
      return adminsData.map((adminData, index) => {
        return (
          <div key={"admin" + index}>
            <Card className="w-50 container mt-4 mb-5" border="secondary">
              <Card.Body>
                <Card.Title className="mb-4">
                  {adminData.username === currentAdminData.username ? (
                    <h1>Admin #{index + 1} (You)</h1>
                  ) : (
                    <h1>Admin #{index + 1}</h1>
                  )}
                </Card.Title>
                <table className="table w-75">
                  <tbody>
                    <tr>
                      <th scope="row">Username:</th>
                      <td>{adminData.username}</td>
                    </tr>
                    <tr>
                      <th scope="row">Unique ID:</th>
                      <td>{adminData.userId}</td>
                    </tr>
                    <tr>
                      <th scope="row">Account type:</th>
                      <td>{adminData.accountType}</td>
                    </tr>
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </div>
        );
      });
    } else {
      return (
        <Alert variant="warning" className="mt-2 w-50 justify-content-center">
          No admins found. Try to create one to see something in that cathegory
        </Alert>
      );
    }
  };

  if (user.accountType !== "admin") {
    return <Navigate to="/customer" />;
  }

  return (
    <>
      {currentAdminData ? (
        <Card className="container mt-4" border="secondary" id="adminDataCard">
          <Card.Body>
            <Card.Title className="mb-4">
              <h1>Welcome {currentAdminData.username}!</h1>
            </Card.Title>
            <Card.Subtitle className="text-muted">
              <h4>Go back to work!</h4>
            </Card.Subtitle>
            <Card.Text>Select category to start</Card.Text>
            <ButtonGroup className="mt-2">
              {radios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant="outline-primary"
                  name="radio"
                  value={radio.value}
                  checked={radioValue === radio.value}
                  onChange={(e) => setRadioValue(e.currentTarget.value)}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Card.Body>
        </Card>
      ) : (
        <p>Wait until your profile is loading...</p>
      )}
      {radioValue === "1" ? displayAdminsList() : <></>}
      {radioValue === "2" ? displayUsersList() : <></>}
      {radioValue === "3" ? (
        <DisplayNewAdminForm
          newAdminUsername={newAdminUsername}
          setNewAdminUsername={setNewAdminUsername}
          newAdminResponse={newAdminResponse}
          setNewAdminResponse={setNewAdminResponse}
          newAdminError={newAdminError}
          setNewAdminError={setNewAdminError}
          newAdminPassword={newAdminPassword}
          setNewAdminPassword={setNewAdminPassword}
          newAdminId={newAdminId}
          setNewAdminId={setNewAdminId}
        />
      ) : (
        <></>
      )}
      {radioValue === "4" ? (
        <DisplayNewUserForm
          newUserUsername={newUserUsername}
          setNewUserUsername={setNewUserUsername}
          newUserResponse={newUserResponse}
          setNewUserResponse={setNewUserResponse}
          newUserError={newUserError}
          setNewUserError={setNewUserError}
          newUserPassword={newUserPassword}
          setNewUserPassword={setNewUserPassword}
          newUserId={newUserId}
          setNewUserId={setNewUserId}
          newUserFirstName={newUserFirstName}
          setNewUserFirstName={setNewUserFirstName}
          newUserLastName={newUserLastName}
          setNewUserLastName={setNewUserLastName}
          newUserPESEL={newUserPESEL}
          setNewUserPESEL={setNewUserPESEL}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default AdminPage;
