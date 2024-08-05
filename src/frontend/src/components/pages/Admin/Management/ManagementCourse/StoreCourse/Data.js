import { axiosAdmin } from "../../../../../../service/AxiosAdmin";

// Function to fetch course data from the API
export const fetchCoursesData = async (page, size) => {
  try {
    const response = await axiosAdmin.get(`/course/isDelete/true?page=${page}&size=${size}`);
    const data = response.data;
    if (data.courses) {
      return {
        courses: data.courses,
        total: data.total,
      };
    } else {
      return {
        courses: data,
        total: data.length,
      };
    }
  } catch (error) {
    console.error("Error fetching course data:", error);
    return {
      courses: [],
      total: 0,
    };
  }
};

// Example columns configuration
export const columns = [
  { uid: "courseCode", name: "Mã môn học", sortable: true },
  { uid: "courseName", name: "Course Name", sortable: true },
  { uid: "classCode", name: "Class Code", sortable: true },
  { uid: "className", name: "Class Name", sortable: true },
  { uid: "teacherName", name: "Teacher Name", sortable: true },
  { uid: "actions", name: "Actions", sortable: false },
];
