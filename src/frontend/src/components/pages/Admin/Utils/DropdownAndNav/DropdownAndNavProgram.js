import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from 'antd';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

const DropdownAndNavProgram = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  const items = useMemo(() => [
    { key: "Danh sách program", label: "Danh sách program", path: `/admin/management-program/description`},
    { key: "Tạo mới", label: "Tạo mới", path: `/admin/management-program/create` },
    { key: "Chỉnh sửa", label: "Chỉnh sửa", path: `/admin/management-program/update` }
  ], []);

  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    const match = items.find(item => location.pathname.startsWith(item.path));
    if (match) {
      setSelectedItem(match.key);
    }
  }, [location.pathname, items]);

  const handleAction = (key) => {
    const selected = items.find(item => item.key === key);
    if (selected) {
      setSelectedItem(selected.label);
    }
  };
  return (
    <div className="flex justify-between mb-5 w-full items-center">
      <div className="flex gap-2 justify-center items-center lg:hidden xl:hidden">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="text-base font-bold">
              {selectedItem} <i className="fas fa-chevron-right ml-2"></i>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Dynamic Actions" items={items} onAction={handleAction}>
            {(item) => (
              <DropdownItem key={item.key}>
                <Link to={item.path} className="h-full">
                  <div className="min-w-[200px] text-base font-bold text-[#020401]">
                    {item.label}
                  </div>
                </Link>
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="hidden sm:hidden lg:block xl:block">
        <div className="flex border justify-start text-base font-bold rounded-lg">
          <Link to={`/admin/management-program/description`}>
            <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
              <div className={` ${isActive(`/admin/management-program/description`) ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                Danh sách program
              </div>
            </div>
          </Link>

          <Link to={`/admin/management-program/create`}>
            <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
              <div className={` ${isActive(`/admin/management-program/create`) ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                Tạo mới
              </div>
            </div>
          </Link>
          <Link to={`/admin/management-program/update`}>
            <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
              <div className={` ${isActive(`/admin/management-program/update`) ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                Chỉnh sửa
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DropdownAndNavProgram;

