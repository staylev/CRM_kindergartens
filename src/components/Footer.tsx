import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="py-5 bg-light mt-auto">
      <Container fluid>
        <Row className="d-flex align-items-center justify-content-between small">
          <Col className="text-muted">Copyright &copy; Forkway 2025</Col>
          <Col className="text-end">
            <a href="/privacy">Политика конфиденциальностиy</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;