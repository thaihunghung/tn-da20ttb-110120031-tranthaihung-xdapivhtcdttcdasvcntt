import React from "react";

import { axiosAdmin } from "../../../../../../service/AxiosAdmin";

export const fetchAssessmentDataGrading = async (teacher_id, descriptionURL, searchTerm = "") => {
  try {
    const response = await axiosAdmin.get(`/assessment?teacher_id=${teacher_id}&generalDescription=${descriptionURL}&isDelete=false`);
   // console.log("response.data");
    //console.log(response.data);
    const updatedPoData = response?.data?.map((Assessment) => {
      // Kiểm tra null cho student_id và totalScore là number
      const student_id = Assessment?.Student?.student_id !== null ? Assessment?.Student?.student_id : 0;
      const totalScore = Assessment?.assessment?.totalScore !== null ? Assessment?.assessment?.totalScore : 0;

      // Kiểm tra null cho các trường là string
      const studentCode = Assessment?.Student?.studentCode || '';
      const name = Assessment?.Student?.name || '';
      const generalDescription = Assessment?.generalDescription || '';
      const date = Assessment?.date || '';
      const place = Assessment?.place || '';

      const student = {
        student_id: student_id,
        studentCode: studentCode,
        name: name
      }

      const action = {
        totalScore: totalScore,
        assessment_id: Assessment?.assessment?.assessment_id || 0,
        rubric_id: Assessment?.rubric_id || 0,
        generalDescription: generalDescription,
        studentCode: studentCode,
        date: date,
        place: place,
        teacher_id: Assessment?.assessment?.teacher_id || 0,
        course_id: Assessment?.course_id || 0,
      }

      return {
        id: Assessment?.assessment?.assessment_id || 0,
        meta_assessment_id: Assessment?.meta_assessment_id || 0,
        Assessment: Assessment?.assessment,
        generalDescription: generalDescription,
        description: Assessment?.description || '',
        teacher_id: Assessment?.teacher_id,
        totalScore: totalScore,
        student: student,
        class: Assessment?.Student?.class?.classNameShort || '',
        action: action,
      };
    });

    const uniqueClasses = [...new Set(updatedPoData.map(item => item.class))];
    const classOptions = uniqueClasses.map(className => ({
      value: className,
      label: className
    }));

    const RubricArray = [
      {
        rubric_id: response?.data[0]?.Rubric?.rubric_id || 0,
        rubricName: response?.data[0]?.Rubric?.rubricName || ''
      }
    ];

    const CourseArray = [{
      course_id: response?.data[0]?.course?.course_id || 0,
      courseCode: response?.data[0]?.course?.courseCode || '',
      courseName: response?.data[0]?.course?.courseName || ''
    }];

    return {
      metaAssessment: updatedPoData,
      Rubric_id: response?.data[0]?.rubric_id || 0,
      Course_id: response?.data[0]?.course_id || 0,
      Classes: classOptions,
      RubricArray: RubricArray,
      CourseArray: CourseArray
    };
  } catch (error) {
    console.error("Error: " + error.message);
  }
};


export const fetchStudentDataByCourseId = async (id) => {
  try {
    const response = await axiosAdmin.get(`/course-enrollment/getAllStudentByCourseId/${id}`);
    // [data:  {
    //     "student_id": 1,
    //     "class_id": 8,
    //     "studentCode": "110120013",
    //     "email": "110120013@st.tvu.edu.vn",
    //     "name": "Nguyễn Minh Đăng",
    //     "isDelete": 0,
    //     "class": {
    //         "classCode": "100000"
    //     }
    // }]
    return response?.data?.data;

  } catch (error) {
    console.error("Error: " + error.message);
  }
};

export const fetchDataCheckTeacherAllot = async (teacher_id, meta_assessment_id) => {
  try {
    const response = await axiosAdmin.get(`/assessment/checkTeacher`, {
      params: {
        teacher_id,
        meta_assessment_id
      }
    });

    // Kiểm tra phản hồi từ API
    if (response?.data?.exists) {
      return { exists: true };
    } else {
      return { exists: false };
    }
  } catch (error) {
    console.error("Error: " + error.message);
    return { error: error.message };
  }
};
export const fetchAssessmentsByidTeacher = async (teacher_id) => {
  try {
    const response = await axiosAdmin.get(`assessment?isDelete=false&teacher_id=${teacher_id}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return null;
  }
};


const columns = [
  { name: "id", uid: "id", sortable: true },
  { name: "Mô tả chung", uid: "generalDescription", sortable: true },
  { name: "Tên đề tài", uid: "description", sortable: true },
  { name: "Lớp", uid: "class", sortable: true },
  { name: "SV", uid: "student", sortable: true },
  { name: "Điểm", uid: "totalScore", sortable: true },
  { name: "Thao tác", uid: "action", sortable: true },


  // {name: "ROLE", uid: "role", sortable: true},
  // {name: "TEAM", uid: "team"},
  // {name: "EMAIL", uid: "email"},
  // {name: "STATUS", uid: "status", sortable: true},
  // {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
  { name: "SV chưa chấm", totalScore: 0 },
];

export { columns, statusOptions };
