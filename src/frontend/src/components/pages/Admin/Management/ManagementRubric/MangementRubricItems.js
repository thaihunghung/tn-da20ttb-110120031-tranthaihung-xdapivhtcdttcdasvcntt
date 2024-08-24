// MangementRubricItems.js

import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Tooltip, message } from 'antd';
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input,
    Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Pagination,
} from '@nextui-org/react';
import { Modal, Chip, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { PlusIcon, ChevronDownIcon } from "../../../../../public/Icon/Icon";

import { capitalize } from '../../Utils/capitalize';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import Cookies from "js-cookie";

import { columns, fetchRubricItemsData } from "./DataRubricItems";
import CreateRubicItems from "./CreateRubicItems";
import BackButton from "../../Utils/BackButton/BackButton";
import ModalUpdateRubicItems from "./ModalUpdateRubicItems";

const INITIAL_VISIBLE_COLUMNS = ['Plo', 'Clo', 'Chapter', 'description', 'maxScore', 'action'];
const COMPACT_VISIBLE_COLUMNS = ['description', 'action'];

const MangementRubricItems = ({ setCollapsedNav, successNoti, errorNoti }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const teacher_id = Cookies.get('teacher_id');
    if (!teacher_id) {
        navigate('/login');
    }
    const [assessments, setRubricItems] = useState([]);
    const [CloData, setCloData] = useState([]);
    const [PloData, setPloData] = useState([]);
    const [DataAddClo, setDataAddClo] = useState([]);
    const [ChapterData, setChapterData] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rubicItemsData, setRubicItemsData] = useState([]);

    const [cloFilter, setCloFilter] = useState('');
    const [ploFilter, setPloFilter] = useState('');
    const [chapterFilter, setChapterFilter] = useState('');


    const [cloId, setCloId] = useState('');
    const [chapterId, setChapterId] = useState('');
    const [ploId, setPloId] = useState('');
    const [Score, setScore] = useState('');
    const [filterValue, setFilterValue] = useState('');

    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'age',
        direction: 'ascending',
    });
    const [deleteId, setDeleteId] = useState(null);

    const [rubicData, setRubicData] = useState({});
    const [page, setPage] = useState(1);
    const pages = Math.ceil(assessments.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editRubric, setEditRubric] = useState({
        rubricsItem_id: "",
        chapter_id: "",
        clo_id: "",
        rubric_id: "",
        plo_id: "",
        description: "",
        maxScore: "",
        stt: "",
    });
    const [NewRubicItem, setNewRubicItem] = useState({
        chapter_id: "",
        clo_id: "",
        rubric_id: parseInt(id),
        plo_id: "",
        description: "",
        maxScore: "",
    });
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRow(selectedRows);
            setSelectedRowKeys(selectedRowKeys);
        },
    };
    const handleFormSubmit = async (event) => {
        const data = {
            maxScore: parseFloat(NewRubicItem.maxScore),
            data: NewRubicItem
        };
        if (!NewRubicItem.clo_id || !NewRubicItem.plo_id || !NewRubicItem.chapter_id || !NewRubicItem.maxScore) {
            message.error("Vui lòng chọn đầy đủ các trường.");
            return;
        }
        try {
            const response = await axiosAdmin.post('/rubric-item/checkScore', { data });
            if (response.status === 201) {
                message.success("Rubric item created successfully!");
                loadRubric()
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 400) {
                    message.error(`Failed to create rubric item: ${data.message}`);
                } else {
                    // Xử lý các mã lỗi khác nếu cần
                    message.error(`Error creating rubric item: ${data.message || error.message}`);
                }
            } else {
                // Xử lý lỗi không phải từ phản hồi (ví dụ: lỗi mạng)
                message.error(`Error creating rubric item: ${error.message}`);
            }
        }
    };
    const handleEditFormSubmit = async (values, rubric_item_id, convertedContent) => {
        console.log("editRubric");
        const data = {
            rubricsItem_id: values.rubricsItem_id,
            chapter_id: values.chapter_id,
            clo_id: values.clo_id,
            rubric_id: values.rubric_id,
            plo_id: values.plo_id,
            description: convertedContent,
            maxScore: values.maxScore,
            stt: values.stt,
        }

        if (!rubric_item_id) {
            console.error("No rubric_item selected for editing");
            return;
        }
        try {
            await axiosAdmin.put(`/rubric-item/${rubric_item_id}`, { data: data });
            message.success('Rubric item update successfully');
            loadRubric();
        } catch (error) {
            console.error("Error updating teacher:", error);
            if (error.response && error.response.data && error.response.data.message) {
                errorNoti(error.response.data.message);
            } else {
                errorNoti("Error updating teacher");
            }
        }
    };
    const handleEditClick = (rubricitems, chapters, plos) => {
        console.log('handleEditClick');
        // console.log(chapters);
        // console.log(plos);
        setPloData(plos)
        setChapterData(chapters)
        setEditRubric(rubricitems);
        setCloId(rubricitems.clo_id);
        setChapterId(rubricitems.chapter_id);
        setPloId(rubricitems.plo_id);
        setScore(rubricitems.maxScore);
        setIsEditModalOpen(true);
    };
    const handleAddClick = () => {
        setIsAddModalOpen(true);
    };
    const handleNavigate = (path) => {
        navigate(path);
    };
    const loadRubric = async () => {
        const { updatedRubricData, DataCLOArray, RubricData } = await fetchRubricItemsData(id);
        setRubricItems(updatedRubricData);
        setCloData(DataCLOArray);
        setRubicData(RubricData);
    };
    const LoadRubricById = async () => {
        try {
            console.log("response.data");
            const response = await axiosAdmin.get(`/rubric/${id}`);

            console.log(response.data);
            console.log("clo_ids");
            if (response.status === 200) {
                const clo_ids = await axiosAdmin.get(`/subject/${response.data.subject_id}?include_clos=true`);
                console.log(clo_ids);
                setDataAddClo(clo_ids?.data?.clos)
            }

        } catch (error) { }
    }
    const handleUnSelect = () => {
        setSelectedKeys(new Set());
    };
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
    const handleSoftDelete = async () => {
        const data = {
            rubricsitem_id: Array.from(selectedKeys),
        };
        console.log('Setting new keys:', data);
        try {
            const response = await axiosAdmin.put('/rubric-items/softDelete', { data });
            await loadRubric();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error("Error soft deleting rubricsitems:", error);
            message.error('Error soft deleting rubricsitems');
        }
    };
    const handleSoftDeleteById = async (_id) => {
        try {
            const response = await axiosAdmin.put(`/rubric-item/${_id}/softDelete`);
            await loadRubric();
            handleUnSelect();
            message.success(response.data.message);
        } catch (error) {
            console.error(`Error toggling soft delete for rubricsitem with ID ${_id}:`, error);
            message.error(`Error toggling soft delete for rubricsitem with ID ${_id}`);
        }
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
    const handleCloFilterChange = (keys) => {
        console.log('Selected CLO:', keys);
        setCloFilter(keys[0]); // Assuming single selection
    };

    useEffect(() => {
        LoadRubricById()
        //getAllAssessmentIsDeleteFalse()
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
    useEffect(() => {
        loadRubric();
        // console.log("assessments loaded", assessments);
    }, [page, rowsPerPage, filterValue]);

    ///////////table content
    const renderCell = React.useCallback((rubric, columnKey) => {
        const cellValue = rubric[columnKey];

        switch (columnKey) {
            case 'description':
                return (
                    <div className="flex flex-col text-bold text-justify text-small capitalize min-w-[300px] max-w-[400px]"
                        dangerouslySetInnerHTML={{ __html: cellValue }}>
                    </div>
                );
            case 'Plo':
                return (
                    <div className="flex flex-col items-start justify-start text-justify max-w-[150px]">
                        <p className="text-bold font-bold text-small capitalize">{rubric.ploName.ploName}</p>
                        <p className="text-bold text-small capitalize">{rubric.ploName.description}</p>
                    </div>
                );
            case 'Clo':
                return (
                    <div className="flex flex-col items-start justify-start text-justify max-w-[150px]">
                        <p className="text-bold font-bold text-small capitalize">{rubric.cloName.cloName}</p>
                        <p className="text-bold text-small capitalize">{rubric.cloName.description}</p>
                    </div>
                );
            case 'Chapter':

                return (
                    <div className="flex flex-col items-start justify-start text-justify max-w-[150px]">
                        <p className="text-bold font-bold text-small capitalize">{rubric.chapterName.chapterName}</p>
                        <p className="text-bold text-small capitalize">{rubric.chapterName.description}</p>
                    </div>
                );
            case 'PloName':
                return (
                    <div className="flex flex-col items-start justify-start text-justify max-w-[150px]">
                        <p className="text-bold font-bold text-small capitalize">{rubric.ploName.ploName}</p>
                    </div>
                );
            case 'CloName':
                return (
                    <div className="flex flex-col items-start justify-start text-justify max-w-[150px]">
                        <p className="text-bold font-bold text-small capitalize">{rubric.cloName.cloName}</p>
                    </div>
                );
            case 'ChapterName':
                return (
                    <div className="flex flex-col items-start justify-start text-justify max-w-[150px]">
                        <p className="text-bold font-bold text-small capitalize">{rubric.chapterName.chapterName}</p>
                    </div>
                );
            case 'maxScore':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                    </div>
                );

            case 'action':
                return (
                    <div className="flex items-center justify-center w-full gap-2">
                        <Tooltip title="Chỉnh sửa">
                            <Button
                                   isIconOnly className="bg-[#fefefe] shadow-sm border-3 border-[#AF84DD]"                
                                onClick={() => {
                                    handleEditClick(rubric.rubricsItem, rubric.chapters, rubric.plos)
                                }}
                            // onClick={() => handleNavigate(
                            //     `/admin/management-rubric/${id}/rubric-items/${rubric.action.id}`
                            // )}
                            >
                                <i className="fa-solid fa-pen text-xl text-[#020401]"></i>
                            </Button>
                        </Tooltip>
                        <Tooltip title="Xoá">
                            <Button
                                isIconOnly className="bg-[#fefefe] shadow-sm border-3 border-[#FF8077]"
                                onClick={() => { onOpen(); setDeleteId(rubric.action.id); }}
                            >
                                <i className="fa-solid fa-trash-can text-xl text-[#020401]"></i>
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);
    const uniqueSortedCloNames = useMemo(() => {
        const cloNameSet = new Set();
        assessments.forEach(item => cloNameSet.add(item.cloName.cloName));
        const uniqueCloNamesArray = Array.from(cloNameSet);

        // Hàm so sánh tùy chỉnh để sắp xếp theo phần số cuối
        uniqueCloNamesArray.sort((a, b) => {
            const numA = parseInt(a.match(/\d+$/));
            const numB = parseInt(b.match(/\d+$/));
            return numA - numB;
        });

        return uniqueCloNamesArray;
    }, [assessments]);

    const uniqueSortedPloNames = useMemo(() => {
        const ploNameSet = new Set();
        assessments.forEach(item => ploNameSet.add(item.ploName.ploName));
        const uniquePloNamesArray = Array.from(ploNameSet);

        // Hàm so sánh tùy chỉnh để sắp xếp theo phần số cuối
        uniquePloNamesArray.sort((a, b) => {
            const numA = parseInt(a.match(/\d+$/));
            const numB = parseInt(b.match(/\d+$/));
            return numA - numB;
        });

        return uniquePloNamesArray;
    }, [assessments]);

    const uniqueSortedChapterNames = useMemo(() => {
        const chapterNameSet = new Set();
        assessments.forEach(item => chapterNameSet.add(item.chapterName.chapterName));
        const uniqueChapterNamesArray = Array.from(chapterNameSet);

        // Hàm so sánh tùy chỉnh để sắp xếp theo phần số cuối
        uniqueChapterNamesArray.sort((a, b) => {
            const numA = parseInt(a.match(/\d+$/));
            const numB = parseInt(b.match(/\d+$/));
            return numA - numB;
        });

        return uniqueChapterNamesArray;
    }, [assessments]);
    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className='block sm:hidden'>
                    <h1 className="text-2xl pb-2 font-bold text-[#6366F1]">Danh sách Rubric items</h1>
                </div>
                <div className="flex justify-between gap-3 items-center">
                    <div className='flex-1 flex items-center justify-start sm:justify-end'>
                        <div className='flex gap-2 h-fit flex-wrap justify-center sm:justify-start items-center'>

                            <Dropdown>
                                <DropdownTrigger className="sm:flex">
                                    <Button endContent={<ChevronDownIcon className="font-semibold" />} size="sm" variant="flat">
                                        <span className="font-medium">Cột</span>
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
                                        <DropdownItem key={column.uid} className="capitalize text-base">
                                            {capitalize(column.name)}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>

                            <Dropdown>
                                <DropdownTrigger className="sm:flex">
                                    <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                                        Lọc theo CĐR HP
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Filter by CLO"
                                    closeOnSelect={true}
                                    selectedKeys={new Set([cloFilter])} // Chuyển đổi cloFilter thành Set
                                    selectionMode="single"
                                    onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0] || ''; // Đảm bảo chọn giá trị rỗng nếu không có lựa chọn
                                        setCloFilter(selectedKey);
                                    }}
                                >
                                    <DropdownItem key="" className="capitalize">
                                        All
                                    </DropdownItem>
                                    {uniqueSortedCloNames.map((cloName) => (
                                        <DropdownItem key={cloName} className="capitalize">
                                            {cloName}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>

                            <Dropdown>
                                <DropdownTrigger className="sm:flex">
                                    <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                                        Lọc theo CĐR CT
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Filter by PLO"
                                    closeOnSelect={true}
                                    selectedKeys={new Set([ploFilter])} // Chuyển đổi ploFilter thành Set
                                    selectionMode="single"
                                    onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0] || ''; // Đảm bảo chọn giá trị rỗng nếu không có lựa chọn
                                        setPloFilter(selectedKey);
                                    }}
                                >
                                    <DropdownItem key="" className="capitalize">
                                        All PLOs
                                    </DropdownItem>
                                    {uniqueSortedPloNames.map((ploName) => (
                                        <DropdownItem key={ploName} className="capitalize">
                                            {ploName}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown>
                                <DropdownTrigger className="sm:flex">
                                    <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                                        Lọc theo Chương HP
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Filter by Chapter"
                                    closeOnSelect={true}
                                    selectedKeys={new Set([chapterFilter])} // Chuyển đổi chapterFilter thành Set
                                    selectionMode="single"
                                    onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0] || ''; // Đảm bảo chọn giá trị rỗng nếu không có lựa chọn
                                        setChapterFilter(selectedKey);
                                    }}
                                >
                                    <DropdownItem key="" className="capitalize">
                                        All Chapters
                                    </DropdownItem>
                                    {uniqueSortedChapterNames.map((chapterName) => (
                                        <DropdownItem key={chapterName} className="capitalize">
                                            {chapterName}
                                        </DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
                <div className="w-full flex  sm:items-center sm:justify-between">
                    <p className="text-small text-default-400 min-w-[100px]">
                        <span className="text-default-500">{assessments.length}</span> Tiêu chí ĐG(s)
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
    }, [filterValue, assessments, rowsPerPage, visibleColumns, onSearchChange, onRowsPerPageChange]);
    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <p className="text-small">
                    {selectedKeys === 'all' ? 'Đã chọn tất cả các mục' : `${selectedKeys.size} trong số ${assessments.length} mục đã chọn`}
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
    }, [page, pages, selectedKeys, assessments]);
    const headerColumns = React.useMemo(() => {
        if (visibleColumns === 'all') return columns;
        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredAssessment = [...assessments];

        if (hasSearchFilter) {
            filteredAssessment = filteredAssessment.filter((teacher) =>
                teacher.description.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (cloFilter && cloFilter !== '') {
            filteredAssessment = filteredAssessment.filter(item =>
                item.cloName.cloName === cloFilter
            );
        }
        if (ploFilter && ploFilter !== '') {
            filteredAssessment = filteredAssessment.filter(item =>
                item.ploName.ploName === ploFilter
            );
        }
        if (chapterFilter && chapterFilter !== '') {
            filteredAssessment = filteredAssessment.filter(item =>
                item.chapterName.chapterName === chapterFilter
            );
        }
        return filteredAssessment;
    }, [assessments, filterValue, cloFilter, ploFilter, chapterFilter]);







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

    return (
        <>
            <div className='w-full flex justify-between'>
                <div className='h-full my-auto p-5 hidden sm:block'>
                    <div>
                        <h1 className="text-2xl pb-2 font-bold text-[#6366F1]">Danh sách tiêu chí ĐG</h1>
                    </div>
                    <BackButton />
                </div>
                <div className='w-full sm:w-auto bg-[#fefefe] border-2 border-[#4F46E5] mb-2 shadow-sm rounded-xl p-4 flex gap-4 flex-col sm:flex-row items-center'>
                    <div className='flex flex-wrap justify-center gap-2'>
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
                            disabled={selectedKeys.size === 0}
                        >
                            Ẩn nhiều
                        </Button>
                        <Button
                            className='bg-transparent shadow-sm border-2 border-[#6B7280] hover:bg-[#6B7280]'
                            endContent={<i className="fas fa-archive"></i>} // Icon kho lưu trữ
                            onClick={() => handleNavigate(`/admin/management-rubric/${id}/rubric-items/store`)}
                        >
                            Kho lưu trữ
                        </Button>
                        <Button
                            className='bg-transparent border-2 border-[#FF9908]  hover:bg-[#FF9908]'
                            endContent={<i className="fas fa-file-excel"></i>} // Icon Excel
                            onClick={() => handleNavigate(
                                `/admin/management-rubric/${id}/rubric-items/template`
                            )}
                        >
                            Xem tổng quan
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-5 w-full flex justify-center items-start flex-col">
                <div className="text-lg w-[300px] sm:w-full leading-8 italic font-bold text-[#FF9908] text-wrap flex-1 text-justify">Tên học phần:{' ' + rubicData.rubricName}</div>
                <div className="text-lg w-[300px] sm:w-full leading-8 italic font-bold text-[#FF9908] text-wrap flex-1 text-justify">Tên bảng TC:{' ' + rubicData.subjectName}</div>
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
            <ModalUpdateRubicItems
                isOpen={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                onSubmit={handleEditFormSubmit}
                editRubric={editRubric}
                setEditRubric={setEditRubric}
                CloData={CloData}
                ChapterData={ChapterData}
                PloData={PloData}
                //DataSubject={DataSubject}
                cloId={cloId}
                chapterId={chapterId}
                ploId={ploId}
                setCloId={setCloId}
                setChapterId={setChapterId}
                setPloId={setPloId}
                Score={Score}
            />
            <CreateRubicItems
                isOpen={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSubmit={handleFormSubmit}
                NewRubicItem={NewRubicItem}
                setNewRubicItem={setNewRubicItem}
                CloData={DataAddClo}
            />
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
}

export default MangementRubricItems;

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
                                Rubric items sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
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

