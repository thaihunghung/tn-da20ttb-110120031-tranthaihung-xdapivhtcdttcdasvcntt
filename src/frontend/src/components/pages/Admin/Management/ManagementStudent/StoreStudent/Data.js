import { axiosAdmin } from "../../../../../../service/AxiosAdmin";

// Function to fetch student data from the API
export const fetchStudentsData = async (page, size) => {
  try {
    const response = await axiosAdmin.get(`/student/isDelete/true?page=${page}&size=${size}`);
    const data = response.data;
    if (data.students) {
      return {
        students: data.students,
        total: data.total,
      };
    } else {
      return {
        students: data,
        total: data.length,
      };
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
    return {
      students: [],
      total: 0,
    };
  }
};

// Example columns configuration for students
export const studentColumns = [
  { uid: "studentCode", name: "Mã sinh viên", sortable: true },
  { uid: "email", name: "Email", sortable: true },
  { uid: "name", name: "Tên sinh viên", sortable: true },
  { uid: "classNameShort", name: "Mã lớp", sortable: true },
  { uid: "className", name: "Tên lớp", sortable: true },
  { uid: "actions", name: "Hành động", sortable: false },
];
