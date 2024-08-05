import React from "react";

import { axiosAdmin } from "../../../../../../service/AxiosAdmin";

export const fetchSujectDataGrading = async () => {
  try {
    const response = await axiosAdmin.get(`/subjects/isDelete/false`);
    const updatedPoData = response.data.map((subject) => {
      const clos = {
        id: subject.subject_id,
        check: subject.CLO.length > 0 ? true : false
      };

      const chapters = {
        id: subject.subject_id,
        checkCLo: subject.CLO.length > 0 ? true : false,
        checkChapter: subject.CHAPTER.length > 0 ? true : false
      };
      
      const Subject = {
        subject_id: subject.subject_id,
        subjectName: subject.subjectName,
        subjectCode: subject.subjectCode,
        description: subject.description,
        numberCredits: subject.numberCredits,
        numberCreditsTheory: subject.numberCreditsTheory,
        numberCreditsPractice: subject.numberCreditsPractice,
        typesubject: subject.typesubject

      }

      return {
        id: subject.subject_id,
        name: subject.subjectName,
        subjectCode: subject.subjectCode,
        description: subject.description,
        numberCredits: subject.numberCredits,
        clos: clos,
        chapters: chapters,
        numberCreditsTheory: subject.numberCreditsTheory,
        numberCreditsPractice: subject.numberCreditsPractice,
        typesubject: subject.typesubject,
        action: subject.subject_id,
        Subject: Subject,
        createdAt: subject.createdAt
      };
    });

    return updatedPoData;
  } catch (error) {
    console.error("Error: " + error.message);
  }
};



const columns = [
  {name: "id", uid: "id", sortable: true},
  {name: "name", uid: "name", sortable: true},
  {name: "Code", uid: "subjectCode", sortable: true},
  {name: "Clo", uid: "Clo", sortable: true},
  {name: "Chapter", uid: "Chapter", sortable: true},
  {name: "numberCreditsTheory", uid: "numberCreditsTheory", sortable: true},
  {name: "numberCreditsPractice", uid: "numberCreditsPractice", sortable: true},
  {name: "typesubject", uid: "typesubject", sortable: true},
  {name: "createdAt", uid: "createdAt", sortable: true},
  {name: "action", uid: "action", sortable: true},
];

const statusOptions = [
  {name: "Đại cương", id: "Đại cương"},
  {name: "Cơ sở ngành", id: "Cơ sở ngành"},
  {name: "Chuyên ngành", id: "Chuyên ngành"},
  {name: "Thực tập và Đồ án", id: "Thực tập và Đồ án"},
];

export {columns, statusOptions};
