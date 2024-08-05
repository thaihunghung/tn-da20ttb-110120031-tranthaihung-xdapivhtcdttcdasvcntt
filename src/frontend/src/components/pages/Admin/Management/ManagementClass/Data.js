import { axiosAdmin } from "../../../../../service/AxiosAdmin";

// Function to fetch class data from the API
export const fetchClassesData = async (page, size, searchTerm) => {
  try {
    const response = await axiosAdmin.get(`/class-teacher?page=${page}&size=${size}&search=${searchTerm}`);
    const data = response.data;
    if (data.classes) {
      return {
        classes: data.classes,
        total: data.total,
      };
    } else {
      return {
        classes: data,
        total: data.length,
      };
    }
  } catch (error) {
    console.error("Error fetching class data:", error);
    return {
      classes: [],
      total: 0,
    };
  }
};

// Example columns configuration
export const columns = [
  { uid: "classCode", name: "Mã lớp", sortable: true },
  { uid: "className", name: "Tên lớp", sortable: true },
  { uid: "classNameShort", name: "Mã lớp", sortable: true },
  { uid: "nameTeacher", name: "Tên giáo viên cố vấn", sortable: true },
  { uid: "actions", name: "Hành động", sortable: false },
];

