
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Table, Tooltip, message } from 'antd';
import { useDisclosure, Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

import Cookies from "js-cookie";

import DropdownAndNavChapter from "../../Utils/DropdownAndNav/DropdownAndNavChapter";
import DownloadAndUpload from "../../Utils/DownloadAndUpload/DownloadAndUpload";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import Tabs from "../../Utils/Tabs/Tabs";
import BackButton from "../../Utils/BackButton/BackButton";

import ModalUpdateChapter from "./ModalUpdateChapter";
import ModalAddChapter from "./ModalAddChapter";
import { PlusIcon } from "../../../../../public/PlusIcon";

const Chapter = (nav) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const teacher_id = Cookies.get('teacher_id');
    if (!teacher_id) {
        navigate('/login');
    }
    const [Subject, setSubject] = useState({});
    const getSubjectById = async () => {
        try {
            const response = await axiosAdmin.get(`/subject/${id}`);
            console.log("response.data");
            console.log(response.data);
            setSubject(response?.data?.subject)
        } catch (error) {
            console.error("Error: " + error.message);
        }
    };
    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chapterListData, setChapterListData] = useState([]);
    const [deleteId, setDeleteId] = useState(null);
    const [lastChapterNumber, setlastChapterNumber] = useState();


    const handleNavigate = (path) => {
        navigate(path);
    };
    const columns = [
        {
            title: "Tên Chương",
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
                    <span>Thao tác</span>
                </div>
            ),
            dataIndex: "action",
            render: (action) => (
                <div className="flex items-center justify-center w-full gap-2">
                   
                    <Tooltip title="Chỉnh sửa">
                            <Button
                               isIconOnly className="bg-[#fefefe] shadow-sm border-3 border-[#AF84DD]"
                                onClick={() => { handleEditClick(action.CHAPTER) }}

                            >
                                <i className="fa-solid fa-pen text-xl text-[#020401]"></i>
                            </Button>
                    </Tooltip>
              
                    
                    
                    <Tooltip title="Xoá">
                        <Button
                       isIconOnly className="bg-[#fefefe] shadow-sm border-3 border-[#FF8077]"
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
    const getAllChapter = async (id) => {
        try {
            const response = await axiosAdmin.get(`/chapters?subject_id=${id}&isDelete=false`);
            const updatedPoData = response.data.map((chapter) => {
                return {
                    key: chapter?.chapter_id,
                    name: chapter?.chapterName,
                    description: chapter?.description,
                    isDeleted: chapter?.isDelete,
                    action: {
                        _id: chapter?.chapter_id,
                        CHAPTER: {
                            chapter_id: chapter?.chapter_id,
                            chapterName:  chapter?.chapterName,
                            description:  chapter?.description,
                            subject_id: chapter?.subject_id,
                        }
                    },
                };
            });
            setChapterListData(updatedPoData);
            if (updatedPoData.length > 0) {
                const PhanTuCuoi = updatedPoData[updatedPoData.length - 1];
                const chapterNumber = parseInt(PhanTuCuoi.name.match(/\d+$/)[0], 10);
                setlastChapterNumber(chapterNumber);
                console.log(chapterNumber);
                console.log(PhanTuCuoi);
              } else {
                setlastChapterNumber(0); // Set ploNumber to 0 if updatedPoData is empty
                console.log(0);
              }
              
              console.log(response.data);
        } catch (error) {
            console.error("Error: " + error.message);
            
        }
    };

    const handleSoftDelete = async () => {
        const data = {
            chapter_id: selectedRowKeys,
        };
        console.log(data)
        try {
            const response = await axiosAdmin.put('/chapters/softDelete', { data });
            await getAllChapter(id);
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error soft deleting POs:", error);
            message.error('Error soft deleting POs');
        }
    };

    const handleSoftDeleteById = async (_id) => {
        try {
            const response = await axiosAdmin.put(`/chapter/${_id}/softDelete`);
            await getAllChapter(id);
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error(`Error toggling soft delete for PO with ID ${_id}:`, error);
            message.error(`Error toggling soft delete for PO with ID ${_id}`);
        }
    };

    useEffect(() => {
        getAllChapter(id)
        getSubjectById()
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
    const [newChapter, setNewChapter] = useState({
        chapterName: "",
        description: "",
        subject_id: "",
    });
    const [editChapter, setEditChapter] = useState({
        chapter_id: "",
        chapterName: "",
        description: "",
        subject_id: "",
    });

    const handleEditFormSubmit = async (values, chapter_id) => {
        if (!chapter_id) {
            console.error("No chapter selected for editing");
            return;
        }
        try {
            const response = await axiosAdmin.put(`/chapter/${chapter_id}`, { data: values });
            
            message.success(response.data.message);
            getAllChapter(id);
        } catch (error) {
            console.error("Error updating chapter:", error);
            message.error("Error updating chapter: " + (error.response?.data?.message || 'Internal server error'));
        }
    };
    const UnValueModalNew = {
        chapterName: "",
        description: "",
        subject_id: id,
    }
    const handleFormSubmit = async (event) => {
        // setNewChapter(UnValueModalNew);
        // const [newChapter, setNewChapter] = useState({
        //     cloName: "",
        //     description: "",
        //     subject_id: "",
        // });

        if (newChapter.chapterName === "") {
            message.warning('Please input a new chapter Name');
            return;
        }
        const data = {
            chapterName: newChapter.chapterName,
            description: newChapter.description,
            subject_id: id,
        }
        try {
            const response = await axiosAdmin.post('/chapter', { data: data });
            if (response.status === 201) {
                message.success('Data saved successfully');
                setNewChapter(UnValueModalNew)
            } else {
                message.error(response.data.message || 'Error saving data');
            }
        } catch (error) {
            console.error(error);
            message.error('Error saving data');
        }
    };
    const handleEditClick = (clo) => {
        setEditChapter(clo);
        setIsEditModalOpen(true);
    };
    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };
    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5">
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
            <ModalUpdateChapter
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSubmit={handleEditFormSubmit}
                editData={editChapter}
                setEditData={setEditChapter}
            />


            <ModalAddChapter
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSubmit={handleFormSubmit}
                editData={newChapter}
                setEditData={setNewChapter}
                subjectCode={Subject?.subjectCode}
                lastChapterNumber = {lastChapterNumber}
            />
            <div className='w-full flex justify-between'>
                <div className='h-full my-auto p-5 hidden sm:block'>
                    <BackButton />
                </div>
                {/* <div className='w-full sm:w-fit bg-[white] border-slate-300 rounded-xl border-2 p-2 justify-center items-center flex gap-4 flex-col'>
                    <div className='flex justify-center w-full flex-wrap items-center gap-1'>
                        <Button

                            endContent={<PlusIcon />}
                            onClick={() => handleNavigate(
                                `/admin/management-subject/${id}/chapter-clo`
                            )}
                        >
                            Clo chapter
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
                                `/admin/management-subject/${id}/Chapter/store`
                            )}
                        >
                            Store
                        </Button>
                    </div>
                </div> */}


                <div className='w-full sm:w-auto bg-[#fefefe] border-2 border-[#4F46E5] mb-2 shadow-sm rounded-xl p-4 flex gap-4 flex-col sm:flex-row items-center'>
                    <div className='flex flex-wrap justify-center gap-2'>
                        <Button
                            className='bg-transparent  shadow-sm border-2 border-[#FF9908] hover:bg-[#FF9908]'
                            endContent={<PlusIcon />}
                            onClick={() => handleNavigate(
                                `/admin/management-subject/${id}/chapter-clo`
                            )}
                        >
                            Chapter_Clo
                        </Button>
                        <Button
                            className='bg-transparent  shadow-sm border-2 border-[#AF84DD] hover:bg-[#AF84DD]'
                            endContent={<i className="fas fa-plus"></i>} // Icon thêm mới
                            onClick={handleAddClick}
                        >
                            Tạo mới
                        </Button>
                        <Button
                            className='bg-transparent shadow-sm border-2 border-[#FF8077]  hover:bg-[#FF8077]'
                            endContent={<i className="fas fa-eye-slash"></i>} // Icon ẩn nhiều
                            onClick={onOpen}
                            disabled={selectedRowKeys.length === 0}
                        >
                            Ẩn nhiều
                        </Button>
                        <Button
                            className='bg-transparent shadow-sm border-2 border-[#6B7280] hover:bg-[#6B7280]'
                            endContent={<i className="fas fa-archive"></i>} // Icon kho lưu trữ
                            onClick={() => handleNavigate(`/admin/management-subject/${id}/Chapter/store`)}
                        >
                            Kho lưu trữ
                        </Button>
                    </div>
                </div>
            </div>


            <div className="p-5 px-2 sm:p-5 border-2 border-default rounded-xl bg-[#fefefe] shadow-sm">

            
            <div className="p-5 w-full flex justify-center items-start flex-col sm:flex-col lg:flex-row xl:fex-row">
                <div className="text-2xl w-[300px] sm:w-full leading-8 italic font-bold text-[#FF9908] text-wrap flex-1 text-justify">{Subject.subjectCode + ': ' + Subject.subjectName}</div>
            </div>
            <div className="pl-5">
                <h1 className="text-xl font-bold text-[#6366F1] text-left">Danh sách Chapter</h1>
            </div>

            <div className="w-full my-5 px-5">
                {selectedRowKeys.length !== 0 && (
                    <div className="Quick__Option flex justify-between items-center sticky top-2 bg-[white] z-50 w-full p-4 py-3 border-1 border-slate-300">
                        <p className="text-sm font-medium">
                            <i className="fa-solid fa-circle-check mr-3 text-emerald-500"></i>{" "}
                            Đã chọn {selectedRow.length} chapter
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
                <div className="w-full h-fit overflow-auto">
                    <Table className="table-po min-w-[500px] sm:min-w-[500px] lg:min-w-full xl:min-w-full table-auto text-[#fefefe]"
                        bordered
                        loading={loading}
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={chapterListData}
                    />
                </div>
            </div>
            </div>
            {/* <Tabs tabs=
                {[
                    {
                        title: 'Cập nhật',
                        content:
                            <DownloadAndUpload props={props} handleDownload={handleDownloadChapter} handleOnChangeTextName={handleOnChangeTextName} endpoint={'chapter/update'} current={current} LoadData={getAllChapter} Data={parseInt(id)} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                    }
                ]}
                activeTab={activeTab} setActiveTab={setActiveTab}
            /> */}
        </div>
    );
}


export default Chapter;
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
                                Chapter sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
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