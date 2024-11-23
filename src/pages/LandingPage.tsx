import React from 'react';
import { Typography, Card, Button, Row, Col, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  SecurityScanOutlined,
  DashboardOutlined,
  ApiOutlined
} from '@ant-design/icons';
import './LandingPage.css';

const { Title, Paragraph } = Typography;

const features = [
  {
    title: '用户管理',
    description: '全面的用户管理功能，包括注册、登录、密码重置等',
    icon: <UserOutlined style={{ fontSize: '24px', color: '#00ffff' }} />
  },
  {
    title: '安全认证',
    description: '多重安全认证机制，保护您的数据安全',
    icon: <SecurityScanOutlined style={{ fontSize: '24px', color: '#00ffff' }} />
  },
  {
    title: '数据分析',
    description: '直观的数据分析面板，帮助您了解用户行为',
    icon: <DashboardOutlined style={{ fontSize: '24px', color: '#00ffff' }} />
  },
  {
    title: 'API集成',
    description: '丰富的API接口，轻松集成到您的应用中',
    icon: <ApiOutlined style={{ fontSize: '24px', color: '#00ffff' }} />
  }
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="grid-background" />
      <div className="landing-content">
        <Title level={1}>
          Next-Gen User Management
        </Title>
        <Paragraph style={{ fontSize: '20px', marginBottom: '48px' }}>
          打造安全、高效、现代化的用户管理系统
        </Paragraph>

        <Row gutter={[24, 24]} justify="center">
          {features.map((feature, index) => (
            <Col key={index} xs={24} sm={12} md={12} lg={6}>
              <Card className="feature-card">
                <div style={{ marginBottom: '16px' }}>
                  {feature.icon}
                </div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="button-group">
          <Button type="primary" size="large" onClick={() => navigate('/register')}>
            立即开始
          </Button>
          <Button size="large" onClick={() => navigate('/login')}>
            登录系统
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
