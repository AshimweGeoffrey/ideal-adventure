import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import portfolioService from "../services/portfolioService";
import { toast } from "react-toastify";

const PortfolioForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
    isPublic: false,
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      fetchPortfolio();
    }
  }, [id, isEdit]);

  const fetchPortfolio = async () => {
    try {
      const portfolio = await portfolioService.getPortfolio(id);
      setFormData({
        title: portfolio.title || "",
        description: portfolio.description || "",
        technologies: Array.isArray(portfolio.technologies)
          ? portfolio.technologies.join(", ")
          : portfolio.technologies || "",
        githubUrl: portfolio.githubUrl || "",
        liveUrl: portfolio.liveUrl || "",
        imageUrl: portfolio.imageUrl || "",
        isPublic: portfolio.isPublic || false,
      });
    } catch (error) {
      toast.error("Failed to fetch portfolio");
      navigate("/dashboard");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const portfolioData = {
        ...formData,
        technologies: formData.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech),
      };

      if (isEdit) {
        await portfolioService.updatePortfolio(id, portfolioData);
        toast.success("Portfolio updated successfully");
      } else {
        await portfolioService.createPortfolio(portfolioData);
        toast.success("Portfolio created successfully");
      }

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.message || `Failed to ${isEdit ? "update" : "create"} portfolio`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">
              {isEdit ? "Edit Portfolio" : "Create New Portfolio"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Project Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="technologies" className="form-label">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="technologies"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="githubUrl" className="form-label">
                  GitHub URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="githubUrl"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="liveUrl" className="form-label">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="liveUrl"
                  name="liveUrl"
                  value={formData.liveUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="imageUrl" className="form-label">
                  Project Image URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="isPublic">
                  Make this portfolio public
                </label>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : isEdit
                    ? "Update Portfolio"
                    : "Create Portfolio"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioForm;
