import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, LinearScale, CategoryScale, BarElement, PointElement, LineElement, RadarController, Title, Tooltip, Legend } from 'chart.js';
import { axiosAdmin } from '../../../../service/AxiosAdmin';
import { Button, Select } from 'antd';

ChartJS.register(RadialLinearScale, LinearScale, CategoryScale, BarElement, PointElement, LineElement, RadarController, Title, Tooltip, Legend);

const { Option } = Select;

export default function CLOChartComponent({ descriptions, setDescriptions, user, permission }) {
  const [selectedRadar, setSelectedRadar] = useState([]);
  const [radarChartData, setRadarChartData] = useState({ labels: [], datasets: [] });
  const [originalRadarData, setOriginalRadarData] = useState([]);
  const [allLabels, setAllLabels] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [teacherId, setTeacherId] = useState();

  useEffect(() => {
    if (user && user.teacher_id) {
      setTeacherId(user.teacher_id);
    }
  }, [user]);

  const fetchRadarChartData = async () => {
    if (!teacherId) return;

    try {
      const response = await axiosAdmin.post('/achieved-rate/clo/percentage', {
        teacher_id: teacherId,
        permission: permission
      });
      const data = response.data;

      const labelsSet = new Set();
      const datasetsMap = {};
      const descriptionsMap = {};

      data.forEach(subject => {
        subject.clos.forEach(clo => {
          labelsSet.add(clo.cloName);
          descriptionsMap[clo.cloName] = clo.description;
          if (!datasetsMap[subject.subjectName]) {
            datasetsMap[subject.subjectName] = {
              label: subject.subjectName,
              data: {},
              fill: true,
              borderColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`,
              pointBackgroundColor: '#6FDCE3',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#5C2FC2',
              pointHoverBorderColor: '#fff',
            };
          }
        });
      });

      const labelsArray = Array.from(labelsSet);

      data.forEach(subject => {
        subject.clos.forEach(clo => {
          if (!datasetsMap[subject.subjectName].data[clo.cloName]) {
            datasetsMap[subject.subjectName].data[clo.cloName] = (clo.percentage_score * 100).toFixed(2);
          }
        });
      });

      const datasets = Object.values(datasetsMap).map(dataset => ({
        ...dataset,
        data: labelsArray.map(label => dataset.data[label] || null)
      }));

      setOriginalRadarData(datasets);
      setAllLabels(labelsArray);
      setDescriptions(descriptionsMap);

      setSelectedRadar(datasets.slice(0, 3).map(dataset => dataset.label));

      setRadarChartData({ labels: labelsArray, datasets: datasets.slice(0, 3) });
    } catch (error) {
      console.error('Error fetching radar chart data:', error);
    }
  };

  useEffect(() => {
    fetchRadarChartData();
  }, [teacherId]);

  useEffect(() => {
    const selectedDatasets = originalRadarData.filter(dataset => selectedRadar.includes(dataset.label));
    const selectedLabelsSet = new Set();

    selectedDatasets.forEach(dataset => {
      dataset.data.forEach((score, index) => {
        if (score > 0) {
          selectedLabelsSet.add(allLabels[index]);
        }
      });
    });

    const newLabels = Array.from(selectedLabelsSet);

    setRadarChartData({
      labels: newLabels,
      datasets: selectedDatasets.map(dataset => ({
        ...dataset,
        data: newLabels.map(label => {
          const index = allLabels.indexOf(label);
          return dataset.data[index];
        })
      }))
    });
  }, [selectedRadar]);

  const handleRadarSelection = (value) => {
    setSelectedRadar(value);
  };

  const radarChartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 100
      }
    },
    elements: {
      point: {
        radius: 6,
        hoverRadius: 8
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const cloName = context.label;
            const description = descriptions[cloName];
            return `Tỉ lệ đạt được là ${value} %\n\n${description}`;
          }
        }
      }
    }
  };

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
                placeholder="Chọn năm học"
                value={selectedRadar}
                onChange={handleRadarSelection}
                className="w-full"
              >
                {originalRadarData.map((dataset, index) => (
                  <Option key={index} value={dataset.label}>
                    {dataset.label}
                  </Option>
                ))}
              </Select>
            </div>
          )}
        </div>
        <h2 className="text-xl font-semibold mb-4">Tỉ lệ đạt của chuẩn đầu ra của môn học</h2>
        <div className='h-[600px] w-full'>
          <Radar data={radarChartData} options={radarChartOptions} />
        </div>
      </div>
    </div>
  );
}
