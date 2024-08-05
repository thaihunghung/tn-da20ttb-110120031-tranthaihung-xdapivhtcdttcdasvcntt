import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AxiosClient } from '../../../../service/AxiosClient';
import Cookies from 'js-cookie';
import { axiosAdmin } from '../../../../service/AxiosAdmin';
import axios from 'axios';

const { Title } = Typography;

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosAdmin.get(`${process.env.REACT_APP_API_DOMAIN_CLIENT}/user`, {}, {
          withCredentials: true
        });

        if (response.status === 200) {
          navigate('/admin');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUser();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const login = await AxiosClient.post('/login', values);
      if (login.data) {
        message.success('Đăng nhập thành công!');
      }
      const response = await AxiosClient.get('/user');
      console.log("response", response.data);
      if (response.data) {
        Cookies.set('teacher_id', response.data.teacher_id, { expires: 2 });
        navigate('/admin');
      }
    } catch (error) {
      console.error('Đăng nhập thất bại:', error);
      message.error('Đăng nhập thất bại, vui lòng thử lại!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">

          <div className="mt-12 flex flex-col items-center">
            <Title className="text-2xl xl:text-3xl font-extrabold">Đăng nhập</Title>
            <div className="w-full flex-1 mt-8 ">
              <Form
                name="login_form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                className="mx-auto max-w-xs"
              >
                <Form.Item
                  name="teacherCode"
                  rules={[{ required: true, message: 'Vui lòng nhập mã giáo viên!' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Mã giáo viên" className="w-full text-large px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500  focus:outline-none focus:border-gray-400 focus:bg-white" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-large focus:outline-none focus:border-gray-400 focus:bg-white mt-5" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={loading} block className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')" }}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
