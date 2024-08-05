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
            <ModalHeader className="text-[#FF9908]">Cập nhật đề tài</ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-wrap gap-6 justify-center items-start">
                  <div className="flex flex-col bg-white shadow-md rounded-lg p-4 justify-center items-center w-full md:w-auto">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Tải Mẫu Excel</h3>
                    <Button
                      className="bg-sky-500 text-white w-[125px] disabled:opacity-50"
                      onClick={download}
                    >
                      Tải mẫu
                    </Button>
                  </div>

                  <div className="flex flex-col bg-white shadow-md rounded-lg p-4 justify-center items-center w-full md:w-auto">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Tải mẫu lại</h3>
                    <label htmlFor="file-upload" className="cursor-pointer w-[125px]">
                      <Button className="w-full bg-blue-500 text-white" auto flat as="span" color="primary">
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
                      <div className="mt-2 w-full">
                        <ul className="space-y-2">
                          {fileList.map((file, index) => (
                            <li
                              key={index}
                              className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                            >
                              <p className="text-gray-700">{file.name}</p>
                              <Button
                                auto
                                flat
                                color="error"
                                size="xs"
                                className="bg-red-500 text-white px-2 py-1 rounded-md"
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

                  <div className="flex flex-col bg-white shadow-md rounded-lg p-4 justify-center items-center w-full md:w-auto">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Cập nhật</h3>
                    <CustomUpload
                      endpoint={'/meta-assessment/updateDescription'}
                      fileList={fileList}
                      setFileList={setFileList}
                      LoadData={LoadData}
                    />

                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onClick={() => {
                  onClose();
                }}
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
