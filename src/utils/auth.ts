import { message } from 'antd';

export const handleAuthError = () => {
  // 清除本地存储的用户信息
  localStorage.removeItem('user');
  
  // 显示友好提示
  message.loading({
    content: '登录已过期，正在跳转...',
    duration: 2,
    onClose: () => {
      // 跳转到登录页
      window.location.href = '/login';
    }
  });
};
