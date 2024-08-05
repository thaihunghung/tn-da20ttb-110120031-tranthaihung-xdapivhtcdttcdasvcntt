import React, { useState, useEffect } from "react";
import { Modal, Button, Input, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";

const EditStudentModal = ({ isOpen, onOpenChange, student, fetchStudents }) => {
  const [studentData, setStudentData] = useState({
    studentCode: "",
    email: "",
    name: "",
    class_id: ""
  });

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (student) {
      setStudentData({
        studentCode: student.studentCode || "",
        email: student.email || "",
        name: student.name || "",
        class_id: student.class_id || ""
      });
    }
  }, [student]);

  const getClass = async () => {
    const response = await axiosAdmin.get(`/class`);
    setClasses(response.data);
  };

  const handleEditStudent = async () => {
    try {
      await axiosAdmin.put(`/student/${student.student_id}`, studentData);
      fetchStudents();
      onOpenChange(false);
    } catch (error) {
      console.error("Error editing student:", error);
    }
  };

  useEffect(() => {
    getClass();
  }, []);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Edit Student</ModalHeader>
        <ModalBody>
          <Input
            clearable
            underlined
            fullWidth
            label="Student Code"
            value={studentData.studentCode}
            onChange={(e) => setStudentData({ ...studentData, studentCode: e.target.value })}
          />
          <Input
            clearable
            underlined
            fullWidth
            label="Email"
            value={studentData.email}
            onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
          />
          <Input
            clearable
            underlined
            fullWidth
            label="Name"
            value={studentData.name}
            onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
          />
          <Select
            label="Chọn mã lớp"
            value={studentData.class_id}
            defaultSelectedKeys={[studentData.class_id]}
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
          <Button auto onClick={handleEditStudent}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditStudentModal;
