import React, { useEffect, useState } from 'react';
import { PolarArea } from 'react-chartjs-2';
import 'chart.js/auto';
import { Card, CardBody } from '@nextui-org/react';
import { Button, Select } from 'antd';
import { AxiosClient } from '../../../../service/AxiosClient';

const CloChart = ({ studentCode }) => {
  const [showFilters, setShowFilters] = useState(true);
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await AxiosClient.post('/admin/course-enrollment/student', { studentCode });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching filters data:', error);
      }
    };
    fetchCourse();
  }, [studentCode]);

  useEffect(() => {
    if (courseId) {
      const fetchData = async () => {
        try {
          const response = await AxiosClient.post('/admin/getCloAchievedByCourse', {
            studentCode,
            course_id: courseId
          });
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [courseId, studentCode]);

  const optionsCourse = courses.map((item) => ({
    value: item.course_id,
    label: item.course.courseName,
  }));

  const cloNames = data.map(item => item.cloName);
  const percentages = data.map(item => item.percentageAchieved);
  const descriptions = data.map(item => item.cloDescription);

  const handleFilterChange = (value) => {
    setCourseId(value);
  };

  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
      colors.push(color);
    }
    return colors;
  };

  const backgroundColors = generateColors(data.length);
  const borderColors = backgroundColors.map(color => color.replace('0.6', '1'));

  const chartData = {
    labels: cloNames,
    datasets: [{
      label: 'Percentage Achieved',
      data: percentages,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 1
    }]
  };

  const customGridLinePlugin = {
    id: 'customGridLine',
    afterDraw: (chart) => {
      if (chart.config.type !== 'polarArea') return;

      const { ctx, chartArea: { top, left, bottom, right }, scales: { r } } = chart;

      const yAxis = r;
      const ticks = yAxis.ticks;
      const valueIndex = ticks.findIndex(tick => tick.value === 50);

      if (valueIndex >= 0) {
        const tick = ticks[valueIndex];
        const y = yAxis.getDistanceFromCenterForValue(tick.value);

        ctx.save();
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.arc(yAxis.xCenter, yAxis.yCenter, y, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: function (value) {
            return value;
          }
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'CLO Achievement Percentages'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const description = descriptions[context.dataIndex];
            const percentage = context.raw;
            return `${description}: ${percentage}%`;
          }
        }
      },
      customGridLine: {}
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-[700px]">
        <CardBody>
          <div className="flex items-center">
            <Button
              className='bg-[#6366F1] text-white'
              onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? 'Hide Filter' : 'Show Filter'}
            </Button>
          </div>
          {showFilters && (
            <div className="mb-6 p-6 bg-white shadow-md rounded-lg">
              <div>
                <div className="flex flex-col justify-center w-[50%]">
                  <label className="block mb-2">Chọn khóa học</label>
                  <Select
                    value={courseId}
                    style={{ width: '100%' }}
                    onChange={handleFilterChange}
                    placeholder="Chọn khóa học"
                    options={optionsCourse}
                  />
                </div>
              </div>
            </div>
          )}
          <h3 className="text-center mb-4">
            CLO Achievement Percentages
          </h3>
          <PolarArea data={chartData} options={options} plugins={[customGridLinePlugin]} />
        </CardBody>
      </Card>
    </div>
  );
};

export default CloChart;
