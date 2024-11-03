import React from 'react';
import Plot from 'react-plotly.js';

const PieChart = ({TeacherName, Grading, NoGrading}) => {
    const data = [
        {
          values: [Grading, NoGrading],
          labels: ['Đã chấm điểm', 'Chưa chấm điểm'],
          type: 'pie',
          marker: {
            colors: ['#FF8077', '#AF84DD'], 
          },
        },
      ];
    
      const layout = {
        title: TeacherName,
        height: 400,
        width: 500,
      };
    
      return (
        <Plot
          data={data}
          layout={layout}
        />
      );
};

export default PieChart;
