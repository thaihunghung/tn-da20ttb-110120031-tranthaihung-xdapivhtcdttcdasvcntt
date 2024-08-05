import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button,
  Input,
  ModalContent,
  Select,
  Avatar,
  SelectItem,
} from '@nextui-org/react';
import { axiosAdmin } from '../../../../../service/AxiosAdmin';
import { useNavigate } from 'react-router-dom';

const EditClassModal = ({ isOpen, onOpenChange, classId, initialData, fetchClasses }) => {
  const [className, setClassName] = useState('');
  const [classNameShort, setClassNameShort] = useState('');
  const [classCode, setClassCode] = useState('');
  const [teacherId, setTeacherId] = useState(null);
  const [teachers, setTeachers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setClassName(initialData.className);
      setClassNameShort(initialData.classNameShort);
      setClassCode(initialData.classCode);
      setTeacherId(initialData.teacher_id);
    }
  }, [initialData]);

  const handleEditClass = async () => {
    try {
      const updatedClass = {
        className,
        classNameShort,
        classCode,
        teacher_id: teacherId,
      };

      console.log('Updated Class Data:', updatedClass);

      const response = await axiosAdmin.put(`/class/${classId}`, {data: updatedClass});
      if (response.status == 200) {
        onOpenChange(false);
        fetchClasses();
        navigate('/admin/class');
      } else {
        console.error('Failed to edit class');
      }
    } catch (error) {
      console.error('Error editing class:', error);
    }
  };

  const getTeacher = async () => {
    try {
      const response = await axiosAdmin.get("/teacher");
      setTeachers(response.data);
    } catch (err) {
      console.error("Error fetching teachers: ", err.message);
    }
  };

  useEffect(() => {
    getTeacher();
  }, []);

  const handleTeacherChange = (e) => {
    const selectedTeacherId = parseInt(e.target.value, 10);
    setTeacherId(selectedTeacherId);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onOpenChange(false)}>
      <ModalContent>
        <ModalHeader>
          <span>Edit Class</span>
        </ModalHeader>
        <ModalBody>
          <Input
            fullWidth
            label="Class Name"
            placeholder="Enter class name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
          <Input
            fullWidth
            label="Class Short Name"
            placeholder="Enter class short name"
            value={classNameShort}
            onChange={(e) => setClassNameShort(e.target.value)}
          />
          <Input
            fullWidth
            label="Class Code"
            placeholder="Enter class code"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
          />
          <Select
            items={teachers}
            value={initialData.teacher_id}
            defaultSelectedKeys={[initialData.teacher_id]}
            onChange={handleTeacherChange}
            label="Teacher"
            placeholder="Select a user"
            labelPlacement="outside"
            classNames={{
              base: "max-w-xs",
              trigger: "h-12",
            }}
            renderValue={(items) => {
              return items.map((item) => (
                <div key={item.data.key} className="flex items-center gap-2">
                  <Avatar
                    alt={item.data.name}
                    className="flex-shrink-0"
                    size="sm"
                    src={item.data.imgURL}
                  />
                  <div className="flex flex-col">
                    <span>{item.data.name}</span>
                    <span className="text-default-500 text-tiny">({item.data.email})</span>
                  </div>
                </div>
              ));
            }}
          >
            {(teacher) => (
              <SelectItem key={teacher.teacher_id} textValue={teacher.name}>
                <div className="flex gap-2 items-center">
                  <Avatar alt={teacher.name} className="flex-shrink-0" size="sm" src={teacher.imgURL} />
                  <div className="flex flex-col">
                    <span className="text-small">{teacher.name}</span>
                    <span className="text-tiny text-default-400">{teacher.email}</span>
                  </div>
                </div>
              </SelectItem>
            )}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button auto flat onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button auto onClick={handleEditClass}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditClassModal;
