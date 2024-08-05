import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from 'antd';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

const DropdownAndNavRubric = ({ open }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  const items = useMemo(() => [
    { key: "Danh sách rubric", label: "Danh sách rubric", path: `/admin/management-rubric/list` },
    { key: "Kho lưu trữ", label: "Kho lưu trữ", path: `/admin/management-rubric/store` },
    { key: "Tạo mới", label: "Tạo mới", path: `/admin/management-rubric/create` }
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
    <div className="flex justify-between w-full items-center">
      <div className="flex gap-2 justify-center items-center lg:hidden xl:hidden">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="text-base font-bold">
              {selectedItem} <i className="fas fa-chevron-right ml-2"></i>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Dynamic Actions" items={items} onAction={handleAction}>
            <DropdownItem key={items[0].key}>
              <Link to={items[0].path} className="h-full">
                <div className="min-w-[200px] text-base font-bold text-[#020401]">
                  {items[0].label}
                </div>
              </Link>
            </DropdownItem>
            <DropdownItem key={items[1].key}>
              <Link to={items[1].path} className="h-full">
                <div className="min-w-[200px] text-base font-bold text-[#020401]">
                  {items[1].label}
                </div>
              </Link>
            </DropdownItem>
            {location.pathname === "/admin/management-rubric/store" ? null : (
              <DropdownItem key={items[2].key}>

                <div onClick={open} className="min-w-[200px] text-base font-bold text-[#020401]">
                  Tạo mới
                </div>
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>;
      </div>

      <div className="hidden sm:hidden lg:block xl:block">
        <div className="flex border justify-start text-base font-bold rounded-lg">
          <Link to={`/admin/management-rubric/list`}>
            <div className="p-5 text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
              <div className={` ${isActive(`/admin/management-rubric/list`) ? "border-b-4 text-[#020401] border-[#475569]" : ""}`}>
                Danh sách rubric
              </div>
            </div>
          </Link>
          {
            location.pathname === "/admin/management-rubric/store" ? null : (
              <div onClick={open} className="p-5 text-[#020401] hover:bg-[#475569] rounded-lg hover:text-[#FEFEFE]">
                <div>
                  Tạo mới
                </div>
              </div>
            )
          }


        </div>
      </div>
      <div className="hidden sm:hidden lg:block xl:block">
        <Link to={`/admin/management-rubric/store`}>
          <div className="p-5 bg-default-50">
            <i className="fa-solid mr-2 fa-trash-can"></i><span className="text-base">Kho lưu trữ</span>
          </div>
        </Link>
      </div>
      <div className="lg:hidden xl:hidden">
        <Link to={`/admin/management-rubric/store`}>
          <Tooltip title="Kho lưu trữ" color={'#ff9908'}>
            <div className="p-5 bg-default-50">
              <i className="fa-solid fa-trash-can"></i>
            </div>
          </Tooltip>
        </Link>
      </div>
    </div>
  )
}

export default DropdownAndNavRubric;

