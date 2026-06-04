import { useCallback, useMemo } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Browse from "./pages/Browse/Browse";
import Login from "./pages/Login";
import Profile from "./pages/Profile/Profile";
import Cards from "./pages/Cards/Cards";
import Review from "./pages/Review/Review";
import { Auth0Provider, useAuth0, type AppState } from "@auth0/auth0-react";

function Navbar() {
  const { isAuthenticated, logout, loginWithRedirect } = useAuth0();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" aria-label="Safe Space — home">
          Safe Space
        </Link>
        <div className="navbar-links">
          <Link to="/places" className="navbar-link">
            Browse
          </Link>
          <Link to="/profile" className="navbar-link">
            Profile
          </Link>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              className="navbar-link"
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                loginWithRedirect({
                  appState: { returnTo: "/profile" },
                  authorizationParams: {
                    screen_hint: "login",
                    scope: "openid profile email",
                  },
                })
              }
              className="navbar-link"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function AppWithAuth() {
  const navigate = useNavigate();

  const authorizationParams = useMemo(
    () => ({
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: "openid profile email offline_access",
    }),
    [],
  );

  const onRedirectCallback = useCallback(
    (appState?: AppState) =>
      navigate(appState?.returnTo ?? "/", { replace: true }),
    [navigate],
  );

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      cacheLocation="memory"
      useRefreshTokens={true}
      authorizationParams={authorizationParams}
      onRedirectCallback={onRedirectCallback}
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Browse />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/places/:id" element={<Cards />} />
        <Route path="/places/:id/review" element={<Review />} />
      </Routes>
    </Auth0Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWithAuth />
    </BrowserRouter>
  );
}

export default App;
