import React, { useCallback, useEffect, useState } from "react";
import { Collapse, message } from 'antd';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, Button, Slider, Tooltip, Textarea } from "@nextui-org/react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';


import { axiosAdmin } from "../../../../../../service/AxiosAdmin";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "../css/FormGrading.css"
import "../css//Motion.css";

import BackButton from "../../../Utils/BackButton/BackButton";
import { ChevronDownIcon } from "../../../../../../public/ChevronDownIcon";

const FormGrading = (nav) => {

  const { setCollapsedNav } = nav;
  const { description } = useParams();
  const [selectedValues, setSelectedValues] = useState([]); // Initialize as array
  // const [RubicData, setRubicData] = useState([]);
  const [RubicItemsData, setRubicItemsData] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [Check, setCheck] = useState(0);
  const [defaultValue, setdefaultValue] = useState(0);

  const [showCLO, setShowCLO] = useState(false);
  const [showPLO, setShowPLO] = useState(false);
  const [showChapter, setShowChapter] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(new Set());
  const [showAll, setShowAll] = useState(false);

  const columns = [
    { uid: 'clo', name: 'CLO' },
    { uid: 'plo', name: 'PLO' },
    { uid: 'chapter', name: 'Chapter' },
  ];

  const handleSelectionChange = (keys) => {
    // Update state variables based on visible columns
    setShowCLO(keys.has('clo'));
    setShowPLO(keys.has('plo'));
    setShowChapter(keys.has('chapter'));

    // Update visibleColumns set
    if (keys.has('showAll')) {
      keys.delete('showAll');
    }
    setVisibleColumns(keys);
    setShowAll(keys.size === columns.length);
  };

  const handleShowAll = () => {
    if (showAll) {
      // If 'Show All' is already active, unselect everything
      setVisibleColumns(new Set());
      setShowCLO(false);
      setShowPLO(false);
      setShowChapter(false);
      setShowAll(false);
    } else {
      // Select all columns
      const allKeys = new Set(columns.map(column => column.uid));
      setVisibleColumns(allKeys);
      setShowCLO(true);
      setShowPLO(true);
      setShowChapter(true);
      setShowAll(true);
    }
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showFirst, setShowFirst] = useState(true);

  const showAny = showCLO || showPLO || showChapter;
  const showAtLeastTwo = [showCLO, showPLO, showChapter].filter(Boolean).length >= 2;
  const showAllThree = showCLO && showPLO && showChapter;
  const isContainerHidden = !showAny;

  // http://localhost:3000/admin/management-grading/update/100000_-_it31_khai_pha_du_lieu_da20ttb_bao_cao_ket_thuc_mon_test_2024-07-22/student-code/110120013/assessment/855/rubric/1

  const { assessment_id, rubric_id } = useParams();
  const navigate = useNavigate();
  const teacher_id = Cookies.get('teacher_id');

  if (!teacher_id) {
    navigate('/login');
  }
  const handleNavigate = (path) => {
    navigate(path);
  };
  const params = new URLSearchParams(window.location.search);
  const filterScore = params.get('FilterScore');

  const handleSliderChange = (index, value, rubricsItem_id) => {
    setSelectedValues(prevValues => {
      if (!Array.isArray(prevValues)) {
        prevValues = [];
      }

      const updatedValues = [...prevValues];
      updatedValues[index] = {
        assessment_id: assessment_id,
        rubricsItem_id: rubricsItem_id,
        maxScore: value,
        CheckGrading: true,
      };

      const newTotalScore = updatedValues.reduce((acc, curr) => {
        if (curr && typeof curr.maxScore === 'number') {
          return acc + curr.maxScore;
        }
        return acc;
      }, 0);

      const Check = updatedValues.reduce((acc, curr) => {
        // Check if curr is an object and CheckGrading is true
        if (curr && curr.CheckGrading === true) {
          return acc + 1; // Increment the count by 1
        }
        return acc; // Otherwise, return the accumulated count
      }, 0);
      setCheck(Check)
      setTotalScore(newTotalScore);
      return updatedValues;
    });
  };


  const handleSave = async () => {
    console.log('Updated values', selectedValues);
    console.log('totalScore', totalScore);
    if (Check === 0) {
      message.error('Score not graded yet');
      return;
    }
    try {
      const data = { totalScore: totalScore }

      await axiosAdmin.patch(`/assessment/${assessment_id}/totalScore`, { data: data })
      const dataAssessmentItem = selectedValues.map(item => {
        const { maxScore, CheckGrading, ...rest } = item;
        return {
          ...rest,
          assessmentScore: maxScore
        };
      });

      console.log(Check);

      const response = await axiosAdmin.post(`/assessment-item`, { data: dataAssessmentItem })
      if (response.status === 201) {
        message.success('Data saved successfully');
        setIsModalWhenSaveOpen(true);
      }
    } catch (e) {
      console.error(e);
      message.error('Error saving data');
    }
  };



  // const GetRubricData = async () => {
  //   try {
  //     const response = await axiosAdmin.get(`/rubric/${rubric_id}/items?isDelete=false`);
  //     setRubicData(response.data.rubric)
  //     setRubicItemsData(response.data.rubric.rubricItems)
  //     const data = response.data.rubric.rubricItems
  //     setValue(data)
  //     // console.log("response.data");
  //     // console.log(response.data);
  //   } catch (error) {
  //     console.error('Error fetching rubric data:', error);
  //     throw error;
  //   }
  // };
  const [Assessment, setAssessment] = useState({});
  const [CurrentTeacher, setCurrentTeacher] = useState(false);

  // const getAssessments = async () => {
  //   try {

  //     const response = await axiosAdmin.get(`/assessment/${assessment_id}`);
  //     console.log(response?.data);
  //     setAssessment(response?.data)
  //   } catch (error) {
  //     console.error('Error fetching rubric data:', error);
  //     throw error;
  //   }
  // };
  useEffect(() => {
    if (parseInt(Assessment?.MetaAssessment?.teacher_id) === parseInt(teacher_id)) {
      setCurrentTeacher(true)
    }
  }, [teacher_id, Assessment]);

  const setValue = useCallback((data) => {
    const updatedPoData = data.map((subject) => ({
      assessment_id: assessment_id,
      rubricsItem_id: subject.rubricsItem_id,
      maxScore: 0.0,
      CheckGrading: false,
    }));

    setSelectedValues(updatedPoData);
  }, [assessment_id]);

  const getAssessments = useCallback(async () => {
    try {
      const response = await axiosAdmin.get(`/assessment/${assessment_id}`);
      console.log(response?.data);
      setAssessment(response?.data);
    } catch (error) {
      console.error('Error fetching assessment data:', error);
    }
  }, [assessment_id]);

  const GetRubricData = useCallback(async () => {
    try {
      const response = await axiosAdmin.get(`/rubric/${rubric_id}/items?isDelete=false`);
      //setRubicData(response.data.rubric);
      setRubicItemsData(response.data.rubric.rubricItems);
      setValue(response.data.rubric.rubricItems);
    } catch (error) {
      console.error('Error fetching rubric data:', error);
    }
  }, [rubric_id, setRubicItemsData, setValue]);

  useEffect(() => {
    if (setCheck === 0) {
      setTotalScore(0);
      setdefaultValue(0);
    }
    getAssessments();
    GetRubricData();
    setCollapsedNav(true);

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowCLO(true);
        setShowPLO(false);
        setShowChapter(false);
        setVisibleColumns(new Set(['clo']));
      } else {
        setShowCLO(true);
        setShowPLO(true);
        setShowChapter(true);
        setVisibleColumns(new Set(['clo', 'plo', 'chapter']));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [getAssessments, GetRubricData, setCheck, setCollapsedNav]);



  const handleUpdateTopic = async () => {
    try {
      const response = await axiosAdmin.patch(`/meta-assessment/${Assessment?.MetaAssessment?.meta_assessment_id}`, { description: Assessment?.MetaAssessment?.description });
      if (response.status === 200) {
        message.success('Topic updated successfully');
        getAssessments();  // Refresh the assessment data after update
      } else {
        message.error('Error updating topic');
      }
    } catch (error) {
      console.error('Error updating topic:', error);
      message.error('Error updating topic');
    }
  };


  const [isModalWhenSaveOpen, setIsModalWhenSaveOpen] = useState(false);

  return (
    <div className="w-full p-2 pb-[100px] py-0 flex flex-col leading-6">
      <div className="w-full min-h-[200px] bg-[#FEFEFE] border border-slate-300 shadow-lg rounded-md mb-2 p-4">
        <h1 className="text-xl font-bold mb-2 text-[#6366F1]">{Assessment?.MetaAssessment?.generalDescription}</h1>
        <div className="flex items-center text-lg flex-col font-bold justify-center">
          <span className="text-[#020401]">{Assessment?.MetaAssessment?.Student?.name}</span>   <span className="text-[#020401]">{Assessment?.MetaAssessment?.Student?.studentCode}</span>
        </div>
        <div className="flex items-center text-lg flex-col font-bold justify-center">
          <Textarea
            className="max-w-[700px]"
            label="Đề tài"
            value={Assessment?.MetaAssessment?.description}
            onChange={(e) => setAssessment(prev => ({ ...prev, MetaAssessment: { ...prev.MetaAssessment, description: e.target.value } }))}
          />
          <Button
            color="primary"
            className="w-fit p-5 mt-3"
            isDisabled={!CurrentTeacher}
            onPress={handleUpdateTopic}
          >
            Cập nhật tên đề tài
          </Button>
        </div>
        <div className="hidden sm:block">
          <BackButton path={`/admin/management-grading/${description}/?description=${Assessment?.MetaAssessment?.generalDescription}`} />
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Xác nhận lưu</ModalHeader>
              <ModalBody>
                <p>Bạn muốn lưu không?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Hủy
                </Button>
                <Button color="primary" onPress={() => { handleSave(); onClose(); }}>
                  lưu
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ModalWhenSave
        isOpen={isModalWhenSaveOpen}
        onOpenChange={setIsModalWhenSaveOpen}
        totalScore={totalScore}
        assessment={Assessment}
        handleBack={handleNavigate}
        disc={description}
        filterScore={filterScore}
      />
      <div className="Quick__Option  flex justify-between items-center sticky top-0 bg-white z-50 w-fit p-4 py-3 shadow-lg rounded-md border border-slate-300">
        <div
          className={`flex items-center transition-opacity duration-500 ${showFirst ? 'opacity-100' : 'opacity-0'
            } ${showFirst ? 'block' : 'hidden'}`}
        >

          <div className="flex gap-1 justify-center items-center">
            <div className="flex items-center gap-2 mx-2 mr-2">
              <Tooltip content="Lưu">
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  onClick={onOpen}
                  className="text-[#020401] bg-[#AF84DD]"
                >
                  <i className="fa-solid fa-floppy-disk text-[18px]"></i>
                </Button>
              </Tooltip>
            </div>
            <div className="flex justify-center items-center gap-1 flex-col mx-2">
              <span>Tổng điểm: {' ' + totalScore} </span>
              <span>Tiêu chí: {Check}/{RubicItemsData.length}</span>

            </div>
          </div>
          <div>
            <div className="flex gap-4 p-4">
              <Dropdown>
                <DropdownTrigger className="sm:flex">
                  <Button endContent={<ChevronDownIcon className="text-small" />} size="sm" variant="flat">
                    Columns
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Table Columns"
                  closeOnSelect={false}
                  selectedKeys={visibleColumns}
                  selectionMode="multiple"
                  onSelectionChange={handleSelectionChange}
                >
                  <DropdownItem
                    key="showAll"
                    onClick={handleShowAll}
                    className="capitalize"
                  >
                    {showAll ? 'Unselect All' : 'Show All'}
                  </DropdownItem>
                  {columns.map((column) => (
                    <DropdownItem key={column.uid} className="capitalize">
                      {column.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {showFirst ? (
            <Button
              isIconOnly
              //variant="light"
              radius="full"
              onClick={() => setShowFirst(false)}
            >
              <i className="fa-solid fa-chevron-left text-[#475569]"></i>
            </Button>
          ) : (
            <Button
              isIconOnly
              //variant="light"
              radius="full"
              onClick={() => setShowFirst(true)}
            >
              <i className="fa-solid fa-chevron-right text-[#475569]"></i>
            </Button>
          )}
        </div>
      </div>



      <div className="flex flex-col items-start justify-start relative">
        <div className="w-full flex flex-col p-2 py-0 mb-2 text-base  sm:p-5 sm:mb-2 sm:py-0 sm:flex-col lg:flex-row lg:mb-0 xl:flex-row xl:mb-0">
          <div className={`
        ${isContainerHidden ? 'lg:w-[50%]' : ''}   ${showAny ? 'lg:w-[70%]' : ''} ${showAtLeastTwo ? 'lg:w-[70%]' : ''} ${showAllThree ? 'lg:w-[70%]' : ''} 
        w-full text-justify   flex flex-col sm:flex-col lg:flex-row xl:flex-row`}>
            <div className={`${showAny ? 'lg:w-[40%]' : ''} ${showAtLeastTwo ? 'lg:w-[40%]' : ''} ${showAllThree ? 'lg:w-[80%]' : ''} flex justify-center items-center`}>
              <div className={`hidden p-2 bg-[#475569] ${showChapter ? 'lg:block xl:block' : 'hidden'} sm:hidden flex-1`}>
                <p className=" text-[#fefefe] text-center font-bold">CHAPTER</p>
              </div>
              <div className={`hidden p-2 bg-[#475569] ${showPLO ? 'lg:block xl:block' : 'hidden'} sm:hidden flex-1`}>
                <p className=" text-[#fefefe] text-center font-bold">PLO</p>
              </div>
              <div className={`hidden p-2 bg-[#475569] ${showCLO ? 'lg:block xl:block' : 'hidden'} sm:hidden flex-1`}>
                <p className=" text-[#fefefe] text-center font-bold">CLO</p>
              </div>
            </div>

            <div className={`w-full ${isContainerHidden ? 'lg:w-full' : ''} ${showAtLeastTwo ? 'lg:w-[60%]' : ''} ${showAllThree ? 'lg:w-[20%]' : ''} p-0 sm:p-0 lg:p-2 xl:p-2 bg-[#475569]`}>
              <p className="text-center font-bold hidden sm:hidden lg:block xl:block text-[#fefefe] p-5 sm:p-5 lg:p-0 xl:p-0">Nội dung</p>
              <p className="text-center font-bold block sm:block lg:hidden xl:hidden text-[#fefefe] p-5 sm:p-5 lg:p-0 xl:p-0">Chấm điểm</p>
            </div>
          </div>
          <div className={`hidden w-full bg-[#475569] sm:hidden ${isContainerHidden ? 'lg:w-[50%]' : ''}   ${showAny ? 'lg:w-[30%]' : ''} ${showAtLeastTwo ? 'lg:w-[30%]' : ''} ${showAllThree ? 'lg:w-[30%]' : ''}     lg:block xl:block text-justify p-5 pb-0 pt-2`}>
            <p className="text-center font-bold  text-[#fefefe]">Chấm điểm</p>
          </div>
        </div>
        {
          RubicItemsData.map((item, i) => (
            <div className="w-full flex flex-col p-2 py-0 sm:p-5 sm:py-0 sm:flex-col lg:flex-row xl:flex-row" key={item.rubricsItem_id}>
              {/* Left Side */}
              <div className={`
              ${isContainerHidden ? 'lg:w-[50%]' : ''}   ${showAny ? 'lg:w-[70%]' : ''} ${showAtLeastTwo ? 'lg:w-[70%]' : ''} ${showAllThree ? 'lg:w-[70%]' : ''}  
              w-full rounded-b-lg sm:rounded-b-lg lg:rounded-none xl:rounded-none 
              text-justify border-[1px] sm:border-t-[1px] lg:border-t-0 xl:border-t-0 border-[#020401]  
              flex flex-col sm:flex-col lg:flex-row xl:flex-row`}
              >

                <div className={`w-full ${showAny ? 'lg:w-[40%]' : ''} ${showAtLeastTwo ? 'lg:w-[40%]' : ''} ${showAllThree ? 'lg:w-[80%]' : ''} border-b-1 
                      sm:border-b-1 border-r-0 sm:border-r-0 sm:px-0 lg:border-r-[1px] 
                      lg:border-b-0 xl:border-r-[1px] xl:border-b-0  border-[#020401] 
                      flex justify-center items-start leading-8 ${isContainerHidden ? 'hidden' : ''}`}>

                  <div className={`w-full h-full flex-1 hidden sm:hidden ${showChapter ? 'lg:block xl:block' : ''}  
                border-b-1 sm:border-b-1 border-r-1 sm:border-r-1 sm:px-0 lg:border-r-[1px] lg:border-b-0 xl:border-r-[1px] xl:border-b-0  border-[#020401] `}>
                    <div className="p-4 overflow-y-auto">
                      <div className="text-center font-bold  max-h-[300px] sm:font-bold lg:font-normal xl:font-normal text-[#AF84DD] sm:text-[#AF84DD] lg:text-[#020401] xl:text-[#020401]">
                        <div className="font-bold">{item.Chapter.chapterName}:</div>
                        <div className="w-full text-wrap">{item.Chapter.description}</div>
                      </div>
                    </div>
                  </div>
                  <div className={`w-full h-full flex-1 hidden sm:hidden ${showPLO ? 'lg:block xl:block' : 'hidden'}  border-b-1 sm:border-b-1 border-r-1 sm:border-r-1 sm:px-0 lg:border-r-[1px] lg:border-b-0 xl:border-r-[1px] xl:border-b-0  border-[#020401] `}>
                    <div className="p-4 overflow-y-auto">
                      <div className="text-center font-bold  max-h-[300px] sm:font-bold lg:font-normal xl:font-normal text-[#AF84DD] sm:text-[#AF84DD] lg:text-[#020401] xl:text-[#020401]">
                        <div className="font-bold">{item.PLO.ploName}:</div>
                        <div className="w-full text-wrap">{item.PLO.description}</div>

                      </div>
                    </div>
                  </div>
                  <div className={`block sm:block ${showCLO ? 'lg:block xl:block' : ''} flex-1 p-4  overflow-y-auto`}>
                    <div className="text-center max-h-[300px] font-bold sm:font-bold lg:font-normal xl:font-normal 
                  text-[#475569]  sm:text-[#475569] lg:text-[#020401] xl:text-[#020401]">
                      <div className="block lg:hidden">
                        <div className={`font-bold ${showChapter ? 'lg:block xl:block' : 'hidden'}`}>{item.Chapter.chapterName}:</div>
                        <div className={`w-full text-wrap ${showChapter ? 'lg:block xl:block' : 'hidden'}`}>{item.Chapter.description}</div>

                        <div className={`font-bold ${showPLO ? 'lg:block xl:block' : 'hidden'}`}>{item.PLO.ploName}:</div>
                        <div className={`w-full text-wrap ${showPLO ? 'lg:block xl:block' : 'hidden'}`}>{item.PLO.description}</div>
                      </div>


                      <div className={`font-bold ${showCLO ? 'lg:block xl:block' : 'hidden'}`}>{item.CLO.cloName}:</div>
                      <div className={`w-full text-wrap ${showCLO ? 'lg:block xl:block' : 'hidden'}`}>{item.CLO.description}</div>
                    </div>
                  </div>
                </div>

                <div className={`w-full ${isContainerHidden ? 'lg:w-full' : ''} ${showAtLeastTwo ? 'lg:w-[60%]' : ''} ${showAllThree ? 'lg:w-[20%]' : ''}`}>
                  <div className="hidden sm:hidden lg:block xl:block text-justify leading-8 p-4" dangerouslySetInnerHTML={{ __html: item.description }} />
                  <div className="block sm:block lg:hidden xl:hidden">
                    <Collapse
                      items={[
                        {
                          key: '1',
                          label: <p className="text-justify text-base font-semibold">Nội dung</p>,
                          children: (
                            <div className="text-justify leading-8 flex flex-col text-base   p-2 px-5 sm:p-2 sm:px-5 lg:p-5 xl:p-5" dangerouslySetInnerHTML={{ __html: item.description }} />
                          )
                        }
                      ]}
                      colorBorder="#FFD700"
                      className="Collapse"
                      defaultActiveKey={['1']}
                    />
                  </div>
                </div>
              </div>





              {/* Right Side */}
              <div className={`w-full sm:w-full   
              ${isContainerHidden ? 'lg:w-[50%]' : ''}   ${showAny ? 'lg:w-[30%]' : ''} ${showAtLeastTwo ? 'lg:w-[30%]' : ''} ${showAllThree ? 'lg:w-[30%]' : ''}  
              text-justify pt-2 sm:pt-2 lg:p-5 xl:p-5 border-0 lg:border-1 lg:border-t-0 lg:border-l-0 xl:border-1 xl:border-t-0 xl:border-l-0 border-[#020401] `} key={i}>

                <div className="flex flex-col gap-6 w-full">
                  {item.maxScore === 1 && (
                    <Slider
                      size="lg"
                      label={<span>Điểm tối đa: {item.maxScore} </span>}
                      showTooltip={true}
                      step={0.25}
                      // formatOptions={{style: "percent"}}
                      maxValue={item.maxScore}
                      minValue={0}
                      defaultValue={defaultValue}
                      className="max-w-full"

                      marks={[
                        {
                          value: 0,
                          label: "0",
                        },
                        {
                          value: 0.25,
                          label: "0.25",
                        },
                        {
                          value: 0.5,
                          label: "0.5",
                        },
                        {
                          value: 0.75,
                          label: "0.75",
                        },
                        {
                          value: 1,
                          label: "1",
                        },
                      ]}

                      onChange={(value) => handleSliderChange(i, value, item.rubricsItem_id)}

                    />
                  )}
                  {item.maxScore === 1.25 && (
                    <Slider
                      size="lg"
                      label={<span>Điểm tối đa: {item.maxScore} </span>}
                      showTooltip={true}
                      step={0.25}
                      // formatOptions={{style: "percent"}}
                      maxValue={item.maxScore}
                      minValue={0}
                      defaultValue={defaultValue}
                      className="max-w-full"

                      marks={[
                        {
                          value: 0,
                          label: "0",
                        },
                        {
                          value: 0.25,
                          label: "0.25",
                        },
                        {
                          value: 0.5,
                          label: "0.5",
                        },
                        {
                          value: 0.75,
                          label: "0.75",
                        },
                        {
                          value: 1,
                          label: "1",
                        },
                        {
                          value: 1.25,
                          label: "1.25",
                        },
                      ]}

                      onChange={(value) => handleSliderChange(i, value, item.rubricsItem_id)}

                    />
                  )}
                  {item.maxScore === 1.5 && (
                    <Slider
                      size="lg"
                      label={<span>Điểm tối đa: {item.maxScore} </span>}
                      showTooltip={true}
                      step={0.25}
                      // formatOptions={{style: "percent"}}
                      maxValue={item.maxScore}
                      minValue={0}
                      defaultValue={defaultValue}
                      className="max-w-full"

                      marks={[
                        {
                          value: 0,
                          label: "0",
                        },
                        {
                          value: 0.5,
                          label: "0.5",
                        },
                        {
                          value: 1,
                          label: "1",
                        },
                        {
                          value: 1.5,
                          label: "1.5",
                        },
                      ]}

                      onChange={(value) => handleSliderChange(i, value, item.rubricsItem_id)}

                    />
                  )}
                  {item.maxScore === 1.75 && (
                    <Slider
                      size="lg"
                      label={<span>Điểm tối đa: {item.maxScore} </span>}
                      showTooltip={true}
                      step={0.25}
                      // formatOptions={{style: "percent"}}
                      maxValue={item.maxScore}
                      minValue={0}
                      defaultValue={defaultValue}
                      className="max-w-full"

                      marks={[
                        {
                          value: 0,
                          label: "0",
                        },
                        {
                          value: 0.5,
                          label: "0.5",
                        },
                        {
                          value: 1,
                          label: "1",
                        },
                        {
                          value: 1.5,
                          label: "1.5",
                        },
                        {
                          value: 1.75,
                          label: "1.75",
                        },
                      ]}

                      onChange={(value) => handleSliderChange(i, value, item.rubricsItem_id)}

                    />
                  )}
                  {item.maxScore === 2 && (
                    <Slider
                      size="lg"
                      label={<span>Điểm tối đa: {item.maxScore} </span>}
                      showTooltip={true}
                      step={0.25}
                      // formatOptions={{style: "percent"}}
                      maxValue={item.maxScore}
                      minValue={0}
                      defaultValue={defaultValue}
                      className="max-w-full"

                      marks={[
                        {
                          value: 0,
                          label: "0",
                        },
                        {
                          value: 0.5,
                          label: "0.5",
                        },
                        {
                          value: 1,
                          label: "1",
                        },
                        {
                          value: 1.5,
                          label: "1.5",
                        },
                        {
                          value: 2,
                          label: "2",
                        },
                      ]}

                      onChange={(value) => handleSliderChange(i, value, item.rubricsItem_id)}

                    />
                  )}
                  {item.maxScore === 0.75 && (
                    <Slider
                      size="lg"
                      label={<span>Điểm tối đa: {item.maxScore} </span>}
                      showTooltip={true}
                      step={0.25}
                      // formatOptions={{style: "percent"}}
                      maxValue={item.maxScore}
                      minValue={0}
                      defaultValue={defaultValue}
                      className="max-w-full"
                      marks={[
                        {
                          value: 0,
                          label: "0",
                        },
                        {
                          value: 0.25,
                          label: "0.25",
                        },
                        {
                          value: 0.5,
                          label: "0.5",
                        },
                        {
                          value: 0.75,
                          label: "0.75",
                        },
                      ]}
                      onChange={(value) => handleSliderChange(i, value, item.rubricsItem_id)}

                    />
                  )}
                  {item.maxScore === 0.5 && (
                    <Slider
                      size="lg"
                      label={<span>Điểm tối đa: {item.maxScore} </span>}
                      showTooltip={true}
                      step={0.25}
                      // formatOptions={{style: "percent"}}
                      maxValue={item.maxScore}
                      minValue={0}
                      defaultValue={defaultValue}
                      className="max-w-full"
                      marks={[
                        {
                          value: 0,
                          label: "0",
                        },
                        {
                          value: 0.25,
                          label: "0.25",
                        },
                        {
                          value: 0.5,
                          label: "0.5",
                        },
                      ]}
                      onChange={(value) => handleSliderChange(i, value, item.rubricsItem_id)}

                    />
                  )}
                  {item.maxScore === 0.25 && (
                    <Slider
                      size="lg"
                      label={<span>Điểm tối đa: {item.maxScore} </span>}
                      showTooltip={true}
                      step={0.25}
                      // formatOptions={{style: "percent"}}
                      maxValue={item.maxScore}
                      minValue={0}
                      defaultValue={defaultValue}
                      className="max-w-full"
                      marks={[
                        {
                          value: 0,
                          label: "0",
                        },
                        {
                          value: 0.25,
                          label: "0.25",
                        },
                      ]}
                      onChange={(value) => handleSliderChange(i, value, item.rubricsItem_id)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
export default FormGrading


function ModalWhenSave({
  isOpen,
  onOpenChange,
  totalScore,
  assessment,
  handleBack,
  disc,
  filterScore
}) {

  return (
    <Modal
      size="xl"
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
            <ModalHeader className="text-[#FF9908]">Tổng kết</ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center h-full">
                {/* Assessment Description */}
                <h1 className="text-2xl text-center font-bold mb-4 text-[#6366F1]">
                  {assessment?.MetaAssessment?.generalDescription}
                </h1>

                {/* Student Information */}
                <div className="flex flex-col items-center text-lg font-semibold mb-4">
                  <span className="text-[#020401]">{assessment?.MetaAssessment?.Student?.name}</span>
                  <span className="text-[#020401]">{assessment?.MetaAssessment?.Student?.studentCode}</span>
                </div>

                {/* Total Score */}
                <div className="flex flex-col items-center text-lg font-semibold">
                  <span className="text-[#020401]">Tổng điểm: {totalScore}</span>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onClick={() => {
                  onClose();
                  handleBack(
                    filterScore === 0 ?
                      `/admin/management-grading/${disc}/?description=${assessment?.MetaAssessment?.generalDescription}?FilterScore=0`
                      :
                      `/admin/management-grading/${disc}/?description=${assessment?.MetaAssessment?.generalDescription}`
                  );
                }}
              >
                Quay lại
              </Button>
              <Button
                type="submit"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  handleBack(
                    filterScore === 0 ?
                      `/admin/management-grading/update/${disc}/student-code/${assessment?.MetaAssessment?.Student?.studentCode}/assessment/${assessment?.assessment_id}/rubric/${assessment?.MetaAssessment?.rubric_id}?FilterScore=0`
                      :
                      `/admin/management-grading/update/${disc}/student-code/${assessment?.MetaAssessment?.Student?.studentCode}/assessment/${assessment?.assessment_id}/rubric/${assessment?.MetaAssessment?.rubric_id}`
                  );
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
};