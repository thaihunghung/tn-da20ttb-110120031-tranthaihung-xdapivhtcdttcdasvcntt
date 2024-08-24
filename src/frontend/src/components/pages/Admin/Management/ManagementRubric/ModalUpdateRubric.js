import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Button,
} from "@nextui-org/react";
import { capitalize } from "../../Utils/capitalize";

function ModalUpdateRubric({ isOpen, onOpenChange, onSubmit, editRubric, setEditRubric, DataSubject }) {

  // Xử lý thay đổi các giá trị của các trường nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditRubric((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý thay đổi giá trị của Select
  const handleSelectChange = (value) => {
    setEditRubric((prev) => ({
      ...prev,
      subject_id: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='text-[#FF9908]'>Cập nhật bảng TC</ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit(editRubric, editRubric.rubric_id);
                  onClose();
                }}>
                <Input
                  fullWidth
                  label="Tên bảng TC"
                  name="rubricName"
                  value={editRubric.rubricName || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Ghi chú"
                  name="comment"
                  placeholder="Nhập ghi chú"
                  value={editRubric.comment || ''}
                  onChange={handleChange}
                />
                <Select
                  label="Chọn học phần"
                  name="subject_id"
                  defaultSelectedKeys={[editRubric.subject_id || '']}
                  value={editRubric.subject_id || ''}
                  onChange={(e) => handleSelectChange(e.target.value)}
                  fullWidth
                > 
                  {DataSubject.map((subject) => (
                    <SelectItem key={subject.subject_id} value={subject.subject_id}>
                      {capitalize(subject.subjectName)}
                    </SelectItem>
                  ))}
               </Select>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Hủy
              </Button>
              <Button
                type="submit"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  onSubmit(editRubric, editRubric.rubric_id);
                  onClose();
                }}
              >
                Cập nhật
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalUpdateRubric;
