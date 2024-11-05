import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Select, Button } from 'antd';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const { Option } = Select;

const CourseScoresHistogramChart = ({ user }) => {
  const [courseData, setCourseData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [teacherId, setTeacherId] = useState();
  const [permission, setPermission] = useState();

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

  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        const response = await axiosAdmin.post('/getAverageCourseScores',
          {
            course_id_list: selectedCourses,
            teacher_id: teacherId,
            permission: permission
          }
        );
        setScoreData(response.data);
      } catch (error) {
        console.error('Error fetching score data:', error);
      }
    };

    fetchScoreData();
  }, [selectedCourses, teacherId, permission]);

  const handleCourseSelection = (value) => {
    setSelectedCourses(value);
  };

  const processData = (data) => {
    const scoreCounts = data.reduce((acc, score) => {
      acc[score.course_id] = acc[score.course_id] || [];
      acc[score.course_id].push(score.score);
      return acc;
    }, {});
    return scoreCounts;
  };

  const processedData = processData(scoreData);

  const generateColor = (index) => {
    const colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0', '#ffb3e6', '#c4e17f', '#76D7C4', '#e77b9c', '#8e8c82', '#5e8b7e', '#f0ad4e', '#f06b8b', '#89cff0'];
    return colors[index % colors.length];
  };

  const histogramTraces = Object.keys(processedData).map((courseId, index) => {
    const courseName = courseData.find(course => course.course_id === parseInt(courseId))?.courseName;
    return {
      type: 'histogram',
      x: processedData[courseId],
      name: courseName,
      marker: {
        color: generateColor(index)
      },
      opacity: 0.75,
      hovertemplate: `Điểm: %{x}, Tỉ lệ: %{y:.3f}%, ${courseName}<extra></extra>`
    };
  });

  const layout = {
    title: 'Phân bố điểm',
    xaxis: {
      title: 'Điểm',
      range: [0, 10],
      tick0: 0,
      dtick: 1
    },
    yaxis: {
      title: 'Số lượng',
      tick0: 0,
      dtick: 1
    },
    barmode: 'overlay',
    width: 1100,
    height: 600
  };

  return (
    <div className="course-scores-histogram-chart bg-white shadow-md rounded-lg p-6 mb-6">
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
      <Plot
        data={histogramTraces}
        layout={layout}
      />
    </div>
  );
};

export default CourseScoresHistogramChart;
