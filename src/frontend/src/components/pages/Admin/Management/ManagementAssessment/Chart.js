import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const Chart = ({ score }) => {
  const [w, setw] = useState(window.innerWidth < 500 ? 350 : window.innerWidth < 1000 ? 800 : 1000);
  const dynamicMargins = w < 500 ? { t: 5, b: 5, l: 5, r: 5 } : { t: 80, b: 160, l: 50, r: 50 };
  const countscore = `${'Tổng SV: ' + score.length}`;

  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);
      if (window.innerWidth < 500) {
        setw(400); // Chiều rộng cho màn hình nhỏ hơn 500px
      } else if (window.innerWidth < 1000) {
        setw(800); // Chiều rộng cho màn hình từ 500px đến 999px
      } else {
        setw(1000); // Chiều rộng cho màn hình lớn hơn hoặc bằng 1000px
      }
    };

    handleResize(); // Gọi ngay lần đầu để xác định chiều rộng ban đầu
    window.addEventListener("resize", handleResize); // Thêm sự kiện resize

    return () => {
      window.removeEventListener("resize", handleResize); // Dọn dẹp sự kiện khi component unmount
    };
  }, []);

  const scoreCounts = score.reduce((acc, curr) => {
    const key = curr.toFixed(2);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const x = Object.keys(scoreCounts).map(Number);
  const y = Object.values(scoreCounts);

  const colors = x.map(score => {
    if (score >= 0 && score < 1) return 'rgba(169,169,169,0.8)';
    if (score >= 1 && score < 2) return 'rgba(255,127,127,0.8)';
    if (score >= 2 && score < 3) return 'rgba(255,179,71,0.8)';
    if (score >= 3 && score < 4) return 'rgba(255,255,102,0.8)';
    if (score >= 4 && score < 5) return 'rgba(144,238,144,0.8)';
    if (score >= 5 && score < 6) return 'rgba(135,206,235,0.8)';
    if (score >= 6 && score < 7) return 'rgba(147,112,219,0.8)';
    if (score >= 7 && score < 8) return 'rgba(238,130,238,0.8)';
    if (score >= 8 && score < 9) return 'rgba(221,160,221,0.8)';
    if (score >= 9 && score <= 10) return 'rgba(255,105,180,0.8)';
    return 'rgba(210,180,140,0.8)';
  });

  return (
    <Plot
      data={[
        {
          x: x,
          y: y,
          type: 'bar',
          marker: {
            color: colors,
            line: {
              color: 'rgba(0,0,0,0.4)',
              width: 2,
            },
          },
          text: y.map(count => `${count}`),
          textfont: {
            size: 20,
            color: '#333',
          },
          textposition: 'outside',
          hoverinfo: 'x+y',
        },
      ]}
      layout={{
 
        width: w,
        height: 700,
        title: {
          text: 'Phân tích điểm số sinh viên',
          font: {
            size: 28,
            family: 'Helvetica, Arial, sans-serif',
            color: '#444',
          },
        },
        xaxis: {
          title: 'Điểm Số',
          tickvals: x,
          tickfont: {
            size: 14,
            color: '#666',
          },
          titlefont: {
            size: 20,
            color: '#333',
          },
        },
        yaxis: {
          title: countscore,
          range: [0, Math.max(...y) + 2],
          tickfont: {
            size: 14,
            color: '#666',
          },
          titlefont: {
            size: 20,
            color: '#333',
          },
          gridcolor: 'rgba(200,200,200,0.4)',
          zerolinecolor: 'rgba(150,150,150,0.4)',
        },
        bargap: 0.05,
        bargroupgap: 0.1,
        paper_bgcolor: '#fefefe',
        plot_bgcolor: '#fafafa',
        margin: dynamicMargins,

        hoverlabel: {
          bgcolor: 'white',
          bordercolor: 'black',
          font: { size: 14 },
        },
        showlegend: false,
      }}
      config={{
        responsive: true, // Bật tính năng responsive
        displayModeBar: false,
      }}
    />
  );
};

export default Chart;
