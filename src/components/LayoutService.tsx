// Layout.tsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-primary" style={{ minHeight: '100vh' }}>
      <div id="layoutAuthentication_content" className="flex-grow-1">
        <main>
          <Container>
            <Row className="justify-content-center">
              <Col lg={5}>
                {children}
              </Col>
            </Row>
          </Container>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;