import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { AxiosClient } from '../../../../service/AxiosClient';

const Chart = ({ studentCode, filters }) => {
  const [boxPlotData, setBoxPlotData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);

  const fetchChartData = async () => {
    try {
      const processedFilters = {
        academic_year_id_list: filters.year.map(value => parseInt(value.split(' ')[0])),
        semester_id_list: filters.semester.map(value => parseInt(value.split(' ')[0])),
        class_id_list: filters.class.map(value => parseInt(value.split(' ')[0])),
        subject_id_list: filters.subject.map(value => parseInt(value.split(' ')[0])),
        course_id_list: filters.course.map(value => parseInt(value.split(' ')[0])),
        student_code: studentCode,
      };

      const response = await AxiosClient.post('/admin/getAverageCourseScoresByStudent', { processedFilters: processedFilters });
      const data = response.data;

      // Prepare data for box plot
      const labels = data.map(course => course.courseName);
      const scores = data.map(course => course.score);

      const groupedData = labels.reduce((acc, label, index) => {
        if (!acc[label]) acc[label] = [];
        acc[label].push(scores[index]);
        return acc;
      }, {});

      const boxPlotData = Object.keys(groupedData).map(course => ({
        y: groupedData[course],
        type: 'box',
        name: course,
        hovertemplate: `(${course}, %{y:.2f} điểm)<extra></extra>`,
      }));

      setBoxPlotData(boxPlotData);

      // Prepare data for line chart
      const studentData = data.filter(course => course.studentCode === studentCode);
      const lineChartData = {
        x: studentData.map(course => course.courseName),
        y: studentData.map(course => course.score),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Điểm của mình',
        line: { color: '#FF4C4C' }, // Custom color for the line chart
        hovertemplate: `(%{x}, %{y:.2f} điểm)<extra></extra>`,
      };

      setLineChartData([lineChartData]);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [filters, studentCode]);

  const commonLayout = {
    yaxis: { range: [0, 10] },
    xaxis: { showticklabels: false },
    margin: { t: 40, b: 40, l: 20, r: 10 },
    width: 630,
    height: 600,
    showlegend: true,
    legend: {
      orientation: "h",
      yanchor: "top",
      y: 0.8,
      xanchor: "left",
      x: 1,
      traceorder: "normal",
      font: {
        family: "sans-serif",
        size: 9,
        color: "#000"
      },
      bordercolor: "#E2E2E2",
      borderwidth: 2
    },
    hovermode: 'closest', // Ensures the hovertemplate is applied
  };

  return (
    <div className='grid grid-cols-1'>
      <div className='flex flex-col bg-white rounded-xl items-center shadow-md m-2 mt-2'>
        
        <Plot
          className='p-4'
          data={[...boxPlotData, ...lineChartData]}
          layout={{ title: 'Biểu đồ thể hiện điểm của sinh viên', ...commonLayout }}
        />
        
      </div>
    </div>
  );
};

export default Chart;
