import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  Textarea,
} from "@nextui-org/react";

function ModalUpdateChapter({ isOpen, onOpenChange, onSubmit, editData, setEditData }) {

  // Xử lý thay đổi các giá trị của các trường nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='text-[#FF9908]'>Edit Chapter</ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit(editData, editData.chapter_id);
                  onClose();
                }}>
                <Input
                  fullWidth
                  label="Chapter Name"
                  name="chapterName"
                  value={editData.chapterName || ''}
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
                  onSubmit(editData, editData.chapter_id);
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

export default ModalUpdateChapter;
