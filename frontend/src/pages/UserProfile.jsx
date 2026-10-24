import { useEffect, useState } from 'react';
import { Form, Input, Select, Checkbox, Button, Card, Typography, message, Space, Modal, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

export default function UserProfile() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // Состояния
  const [currentUser, setCurrentUser] = useState(null);
  const [isDirty, setIsDirty] = useState(false); // Флаг: были ли изменения в форме

  const isEditMode = true; 

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      form.setFieldsValue(parsedUser); // Заполняем форму данными из памяти
    }
  }, [form, navigate]);

  // Обработка кнопки "Сохранить"
  const onFinish = async (values) => {
    try {
      // По ТЗ: PUT /api/v1/users/{id} для редактирования
      const response = await axios.put(`http://127.0.0.1:3001/users/${currentUser.id}`, values);
      
      message.success('Данные успешно сохранены!');
      setIsDirty(false); // Сбрасываем флаг изменений
      
      // Обновляем данные, чтобы они были актуальными
      localStorage.setItem('user', JSON.stringify({ ...currentUser, ...values }));
    } catch (error) {
      message.error('Ошибка при сохранении данных на сервере');
    }
  };

  // Обработка кнопки "Закрыть"
  const handleClose = () => {
    if (isDirty) {
      Modal.confirm({
        title: 'Закрыть без сохранения?',
        content: 'У вас есть несохраненные изменения. Вы уверены, что хотите выйти?',
        okText: 'Да, выйти',
        cancelText: 'Отмена',
        onOk: () => navigate('/modules'),
      });
    } else {
      navigate('/modules');
    }
  };

  if (!currentUser) return null;

  return (
    <div style={{ padding: '40px', background: '#d0e8ff', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <Card style={{ width: '100%', backgroundColor: '#9bc2e9', maxWidth: 800, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Title level={3} style={{ marginBottom: 28 }}>Свойства пользователя</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onValuesChange={() => setIsDirty(true)} // Как только юзер что-то ввел, ставим флаг изменений
        >
          {/* Сетка для компактного расположения полей */}
          <Space direction="vertical" size="small" style={{ display: 'flex' }}>
                        
            <Form.Item label="Группа (основная лаборатория)" name="laboratory" style={{ marginBottom: 5 }}>
              <Select>
                <Option value="Основная лаборатория">Основная лаборатория</Option>
                <Option value="Резервная лаборатория">Резервная лаборатория</Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="Логин" name="username" style={{ marginBottom: 5 }} rules={[{ required: true, message: 'Логин не может быть пустым!' }]}>
              <Input />
            </Form.Item>

              <Form.Item label="Фамилия" name="lastName" style={{ marginBottom: 5 }} rules={[{ required: true, message: 'Фамилия не может быть пустой!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Имя" name="firstName" style={{ marginBottom: 5 }} rules={[{ required: true, message: 'Имя не может быть пустым!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Отчество" name="middleName" style={{ marginBottom: 5 }}>
                <Input />
              </Form.Item>

            {/* В Ant Design режим mode="multiple" заменяет паттерн "комбобокс + кнопка добавить + список удалений", делая это элегантнее */}
            <Form.Item label="Лаборатории" name="laboratories" style={{ marginBottom: 5 }}>
              <Select mode="multiple" placeholder="Выберите лаборатории">
                <Option value="Основная лаборатория">Основная лаборатория</Option>
                <Option value="Резервная лаборатория">Резервная лаборатория</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Роли" name="roles" style={{ marginBottom: 5 }}>
              <Select mode="multiple" placeholder="Выберите роли">
                <Option value="Администратор">Администратор</Option>
                <Option value="Лаборант">Лаборант</Option>
                <Option value="Врач">Врач</Option>
              </Select>
            </Form.Item>

            <Form.Item 
              label={
                <Space>
                  Модули
                  {/* По ТЗ: кнопка "?" — по клику/наведению показывает инфо */}
                  <Tooltip title="Выберите модули, к которым пользователь будет иметь доступ в главном меню.">
                    <QuestionCircleOutlined style={{ cursor: 'pointer', color: '#1890ff' }} />
                  </Tooltip>
                </Space>
              } 
              name="appModules"
            >
              <Select mode="multiple" placeholder="Выберите модули">
                <Option value="LB Support">LB Support</Option>
                <Option value="LB BioBank">LB BioBank</Option>
                <Option value="LB Verification">LB Verification</Option>
                <Option value="LB Reactive">LB Reactive</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Пароль" name="password" style={{ marginBottom: 5 }}>
              {/* По ТЗ: disabled, если это существующий пользователь */}
              <Input.Password placeholder="Пароль задается только при создании" disabled={isEditMode} />
            </Form.Item>

            {/* По ТЗ: Активен (checkbox) показывается только в режиме редактирования */}
            {isEditMode && (
              <Form.Item name="enabled" valuePropName="checked">
                <Checkbox>Активен</Checkbox>
              </Form.Item>
            )}

            {/* Кнопки */}
            <Space style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
               <Button type="primary" htmlType="submit" style={{ backgroundColor: '#6ee997'}}>
                Сохранить
              </Button>
              <Button onClick={handleClose}>
                Закрыть
              </Button>
            </Space>

          </Space>
        </Form>
      </Card>
    </div>
  );
}