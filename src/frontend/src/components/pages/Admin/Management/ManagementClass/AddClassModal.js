import React, { useEffect, useState } from 'react';
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

const AddClassModal = ({ isOpen, onOpenChange, fetchClasses }) => {
  const [className, setClassName] = useState('');
  const [classNameShort, setClassNameShort] = useState('');
  const [classCode, setClassCode] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [teachers, setTeachers] = useState([]);

  const navigate = useNavigate();

  const handleAddClass = async () => {
    try {
      const newClass = {
        className,
        classNameShort,
        classCode,
        teacher_id: teacherId,
      };

      console.log("new class", newClass)

      const response = await axiosAdmin.post('/class', {data: newClass});
      if (response.status == 200) {
        onOpenChange(false);
        fetchClasses();
        navigate('/admin/class');
      } else {
        console.error('Failed to add new class');
      }
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  const getTeacher = async () => {
    try {
      const response = await axiosAdmin.get("/teacher");
      setTeachers(response.data);
    } catch (err) {
      console.error("Error fetching teachers: ", err.message);
    }
  }

  useEffect(() => {
    getTeacher()
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={() => onOpenChange(false)}>
      <ModalContent>
        <ModalHeader>
          <span>Add New Class</span>
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
            onChange={(e) => setTeacherId(parseInt(e.target.value))}
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
          <Button auto onClick={handleAddClass}>
            Add Class
          </Button>
        </ModalFooter>
      </ModalContent>


    </Modal>
  );
};

export default AddClassModal;
