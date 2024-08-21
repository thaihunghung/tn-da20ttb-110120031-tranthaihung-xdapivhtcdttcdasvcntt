import React, { useEffect, useState } from "react";
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
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';

function ModalAddPrograms({
  isOpen,
  onOpenChange,
  onSubmit,
  editData,
  setEditData,
  loadData,
}) {
  const [fileList, setFileList] = useState([]);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);

  useEffect(() => {
    if (editorState) {
      let html = convertToHTML(editorState.getCurrentContent());
      setConvertedContent(html);
      setEditData((prev) => ({
        ...prev,
        description: html
      }));
    }
  }, [editorState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleDownloadTemplateExcel = async () => {
    try {
      const response = await axiosAdmin.get("/po/templates/post", {
        responseType: "blob",
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "po.xlsx";
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

      size="2xl"
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
            <ModalHeader className="text-[#FF9908]">Tạo chương trình</ModalHeader>
            <ModalBody>
              <div className="w-full rounded-lg">
                <div className="w-full flex flex-col gap-2">
                <Input
  fullWidth
  label="Mã chương trình"
  name="program_id"
  value={editData.program_id || ''}
  onChange={handleChange}
  required
/>

                  <Input
                    fullWidth
                    label="Tên chương trình"
                    name="programName"
                    value={editData.programName || ''}
                    onChange={handleChange}
                    required
                  />
                  <span className="font-bold text-left">Mô tả:</span>
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    wrapperClassName="wrapper-class w-full"
                    editorClassName="editor-class min-h-[100px] px-5 border w-full"
                    toolbarClassName="toolbar-class"
                  />
                </div>
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
                  onSubmit(editData);
                  onClose();
                }}
              >
                Tạo
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalAddPrograms;
