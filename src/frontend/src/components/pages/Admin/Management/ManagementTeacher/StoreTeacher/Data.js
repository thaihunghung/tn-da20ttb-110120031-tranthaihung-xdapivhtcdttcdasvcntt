import { axiosAdmin } from "../../../../../../service/AxiosAdmin";

export const fetchBlockedTeachersData = async (page, size) => {
  try {
    const response = await axiosAdmin.get(`/teachers-store?page=${page}&size=${size}`);
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

export const columns = [
  { uid: "name", name: "Name", sortable: true },
  { uid: "teacherCode", name: "Teacher Code", sortable: true },
  { uid: "email", name: "Email", sortable: true },
  { uid: "permission", name: "Permission", sortable: true },
  { uid: "permissionName", name: "Permission Name", sortable: true },
  { uid: "typeTeacher", name: "Type Teacher", sortable: true },
  { uid: "actions", name: "Action", sortable: false },
];

