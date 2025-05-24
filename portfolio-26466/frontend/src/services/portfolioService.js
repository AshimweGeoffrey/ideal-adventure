import { apiService } from "./apiService";

const portfolioService = {
  // Get all public portfolios
  getPublicPortfolios: async () => {
    const response = await apiService.get("/portfolios/public");
    return response.data;
  },

  // Get user's portfolios
  getUserPortfolios: async () => {
    const response = await apiService.get("/portfolios/user");
    return response.data;
  },

  // Get single portfolio by ID
  getPortfolio: async (id) => {
    const response = await apiService.get(`/portfolios/${id}`);
    return response.data;
  },

  // Create new portfolio
  createPortfolio: async (portfolioData) => {
    const response = await apiService.post("/portfolios", portfolioData);
    return response.data;
  },

  // Update portfolio
  updatePortfolio: async (id, portfolioData) => {
    const response = await apiService.put(`/portfolios/${id}`, portfolioData);
    return response.data;
  },

  // Delete portfolio
  deletePortfolio: async (id) => {
    const response = await apiService.delete(`/portfolios/${id}`);
    return response.data;
  },
};

export default portfolioService;
