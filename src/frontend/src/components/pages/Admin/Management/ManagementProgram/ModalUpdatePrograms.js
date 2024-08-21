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
import { convertToHTML, convertFromHTML } from 'draft-convert';

function ModalUpdatePrograms({
  isOpen,
  onOpenChange,
  onSubmit,
  editData,
  setEditData,
  loadData,
}) {
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
  useEffect(() => {
    const contentState = convertFromHTML(editData.description);
    setEditorState(EditorState.createWithContent(contentState));
  }, [editData.description]);

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
            <ModalHeader className="text-[#FF9908]">Cập nhật chương trình</ModalHeader>
            <ModalBody>
              <div className="w-full rounded-lg">
                <div className="w-full flex flex-col gap-2">
                  <Input
                    fullWidth
                    label="Mã chương trình"
                    name="program_id"
                    value={editData.program_id || ''}
                    onChange={handleChange}
                    disabled= {true}
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
                Cập nhật
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalUpdatePrograms;
