import React, { useEffect, useState } from 'react';
import { Select, Button } from 'antd';
import Plot from 'react-plotly.js';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const { Option } = Select;

export default function LineChartComponent({ user, permission }) {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [allLabels, setAllLabels] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [teacherId, setTeacherId] = useState();

  useEffect(() => {
    if (user && user.teacher_id) {
      setTeacherId(user.teacher_id);
    }
  }, [user]);

  const fetchChartData = async () => {
    if (!teacherId) return;

    try {
      const response = await axiosAdmin.post('/achieved-rate/plo/percentage', {
        teacher_id: teacherId,
        permission: permission
      });
      const data = response.data;

      const labelsSet = new Set();
      const subjectsData = [];

      data.forEach(subject => {
        const subjectData = { subjectName: subject.subjectName };
        subject.plos.forEach(plo => {
          labelsSet.add(plo.ploName);
          subjectData[plo.ploName] = (plo.percentage_score * 100).toFixed(2);
        });
        subjectsData.push(subjectData);
      });

      const labelsArray = Array.from(labelsSet);

      setOriginalData(subjectsData);
      setAllLabels(labelsArray);

      setSelectedSubjects(subjectsData.map(dataset => dataset.subjectName));
      // setChartData(subjectsData.slice(0, 3));
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [teacherId]);

  useEffect(() => {
    const selectedDatasets = originalData.filter(dataset => selectedSubjects.includes(dataset.subjectName));
    setChartData(selectedDatasets);
  }, [selectedSubjects]);

  const handleSubjectSelection = (value) => {
    setSelectedSubjects(value);
  };

  const plotData = chartData.map((data, index) => {
    return {
      type: 'scatter',
      mode: 'lines+markers',
      name: data.subjectName,
      x: allLabels,
      y: allLabels.map(label => data[label]),
      line: { color: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})` }
    };
  });

  return (
    <div className='mx-2'>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="mb-6">
          <Button
            onClick={() => setShowFilter(!showFilter)}
            className="flex justify-start rounded">
            {showFilter ? 'Hide Filter' : 'Show Filter'}
          </Button>
          {showFilter && (
            <div className='flex flex-wrap mt-4'>
              <div>
                <p>Chọn môn học</p>
              </div>
              <Select
                mode="multiple"
                placeholder="Chọn môn học"
                value={selectedSubjects}
                onChange={handleSubjectSelection}
                className="w-full"
              >
                {originalData.map((dataset, index) => (
                  <Option key={index} value={dataset.subjectName}>
                    {dataset.subjectName}
                  </Option>
                ))}
              </Select>
            </div>
          )}
        </div>
        <div className='h-[500px] w-full'>
          <Plot
            data={plotData}
            layout={{
              title: {
                text: 'Tỉ lệ đạt của chuẩn đầu ra của chương trình',
                font: {
                  size: 24,
                },
              },
              xaxis: {
                title: 'PLO',
              },
              yaxis: {
               
                range: [0, 100]
              },
              width: 1100, 
              height: 500,
              plot_bgcolor: 'rgba(240, 240, 240, 0.9)',
              paper_bgcolor: 'rgba(255, 255, 255, 1)',
              margin: { l: 50, r: 50, b: 100, t: 100, pad: 4 }
            }}
          />
        </div>
      </div>
    </div>
  );
}
