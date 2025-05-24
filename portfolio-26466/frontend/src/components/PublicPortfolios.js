import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import portfolioService from "../services/portfolioService";
import { toast } from "react-toastify";

const PublicPortfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicPortfolios();
  }, []);

  const fetchPublicPortfolios = async () => {
    try {
      const data = await portfolioService.getPublicPortfolios();
      setPortfolios(data);
    } catch (error) {
      toast.error("Failed to fetch public portfolios");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading public portfolios...</div>;
  }

  return (
    <div>
      <div className="text-center mb-5">
        <h1>Public Portfolio Gallery</h1>
        <p className="lead">Discover amazing projects from our community</p>
      </div>

      {portfolios.length === 0 ? (
        <div className="alert alert-info text-center">
          <h4>No public portfolios available yet</h4>
          <p>Be the first to share your work with the community!</p>
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      ) : (
        <div className="row">
          {portfolios.map((portfolio) => (
            <div key={portfolio._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                {portfolio.imageUrl && (
                  <img
                    src={portfolio.imageUrl}
                    className="card-img-top"
                    alt={portfolio.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{portfolio.title}</h5>
                  <p className="card-text flex-grow-1">
                    {portfolio.description?.substring(0, 120)}
                    {portfolio.description?.length > 120 ? "..." : ""}
                  </p>

                  {portfolio.technologies &&
                    portfolio.technologies.length > 0 && (
                      <div className="mb-3">
                        <div className="d-flex flex-wrap gap-1">
                          {portfolio.technologies
                            .slice(0, 3)
                            .map((tech, index) => (
                              <span
                                key={index}
                                className="badge bg-secondary small"
                              >
                                {tech}
                              </span>
                            ))}
                          {portfolio.technologies.length > 3 && (
                            <span className="badge bg-light text-dark small">
                              +{portfolio.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <Link
                      to={`/portfolio/${portfolio._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </Link>
                    <div className="d-flex gap-2">
                      {portfolio.githubUrl && (
                        <a
                          href={portfolio.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-dark btn-sm"
                        >
                          GitHub
                        </a>
                      )}
                      {portfolio.liveUrl && (
                        <a
                          href={portfolio.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>

                  <small className="text-muted mt-2">
                    By: {portfolio.author?.username || "Anonymous"}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicPortfolios;
