# React Frontend User Management System - 创建步骤

## 1. 项目初始化
```bash
# 创建项目
npm create vite@latest user-management-frontend -- --template react-ts

# 进入项目目录
cd user-management-frontend

# 安装依赖
cnpm install @ant-design/icons antd axios react-router-dom @types/react-router-dom
```

## 2. 类型定义
创建 src/types/user.ts：
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
}
```

## 3. API服务
创建 src/services/api.ts：
```typescript
import axios from 'axios';
import { User, UserFormData } from '../types/user';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  getUsers: async () => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getUser: async (id: number) => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: UserFormData) => {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: UserFormData) => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
};
```

## 4. 组件实现

### 用户列表组件 (src/components/UserList.tsx)
```typescript
import React, { useEffect, useState } from 'react';
import { Table, Space, Button, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { User } from '../types/user';
import { userApi } from '../services/api';
import UserModal from './UserModal';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userApi.getUsers();
      setUsers(data);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await userApi.deleteUser(id);
      message.success('删除成功');
      fetchUsers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setCurrentUser(null);
    setModalVisible(false);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchUsers();
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        添加用户
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
      />
      <UserModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        user={currentUser}
      />
    </div>
  );
};

export default UserList;
```

### 用户表单模态框 (src/components/UserModal.tsx)
```typescript
import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { User, UserFormData } from '../types/user';
import { userApi } from '../services/api';

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

const UserModal: React.FC<UserModalProps> = ({
  visible,
  onClose,
  onSuccess,
  user,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    } else {
      form.resetFields();
    }
  }, [visible, user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (user) {
        await userApi.updateUser(user.id, values);
        message.success('更新成功');
      } else {
        await userApi.createUser(values);
        message.success('创建成功');
      }
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('操作失败');
      }
    }
  };

  return (
    <Modal
      title={user ? '编辑用户' : '添加用户'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ name: '', email: '', phone: '' }}
      >
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="电话"
          rules={[{ required: true, message: '请输入电话' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
```

## 5. 主应用更新
更新 src/App.tsx：
```typescript
import { Layout } from 'antd';
import UserList from './components/UserList';
import './App.css';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout>
      <Header style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
        用户管理系统
      </Header>
      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
        <UserList />
      </Content>
    </Layout>
  );
}

export default App;
```

## 6. 样式配置
更新 src/index.css：
```css
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.ant-layout-header {
  background: #1890ff;
  padding: 0 24px;
  display: flex;
  align-items: center;
}

.ant-layout-content {
  background: #fff;
}
```

## 7. 启动项目
```bash
npm run dev
```

## 8. 新增页面和路由
### 安装额外依赖
```bash
npm install @emotion/styled @emotion/react
```

### Landing Page (src/pages/LandingPage.tsx)
- 创建一个现代化的着陆页
- 包含系统介绍和主要功能展示
- 提供登录和注册入口
- 使用渐变背景和动画效果

### 登录页面 (src/pages/LoginPage.tsx)
- 用户名和密码登录表单
- 表单验证
- 登录成功后跳转到仪表盘
- 提供注册入口链接

### 注册页面 (src/pages/RegisterPage.tsx)
- 完整的注册表单（用户名、邮箱、手机号、密码）
- 密码确认和表单验证
- 注册成功后跳转到登录页
- 提供登录入口链接

### 路由配置 (src/App.tsx)
```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/dashboard" element={<DashboardLayout />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
```

### 页面布局
- Landing Page: 全屏渐变背景，居中内容
- 登录/注册页: 全屏渐变背景，居中表单卡片
- 仪表盘: 顶部导航栏，主要内容区域

## 注意事项
1. 确保后端服务器在运行
2. 检查API基础URL是否正确
3. 确保所有依赖都已正确安装
4. 检查CORS配置是否正确

## 功能清单
- 查看用户列表
- 添加新用户
- 编辑用户信息
- 删除用户
- 表单验证
- 操作反馈
