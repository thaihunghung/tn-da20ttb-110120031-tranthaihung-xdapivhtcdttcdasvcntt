import React, { useEffect, useState } from "react";
import { message } from 'antd';
import { Select } from "antd";
import { Collapse } from 'antd';
import "../css/FormGrading.css"
import { axiosAdmin } from "../../../../../../service/AxiosAdmin";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import RubricSlider from "../../../Utils/RubricSlider/RubricSlider";

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, Button, Tooltip, Divider, Textarea } from "@nextui-org/react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react';

import BackButton from "../../../Utils/BackButton/BackButton";
import { ChevronDownIcon } from "../../../../../../public/ChevronDownIcon";



const FormMultipleGrading = ({ setCollapsedNav }) => {

  const { Option } = Select;
  const [selectedValues1, setSelectedValues1] = useState([]);
  const [selectedValues2, setSelectedValues2] = useState([]);
  const [selectedValues3, setSelectedValues3] = useState([]);
  const [selectedValues4, setSelectedValues4] = useState([]);
  const [RubicData, setRubicData] = useState([]);
  const [RubicItemsData, setRubicItemsData] = useState([]);
  const [totalScore1, setTotalScore1] = useState(0);
  const [totalScore2, setTotalScore2] = useState(0);
  const [totalScore3, setTotalScore3] = useState(0);
  const [totalScore4, setTotalScore4] = useState(0);


  const [OpenTotalScore1, setOpenTotalScore1] = useState(0);
  const [OpenTotalScore2, setOpenTotalScore2] = useState(0);
  const [OpenTotalScore3, setOpenTotalScore3] = useState(0);
  const [OpenTotalScore4, setOpenTotalScore4] = useState(0);


  const [Student1, setStudent1] = useState({});
  const [Student2, setStudent2] = useState({});
  const [Student3, setStudent3] = useState({});
  const [Student4, setStudent4] = useState({});

  const [Check1, setCheck1] = useState(0);
  const [Check2, setCheck2] = useState(0);
  const [Check3, setCheck3] = useState(0);
  const [Check4, setCheck4] = useState(0);


  const [defaultValue, setdefaultValue] = useState(0);
  const [ListStudentOJ, setListStudentOJ] = useState([]);
  const [Assessment, setAssessment] = useState([]);
  const [AssessmentByStudent, setAssessmentByStudent] = useState([]);
  const { rubric_id } = useParams();
  const navigate = useNavigate();
  const teacher_id = Cookies.get('teacher_id');

  if (!teacher_id) {
    navigate('/login');
  }
  const handleNavigate = (path) => {
    navigate(path);
  };
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const studentCodesString = searchParams.getAll('student-code');

  let listStudentCodes = [];
  if (studentCodesString) {
    try {
      const studentCodes = JSON.parse(decodeURIComponent(studentCodesString));
      listStudentCodes = studentCodes.map((key) => key.studentCode);
      console.log(listStudentCodes)
    } catch (error) {
      console.error('Error parsing student codes:', error);
    }
  }
  const descriptionString = searchParams.get('disc');
  let descriptionURL;

  if (descriptionString) {
    try {
      const decodedDescription = decodeURIComponent(descriptionString);

      descriptionURL = decodedDescription;

      //console.log(descriptionURL);
    } catch (error) {
      console.error('Error processing description:', error);
    }
  }
  const [showCLO, setShowCLO] = useState(false);
  const [showPLO, setShowPLO] = useState(false);
  const [showChapter, setShowChapter] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(new Set());
  const [showAll, setShowAll] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [showFirst, setShowFirst] = useState(true);
  const [isModalWhenSaveOpen, setIsModalWhenSaveOpen] = useState(false);
  const showAny = showCLO || showPLO || showChapter;
  const showAtLeastTwo = [showCLO, showPLO, showChapter].filter(Boolean).length >= 2;
  const showAllThree = showCLO && showPLO && showChapter;
  const isContainerHidden = !showAny;

  
  const [Student, setStudent] = useState(listStudentCodes);
  const { description } = useParams();
  const columns = [
    { uid: 'clo', name: 'CLO' },
    { uid: 'plo', name: 'PLO' },
    { uid: 'chapter', name: 'Chapter' },
  ];
  const GetRubricData = async () => {
    try {
      const response = await axiosAdmin.get(`/rubric/${rubric_id}/items?isDelete=false`);
      //console.log(response.data);
      setRubicData(response.data.rubric)
      setRubicItemsData(response.data.rubric.rubricItems)
      const data = response.data.rubric.rubricItems
      setValue1(data)
      setValue2(data)
      setValue3(data)
      setValue4(data)
    } catch (error) {
      console.error('Error fetching rubric data:', error);
      throw error;
    }
  };

  const GetAssesmentByDicriptions = async () => {
    try {
      const response = await axiosAdmin.get(`/assessment?teacher_id=${teacher_id}&generalDescription=${descriptionURL}&isDelete=false`);
      if (response.data) {
        setAssessment(response?.data);
      }
      console.log("assessments");
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching rubric data:', error);
      throw error;
    }
  };

  const getStudentBySelect = (data, studentCode) => {
    for (let item of data) {
      if (item.Student && item.Student.studentCode === studentCode) {
        return item.Student;
      }
    }
    return null;
  };


  const getAssesmentByStudent = (data, studentCode) => {
    for (let item of data) {
      if (item.Student && item.Student.studentCode === studentCode) {

        return item;
      }
    }
    return null;
  };

  


  

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



  const handleStudentChange = (value, option) => {
    if (value.length > 4) {
      message.warning('You can only select up to 4 student.');
      return;
    }
    //console.log('value');
    setStudent(value);
  };
  const handleSliderChange1 = (index, value, rubricsItem_id, student_id) => {
    setSelectedValues1(prevValues => {
      if (!Array.isArray(prevValues)) {
        prevValues = [];
      }

      const updatedValues = [...prevValues];
      updatedValues[index] = {
        student_id: student_id,
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
      console.log("check1:",updatedValues);
      const Check = updatedValues.reduce((acc, curr) => {
        // Check if curr is an object and CheckGrading is true
        if (curr && curr.CheckGrading === true) {
          return acc + 1; // Increment the count by 1
        }
        return acc; // Otherwise, return the accumulated count
      }, 0);
      
      setCheck1(Check)
      setTotalScore1(newTotalScore);
      return updatedValues;
    });
  };
  const handleSliderChange2 = (index, value, rubricsItem_id, student_id) => {
    setSelectedValues2(prevValues => {
      if (!Array.isArray(prevValues)) {
        prevValues = [];
      }

      const updatedValues = [...prevValues];
      updatedValues[index] = {
        student_id: student_id,
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
      setCheck2(Check)
      setTotalScore2(newTotalScore);
      return updatedValues;
    });
  };
  const handleSliderChange3 = (index, value, rubricsItem_id, student_id) => {
    setSelectedValues3(prevValues => {
      if (!Array.isArray(prevValues)) {
        prevValues = [];
      }

      const updatedValues = [...prevValues];
      updatedValues[index] = {
        student_id: student_id,
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
      setCheck3(Check)
      setTotalScore3(newTotalScore);
      return updatedValues;
    });
  };
  const handleSliderChange4 = (index, value, rubricsItem_id, student_id) => {
    setSelectedValues4(prevValues => {
      if (!Array.isArray(prevValues)) {
        prevValues = [];
      }

      const updatedValues = [...prevValues];
      updatedValues[index] = {
        student_id: student_id,
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
      setCheck4(Check)
      setTotalScore4(newTotalScore);
      return updatedValues;
    });
  };
  const updateSelectedValues = (studentIds, selectedValues, assessments) => {
    return selectedValues.map(item => {
      const matchingAssessment = assessments.find(assessment => assessment.student_id === studentIds);
      //console.log("matchingAssessment", matchingAssessment)
      if (matchingAssessment) {
        const { assessment_id, totalScore } = matchingAssessment.assessment;
        const { maxScore, student_id, CheckGrading, ...rest } = item;
        return {
          ...rest,
          assessment_id: assessment_id,
          CheckSave: totalScore === 0,
          assessmentScore: maxScore
        };
      }
      return item;
    });
  };
  const findStudentById = (studentId) => {
    const assessment = Assessment.find(a => a.Student.student_id === studentId);
    return assessment ? assessment.Student : {};
  };
  const CheckSave = (items) => {
    for (const [itemIndex, item] of items.entries()) {
      for (const [entryIndex, entry] of item.entries()) {
        if (!entry.CheckSave) {
          message.error(`Lưu không thành công do SV${itemIndex + 1}, đã được chấm`);
          return false;
        }
      }
    }
    return true;
  }
  const Save = async (dataSaveAssessment, Score) => {
    try {
      message.success('di')
      const data = { totalScore: Score }

      await axiosAdmin.patch(`/assessment/${dataSaveAssessment[0].assessment_id}/totalScore`, { data: data })

      const dataAssessmentItem = dataSaveAssessment.map(item => {
        const { CheckSave, ...rest } = item;
        return {
          ...rest,
        };
      });

      const response = await axiosAdmin.post(`/assessment-item`, { data: dataAssessmentItem })
      if (response.status === 201) {

        return 'Data saved successfully';
      } else {
        message.error('Unexpected response status');
        return 'Unexpected response status';
      }
    } catch (e) {
      console.error(e);
      message.error('Error saving data');
    }
  }
  const handleLogicSave = async () => {
    const checkStudent = (selectedValues, studentIndex) => {
      let count = 0;
      const studentIds = [];

      for (let i = 0; i < selectedValues.length; i++) {
        const item = selectedValues[i];
        if (item.hasOwnProperty('student_id')) {
          //console.log(`Đối tượng có thuộc tính student_id:`, item);
          count++;
          studentIds.push(item.student_id); // Extracting student_id
          break; // Exit loop early
        } else {
          //console.log(`Đối tượng không có thuộc tính student_id:`, item);
        }
      }

      if (count === 0) {
        message.error(`Chưa chấm điểm cho SV${studentIndex}`);
        return { valid: false, studentIds: [] };
      }
      return { valid: true, studentIds };
    };

    let allStudentIds = [];

    switch (Student.length) {
      case 1:
        {
          const result = checkStudent(selectedValues1, 1);
          if (!result.valid) return;

          const findAssessment1 = updateSelectedValues(result.studentIds[0], selectedValues1, Assessment)

          const items = [findAssessment1]
          console.log('items',findAssessment1)
          const check = CheckSave(items)


          const studentCode1 = findStudentById(result.studentIds[0])

          

          setStudent1(studentCode1)


          const Score1 = totalScore1
          setOpenTotalScore1(Score1)

          if (check) {
            Promise.all([
              Save(findAssessment1, totalScore1)
            ]).then(results => {
              if (results.every(result => result === 'Data saved successfully')) {

                setIsModalWhenSaveOpen(true);
                message.success('Data saved successfully');
                setStudent([]);
                GetAssesmentByDicriptions();
                setCheck1(0);
                setCheck2(0);
                setCheck3(0);
                setCheck4(0);
              } else {
                console.log('One or both saves failed');
              }
            }).catch(error => {
              console.error('Error during save operations:', error);
            });
          }
        }
        break;
      case 2:
        {
          const result1 = checkStudent(selectedValues1, 1);
          const result2 = checkStudent(selectedValues2, 2);
          if (!result1.valid) return;

          if (!result2.valid) return;

          const findAssessment1 = updateSelectedValues(result1.studentIds[0], selectedValues1, Assessment)
          const findAssessment2 = updateSelectedValues(result2.studentIds[0], selectedValues2, Assessment)

          const items = [findAssessment1, findAssessment2]
          const check = CheckSave(items)
          console.log(items)

          const studentCode1 = findStudentById(result1.studentIds[0])
          const studentCode2 = findStudentById(result2.studentIds[0])
          setStudent1(studentCode1)
          setStudent2(studentCode2)

          setStudent1(studentCode1)
          console.log('studentCode1',studentCode1)
          const Score1 = totalScore1
          const Score2 = totalScore2

          setOpenTotalScore1(Score1)
          setOpenTotalScore2(Score2)
          if (check) {
            Promise.all([
              Save(findAssessment1, totalScore1),
              Save(findAssessment2, totalScore2)
            ]).then(results => {
              if (results.every(result => result === 'Data saved successfully')) {

                setIsModalWhenSaveOpen(true);
                message.success('Data saved successfully');
                setStudent([]);
                GetAssesmentByDicriptions();
                setCheck1(0);
                setCheck2(0);
                setCheck3(0);
                setCheck4(0);
              } else {
                console.log('One or both saves failed');
              }
            }).catch(error => {
              console.error('Error during save operations:', error);
            });
          }
        }
        break;
      case 3:
        {
          const result1 = checkStudent(selectedValues1, 1);
          const result2 = checkStudent(selectedValues2, 2);
          const result3 = checkStudent(selectedValues3, 3);
          if (!result1.valid) return;
          if (!result2.valid) return;
          if (!result3.valid) return;


          const findAssessment1 = updateSelectedValues(result1.studentIds[0], selectedValues1, Assessment)
          const findAssessment2 = updateSelectedValues(result2.studentIds[0], selectedValues2, Assessment)
          const findAssessment3 = updateSelectedValues(result3.studentIds[0], selectedValues3, Assessment)

          const items = [findAssessment1, findAssessment2, findAssessment3]
          console.log('items',items)
  
          const check = CheckSave(items)

          const studentCode1 = findStudentById(result1.studentIds[0])
          const studentCode2 = findStudentById(result2.studentIds[0])
          const studentCode3 = findStudentById(result3.studentIds[0])
          setStudent1(studentCode1)
          setStudent2(studentCode2)
          setStudent3(studentCode3)
          console.log('studentCode1',studentCode1)
          const Score1 = totalScore1
          const Score2 = totalScore2
          const Score3 = totalScore3
          console.log('Score1',Score1)
          setOpenTotalScore1(Score1)
          setOpenTotalScore2(Score2)
          setOpenTotalScore3(Score3)
          if (check) {
            Promise.all([
              Save(findAssessment1, totalScore1),
              Save(findAssessment2, totalScore2),
              Save(findAssessment3, totalScore3)
            ]).then(results => {
              if (results.every(result => result === 'Data saved successfully')) {

                setIsModalWhenSaveOpen(true);
                message.success('Data saved successfully');
                setStudent([]);
                GetAssesmentByDicriptions();
                setCheck1(0);
                setCheck2(0);
                setCheck3(0);
                setCheck4(0);
              } else {
                console.log('One or both saves failed');
              }
            }).catch(error => {
              console.error('Error during save operations:', error);
            });
          }
        }
        break;
      case 4:
        {
          const result1 = checkStudent(selectedValues1, 1);
          const result2 = checkStudent(selectedValues2, 2);
          const result3 = checkStudent(selectedValues3, 3);
          const result4 = checkStudent(selectedValues4, 4);
          if (!result1.valid) return;

          if (!result2.valid) return;

          if (!result3.valid) return;

          if (!result4.valid) return;

          const findAssessment1 = updateSelectedValues(result1.studentIds[0], selectedValues1, Assessment)
          const findAssessment2 = updateSelectedValues(result2.studentIds[0], selectedValues2, Assessment)
          const findAssessment3 = updateSelectedValues(result3.studentIds[0], selectedValues3, Assessment)
          const findAssessment4 = updateSelectedValues(result4.studentIds[0], selectedValues4, Assessment)

          const items = [findAssessment1, findAssessment2, findAssessment3, findAssessment4]
          const check = CheckSave(items)

          const studentCode1 = findStudentById(result1.studentIds[0])
          const studentCode2 = findStudentById(result2.studentIds[0])
          const studentCode3 = findStudentById(result3.studentIds[0])
          const studentCode4 = findStudentById(result4.studentIds[0])
          setStudent1(studentCode1)
          setStudent2(studentCode2)
          setStudent3(studentCode3)
          setStudent4(studentCode4)

          const Score1 = totalScore1
          const Score2 = totalScore2
          const Score3 = totalScore3
          const Score4 = totalScore4
          console.log('studentCode1',studentCode1)
          console.log('Score1',Score1)
          setOpenTotalScore1(Score1)
          setOpenTotalScore2(Score2)
          setOpenTotalScore3(Score3)
          setOpenTotalScore4(Score4)
          if (check) {
            Promise.all([
              Save(findAssessment1, totalScore1),
              Save(findAssessment2, totalScore2),
              Save(findAssessment3, totalScore3),
              Save(findAssessment4, totalScore4)
            ]).then(results => {
              if (results.every(result => result === 'Data saved successfully')) {

                setIsModalWhenSaveOpen(true);
                message.success('Data saved successfully');
                setStudent([]);
                GetAssesmentByDicriptions();
                setCheck1(0);
                setCheck2(0);
                setCheck3(0);
                setCheck4(0);
              } else {
                console.log('One or both saves failed');
              }
            }).catch(error => {
              console.error('Error during save operations:', error);
            });
          }
        }
        break;
      default:
        message.error('Số lượng sinh viên không hợp lệ');
        return;
    }
  };
  const setValue1 = (data) => {
    const updatedPoData = data.map((subject) => {
      return {
        //assessment_id: assessment_id,
        rubricsItem_id: subject.rubricsItem_id,
        maxScore: 0.0,
        CheckGrading: false,
      };
    });
    setSelectedValues1(updatedPoData);
  }
  const setValue2 = (data) => {
    const updatedPoData = data.map((subject) => {
      return {
        //assessment_id: assessment_id,
        rubricsItem_id: subject.rubricsItem_id,
        maxScore: 0.0,
        CheckGrading: false,
      };
    });
    setSelectedValues2(updatedPoData);
  }
  const setValue3 = (data) => {
    const updatedPoData = data.map((subject) => {
      return {
        //assessment_id: assessment_id,
        rubricsItem_id: subject.rubricsItem_id,
        maxScore: 0.0,
        CheckGrading: false,
      };
    });
    setSelectedValues3(updatedPoData);
  }
  const setValue4 = (data) => {
    const updatedPoData = data.map((subject) => {
      return {
        // assessment_id: assessment_id,
        rubricsItem_id: subject.rubricsItem_id,
        maxScore: 0.0,
        CheckGrading: false,
      };
    });
    setSelectedValues4(updatedPoData);
  }

  useEffect(() => {
    GetAssesmentByDicriptions()
    GetRubricData();
    setCheck1(0);
    setCheck2(0);
    setCheck3(0);
    setCheck4(0);
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
      window.removeEventListener("resize", handleResize); // Cleanup
    };
  }, []);

  useEffect(() => {
    if (Student) {
      const listStudentIds = Student.map(code => getStudentBySelect(Assessment, code));
      const assessment = Student.map(code => getAssesmentByStudent(Assessment, code));

      setAssessmentByStudent(assessment)
      
      setListStudentOJ(listStudentIds)
      console.log("Student:", listStudentIds)
      GetRubricData()
      setCheck1(0)
      setCheck2(0)
      setCheck3(0)
      setCheck4(0)
      setTotalScore1(0)
      setTotalScore2(0)
      setTotalScore3(0)
      setTotalScore4(0)
    }
  }, [Student, Assessment]);

  return (
    <div className="w-full p-2 pb-[100px] py-0 flex flex-col leading-6">
      <div className="w-full min-h-[200px] bg-[#FEFEFE] border border-slate-300 shadow-lg rounded-md mb-2 p-4">
        <h1 className="text-xl font-bold mb-2 text-[#6366F1] uppercase">{Assessment[0]?.generalDescription}</h1>
        <div className="flex items-center text-lg flex-col font-bold justify-center">
          <Textarea
            className="max-w-[700px]"
            label="Đề tài"
            value={AssessmentByStudent[0]?.description}
            onChange={(e) => setAssessment(prev => ({ ...prev, MetaAssessment: { ...prev.MetaAssessment, description: e.target.value } }))}
          />
        </div>
        <div className='text-left w-full font-bold'>Chọn sinh viên</div>
        <div className="w-full flex items-center justify-start">
          <Select
            mode="multiple"
            value={Student}
            onChange={handleStudentChange}
            size="large"
            className=" max-w-[600px] w-full my-2 bg-[white]"
          >
            {Assessment.map((Student) => (
              <Select.Option
                key={Student?.Student?.student_id}
                value={Student?.Student?.studentCode}
                disabled={Student?.totalScore > 0}
              >
                <span className="p-2">{Student?.Student?.studentCode}{" - "}{Student?.Student?.name}</span>

              </Select.Option>
            ))}
          </Select>

        </div>

        <div className="hidden sm:block">
          <BackButton path={`/admin/management-grading/${description}/?description=${Assessment[0]?.generalDescription}`} />
        </div>
      </div>
      <ModalWhenSave
        isOpen={isModalWhenSaveOpen}
        onOpenChange={setIsModalWhenSaveOpen}
        student1={Student1}
        student2={Student2}
        student3={Student3}
        student4={Student4}

        Score1={OpenTotalScore1}
        Score2={OpenTotalScore2}
        Score3={OpenTotalScore3}
        Score4={OpenTotalScore4}

        // totalScore={totalScore}
        assessment={Assessment}
        handleBack={handleNavigate}
        disc={description}
      />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Xác nhận lưu</ModalHeader>
              <ModalBody>
                <p>Bạn có muốn lưu không?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Hủy
                </Button>
                <Button color="primary" onPress={() => { handleLogicSave(); onClose(); }}>
                  Lưu
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="Quick__Option  flex justify-between items-center sticky top-0 bg-white z-50 w-fit p-4 px-2 py-3 shadow-lg rounded-md border border-slate-300">
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
            <div className="flex justify-center items-center gap-1 flex-col">
              {
                ListStudentOJ.length === 0 && (
                  <span className="mr-2"></span>
                )
              }
              {
                ListStudentOJ.length === 1 && (
                  <div>
                    <span className="mr-2">SV1: {' ' + totalScore1} </span>

                    <span>TC: {Check1}/{RubicItemsData.length}</span>
                  </div>

                )
              }
              {
                ListStudentOJ.length === 2 && (
                  <>

                    <div>
                      <div className="min-w-[100px] flex justify-between items-center">
                        <span className="mr-2">SV1: {' ' + totalScore1}</span>
                        <span>TC: {Check1}/{RubicItemsData.length}</span>
                      </div>
                      <div className="min-w-[100px] flex justify-between items-center">
                        <span className="mr-2">SV2: {' ' + totalScore2}</span>
                        <span>TC: {Check2}/{RubicItemsData.length}</span>
                      </div>
                    </div>
                  </>
                )
              }
              {
                ListStudentOJ.length === 3 && (
                  <>
                    <div className="min-w-[100px] flex justify-between items-center">
                      <span className="mr-2">SV1: {' ' + totalScore1}</span>
                      <span>TC: {Check1}/{RubicItemsData.length}</span>
                    </div>
                    <div className="min-w-[100px] flex justify-between items-center">
                      <span className="mr-2">SV2: {' ' + totalScore2}</span>
                      <span>TC: {Check2}/{RubicItemsData.length}</span>
                    </div>
                    <div className="min-w-[100px] flex justify-between items-center">
                      <span className="mr-2">SV3: {' ' + totalScore3}</span>
                      <span>TC: {Check3}/{RubicItemsData.length}</span>
                    </div>
                  </>

                )
              }
              {
                ListStudentOJ.length === 4 && (
                  <>
                    <div className="min-w-[100px] flex justify-between items-center">
                      <span className="mr-2">SV1: {' ' + totalScore1}</span>
                      <span>TC: {Check1}/{RubicItemsData.length}</span>
                    </div>
                    <div className="min-w-[100px] flex justify-between items-center">
                      <span className="mr-2">SV2: {' ' + totalScore2}</span>
                      <span>TC: {Check2}/{RubicItemsData.length}</span>
                    </div>
                    <div className="min-w-[100px] flex justify-between items-center">
                      <span className="mr-2">SV3: {' ' + totalScore3}</span>
                      <span>TC: {Check3}/{RubicItemsData.length}</span>
                    </div>
                    <div className="min-w-[100px] flex justify-between items-center">
                      <span className="mr-2">SV4: {' ' + totalScore4}</span>
                      <span>TC: {Check4}/{RubicItemsData.length}</span>
                    </div>
                  </>
                )
              }
              {/* Tiêu chí: {Check1}/{RubicItemsData.length} */}
              {/* Tiêu chí: {Check2}/{RubicItemsData.length} */}
              {/* Tiêu chí: {Check3}/{RubicItemsData.length} */}
              {/* Tiêu chí: {Check4}/{RubicItemsData.length} */}

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
              <div className={`w-full sm:w-full   
              ${isContainerHidden ? 'lg:w-[50%]' : ''}   ${showAny ? 'lg:w-[30%]' : ''} ${showAtLeastTwo ? 'lg:w-[30%]' : ''} ${showAllThree ? 'lg:w-[30%]' : ''}  
              text-justify pt-2 sm:pt-2 lg:p-5 xl:p-5 border-0 lg:border-1 lg:border-t-0 lg:border-l-0 xl:border-1 xl:border-t-0 xl:border-l-0 border-[#020401] `} key={i}>
                {
                  ListStudentOJ.length === 0 && (
                    // Hiển thị 0 RubricSlider khi không có sinh viên được chọn
                    <>
                    </>
                  )
                }
                {
                  ListStudentOJ.length === 1 && (
                    // Hiển thị 1 RubricSlider khi có 1 sinh viên được chọn
                    <>
                      <RubricSlider
                        studentID={ListStudentOJ[0]?.student_id}
                        studentCode={ListStudentOJ[0]?.studentCode}
                        StudentName={ListStudentOJ[0]?.name}
                        maxScore={item.maxScore}
                        index={i}
                        defaultValue={defaultValue}
                        handleSliderChange={handleSliderChange1}
                        rubricsItem_id={item.rubricsItem_id}

                      />
                    </>
                  )
                }
                {
                  ListStudentOJ.length === 2 && (
                    // Hiển thị 2 RubricSlider khi có 2 sinh viên được chọn
                    <>
                      <RubricSlider
                        studentID={ListStudentOJ[0]?.student_id}
                        studentCode={ListStudentOJ[0]?.studentCode}
                        StudentName={ListStudentOJ[0]?.name}
                        maxScore={item.maxScore}
                        index={i}
                        defaultValue={defaultValue}
                        handleSliderChange={handleSliderChange1}
                        rubricsItem_id={item.rubricsItem_id}

                      />
                      <RubricSlider
                        studentID={ListStudentOJ[1]?.student_id}
                        studentCode={ListStudentOJ[1]?.studentCode}
                        StudentName={ListStudentOJ[1]?.name}
                        maxScore={item.maxScore}
                        index={i}
                        defaultValue={defaultValue}
                        handleSliderChange={handleSliderChange2}
                        rubricsItem_id={item.rubricsItem_id}

                      />
                    </>
                  )
                }
                {
                  ListStudentOJ.length === 3 && (
                    // Hiển thị 3 RubricSlider khi có 3 hoặc nhiều hơn sinh viên được chọn
                    <>
                      <RubricSlider
                        studentID={ListStudentOJ[0]?.student_id}
                        studentCode={ListStudentOJ[0]?.studentCode}
                        StudentName={ListStudentOJ[0]?.name}
                        maxScore={item.maxScore}
                        index={i}
                        defaultValue={defaultValue}
                        handleSliderChange={handleSliderChange1}
                        rubricsItem_id={item.rubricsItem_id}

                      />
                      <RubricSlider
                        studentID={ListStudentOJ[1]?.student_id}
                        studentCode={ListStudentOJ[1]?.studentCode}
                        StudentName={ListStudentOJ[1]?.name}
                        maxScore={item.maxScore}
                        index={i}
                        defaultValue={defaultValue}
                        handleSliderChange={handleSliderChange2}
                        rubricsItem_id={item.rubricsItem_id}

                      />
                      <RubricSlider
                        studentID={ListStudentOJ[2]?.student_id}
                        studentCode={ListStudentOJ[2]?.studentCode}
                        StudentName={ListStudentOJ[2]?.name}
                        maxScore={item.maxScore}
                        index={i}
                        defaultValue={defaultValue}
                        handleSliderChange={handleSliderChange3}
                        rubricsItem_id={item.rubricsItem_id}

                      />
                    </>
                  )
                }
                {
                  ListStudentOJ.length === 4 && (
                    // Hiển thị 3 RubricSlider khi có 3 hoặc nhiều hơn sinh viên được chọn
                    <>
                      <RubricSlider
                        studentID={ListStudentOJ[0]?.student_id}
                        studentCode={ListStudentOJ[0]?.studentCode}
                        StudentName={ListStudentOJ[0]?.name}
                        maxScore={item.maxScore}
                        index={i}
                        defaultValue={defaultValue}
                        handleSliderChange={handleSliderChange1}
                        rubricsItem_id={item.rubricsItem_id}

                      />
                      <RubricSlider
                        studentID={ListStudentOJ[1]?.student_id}
                        studentCode={ListStudentOJ[1]?.studentCode}
                        StudentName={ListStudentOJ[1]?.name}
                        maxScore={item.maxScore}
                        index={i}
                        defaultValue={defaultValue}
                        handleSliderChange={handleSliderChange2}
                        rubricsItem_id={item.rubricsItem_id}

                      />
                      <RubricSlider
                        studentID={ListStudentOJ[2]?.student_id}
                        studentCode={ListStudentOJ[2]?.studentCode}
                        StudentName={ListStudentOJ[2]?.name}
                        maxScore={item.maxScore}
                        index={i}
                        defaultValue={defaultValue}
                        handleSliderChange={handleSliderChange3}
                        rubricsItem_id={item.rubricsItem_id}

                      />
                      <RubricSlider
                        studentID={ListStudentOJ[3]?.student_id}
                        studentCode={ListStudentOJ[3]?.studentCode}
                        StudentName={ListStudentOJ[3]?.name}
                        maxScore={item.maxScore}
                        index={i}
                        defaultValue={defaultValue}
                        handleSliderChange={handleSliderChange4}
                        rubricsItem_id={item.rubricsItem_id}

                      />
                    </>
                  )
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}
export default FormMultipleGrading

function ModalWhenSave({
  isOpen,
  onOpenChange,
  student1,
  student2,
  student3,
  student4,
  Score1,
  Score2,
  Score3,
  Score4,
  assessment,
  handleBack,
  disc,
  handleUpdate
}) {
  const Assessment1 = assessment.find(assessment => assessment.student_id === student1.student_id);
  const Assessment2 = assessment.find(assessment => assessment.student_id === student2.student_id);
  const Assessment3 = assessment.find(assessment => assessment.student_id === student3.student_id);
  const Assessment4 = assessment.find(assessment => assessment.student_id === student4.student_id);


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
              <div className="flex flex-col items-center h-full text-base w-full">
                {/* Assessment Description */}
                <h1 className="text-2xl text-center font-bold mb-4 text-[#6366F1] uppercase">
                  {assessment[0]?.generalDescription}
                </h1>
                <Divider className="my-4" />
                {/* Display students and scores in a grid */}
                <div className="grid grid-cols-2 gap-4  sm:gap-10">
                  {student1 && Object.keys(student1).length > 0 && student1.name && (
                    <div className="flex justify-center flex-col items-center">
                      <p className="text-center text-wrap">{student1.name}</p>
                      <p>Tổng điểm: {Score1}</p>
                      <Button onClick={() => handleBack(`/admin/management-grading/update/${disc}/student-code/${student1.studentCode}/assessment/${Assessment1.assessment.assessment_id}/rubric/${assessment[0].rubric_id}`)}>Cập nhật</Button>
                    </div>
                  )}
                  {student2 && Object.keys(student2).length > 0 && student2.name && (
                    <div className="flex justify-center flex-col items-center">
                      <p className="text-center text-wrap">{student2.name}</p>
                      <p>Tổng điểm: {Score2}</p>
                      <Button onClick={() => handleBack(`/admin/management-grading/update/${disc}/student-code/${student2.studentCode}/assessment/${Assessment2.assessment.assessment_id}/rubric/${assessment[0].rubric_id}`)}>Cập nhật</Button>
                    </div>
                  )}
                  {student3 && Object.keys(student3).length > 0 && student3.name && (
                    <div className="flex justify-center flex-col items-center">
                      <p className="text-center text-wrap">{student3.name}</p>
                      <p>Tổng điểm: {Score3}</p>
                      <Button onClick={() => handleBack(`/admin/management-grading/update/${disc}/student-code/${student3.studentCode}/assessment/${Assessment3.assessment.assessment_id}/rubric/${assessment[0].rubric_id}`)}>Cập nhật</Button>
                    </div>
                  )}
                  {student4 && Object.keys(student4).length > 0 && student4.name && ( // Kiểm tra thêm thuộc tính name
                    <div className="flex justify-center flex-col items-center">
                      <p className="text-center text-wrap">{student4.name}</p>
                      <p>Tổng điểm: {Score4}</p>
                      <Button onClick={() => handleBack(`/admin/management-grading/update/${disc}/student-code/${student4.studentCode}/assessment/${Assessment4.assessment_id}/rubric/${assessment[0].rubric_id}`)}>Cập nhật</Button>
                    </div>
                  )}

                </div>
                <Divider className="my-4" />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onClick={() => {
                  onClose();
                  handleBack(`/admin/management-grading/${disc}/?description=${assessment[0]?.generalDescription}`);
                }}
              >
                Quay lại
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}