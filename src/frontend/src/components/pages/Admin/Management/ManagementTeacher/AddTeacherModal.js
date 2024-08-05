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
  Divider,
  Button,
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import CustomUpload from "../../CustomUpload/CustomUpload";
import { permissions } from "./Data";
import { capitalize } from "../../Utils/capitalize";

function AddTeacherModal({
  isOpen,
  onOpenChange,
  onSubmit,
  newTeacher,
  setNewTeacher,
}) {
  const [fileList, setFileList] = useState([]);
  const [current, setCurrent] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    setNewTeacher((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleDownloadTemplateExcel = async () => {
    try {
      const response = await axiosAdmin.get("/teacher/template/excel", {
        responseType: "blob",
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "Teacher.xlsx";
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
      className="max-w-lg "
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Tạo giáo viên mới</ModalHeader>
            <ModalBody>
              <div className="text-xl font-bold text-[#6366F1]">
                Thêm giáo viên bằng file excel
              </div>
              <div className="flex justify-between m-1 w-full ">
                <div className=" flex flex-col card p-3 justify-center items-center">
                  <h3>Tải Mẫu CSV</h3>
                  <Button
                    className="bg-sky-500/75 text-white"
                    onClick={handleDownloadTemplateExcel}
                  >
                    Tải xuống mẫu
                  </Button>
                </div>
                <div>
                  <div className="flex flex-col card p-3 justify-center items-center">
                    <h3>Upload File</h3>
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer"
                    >
                      <Button
                        className="w-[125px]"
                        auto
                        flat
                        as="span"
                        color="primary"
                      >
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
                          {fileList.map(
                            (file, index) => (
                              <li
                                key={index}
                                className="flex justify-between items-center"
                              >
                                <p>
                                  {file.name}
                                </p>
                                <Button
                                  auto
                                  flat
                                  color="error"
                                  size="xs"
                                  onClick={() =>
                                    handleRemoveFile(
                                      index
                                    )
                                  }
                                >
                                  X
                                </Button>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col card p-3 justify-center items-center  ">
                  <h3>Lưu file</h3>
                  <CustomUpload
                    endpoint="teacher"
                    method="POST"
                    setCurrent={setCurrent}
                    fileList={fileList}
                    setFileList={setFileList}
                  />
                </div>
              </div>

              <Divider className="my-4" />

              <div className="text-xl font-bold text-[#6366F1]">
                Nhập thông tin
              </div>
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit(newTeacher);
                  onClose();
                }}
              >
                <Input
                  fullWidth
                  label="Tên giáo viên"
                  name="name"
                  value={newTeacher.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Mã giáo viên"
                  name="teacherName"
                  value={newTeacher.teacherCode}
                  onChange={handleChange}
                  required
                />
                <Input
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={newTeacher.email}
                  onChange={handleChange}
                  required
                />
                <Select
                  label="Quyền truy cập"
                  name="permission"
                  value={newTeacher.permission}
                  onChange={handleSelectChange}
                  fullWidth
                  required
                >
                  {permissions.map((status) => (
                    <SelectItem
                      key={status.id}
                      value={status.id}
                    >
                      {capitalize(status.name)}
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
                  onSubmit(newTeacher);
                  onClose();
                }}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default AddTeacherModal;
