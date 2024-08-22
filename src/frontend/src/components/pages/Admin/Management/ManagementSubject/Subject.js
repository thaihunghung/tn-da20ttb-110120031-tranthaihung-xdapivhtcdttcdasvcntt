import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
} from '@nextui-org/react';
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Tooltip, message } from 'antd';
import slugify from 'slugify';


import { SearchIcon } from '../../../../../public/SearchIcon';
import { ChevronDownIcon } from '../../../../../public/ChevronDownIcon';
import { columns, fetchSujectDataGrading, statusOptions } from './data/DataSubject';
import { capitalize } from '../../Utils/capitalize';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import BackButton from '../../Utils/BackButton/BackButton';
import { axiosAdmin } from '../../../../../service/AxiosAdmin';
import ModalUpdateSubject from './ModalUpdateSubject';
import ModalAddSubject from './ModalAddSubject';
import { PlusIcon } from '../../../../../public/PlusIcon';
import ModalOpenExcelSubject from './ModalOpenExcelSubject';

const INITIAL_VISIBLE_COLUMNS = ['name', 'subjectCode','description', 'Clo', 'Chapter', 'action'];
const COMPACT_VISIBLE_COLUMNS = ['name', 'Clo', 'Chapter', 'action'];

const Subject = (nav) => {
  const { setCollapsedNav } = nav;
  const navigate = useNavigate();
  const teacher_id = Cookies.get('teacher_id');
  if (!teacher_id) {
    navigate('/login');
  }
  const location = useLocation();
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
  const [dateFilter, setDateFilter] = useState('newest');
  const [Subjects, setSubjects] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [classes, setClasses] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState('all');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [deleteId, setDeleteId] = useState(null);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'age',
    direction: 'ascending',
  });
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRubric, setNewRubric] = useState({
    teacher_id: teacher_id,
    subjectName: "",
    subjectCode: "",
    description: "",
    numberCredits: "",
    numberCreditsTheory: "",
    numberCreditsPractice: "",
    typesubject: "",
  });

  useEffect(() => {
    //getAllAssessmentIsDeleteFalse()
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsedNav(true);
      } else {
        setCollapsedNav(false);
      }
    };
    handleResize();

    const handleVisibilityChange = () => {
      if (window.innerWidth < 500) {
        setVisibleColumns(new Set(COMPACT_VISIBLE_COLUMNS)); // Thay đổi visibleColumns khi cửa sổ nhỏ
      } else {
        setVisibleColumns(new Set(INITIAL_VISIBLE_COLUMNS)); // Trả lại visibleColumns khi cửa sổ lớn
      }
    }
    handleVisibilityChange();
    console.log(window.innerWidth)


    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const loadSubjects = async () => {
    const response = await fetchSujectDataGrading();
    setSubjects(response);
  };

  useEffect(() => {
    loadSubjects();
  }, [page, rowsPerPage, filterValue]);

  const pages = Math.ceil(Subjects.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredSubject = [...Subjects];

    if (hasSearchFilter) {
      filteredSubject = filteredSubject.filter((subject) =>
        subject.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filteredSubject = filteredSubject.filter((subject) =>
        subject.typesubject === statusFilter
      );
    }

    if (dateFilter === 'newest') {
      filteredSubject.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (dateFilter === 'oldest') {
      filteredSubject.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return filteredSubject;
  }, [Subjects, filterValue, statusFilter, dateFilter]);

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

  const handleNavigate = (path) => {
    navigate(path);
  };
  const handleSoftDelete = async () => {
    const data = {
      subject_id: Array.from(selectedKeys),
    };
    console.log(data)
    try {
      const response = await axiosAdmin.put('/subjects/softDelete', { data });
      loadSubjects();
      //handleUnSelect();
      message.success(response.data.message);
    } catch (error) {
      console.error("Error soft deleting subjects:", error);
      message.error('Error soft deleting subjects');
    }
  };
  const handleSoftDeleteById = async (_id) => {
    try {
      const response = await axiosAdmin.put(`/subject/${_id}/softDelete`);

      loadSubjects();
      // handleUnSelect();
      message.success(response.data.message);
    } catch (error) {
      console.error(`Error toggling soft delete for subject with ID ${_id}:`, error);
      message.error(`Error toggling soft delete for subject with ID ${_id}`);
    }
  };


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRubric, setEditRubric] = useState({
    subject_id: "",
    subjectName: "",
    subjectCode: "",
    description: "",
    numberCredits: "",
    numberCreditsTheory: "",
    numberCreditsPractice: "",
    typesubject: "",
  });
  const handleEditFormSubmit = async (values, subject_id) => {
    if (!subject_id) {
      console.error("No subject selected for editing");
      return;
    }
    try {
      const response = await axiosAdmin.put(`/subject/${subject_id}`, { data: values });
      loadSubjects();
      message.success(response.data.message);
    } catch (error) {
      console.error("Error updating subject:", error);
      message.error("Error updating subject: " + (error.response?.data?.message || 'Internal server error'));
    }
  };
  const handleEditClick = (teacher) => {
    setEditRubric(teacher);
    setIsEditModalOpen(true);
  };



  const UnValueModalNew = {
    teacher_id: teacher_id,
    subjectName: "",
    subjectCode: "",
    description: "",
    numberCredits: "",
    numberCreditsTheory: "",
    numberCreditsPractice: "",
    typesubject: "",
  }
  const handleFormSubmit = async (event) => {
    // setNewRubric(UnValueModalNew);

    if (newRubric.typesubject === "") {
      message.warning('Please select a type of subject');
      return;
    }
    try {
      const data = {
        subjectName: newRubric.subjectName,
        teacher_id: teacher_id,
        subjectCode: newRubric.subjectCode,
        description: newRubric.description,
        numberCredits: parseInt(newRubric.numberCredits),
        numberCreditsTheory: parseInt(newRubric.numberCreditsTheory),
        numberCreditsPractice: parseInt(newRubric.numberCreditsPractice),
        typesubject: newRubric.typesubject
      }

      const response = await axiosAdmin.post('/subject', { data: data });
      if (response.status === 201) {
        message.success('Data saved successfully');
        setNewRubric(UnValueModalNew)
        loadSubjects()
      } else {
        message.error(response.data.message || 'Error saving data');
      }
    } catch (error) {
      console.error(error);
      message.error('Error saving data');
    }
  };
  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const renderCell = React.useCallback((subject, columnKey) => {
    const cellValue = subject[columnKey];

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex justify-start items-center">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case 'name':
        return (
          <div className="flex min-w-[150px] justify-start items-center">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case 'subjectCode':
        return (
          <div className="flex w-fit justify-start items-center">
            <p className="text-bold text-small text-justify">{cellValue}</p>
          </div>
        );
        case 'description':
          return (
            <div className="flex w-fit justify-start items-center">
              <p className="text-bold text-small text-justify">{cellValue}</p>
            </div>
          );


        
      case 'Clo':
        return (
          <div className='flex w-fit justify-start items-center'>
            {subject.clos.check ? (
              <>
                <Button

                  className="bg-[#fefefe] shadow-sm border-1 border-[#AF84DD] hidden sm:block"
                  onClick={() => navigate(`/admin/management-subject/${subject.clos.id}/clo/update`)}
                >
                  <span >
                    Cập nhật
                  </span>

                </Button>

                <Tooltip title="Cập nhật">
                  <Button
                    isIconOnly
                    className="bg-[#fefefe] shadow-sm border-1 border-[#AF84DD] block sm:hidden"
                    onClick={() => navigate(`/admin/management-subject/${subject.clos.id}/clo/update`)}
                  >
                    <i className="fa-solid fa-bars"></i>
                  </Button>
                </Tooltip>
              </>
            ) : (


              <>
                <Button
                  className="bg-[#fefefe] shadow-sm border-1 border-[#AF84DD] hidden sm:block"
                  onClick={() => navigate(`/admin/management-subject/${subject.clos.id}/clo/create`)}
                >
                  Tạo mới
                </Button>

                <Tooltip title="Tạo mới">
                  <Button
                    isIconOnly
                    className="bg-[#fefefe] shadow-sm border-1 border-[#AF84DD] block sm:hidden"
                    onClick={() => navigate(`/admin/management-subject/${subject.clos.id}/clo/create`)}
                  >
                    <i className="fa-solid fa-bars"></i>
                  </Button>
                </Tooltip>
              </>

            )}
          </div>
        );
      case 'Chapter':
        return (
          <div className='flex w-fit justify-start items-center'>
            {subject.chapters.checkChapter ? (
              <>
                <Button
                  className="bg-[#fefefe] shadow-sm border-1 border-[#AF84DD] hidden sm:block"
                  onClick={() => navigate(`/admin/management-subject/${subject.chapters.id}/chapter/update`)}
                  disabled={!subject.chapters.checkCLo}
                >
                  Cập nhật
                </Button>


                <Tooltip title="Cập nhật">
                  <Button
                    isIconOnly
                    className="bg-[#fefefe] shadow-sm border-1 border-[#AF84DD] block sm:hidden"
                  // onClick={() => { handleEditClick(rubric.action) }}
                  >
                    <i className="fa-solid fa-bars"></i>
                  </Button>
                </Tooltip>
              </>

            ) : (
              <>
                <Button
                  className="bg-[#fefefe] shadow-sm border-1 border-[#AF84DD] hidden sm:block"
                  onClick={() => navigate(`/admin/management-subject/${subject.chapters.id}/chapter/create`)}
                  disabled={!subject.chapters.checkCLo}
                >
                  Tạo mới
                </Button>

                <Tooltip title="Tạo mới">
                  <Button
                    isIconOnly
                    className="bg-[#fefefe] shadow-sm border-1 border-[#AF84DD] block sm:hidden"
                  // onClick={() => { handleEditClick(rubric.action) }}
                  >
                    <i className="fa-solid fa-bars"></i>
                  </Button>
                </Tooltip>
              </>
            )}
          </div>
        );
      case 'numberCreditsTheory':
        return (
          <div className="flex w-fit justify-start items-center">
            <p className="text-bold text-small capitalize">{subject.numberCreditsTheory}</p>
          </div>
        );
      case 'numberCreditsPractice':
        return (
          <div className="flex w-fit justify-start items-center">
            <p className="text-bold text-small capitalize">{subject.numberCreditsPractice}</p>
          </div>
        );
      case 'typesubject':
        return (
          <div className="flex w-fit justify-start items-center">
            <p className="text-bold text-small capitalize">{subject.typesubject}</p>
          </div>
        );
      case 'createdAt':
        return (
          <div className="flex w-fit justify-start items-center">
            <p className="text-bold text-small capitalize">{subject.createdAt}</p>
          </div>
        );
      case 'action':
        return (
          <div className="flex w-fit justify-start items-center gap-2">
            <Tooltip title="Chỉnh sửa">
              <Button
                isIconOnly className="bg-[#fefefe] shadow-sm border-3 border-[#AF84DD]"
                onClick={() => { handleEditClick(subject.Subject) }}
              >
                <i className="fa-solid fa-pen text-xl sm:text-base"></i>
              </Button>
            </Tooltip>
            <Tooltip title="Xoá">
              <Button
                isIconOnly className="bg-[#fefefe] shadow-sm border-3 border-[#FF8077]"
                onClick={() => { onOpen(); setDeleteId(subject.action); }}
              >
                <i className="fa-solid fa-trash-can  text-xl sm:text-base"></i>
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

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

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className='block sm:hidden'>
          <h1 className="text-2xl pb-2 font-bold text-[#6366F1]">Danh sách Học phần</h1>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{ base: 'w-full  sm:max-w-[44%]', inputWrapper: 'border-1' }}
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
                    Lọc theo loại
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Status Filter"
                  closeOnSelect={true}
                  selectedKeys={new Set([statusFilter === 'all' ? 'all' : statusFilter])}
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] || 'all';
                    setStatusFilter(selectedKey);
                  }}
                >
                  <DropdownItem key="all" className="capitalize">Tất cả loại</DropdownItem>
                  {statusOptions.map((option) => (
                    <DropdownItem key={option.id} className="capitalize">
                      {option.name}
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
            <span className="text-default-500">{Subjects.length}</span> Học phần(s)
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
  }, [filterValue, Subjects, rowsPerPage, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <p className="text-small">
          {selectedKeys === 'all' ? 'Đã chọn tất cả các mục' : `${selectedKeys.size} trong số ${Subjects.length} mục đã chọn`}
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
  }, [page, pages, selectedKeys, Subjects]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const handleExcelClick = () => {
    setIsExcelModalOpen(true);
};
  return (
    <>
      <div className='w-full flex justify-between items-center'>
        <div className='h-full my-auto p-5 hidden sm:block'>
          <div>
            <h1 className="text-2xl pb-2 font-bold text-[#4F46E5]">Danh sách Học phần</h1>
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
              onClick={() => handleNavigate(`/admin/management-subject/store`)}
            >
              Kho lưu trữ
            </Button>
            <Button
              className='bg-transparent border-2 border-[#FF9908]  hover:bg-[#FF9908]'
              endContent={<i className="fas fa-file-excel"></i>} // Icon Excel
              onClick={handleExcelClick} 
            >
              Nhập dữ liệu Excel
            </Button>
          </div>
        </div>
      </div>

      <ModalOpenExcelSubject                
                isOpen={isExcelModalOpen}
                onOpenChange={setIsExcelModalOpen}
            />
      <Table
        aria-label="Example table with dynamic content"
        bottomContent={bottomContent}
        classNames={{
          base: 'overflow-visible',
          wrapper: 'min-h-[400px]',
          table: 'overflow-visible',
          th: 'text-small',
        }}
        color={"primary"}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
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
      <ModalUpdateSubject
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditFormSubmit}
        editRubric={editRubric}
        setEditRubric={setEditRubric}
      />
      <ModalAddSubject
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleFormSubmit}
        newRubric={newRubric}
        setNewRubric={setNewRubric}
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
};

export default Subject;

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
                Subject sẽ được chuyển vào <Chip radius="sm" className="bg-zinc-200"><i class="fa-solid fa-trash-can-arrow-up mr-2"></i>Kho lưu trữ</Chip> và có thể khôi phục lại, tiếp tục thao tác?
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