import React, { useState } from 'react';
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

function ModalUpdateSubject({ isOpen, onOpenChange, onSubmit, editRubric, setEditRubric, DataSubject }) {

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
      typesubject: value,
    }));
  };

  const DataTypeSubject = [
    { key: 'Đại cương', TypeSubject: 'Đại cương' },
    { key: 'Cơ sở ngành', TypeSubject: 'Cơ sở ngành' },
    { key: 'Chuyên ngành', TypeSubject: 'Chuyên ngành' },
    { key: 'Thực tập và Đồ án', TypeSubject: 'Thực tập và Đồ án' },
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      scrollBehavior="outside"
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
            },
          }}
      >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='text-[#FF9908]'>Edit Subject</ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit(editRubric, editRubric.subject_id);
                  onClose();
                }}>
                <Input
                  fullWidth
                  label="Name"
                  name="subjectName"
                  value={editRubric.subjectName || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Code"
                  name="subjectCode"
                  value={editRubric.subjectCode || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Description"
                  name="description"
                  value={editRubric.description || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Number Credits"
                  name="numberCredits"
                  type="number"
                  value={editRubric.numberCredits || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Number Credits Theory"
                  name="numberCreditsTheory"
                  type="number"
                  value={editRubric.numberCreditsTheory || ''}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Number Credits Practice"
                  name="numberCreditsPractice"
                  type="number"
                  value={editRubric.numberCreditsPractice || ''}
                  onChange={handleChange}
                  required
                />
                <Select
                  label="Type of Subject"
                  name="typesubject"
                  defaultSelectedKeys={[editRubric.typesubject]}
                  value={editRubric?.typesubject}
                  onChange={handleSelectChange}
                  fullWidth
                >
                  {DataTypeSubject.map((type) => (
                    <SelectItem key={type.key} value={type.TypeSubject}>
                      {capitalize(type.TypeSubject)}
                    </SelectItem>
                  ))}
                </Select>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  onSubmit(editRubric, editRubric.subject_id);
                  onClose();
                }}
              >
                Update
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalUpdateSubject;
