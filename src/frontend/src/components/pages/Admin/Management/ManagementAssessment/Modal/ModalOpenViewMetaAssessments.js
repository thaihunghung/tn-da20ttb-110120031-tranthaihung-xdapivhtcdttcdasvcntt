import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Button, Textarea, } from "@nextui-org/react";
import { message } from 'antd';
import { axiosAdmin } from '../../../../../../service/AxiosAdmin';
import { UseNavigate, UseTeacherAuth, UseTeacherId } from '../../../../../../hooks';
import { fetchAssessmentsByidTeacher } from '../Data/DataAssessmentGrading';
import { Table } from '@nextui-org/react';
import { handleReplaceCharacters } from '../../../Utils/Utils';
import PieChart from '../PieChart';

function ModalOpenViewMetaAssessments({ isOpen, onOpenChange, metaAssessment }) {
  UseTeacherAuth();
  const [charts, setCharts] = useState([]);
  const gradingCount = {};
  const noGradingCount = {};
  
  useEffect(() => {
    if (isOpen) {
      const JsonResultTeacherScore = [];
      metaAssessment.forEach((assessment) => {
        if (assessment?.Assessment?.length > 0) {
          assessment.Assessment.forEach((assess) => {
            const teacherName = assess.teacher?.name || 'N/A'; // Lấy tên giáo viên
            const teacherId = assess.teacher?.teacher_id || 'N/A'; // Lấy mã ID giáo viên
      
            // Kiểm tra totalScore và cập nhật đối tượng tương ứng
            if (assess.totalScore > 0) {
              if (!gradingCount[teacherName]) {
                gradingCount[teacherName] = {
                  count: 0,
                  id: teacherId // Lưu mã ID giáo viên
                };
              }
              gradingCount[teacherName].count++;
            } else {
              if (!noGradingCount[teacherName]) {
                noGradingCount[teacherName] = {
                  count: 0,
                  id: teacherId // Lưu mã ID giáo viên
                };
              }
              noGradingCount[teacherName].count++;
            }
          });
        }
      });
      
      const GVGD = metaAssessment[0].teacher_id
      // Tạo JSON kết quả
      for (const teacher in gradingCount) {
        JsonResultTeacherScore.push({
          name: teacher,
          id: gradingCount[teacher].id, // Thêm mã ID giáo viên
          grading: gradingCount[teacher].count,
          noGrading: noGradingCount[teacher]?.count || null, // Mặc định là 0 nếu không có điểm chưa chấm
        });
      }
      
      // Kết quả
      JsonResultTeacherScore.sort((a, b) => {
        const isATeacherGVGD = a.id === GVGD; // Kiểm tra xem a có phải là GVGD không
        const isBTeacherGVGD = b.id === GVGD; // Kiểm tra xem b có phải là GVGD không
      
        if (isATeacherGVGD && !isBTeacherGVGD) {
          return -1; // a là GVGD, đặt a lên trước
        }
        if (!isATeacherGVGD && isBTeacherGVGD) {
          return 1; // b là GVGD, đặt b lên trước
        }
        return 0; // Nếu cả hai đều là hoặc đều không phải, giữ nguyên thứ tự
      });

      const newCharts = JsonResultTeacherScore.map((teacher) => (
        <PieChart
          key={teacher.name} // Thêm key để tránh cảnh báo
          TeacherName={teacher.name} // Tên giáo viên
          Grading={teacher.grading} // Số điểm đã chấm
          NoGrading={teacher.noGrading} // Số điểm chưa chấm, mặc định là 0 nếu không có
        />
      ));
      setCharts(newCharts);
    }
  }, [isOpen, metaAssessment]);

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
            <ModalHeader className="text-[#FF9908] flex flex-col">
              <span className="text-lg font-semibold">Xem điểm cuối</span>
              <span className="text-lg text-gray-600 mt-1">
                Lớp: {metaAssessment[0]?.course?.courseName || 'N/A'}
              </span>
            </ModalHeader>

            <ModalBody>
              <div className="flex flex-col items-center w-full">

                <div className="flex flex-col lg:flex-row justify-center items-center w-full">
                  {charts}
                </div>
                <div className="overflow-x-auto w-full min-w-[300px]">
                  <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <th className="p-4 font-semibold text-gray-700 text-left">Sinh viên</th>
                          <th className="p-4 font-semibold text-gray-700 text-left">Điểm từ giáo viên</th>
                          <th className="p-4 font-semibold text-gray-700 text-left">Điểm cuối</th>
                        </tr>
                      </thead>
                      <tbody>
                        {metaAssessment.map((assessment) => (
                          <tr key={assessment.meta_assessment_id} className="divide-y divide-gray-200">
                            <td className="p-4 text-gray-600">
                              {assessment?.Student?.name || 'N/A'}
                            </td>
                            <td className="p-4 text-gray-600">
                              {assessment?.Assessment?.length > 0 ? (
                                assessment.Assessment
                                  .sort((a, b) => (a.teacher?.teacher_id === assessment.teacher_id ? -1 : 1))
                                  .map((assess, index) => (
                                    <div key={index}>
                                      GV {index + 1}: {assess.teacher?.name || 'N/A'} - {assess.totalScore}
                                    </div>
                                  ))
                              ) : (
                                'N/A'
                              )}
                            </td>
                            <td className="p-4 text-gray-600">
                              {assessment?.FinalScore || 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default ModalOpenViewMetaAssessments;
