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


  const handleDownloadTemplateExcel = async () => {
    try {
      const response = await axiosAdmin.get("/subject/templates/post", {
        responseType: "blob",
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "subject.xlsx";
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
            <ModalHeader className="text-[#FF9908]">Create Subject</ModalHeader>
            <ModalBody>
              <Tabs
                aria-label="Tabs colors"
                radius="full"
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key)}
              >
                <Tab key="Form" title="Form">
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
                        label="Name"
                        name="subjectName"
                        value={newRubric.subjectName || ''}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        fullWidth
                        label="Code"
                        name="subjectCode"
                        value={newRubric.subjectCode || ''}
                        onChange={handleChange}
                        required
                      />
                      <Textarea
                        fullWidth
                        label="description"
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
                        label="Number Credits"
                        name="numberCredits"
                        type="number"
                        value={newRubric.numberCredits || ''}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        fullWidth
                        label="Number Credits Theory"
                        name="numberCreditsTheory"
                        type="number"
                        value={newRubric.numberCreditsTheory || ''}
                        onChange={handleChange}
                        required
                      />
                      <Input
                        fullWidth
                        label="Number Credits Practice"
                        name="numberCreditsPractice"
                        type="number"
                        value={newRubric.numberCreditsPractice || ''}
                        onChange={handleChange}
                        required
                      />
                      <Select
                        label="Type of Subject"
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
                </Tab>
                <Tab key="Excel" title="Excel">
                  <div className="flex flex-col h-full">
                    <div className="flex flex-col gap-4 p-4 flex-grow">
                      <div className="flex flex-wrap gap-4 justify-center items-center">
                        <div className="flex flex-col card p-3 justify-center items-center">
                          <h3>Tải Mẫu CSV</h3>
                          <Button
                            className="bg-sky-500 text-white w-[125px]"
                            onClick={handleDownloadTemplateExcel}
                          >
                            Tải xuống mẫu
                          </Button>
                        </div>
                        <div className="flex flex-col card p-3 justify-center items-center">
                          <h3>Upload File</h3>
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Button className="w-[125px]" auto flat as="span" color="primary">
                              Chọn file
                            </Button>
                          </label>
                          <input
                            id="file-upload"
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            multiple
                          />
                          {fileList.length > 0 && (
                            <div className="mt-2">
                              <ul>
                                {fileList.map((file, index) => (
                                  <li
                                    key={index}
                                    className="flex justify-between items-center"
                                  >
                                    <p>{file.name}</p>
                                    <Button
                                      auto
                                      flat
                                      color="error"
                                      size="xs"
                                      className='w-[125px]'
                                      onClick={() => handleRemoveFile(index)}
                                    >
                                      X
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col card p-3 justify-center items-center">
                          <h3>Lưu file</h3>
                          <CustomUpload
                            endpoint="subject"
                            method="POST"
                            fileList={fileList}
                            setFileList={setFileList}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Cancel
              </Button>
              {activeTab !== 'Excel' && (
                <Button
                  type="submit"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit(newRubric);
                    onClose();
                  }}
                >
                  Create
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalAddSubject;
