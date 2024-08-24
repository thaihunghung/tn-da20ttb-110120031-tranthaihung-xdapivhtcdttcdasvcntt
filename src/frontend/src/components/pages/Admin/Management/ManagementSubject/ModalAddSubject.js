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

function ModalAddSubject({
  isOpen,
  onOpenChange,
  onSubmit,
  newRubric,
  setNewRubric,
}) {
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState('Form'); // Trạng thái để theo dõi tab hiện tại

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRubric((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const Value = e.target.value;
    setNewRubric((prev) => ({
      ...prev,
      typesubject: Value,
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
      size="3xl"
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
            <ModalHeader className="text-[#FF9908]">Tạo mới học phần</ModalHeader>
            <ModalBody>
                  <div className="flex flex-col h-full">
                    <form
                      className="flex flex-col gap-3 h-full"
                      onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(newRubric, newRubric.subject_id);
                        onClose();
                      }}
                    >
                      <Input
                        fullWidth
                        label="Tên HP"
                        name="subjectName"
                        value={newRubric.subjectName || ''}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        fullWidth
                        label="Mã HP"
                        name="subjectCode"
                        value={newRubric.subjectCode || ''}
                        onChange={handleChange}
                        required
                      />
                      <Textarea
                        fullWidth
                        label="Mô tả"
                        name="description"
                        placeholder="Enter your description"
                        value={newRubric.description || ''}
                        onChange={handleChange}
                        rows={4}
                        minRows={4}
                        maxRows={6}
                      />
                      <Input
                        fullWidth
                        label="STC"
                        name="numberCredits"
                        type="number"
                        value={newRubric.numberCredits || ''}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        fullWidth
                        label="STC LT"
                        name="numberCreditsTheory"
                        type="number"
                        value={newRubric.numberCreditsTheory || ''}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        fullWidth
                        label="STC TH"
                        name="numberCreditsPractice"
                        type="number"
                        value={newRubric.numberCreditsPractice || ''}
                        onChange={handleChange}
                        required
                      />
                      <Select
                        label="Loại HP"
                        name="typesubject"
                        value={newRubric.typesubject || ''}
                        onChange={(value) => handleSelectChange(value)}
                        fullWidth
                      >
                        {DataTypeSubject.map((type) => (
                          <SelectItem key={type.key} value={type.TypeSubject}>
                            {capitalize(type.TypeSubject)}
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
             
                <Button
                  type="submit"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit(newRubric);
                    onClose();
                  }}
                >
                  Tạo mới
                </Button>
              
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalAddSubject;
