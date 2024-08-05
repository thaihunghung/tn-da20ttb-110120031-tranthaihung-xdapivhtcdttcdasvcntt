import React from "react";

import { axiosAdmin } from "../../../../../service/AxiosAdmin";

export const fetchRubricItemsData = async (id) => {
  try {
    const response = await axiosAdmin.get(`/rubric/${id}/items?isDelete=false&include_clos=true`);
    const rubric = response.data?.rubric || {};

    const DataCLOArray = rubric?.CloData;
    let count = 1;
    const RubricData = {
      rubricName: rubric?.rubricName || 'Unknown',
      subjectName: rubric?.subject?.subjectName || 'Unknown',
    };

    const updatedRubricData = rubric?.rubricItems?.map((item) => {
      const clo = {
        cloName: item?.CLO?.cloName || 'Unknown',
        description: item?.CLO?.description || 'No description',
      };
      const plo = {
        ploName: item?.PLO?.ploName || 'Unknown',
        description: item?.PLO?.description || 'No description',
      };
      const chapter = {
        chapterName: item?.Chapter?.chapterName || 'Unknown',
        description: item?.Chapter?.description || 'No description',
      };

      const action = {
        id: item?.rubricsItem_id || 'Unknown',
        number: count++
      }


      const rubricsItem  = { 
        rubricsItem_id: item?.rubricsItem_id,
        chapter_id: item?.chapter_id,
        clo_id: item?.clo_id ,
        rubric_id: item?.rubric_id,
        plo_id: item?.plo_id ,
        description: item?.description,
        maxScore: item?.maxScore,
        stt: item?.stt,
      }

      return {
        id: item?.rubricsItem_id || 'Unknown',
        cloName: clo,
        ploName: plo,
        chapterName: chapter,
        description: item?.description || 'Unknown',
        maxScore: item?.maxScore,
        action: action,
        rubricsItem: rubricsItem,
        chapters: item?.chapters || [],
        plos: item?.plos || [],
      };

    }) || [];
    console.log(updatedRubricData);
    return { updatedRubricData, DataCLOArray, RubricData};
  } catch (error) {
    console.error("Error: " + error.message);
  }
};

const columns = [
  { name: "id", uid: "id", sortable: true }, // Có thể sử dụng `key` hoặc `rubric_id` tùy thuộc vào cách bạn muốn hiển thị
  { name: "Clo", uid: "Clo", sortable: true },
  { name: "Plo", uid: "Plo", sortable: true },
  { name: "Chapter", uid: "Chapter", sortable: true },
  { name: "CloName", uid: "CloName", sortable: true },
  { name: "PloName", uid: "PloName", sortable: true },
  { name: "ChapterName", uid: "ChapterName", sortable: true },
  { name: "description", uid: "description", sortable: true },
  { name: "maxScore", uid: "maxScore", sortable: true },
  { name: "action", uid: "action", sortable: true },
];


const statusOptions = [
  {name: "SV chưa chấm", totalScore: 0},
];





export {columns, statusOptions};
