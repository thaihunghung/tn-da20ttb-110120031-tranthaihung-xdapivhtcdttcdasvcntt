import React, { useState, useEffect, useRef } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Button,
  Input
} from "@nextui-org/react";
import { axiosAdmin } from '../../../../../service/AxiosAdmin';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './Rubic.css';



function ModalUpdateRubicItems({
  isOpen, onOpenChange, onSubmit, editRubric,
  setEditRubric, CloData, ChapterData, PloData,
  cloId, chapterId, ploId, setCloId, setChapterId, setPloId, Score
}) {
  const [DataPlo, setDataPlo] = useState([]);
  const [Chapter, setDataChapter] = useState([]);
  const [DataClo, setDataClo] = useState([]);
  const [selectedClo, setSelectedClo] = useState();
  const [score, setSelectedScore] = useState();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);
  const isInitialized = useRef(false);

  const DataScore = [
    { id: '0.25', Score: '0.25' },
    { id: '0.5', Score: '0.5' },
    { id: '0.75', Score: '0.75' },
    { id: '1', Score: '1' },
    { id: '1.25', Score: '1.25' },
    { id: '1.5', Score: '1.5' },
    { id: '1.75', Score: '1.75' },
    { id: '2', Score: '2' },
  ];


  const handleSelectChangeClo = (e) => {
    const value = e.target.value;
    setEditRubric((prev) => ({
      ...prev,
      clo_id: value,
    }));
    setSelectedClo(value);
  };

  const handleSelectChangePlo = (e) => {
    const value = e.target.value;
    setEditRubric((prev) => ({
      ...prev,
      plo_id: value,
    }));
  };

  const handleSelectChangeChapter = (e) => {
    const value = e.target.value;
    setEditRubric((prev) => ({
      ...prev,
      chapter_id: value,
    }));
  };

  const handleScoreChange = (e) => {
    // Lấy giá trị từ sự kiện
    const value = parseFloat(e.target.value); // Chuyển giá trị thành số thực
    
    // Cập nhật state với giá trị số
    setEditRubric((prev) => ({
      ...prev,
      maxScore: value,
    }));
    
    // Ghi log giá trị số
    console.log("value");
    console.log(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Kiểm tra nếu giá trị là số và lớn hơn hoặc bằng 1
    if (!isNaN(value) && parseFloat(value) >= 1) {
      setEditRubric((prev) => ({
        ...prev,
        [name]: value
      }));
    } else {
      // Nếu không hợp lệ, không cập nhật giá trị
      setEditRubric((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  useEffect(() => {
    if (selectedClo) {


      const GetChapterByCloID = async (cloId) => {
        try {
          const response = await axiosAdmin.get(`/clo-chapter?clo_id=${cloId}`);
          setDataChapter(response.data);
        } catch (error) {
          console.error('Error fetching Chapter by CLO ID:', error);
        }
      };

      const GetPloByCloID = async (cloId) => {
        try {
          const response = await axiosAdmin.get(`/plo-clo?clo_id=${cloId}`);
          setDataPlo(response.data);
        } catch (error) {
          console.error('Error fetching PLO by CLO ID:', error);
        }
      };

      const timer = setTimeout(() => {
        GetChapterByCloID(selectedClo);
        GetPloByCloID(selectedClo);
        setChapterId('');
        setPloId('')
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setDataChapter([]);
      setDataPlo([]);
    }
  }, [selectedClo]);

  useEffect(() => {
    if (editorState) {
      let html = convertToHTML(editorState.getCurrentContent());
      setConvertedContent(html);
    }
  }, [editorState]);

  useEffect(() => {
    setDataClo(CloData);
    const contentState = convertFromHTML(editRubric.description);
    setEditorState(EditorState.createWithContent(contentState));
  }, [editRubric]);

  useEffect(() => {
    if (isOpen) {
      setDataChapter(ChapterData);
      setDataPlo(PloData);
    }

  }, [isOpen]);


  return (
    <div className='flex w-full flex-col justify-center pb-10 leading-8 pt-5 px-1 sm:px-4 lg:px-7 xl:px-7 bg-[#f5f5f5]-500'>
      <Modal
        isOpen={isOpen}
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
        onOpenChange={onOpenChange}
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[#FF9908]">Edit Rubric items</ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(editRubric, editRubric.rubricsItem_id, convertedContent);
                    onClose();
                  }}
                >
                  <div className='flex flex-col sm:flex-col sm:items-start lg:flex-row xl:flex-row justify-center items-center gap-2'>
                    <div className='flex-1 w-full sm:w-full items-center p-1 pb-0 sm:pb-0 lg:pb-5 xl:pb-5 justify-center flex flex-col gap-2 sm:flex-col lg:flex-col xl:flex-col'>
                      <div className='text-left w-full font-bold'>Chọn Clo:</div>
                      <Select
                        items={DataClo}
                        label="Lựa chọn"
                        name="clo_id"
                        defaultSelectedKeys={[cloId !== '' ? cloId : undefined]}
                        value={editRubric?.clo_id || ""}
                        onChange={handleSelectChangeClo}
                        className="text-wrap max-w-[500px]"
                        fullWidth
                      >
                        {DataClo.map((clo) => (
                          <SelectItem key={clo?.clo_id} value={clo?.clo_id} className="text-wrap">
                            {`${clo?.cloName}. ${clo.description}`}
                          </SelectItem>
                        ))}
                      </Select>

                      <div className='text-left w-full font-bold'>Chọn Plo:</div>
                      <Select
                        label="Lựa chọn"
                        name="plo_id"
                        defaultSelectedKeys={[ploId !== '' ? ploId : undefined]}
                        value={editRubric?.plo_id || ""}
                        onChange={handleSelectChangePlo}
                        className="text-wrap max-w-[500px]"
                        fullWidth
                      >
                        {DataPlo.map((plo) => (
                          <SelectItem key={plo?.plo_id} value={plo?.plo_id} className="text-wrap">
                            {`${plo?.ploName}. ${plo.description}`}
                          </SelectItem>
                        ))}
                      </Select>

                      <div className='text-left w-full font-bold'>Chọn Chapter:</div>
                      <Select
                        label="Lựa chọn"
                        name="chapter_id"
                        defaultSelectedKeys={[chapterId !== '' ? chapterId : undefined]}
                        value={editRubric?.chapter_id || ""}
                        onChange={handleSelectChangeChapter}
                        className="text-wrap max-w-[500px]"
                        fullWidth
                      >
                        {Chapter.map((chapter) => (
                          <SelectItem key={chapter?.chapter_id} value={chapter?.chapter_id} className="text-wrap">
                            {`${chapter?.chapterName}. ${chapter.description}`}
                          </SelectItem>
                        ))}
                      </Select>

                      <div className='text-left w-full font-bold'>Nhập điểm:</div>
                      <Select
                        label="Chọn điểm"
                        name="score"
                        value={editRubric?.maxScore || '0.25'}
                        defaultSelectedKeys={[Score]}
                        onChange={handleScoreChange}
                        className="w-full"
                      >
                        {DataScore.map((score) => (
                          <SelectItem key={score.id} value={score.Score} className="text-wrap">
                            {score.Score}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className='flex flex-1 flex-col w-full sm:w-full items-start p-1 pb-[60px]'>
                      <span className='text-justify font-bold'>Tiêu chí:</span>
                      <Editor
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                        wrapperClassName="wrapper-class w-full"
                        editorClassName="editor-class px-5 border w-full"
                        toolbarClassName="toolbar-class"
                      />
                      <span className='text-justify font-bold mt-2'>STT:</span>
                      <Input
                        fullWidth
                        type="number"
                        label=""
                        name="stt"
                        value={editRubric.stt}
                        onChange={handleChange}
                        required
                        min="1" // Đảm bảo giá trị không nhỏ hơn 1
                        step="1" // Chỉ cho phép nhập các số nguyên
                        className="w-fit"
                      />
                    </div>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onClick={onClose}>Cancel</Button>
                <Button
                  type="submit"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    onSubmit(editRubric, editRubric.rubricsItem_id, convertedContent);
                    onClose();
                  }}
                >
                  Update
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ModalUpdateRubicItems;
