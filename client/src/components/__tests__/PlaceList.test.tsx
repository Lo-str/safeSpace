import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PlaceList from "../PlaceList";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock global fetch
vi.stubGlobal("fetch", vi.fn());

// Mock PacmanLoader if it's a third-party component
vi.mock("react-spinners", () => ({
  PacmanLoader: () => <div data-testid="pacman-loader" />,
}));

describe("PlaceList Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // Helper function to render the component with a router
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it("shows loading state initially", () => {
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {}));
    renderWithRouter(<PlaceList />);
    expect(screen.getByTestId("pacman-loader")).toBeInTheDocument();
  });

  it("shows error message if fetch fails", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Failed to fetch places"));
    renderWithRouter(<PlaceList />);

    await waitFor(() => {
      expect(
        screen.getByText(/Error: Failed to fetch places/i),
      ).toBeInTheDocument();
    });
  });

  it("shows 'No places found' if the API returns an empty array", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);

    renderWithRouter(<PlaceList />);

    await waitFor(() => {
      expect(screen.getByText(/No places found\./i)).toBeInTheDocument();
    });
  });

  it("renders a list of spaces", async () => {
    const mockSpaces = [
      { id: 1, name: "Queer Community Center" },
      { id: 2, name: "LGBTQ+ Safe Space" },
    ];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockSpaces),
    } as Response);

    renderWithRouter(<PlaceList />);

    await waitFor(() => {
      expect(screen.getByText("Queer Community Center")).toBeInTheDocument();
      expect(screen.getByText("LGBTQ+ Safe Space")).toBeInTheDocument();
    });
  });
});
