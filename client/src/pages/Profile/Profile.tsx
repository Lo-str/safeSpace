import { useAuth0 } from "@auth0/auth0-react";
import Login from "../Login";
import { PacmanLoader } from "react-spinners";
import "./Profile.css";

function Profile() {
  const { isAuthenticated, user, logout, isLoading } = useAuth0();

  return (
    <div className="profile-container">
      {isLoading ? (
        <div className="loading-spinner">
          <PacmanLoader size={25} color="#6c5ce7" />
        </div>
      ) : isAuthenticated ? (
        <div className="profile-content">
          {user?.picture && (
            <img
              src={user.picture}
              alt={user.name}
              className="profile-picture"
            />
          )}
          <div className="profile-info">
            <p className="profile-username">Username: {user?.name}</p>
            <p className="profile-email">Email: {user?.email}</p>
          </div>
          <button onClick={() => logout()} className="logout-button">
            Logout
          </button>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default Profile;
