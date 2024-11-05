import React, { useEffect, useState } from 'react';
import { Select, Button } from 'antd';
import Plot from 'react-plotly.js';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const { Option } = Select;

export default function HeatMapComponent({ user, permission }) {
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

      const labelsArray = Array.from(labelsSet).sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ''), 10);
        const numB = parseInt(b.replace(/\D/g, ''), 10);
        return numA - numB;
      });

      setOriginalData(subjectsData);
      setAllLabels(labelsArray);

      setSelectedSubjects(subjectsData.map(dataset => dataset.subjectName));
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

  const plotData = [{
    z: chartData.map(data => allLabels.map(label => data[label])),
    x: allLabels,
    y: chartData.map(data => data.subjectName),
    type: 'heatmap',
    colorscale: [
      [0, 'rgb(71, 147, 175, 0.3)'], //lowest value
      [0.5, 'rgb(255, 196, 112, 0.9)'], // middle value
      [1, 'rgb(221, 87, 70, 1)'] //highest value
    ],
    zmin: 0,
    zmax: 100
  }];

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
                title: 'Môn học',
                automargin: true,
                // tickangle: -45,
              },
              width: 900,
              height: 500,
              plot_bgcolor: 'rgba(240, 240, 240, 0.9)',
              paper_bgcolor: 'rgba(255, 255, 255, 1)',
              margin: { l: 150, r: 50, b: 100, t: 100, pad: 4 },
              coloraxis: {
                cmin: 0,
                cmax: 100,
                colorbar: {
                  title: 'Percentage',
                  ticksuffix: '%'
                }
              }
            }}
            config={{ displayModeBar: true }}
          />
        </div>
      </div>
    </div>
  );
}
