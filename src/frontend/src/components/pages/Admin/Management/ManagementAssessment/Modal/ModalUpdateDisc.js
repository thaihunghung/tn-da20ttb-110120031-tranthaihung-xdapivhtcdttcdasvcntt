import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Button, Textarea, } from "@nextui-org/react";

import Cookies from "js-cookie";

import { fetchDataGetMetaIdByGeneralDescription } from '../Data/DataAssessment';
import { message } from 'antd';
import { axiosAdmin } from '../../../../../../service/AxiosAdmin';
import { UseTeacherAuth } from '../../../../../../hooks';
import CustomUpload from '../../../CustomUpload/CustomUpload';

function ModalUpdateDisc({ isOpen, onOpenChange, download, LoadData }) {
  UseTeacherAuth()
  const [fileList, setFileList] = useState([]);
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
      size="4xl"
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
              Cập nhật đề tài
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col h-full gap-6 p-6 rounded-lg">
                <div className="flex flex-wrap gap-6 justify-center items-start">
                  <div className="flex flex-col card p-6 bg-white shadow-md rounded-lg justify-center items-center w-full md:w-auto">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Tải Mẫu Excel</h3>
                    <Button
                      className="bg-sky-500 text-white mt-4 w-[150px] hover:bg-sky-600 transition-all"
                      onClick={download}
                    >
                      Tải mẫu
                    </Button>
                  </div>
  
                  <div className="flex flex-col card p-6 bg-white shadow-md rounded-lg justify-center items-center w-full md:w-auto">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Tải mẫu lại</h3>
                    <label htmlFor="file-upload" className="cursor-pointer mt-4">
                      <Button className="w-[150px]" auto flat as="span" color="primary">
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
                      <div className="mt-4 w-full">
                        <ul className="space-y-2">
                          {fileList.map((file, index) => (
                            <li
                              key={index}
                              className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
                            >
                              <p className="text-sm font-medium text-gray-700">{file.name}</p>
                              <Button
                                auto
                                flat
                                color="error"
                                size="xs"
                                className="w-[40px] bg-red-500 text-white"
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
  
                  <div className="flex flex-col card p-6 bg-white shadow-md rounded-lg justify-center items-center w-full md:w-auto">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Cập nhật</h3>
                    <CustomUpload
                      endpoint="/meta-assessment/updateDescription"
                      fileList={fileList}
                      setFileList={setFileList}
                      LoadData={LoadData}
                    />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="bg-gray-50 p-4 rounded-b-lg">
              <Button
                variant="light"
                onClick={onClose}
                className="mr-4"
              >
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
  
  
};

export default ModalUpdateDisc;
