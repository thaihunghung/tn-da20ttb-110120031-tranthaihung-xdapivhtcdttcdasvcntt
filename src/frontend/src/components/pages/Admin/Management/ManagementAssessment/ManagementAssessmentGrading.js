import React, { useEffect, useMemo, useState } from 'react';
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
  Tooltip
} from '@nextui-org/react';
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { message } from 'antd';

import { PlusIcon } from '../../../../../public/PlusIcon';

import { SearchIcon } from '../../../../../public/SearchIcon';
import { ChevronDownIcon } from '../../../../../public/ChevronDownIcon';
import { columns, fetchAssessmentDataGrading, fetchDataCheckTeacherAllot, fetchStudentDataByCourseId, statusOptions } from './Data/DataAssessmentGrading';
import { capitalize } from '../../Utils/Utils';
import BackButton from '../../Utils/BackButton/BackButton';
import { axiosAdmin } from '../../../../../service/AxiosAdmin';
import ModalCreateOneAssessment from './Modal/ModalCreateOneAssessment';
import CustomUpload from '../../CustomUpload/CustomUpload';
import { UseDescriptionFromURL, UseNavigate, UseTeacherAuth, UseTeacherId } from '../../../../../hooks';
import { handleReplaceCharacters } from '../../Utils/handleReplaceCharacters';
import ModalUpdateDisc from './Modal/ModalUpdateDisc';
import ModalOpenPdfOneStudent from './Modal/ModalOpenPdfOneStudent';
import ModalOpenPdfMutiStudent from './Modal/ModalOpenPdfMutiStudent';

const statusColorMap = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
};
const INITIAL_VISIBLE_COLUMNS = ['totalScore', 'action', 'class', 'student', 'description'];
const COMPACT_VISIBLE_COLUMNS = ['student', 'action', 'description'];

