import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Profile from "../Profile/Profile";
import { useAuth0, Auth0ContextInterface, User } from "@auth0/auth0-react";
import { MemoryRouter } from "react-router-dom";
import { MfaApiClient } from "@auth0/auth0-spa-js";
import "@testing-library/jest-dom";

// Mock useAuth0
vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock PacmanLoader
vi.mock("react-spinners", () => ({
  PacmanLoader: () => <div data-testid="pacman-loader" />,
}));

// Build a complete Auth0 mock
const mockUseAuth0 = (
  overrides: Partial<Auth0ContextInterface<User>> = {},
): Auth0ContextInterface<User> => ({
  isAuthenticated: false,
  isLoading: true,
  user: undefined,
  getAccessTokenSilently: vi
    .fn()
    .mockResolvedValue({ access_token: "mock-token" }),
  getAccessTokenWithPopup: vi
    .fn()
    .mockResolvedValue({ access_token: "mock-token" }),
  getIdTokenClaims: vi.fn().mockResolvedValue({}),
  loginWithRedirect: vi.fn().mockResolvedValue(undefined),
  loginWithPopup: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  handleRedirectCallback: vi.fn().mockResolvedValue(undefined),
  connectAccountWithRedirect: vi.fn().mockResolvedValue(undefined),
  loginWithCustomTokenExchange: vi.fn().mockResolvedValue(undefined),
  exchangeToken: vi.fn().mockResolvedValue(undefined),
  getDpopNonce: vi.fn().mockResolvedValue(undefined),
  setDpopNonce: vi.fn().mockResolvedValue(undefined),
  generateDpopProof: vi.fn().mockResolvedValue(undefined),
  createFetcher: vi.fn().mockResolvedValue(undefined),
  getConfiguration: vi.fn().mockResolvedValue(undefined),
  mfa: {
    getAuthenticators: vi.fn(),
    enroll: vi.fn(),
    challenge: vi.fn(),
    verify: vi.fn(),
    getEnrollmentFactors: vi.fn(),
    setMFAAuthDetails: vi.fn(),
  } as unknown as MfaApiClient,
  error: undefined,
  ...overrides,
});

describe("Profile Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // Helper to render with MemoryRouter
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it("shows PacmanLoader when loading", () => {
    vi.mocked(useAuth0).mockReturnValue(
      mockUseAuth0({ isAuthenticated: false, isLoading: true }),
    );
    renderWithRouter(<Profile />);
    expect(screen.getByTestId("pacman-loader")).toBeInTheDocument();
  });

  it("redirects to home when not authenticated", () => {
    vi.mocked(useAuth0).mockReturnValue(
      mockUseAuth0({ isAuthenticated: false, isLoading: false }),
    );
    renderWithRouter(<Profile />);
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("shows user data and logout button when authenticated", () => {
    const mockUser = {
      name: "Test User",
      email: "test@example.com",
      picture: "https://example.com/test.jpg",
    };
    const mockLogout = vi.fn();
    vi.mocked(useAuth0).mockReturnValue(
      mockUseAuth0({
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
        logout: mockLogout,
      }),
    );

    renderWithRouter(<Profile />);

    expect(screen.getByText(/Username: Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/Email: test@example.com/i)).toBeInTheDocument();
    expect(screen.getByAltText("Test User")).toBeInTheDocument();


    const logoutButton = screen.getByRole("button", { name: /Logout/i });
    expect(logoutButton).toBeInTheDocument();
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });
});
