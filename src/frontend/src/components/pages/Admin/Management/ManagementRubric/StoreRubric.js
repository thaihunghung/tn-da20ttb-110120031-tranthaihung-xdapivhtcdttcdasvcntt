import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Tooltip, Button, message } from 'antd';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavRubric from "../../Utils/DropdownAndNav/DropdownAndNavRubric";
import Cookies from "js-cookie";
import BackButton from "../../Utils/BackButton/BackButton";
const StoreRubric = (nav) => {
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const navigate = useNavigate();
    const teacher_id = Cookies.get('teacher_id');
    if (!teacher_id) {
        navigate('/login');
    }
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const [rubicData, setRubicData] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRow(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const handleUnSelect = () => {
        setSelectedRowKeys([]);
        setSelectedRow([]);
    };
    const columns = [
        {
            title: "Tên bảng tiêu chí",
            dataIndex: "name",
            render: (record) => (
                <div className="text-sm min-w-[100px]">
                    <p className="font-medium">{record}</p>
                </div>
            ),
        },
        {
            title: (
                <div className="flex items-center justify-center w-full">
                    <span>Thao tác</span>
                </div>
            ),
            dataIndex: "action",
            render: (_id) => (
                <div className="flex items-center justify-center w-full gap-2">
                    <Tooltip title="Khôi phục">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            onClick={() => handleRestoreById(_id)}
                        >
                            <i className="fa-solid fa-clock-rotate-left"></i>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Xoá vĩnh viễn">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="full"
                            color="danger"
                            onClick={() => { onOpen(); setDeleteId(_id); }}
                        >
                            <i className="fa-solid fa-trash-can"></i>
                        </Button>
                    </Tooltip>
                </div>
            ),
        },

    ];

    const getAllRubricIsDeleteTrue = async () => {
        try {
            const response = await axiosAdmin.get(`/rubrics/checkScore?teacher_id=${teacher_id}&isDelete=true`);
            const updatedRubricData = response.data.rubric.map((rubric) => {
                const status = {
                    status: rubric.RubricItem.length === 0 ? false : true,
                    _id: rubric.rubric_id
                };
                return {
                    key: rubric.rubric_id,
                    name: rubric.rubricName,
                    status: status,
                    point: rubric.RubricItem[0]?.total_score ? rubric.RubricItem[0].total_score : 0.0,
                    action: rubric.rubric_id
                };
            });
            setRubicData(updatedRubricData);
            console.log(updatedRubricData);
        } catch (error) {
            console.error("Error: " + error.message);
            message.error('Error fetching Rubric data');
        }
    };
    
    const handleDelete = async () => {
        const data = {
            rubric_id: selectedRowKeys,
        }
        try {
            const response = await axiosAdmin.delete('/rubrics/multiple', { params: data });
            handleUnSelect();
            message.success(response.data.message);
            getAllRubricIsDeleteTrue()
        } catch (error) {
            console.error("Error soft deleting rubrics:", error);
            message.error('Error soft deleting rubrics');
        }
    };

    
    const handleDeleteById = async (_id) => {
        try {
            const response = await axiosAdmin.delete(`/rubric/${_id}`);
            handleUnSelect();
            message.success(response.data.message);
            getAllRubricIsDeleteTrue()
        } catch (error) {

            console.error(`Error toggling delete for rubric with ID ${_id}:`, error);
            message.error(`Error toggling delete for rubric with ID ${_id}`);
        }
    };

    const handleRestore = async () => {
        const data = {
            rubric_id: selectedRowKeys,
        };
        try {
            const response = await axiosAdmin.put('/rubrics/softDelete', { data });
            getAllRubricIsDeleteTrue();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error update rubrics:", error);
            message.error('Error update rubrics');
        }
    };

    const handleRestoreById = async (_id) => {
        try {
            const response = await axiosAdmin.put(`/rubric/${_id}/softDelete`);
            await getAllRubricIsDeleteTrue();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error(`Error toggling update for rubric with ID ${_id}:`, error);
            message.error(`Error toggling update for rubric with ID ${_id}`);
        }
    };

    useEffect(() => {
        getAllRubricIsDeleteTrue()
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

    return (
        <div className="flex w-full flex-col justify-center leading-8">
            <ConfirmAction
                onOpenChange={onOpenChange}
                isOpen={isOpen}
                onConfirm={() => {
                    if (deleteId) {
                        handleDeleteById(deleteId);
                        setDeleteId(null);
                    } else if (selectedRowKeys.length > 0) {
                        handleDelete();
                        setSelectedRowKeys([]);
                    }
                }}
            />
            <div className='w-full flex justify-between'>
                <div className='h-full my-auto p-5 hidden sm:block'>
                    <BackButton />
                </div>
            </div>
            <div className="p-5 px-2 sm:p-5 border-2 border-default rounded-xl bg-[#fefefe] shadow-sm">
            <div className="pl-5">
                <h1 className="text-xl font-bold text-[#6366F1] text-left">Danh sách bảng tiêu chí đã ẩn</h1>
            </div>
                <div className="w-full my-5">
                    {selectedRowKeys.length !== 0 && (
                        <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
                            <p className="text-sm font-medium">
                                <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
                                Đã chọn {selectedRow.length} rubric
                            </p>
                            <div className="flex items-center gap-2">

                                <Tooltip
                                    title={`Khôi phục ${selectedRowKeys.length} rubric`}
                                    getPopupContainer={() =>
                                        document.querySelector(".Quick__Option")
                                    }
                                >
                                    <Button isIconOnly variant="light" radius="full" onClick={() => handleRestore()}>
                                        <i className="fa-solid fa-clock-rotate-left"></i>
                                    </Button>
                                </Tooltip>
                                <Tooltip
                                    title={`Xoá vĩnh viễn ${selectedRowKeys.length} rubric`}
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
                        <Table className="table-po text-[#fefefe]"
                            bordered
                            loading={loading}
                            rowSelection={{
                                type: "checkbox",
                                ...rowSelection,
                            }}
                            columns={columns}
                            dataSource={rubicData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoreRubric;

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
                                xóa vĩnh viễn, tiếp tục thao tác?
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