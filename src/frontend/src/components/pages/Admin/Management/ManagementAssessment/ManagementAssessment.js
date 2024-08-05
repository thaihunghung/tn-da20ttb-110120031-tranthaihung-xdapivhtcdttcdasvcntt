import React, { useCallback, useEffect, useState } from 'react';
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem,
  Pagination, useDisclosure, Tooltip
} from '@nextui-org/react';
import { message, Flex, Progress } from 'antd';
import { PlusIcon, SearchIcon, ChevronDownIcon } from '../../../../../public/Icon/Icon';
import { columns, fetchAssessmentData } from './Data/DataAssessment';
import { capitalize } from '../../Utils/capitalize';

import BackButton from '../../Utils/BackButton/BackButton';
import { axiosAdmin } from '../../../../../service/AxiosAdmin';
import ModalCreateAssessment from './Modal/ModalCreateAssessment';
import ModalUpdateAssessment from './Modal/ModalUpdateAssessment';
import ModalOpenPdf from './Modal/ModalOpenPdf';
import ModalAllot from './Modal/ModalAllot';
import { UseNavigate, UseTeacherAuth, UseTeacherId } from '../../../../../hooks';
import { ModalConfirmAction } from './Modal/ModalConfirmAction';
import { handleReplaceCharacters } from '../../Utils/Utils';
import ModalManamentAllot from './Modal/ModalManamentAllot';
import ModalUpdateAllot from './Modal/ModalUpdateAllot';

const INITIAL_VISIBLE_COLUMNS = ['generalDescription', 'status', 'courseName', 'Phân công', 'action'];
const COMPACT_VISIBLE_COLUMNS = ['generalDescription', 'status', 'Phân công', 'action'];
const TextConfirm = 'Assessment sẽ được chuyển vào Kho lưu trữ và có thể khôi phục lại, tiếp tục thao tác?'

