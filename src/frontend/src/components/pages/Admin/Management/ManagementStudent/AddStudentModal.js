import React, { useState, useEffect } from "react";
import { Modal, Button, Input, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";

const AddStudentModal = ({ isOpen, onOpenChange, fetchStudents }) => {
  const [fileList, setFileList] = useState([]);
  const [current, setCurrent] = useState(0);
  const [studentData, setStudentData] = useState({
    studentCode: "",
    email: "",
    name: "",
    class_id: ""
  });
  const [classes, setClasses] = useState([]);

  const handleAddStudent = async () => {
    try {
      await axiosAdmin.post('/students', studentData);
      fetchStudents();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const getClass = async () => {
    const response = await axiosAdmin.get(`/class`);
    setClasses(response.data);
    console.log("data class", response.data);
  };

  useEffect(() => {
    getClass();
  }, []);

  const handleDownloadTemplateExcel = async () => {
    try {
      const response = await axiosAdmin.get('/teacher/template/excel', {
        responseType: 'blob'
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Teacher.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleFileChange = (e) => {
    setFileList([...e.target.files]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFileList(currentFiles => currentFiles.filter((_, index) => index !== indexToRemove));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Add Student</ModalHeader>
        <ModalBody>

          <div>Thêm giáo viên bằng file excel</div>
          <div className="flex justify-between m-1">
            <div className="card p-3">
              <h3>Tải Mẫu CSV</h3>
              <Button onClick={handleDownloadTemplateExcel}> Tải xuống mẫu </Button>
            </div>
            <div className="card p-3">
              <div>
                <h3>Upload File</h3>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button auto flat as="span" color="primary">
                    Select File
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  multiple
                />
                {fileList.length > 0 && (
                  <div className="mt-2">
                    <ul>
                      {fileList.map((file, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <p>{file.name}</p>
                          <Button auto flat color="error" size="xs" onClick={() => handleRemoveFile(index)}>
                            X
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="card p-3">
              <h3>Upload Data</h3>
              <CustomUpload
                endpoint='teacher'
                method="POST"
                setCurrent={setCurrent}
                fileList={fileList}
                setFileList={setFileList}
              />
            </div>
          </div>

          <Input
            clearable
            underlined
            fullWidth
            placeholder="Nhập mã sinh viên"
            label="Student Code"
            value={studentData.studentCode}
            onChange={(e) => setStudentData({ ...studentData, studentCode: e.target.value })}
          />
          <Input
            clearable
            underlined
            fullWidth
            placeholder="Nhập email sinh viên"
            label="Email"
            value={studentData.email}
            onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
          />
          <Input
            clearable
            underlined
            placeholder="Nhập tên sinh viên"
            fullWidth
            label="Name"
            value={studentData.name}
            onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
          />
          <Select
            label="Chọn mã lớp"
            value={studentData.class_id}
            placeholder="Chọn mã lớp của sinh viên"
            onChange={(e) => setStudentData({ ...studentData, class_id: e })}
          >
            {classes.map((item) => (
              <SelectItem key={item.class_id} value={item.class_id}>
                {item.classNameShort}
              </SelectItem>
            ))}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button auto flat onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button auto onClick={handleAddStudent}>
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddStudentModal;
