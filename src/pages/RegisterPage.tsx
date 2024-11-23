import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import './AuthPages.css';

const { Title } = Typography;

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<RegisterFormData>();

  const handleSubmit = async (values: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = values;
      const { user } = await authApi.register(registerData);
      console.log('注册成功！', user);
      message.success('注册成功！');
      navigate('/login');
    } catch (error: any) {
      console.error('注册错误：', error);
      message.error(error.response?.data?.message || '注册失败，请重试！');
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Title className="auth-title" level={2}>
          注册
        </Title>
        <Form
          form={form}
          name="register"
          onFinish={handleSubmit}
          autoComplete="off"
          className="auth-form"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名！' },
              { min: 3, message: '用户名至少3个字符！' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

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
            name="phone"
            rules={[
              { required: true, message: '请输入手机号！' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号！' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="手机号"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, message: '密码至少6个字符！' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              注册
            </Button>
          </Form.Item>

          <div className="auth-link">
            <Link to="/login">已有账号？立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
