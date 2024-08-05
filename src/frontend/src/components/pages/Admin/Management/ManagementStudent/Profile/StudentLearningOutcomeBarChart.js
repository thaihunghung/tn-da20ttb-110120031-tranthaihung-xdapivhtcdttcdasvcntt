import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { axiosAdmin } from '../../../../../../service/AxiosAdmin';
import { Button, Select } from 'antd';
import { useParams } from 'react-router-dom';
const { Option } = Select;

const StudentLearningOutcomeBarChart = () => {
  const [data, setData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAdmin.get(`/student/learning-outcome/${id}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const colors = [
    'rgba(75, 192, 192, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)'
  ];

  const borderColor = [
    'rgba(75, 192, 192, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ];

  const chartData = {
    labels: data.map(item => item.subjectName),
    datasets: [
      {
        label: 'Scores',
        data: data.map(item => item.score),
        backgroundColor: data.map((item, index) => colors[index % colors.length]),
        borderColor: data.map((item, index) => borderColor[index % borderColor.length]),
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Scores'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Subjects'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    }
  };

  return (
    <div className="student-learning-outcome-bar-chart bg-white shadow-md rounded-lg p-6 mb-6">
      <Button
        onClick={() => setShowFilter(!showFilter)}
        className="flex justify-start rounded">
        {showFilter ? 'Hide Filter' : 'Show Filter'}
      </Button>
      {showFilter && (
        // <Select
        //   mode="multiple"
        //   style={{ width: '100%' }}
        //   placeholder="Select Courses"
        //   onChange={handleCourseSelection}
        // >
        //   {courseData.map(course => (
        //     <Option key={course.course_id} value={course.course_id}>
        //       {course.courseName}
        //     </Option>
        //   ))}
        // </Select>
        <></>
      )}
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default StudentLearningOutcomeBarChart;