const ManagementAssessment = ({ setCollapsedNav }) => {
  UseTeacherAuth();
  const teacher_id = UseTeacherId();
  const handleNavigate = UseNavigate();

  const [assessments, setAssessment] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [GeneralDescription, setGeneralDescription] = useState('');

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddModalOpenPDF, setIsAddModalOpenPDF] = useState(false);
  const [isModalallot, setIsModalallot] = useState(false);
  const [isModalUpdateAllot, setIsModalUpdateAllot] = useState(false);

  const [editPDF, setEditPDF] = useState({});
  const [DataRubricPDF, setRubicDataPDF] = useState({});
  const [DataRubricItems, setDataRubricItems] = useState([]);
  const [DataCourse, setCourseByTeacher] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAllotManageMentModalOpen, setIsAllotManageMentModalOpen] = useState(false);

  const [editRubric, setEditRubric] = useState({
    course_id: '',
    rubric_id: '',
    generalDescription: '',
    place: '',
    date: ''
  });
  const [oldDescription, setOldDescription] = useState('')
  const [filterRubicData, setfilterRubicData] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({column: 'age', direction: 'ascending',});
  const [dateFilter, setDateFilter] = useState('newest');
  const [page, setPage] = useState(1);
  const pages = Math.ceil(assessments.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);
  const filteredItems = React.useMemo(() => {
    let filteredAssessment = [...assessments];

    if (hasSearchFilter) {
      filteredAssessment = filteredAssessment.filter((teacher) =>
        teacher.courseName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (dateFilter === 'newest') {
      filteredAssessment.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (dateFilter === 'oldest') {
      filteredAssessment.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    return filteredAssessment;
  }, [assessments, filterValue, dateFilter, hasSearchFilter]);
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
  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <p className="text-small">
          {selectedKeys === 'all' ? 'All items selected' : `${selectedKeys.size} of ${assessments.length} selected`}
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
  const [deleteId, setDeleteId] = useState(null);
  const renderCell = React.useCallback((assessment, columnKey) => {
    const cellValue = assessment[columnKey];
  
    switch (columnKey) {
      case 'generalDescription':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{assessment.description}</p> */}
          </div>
        );
      case 'courseName':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{assessment.courseName}</p>
          </div>
        );
      case 'Phân công':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
            <Tooltip content={!assessment.statusAllot? 'Tạo mới': 'Cập nhật'}>

           
            <Button
              color="primary"
              variant="ghost"
              onClick={() => {
                if (!assessment.statusAllot) {
                  handleAllotClick(assessment.generalDescription);
                } else {
                  handleUpdateAllotClick(assessment.generalDescription);
                }
              }}
            >
              <p>Phân công</p>
            </Button>
            </Tooltip>
            </p>
          </div>
        );
      case 'assessmentCount':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{assessment.description}</p> */}
          </div>
        );
      case 'studentCount':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {/* <p className="text-bold text-tiny capitalize text-default-500">{assessment.description}</p> */}
          </div>
        );
      case 'status':
        return (
          <div className="flex flex-col">
            <div className="text-sm min-w-[100px]">
              <Flex vertical gap="middle">
                <Progress
                  percent={cellValue}
                  status="active"
                  strokeColor={{
                    from: '#108ee9',
                    to: '#87d068',
                  }}
                />
              </Flex>
            </div>
          </div>
        );
      case 'action':
        const disc = handleReplaceCharacters(cellValue);
        return (
          <div className="flex items-center justify-center w-full gap-2">
            <Tooltip content={!assessment.statusAllot?'Phân công trước tiên': 'Chấm điểm'}>
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                disabled={!assessment.statusAllot}
                className='bg-[#FF9908]'
                onClick={() => handleNavigate(
                  `/admin/management-grading/${disc}/?description=${cellValue}`
                )}
              >
                <i className="fa-solid fa-feather-pointed text-xl text-[#020401]"></i>
              </Button>
            </Tooltip>
            <Tooltip content="In phiếu chấm">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                className='bg-[#FEFEFE]'
                onClick={() => { handleAddClickPDF(assessment?.RubicData, assessment?.RubicItemsData) }}
              >
                <i className="fa-regular fa-file-pdf text-xl text-[#020401]"></i>
              </Button>
            </Tooltip>
            <Tooltip content="Chỉnh sửa">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                className="bg-[#AF84DD]"
                onClick={() => { handleEditClick(assessment?.metaAssessment, assessment?.generalDescription) }}
              >
                <i className="fa-solid fa-pen text-xl text-[#020401]"></i>
              </Button>
            </Tooltip>
            <Tooltip content="Xoá">
              <Button
                className="bg-[#FF8077]"
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                onClick={() => { onOpen(); setDeleteId(assessment?.action); }}
              >
                <i className="fa-solid fa-trash-can text-xl text-[#020401]"></i>
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, [handleNavigate, onOpen, setDeleteId]);
  
  const getAllRubricIsDeleteFalse = useCallback(async () => {
    try {
      const response = await axiosAdmin.get(`/rubrics/checkScore?teacher_id=${teacher_id}&isDelete=false`);
      const updatedRubricData = response?.data?.rubric?.map((rubric) => {
        const status = {
          status: rubric?.RubricItem?.length === 0 ? false : true,
          _id: rubric?.rubric_id
        };
        return {
          rubric_id: rubric?.rubric_id,
          rubricName: rubric?.rubricName,
          status: status,
          point: rubric?.RubricItem[0]?.total_score ? rubric?.RubricItem[0]?.total_score : 0.0,
          action: rubric?.rubric_id
        };
      });
      setfilterRubicData(updatedRubricData);
      console.log(updatedRubricData);
    } catch (error) {
      console.error("Error fetching Rubric data:", error.message);
      // message.error('Error fetching Rubric data');
    }
  }, [teacher_id]); 

  useEffect(() => {
    getAllRubricIsDeleteFalse()
    //getCourseByTeacher()
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
  }, [getAllRubricIsDeleteFalse, setCollapsedNav]);

  const loadAssessment = useCallback(async () => {
    try {
      const response = await fetchAssessmentData(teacher_id);
      console.log("response",response);
      setAssessment(response);
    } catch (error) {
      console.error("Error loading assessments:", error);
    }
  }, [teacher_id]); 
  
  useEffect(() => {
    loadAssessment();
  }, [loadAssessment, page, rowsPerPage, filterValue, teacher_id]);


