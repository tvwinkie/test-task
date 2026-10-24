import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

const { Title } = Typography;

export default function Login() {
  const navigate = useNavigate();

  // Эта функция сработает, когда форма пройдет локальную проверку (без пробелов и пустот)
  const onFinish = async (values) => {
    try {
      const response = await axios.get(`http://127.0.0.1:3001/login`);
      
      if (values.username === 'admin' && values.password === '12345') {
        
        // По ТЗ: "токен хранится на клиенте и прокидывается во все запросы"
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        message.success('Успешный вход!');
        navigate('/modules'); // Перекидываем на экран модулей
      } else {
        // По ТЗ: "выводить текст ошибки с сервера при неверных данных (401)"
        message.error('Ошибка 401: Неверный логин или пароль'); 
      }
    } catch (error) {
      message.error('Ошибка соединения с сервером');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <img src={logo} alt="Logo" style={{ display: 'block', margin: '0 auto -10px', width: 150, height: 150 }} />
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>LBControl</Title>
        
        <Form
          name="login_form"
          layout="vertical"
          onFinish={onFinish} // Автоматически перехватывает клик и нажатие Enter
        >
          <Form.Item
            label="Логин"
            name="username"
            // Правила валидации прямо из ТЗ: не пустое и без пробелов
            rules={[
              { required: true, message: 'Поля не могут быть пустыми!' },
              { pattern: /^\S+$/, message: 'Поля не могут содержать пробелы!' }
            ]}
          >
            <Input placeholder="Введите логин (admin)" />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              { required: true, message: 'Поля не могут быть пустыми!' },
              { pattern: /^\S+$/, message: 'Поля не могут содержать пробелы!' }
            ]}
          >
            <Input.Password placeholder="Введите пароль (12345)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" style={{ background: 'linear-gradient(to right, #698edf, #164cc2)', border: 'none', color: '#fff', fontWeight: 'bold' }}>
              Авторизоваться
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}