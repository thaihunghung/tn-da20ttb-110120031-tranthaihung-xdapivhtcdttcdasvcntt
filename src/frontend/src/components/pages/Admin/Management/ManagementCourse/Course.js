import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Pagination,
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  Select,
  SelectItem,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import './Course.css';
import EditCourseModal from "./EditCourseModal";
import ExcelModal from "./ExcelModal";
import AddCourseModal from "./AddCourseModal";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import ConfirmAction from "./ConfirmAction";

const Course = (props) => {
  const navigate = useNavigate();
  const { setCollapsedNav, successNoti, errorNoti } = props;
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalCourses, setTotalCourses] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isConfirmActionOpen, setIsConfirmActionOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form, setForm] = useState({
    courseName: "",
    class_id: "",
    teacher_id: "",
    subject_id: "",
    semester_id: "",
    academic_year_id: "",
    yearX: "",
    yearY: "",
  });

  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [academicYears, setAcademicYear] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filteredAcademicYears, setFilteredAcademicYears] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [academicYearSearchText, setAcademicYearSearchText] = useState("");
  const [showYearInputs, setShowYearInputs] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [current, setCurrent] = useState(0);

  const toggleYearInputs = () => setShowYearInputs(!showYearInputs);

  const getAcronym = (phrase) => {
    return phrase
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  useEffect(() => {
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
  }, [setCollapsedNav]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosAdmin.get("/course-course-enrollment");
        setCourses(response.data);
        setFilteredCourses(response.data);
        setTotalCourses(response.data.length);
      } catch (err) {
        console.error("Error fetching courses: ", err.message);
        errorNoti('Error fetching courses', 'Please try again later');
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axiosAdmin.get("/class");
        setClasses(response.data);
        setFilteredClasses(response.data);
      } catch (err) {
        console.error("Error fetching classes: ", err.message);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axiosAdmin.get("/teacher");
        setTeachers(response.data);
      } catch (err) {
        console.error("Error fetching teachers: ", err.message);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await axiosAdmin.get("/subjects");
        setSubjects(response.data);
        setFilteredSubjects(response.data);
      } catch (err) {
        console.error("Error fetching subjects: ", err.message);
      }
    };

    const fetchSemesters = async () => {
      try {
        const response = await axiosAdmin.get("/semester");
        setSemesters(response.data);
      } catch (err) {
        console.error("Error fetching semesters: ", err.message);
      }
    };

    const fetchAcademicYear = async () => {
      try {
        const response = await axiosAdmin.get("/academic-year");
        setAcademicYear(response.data);
        setFilteredAcademicYears(response.data);
      } catch (err) {
        console.error("Error fetching academic year: ", err.message);
      }
    };

    fetchCourses();
    fetchClasses();
    fetchTeachers();
    fetchSubjects();
    fetchSemesters();
    fetchAcademicYear();
  }, [errorNoti, isEditModalOpen, isExcelModalOpen, isConfirmActionOpen, isAddModalOpen]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCancel = () => {
    setSelectedCourse(null);
  };

  const handleEditSubmit = async () => {
    console.log("save", form)
    try {
      const selectedClass = classes.find(cls => cls.class_id === form.class_id);
      const selectedSubject = subjects.find(subject => subject.subject_id === form.subject_id);

      if (!selectedClass || !selectedSubject) {
        throw new Error("Invalid class or subject selection");
      }

      const data = {
        courseName: form.courseName,
        class_id: form.class_id,
        teacher_id: form.teacher_id,
        subject_id: form.subject_id,
        semester_id: form.semester_id,
        academic_year_id: form.academic_year_id,
        courseCode: `${selectedClass.classCode} - ${selectedSubject.subjectCode}`
      };

      await axiosAdmin.put(`/course/${selectedCourse.course_id}`, { data: data });
      successNoti('Update Successful', 'The course has been updated successfully.');
      const response = await axiosAdmin.get("/course-course-enrollment");
      setCourses(response.data);
      setFilteredCourses(response.data);
      setTotalCourses(response.data.length);
      handleCloseEditModal();
    } catch (err) {
      console.error("Error updating course: ", err.message);
      // errorNoti('Error updating course', 'Please try again later.');
    }
  };

  const handleAddSubmit = async () => {
    console.log("save", form)
    try {
      const selectedClass = classes.find(cls => cls.class_id === form.class_id);
      const selectedSubject = subjects.find(subject => subject.subject_id === form.subject_id);

      if (!selectedClass || !selectedSubject) {
        throw new Error("Invalid class or subject selection");
      }

      const data = {
        courseName: form.courseName,
        class_id: form.class_id,
        teacher_id: form.teacher_id,
        subject_id: form.subject_id,
        semester_id: form.semester_id,
        academic_year_id: form.academic_year_id,
        courseCode: `${selectedClass.classCode} - ${selectedSubject.subjectCode}`
      };

      await axiosAdmin.post(`/course`, { data: data });
      successNoti('Add Successful', 'The course has been added successfully.');
      const response = await axiosAdmin.get("/course-course-enrollment");
      setCourses(response.data);
      setFilteredCourses(response.data);
      setTotalCourses(response.data.length);
      handleCloseAddModal();
    } catch (err) {
      console.error("Error adding course: ", err.message);
      errorNoti('Error adding course', 'Please try again later.');
    }
  };

  const handleSaveAcademicYear = async () => {
    console.log("vao")
    try {
      const response = await axiosAdmin.post('/academic-year', { data: form.yearX })

      if (response.status === 201) {
        successNoti("Tạo năm học mới thành công")
        setForm(prevForm => ({
          ...prevForm,
          academic_year_id: response.data.academic_year_id,
        }));
      }

      if (response.status === 200) {
        successNoti(`Đã chọn ${response.data.description}`)
        setForm(prevForm => ({
          ...prevForm,
          academic_year_id: response.data.academic_year_id,
        }));
      }
    } catch (error) {
      errorNoti("Năm không hợp lệ")
      console.error('Error saving academic year:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenSettingsModal = (course) => {
    setSelectedCourse(course);
    setIsConfirmActionOpen(true);
  };

  const handleCloseSettingsModal = () => {
    setIsConfirmActionOpen(false);
    setSelectedCourse(null);
  };

  const handleOpenEditModal = (course) => {
    console.log("form click", form)
    setSelectedCourse(course);
    setForm({
      courseName: course.courseName,
      class_id: course.class_id,
      teacher_id: course.teacher_id,
      subject_id: course.subject_id,
      semester_id: course.SemesterAcademicYear.semester.semester_id,
      academic_year_id: course.SemesterAcademicYear.academic_year.academic_year_id,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCourse(null);
  };

  const handleOpenMoreModal = (course) => {
    setSelectedCourse(course);
    setIsExcelModalOpen(true);
  };

  const handleCloseMoreModal = () => {
    setIsExcelModalOpen(false);
    setSelectedCourse(null);
  };

  const handleOpenAddModal = () => {
    setForm({
      courseName: "",
      class_id: "",
      teacher_id: "",
      subject_id: "",
      semester_id: "",
      academic_year_id: "",
      yearX: "",
      yearY: "",
    });
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const filteredCoursesForCards = filteredCourses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.class.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCourse = currentPage * pageSize;
  const indexOfFirstCourse = indexOfLastCourse - pageSize;
  const currentCourses = filteredCoursesForCards.slice(indexOfFirstCourse, indexOfLastCourse);

  const validateYear = (value) => {
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 10;
    const yearPattern = /^(19|20)\d{2}$/;
    return yearPattern.test(value) && parseInt(value) >= 1900 && parseInt(value) <= maxYear;
  };

  const isInvalid = React.useMemo(() => {
    if (form.yearX === "") return false;
    return validateYear(form.yearX) ? false : true;
  }, [form.yearX]);

  const handleYearXChange = (e) => {
    const yearX = e.target.value;
    setForm({
      ...form,
      yearX: yearX,
      yearY: yearX ? String(parseInt(yearX) + 1) : ''
    });
  };

  //More modal

  const handleDownloadTemplateExcel = async () => {
    try {
      console.log("selectedCourse.course_id", selectedCourse)
      const response = await axiosAdmin.get(`/course-enrollment/course/${selectedCourse.course_id}/student`, {
        responseType: 'blob'
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Student.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setCurrent(1);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleFileChange = (e) => {
    setFileList([...e.target.files]);
  };


  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-[#6366F1]">Danh sách khóa học</h1>
      </div>
      <div className="flex justify-end">
        <Button color="secondary" onClick={() => navigate('/admin/course/store')}>
          Manage Blocked
        </Button>
      </div>
      <div className="flex justify-between mt-7">

        <Button
          className="mx-7 bg-[#6366F1] text-[#f0f0f0]"
          onClick={handleOpenAddModal}>
          <p>Create new <PlusOutlined /></p>
        </Button>

        <Input
          className="w-[40%] mx-7"
          clearable
          bordered
          fullWidth
          placeholder="Search courses, class, teacher"
          css={{ mb: 20 }}
          onChange={handleSearch}
        />
      </div>


      <div className="grid grid-cols-2 gap-5 m-5">
        {currentCourses.map((course) => (
          <div key={course.course_id}>
            <Card bordered>
              <CardHeader>
                <Link to={`${course.course_id}`}>
                  <div className="flex flex-col items-center justify-center h-[85px] w-full bg-gray-200 text-[24px] text-[#1890ff]
                    lg:h-[160px] lg:w-[200px] lg:text-[36px]
                    md:h-[120px] md:w-[150px] md:text-[32px]
                    ms:h-[100px] ms:w-[130px] ms:text-[28px]
                    ">
                    {course.subject.subjectName.charAt(0)}
                  </div>
                </Link>
                <div className="flex-1 ml-4">
                  <p>{`${course.courseCode} ${course.courseName}`}</p>
                  <p>{course.class.className}</p>
                  <p>{course.teacher.name}</p>
                </div>
              </CardHeader>
              <CardBody>
                <p>{`${course.SemesterAcademicYear.semester.descriptionShort} - ${course.SemesterAcademicYear.academic_year.description}`}</p>
                <p>{`Số sinh viên: ${course.enrollmentCount}`}</p>
              </CardBody>
              <CardFooter className="flex gap-5">
                <Tooltip content="Các thao tác với sinh viên">
                  <Button
                    className="bg-[#6366F1] text-[#f0f0f0]"
                    onClick={() => handleOpenMoreModal(course)}>Sinh viên</Button>
                </Tooltip>
                <Tooltip content="Chỉnh sửa môn học">
                  <Button
                    className="bg-[#6366F1] text-[#f0f0f0]"
                    onClick={() => handleOpenEditModal(course)}>Chỉnh sửa</Button>
                </Tooltip>
                <Tooltip>
                  <Button
                    className="bg-red-400 text-[#f0f0f0]"
                    onClick={() => handleOpenSettingsModal(course)}>Ẩn môn học</Button>
                </Tooltip>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Pagination
          total={Math.ceil(totalCourses / pageSize)}
          current={currentPage}
          pageSize={pageSize}
          onChange={handlePageChange}
          css={{ mt: '16px', textAlign: 'center' }}
        />
      </div>

      {/* Add Modal */}
      <AddCourseModal
        isAddModalOpen={isAddModalOpen}
        handleCloseAddModal={handleCloseAddModal}
        handleAddSubmit={handleAddSubmit}
        form={form}
        setForm={setForm}
        subjects={subjects}
        classes={classes}
        academicYears={academicYears}
        semesters={semesters}
        teachers={teachers}
        showYearInputs={showYearInputs}
        toggleYearInputs={toggleYearInputs}
        isInvalid={isInvalid}
        handleYearXChange={handleYearXChange}
        handleSaveAcademicYear={handleSaveAcademicYear}
        setIsAddModalOpen={setIsAddModalOpen}
      />

      {/* Edit Modal */}
      <EditCourseModal
        isEditModalOpen={isEditModalOpen}
        handleCloseEditModal={handleCloseEditModal}
        handleEditSubmit={handleEditSubmit}
        form={form}
        setForm={setForm}
        subjects={subjects}
        classes={classes}
        academicYears={academicYears}
        semesters={semesters}
        teachers={teachers}
        showYearInputs={showYearInputs}
        toggleYearInputs={toggleYearInputs}
        isInvalid={isInvalid}
        handleYearXChange={handleYearXChange}
        handleSaveAcademicYear={handleSaveAcademicYear}
        setIsEditModalOpen={setIsEditModalOpen}
      />


      {/* Excel Modal */}
      <ExcelModal
        isExcelModalOpen={isExcelModalOpen}
        handleCloseMoreModal={handleCloseMoreModal}
        selectedCourse={selectedCourse}
        handleDownloadTemplateExcel={handleDownloadTemplateExcel}
        handleFileChange={handleFileChange}
        fileList={fileList}
        setFileList={setFileList}
        setCurrent={setCurrent}
        setIsExcelModalOpen={setIsExcelModalOpen}
      />

      <ConfirmAction
        isConfirmActionOpen={isConfirmActionOpen}
        selectedCourse={selectedCourse}
        setIsConfirmActionOpen={setIsConfirmActionOpen}
        successNoti={successNoti}
      />
    </>
  );
};

export default Course;
