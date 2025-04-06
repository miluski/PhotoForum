import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchProvider } from "@/components/search-provider";
import Home from "@/app/page";
import axios from "axios";

// Mock Axios to prevent real network requests
jest.mock("axios", () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };
  return {
    default: mockAxiosInstance, // For default export usage
    create: jest.fn(() => mockAxiosInstance), // Mock axios.create()
  };
});

// Define a custom type that includes the 'default' property
interface MockedAxios extends jest.Mocked<typeof axios> {
  default: {
    get: jest.Mock;
    post: jest.Mock;
    interceptors: {
      request: { use: jest.Mock; eject: jest.Mock };
      response: { use: jest.Mock; eject: jest.Mock };
    };
  };
}

// Get the mocked axios instance with the custom type
const mockedAxios = axios as MockedAxios;

const queryClient = new QueryClient();

describe("Home Page", () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <SearchProvider>{ui}</SearchProvider>
      </QueryClientProvider>
    );
  };

  beforeAll(() => {
    // Mock Axios responses using the mocked instance's default export
    mockedAxios.default.get.mockResolvedValue({ data: [] });
    mockedAxios.default.post.mockResolvedValue({ data: { success: true } });
  });

  it("renders the main container", () => {
    renderWithProviders(<Home />);
    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
  });

  it("renders the tab list", () => {
    renderWithProviders(<Home />);
    const tabList = screen.getByRole("tablist");
    expect(tabList).toBeInTheDocument();
  });

  it("renders the 'Wszystkie' tab", () => {
    renderWithProviders(<Home />);
    const allTab = screen.getByText("Wszystkie");
    expect(allTab).toBeInTheDocument();
  });
});
