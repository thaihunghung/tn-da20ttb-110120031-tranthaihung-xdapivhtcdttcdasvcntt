import React, { useState, useEffect } from 'react';
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
import { capitalize } from "../../Utils/capitalize";

import { convertToHTML, convertFromHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useNavigate, useParams } from "react-router-dom";
import './Rubic.css';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';

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

function CreateRubicItems({
  isOpen,
  onOpenChange,
  onSubmit,
  newRubicItem,
  setNewRubicItem,
  CloData
}) {
  const [selectedClo, setSelectedClo] = useState(null);
  const [DataChapter, setDataChapter] = useState([]);
  const [DataPlo, setDataPlo] = useState([]);
  const [selectedPlo, setSelectedPlo] = useState(''); 
  const [selectedChapter, setSelectedChapter] = useState(''); 
  const handleSelectChangeClo = (e) => {
    const value = parseInt(e.target.value);
    setNewRubicItem((prev) => ({
      ...prev,
      clo_id: value,
    })); 
    setSelectedClo(value);
  };

  const handleSelectChangePlo = (e) => {
    const value = parseInt(e.target.value);
    setNewRubicItem((prev) => ({
      ...prev,
      plo_id: value,
    }));
  };

  const handleSelectChangeChapter = (e) => {
    const value = parseInt(e.target.value);
    setNewRubicItem((prev) => ({
      ...prev,
      chapter_id: value,
    }));
  };

  const handleScoreChange = (e) => {
    const value = parseFloat(e.target.value); // Chuyển giá trị thành số thực
    setNewRubicItem((prev) => ({
      ...prev,
      maxScore: value,
    }));
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
        setSelectedPlo('');
        setSelectedChapter('');
      }, 100);

      return () => clearTimeout(timer);
    } else {
      setDataChapter([]);
      setDataPlo([]);
    }
  }, [selectedClo]);

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);

  useEffect(() => {
    if (editorState) {
      let html = convertToHTML(editorState.getCurrentContent());
      setConvertedContent(html);
      setNewRubicItem((prev) => ({
        ...prev,
        description: html
      }));
    }
  }, [editorState]);

  return (
    <div className='flex w-full flex-col justify-center pb-10 leading-8 pt-5 px-1 sm:px-4 lg:px-7 xl:px-7 bg-[#f5f5f5]-500'>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="outside"
        size="5xl"
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
              <ModalHeader className="flex flex-col gap-1 text-[#FF9908]">Create Rubric items</ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit(newRubicItem);
                    onClose();
                  }}
                >
                  <div className='flex flex-col sm:flex-col sm:items-start lg:flex-row xl:flex-row justify-center items-center gap-2'>
                    <div className='flex-1 w-full sm:w-full items-center p-1 pb-0 sm:pb-0 lg:pb-5 xl:pb-5 justify-center flex flex-col gap-2 sm:flex-col lg:flex-col xl:flex-col'>
                      <div className='text-left w-full font-bold'>Chọn Clo:</div>
                      <Select
                        label="Lựa chọn"
                        name="clo_id"
                        value={newRubicItem?.clo_id || ""}
                        onChange={handleSelectChangeClo}
                        className="text-wrap max-w-[500px]"
                        fullWidth
                      >
                        {CloData.map((clo) => (
                          <SelectItem key={clo?.clo_id} value={clo?.clo_id} className="text-wrap">
                            {`${clo?.cloName}. ${clo.description}`}
                          </SelectItem>
                        ))}
                      </Select>
                      <div className='text-left w-full font-bold'>Chọn Plo:</div>
                      <Select
                        label="Lựa chọn"
                        name="plo_id"
                        value={newRubicItem?.plo_id || ""}
                        defaultSelectedKeys={[selectedPlo]}
                        onChange={handleSelectChangePlo}
                        className="text-wrap max-w-[500px]"
                        fullWidth
                        disabled={!selectedClo}
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
                        value={newRubicItem?.chapter_id || ""}
                        onChange={handleSelectChangeChapter}
                        className="text-wrap max-w-[500px]"
                        defaultSelectedKeys={[selectedChapter]}
                        fullWidth
                        disabled={!selectedClo}
                      >
                        {DataChapter.map((chapter) => (
                          <SelectItem key={chapter?.chapter_id} value={chapter?.chapter_id} className="text-wrap">
                            {`${chapter?.chapterName}. ${chapter.description}`}
                          </SelectItem>
                        ))}
                      </Select>
                      <div className='text-left w-full font-bold'>Nhập điểm:</div>
                      <Select
                        label="Chọn điểm"
                        name="score"
                        value={newRubicItem?.maxScore}
                    
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
                    </div>
                  </div>
                  <Divider />
         
                  <div className='w-full flex flex-row justify-end gap-2'>
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={onClose}
                      className='w-[100px] sm:w-[150px] md:w-[200px]'
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      className='w-[100px] sm:w-[150px] md:w-[200px]'
                      onClick={(e) => {
                        e.preventDefault();
                        onSubmit(newRubicItem);
                        onClose();
                      }}
                    >
                      Lưu
                    </Button>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter />
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default CreateRubicItems;
