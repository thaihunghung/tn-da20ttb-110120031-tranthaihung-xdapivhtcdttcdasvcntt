
import { useEffect, useState } from "react";
import "./Plo.css"
import { Table, Tooltip, message } from 'antd';
import { useDisclosure, Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavPlo from "../../Utils/DropdownAndNav/DropdownAndNavPlo";
import DownloadAndUpload from "../../Utils/DownloadAndUpload/DownloadAndUpload";
import Tabs from "../../Utils/Tabs/Tabs";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ModalUpdatePlo from "./ModalUpdatePlo";
import ModalAddPlo from "./ModalAddPlo";

import BackButton from "../../Utils/BackButton/BackButton";
import { PlusIcon } from "../../../../../public/PlusIcon";

const ManagePlo = (nav) => {
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
    const [activeTab, setActiveTab] = useState(0);
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [poListData, setPosListData] = useState([]);
    const [current, setCurrent] = useState(0);
    const [deleteId, setDeleteId] = useState(null);
    const [fileList, setFileList] = useState([]);

    const handleOnChangeTextName = (nameP) => {
        setCurrent(nameP);
    };

    const columns = [
        {
            title: "Mã CDR CT",
            dataIndex: "name",
            render: (record) => (
                <div className="text-sm min-w-[80px]">
                    <p className="font-medium">{record}</p>
                </div>
            ),
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            render: (record) => (
                <div className="text-sm min-w-[220px]">
                    <p className="font-medium">{record}</p>
                </div>
            ),
        },
        {
            title: (
                <div className="flex items-center justify-center w-full min-w-[150px] max-w-[200px]">
                    <span>Thao tác</span>
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
                            onClick={() => { handleEditClick(action.PLO) }}
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

    const getAllPlo = async () => {
        try {
            const response = await axiosAdmin.get('/plos/isDelete/false');
            const updatedPoData = response.data.map((plo) => {
                return {
                    key: plo.plo_id,
                    name: plo.ploName,
                    description: plo.description,
                    isDeleted: plo.isDelete,
                    action: {
                        _id: plo.plo_id,
                        PLO: {
                            plo_id: plo?.plo_id,
                            ploName: plo?.ploName,
                            description: plo?.description
                        }
                    },

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
            plo_id: selectedRowKeys,
        };
        console.log(data)
        try {
            const response = await axiosAdmin.put('/plos/softDelete', { data: data });
            await getAllPlo();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error soft deleting POs:", error);
            message.error('Error soft deleting POs');
        }
    };

    const handleSoftDeleteById = async (_id) => {
        try {
            const response = await axiosAdmin.put(`/plo/${_id}/softDelete`);
            await getAllPlo();
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
        getAllPlo()
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
    const [newPlo, setNewPlo] = useState({
        ploName: "",
        description: "",

    });
    const [editPlo, setEditPlo] = useState({
        plo_id: "",
        ploName: "",
        description: "",
    });

    const handleEditFormSubmit = async (values, plo_id) => {
        if (!plo_id) {
            console.error("No plo selected for editing");
            return;
        }
        try {
            const response = await axiosAdmin.put(`/plo/${plo_id}`, { data: values });
            getAllPlo();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error updating plo:", error);
            message.error("Error updating plo: " + (error.response?.data?.message || 'Internal server error'));
        }
    };
    const UnValueModalNew = {
        ploName: "",
        description: "",
    }
    const handleFormSubmit = async (event) => {

        if (newPlo.ploName === "") {
            message.warning('Please input a new clo name');
            return;
        }
        const data = {
            ploName: newPlo.ploName,
            description: newPlo.description,
            program_id: 'IT'
        }
        try {
            const response = await axiosAdmin.post('/plo', { data: data });
            if (response.status === 201) {
                message.success('Data saved successfully');
                setNewPlo(UnValueModalNew)
                getAllPlo()
            } else {
                message.error(response.data.message || 'Error saving data');
            }
        } catch (error) {
            console.error(error);
            message.error('Error saving data');
        }
    };
    const handleEditClick = (plo) => {
        setEditPlo(plo);
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
            <ModalUpdatePlo
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSubmit={handleEditFormSubmit}
                editData={editPlo}
                setEditData={setEditPlo}
            />
            <ModalAddPlo
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSubmit={handleFormSubmit}
                editData={newPlo}
                setEditData={setNewPlo}
                loadData={getAllPlo}
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
                            Tạo mới
                        </Button>
                        <Button
                            className='bg-[#FF8077] '
                            endContent={<PlusIcon />}
                            onClick={onOpen}
                            disabled={selectedRowKeys.length === 0}
                        >
                            Ẩn nhiều
                        </Button>
                        <Button
                            endContent={<PlusIcon />}
                            onClick={() => handleNavigate(
                                `/admin/management-plo/store`
                            )}
                        >
                            Kho lưu trữ
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-5 w-full flex justify-center items-start flex-col sm:flex-col lg:flex-row xl:fex-row">
                <div className="text-2xl w-[300px] sm:w-full leading-8 italic font-bold text-[#FF9908] text-wrap flex-1 text-justify">{programData.program_id + ': ' + programData.programName}</div>
            </div>
            <div className="pl-5">
                <h1 className="text-xl font-bold text-[#6366F1] text-left">Danh sách chuẩn đầu ra CT</h1>
            </div>
            <div className="w-full my-5 px-5">
                {selectedRowKeys.length !== 0 && (
                    <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
                        <p className="text-sm font-medium">
                            <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
                            Đã chọn {selectedRow.length} CDR
                        </p>
                        <div className="flex items-center gap-2">

                            <Tooltip
                                title={`Xoá ${selectedRowKeys.length} plo`}
                                getPopupContainer={() =>
                                    document.querySelector(".Quick__Option")
                                }
                            >
                                <Button isIconOnly variant="light" radius="full" onClick={onOpen}>
                                    <i className="fa-solid fa-trash-can"></i>
                                </Button>
                            </Tooltip>
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
                    <Table className="table-po min-w-[400px] sm:min-w-[400px] lg:min-w-full xl:min-w-full text-[#fefefe]"
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


export default ManagePlo;
function ConfirmAction(props) {
    const { isOpen, onOpenChange, onConfirm } = props;
    const handleOnOKClick = (onClose) => {
        onClose();
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
                {(onClose) => (
                    <>
                        <ModalHeader>Cảnh báo</ModalHeader>
                        <ModalBody>
                            <p className="text-[16px]">
                                Plo sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onClick={onClose}>
                                Huỷ
                            </Button>
                            <Button color="danger" className="font-medium" onClick={() => handleOnOKClick(onClose)}>
                                Xoá
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