const ManagementAssessmentGrading = ({ setCollapsedNav }) => {
  UseTeacherAuth();
  const descriptionURL = UseDescriptionFromURL();
  const teacher_id = UseTeacherId();
  const handleNavigate = UseNavigate();

  const [CurrentTeacher, setCurrentTeacher] = useState(false);
  const [AllAssessment, setAllAssessment] = useState({});
  const [AllMutiAssessment, setAllMutiAssessment] = useState({});



  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [assessments, setAssessment] = useState([]);
  const [StudentAll, setStudentAll] = useState([]);
  const [classes, setClasses] = useState([]);
  const [RubricArray, setRubricArray] = useState([]);
  const [CourseArray, setCourseArray] = useState([]);
  const [Couse_id, setCouse_id] = useState();
  const [rubric_id, setRubric_id] = useState();
  const [isUpdateDiscModalOpen, setIsUpdateDiscModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editRubric, setEditRubric] = useState({
    teacher_id: "",
    course_id: "",
    rubric_id: "",
    generalDescription: "",
    description: "",
    student_id: "",
    place: "",
    date: "",
  });


  const [filterDescription, setDescriptionFilter] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [filterClass, setClassFilter] = useState('all');
  const [filterStatus, setStatusFilter] = useState(null);

  const hasSearchFilter = Boolean(filterValue);


  const [page, setPage] = useState(1);
  const [fileList, setFileList] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const pages = Math.ceil(assessments.length / rowsPerPage);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [sortDescriptor, setSortDescriptor] = useState({ column: 'age', direction: 'ascending', });

  const [isAddModalOpenOnePDF, setIsAddModalOpenOnePDF] = useState(false);
  const [isAddModalOpenMutiPDF, setIsAddModalOpenMutiPDF] = useState(false);


  const loadStudentAllCourse = async (Couse_id) => {
    try {
      const response = await fetchStudentDataByCourseId(Couse_id);
      // console.log("loadStudentAllCourse", response);
      setStudentAll(response);

    } catch (error) {
      console.error("Error loading student data:", error);
    }
  };
  const LoadData = React.useCallback(async () => {
    try {
      const { metaAssessment, Rubric_id, Course_id, Classes, RubricArray, CourseArray } = await fetchAssessmentDataGrading(teacher_id, descriptionURL, filterValue);
      setAssessment(metaAssessment);
      setRubric_id(Rubric_id);
      setCouse_id(Course_id);
      setClasses(Classes);
      setRubricArray(RubricArray);
      setCourseArray(CourseArray);
      if (parseInt(metaAssessment[0]?.teacher_id) === parseInt(teacher_id)) {
        setCurrentTeacher(true)
      }
    } catch (error) {
      console.error("Error loading assessment data:", error);
    }
  }, [teacher_id, descriptionURL, filterValue]);
  useEffect(() => {
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
    //console.log(window.innerWidth)
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setCollapsedNav]);
  useEffect(() => {
    LoadData();
  }, [LoadData, page, rowsPerPage, filterValue, teacher_id]);
  useEffect(() => {
    const checkTeacherExistence = async () => {
      try {
        const meta_assessment_id = assessments[0]?.meta_assessment_id;
        const exist = await fetchDataCheckTeacherAllot(teacher_id, meta_assessment_id);
        if (exist.exists) {
          //message.success("Teacher exists in the assessment.");
        } else {
          message.error("Teacher does not exist in the assessment.");
          handleNavigate('/admin/management-grading')
        }
      } catch (error) {
        console.error("Error checking teacher existence:", error.message);
      }
    };
    if (teacher_id && assessments[0]?.id)
      checkTeacherExistence();

  }, [assessments, teacher_id, handleNavigate]);
  useEffect(() => {
    loadStudentAllCourse(Couse_id);
  }, [Couse_id]);
  useEffect(() => {
    if (Array.isArray(StudentAll) && Array.isArray(assessments)) {
      const filtered = StudentAll.filter(student =>
        !assessments.some(assessment => assessment.student.student_id === student.student_id)
      );
      // console.log("filtered")
      //console.log(filtered)
      setFilteredStudents(filtered);
    }
  }, [StudentAll, assessments]);
  useEffect(() => {
    if (assessments) {
      setEditRubric((prev) => ({
        ...prev,
        generalDescription: assessments[0]?.action?.generalDescription,
      }));
      setEditRubric((prev) => ({
        ...prev,
        date: assessments[0]?.action?.date,
      }));
      setEditRubric((prev) => ({
        ...prev,
        place: assessments[0]?.action?.place,
      }));
      setEditRubric((prev) => ({
        ...prev,
        rubric_id: assessments[0]?.action?.rubric_id,
      }));
      setEditRubric((prev) => ({
        ...prev,
        course_id: assessments[0]?.action?.course_id,
      }));
      setEditRubric((prev) => ({
        ...prev,
        teacher_id: assessments[0]?.action?.teacher_id,
      }));
    }
  }, [assessments]);

  useEffect(() => {
    // console.log("assessments?.teacher_id")
    // console.log(assessments[0]?.teacher_id)
    // console.log(teacher_id)
    if (parseInt(assessments[0]?.teacher_id) === parseInt(teacher_id)) {
      setCurrentTeacher(true)
    }
  }, [teacher_id, assessments]);



  const uniqueSortedDisription = useMemo(() => {
    const descriptionSet = new Set();
    assessments.forEach(item => descriptionSet.add(item.description));
    const uniqueDescriptionsArray = Array.from(descriptionSet);

    // Lọc ra các giá trị rỗng
    const filteredDescriptionsArray = uniqueDescriptionsArray.filter(description => description !== '');

    // Hàm so sánh tùy chỉnh để sắp xếp theo phần số cuối
    filteredDescriptionsArray.sort((a, b) => {
      const numA = parseInt(a.match(/\d+$/));
      const numB = parseInt(b.match(/\d+$/));
      return numA - numB;
    });

    return filteredDescriptionsArray;
  }, [assessments]);


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

    if (filterStatus === 0) {
      // Lọc ra những giáo viên có totalScore bằng 0
      filteredAssessment = filteredAssessment.filter((teacher) => teacher.totalScore === 0);
    } else if (filterStatus === 1) {
      // Lọc ra những giáo viên có totalScore lớn hơn 0
      filteredAssessment = filteredAssessment.filter((teacher) => teacher.totalScore > 0);
    }

    if (filterClass !== 'all') {
      filteredAssessment = filteredAssessment.filter((teacher) =>
        teacher.class === filterClass
      );
    }

    if (filterDescription && filterDescription !== '') {
      filteredAssessment = filteredAssessment.filter(item =>
        item.description === filterDescription
      );
    }

    return filteredAssessment;
  }, [assessments, filterValue, filterStatus, filterClass, filterDescription, hasSearchFilter]);

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
  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col justify-center gap-4">
        <div className='block sm:hidden'>
          <h1 className="text-2xl pb-2 font-bold text-[#6366F1]">Danh sách sinh viên cần đánh giá</h1>
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
            <div className='flex gap-2 h-fit justify-center flex-wrap justify-end  sm:justify-start items-center'>
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
                    Lọc theo trạng thái
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Filter by Status"
                  closeOnSelect={true}
                  selectedKeys={new Set([filterStatus !== null ? filterStatus.toString() : ''])} // Chọn filterStatus hiện tại
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] || null; // Đảm bảo chọn giá trị rỗng nếu không có lựa chọn
                    setStatusFilter(selectedKey ? parseInt(selectedKey, 10) : null); // Đặt filterStatus về null nếu không có gì được chọn
                  }}
                >
                  {statusOptions.map((option) => (
                    <DropdownItem key={option.key} className="capitalize">
                      {option.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <Dropdown>
                <DropdownTrigger className="sm:flex">
                  <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                    Lọc theo lớp
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Class Filter"
                  closeOnSelect={true}
                  selectedKeys={new Set([filterClass])} // Chuyển đổi filterClass thành Set
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] || 'all';
                    setClassFilter(selectedKey);
                  }}
                >
                  <DropdownItem key="all" className="capitalize">Tất cả lớp</DropdownItem>
                  {classes.map((classOption) => (
                    <DropdownItem key={classOption.value} className="capitalize">
                      {classOption.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>


              <Dropdown>
                <DropdownTrigger className="sm:flex">
                  <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                    Lọc theo nhóm
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Lọc nhóm"
                  closeOnSelect={true}
                  selectedKeys={new Set([filterDescription])} // Chuyển đổi filterDescription thành Set
                  selectionMode="single"
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] || ''; // Đảm bảo chọn giá trị rỗng nếu không có lựa chọn
                    setDescriptionFilter(selectedKey);
                  }}
                >
                  <DropdownItem key="" className="capitalize">
                    Tất cả nhóm
                  </DropdownItem>
                  {uniqueSortedDisription.map((ploName) => (
                    <DropdownItem key={ploName} className="capitalize">
                      {ploName}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>





            </div>
          </div>









        </div>
        <div className="w-full flex sm:items-center sm:justify-between">
          <p className="text-small text-default-400 min-w-[100px]">
            <span className="text-default-500">{assessments.length}</span> Sinh viên(s)
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
  }, [filterValue, assessments, rowsPerPage, onSearchChange, onRowsPerPageChange]);

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

  const Columns = React.useCallback((assessment, columnKey) => {
    // Đảm bảo rằng assessment và columnKey đều không phải là null hoặc undefined
    if (!assessment || !columnKey) {
      return null;
    }

    // Lấy giá trị ô
    const cellValue = assessment[columnKey] ?? 'N/A'; // Sử dụng giá trị mặc định nếu cellValue là null hoặc undefined

    switch (columnKey) {
      case 'id':
        return (
          <div className="flex w-fit justify-start items-center">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case 'description':
        return (
          <div className="flex w-fit justify-start items-center">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case 'generalDescription':
        return (
          <div className="flex w-fit justify-start items-center">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case 'class':
        return (
          <div className="flex w-fit justify-start items-center">
            <p className="text-bold text-small capitalize">{cellValue}</p>
          </div>
        );
      case 'totalScore':
        const totalScoreValue = assessment.totalScore ?? 0; // Giá trị mặc định là 0 nếu totalScore là null hoặc undefined
        return (
          <Chip
            className="capitalize border-none gap-1 text-default-600 flex w-fit justify-start items-center"
            color={statusColorMap[totalScoreValue]}
            size="sm"
            variant="dot"
          >
            {totalScoreValue}
          </Chip>
        );
      case 'student':
        const student = assessment.student || {};
        return (
          <div className="flex flex-col items-start justify-center">
            <p className="text-bold text-small capitalize">{student.studentCode ?? 'N/A'}</p>
            <p className="text-bold text-small capitalize">{student.name ?? 'N/A'}</p>
          </div>
        );
      case 'action':
        const action = assessment.action || {};
        const disc = handleReplaceCharacters(action.generalDescription ?? ''); // Giá trị mặc định là chuỗi rỗng nếu generalDescription là null hoặc undefined
        const urlcreate = filterStatus === 0
          ? `/admin/management-grading/${disc}/student-code/${action.studentCode ?? ''}/assessment/${action.assessment_id ?? ''}/rubric/${action.rubric_id ?? ''}?FilterScore=0`
          : `/admin/management-grading/${disc}/student-code/${action.studentCode ?? ''}/assessment/${action.assessment_id ?? ''}/rubric/${action.rubric_id ?? ''}`;

        return (
          <div className="flex w-fit justify-start items-center gap-2">
            {action.totalScore === 0 ? (
              <Tooltip content="Chấm điểm">
                <Button
                  isIconOnly className="bg-[#fefefe] shadow-sm border-3 border-[#FF9908]"
                  onClick={() => handleNavigate(urlcreate)}
                >
                  <i className="fa-solid fa-feather-pointed text-xl text-[#020401]"></i>
                </Button>
              </Tooltip>
            ) : (
              <Tooltip content="Chỉnh sửa">
                <Button
                  isIconOnly className="bg-[#fefefe] shadow-sm border-3 border-[#FF9908]"
                  onClick={() => handleNavigate(
                    filterStatus === 0
                      ? `/admin/management-grading/update/${disc}/student-code/${action.studentCode ?? ''}/assessment/${action.assessment_id ?? ''}/rubric/${action.rubric_id ?? ''}?FilterScore=0`
                      : `/admin/management-grading/update/${disc}/student-code/${action.studentCode ?? ''}/assessment/${action.assessment_id ?? ''}/rubric/${action.rubric_id ?? ''}`
                  )}
                >
                  <i className="fa-solid fa-pen text-xl text-[#020401]"></i>
                </Button>
              </Tooltip>
            )}
            <Tooltip content={action.totalScore === 0 ? 'Chấm điểm trước' : "In Điểm"}>
              <Button
                isIconOnly className="bg-[#fefefe] shadow-sm border-3 border-default"
                disabled={action.totalScore === 0}
                onClick={() => {
                  handleAddPDFOneStudent(assessment?.Assessment)
                }}
              >
                <i className="fa-regular fa-file-pdf text-xl text-[#020401]"></i>
              </Button>
            </Tooltip>
            <Tooltip content="Xoá">
              <Button
                isIconOnly className="bg-[#fefefe] shadow-sm border-3 border-[#FF8077]"
                disabled={!CurrentTeacher}
                onClick={() => { onOpen(); setDeleteId(assessment.meta_assessment_id ?? null) }}
              >
                <i className="fa-solid fa-trash-can text-xl text-[#020401]"></i>
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, [filterStatus, handleNavigate, onOpen]);



  //////////////////////////////////////////////////////////////////////////
  ////   handle
  //////////////////////////////////////////////////////////////////////////
  const handleAddPDFOneStudent = (Assessment) => {
    setAllAssessment(Assessment)
    //setDataRubricItems(DataRubricItems)
    setIsAddModalOpenOnePDF(true);
  };
  const handleTakeSelectedItems = () => {
    const selectedItems = assessments.filter((item) => selectedKeys.has(item.id.toString()));
    //console.log('Get Selected Items', selectedItems);
    return selectedItems;
  };
  const handleTakeStudentCode = (data, key) => {
    for (let item of data) {
      // && item.totalScore === 0
      if (item.id === key) {
        return {
          Assessment: key,
          studentCode: item.student.studentCode
        }
      }
    }
    return null;
  };
  const handleFormSubmit = async () => {
    //console.log("description", editRubric);

    if (!editRubric.student_id || editRubric.student_id.length === 0) {
      message.error('Vui lòng chọn sinh viên tạo mới');
      return;
    }

    if (editRubric.generalDescription === '') {
      message.error('Lỗi mô tả chung');
      return;
    }

    try {
      // Tạo và gửi tất cả các yêu cầu POST đến '/meta-assessment'
      const promises = editRubric.student_id.map(studentId => {
        const data = {
          teacher_id: teacher_id,
          course_id: editRubric.course_id || "",
          rubric_id: editRubric.rubric_id || "",
          description: "",
          generalDescription: editRubric.generalDescription || "",
          student_id: studentId,
          place: editRubric.place,
          date: editRubric.date,
        };
        return axiosAdmin.post('/meta-assessment', { data: data });
      });
      const responses = await Promise.all(promises);
      const metaAssessmentIds = responses.map(response => response.data.meta_assessment_id);
      // console.log("metaAssessmentIds", metaAssessmentIds)
      // Gửi yêu cầu GET đến '/assessments' để lấy danh sách teacher_id
      const getTeacherIDAssessment = axiosAdmin.get(`/assessment?generalDescription=${editRubric.generalDescription}&isDelete=false`);

      // Chờ kết quả từ GET yêu cầu
      const teacherData = await getTeacherIDAssessment;
      const teacherIds = teacherData.data.teacherIds;
      // console.log("teacherIds", teacherIds)
      // Tạo và gửi tất cả các yêu cầu POST đến '/assessment'
      const postData = metaAssessmentIds.flatMap(meta_assessment_id =>
        teacherIds.map(teacher_id => ({
          meta_assessment_id,
          teacher_id
        }))
      );
      const postPromises = postData.map(data => axiosAdmin.post('/assessment', { data: data }));
      const postResponses = await Promise.all(postPromises);

      const allSuccess = postResponses.every(response => response.status === 200 || response.status === 201);

      if (allSuccess) {
        message.success('Lưu thành công tất cả các yêu cầu');
      } else {
        message.error('Có lỗi xảy ra khi lưu một số yêu cầu');
      }
      LoadData()
    } catch (error) {
      console.error('Error creating meta assessments:', error);
      message.error('Lỗi server nội bộ khi lưu các yêu cầu');
    }
  };

  const handleAddClick = () => {
    //console.log(editRubric);
    setIsEditModalOpen(true);
  };

  const handleOpenModalUpdateDiscClick = () => {
    setIsUpdateDiscModalOpen(true);
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
  const handleCheckstotalscore = (data, key) => {
    for (let item of data) {
      if (item.id === key) {
        return {
          assessment_id: key,
          totalScore: item.totalScore,
          checktotalScore: item.totalScore === 0 ? true : false
        };
      }
    }
    return null;
  };

  const handleGetDescriptionsByIds = (assessments, ids) => {
    return assessments
      .filter(assessment => ids.includes(assessment.id))
      .map(assessment => assessment?.description || 'N/A');
  };

  const handleGetAllAssessment = (assessments, ids) => {
    return assessments
      .filter(assessment => ids.includes(assessment.id))
      .map(assessment => assessment?.Assessment || {});
  };

  const allDescriptionsMatch = (descriptions) => {
    return descriptions.every(description => description === descriptions[0]);
  };

  const handleNavigateGradingGroup = () => {
    setTimeout(() => {
      const selectedItems = handleTakeSelectedItems();
      //console.log('Selected Items after timeout:', selectedItems);
      if (selectedItems.length === 0) {
        message.error('Please select at least one student');
        return;
      }
      if (selectedItems.length > 4) {
        message.error('Please select no more than 4 students');
        setSelectedKeys(new Set())
        return;
      }

      const ids = selectedItems.map(item => item.id);


      const checkStotalScore = ids.map((key) => handleCheckstotalscore(assessments, key));
      const hasUncheckedAssessment = checkStotalScore.some((item, index) => {
        if (item.checktotalScore === false) {
          message.error(`Sinh viên đã chọn thứ ${index + 1} đã chấm điểm.`);
          return true;
        }
        return false;
      });

      if (hasUncheckedAssessment) {
        return;
      }



      const descriptions = handleGetDescriptionsByIds(assessments, ids);

      // Kiểm tra nếu tất cả các mô tả đều giống nhau
      if (!allDescriptionsMatch(descriptions)) {
        message.error('Các mô tả không khớp với nhau.');
        return;
      }

      const listStudentCodes = ids.map((key) => handleTakeStudentCode(assessments, key));
      // console.log("checkStotalScore");
      // console.log(checkStotalScore);
      // console.log("listStudentCodes");
      // console.log(listStudentCodes);
      const studentCodesString = encodeURIComponent(JSON.stringify(listStudentCodes));
      const disc = handleReplaceCharacters(descriptionURL);
      // console.log("studentCodesString");
      // console.log(studentCodesString);
      // console.log("disc");
      // console.log(disc);
      const url = filterStatus === 0 ? `/admin/management-grading/${disc}/couse/${Couse_id}/rubric/${rubric_id}?student-code=${studentCodesString}&&disc=${descriptionURL}&&FilterScore=0` : `/admin/management-grading/${disc}/couse/${Couse_id}/rubric/${rubric_id}?student-code=${studentCodesString}&&disc=${descriptionURL}`
      handleNavigate(url);
    }, 100);
  };

  const handleDPFGroup = () => {
    setTimeout(() => {
      const selectedItems = handleTakeSelectedItems();
      //console.log('Selected Items after timeout:', selectedItems);
      if (selectedItems.length === 0) {
        message.error('Chọn sinh viên để tải PDF');
        return;
      }
      if (selectedItems.length > 3) {
        message.error('Tối đa 3 sinh viên');
        setSelectedKeys(new Set())
        return;
      }

      const ids = selectedItems.map(item => item.id);

      const descriptions = handleGetDescriptionsByIds(assessments, ids);
      if (!allDescriptionsMatch(descriptions)) {
        message.error('Các đề tài không khớp với nhau.');
        return;
      }


      const transformAssessmentData = (assessments) => {
        return assessments.map(assessment => {
          const { MetaAssessment, teacher } = assessment;
          const { Rubric, Student } = MetaAssessment;

          return {
            description: MetaAssessment.description,
            subject: {
              subjectName: Rubric.subject.subjectName,
              subjectCode: Rubric.subject.subjectCode
            },
            students: {
              name: Student.name,
              studentCode: Student.studentCode
            },
            RubricItems: Rubric.RubricItems.map(rubricItem => ({
              rubricsItem_id: rubricItem.rubricsItem_id,
              description: rubricItem.description,
              maxScore: rubricItem.maxScore,
              CLO: rubricItem.CLO,
              AssessmentItems: rubricItem.AssessmentItems[0]
            })),
            totalScore: assessment.totalScore,
            teacher: teacher.name
          };
        });
      };

      const alldata = transformAssessmentData(handleGetAllAssessment(assessments, ids));

      const fiterAlldata = {
        description: alldata[0]?.description || '',
        students: alldata?.map(item => item?.students) || [],
        subject: alldata[0]?.subject || {},
        teacher: alldata[0]?.teacher || '',
        data1: alldata[0]?.RubricItems || [],
        data2: alldata[1]?.RubricItems || [],
        data3: alldata[2]?.RubricItems || [],
        totalScore: alldata.map(item => item?.totalScore) || [],
      };




      console.log(fiterAlldata)


      setAllMutiAssessment(fiterAlldata)
      setIsAddModalOpenMutiPDF(true)

    }, 100);
  };
  const handleDownloadTemplateExcel = async () => {
    const assessmentMetaIds = assessments.map(item => item.meta_assessment_id);
    if (assessmentMetaIds.length === 0) {
      message.error(`Không tồn tại sinh viên`);
    }

    try {
      const data = { id: assessmentMetaIds };
      console.log("data");
      console.log(data);
      const response = await axiosAdmin.post('meta-assessment/templates/data', { data: data }, {
        responseType: 'blob'
      });


      if (response && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'CapNhatDeTai.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };
  const handleSoftDeleteById = async (_id) => {
    try {
      await axiosAdmin.delete(`/meta-assessment/${_id}`);
      await LoadData();
      message.success("xóa thành công");
    } catch (error) {
      console.error(`Error toggling delete for with ID ${_id}:`, error);
      message.error(`Error toggling delete for with ID ${_id}`);
    }
  };


  return (
    <>
      <div className='w-full flex justify-between items-center'>
        <div className='h-full my-auto p-5 hidden sm:block'>
          <div>
            <h1 className="text-2xl pb-2 font-bold text-[#4F46E5]">Danh sách sinh viên cần đánh giá</h1>
          </div>
          <BackButton path={'/admin/management-grading/list'} />
        </div>
        <div className='w-full sm:w-auto bg-[#fefefe] border-2 border-[#4F46E5] mb-2 shadow-sm rounded-xl p-4 flex gap-4 flex-col sm:flex-row items-center'>
          <div className='flex flex-wrap justify-center gap-2'>
            <Button
              className='bg-transparent  shadow-sm border-2 border-[#FF9908] hover:bg-[#FF9908]'
              onClick={() => {
                handleNavigateGradingGroup();
              }}
              endContent={<i className="fa-solid fa-feather-pointed"></i>}
            >
              Chấm theo nhóm
            </Button>
            <Button
              className='bg-transparent  shadow-sm border-2 border-[#AF84DD] hover:bg-[#AF84DD]'
              endContent={<i className="fas fa-plus"></i>} // Icon thêm mới
              onClick={handleAddClick}
            >
              Tạo mới
            </Button>

            <Button
              disabled={!CurrentTeacher}
              className='bg-transparent shadow-sm border-2 border-[#FF8077]  hover:bg-[#FF8077]'
              endContent={<i className="fas fa-eye-slash"></i>}
              onClick={() => {
                handleOpenModalUpdateDiscClick()
              }}>
              Cập nhật đề tài
            </Button>
            <Button
              className='bg-transparent shadow-sm border-2 border-[#6B7280] hover:bg-[#6B7280]'
              endContent={<i className="fa-regular fa-file-pdf"></i>}
              onClick={() => {
                handleDPFGroup();
              }}
            >
              PDF nhóm
            </Button>
          </div>
        </div>
      </div>
      <ModalOpenPdfOneStudent
        isOpen={isAddModalOpenOnePDF}
        onOpenChange={setIsAddModalOpenOnePDF}
        AllAssessment={AllAssessment}
      //DataRubric={DataRubricPDF}
      //DataRubricItems={DataRubricItems}
      />
      <ModalOpenPdfMutiStudent
        isOpen={isAddModalOpenMutiPDF}
        onOpenChange={setIsAddModalOpenMutiPDF}
        AllMutiAssessment={AllMutiAssessment}
      //DataRubric={DataRubricPDF}
      //DataRubricItems={DataRubricItems}
      />


      <ConfirmAction
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        onConfirm={() => {
          if (deleteId) {
            handleSoftDeleteById(deleteId);
            setDeleteId(null);
          }
        }}
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
              {(columnKey) => <TableCell>{Columns(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ModalCreateOneAssessment
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleFormSubmit}
        editRubric={editRubric}
        setEditRubric={setEditRubric}
        DataCourse={CourseArray}
        RubicData={RubricArray}
        StudentData={filteredStudents}
      />

      <ModalUpdateDisc
        isOpen={isUpdateDiscModalOpen}
        onOpenChange={setIsUpdateDiscModalOpen}
        download={handleDownloadTemplateExcel}
        LoadData={LoadData}
      />
    </>
  );
};

export default ManagementAssessmentGrading;


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
                Lần đánh giá của sinh viên sẽ được xóa và không thể khôi phục lại, tiếp tục thao tác?
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