//////////////////////////////////////////////////////////////////////////
////   handle
//////////////////////////////////////////////////////////////////////////
  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };
  const handleOpenManagementAllotClick = () => {
    setIsAllotManageMentModalOpen(true);
  };
  const handleAddClickPDF = (DataRubricPDF, DataRubricItems) => {
    setRubicDataPDF(DataRubricPDF)
    setDataRubricItems(DataRubricItems)
    setIsAddModalOpenPDF(true);
  };
  const handleEditFormSubmit = async () => {
    console.log("GeneralDescription:", oldDescription)

    console.log("GeneralDescription", editRubric)
    if (editRubric.generalDescription.includes('/')) {
      message.error("GeneralDescription cannot contain '/' character.");
      return;
    }


    try {
      await axiosAdmin.patch('/meta-assessments/updateByGeneralDescription', {
        GeneralDescription: oldDescription,
        updateData: editRubric
      });
      loadAssessment();
      message.success('Assessment updated successfully');
    } catch (error) {
      console.error("Error updating GeneralDescription:", error);
      message.error("Error updating GeneralDescription: " + (error.response?.data?.message || 'Internal server error'));
    }
  };
  const handleEditClick = (Assessment, generalDescription) => {
    console.log("assessment", Assessment);
    console.log("generalDescription", generalDescription);
    setEditRubric(Assessment);
    setOldDescription(generalDescription)
    setIsEditModalOpen(true);
  };
  const handleAllotClick = (generalDescription) => {
    setGeneralDescription(generalDescription)
    setIsModalallot(true);
  };
  const handleUpdateAllotClick = (generalDescription) => {
    setGeneralDescription(generalDescription)
    setIsModalUpdateAllot(true);
  };
  const handleSoftDeleteByDescription = async (description) => {
    const data = {
      GeneralDescriptions: [description],
      isDelete: true
    }
    try {
      await axiosAdmin.patch('/meta-assessments/softDeleteByGeneralDescription', data);
      message.success(`Successfully toggled soft delete for MetaAssessments`);
      loadAssessment();
    } catch (error) {
      console.error(`Error toggling soft delete for MetaAssessments`, error);
      message.error(`Error toggling soft delete for MetaAssessments: ${error.response?.data?.message || 'Internal server error'}`);
    }
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className='block sm:hidden'>
          <h1 className="text-2xl pb-2 font-bold text-[#6366F1]">Danh sách Assessments</h1>
        </div>
        <div className="flex justify-between gap-3 items-center">
          <Input
            isClearable
            classNames={{ base: 'w-full sm:max-w-[44%]', inputWrapper: 'border-1' }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue('')}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            {/* <Button
              className='bg-[#AF84DD] '
              endContent={<PlusIcon />}
              onClick={() => handleNavigate(
                `/admin/management-grading/create`
              )}
            >
              Tạo mới
            </Button> */}
            {/* <Tooltip
            title=""
            getPopupContainer={() =>
              document.querySelector(".Quick__Option")
            }
          >
            <Button
              className="flex justify-center items-center p-4"
              isIconOnly
              variant="light"
              radius="full"
              onClick={()=>{
                //getSelectedItems
                //console.log('Option selected',());
                
                navigateGradingGroup(ValidKeys)
              }
              
              }
            >
              <span className="text-[#475569] text-lg font-bold">Chấm theo nhóm</span>
            </Button>
          </Tooltip> */}
          </div>
        </div>
        <div className="w-full flex  sm:items-center sm:justify-between">
          <p className="text-small text-default-400 min-w-[100px]">
            <span className="text-default-500">{assessments.length}</span> assessment(s)
          </p>
          <div className="w-fit sm:w-auto flex items-center gap-2 ">
            <p className="text-small text-default-400">Rows per page:</p>
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
  }, [filterValue, assessments, rowsPerPage, onSearchChange, onRowsPerPageChange]);
  return (
    <>
      <ModalCreateAssessment
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        load={loadAssessment}
      />
      <ModalOpenPdf
        isOpen={isAddModalOpenPDF}
        onOpenChange={setIsAddModalOpenPDF}
        editRubric={editPDF}
        DataRubric={DataRubricPDF}
        DataRubricItems={DataRubricItems}
      />
      <ModalUpdateAssessment
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditFormSubmit}
        editRubric={editRubric}
        setEditRubric={setEditRubric}
        DataCourse={DataCourse}
        filterRubicData={filterRubicData}
      />
      <ModalConfirmAction
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        text = {TextConfirm}
        onConfirm={() => {
          if (deleteId) {
            handleSoftDeleteByDescription(deleteId);
            setDeleteId(null);
          }
        }}
      />
      <ModalManamentAllot
        isOpen={isAllotManageMentModalOpen}
        onOpenChange={setIsAllotManageMentModalOpen}
        metaAssessment={assessments}
      />
      <ModalAllot
        isOpen={isModalallot}
        onOpenChange={setIsModalallot}
        generalDescription={GeneralDescription}
        loadData={loadAssessment}
        assessments={assessments}
      />
      <ModalUpdateAllot
        isOpen={isModalUpdateAllot} 
        onOpenChange={setIsModalUpdateAllot}
        generalDescription={GeneralDescription}
        loadData={loadAssessment}
        assessments={assessments}
      />

      <div className='w-full flex justify-between'>
        <div className='h-full my-auto p-5 hidden sm:block'>
          <div>
            <h1 className="text-2xl pb-2 font-bold text-[#6366F1]">Danh sách Assessments</h1>
          </div>
          <BackButton path={'/admin'}/>
        </div>
        <div className='w-full sm:w-fit bg-[white] border-slate-300 rounded-xl border-2 p-2 justify-start items-center flex gap-4 flex-col mb-4'>
          <div className='flex justify-center w-full flex-wrap items-center gap-1'>
            <Button
              className='bg-[#AF84DD] '
              endContent={<PlusIcon />}
              onClick={handleAddClick}
            >
              Tạo mới
            </Button>

            <Button
              endContent={<PlusIcon />}
              onClick={() => handleNavigate(
                `/admin/management-grading/store`
              )}
            >
              Kho lưu trữ
            </Button>
            <Tooltip content="phân công">
              <Button
                endContent={<PlusIcon />}
                className="bg-[#AF84DD]"
                onClick={() => { 
                  handleOpenManagementAllotClick()
                 }}
              >
                Phân công
              </Button>
            </Tooltip>
          </div>

          <div className='flex gap-2 h-fit justify-center sm:justify-start flex-wrap items-center'>
            <div className='flex gap-1 h-fit justify-start'>
              <Dropdown>
                <DropdownTrigger className="sm:flex">
                  <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                    Columns
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
                  {columns?.map((column) => (
                    <DropdownItem key={column.uid} className="capitalize">
                      {capitalize(column.name)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownTrigger className="sm:flex">
                  <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                    Filter Date
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
                  <DropdownItem key="newest" className="capitalize">Newest</DropdownItem>
                  <DropdownItem key="oldest" className="capitalize">Oldest</DropdownItem>
                </DropdownMenu>
              </Dropdown>

            </div>
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
        //selectionMode="multiple"
        selectionMode="none"
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
    </>
  );
};
export default ManagementAssessment;





