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
