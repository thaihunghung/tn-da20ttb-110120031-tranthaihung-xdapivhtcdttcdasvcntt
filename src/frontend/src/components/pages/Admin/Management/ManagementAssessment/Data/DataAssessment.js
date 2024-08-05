import React from "react";

import { axiosAdmin } from "../../../../../../service/AxiosAdmin";

export const fetchAssessmentData = async (teacher_id) => {
  try {
    const response = await axiosAdmin.get(`/meta-assessments?teacher_id=${teacher_id}&isDelete=false`);
    const Data = response?.data?.map((items) => ({
        id: items?.course_id ?? null,
        teacher_id: items.teacher_id,
        generalDescription: items?.generalDescription ?? '',
        assessmentCount: items?.assessmentCount ?? 0,
        studentCount: items?.studentCount ?? 0,
        courseName: items?.courseName ?? '',
        status: items?.status ?? '',
        action: items?.generalDescription ?? '',
        Assessment: items?.Assessment ?? [],
        metaAssessment: {
          rubric_id: items?.metaAssessment?.rubric_id ?? null,
          course_id: items?.metaAssessment?.course_id ?? null,
          generalDescription: items?.metaAssessment?.generalDescription ?? '',
          date: items?.metaAssessment?.date ?? '',
          place: items?.metaAssessment?.place ?? '',
        },
        statusAllot: items?.statusAllot,
        RubicItemsData: items?.metaAssessment?.Rubric?.rubricItems ?? [],
        RubicData: items?.metaAssessment?.Rubric ?? null,
        createdAt: items?.createdAt ?? ''
    }));
    return Data;
  } catch (error) {
    console.error("Error: " + error.message);
    return []; // Trả về một mảng rỗng trong trường hợp lỗi
  }
};

export const fetchDataGetMetaIdByGeneralDescription = async (generalDescription) => {
  try {
    const response = await axiosAdmin.get(`/meta-assessments?generalDescription=${generalDescription}&isDelete=false`);
    const meta_assessment_ids = response?.data?.meta_assessment_ids ?? [];
    const assessments = response?.data?.assessments ?? [];
    return {
      meta_assessment_ids: meta_assessment_ids,
      assessments: assessments
    }; 
  } catch (error) {
    console.error("Error: " + error.message);
    return []; // Trả về một mảng rỗng trong trường hợp lỗi
  }
};

export const fetchAssessmentDataTrue = async (teacher_id) => {
  try {
    const response = await axiosAdmin.get(`/meta-assessments?teacher_id=${teacher_id}&isDelete=true`);
    const Data = response?.data?.map((items) => ({
        key: items?.generalDescription,
        generalDescription: items?.generalDescription,
        assessmentCount: items?.assessmentCount,
        studentCount: items?.studentCount,
        courseName: items?.courseName,
        status: items?.status,
        action: items?.generalDescription,
    }));
    return Data;
  } catch (error) {
    console.error("Error: " + error.message);
  }
};

const columns = [
  {name: "id", uid: "id", sortable: true},
  {name: "generalDescription", uid: "generalDescription", sortable: true},
  {name: "assessmentCount", uid: "assessmentCount", sortable: true},
  {name: "studentCount", uid: "studentCount", sortable: true},
  {name: "courseName", uid: "courseName", sortable: true},
  {name: "Phân công", uid: "Phân công", sortable: true},
  {name: "createdAt", uid: "createdAt", sortable: true},
  {name: "status", uid: "status", sortable: true},
  {name: "action", uid: "action", sortable: true},
];

const statusOptions = [
  {name: "SV chưa chấm", totalScore: 0},
];





export {columns, statusOptions};
