import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { Select, Button } from 'antd';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const { Option } = Select;

const CourseScoresHistogramChart = ({ user }) => {
  const [courseData, setCourseData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showFilter, setShowFilter] = useState(true);
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
    const totalScores = data.length;
    const scoreCounts = data.reduce((acc, score) => {
      acc[score.score] = acc[score.score] || { count: 0, students: [] };
      acc[score.score].count += 1;
      acc[score.score].students.push(score.studentName);
      return acc;
    }, {});
    return Object.keys(scoreCounts).map(score => ({
      x: parseFloat(score),
      y: (scoreCounts[score].count / totalScores) * 100,
      students: scoreCounts[score].students
    })).sort((a, b) => a.x - b.x); // Sort scores in ascending order
  };

  const processedData = processData(scoreData);

  const barTrace = {
    type: 'bar',
    x: processedData.map(dataPoint => dataPoint.x),
    y: processedData.map(dataPoint => dataPoint.y),
    name: 'Percentage of Scores',
    marker: {
      color: 'rgba(75, 192, 192, 0.5)'
    },
    hovertemplate: 'Điểm: %{x}, Tỉ lệ: %{y:.3f}%<extra></extra>'
  };

  const lineTrace = {
    type: 'scatter',
    mode: 'lines+markers',
    x: processedData.map(dataPoint => dataPoint.x),
    y: processedData.map(dataPoint => dataPoint.y),
    name: 'Trend of Scores',
    line: {
      color: 'rgba(75, 192, 192, 1)'
    },
    hovertemplate: 'Điểm: %{x}, Tỉ lệ: %{y:.3f}%<extra></extra>'
  };

  const layout = {
    title: 'Phân bố điểm',
    xaxis: {
      title: 'Điểm',
      range: [0, 10],
      tick0: 0,
      dtick: 1
    },
    yaxis: {
      title: 'Tỉ lệ %',
      // range: [0, 100],
      tick0: 0,
      dtick: 1
    },
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
      <h2 className="text-xl font-bold text-[#6366F1]">Phân bố điểm</h2>
      <Plot
        data={[barTrace, lineTrace]}
        layout={layout}
      />
    </div>
  );
};

export default CourseScoresHistogramChart;
