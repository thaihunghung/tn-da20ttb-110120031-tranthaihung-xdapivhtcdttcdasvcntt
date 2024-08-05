import React, { useEffect, useState } from 'react';
import { Card, Avatar, Input, Button, Divider, Spacer } from '@nextui-org/react';
import { useParams } from 'react-router-dom';
import { axiosAdmin } from '../../../../../../service/AxiosAdmin';
import StudentLearningOutcomeBarChart from './StudentLearningOutcomeBarChart';

const ProfileStudent = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [learningOutcomes, setLearningOutcomes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOutcomes, setFilteredOutcomes] = useState([]);

  useEffect(() => {
    // Fetch student data from API
    const fetchStudentData = async () => {
      try {
        const response = await axiosAdmin.get(`/student/${id}`);
        console.log("response.data", response.data);
        setStudent(response.data[0]);
      } catch (error) {
        console.error('Failed to fetch student data', error);
      }
    };

    // Fetch learning outcomes data from API
    const fetchLearningOutcomes = async () => {
      try {
        const response = await axiosAdmin.get(`/students/${id}/learning-outcome`);
        console.log("Learning outcomes data", response.data);
        setLearningOutcomes(response.data);
        setFilteredOutcomes(response.data);
      } catch (error) {
        console.error('Failed to fetch learning outcomes data', error);
      }
    };

    fetchStudentData();
    fetchLearningOutcomes();
  }, [id]);

  useEffect(() => {
    // Filter learning outcomes based on search term
    const filtered = learningOutcomes.filter(outcome =>
      outcome.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outcome.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outcome.semester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outcome.academic_year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outcome.classNameShort.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOutcomes(filtered);
  }, [searchTerm, learningOutcomes]);

  if (!student) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row p-4 gap-5">
      <Card className="w-full md:w-1/3 p-4 shadow-lg rounded-lg">
        <div className="flex items-center space-x-4">
          <Avatar
            src="https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg"
            className="w-20 h-20 text-large"
            alt="Avatar"
          />
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold">{student.name}</h3>
          </div>
        </div>
        <Divider className="my-4" />
        <div className="space-y-2 mt-5 mx-2 flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="text-gray-600">Mã sinh viên</p>
            <p className="font-medium">{student.studentCode}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{student.email}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Ngày sinh</p>
            <p className="font-medium">{student.date_of_birth}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Lớp</p>
            <p className="font-medium">{student.class.className}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Mã lớp</p>
            <p className="font-medium">{student.class.classNameShort}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Giáo viên cố vấn</p>
            <p className="font-medium">{student.class.teacher.name}</p>
          </div>
        </div>
        <div className="flex justify-end mt-9 mx-2">
          <Button className="bg-blue-500 text-white">Chỉnh sửa thông tin</Button>
        </div>
      </Card>
      <Spacer y={2} />
      
      <Card className="w-full md:w-2/3 p-4 shadow-lg rounded-lg">
      <div>
        <StudentLearningOutcomeBarChart />
      </div>
        <div className="flex justify-between items-center">
          <Input
            clearable
            placeholder="Search ..."
            width="100%"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button auto className="ml-4 bg-blue-500 text-white">Filter</Button>
        </div>
        <Divider className="my-4" />
        <div className='flex flex-col gap-5'>
          {filteredOutcomes.map((outcome, index) => (
            <div key={index}>
              <Card className="w-full p-4 shadow-md rounded-md">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium">{outcome.subjectName}</h4>
                </div>
                <div className="flex space-x-2 my-2">
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">{outcome.courseName}</span>
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">{outcome.academic_year}</span>
                  <span className="bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">{outcome.semester}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p>Score: {outcome.score}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center space-x-2">
                    <small>Teacher: {outcome.teacherName}</small>
                    <small>Class: {outcome.className}</small>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProfileStudent;
