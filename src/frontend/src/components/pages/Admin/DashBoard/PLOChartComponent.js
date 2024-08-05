import React, { useEffect, useState } from 'react';
import { axiosAdmin } from '../../../../service/AxiosAdmin';
import { Select, Button } from 'antd';
import Plot from 'react-plotly.js';

const { Option } = Select;

const PLOChartComponent = ({ user }) => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [selectedPLO, setSelectedPLO] = useState([]);
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
    const fetchData = async () => {
      if (!teacherId || !permission) return;
      
      try {
        const response = await axiosAdmin.post('/achieved-rate/plo/percentage', {
          teacher_id: teacherId,
          permission: permission
        });

        const ploData = response.data[0].plos.map((plo) => ({
          name: plo.ploName,
          percentage: (plo.percentage_score * 100).toFixed(2),
        }));
        setData(ploData);
        setOriginalData(ploData);
        setSelectedPLO(ploData.map(plo => plo.name));
      } catch (error) {
        console.error('Error fetching PLO data:', error);
      }
    };

    fetchData();
  }, [teacherId, permission]);

  useEffect(() => {
    const filteredData = originalData.filter(plo => selectedPLO.includes(plo.name));
    setData(filteredData);
  }, [selectedPLO, originalData]);

  const handlePLOSelection = (value) => {
    setSelectedPLO(value);
  };

  const ploNames = data.map(plo => plo.name);
  const ploPercentages = data.map(plo => plo.percentage);

  const chartData = [
    {
      type: 'bar',
      x: ploNames,
      y: ploPercentages,
      text: ploPercentages.map(String),
      textposition: 'auto',
      hoverinfo: 'x+y',
      marker: {
        color: 'rgba(75, 192, 192, 0.6)',
        line: {
          color: 'rgba(75, 192, 192, 1)',
          width: 1.5,
        },
      },
    },
  ];

  const chartLayout = {
    title: {
      text: 'Tỉ lệ đạt của chuẩn đầu ra của chương trình',
      font: {
        size: 24,
      },
    },
    xaxis: {
      title: {
        text: 'PLOs',
        font: {
          size: 18,
        },
      },
      tickangle: -45,
    },
    yaxis: {
      title: {
        font: {
          size: 18,
        },
      },
      range: [0, 100],
      gridcolor: 'rgba(200, 200, 200, 0.3)',
    },
    width: 550,
    height: 600,
    plot_bgcolor: 'rgba(240, 240, 240, 0.9)',
    paper_bgcolor: 'rgba(255, 255, 255, 1)',
  };

  return (
    <div className="plo-chart bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="mb-4">
        <Button
          onClick={() => setShowFilter(!showFilter)}
          className="flex justify-start rounded mb-3">
          {showFilter ? 'Hide Filter' : 'Show Filter'}
        </Button>
        {showFilter && (
          <div>
            <p className='text-left mb-1'>Chọn các chuẩn đầu ra hiển thị</p>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select PLOs"
              defaultValue={selectedPLO}
              onChange={handlePLOSelection}
            >
              {originalData.map(plo => (
                <Option key={plo.name} value={plo.name}>
                  {plo.name}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-4">Tỉ lệ đạt của chuẩn đầu ra của chương trình</h2>
      <div className="">
        <Plot data={chartData} layout={chartLayout} />
      </div>
    </div>
  );
};

export default PLOChartComponent;
