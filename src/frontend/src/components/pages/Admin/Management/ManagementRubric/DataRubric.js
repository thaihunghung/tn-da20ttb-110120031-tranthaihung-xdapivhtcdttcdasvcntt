import React from "react";

import { axiosAdmin } from "../../../../../service/AxiosAdmin";

export const fetchRubricData = async (teacher_id) => {
  try {
    const response = await axiosAdmin.get(`/rubrics/checkScore?teacher_id=${teacher_id}&isDelete=false`);
    const updatedRubricData = response.data.rubric.map((rubric) => {
      const Rubric = {
        rubric_id: rubric.rubric_id,
        subject_id: rubric.subject_id,
        teacher_id: rubric.teacher_id,
        rubricName: rubric.rubricName,
        comment: rubric.comment,
      };

      const status = {
        status: rubric.RubricItem.length === 0 ? false : true,
        id: rubric.rubric_id
      };

      return {
        id: rubric.rubric_id,
        name: rubric.rubricName,
        status: status,
        point: rubric.RubricItem[0]?.total_score ? rubric.RubricItem[0].total_score : 0.0,
        action: Rubric,
        createdAt: rubric.createdAt
      };
    });

    return updatedRubricData;
  } catch (error) {
    console.error("Error: " + error.message);
  }
};



const columns = [
  { name: "id", uid: "id", sortable: true }, // Có thể sử dụng `key` hoặc `rubric_id` tùy thuộc vào cách bạn muốn hiển thị
  { name: "name", uid: "name", sortable: true },
  { name: "Items", uid: "Items", sortable: true },
  { name: "point", uid: "point", sortable: true },
  { name: "createdAt", uid: "createdAt", sortable: true },
  { name: "action", uid: "action", sortable: true },
  
];

const statusOptions = [
  {name: "SV chưa chấm", totalScore: 0},
];





export {columns, statusOptions};
