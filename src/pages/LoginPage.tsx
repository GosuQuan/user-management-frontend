import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './AuthPages.css';

const { Title } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values: LoginFormData) => {
    try {
      // TODO: 实现登录逻辑
      console.log('登录信息：', values);
      message.success('登录成功！');
      navigate('/dashboard');
    } catch (error) {
      message.error('登录失败，请重试！');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Title level={2} style={{ textAlign: 'center', marginBottom: '32px' }}>
          登录
        </Title>
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          className="auth-form"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register">还没有账号？立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
