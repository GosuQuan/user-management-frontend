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
