import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Button, Textarea, } from "@nextui-org/react";

import Cookies from "js-cookie";

import { fetchDataGetMetaIdByGeneralDescription } from '../Data/DataAssessment';
import { message } from 'antd';
import { axiosAdmin } from '../../../../../../service/AxiosAdmin';
import { UseTeacherAuth, UseTeacherId } from '../../../../../../hooks';

function ModalUpdateAllot({ isOpen, onOpenChange, generalDescription, loadData }) {
  UseTeacherAuth()
  const teacher_id = UseTeacherId()

  const [selectedTodoIds, setSelectedTodoIds] = useState([]);
  const [todoDescriptions, setTodoDescriptions] = useState('');
  const [currentList, setCurrentList] = useState('');
  const [TeacherData, setTeacherData] = useState([]);
  const [MetaAssessment, setMetaAssessment] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState({});
  const [MasterListTeacher, setMasterListTeacher] = useState([]);




  const [assessments, setAssessment] = useState([]);



  const [FilteredAssessments, setFilteredAssessments] = useState([]);


  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axiosAdmin.get('/teacher');
        const data = response.data.map(teacher => ({
          id: teacher.teacher_id,
          name: teacher.name,
        }));
        const teacher = data.find(teacher => teacher.id.toString() === teacher_id);
        const filteredTeacherData = data.filter(teacher => teacher.id.toString() !== teacher_id);
        setTeacherData(filteredTeacherData);
        setCurrentTeacher(teacher);

      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };
    fetchTeacherData();

  }, [teacher_id, assessments]);




  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const { meta_assessment_ids, assessments } = await fetchDataGetMetaIdByGeneralDescription(generalDescription);
          setMetaAssessment(meta_assessment_ids);

          const filteredAssessments = assessments.filter(
            assessment => assessment.teacher_id !== parseInt(teacher_id)
          );
          console.log("filteredAssessments", filteredAssessments)
          setAssessment(filteredAssessments);
          const uniqueTeacherIds = [...new Set(filteredAssessments.map(assessment => assessment.teacher_id))];

          const uniqueTeachers = uniqueTeacherIds.map(id => {
            const assessment = filteredAssessments.find(assessment => assessment.teacher_id === id);
            return assessment ? assessment.teacher : null;
          }).filter(teacher => teacher !== null);

          setMasterListTeacher(uniqueTeachers);
        } catch (error) {
          console.error("Error fetching data by general description:", error);
        }
      };
      fetchData();
    }
  }, [isOpen, generalDescription]);



  useEffect(() => {
    if (currentTeacher) {
      setCurrentList(currentTeacher.name);
    }
  }, [currentTeacher]);

  useEffect(() => {
    if (MasterListTeacher.length > 0) {
      setTodoDescriptions(MasterListTeacher.map(teacher => teacher.name).join('\n'));
      handleCopy();
      // setSelectedTodoIds(MasterListTeacher.map(teacher => teacher.teacher_id.toString()));

    }
  }, [currentTeacher, MasterListTeacher]);

  const handleTodoChange = (e) => {
    const { value } = e.target;
    const selectedValue = parseInt(value);

    setSelectedTodoIds(prevValues => {
      // Cập nhật danh sách các ID được chọn
      let updatedValues = [...prevValues];

      if (updatedValues.includes(selectedValue)) {
        updatedValues = updatedValues.filter(id => id !== selectedValue);
      } else {
        updatedValues.push(selectedValue);
      }

      // Cập nhật danh sách mô tả todo dựa trên ID đã chọn
      const selectedTodos = TeacherData
        .filter(teacher => updatedValues.includes(teacher.id))
        .map(teacher => teacher.name)
        .join('\n');

      setTodoDescriptions(selectedTodos);
      return updatedValues;
    });
  };
  const handleClear = () => {
    setSelectedTodoIds([]);
    setTodoDescriptions('');
  };
  const handleCopy = () => {
    if (currentTeacher.name) {
      setCurrentList(prevCurrentList => {
        if (prevCurrentList.includes(currentTeacher.name)) {
          return prevCurrentList + '\n' + todoDescriptions;
        }
      });
    }
  };
  const handleSave = async (teacherId, metaAssessments) => {
    try {
      const requests = metaAssessments.map(assessment => {
        const data = {
          meta_assessment_id: assessment.meta_assessment_id,
          teacher_id: teacherId
        };
        console.log("data", data);
        return axiosAdmin.post('/assessment', { data });
      });

      // Wait for all requests to complete
      await Promise.all(requests);
    } catch (e) {
      console.error("Error saving assessment:", e);
      message.error("Lỗi khi lưu phân công");
    }
  };
  const handleAssign = async () => {
    const namesArray = currentList.split('\n').map(name => name.trim()).filter(name => name !== '');
    console.log(namesArray)
    const assignedIds = TeacherData
      .filter(teacher => namesArray.includes(teacher.name))
      .map(teacher => teacher.id);


    if (assignedIds.length === 0) {
      message.error("Chưa chọn thêm giáo viên");
      return;
    }

    const completeId = MasterListTeacher.map(teacher => teacher.teacher_id); // IDs from MasterListTeacher

    // Calculate newId: IDs in assignedIds but not in completeId
    const newId = assignedIds.filter(id => !completeId.includes(id));

    // Calculate deleteId: IDs in completeId but not in assignedIds
    const deleteId = completeId.filter(id => !assignedIds.includes(id));

    console.log('newId:', newId); // IDs to be added
    console.log('deleteId:', deleteId); // IDs to be removed

    // Initialize arrays for promises
    const savePromises = newId.length > 0 ? newId.map(id => handleSave(id, assessments)) : [];
    const deletePromises = deleteId.length > 0 ? deleteId.map(id => handleDeleteData(id)) : [];


    try {
      // Execute promises if they exist
      await Promise.all([...savePromises, ...deletePromises]);
      message.success("Cập nhật phân công thành công");
      loadData();
    } catch (error) {
      console.error("Error in handleAssign:", error);
      message.error("Lỗi khi cập nhật phân công");
    }
  };
  const handleDeleteData = async (teacherId) => {
    try {
      await axiosAdmin.delete(`/assessment/teacher/${teacherId}`);
    } catch (e) {
      console.error("Error deleting assessments by teacher_id:", e);
      message.error("Lỗi khi xóa phân công");
    }
  };


  const handleDelete = () => {
    if (currentTeacher.name) {
      setCurrentList(prevCurrentList => {
        if (prevCurrentList.includes(currentTeacher.name)) {
          return currentTeacher.name;
        }
        return '';
      });
    }
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
            <ModalHeader className="text-[#FF9908]">Cập nhật phân công</ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center w-full">
                <Select
                  label="Chọn giáo viên"
                  name="todo_id"
                  value={selectedTodoIds.map(id => id.toString())}
                  onChange={handleTodoChange}
                  fullWidth
                  multiple
                >
                  {TeacherData.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </Select>
                <div className='flex gap-2 mt-4'>
                  <Textarea
                    label="Danh sách chính"
                    value={todoDescriptions}
                    readOnly
                    fullWidth
                  />
  
                  <div className='flex flex-col justify-between'>
                    {currentTeacher ? (
                      <div className='flex flex-col justify-between'>
                        <Button onClick={() => handleCopy(currentTeacher)}>
                          Sao chép
                        </Button>
                        <Button onClick={() => handleDelete(currentTeacher)}>
                          Xóa
                        </Button>
                        <Button onClick={handleClear}>
                          Xóa danh sách chính
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  <Textarea
                    label="Danh sách hiện tại"
                    value={currentList}
                    readOnly
                    fullWidth
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                variant="light"
                onClick={() => {
                  setMasterListTeacher([]);
                  onClose();
                }}
              >
                Đóng
              </Button>
              <Button
                type="submit"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  handleAssign();
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
  
};

export default ModalUpdateAllot;
