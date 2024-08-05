import React from 'react';
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@nextui-org/react";
import CustomUpload from "../../CustomUpload/CustomUpload";

const ExcelModal = ({
  isExcelModalOpen,
  handleCloseMoreModal,
  selectedCourse,
  handleDownloadTemplateExcel,
  handleFileChange,
  fileList,
  setFileList,
  setCurrent,
  setIsExcelModalOpen
}) => {
  return (
    <Modal
      size="2xl"
      backdrop="opaque"
      isOpen={isExcelModalOpen}
      onOpenChange={setIsExcelModalOpen}
      radius="lg"
      classNames={{
        body: "py-6",
        base: "border-[#292f46] bg-[#fefefe] dark:bg-[#19172c] text-[#292f46]",
        closeButton: "hover:bg-white/5 active:bg-white/10",
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"> Môn học {selectedCourse.courseCode} - {selectedCourse.courseName}</ModalHeader>
            <ModalBody>
              <div>Thêm sinh viên bằng file excel</div>
              <div className="flex justify-between m-1">
                <div className="card p-3">
                  <h3>Tải Mẫu CSV</h3>
                  <Button onClick={handleDownloadTemplateExcel}> Tải xuống mẫu </Button>
                </div>
                <div className="card p-3">
                  <div>
                    <h3>Upload File</h3>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Button auto flat as="span" color="primary">
                        Select File
                      </Button>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                      multiple
                    />
                    {fileList.length > 0 && (
                      <div className="mt-2">
                        <ul>
                          {fileList.map((file, index) => (
                            <li key={index} className="flex justify-between items-center">
                              <p>{file.name}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card p-3">
                  <h3>Upload Data</h3>
                  <CustomUpload
                    Data={selectedCourse.course_id}
                    endpoint='course-enrollment'
                    method="POST"
                    fileList={fileList}
                    setFileList={setFileList}
                    setCurrent={setCurrent}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="foreground" variant="light" onPress={handleCloseMoreModal}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ExcelModal;
