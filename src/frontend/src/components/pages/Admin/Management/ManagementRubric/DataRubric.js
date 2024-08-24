import React from "react";

import { axiosAdmin } from "../../../../../service/AxiosAdmin";

export const fetchRubricData = async (teacher_id) => {
  try {
    const response = await axiosAdmin.get(`/rubrics/checkScore?teacher_id=${teacher_id}&isDelete=false`);
    const updatedRubricData = response.data?.rubric?.map((rubric) => {
      const Rubric = {
        rubric_id: rubric?.rubric_id || null,
        subject_id: rubric?.subject_id || null,
        teacher_id: rubric?.teacher_id || null,
        rubricName: rubric?.rubricName || null,
        comment: rubric?.comment || null,
      };

      const status = {
        status: rubric?.RubricItem && rubric.RubricItem.length > 0,
        id: rubric?.rubric_id || null,
      };

      return {
        id: rubric?.rubric_id || null,
        name: rubric?.rubricName || null,
        status: status,
        point: rubric?.RubricItem?.[0]?.total_score || 0.0,
        action: Rubric,
        createdAt: rubric?.createdAt || null,
      };
    }) || []; // Trả về mảng rỗng nếu response.data.rubric là undefined hoặc null

    return updatedRubricData;
  } catch (error) {
    console.error("Error: " + error.message);
    return [];
  }
};




const columns = [
  { name: "id", uid: "id", sortable: true }, // Có thể sử dụng `key` hoặc `rubric_id` tùy thuộc vào cách bạn muốn hiển thị
  { name: "Tên bảng TC", uid: "name", sortable: true },
  { name: "Tiêu chí ĐG", uid: "Items", sortable: true },
  { name: "Điểm", uid: "point", sortable: true },
  { name: "Ngày tạo", uid: "createdAt", sortable: true },
  { name: "Thao tác", uid: "action", sortable: true },
  
];

const statusOptions = [
  {name: "SV chưa chấm", totalScore: 0},
];





export {columns, statusOptions};
