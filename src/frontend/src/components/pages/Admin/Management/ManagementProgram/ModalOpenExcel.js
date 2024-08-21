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

function ModalOpenExcel({
  isOpen,
  onOpenChange,
  onSubmit,
  loadData,
}) {
  const [fileList, setFileList] = useState([]);
  const [activeTab, setActiveTab] = useState('Form'); // Trạng thái để theo dõi tab hiện tại


  const handleDownloadTemplateExcel = async () => {
    try {
      const response = await axiosAdmin.get("/program/templates/post", {
        responseType: "blob",
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "ChuongTrinh.xlsx";
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
          <ModalHeader className="text-[#FF9908] text-2xl font-semibold">
            Nhập chương trình bằng Excel
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col h-full gap-6 p-6 rounded-lg">
              <div className="flex flex-wrap gap-6 justify-center items-center">
                <div className="flex flex-col card p-6 bg-white shadow-md rounded-lg justify-center items-center">
                  <h3 className="text-xl font-medium">Tải Mẫu Excel</h3>
                  <Button
                    className="bg-sky-500 text-white mt-4 w-[150px] hover:bg-sky-600 transition-all"
                    onClick={handleDownloadTemplateExcel}
                  >
                    Tải xuống mẫu
                  </Button>
                </div>
                <div className="flex flex-col card p-6 bg-white shadow-md rounded-lg justify-center items-center">
                  <h3 className="text-xl font-medium">Tải tệp lên</h3>
                  <label htmlFor="file-upload" className="cursor-pointer mt-4">
                    <Button className="w-[150px]" auto flat as="span" color="primary">
                      Chọn tệp
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
                    <div className="mt-4">
                      <ul className="space-y-2">
                        {fileList.map((file, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
                          >
                            <p className="text-sm font-medium">{file.name}</p>
                            <Button
                              auto
                              flat
                              color="error"
                              size="xs"
                              className="w-[40px]"
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
                <div className="flex flex-col card p-6 bg-white shadow-md rounded-lg justify-center items-center">
                  <h3 className="text-xl font-medium">Lưu dữ liệu</h3>
                  <CustomUpload
                    endpoint="program"
                    method="POST"
                    fileList={fileList}
                    setFileList={setFileList}
                    LoadData={loadData}
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="bg-gray-50 p-4 rounded-b-lg">
            <Button variant="light" onClick={onClose} className="mr-4">
              Hủy
            </Button>
        
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
  
  );
}

export default ModalOpenExcel;
