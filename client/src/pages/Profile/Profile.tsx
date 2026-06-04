import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { PacmanLoader } from "react-spinners";
import "./Profile.css";

function Profile() {
  const { isAuthenticated, user, logout, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.history.replaceState(null, "", "/");
      loginWithRedirect({
        appState: { returnTo: "/profile" },
        authorizationParams: {
          screen_hint: "login",
          scope: "openid profile email",
        },
      });
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="page-loader">
        <PacmanLoader size={25} color="white" />
      </div>
    );
  }

  return (
    <div className="profile-container">
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
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
