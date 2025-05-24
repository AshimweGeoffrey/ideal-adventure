import { apiService } from "./apiService";

const portfolioService = {
  // Get all public portfolios
  getPublicPortfolios: async () => {
    const response = await apiService.get("/portfolio/public/all");
    return response.portfolios || [];
  },

  // Get user's portfolios
  getUserPortfolios: async () => {
    const response = await apiService.get("/portfolio");
    return response.portfolios || [];
  },

  // Get single portfolio by ID
  getPortfolio: async (id) => {
    const response = await apiService.get(`/portfolio/${id}`);
    return response.portfolio;
  },

  // Create new portfolio
  createPortfolio: async (portfolioData) => {
    const response = await apiService.post("/portfolio", portfolioData);
    return response.portfolio;
  },

  // Update portfolio
  updatePortfolio: async (id, portfolioData) => {
    const response = await apiService.put(`/portfolio/${id}`, portfolioData);
    return response.portfolio;
  },

  // Delete portfolio
  deletePortfolio: async (id) => {
    const response = await apiService.delete(`/portfolio/${id}`);
    return response.data;
  },
};

export default portfolioService;
