import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Po.css";

import { Table, Tooltip, message } from 'antd';
import { Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

import DownloadAndUpload from "../../Utils/DownloadAndUpload/DownloadAndUpload";
import DropdownAndNavPo from "../../Utils/DropdownAndNav/DropdownAndNavPo";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import Tabs from "../../Utils/Tabs/Tabs";
import Cookies from "js-cookie";
import ModalUpdatePo from "./ModalUpdatePo";
import ModalAddPo from "./ModalAddPo";

import BackButton from "../../Utils/BackButton/BackButton";
import { PlusIcon } from "../../../../../public/PlusIcon";

const ManagePo = (nav) => {
    const navigate = useNavigate();
    const teacher_id = Cookies.get('teacher_id');
    if (!teacher_id) {
        navigate('/login');
    }
    const handleNavigate = (path) => {
        navigate(path);
    };
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [poListData, setPosListData] = useState([]);
    const [deleteId, setDeleteId] = useState(null);


    const columns = [
        {
            title: "Tên PO",
            dataIndex: "name",
            render: (record) => (
                <div className="text-sm">
                    <p className="font-medium">{record}</p>
                </div>
            ),
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            render: (record) => (
                <div className="text-sm">
                    <p className="font-medium">{record}</p>
                </div>
            ),
        },
        {
            title: (
                <div className="flex items-center justify-center w-full">
                    <span>Form</span>
                </div>
            ),
            dataIndex: "action",
            render: (action) => (
                <div className="flex items-center justify-center w-full gap-2">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            size="sm" className="bg-[#AF84DD]"
                            onClick={() => { handleEditClick(action.PO) }}
                        >
                            <i className="fa-solid fa-pen text-xl text-[#020401]"></i>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Xoá">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            size="sm" className="bg-[#FF8077]"
                            onClick={() => { onOpen(); setDeleteId(action._id); }}
                        >
                            <i className="fa-solid fa-trash-can text-xl text-[#020401]"></i>
                        </Button>
                    </Tooltip>
                </div>
            ),
        },

    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRow(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const handleUnSelect = () => {
        setSelectedRowKeys([]);
        setSelectedRow([]);
    };
    const getAllPo = async () => {
        try {
            const response = await axiosAdmin.get('/pos/isDelete/false');
            const updatedPoData = response.data.map((po) => {
                return {
                    key: po?.po_id,
                    name: po?.poName,
                    description: po?.description,
                    isDeleted: po?.isDelete,
                    action: {
                        _id: po?.po_id,
                        PO: {
                            po_id: po?.po_id,
                            poName: po?.poName,
                            description: po?.description
                        }
                    }
                };
            });
            setPosListData(updatedPoData);
            console.log(response.data);
        } catch (error) {
            console.error("Error: " + error.message);
            message.error('Error fetching PO data');
        }
    };

    const handleSoftDelete = async () => {
        const data = {
            po_id: selectedRowKeys,
        };
        console.log(data)
        try {
            const response = await axiosAdmin.put('/pos/softDelete', { data: data });
            await getAllPo();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error soft deleting POs:", error);
            message.error('Error soft deleting POs');
        }
    };

    const handleSoftDeleteById = async (_id) => {
        try {
            const response = await axiosAdmin.put(`/po/${_id}/softDelete`);
            await getAllPo();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error(`Error toggling soft delete for PO with ID ${_id}:`, error);
            message.error(`Error toggling soft delete for PO with ID ${_id}`);
        }
    };

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
        getAllPo()
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
    const [newpo, setNewpo] = useState({
        poName: "",
        description: "",
        program_id: "IT",
    });
    const [editpo, setEditpo] = useState({
        po_id: "",
        poName: "",
        description: "",
        program_id: "IT",
    });

    const handleEditFormSubmit = async (values, po_id) => {
        if (!po_id) {
            console.error("No po selected for editing");
            return;
        }
        try {
            const response = await axiosAdmin.put(`/po/${po_id}`, { data: values });
            getAllPo();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error updating po:", error);
            message.error("Error updating po: " + (error.response?.data?.message || 'Internal server error'));
        }
    };
    const UnValueModalNew = {
        poName: "",
        description: "",
    }

    const handleFormSubmit = async (event) => {
        if (newpo.poName === "") {
            message.warning('Please input a new po name');
            return;
        }
        const data = {
            poName: newpo.poName,
            description: newpo.description,
            program_id: "IT"
        }
        try {
            const response = await axiosAdmin.post('/po', { data: data });
            if (response.status === 201) {
                message.success('Data saved successfully');
                setNewpo(UnValueModalNew)
                getAllPo()
            } else {
                message.error(response.data.message || 'Error saving data');
            }
        } catch (error) {
            console.error(error);
            message.error('Error saving data');
        }
    };


    const handleEditClick = (po) => {
        setEditpo(po);
        setIsEditModalOpen(true);
    };
    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };


    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
            <ConfirmAction
                onOpenChange={onOpenChange}
                isOpen={isOpen}
                onConfirm={() => {
                    if (deleteId) {
                        handleSoftDeleteById(deleteId);
                        setDeleteId(null);
                    } else if (selectedRowKeys.length > 0) {
                        handleSoftDelete();
                        setSelectedRowKeys([]);
                    }
                }}
            />
            <ModalUpdatePo
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSubmit={handleEditFormSubmit}
                editData={editpo}
                setEditData={setEditpo}
            />


            <ModalAddPo
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSubmit={handleFormSubmit}
                editData={newpo}
                setEditData={setNewpo}
                loadData={getAllPo}
            />
            <div className='w-full flex justify-between'>
                <div className='h-full my-auto p-5 hidden sm:block'>
                    {/* <div className="pb-5">
                        <h1 className="text-2xl font-bold text-[#6366F1] text-left">Danh sách PO</h1>
                    </div> */}
                    <BackButton />
                </div>
                <div className='w-full sm:w-fit bg-[white] border-slate-300 rounded-xl border-2 p-2 justify-center items-center flex gap-4 flex-col'>
                    <div className='flex justify-center w-full flex-wrap items-center gap-1'>
                        <Button

                            endContent={<PlusIcon />}
                            onClick={() => handleNavigate(
                             `/admin/management-program/po-plo`
                            )}
                        >
                            Po_Plo
                        </Button>
                        <Button
                            className='bg-[#AF84DD] '
                            endContent={<PlusIcon />}
                            onClick={handleAddClick}
                        >
                            New
                        </Button>
                        <Button
                            className='bg-[#FF8077] '
                            endContent={<PlusIcon />}
                            onClick={onOpen}
                            disabled={selectedRowKeys.length === 0}
                        >
                            Deletes
                        </Button>
                        <Button
                            endContent={<PlusIcon />}
                            onClick={() => handleNavigate(
                                `/admin/management-po/store`
                            )}
                        >
                            Store
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-5 w-full flex justify-center items-start flex-col sm:flex-col lg:flex-row xl:fex-row">
                <div className="text-2xl w-[300px] sm:w-full leading-8 italic font-bold text-[#FF9908] text-wrap flex-1 text-justify">{programData.program_id + ': ' + programData.programName}</div>
            </div>
            <div className="pl-5">
                <h1 className="text-xl font-bold text-[#6366F1] text-left">Danh sách PO</h1>
            </div>
            <div className="w-full my-5 px-5">
                {selectedRowKeys.length !== 0 && (
                    <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
                        <p className="text-sm font-medium">
                            <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
                            Đã chọn {selectedRow.length} Po
                        </p>
                        <div className="flex items-center gap-2">
                            <Tooltip
                                title="Bỏ chọn"
                                getPopupContainer={() =>
                                    document.querySelector(".Quick__Option")
                                }
                            >
                                <Button
                                    isIconOnly
                                    variant="light"
                                    radius="full"
                                    onClick={() => {
                                        handleUnSelect();
                                    }}
                                >
                                    <i className="fa-solid fa-xmark text-[18px]"></i>
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                )}
                <div className="w-full overflow-auto">
                    <Table className="min-w-[400px] sm:min-w-[400px] lg:min-w-full xl:min-w-full table-po text-[#fefefe]"
                        bordered
                        loading={loading}
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={poListData}
                    />
                </div>
            </div>
        </div>
    );
}

export default ManagePo;
function ConfirmAction(props) {
    const { isOpen, onOpenChange, onConfirm } = props;
    const handleOnOKClick = (onpose) => {
        onpose();
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    }
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.2,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                            duration: 0.1,
                            ease: "easeIn",
                        },
                    },
                }
            }}
        >
            <ModalContent>
                {(onpose) => (
                    <>
                        <ModalHeader>Cảnh báo</ModalHeader>
                        <ModalBody>
                            <p className="text-[16px]">
                                Po sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onClick={onpose}>
                                Huỷ
                            </Button>
                            <Button color="danger" className="font-medium" onClick={() => handleOnOKClick(onpose)}>
                                Xoá
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
