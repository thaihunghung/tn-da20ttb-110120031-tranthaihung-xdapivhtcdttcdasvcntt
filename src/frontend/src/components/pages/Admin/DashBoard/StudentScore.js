import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const StudentScore = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAdmin.post('/getScoreStudentByCourseAndTeacher', {
          teacher_id: 15,
          course_id: 28
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };

    fetchData();
  }, []);

  const getChartData = () => {
    const labels = data.map(item => item.studentName);
    const scores = data.map(item => item.studentScore);

    return {
      labels,
      datasets: [
        {
          label: 'Student Scores',
          data: scores,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Students',
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
        display: false,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="container mx-auto my-8 bg-white shadow-md rounded-lg p-6 mb-6">
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
