import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { axiosAdmin } from "../../../../../../service/AxiosAdmin";
import { Button, Input, Space, Table, Tooltip, Upload } from "antd";
import CustomUpload from "../../../CustomUpload/CustomUpload";
import { DeleteFilled, EditFilled, UploadOutlined } from "@ant-design/icons";
import { Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import Search from "antd/es/input/Search";

const DetailCourse = (props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [deleteId, setDeleteId] = useState(null);
  const { setCollapsedNav, successNoti } = props;
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Search } = Input;
  const [fileList, setFileList] = useState([]);
  const [current, setCurrent] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    handleLoadStudents();
    const fetchCourse = async () => {
      try {
        const response = await axiosAdmin.get(`course/${id}`);
        console.log("data", response.data);
        setCourse(response.data[0]);
      } catch (err) {
        console.error("Error fetching course details: ", err.message);
      }
    };

    fetchCourse();
  }, [id]);

  const state = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const handleDownloadStudent = async () => {
    try {
      const response = await axiosAdmin.get('/student/templates/post', {
        responseType: 'blob'
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setCurrent(1);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleChangeIdDelete = async (id) => {
    try {
      const response = await axiosAdmin.put(`/class/isDelete/${id}`);
      if (response) {
        console.log("Response data:", response.data); // Debug statement
        handleLoadStudents();
        successNoti("Chuyển vào thùng rác thành công");
      }
    } catch (err) {
      console.log("Error: " + err.message);
    }
  }

  const handleLoadStudents = async () => {
    setLoading(true);
    try {
      const response = await axiosAdmin.get(`/course-enrollment/${id}`);
      console.log("z", response.data);
      // Assuming response.data contains the students array
      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        console.error("Unexpected data format:", response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching students: ", err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadStudents();
  }, [current])

  if (!course) {
    return <div>Loading...</div>;
  }

  const filteredStudents = students.filter(student =>
    student.Student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.Student.studentCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (value, record, index) => index + 1,
      width: '5%',
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'name',
      key: 'name',
      render: (value, record) => record.Student.name,
      width: '15%',
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'studentCode',
      key: 'studentCode',
      render: (value, record) => record.Student.studentCode,
      width: '15%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (value, record) => record.Student.email,
      width: '30%',
      responsive: ['lg'],
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value, record) => new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date(record.createdAt)),
      width: '15%',
      responsive: ['md'],
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (value, record) => (
        <Space>
          <Link to={`update/${record.id_detail_courses}`}>
            <Tooltip title="Cập nhật thông tin sinh viên">
              <Button icon={<EditFilled />} />
            </Tooltip>
          </Link>
          <Tooltip title="Chuyển vào thùng rác">
            <Button onClick={() => {
              onOpen();
              setDeleteId(record.id_detail_courses);
              console.log("delete", record.id_detail_courses);
            }} icon={<DeleteFilled />} />
          </Tooltip>
        </Space>
      ),
      width: '15%',
    }
  ];

  return (
    <>
      <ConfirmAction
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        onConfirm={() => {
          if (deleteId) {
            console.log("duoc1");
            handleChangeIdDelete(deleteId);
            setDeleteId(null);
          }
        }}
      />
      <div className="p-4">
        <h2 className="text-2xl font-bold text-[#6366F1] mb-4">{`${course.courseCode} ${course.courseName}`}</h2>
        <div className="flex gap-2 flex-col bg-white p-6 rounded shadow-md text-left">
          <p><strong>Tên môn học:</strong> {course.courseName}</p>
          <p><strong>Lớp học:</strong> {course.class.className}</p>
          <p><strong>Giáo viên giảng dạy:</strong> {course.teacher.name}</p>
          <p><strong>Năm học:</strong> {course.SemesterAcademicYear.semester.descriptionShort}</p>
          <p><strong>Số lượng sinh viên đăng kí:</strong> {course.enrollmentCount}</p>
          <p><strong className="text-pretty">Mô tả:</strong> {course.subject.description}</p>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#6366F1] mt-5">Danh sách sinh viên</h1>
        </div>
        <div className="flex justify-end mb-4">

          <Search
            placeholder="input search text"
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: 400,
            }}
          />
        </div>
        <div className="mt-4 border rounded">
          <Table
            columns={columns}
            dataSource={filteredStudents}
            loading={loading}
            rowKey="id_detail_courses"
            response="true"
            pagination={{ pageSize: 10 }}
          />
        </div>

        <div className='flex flex-col w-full  sm:flex-col sm:w-full lg:flex-row xl:flex-row justify-around'>
          <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%]  flex justify-start items-center'>
            <div className='p-10 w-full mt-10 h-fix sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center  gap-5 rounded-lg'>
              <div><p className='w-full text-center'>Tải Mẫu CSV</p></div>
              <Button className='w-full bg-primary flex items-center justify-center  p-5 rounded-lg' onClick={handleDownloadStudent}>
                <scan>Tải xuống mẫu </scan>
              </Button>

            </div>
          </div>
          <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-center items-center'>
            <div className='p-10 w-full mt-10 sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
              <div><p className='w-full text-center'>Gửi lại mẫu</p></div>
              <Upload {...state} >
                <Button icon={<UploadOutlined />} className='text-center items-center rounded-lg px-10 h-[40px]'>Select File</Button>
              </Upload>
            </div>
          </div>
          <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-end items-center'>
            <div className='p-10 w-full mt-10 sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
              <div><p className='w-full text-center'>Cập nhật Dữ liệu</p></div>
              <CustomUpload
                endpoint={`course-enrollment/${id}`}
                setCurrent={setCurrent}
                fileList={fileList}
                setFileList={setFileList}
                method="POST"
                onClick={() => handleLoadStudents()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailCourse;

function ConfirmAction(props) {
  const { isOpen, onOpenChange, onConfirm } = props;
  console.log("duoc");
  const handleOnOKClick = (onClose) => {
    onClose();
    console.log('thanđ');
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
                Chương trình sẽ được chuyển vào
                <Chip radius="sm" className="bg-zinc-200">
                  <i class="fa-solid fa-trash-can-arrow-up mr-2"></i>
                  Kho lưu trữ
                </Chip> và có thể khôi phục lại, tiếp tục thao tác?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Huỷ
              </Button>
              <Button color="danger" className="font-medium" onClick={() => handleOnOKClick(onClose)}>
                Chuyển
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
