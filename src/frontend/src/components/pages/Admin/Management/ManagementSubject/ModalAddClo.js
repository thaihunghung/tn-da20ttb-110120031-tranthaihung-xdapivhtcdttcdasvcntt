import React, { useState } from "react";
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
  Tabs,
  Tab,
  Textarea,
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";
import { capitalize } from "../../Utils/capitalize";

function ModalAddClo({
  isOpen,
  onOpenChange,
  onSubmit,
  editData,
  setEditData,
}) {
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState('Form'); // Trạng thái để theo dõi tab hiện tại

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleDownloadTemplateExcel = async () => {
    try {
      const response = await axiosAdmin.get("/clo/templates/post", {
        responseType: "blob",
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "clo.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleFileChange = (e) => {
    setFileList([...e.target.files]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFileList((currentFiles) =>
      currentFiles.filter((_, index) => index !== indexToRemove)
    );
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
    <Modal
      className="max-w-lg"
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
            <ModalHeader className="text-[#FF9908]">Tạo mới CĐR HP</ModalHeader>
            <ModalBody>
    
                  <div className="flex flex-col h-full">
                    <form
                      className="flex flex-col gap-3 h-full"
                      onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(editData);
                        onClose();
                      }}
                    >
                      <Input
                        fullWidth
                        label="Mã CLO"
                        name="cloName"
                        value={editData.cloName || ''}
                        onChange={handleChange}
                        required
                      />
                      <Textarea
                        fullWidth
                        label="Mô tả"
                        name="description"
                        placeholder="Nhập mô tả"
                        value={editData.description || ''}
                        onChange={handleChange}
                        rows={4}
                        minRows={4}
                        maxRows={6}
                      />
                      <Select
                        label="Loại CĐR"
                        name="typesubject"
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
                  </div>
            
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Hủy
              </Button>
              {activeTab !== 'Excel' && (
                <Button
                  type="submit"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit(editData);
                    onClose();
                  }}
                >
                  Tạo
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalAddClo;
