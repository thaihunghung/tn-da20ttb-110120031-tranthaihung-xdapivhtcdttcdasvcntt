import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { axiosAdmin } from '../../../../service/AxiosAdmin';
import { Button, Select } from 'antd';
const { Option } = Select;

const StudentScore = ({ user }) => {
  const [data, setData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [teacherId, setTeacherId] = useState();
  const [permission, setPermission] = useState();
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (user && user.teacher_id) {
      setTeacherId(user.teacher_id);
      setPermission(user.permission);
    }
  }, [user]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosAdmin.post('/course-all', {
          teacher_id: teacherId,
          permission: permission
        });
        setCourseData(response.data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourses();
  }, [teacherId, permission]);

  const handleCourseSelection = (value) => {
    setSelectedCourses(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAdmin.post('/getScoreStudentByCourseAndTeacher', {
          course_id_list: selectedCourses,
          teacher_id: teacherId,
          permission: permission
        });
        
        setData(response.data);
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };

    fetchData();
  }, [selectedCourses, teacherId, permission]);

  const getChartData = () => {
    const studentNames = [...new Set(data.map(item => item.studentName))];
    const courseNames = [...new Set(data.map(item => item.courseName))];

    const datasets = courseNames.map((courseName, index) => {
      const scores = studentNames.map(studentName => {
        const studentData = data.find(item => item.studentName === studentName && item.courseName === courseName);
        return studentData ? studentData.studentScore : null;
      });

      return {
        label: courseName,
        data: scores,
        borderColor: `rgba(${(index * 100) % 255}, ${(index * 50) % 255}, ${(index * 150) % 255}, 1)`,
        backgroundColor: `rgba(${(index * 100) % 255}, ${(index * 50) % 255}, ${(index * 150) % 255}, 0.2)`,
      };
    });

    return {
      labels: studentNames,
      datasets,
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: false,
          text: 'Students',
        },
        ticks: {
          display: false, // Hide the student names on the x-axis
        },
      },
      y: {
        title: {
          display: true,
          text: 'Scores',
        },
        beginAtZero: true,
        min: 0,
        max: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="mx-auto my-8 bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="mb-4">
        <Button
          onClick={() => setShowFilter(!showFilter)}
          className="flex justify-start rounded mb-2">
          {showFilter ? 'Hide Filter' : 'Show Filter'}
        </Button>
        {showFilter && (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Courses"
            onChange={handleCourseSelection}
          >
            {courseData.map(course => (
              <Option key={course.course_id} value={course.course_id}>
                {course.courseName}
              </Option>
            ))}
          </Select>
        )}
      </div>
      <div className="mt-4 h-[500px] w-[100%]">
        {data.length > 0 ? (
          <Line data={getChartData()} options={chartOptions} />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default StudentScore;
