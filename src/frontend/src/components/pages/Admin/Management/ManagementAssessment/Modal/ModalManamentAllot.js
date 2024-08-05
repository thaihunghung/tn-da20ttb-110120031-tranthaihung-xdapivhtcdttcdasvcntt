import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Button, Textarea, } from "@nextui-org/react";
import { message } from 'antd';
import { axiosAdmin } from '../../../../../../service/AxiosAdmin';
import { UseNavigate, UseTeacherAuth, UseTeacherId } from '../../../../../../hooks';
import { fetchAssessmentsByidTeacher } from '../Data/DataAssessmentGrading';
import { Table } from '@nextui-org/react';
import { handleReplaceCharacters } from '../../../Utils/Utils';

function ModalManamentAllot({ isOpen, onOpenChange, metaAssessment }) {
  UseTeacherAuth();
  const teacher_id = UseTeacherId();
  const handleNavigate = UseNavigate();


  const [assessments, setAssessments] = useState([]);

  const getUniqueAssessments = (assessments) => {
    const uniqueDescriptions = new Set();
    const uniqueAssessments = assessments.filter((assessment) => {
      const description = assessment?.MetaAssessment?.generalDescription;
      if (description && !uniqueDescriptions.has(description)) {
        uniqueDescriptions.add(description);
        return true;
      }
      return false;
    });
    return uniqueAssessments;
  };

  // Usage example inside your useEffect
  useEffect(() => {
    const getAssessments = async () => {
      try {
        const data = await fetchAssessmentsByidTeacher(teacher_id);
        if (data) {
          let filteredAssessments = data;
          if (metaAssessment.length > 0) {
            filteredAssessments = data.filter(
              (assessment) => !metaAssessment.some((meta) => meta.teacher_id === assessment.teacher_id)
            );
          }
          const uniqueAssessments = getUniqueAssessments(filteredAssessments);
          console.log(uniqueAssessments);

          setAssessments(uniqueAssessments);
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
        //message.error('Failed to fetch assessments. Please try again later.');
      }
    };

    if (teacher_id) {
      getAssessments();
    }
  }, [teacher_id, metaAssessment]);





  return (
    <Modal
      size="5xl"
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
            <ModalHeader className="text-[#FF9908]">Quản lý phân công</ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center w-full">
                <div className="overflow-x-auto w-full min-w-[300px]">
                  <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="w-full border-b border-gray-200">
                      <div className="flex">
                        <div className="w-1/3 p-4 bg-gray-100 font-semibold text-gray-700">
                          Người mời
                        </div>
                        <div className="w-2/3 p-4 bg-gray-100 font-semibold text-gray-700">
                          Lần chấm
                        </div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {assessments.map((assessment) => (
                        <div key={assessment.assessment_id} className="flex items-center">
                          <div className="w-1/3 p-4 text-gray-600">
                            {assessment.MetaAssessment.teacher?.name || 'N/A'}
                          </div>
                          <div
                            className="w-2/3 p-4 text-gray-600 uppercase cursor-pointer hover:bg-gray-200 hover:text-gray-800 transition-colors duration-300"
                            onClick={() => {
                              const description = assessment?.MetaAssessment?.generalDescription || 'N/A';
                              const formattedDescription = handleReplaceCharacters(description);

                              handleNavigate(`/admin/management-grading/${formattedDescription}/?description=${description}`);
                            }}
                          >
                            {assessment?.MetaAssessment?.generalDescription || 'N/A'}
                          </div>
                          <div className="ml-4">
                            <button
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors duration-300"
                              onClick={() => {
                                const description = assessment?.MetaAssessment?.generalDescription || 'N/A';
                                const formattedDescription = handleReplaceCharacters(description);

                                handleNavigate(`/admin/management-grading/${formattedDescription}/?description=${description}`);
                              }}
                            >
                              link
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
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

export default ModalManamentAllot;
