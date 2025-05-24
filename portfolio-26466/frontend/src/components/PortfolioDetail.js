import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import portfolioService from "../services/portfolioService";
import { toast } from "react-toastify";

const PortfolioDetail = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchPortfolio();
  }, [id]);

  const fetchPortfolio = async () => {
    try {
      const data = await portfolioService.getPortfolio(id);
      setPortfolio(data);
    } catch (error) {
      toast.error("Failed to fetch portfolio");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!portfolio) {
    return <div className="alert alert-danger">Portfolio not found.</div>;
  }

  return (
    <div className="row">
      <div className="col-md-8 mx-auto">
        <div className="card">
          {portfolio.imageUrl && (
            <img
              src={portfolio.imageUrl}
              className="card-img-top"
              alt={portfolio.title}
              style={{ height: "300px", objectFit: "cover" }}
            />
          )}
          <div className="card-body">
            <h1 className="card-title">{portfolio.title}</h1>
            <p className="card-text">{portfolio.description}</p>

            {portfolio.technologies && portfolio.technologies.length > 0 && (
              <div className="mb-3">
                <h5>Technologies Used:</h5>
                <div className="d-flex flex-wrap gap-2">
                  {portfolio.technologies.map((tech, index) => (
                    <span key={index} className="badge bg-secondary">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="d-flex gap-3 mb-3">
              {portfolio.githubUrl && (
                <a
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-dark"
                >
                  <i className="bi bi-github"></i> View Code
                </a>
              )}
              {portfolio.liveUrl && (
                <a
                  href={portfolio.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <i className="bi bi-eye"></i> Live Demo
                </a>
              )}
            </div>

            <div className="text-muted">
              <small>
                Created by: {portfolio.author?.username || "Unknown"}
                <br />
                Created on: {new Date(portfolio.createdAt).toLocaleDateString()}
              </small>
            </div>

            <div className="mt-4">
              <Link to="/dashboard" className="btn btn-secondary">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetail;
