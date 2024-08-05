import React, { useEffect, useState } from 'react';
import { axiosAdmin } from '../../../../service/AxiosAdmin';
import BarChartComponent from './BarChartComponent';
import CLOChartComponent from './CLOChartComponent';
import PLOChartComponent from './PLOChartComponent';
import CourseScoresScatterChart from './CourseScoresHistogramChart';
import StackedBarChart from './StackedBarChart';
import StudentScore from './StudentScore';
import ParallelCoordinatesChartComponent from './ParallelCoordinatesChartComponent';

export default function Dashboard() {
  const [user, setUser] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [permission, setPermission] = useState();
  const [filters, setFilters] = useState({
    year: [],
    semester: [],
    class: [],
    subject: [],
    course: []
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosAdmin.get(`${process.env.REACT_APP_API_DOMAIN_CLIENT}/user`);
        const user = response.data;
        setPermission(response.data.permission)
        setUser(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="p-8">
      
      {/* <header className="flex flex-col mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#6366F1]">Trang chủ</h1>
        </div>
        <div>
          <h2 className="flex justify-start text-xl font-bold ">Chào bạn {user.name}. 👋</h2>
          <p className='text-left'>Dưới đây là các biểu đồ</p>
        </div>
      </header> */}

      {/* <div className='grid grid-cols-2 mx-3'>
        <CLOChartComponent
          permission={permission}
          user={user}
          descriptions={descriptions}
          setDescriptions={setDescriptions}
        />

        <PLOChartComponent
          permission={permission}
          user={user}
        />
        <div className='col-span-2'>
          <ParallelCoordinatesChartComponent
            permission={permission}
            user={user}
            descriptions={descriptions}
            setDescriptions={setDescriptions}
          />
        </div>
        {permission == 1 && (
          <div className='col-span-2'>
            <StudentScore
              user={user}
            />
          </div>
        )}
        <BarChartComponent
          permission={permission}
          user={user}
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
      </div> */}

      {/* <div>
        <CourseScoresScatterChart
          user={user}
        />
      </div> */}

    </div>
  );
}
