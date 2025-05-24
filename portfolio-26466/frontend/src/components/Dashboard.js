import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import portfolioService from "../services/portfolioService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const data = await portfolioService.getUserPortfolios();
      setPortfolios(data);
    } catch (error) {
      toast.error("Failed to fetch portfolios");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this portfolio?")) {
      try {
        await portfolioService.deletePortfolio(id);
        toast.success("Portfolio deleted successfully");
        fetchPortfolios();
      } catch (error) {
        toast.error("Failed to delete portfolio");
      }
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Portfolio Dashboard</h1>
        <Link to="/portfolio/new" className="btn btn-primary">
          Create New Portfolio
        </Link>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Welcome, {user?.username}!</h5>
              <p className="card-text">
                Manage your portfolios and showcase your work.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <h3>Your Portfolios</h3>
          {portfolios.length === 0 ? (
            <div className="alert alert-info">
              You haven't created any portfolios yet.{" "}
              <Link to="/portfolio/new">Create your first portfolio</Link>
            </div>
          ) : (
            <div className="row">
              {portfolios.map((portfolio) => (
                <div key={portfolio._id} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{portfolio.title}</h5>
                      <p className="card-text">
                        {portfolio.description?.substring(0, 100)}...
                      </p>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/portfolio/${portfolio._id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          View
                        </Link>
                        <Link
                          to={`/portfolio/${portfolio._id}/edit`}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(portfolio._id)}
                          className="btn btn-outline-danger btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                      <small className="text-muted d-block mt-2">
                        Created:{" "}
                        {new Date(portfolio.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
