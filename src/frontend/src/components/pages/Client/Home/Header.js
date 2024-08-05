import React, { useEffect, useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { axiosAdmin } from '../../../../service/AxiosAdmin';
import { message } from 'antd';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Header = ({ studentCode, setStudentCode }) => {
  const [student, setStudent] = useState('');
  const navigate = useNavigate();

  const handleChangePassWord = () => {
    message.warning("Tính năng đang hoàn thiệt")
  };

  const handleLogout = () => {
    Cookies.remove('accessTokenStudent')
    navigate('/')
  };

  useEffect(() => {
    const fetchStudent = async () => {
      const response = await axiosAdmin.post('/students/getAllByStudentCode', {
        studentCode
      });
      setStudent(response.data[0])
    }
    fetchStudent();

  }, [studentCode])
  return (
    <Navbar maxWidth="full" isBordered>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-8">
          <div className="flex justify-start items-center p-4">
            <div className="text-2xl font-bold flex items-center">
              <span className="bg-purple-600 text-white rounded-full px-2 py-1 mr-2">
                SET
              </span>
              CNTT
            </div>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pinimg.com/564x/67/33/40/673340b2196b91f159e06556b4db196e.jpg"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="team_settings"
            onClick={()=>handleChangePassWord()}
            >
              Đổi mật khẩu
            </DropdownItem>
            <DropdownItem key="settings"
            onClick={()=>handleLogout()}
            >
              Đăng xuất
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div className='flex flex-col text-left font-semibold pr-9'>
          <p>{student?.name}</p>
          <p>{student?.email}</p>
        </div>

      </NavbarContent>
    </Navbar>
  );
};

export default Header;
