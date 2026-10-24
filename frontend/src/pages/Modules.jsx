import { useEffect, useState } from 'react';
import { Card, Row, Col, Layout, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const modulesData = [
  { id: 'support', title: 'LB Support', icon: '🛠️' },
  { id: 'biobank', title: 'LB BioBank', icon: '🧬' },
  { id: 'verification', title: 'LB Verification', icon: '✅' },
  { id: 'reactive', title: 'LB Reactive', icon: '🧪' },
  { id: 'archive', title: 'LB Archive', icon: '🗄️' },
  { id: 'vet', title: 'LB Vet', icon: '🐾' },
  { id: 'fridge', title: 'LB Fridge', icon: '❄️' },
  { id: 'profile', title: 'Учётная запись', icon: '👤', path: '/profile' }
];

export default function Modules() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // Защита роута: если токена нет, значит человек не авторизован - выкидываем на логин
    if (!token || !savedUser) {
      navigate('/login');
    } else {
      setUser(JSON.parse(savedUser)); // Превращаем строку обратно в объект
    }
  }, [navigate]);

  // Функция для кнопки "Выйти"
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Обработчик клика по плитке
  const handleCardClick = (path) => {
    if (path) navigate(path);
  };

  // Пока данные не загрузятся из памяти, показываем пустоту, чтобы не было ошибок
  if (!user) return null; 

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', textAlign: 'center', padding: 0 }}>
        <Title level={2} style={{ margin: '14px 0' }}>Окно модулей</Title>
      </Header>

      <Content style={{ padding: '50px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Row gutter={[16, 16]} justify="center">
            {modulesData.map((mod) => (
              <Col xs={24} sm={12} md={8} key={mod.id}>
                <Card
                  hoverable
                  onClick={() => handleCardClick(mod.path)}
                  style={{ textAlign: 'center', height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{mod.icon}</div>
                  <Text strong>{mod.title}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      <Footer style={{ background: '#001529', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 50px' }}>
        <div>
          <Text style={{ color: '#fff' }}>Пользователь: {user.username}</Text>
        </div>
        <div>
          <Button type="primary" danger onClick={handleLogout}>
            Выйти
          </Button>
        </div>
        <div>
          <Text style={{ color: '#fff' }}>Роль: {user.roles ? user.roles[0] : 'Нет роли'}</Text>
        </div>
      </Footer>
    </Layout>
  );
}