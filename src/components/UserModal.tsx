import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import { User, UserFormData } from '../types/user';
import { adminApi, authApi } from '../services/api';

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
  const isEdit = !!user;

  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } else {
      form.resetFields();
    }
  }, [visible, user, form]);

  const handleSubmit = async (values: UserFormData) => {
    try {
      if (isEdit && user) {
        await adminApi.updateUserRole(user.id, values.role!);
        message.success('User updated successfully');
      } else {
        await adminApi.register({
          username: values.username!,
          email: values.email!,
          password: values.password!, // Make sure to add password field to form
        });
        message.success('User created successfully');
      }
      onSuccess();
    } catch (error) {
      message.error(isEdit ? 'Failed to update user' : 'Failed to create user');
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit User' : 'Add User'}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please input username' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input email' },
            { type: 'email', message: 'Please input valid email' }
          ]}
        >
          <Input />
        </Form.Item>
        {!isEdit && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input password' }]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Please select role' }]}
        >
          <Select>
            <Select.Option value="USER">User</Select.Option>
            <Select.Option value="ADMIN">Admin</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
