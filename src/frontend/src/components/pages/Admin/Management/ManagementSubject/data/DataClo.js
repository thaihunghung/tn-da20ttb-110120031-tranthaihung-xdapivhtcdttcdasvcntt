import React from "react";

import { axiosAdmin } from "../../../../../../service/AxiosAdmin";

export const fetchClo = async (id) => {
  try {
    const response = await axiosAdmin.get(`/clos?subject_id=${id}&isDelete=false`);
    const updatedPoData = response.data.map((clo) => ({
      key: clo?.clo_id,
      name: clo?.cloName,
      description: clo?.description,
      type: clo?.type,
      isDeleted: clo?.isDelete,
      action: {
        _id: clo?.clo_id,
        CLO: {
          clo_id: clo?.clo_id,
          cloName: clo?.cloName,
          type: clo?.type,
          description: clo?.description,
          subject_id: clo?.subject_id,
        }
      }
    }));

    return updatedPoData;
  } catch (error) {
    console.error("Error: " + error.message);
    return [];
  }
};


