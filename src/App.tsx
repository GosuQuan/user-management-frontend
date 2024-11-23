import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './components/Dashboard';
import { Layout } from 'antd';
import UserList from './components/UserList';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const { Header, Content } = Layout;

const DashboardLayout = () => (
  <Layout className="layout-container">
    <Header style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
      用户管理系统
    </Header>
    <Content style={{ padding: '24px' }}>
      <UserList />
    </Content>
  </Layout>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
