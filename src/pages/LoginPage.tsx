import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import './AuthPages.css';

const { Title } = Typography;

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginFormData>();

  const handleSubmit = async (values: LoginFormData) => {
    try {
      const { user } = await authApi.login(values);
      console.log('登录成功！', user);
      localStorage.setItem('user', JSON.stringify(user));
      message.success('登录成功！');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('登录错误：', error);
      message.error(error.response?.data?.message || '登录失败，请检查邮箱和密码！');
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
            name="email"
            rules={[
              { required: true, message: '请输入邮箱！' },
              { type: 'email', message: '请输入有效的邮箱地址！' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱"
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
