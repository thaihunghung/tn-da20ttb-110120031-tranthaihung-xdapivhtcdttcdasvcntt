import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Button, Textarea, } from "@nextui-org/react";

import Cookies from "js-cookie";

import { fetchDataGetMetaIdByGeneralDescription } from '../Data/DataAssessment';
import { message } from 'antd';
import { axiosAdmin } from '../../../../../../service/AxiosAdmin';
import { UseTeacherAuth, UseTeacherId } from '../../../../../../hooks';

function ModalAllot({ isOpen, onOpenChange, generalDescription, loadData}) {
  UseTeacherAuth()
  const teacher_id = UseTeacherId()

  const [selectedTodoIds, setSelectedTodoIds] = useState([]);
  const [todoDescriptions, setTodoDescriptions] = useState('');
  const [currentList, setCurrentList] = useState('');
  const [TeacherData, setTeacherData] = useState([]);
  const [MetaAssessment, setMetaAssessment] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState({});

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

  }, [teacher_id]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const {meta_assessment_ids} = await fetchDataGetMetaIdByGeneralDescription(generalDescription);
        setMetaAssessment(meta_assessment_ids);
      } catch (error) {
        console.error("Error fetching data by general description:", error);
      }
    };

    if (generalDescription) {
      fetchData();
    }
  }, [generalDescription]);

  useEffect(() => {
    if (currentTeacher)
      setCurrentList(currentTeacher.name)
  }, [currentTeacher]);

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
    const assignedIds = TeacherData
      .filter(teacher => namesArray.includes(teacher.name))
      .map(teacher => teacher.id);
  
    if (assignedIds.length === 0) {
      message.error("Chưa chọn thêm giáo viên");
      return;
    }
  
    // Add teacher_id to the list if not already included
    if (teacher_id && !assignedIds.includes(parseInt(teacher_id))) {
      assignedIds.push(parseInt(teacher_id));
    }
  
    // Create a list of promises for saving assessments
    const savePromises = assignedIds.map(id => handleSave(id, MetaAssessment));
  
    // Execute all save promises concurrently
    try {
      await Promise.all(savePromises);
      message.success("Phân công thành công");
      loadData();
    } catch (error) {
      console.error("Error in handleAssign:", error);
      message.error("Lỗi khi phân công");
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
            <ModalHeader className="text-[#FF9908]">Tạo mới phân công</ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center w-full">
                <Select
                  label="Chọn Todo"
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
                    label="Master list"
                    value={todoDescriptions}
                    readOnly
                    fullWidth
                  />

                  <div className='flex flex-col justify-between'>

                    {currentTeacher ? (
                      <div className='flex flex-col justify-between'>
                        <Button onClick={() => handleCopy(currentTeacher)}>
                          Copy
                        </Button>
                        <Button onClick={() => handleDelete(currentTeacher)}>
                          Delete
                        </Button>
                        <Button onClick={handleClear}>
                          Clear Master list
                        </Button>
                      </div>
                    ) : null}

                  </div>
                  <Textarea
                    label="Current list"
                    value={currentList}
                    readOnly
                    fullWidth
                  />
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
                Back
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
                Phân công
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalAllot;
