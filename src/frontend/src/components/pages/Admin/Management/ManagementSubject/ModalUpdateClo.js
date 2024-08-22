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
  Textarea,
} from "@nextui-org/react";
import { capitalize } from "../../Utils/capitalize";

function ModalUpdateClo({ isOpen, onOpenChange, onSubmit, editData, setEditData }) {

  // Xử lý thay đổi các giá trị của các trường nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const DataType = [
    { key: 'Kiến thức', Type: 'Kiến thức' },
    { key: 'Thái độ', Type: 'Thái độ' },
    { key: 'Kỹ năng', Type: 'Kỹ năng' },
  ];
  const handleSelectChange = (event) => {
    const { value } = event.target; // Lấy giá trị từ event.target
    setEditData((prev) => ({
      ...prev,
      type: value,
    }));
  };
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='text-[#FF9908]'>Edit Clo</ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit(editData, editData.clo_id);
                  onClose();
                }}>
                <Input
                  fullWidth
                  label="Clo Name"
                  name="cloName"
                  value={editData.cloName || ''}
                  onChange={handleChange}
                  required
                />
                 <Textarea
                  fullWidth
                  label="Description"
                  name="description"
                  placeholder="Enter your description"
                  value={editData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  minRows={4} 
                  maxRows={6} 
                />
                <Select
                        label="Loại CĐR"
                        name="typesubject"
                        defaultSelectedKeys={[editData.type]}
                        value={editData.type || ''}
                        onChange={(value) => handleSelectChange(value)}
                        fullWidth
                      >
                        {DataType.map((type) => (
                          <SelectItem key={type.key} value={type.Type}>
                            {capitalize(type.Type)}
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
                  onSubmit(editData, editData.clo_id);
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

export default ModalUpdateClo;
