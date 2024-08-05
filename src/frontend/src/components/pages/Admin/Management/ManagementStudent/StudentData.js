import { axiosAdmin } from "../../../../../service/AxiosAdmin";

// Function to fetch student data from the API
export const fetchStudentsData = async (page, size, searchTerm) => {
  try {
    const responseUser = await axiosAdmin.get(`${process.env.REACT_APP_API_DOMAIN_CLIENT}/user`);

    let studentsResponse;
    if (responseUser.data.permission == 1) {
      const teacher_id = responseUser.data.teacher_id;
      studentsResponse = await axiosAdmin.get(`/students?page=${page}&size=${size}&search=${searchTerm}&teacher_id=${teacher_id}`);
    } else {
      studentsResponse = await axiosAdmin.get(`/students?page=${page}&size=${size}&search=${searchTerm}`);
    }

    const data = studentsResponse.data;
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
