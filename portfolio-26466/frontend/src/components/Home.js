import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Container>
      {/* Hero Section */}
      <Row className="text-center py-5">
        <Col>
          <h1 className="display-4 fw-bold text-primary mb-3">
            Portfolio System 26466
          </h1>
          <p className="lead mb-4">
            Secure Dynamic Portfolio Management System with advanced authentication
          </p>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Badge bg="success">JWT Authentication</Badge>
            <Badge bg="info">API Key Support</Badge>
            <Badge bg="warning">Docker Swarm</Badge>
            <Badge bg="danger">Traefik Load Balancer</Badge>
            <Badge bg="dark">TLS/SSL Security</Badge>
          </div>
        </Col>
      </Row>

      {/* Features Section */}
      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="fas fa-shield-alt fa-3x text-success"></i>
              </div>
              <Card.Title>Multi-Layer Security</Card.Title>
              <Card.Text>
                JWT token authentication with API key support and role-based access control
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="fas fa-code fa-3x text-primary"></i>
              </div>
              <Card.Title>Full CRUD Operations</Card.Title>
              <Card.Text>
                Complete portfolio management with create, read, update, and delete functionality
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="fas fa-cloud fa-3x text-info"></i>
              </div>
              <Card.Title>High Availability</Card.Title>
              <Card.Text>
                Docker Swarm deployment with Traefik load balancing across multiple nodes
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Technical Stack */}
      <Row className="mb-5">
        <Col>
          <Card className="bg-light">
            <Card.Body>
              <h3 className="text-center mb-4">Technical Architecture</h3>
              <Row>
                <Col md={3} className="text-center mb-3">
                  <h5>Frontend</h5>
                  <p className="mb-0">React + Bootstrap</p>
                  <small className="text-muted">Responsive SPA</small>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <h5>Backend</h5>
                  <p className="mb-0">Node.js + Express</p>
                  <small className="text-muted">RESTful API</small>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <h5>Database</h5>
                  <p className="mb-0">MongoDB</p>
                  <small className="text-muted">Document Store</small>
                </Col>
                <Col md={3} className="text-center mb-3">
                  <h5>Infrastructure</h5>
                  <p className="mb-0">Docker + Traefik</p>
                  <small className="text-muted">Container Orchestration</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Action Section */}
      <Row className="text-center py-4">
        <Col>
          {isAuthenticated ? (
            <div>
              <h3>Welcome back, {user?.username}!</h3>
              <p className="text-muted mb-4">Ready to manage your portfolio?</p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button as={Link} to="/dashboard" variant="primary" size="lg">
                  View Dashboard
                </Button>
                <Button as={Link} to="/portfolio/new" variant="success" size="lg">
                  Add New Portfolio
                </Button>
                <Button as={Link} to="/public" variant="outline-info" size="lg">
                  Browse Public Portfolios
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h3>Get Started Today</h3>
              <p className="text-muted mb-4">Join our secure portfolio platform</p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button as={Link} to="/register" variant="success" size="lg">
                  Create Account
                </Button>
                <Button as={Link} to="/login" variant="primary" size="lg">
                  Sign In
                </Button>
                <Button as={Link} to="/public" variant="outline-info" size="lg">
                  View Public Portfolios
                </Button>
              </div>
            </div>
          )}
        </Col>
      </Row>

      {/* System Info */}
      <Row className="mt-5 pt-4 border-top">
        <Col className="text-center">
          <h5 className="text-muted">System Information</h5>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <small><strong>Student ID:</strong> 26466</small>
            <small><strong>Nodes:</strong> Ubuntu (192.168.1.69) + CentOS (192.168.1.70)</small>
            <small><strong>Load Balancer:</strong> Traefik with Let's Encrypt</small>
            <small><strong>Security:</strong> JWT + API Keys + TLS</small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
