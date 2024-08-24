// StoreRubicItems.js

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Table, Tooltip, Button, message } from 'antd';
import { Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavRubricItems from "../../Utils/DropdownAndNav/DropdownAndNavRubricItems";
import BackButton from "../../Utils/BackButton/BackButton";

const StoreRubicItems = (nav) => {
    const { id } = useParams();
    const { setCollapsedNav} = nav;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const [rubicItemsData, setRubicItemsData] = useState([]);
    const [rubicData, setRubicData] = useState({});

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
            title: "Tên CLO",
            dataIndex: "cloName",
            render: (record) => (
                <Tooltip color={"#FF9908"}
                    title={record.description}>
                    <div className="text-sm min-w-[100px]">
                        <p className="font-medium">{record.cloName}</p>
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Tên PLO",
            dataIndex: "ploName",
            render: (record) => (
                <div className="text-sm min-w-[100px]">
                    <Tooltip color={"#FF9908"}
                        title={record.description}>
                        <p className="font-medium">{record.ploName}</p>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: "Tên Chapter",
            dataIndex: "chapterName",
            render: (record) => (
                <div className="text-sm min-w-[100px]">
                    <Tooltip color={"#FF9908"}
                        title={record.description}>
                        <p className="font-medium">{record.chapterName}</p>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: "Điểm",
            dataIndex: "score",
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

    const GetRubicAndItemsById = async () => {
        try {
            const response = await axiosAdmin.get(`/rubric/${id}/items?isDelete=true`);
            const rubric = response.data?.rubric || {};
    
            const RubricData = {
                rubricName: rubric?.rubricName || 'Unknown',
                subjectName: rubric?.subject?.subjectName || 'Unknown',
            };
            console.log(RubricData);
    
            const updatedRubricData = rubric?.rubricItems?.map((item) => {
                const clo = {
                    cloName: item?.CLO?.cloName || 'Unknown',
                    description: item?.CLO?.description || 'No description',
                };
                const plo = {
                    ploName: item?.PLO?.ploName || 'Unknown',
                    description: item?.PLO?.description || 'No description',
                };
                const chapter = {
                    chapterName: item?.Chapter?.chapterName || 'Unknown',
                    description: item?.Chapter?.description || 'No description',
                };
                return {
                    key: item?.rubricsItem_id || 'Unknown',
                    cloName: clo,
                    ploName: plo,
                    chapterName: chapter,
                    score: item.score,
                    action: item?.rubricsItem_id || 'Unknown',
                };
            }) || [];
    
            setRubicItemsData(updatedRubricData);
            setRubicData(RubricData);
        } catch (error) {
            console.error("Error: " + error.message);
            message.error('Error fetching Rubric data');
        }
    };
    const handleRestore = async () => {
        const data = {
            rubricsitem_id: selectedRowKeys,
        };
        try {
            const response = await axiosAdmin.put('/rubric-items/softDelete', { data });
            await GetRubicAndItemsById();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error soft deleting rubricsitems:", error);
            message.error('Error soft deleting rubricsitems');
        }
    };

    const handleRestoreById = async (_id) => {
        try {
            const response = await axiosAdmin.put(`/rubric-item/${_id}/softDelete`);
            await GetRubicAndItemsById();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error(`Error toggling soft delete for rubricsitem with ID ${_id}:`, error);
            message.error(`Error toggling soft delete for rubricsitem with ID ${_id}`);
        }
    };

    const handleDelete = async () => {
        const data = {
            rubricsitem_id: selectedRowKeys,
        }
        try {
            const response = await axiosAdmin.delete('/rubric-items/multiple', { params: data });
            handleUnSelect();
            message.success(response.data.message);
            GetRubicAndItemsById()
        } catch (error) {
            console.error("Error soft deleting rubric-items:", error);
            message.error('Error soft deleting rubric-items');
        }
    };

    
    const handleDeleteById = async (_id) => {
        try {
            const response = await axiosAdmin.delete(`/rubric-item/${_id}`);
            handleUnSelect();
            message.success(response.data.message);
            GetRubicAndItemsById()
        } catch (error) {
            console.error(`Error toggling delete for rubric-item with ID ${_id}:`, error);
            message.error(`Error toggling delete for rubric-item with ID ${_id}`);
        }
    };
    useEffect(() => {
        GetRubicAndItemsById()
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
        <div className="flex w-full flex-col justify-center leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7 bg-[#f5f5f5]-500">
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
            <div className="my-5 pl-5 flex justify-center items-start flex-col">
                <div className="text-lg leading-8 italic font-bold text-[#FF9908] flex-1 text-justify">Tên học phần:{' '+rubicData.rubricName}</div>
                <div className="text-lg  leading-8 italic font-bold text-[#FF9908]  flex-1 text-justify">Tên rubric:{' '+rubicData.subjectName}</div>
            </div>
            <div className="pl-5">
                <h1 className="text-xl font-bold text-[#6366F1] text-left">Danh sách tiêu chí đã ẩn</h1>
            </div>
            <div className="w-full">
                {selectedRowKeys.length !== 0 && (
                    <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
                        <p className="text-sm font-medium">
                            <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
                            Đã chọn {selectedRow.length} rubric items
                        </p>
                        <div className="flex items-center gap-2">

                        <Tooltip
                                title={`Khôi phục ${selectedRowKeys.length} rubric items`}
                                getPopupContainer={() =>
                                    document.querySelector(".Quick__Option")
                                }
                            >
                                <Button isIconOnly variant="light" radius="full" onClick={() => handleRestore()}>
                                    <i className="fa-solid fa-clock-rotate-left"></i>
                                </Button>
                            </Tooltip>
                            <Tooltip
                                title={`Xoá vĩnh viễn ${selectedRowKeys.length} rubric items`}
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
                        dataSource={rubicItemsData}
                    />
                </div>
            </div>
            </div>
        </div>
    );
}

export default StoreRubicItems;

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