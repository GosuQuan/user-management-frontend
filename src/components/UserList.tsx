import React, { useEffect, useState } from 'react';
import { Table, Space, Button, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { User } from '../types/user';
import { adminApi } from '../services/api';
import UserModal from './UserModal';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllUsers();

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
      setLoading(true);
      await adminApi.deleteUser(id);
      message.success('删除成功');
      fetchUsers();
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setCurrentUser(null);
    setModalVisible(false);
    fetchUsers();
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
