import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
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

  const radarData = [
    {
      type: 'scatterpolar',
      r: percentages,
      theta: cloNames,
      fill: 'toself',
      name: 'CLO Achievement',
      text: descriptions.map((desc, index) => `${desc}: ${percentages[index]}%`),
      hoverinfo: 'text'
    }
  ];

  const layout = {
    polar: {
      radialaxis: {
        visible: true,
        range: [0, 100]
      }
    },
    width: 630,
    height: 440,
    showlegend: false,
    title: 'CLO Achievement Percentages'
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full">
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
          <Plot
            data={radarData}
            layout={layout}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default CloChart;
