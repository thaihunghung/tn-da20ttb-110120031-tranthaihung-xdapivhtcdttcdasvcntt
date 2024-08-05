import { axiosAdmin } from "../../../../../service/AxiosAdmin";

// Function to fetch data from the API
export const fetchTeachersData = async (page, size, searchTerm = "") => {
  try {
    const response = await axiosAdmin.get(`/teacher?page=${page}&size=${size}&search=${searchTerm}`);
    const data = response.data;
    if (data.teachers) {
      return {
        teachers: data.teachers,
        total: data.total,
      };
    } else {
      return {
        teachers: data,
        total: data.length,
      };
    }
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    return {
      teachers: [],
      total: 0,
    };
  }
};

// Example columns configuration
export const columns = [
  { uid: "name", name: "Name", sortable: true },
  { uid: "teacherCode", name: "Teacher Code", sortable: true },
  { uid: "email", name: "Email", sortable: true },
  { uid: "permission", name: "Permission", sortable: true },
  { uid: "permissionName", name: "Permission Name", sortable: true },
  { uid: "typeTeacher", name: "Type Teacher", sortable: true },
  { uid: "actions", name: "Action", sortable: false },
];

// Status options
export const permissions = [
  { id: "1", name: "Giáo viên" },
  { id: "2", name: "Quản trị viên" },
  { id: "3", name: "Siêu quản trị viên" },
];
