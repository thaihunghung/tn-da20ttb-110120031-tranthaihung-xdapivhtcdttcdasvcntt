import { useEffect, useMemo, useState } from "react";
import { message } from 'antd';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import ModalAddPrograms from "./ModalAddPrograms";
import { Link, useLocation } from "react-router-dom";
import ModalUpdatePrograms from "./ModalUpdatePrograms";
import ModalOpenExcel from "./ModalOpenExcel";

const ManageProgram = (nav) => {
    const { setCollapsedNav } = nav;
    const [programData, setProgramData] = useState({});

    const allProgramNotIsDelete = async () => {
        try {
            const program = await axiosAdmin.get('/program/IT');
            setProgramData(program.data)
            console.log(program.data);
        } catch (error) {
            console.error("Error fetching program data:", error);
            message.error(error.message || 'Error fetching program data');
        };
    }
    useEffect(() => {
        allProgramNotIsDelete()
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setCollapsedNav(true);
            } else {
                setCollapsedNav(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

    const [newPrograms, setNewPrograms] = useState({
        program_id: "",
        programName: "",
        description: "",
    });
    const [editPrograms, setEditPrograms] = useState({
        program_id: "",
        programName: "",
        description: "",
    });

    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };
    const handleExcelClick = () => {
        setIsExcelModalOpen(true);
    };
    const handleUpdateClick = () => {
        const data = {
            program_id: programData.program_id,
            programName: programData.programName,
            description: programData.description,
        }
        setEditPrograms(data)
        setIsEditModalOpen(true);
    };
    const resestValue = {
        program_id: "",
        programName: "",
        description: "",
    }
    const handleFormSubmit = async (event) => {
        setNewPrograms(resestValue)
        try {
            const data = {
                program_id: newPrograms.program_id,
                programName: newPrograms.programName,
                description: newPrograms.description
            };

            const response = await axiosAdmin.post('/program', { data });

            if (response.status === 201) {
                message.success('Tạo mới thành công');
                allProgramNotIsDelete()
            } else {
                message.error(response.data.message || 'lưu thất bại');
            }
        } catch (error) {
            console.error(error);
            message.error('lưu thất bại');
        }
    };
    const handleUpdateFormSubmit = async (event) => {
        try {
            const data = { programName: editPrograms.programName, description: editPrograms.description };
            const response = await axiosAdmin.put('/program/IT', { data: data });
            if (response.status === 200) {
                message.success('Cập nhật thành công');
                allProgramNotIsDelete()
            } else {
                message.error(response.data.message || 'Cập nhật thất bại');
            }
        } catch (error) {
            console.error("Cập nhật thất bại:", error);
            message.error('Cập nhật thất bại');
        }
    };

    return (
        <div className="flex w-full flex-col mb-[50px] justify-center leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7">
            <ModalUpdatePrograms
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSubmit={handleUpdateFormSubmit}
                editData={editPrograms}
                setEditData={setEditPrograms}
                loadData={allProgramNotIsDelete}
            />
             <ModalOpenExcel                
                isOpen={isExcelModalOpen}
                onOpenChange={setIsExcelModalOpen}
            />
            <ModalAddPrograms
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSubmit={handleFormSubmit}
                editData={newPrograms}
                setEditData={setNewPrograms}
                loadData={allProgramNotIsDelete}
            />

            <div className="flex justify-between w-full items-center">
                <div>
                    <div className="flex border justify-start text-base font-bold rounded-lg">
                        <div className="p-5 hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div className="border-b-4 border-[#475569]">
                                Chương trình
                            </div>
                        </div>
                        <div onClick={handleAddClick} className="p-5 hidden sm:block text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div>
                                Tạo mới
                            </div>
                        </div>
                        <div onClick={handleUpdateClick} className="p-5 hidden sm:block text-[#020401] hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div>
                                Chỉnh sửa
                            </div>
                        </div>
                        <div onClick={handleExcelClick} className="p-5 text-[#020401] hidden sm:block hover:bg-[#475569]  rounded-lg hover:text-[#FEFEFE]">
                            <div>
                                Nhập bằng Excels
                            </div>
                        </div>
                        <div className="flex gap-2 w-fit justify-center items-center sm:hidden mr-5">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        variant="bordered"
                                        isIconOnly
                                        className="p-2 flex items-center justify-center"
                                    >
                                        <i className="fas fa-ellipsis-vertical text-lg text-gray-600"></i>
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Dynamic Actions">
                                    <DropdownItem key="add" onClick={handleAddClick}>
                                        Tạo mới
                                    </DropdownItem>
                                    <DropdownItem key="edit" onClick={handleUpdateClick}>
                                        Chỉnh sửa
                                    </DropdownItem>
                                    <DropdownItem key="import" onClick={handleExcelClick}>
                                        Nhập bằng Excels
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full border mt-5 rounded-lg">
                <div className="w-full border-collapse border">
                    <div className="w-full">
                        <div className="w-full border-1 bg-[#475569] text-white text-center">Mô tả</div>
                    </div>
                    <div className="border-1 text-justify leading-8 p-5">
                        <div className="w-full text-2xl text-[#475569] mb-5 font-bold">{programData?.program_id}{" "}{programData?.programName}</div>
                        <div dangerouslySetInnerHTML={{ __html: programData?.description }}></div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ManageProgram;
