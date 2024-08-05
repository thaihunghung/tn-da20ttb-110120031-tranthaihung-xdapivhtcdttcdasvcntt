import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const StackedBarChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosAdmin.post('/getPloPercentageContainSubject')
      .then(response => {
        const data = response.data;
        const processedData = processChartData(data);
        setChartData(processedData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const processChartData = (data) => {
    let subjects = Object.keys(data[Object.keys(data)[0]]);
    let plos = Object.keys(data);

    // Calculate the total score for each PLO
    let ploTotals = {};
    plos.forEach(plo => {
      let totalScore = 0;
      Object.keys(data[plo]).forEach(subject => {
        data[plo][subject].forEach(student => {
          totalScore += student.total_assessment_score;
        });
      });
      ploTotals[plo] = totalScore;
    });

    // Prepare data for Plotly
    let plotData = subjects.map(subject => {
      let ploScores = plos.map(plo => {
        let subjectTotal = data[plo][subject]?.reduce((acc, curr) => acc + curr.total_assessment_score, 0) || 0;
        let ploTotal = ploTotals[plo] ? ploTotals[plo] : 1; // To avoid division by zero
        let subjectRatio = (subjectTotal / ploTotal) * 100;
        return parseFloat(subjectRatio.toFixed(2));
      });

      return {
        x: plos,
        y: ploScores,
        name: subject,
        type: 'bar',
        text: ploScores.map(score => `${subject}: ${score.toFixed(2)}%`),
        hoverinfo: 'text'
      };
    });

    return plotData;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-white shadow-md rounded-lg p-6 mb-6 h-[700px]'>
      <h2 className="text-xl font-semibold mb-4">Tỉ lệ chuẩn đầu ra của chương trình đào tạo</h2>
      {chartData.length > 0 && (
        <Plot
          data={chartData}
          layout={{
            barmode: 'stack',
            title: 'Tỉ lệ chuẩn đầu ra của chương trình đào tạo',
            xaxis: { title: 'PLOs' },
            yaxis: { title: 'Subject Contribution (%)' },
            hovermode: 'closest'
          }}
        />
      )}
    </div>
  );
};

export default StackedBarChart;
