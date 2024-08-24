import React, { useEffect, useState } from 'react';
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input,
    Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, Pagination,
    useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter
}
    from '@nextui-org/react';
import { Tooltip, message } from 'antd';


import { SearchIcon } from '../../../../../public/SearchIcon';
import { ChevronDownIcon } from '../../../../../public/ChevronDownIcon';
import { columns, fetchRubricData, } from './DataRubric';
import { capitalize } from '../../Utils/capitalize';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import BackButton from '../../Utils/BackButton/BackButton';
import { axiosAdmin } from '../../../../../service/AxiosAdmin';
import ModalUpdateRubric from './ModalUpdateRubric';
import CreateRubic from './CreateRubic';
import DropdownAndNavRubric from '../../Utils/DropdownAndNav/DropdownAndNavRubric';
import { PlusIcon } from '../../../../../public/PlusIcon';

const statusColorMap = {
    active: 'success',
    paused: 'danger',
    vacation: 'warning',
};

const INITIAL_VISIBLE_COLUMNS = ['name', 'point', 'Items', 'action'];
const COMPACT_VISIBLE_COLUMNS = ['name', 'Items', 'action'];

const ManagementRubric = (nav) => {
    const [rubricData, setRubricData] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [dateFilter, setDateFilter] = useState('newest');
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [deleteId, setDeleteId] = useState(null);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'age',
        direction: 'ascending',
    });
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [DataSubject, setDataSubject] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editRubric, setEditRubric] = useState({
        rubric_id: "",
        subject_id: "",
        teacher_id: "",
        rubricName: "",
        comment: "",
    });
    const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
    const handleOpenModalCreate = () => setIsOpenModalCreate(true);
    const handleCloseModalCreate = () => setIsOpenModalCreate(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { setCollapsedNav } = nav;

    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const descriptionString = searchParams.get('description');
    let descriptionURL;
    if (descriptionString) {
        try {
            const decodedDescription = decodeURIComponent(descriptionString);
            descriptionURL = decodedDescription;
            // console.log(descriptionURL); // Logging the result
        } catch (error) {
            console.error('Error processing description:', error);
        }
    }

    const teacher_id = Cookies.get('teacher_id');
    if (!teacher_id) {
        navigate('/login');
    }

    const handleEditFormSubmit = async (values, rubric_id) => {
        if (!rubric_id) {
            console.error("No rubric selected for editing");
            return;
        }
        try {
            const response = await axiosAdmin.put(`/rubric/${rubric_id}`, { data: values });
            loadRubric();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error updating rubric:", error);
            message.error("Error updating rubric: " + (error.response?.data?.message || 'Internal server error'));
        }
    };

    const getAllSubject = async () => {
        try {
            const response = await axiosAdmin.get(`/subjects/isDelete/false`);
            if (response.data) {
                setDataSubject(response.data);
            }
            console.log(response);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            message.error('Error fetching subjects');
        }
    }

    const handleNavigate = (path) => {
        navigate(path);
    };

    const getAllRubricIsDeleteFalse = async () => {
        const response = await fetchRubricData(teacher_id);
        console.log(response);
        setRubricData(response);
    };

    const [page, setPage] = useState(1);
    const pages = Math.ceil(rubricData.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);
    const headerColumns = React.useMemo(() => {
        if (visibleColumns === 'all') return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);
    const filteredItems = React.useMemo(() => {
        let filteredAssessment = [...rubricData];

        if (hasSearchFilter) {
            filteredAssessment = filteredAssessment.filter((teacher) =>
                teacher.name.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        if (dateFilter === 'newest') {
            filteredAssessment.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (dateFilter === 'oldest') {
            filteredAssessment.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        return filteredAssessment;
    }, [rubricData, filterValue, dateFilter]);
    const handleSelectionChange = (keys) => {
        // console.log('Keys:', keys);
        if (keys === 'all') {
            const startIndex = (page - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const currentPageUsers = filteredItems.slice(startIndex, endIndex).map(user => user.id.toString());
            setSelectedKeys(prevKeys => {
                const newKeys = new Set(currentPageUsers);
                // console.log('Setting new keys:', Array.from(newKeys));
                return newKeys;
            });
            return;
        }

        const keysArray = Array.isArray(keys) ? keys : Array.from(keys);
        const validKeys = keysArray.filter(key => typeof key === 'string' && !isNaN(key));
        //console.log('Valid Keys:', validKeys);
        setSelectedKeys(prevKeys => {
            const newKeys = new Set(validKeys);
            // console.log('Setting new keys:', Array.from(newKeys));
            return newKeys;
        });
    };
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);
    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const handleEditClick = (teacher) => {
        setCurrentTeacher(teacher);
        setEditRubric(teacher);
        setIsEditModalOpen(true);
    };
    const handleSoftDelete = async () => {
        console.log("handleSoftDelete called"); // Kiểm tra xem hàm có được gọi không

        // Kiểm tra giá trị của selectedKeys
        console.log("selectedKeys:", selectedKeys);

        // Đảm bảo định dạng đúng
        const data = {
            rubric_id: Array.from(selectedKeys), // Convert Set to Array
        };
        console.log("data:", data); // Kiểm tra đối tượng data

        try {
            const response = await axiosAdmin.put('/rubrics/softDelete', { data });
            console.log("response:", response); // Kiểm tra phản hồi từ API
            await getAllRubricIsDeleteFalse();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error soft deleting rubrics:", error);
            message.error('Error soft deleting rubrics');
        }
    };


    const handleSoftDeleteById = async (_id) => {
        try {
            const response = await axiosAdmin.put(`/rubric/${_id}/softDelete`);
            await getAllRubricIsDeleteFalse();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error(`Error toggling soft delete for rubric with ID ${_id}:`, error);
            message.error(`Error toggling soft delete for rubric with ID ${_id}`);
        }
    };

    const handleUnSelect = () => {
        setSelectedKeys(new Set());
    };

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue('');
        }
    }, []);

    ///////////table content
    const renderCell = React.useCallback((rubric, columnKey) => {
        const cellValue = rubric[columnKey];

        switch (columnKey) {
            case 'name':
                return (
                    <div className="flex w-fit justify-start items-center">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                    </div>
                );
            case 'Items':
                return (
                    <div className="flex w-fit justify-start items-center">
                        {/* ${rubric.status.status ? 'text-success' : 'text-danger'} */}
                        <p className={`text-bold text-small `}>
                            {/* // {rubric.status.status ? 'Active' : 'Inactive'} */}
                            {rubric.status.status ?
                                <Button
                                    className="bg-[#fefefe] shadow-sm border-1 border-[#AF84DD]"
                                    onClick={() =>
                                        handleNavigate(`/admin/management-rubric/${rubric.status.id}/rubric-items/list`)}
                                >
                                    <p>Cập nhật</p>
                                </Button>
                                :
                                <Button
                                    className="bg-[#fefefe] shadow-sm border-1 border-[#AF84DD]"
                                    onClick={() => handleNavigate(`/admin/management-rubric/${rubric.status.id}/rubric-items/list`)}
                                //disabled={!subject.chapters.checkCLo}
                                >
                                    Tạo mới
                                </Button>
                            }
                        </p>
                    </div>
                );
            case 'point':
                return (
                    <div className="flex w-fit justify-start items-center">
                        <p className="text-bold text-small">{cellValue}</p>
                    </div>
                );
            case 'createdAt':
                return (
                    <div className="flex w-fit justify-start items-center">
                        <p className="text-bold text-small">{rubric.createdAt}</p>
                    </div>
                );



            case 'action':
                //const disc = replaceCharacters(cellValue.description); // Assuming `replaceCharacters` is a function you have
                return (
                    <div className="flex w-fit justify-start items-center gap-2">
                        <Tooltip title="Chỉnh sửa">
                            <Button
                                isIconOnly className="bg-[#fefefe] shadow-sm border-3 border-[#AF84DD]"

                                onClick={() => { handleEditClick(rubric.action) }}
                            >
                                <i className="fa-solid fa-pen text-xl text-[#020401]"></i>
                            </Button>
                        </Tooltip>
                        <Tooltip title="Xoá">
                            <Button
                                isIconOnly className="bg-[#fefefe] shadow-sm border-3 border-[#FF8077]"
                                onClick={() => { onOpen(); setDeleteId(rubric.action.rubric_id); }}

                            >
                                <i className="fa-solid fa-trash-can text-xl text-[#020401]"></i>
                            </Button>
                        </Tooltip>

                        <Tooltip title="Chấm điểm">
                            <Button
                                isIconOnly className="bg-[#fefefe] shadow-sm border-3 border-[#FF9908]"

                                onClick={() => handleNavigate(
                                    `/admin/management-grading/list`
                                )}
                            >
                                <i className="fa-solid fa-feather-pointed text-xl text-[#020401]"></i>
                            </Button>
                        </Tooltip>

                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className='block sm:hidden'>
                    <h1 className="text-2xl pb-2 font-bold text-[#6366F1]">Danh sách bảng tiêu chí đánh giá</h1>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-3 items-end">
                    <Input
                        isClearable
                        classNames={{ base: 'w-full sm:max-w-[44%]', inputWrapper: 'border-1' }}
                        placeholder="Tìm kiếm theo tên..."
                        size="sm"
                        startContent={<SearchIcon className="text-default-300" />}
                        value={filterValue}
                        variant="bordered"
                        onClear={() => setFilterValue('')}
                        onValueChange={onSearchChange}
                    />
                    <div className='flex-1 flex items-center justify-start sm:justify-end'>
                        <div className='flex gap-2 h-fit justify-center sm:justify-start items-center'>
                            <Dropdown>
                                <DropdownTrigger className="sm:flex">
                                    <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                                        Cột
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Table Columns"
                                    closeOnSelect={false}
                                    selectedKeys={visibleColumns}
                                    selectionMode="multiple"
                                    onSelectionChange={setVisibleColumns}
                                >
                                    {columns.map((column) => (
                                        <DropdownItem key={column.uid} className="capitalize">
                                            {capitalize(column.name)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown>
                                <DropdownTrigger className="sm:flex">
                                    <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                                        Lọc theo ngày
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Date Filter"
                                    closeOnSelect={true}
                                    selectedKeys={new Set([dateFilter])}
                                    selectionMode="single"
                                    onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0] || 'newest';
                                        setDateFilter(selectedKey);
                                    }}
                                >
                                    <DropdownItem key="newest" className="capitalize">Mới nhất</DropdownItem>
                                    <DropdownItem key="oldest" className="capitalize">Cũ nhất</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="w-full flex  sm:items-center sm:justify-between">
                    <p className="text-small text-default-400 min-w-[100px]">
                        <span className="text-default-500">{rubricData.length}</span> Bảng tiêu chí(s)
                    </p>
                    <div className="w-fit sm:w-auto flex items-center gap-2 ">
                        <p className="text-small text-default-400">Số dòng mỗi trang:</p>
                        <select
                            className="w-fit sm:w-auto rounded-lg border-default-200 bg-default-100 text-small transition-opacity focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            onChange={onRowsPerPageChange}
                            value={rowsPerPage}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }, [filterValue, rubricData, rowsPerPage, visibleColumns, onSearchChange, onRowsPerPageChange]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <p className="text-small">
                    {selectedKeys === 'all' ? 'Đã chọn tất cả các mục' : `${selectedKeys.size} trong số ${rubricData.length} mục đã chọn`}
                </p>
                <Pagination
                    showControls
                    isCompact
                    page={page}
                    total={pages}
                    onChange={(newPage) => setPage(newPage)}
                />
            </div>
        );
    }, [page, pages, selectedKeys, rubricData]);

    ///////////useEffect
    useEffect(() => {
        //getAllAssessmentIsDeleteFalse()
        getAllSubject()
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setCollapsedNav(true);
            } else {
                setCollapsedNav(false);
            }
        };
        handleResize();
        console.log(window.innerWidth)
        const handleVisibilityChange = () => {
            if (window.innerWidth < 500) {
                setVisibleColumns(new Set(COMPACT_VISIBLE_COLUMNS)); // Thay đổi visibleColumns khi cửa sổ nhỏ
            } else {
                setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS)); // Trả lại visibleColumns khi cửa sổ lớn
            }
        }
        handleVisibilityChange();

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const loadRubric = async () => {
        const response = await fetchRubricData(teacher_id);
        console.log(response);
        setRubricData(response);
    };

    useEffect(() => {
        loadRubric();
        // console.log("rubricData loaded", rubricData);
    }, [page, rowsPerPage, filterValue]);

    return (
        <>
            <div className='w-full flex justify-between'>
                <div className='h-full my-auto p-5 hidden sm:block'>
                    <div>
                        <h1 className="text-2xl pb-2 font-bold text-[#6366F1]">Danh sách bảng tiêu chí đánh giá</h1>
                    </div>
                    <BackButton />
                </div>
                <div className='w-full sm:w-auto bg-[#fefefe] border-2 border-[#4F46E5] mb-2 shadow-sm rounded-xl p-4 flex gap-4 flex-col sm:flex-row items-center'>
                    <div className='flex flex-wrap justify-center gap-2'>
                        <Button
                            className='bg-transparent  shadow-sm border-2 border-[#AF84DD] hover:bg-[#AF84DD]'
                            endContent={<i className="fas fa-plus"></i>} // Icon thêm mới
                            onClick={handleOpenModalCreate}
                        >
                            Tạo mới
                        </Button>
                        <Button
                            className='bg-transparent shadow-sm border-2 border-[#FF8077]  hover:bg-[#FF8077]'
                            endContent={<i className="fas fa-eye-slash"></i>} // Icon ẩn nhiều
                            onClick={onOpen}
                            disabled={selectedKeys.size === 0}
                        >
                            Ẩn nhiều
                        </Button>
                        <Button
                            className='bg-transparent shadow-sm border-2 border-[#6B7280] hover:bg-[#6B7280]'
                            endContent={<i className="fas fa-archive"></i>} // Icon kho lưu trữ
                            onClick={() => handleNavigate(`/admin/management-rubric/store`)}
                        >
                            Kho lưu trữ
                        </Button>
                    </div>
                </div>
            </div>
            <Table
                aria-label="Example table with dynamic content"
                bottomContent={bottomContent}
                classNames={{
                    base: 'overflow-visible',
                    wrapper: 'min-h-[400px]',
                    table: 'overflow-visible',
                    th: 'text-small',
                }}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                // selectionMode="none"
                sortDescriptor={sortDescriptor}
                onSelectionChange={handleSelectionChange}
                onSortChange={setSortDescriptor}
                topContent={topContent}
            >

                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            // align={column.uid === 'actions' ? 'center' : 'start'}
                            align={'center'}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <ModalUpdateRubric
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSubmit={handleEditFormSubmit}
                editRubric={editRubric}
                setEditRubric={setEditRubric}
                DataSubject={DataSubject}
            />
            <CreateRubic loadData={getAllRubricIsDeleteFalse} onOpen={handleOpenModalCreate} isOpen={isOpenModalCreate} onClose={handleCloseModalCreate} />

            <ConfirmAction
                onOpenChange={onOpenChange}
                isOpen={isOpen}
                onConfirm={() => {
                    if (deleteId) {
                        handleSoftDeleteById(deleteId);
                        setDeleteId(null);
                    } else if (selectedKeys.size > 0) {
                        handleSoftDelete();
                        setSelectedKeys(new Set());
                    }
                }}
            />

        </>
    );
};

export default ManagementRubric;

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
                                Bảng tiêu chí sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
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
