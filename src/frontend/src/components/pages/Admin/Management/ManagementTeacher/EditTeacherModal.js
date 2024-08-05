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
import { permissions } from "./Data";

function EditTeacherModal({ isOpen, onOpenChange, onSubmit, editTeacher, setEditTeacher }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    setEditTeacher((prev) => ({
      ...prev,
      permission: e.target.value,
    }));
  };

  console.log("editTeacher", editTeacher)
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Edit Teacher</ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit(editTeacher, editTeacher.teacher_id);
                  onClose();
                }}>
                <Input
                  fullWidth
                  label="Name"
                  name="name"
                  value={editTeacher.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={editTeacher.email}
                  onChange={handleChange}
                  required
                />
                <Select
                  label="Permission"
                  name="permission"
                  defaultSelectedKeys={[editTeacher.permission]}
                  value={editTeacher?.permission}
                  onChange={handleSelectChange}
                  fullWidth
                >
                  {permissions.map((permission) => (
                    <SelectItem key={permission?.id} value={permission?.id}>
                      {capitalize(permission?.name)}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  fullWidth
                  label="Type"
                  name="typeTeacher"
                  value={editTeacher.typeTeacher}
                  onChange={handleChange}
                  required
                />
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
                  onSubmit(editTeacher, editTeacher.teacher_id);
                  onClose();
                }}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default EditTeacherModal;
