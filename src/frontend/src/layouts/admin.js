
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { message, Spin } from 'antd';

import ManagePo from '../components/pages/Admin/Management/ManagementPo/ManagePo';
import StorePo from '../components/pages/Admin/Management/ManagementPo/StorePo';
import CreatePo from '../components/pages/Admin/Management/ManagementPo/CreatePo';
import UpdatePoById from '../components/pages/Admin/Management/ManagementPo/UpdatePoById';
import ManagePlo from '../components/pages/Admin/Management/ManagementPlo/ManagePlo';
import StorePlo from '../components/pages/Admin/Management/ManagementPlo/StorePlo';
import CreatePlo from '../components/pages/Admin/Management/ManagementPlo/CreatePlo';
import UpdatePloById from '../components/pages/Admin/Management/ManagementPlo/UpdatePloById';
import FormPoint from '../components/pages/Admin/FormPoint/FormPoint';
import Program from '../components/pages/Client/Program/Program';
import Nav from '../components/pages/Admin/Utils/Navbar/Navbar';
import Student from '../components/pages/Admin/Management/ManagementStudent/Student';
import StoreStudent from '../components/pages/Admin/Management/ManagementStudent/StoreStudent/StoreStudent';
import ManageProgram from '../components/pages/Admin/Management/ManagementProgram/ManageProgram';
import CreateProgram from '../components/pages/Admin/Management/ManagementProgram/CreateProgram';
import UpdateProgram from '../components/pages/Admin/Management/ManagementProgram/UpdateProgram';
import PoPlo from '../components/pages/Admin/Management/ManagementProgram/PoPlo';
import ManagementRubric from '../components/pages/Admin/Management/ManagementRubric/ManagementRubric';
import CreateRubic from '../components/pages/Admin/Management/ManagementRubric/CreateRubic';
import Template from '../components/pages/Client/Template/Template';
import Subject from '../components/pages/Admin/Management/ManagementSubject/Subject';
import Clo from '../components/pages/Admin/Management/ManagementSubject/Clo';
import CreateClo from '../components/pages/Admin/Management/ManagementSubject/CreateClo';
import CloPlo from '../components/pages/Admin/Management/ManagementSubject/CloPlo';
import Chapter from '../components/pages/Admin/Management/ManagementSubject/Chapter';
import ChapterClo from '../components/pages/Admin/Management/ManagementSubject/ChapterClo';
// import UpdateClo from '../components/pages/Admin/Management/ManagementSubject/UpdateClo';
import CreateChapter from '../components/pages/Admin/Management/ManagementSubject/CreateChapter';
import StoreClo from '../components/pages/Admin/Management/ManagementSubject/StoreClo';
import UpdateChapter from '../components/pages/Admin/Management/ManagementSubject/UpdateChapter';
import StoreChapter from '../components/pages/Admin/Management/ManagementSubject/StoreChapter';
import UpdateSubject from '../components/pages/Admin/Management/ManagementSubject/UpdateSubject';
import StoreSubject from '../components/pages/Admin/Management/ManagementSubject/StoreSubject';
import CreateSubject from '../components/pages/Admin/Management/ManagementSubject/CreateSubject';
import Class from '../components/pages/Admin/Management/ManagementClass/Class';
import Course from '../components/pages/Admin/Management/ManagementCourse/Course';
import MangementRubricItems from '../components/pages/Admin/Management/ManagementRubric/MangementRubricItems';
import CreateRubicItems from '../components/pages/Admin/Management/ManagementRubric/CreateRubicItems';
import StoreRubric from '../components/pages/Admin/Management/ManagementRubric/StoreRubric';
import View from '../components/pages/Admin/Management/ManagementRubric/View';
import ManagementAssessment from '../components/pages/Admin/Management/ManagementAssessment/ManagementAssessment';
import StoreRubicItems from '../components/pages/Admin/Management/ManagementRubric/StoreRubicItems';
import DetailCourse from '../components/pages/Admin/Management/ManagementCourse/DetailCourse/DetailCourse';
import Login from '../components/pages/Admin/Login/Login';
import UpdateRubricById from '../components/pages/Admin/Management/ManagementRubric/UpdateRubricById';
import ManagementAssessmentGrading from '../components/pages/Admin/Management/ManagementAssessment/ManagementAssessmentGrading';
import Teacher from '../components/pages/Admin/Management/ManagementTeacher/Teacher';
import StoreTeacher from '../components/pages/Admin/Management/ManagementTeacher/StoreTeacher/StoreTeacher';
import TeacherProfile from '../components/pages/Admin/Management/ManagementTeacher/DetailTeacher/TeacherProfile';
import Dashboard from '../components/pages/Admin/DashBoard/Dashboard';
import StoreClass from '../components/pages/Admin/Management/ManagementClass/StoreClass/StoreClass';
import ProfileStudent from '../components/pages/Admin/Management/ManagementStudent/Profile/ProfileStudent';
import StoreCourse from '../components/pages/Admin/Management/ManagementCourse/StoreCourse/StoreCourse';
import NotFound from '../components/pages/Admin/Utils/NotFoundPage/NotFound';
import ManagementAssessmentStore from '../components/pages/Admin/Management/ManagementAssessment/ManagementAssessmentStore';
import FormUpdateGrading from '../components/pages/Admin/Management/ManagementAssessment/Form/FormUpdateGrading';
import FormMultipleGrading from '../components/pages/Admin/Management/ManagementAssessment/Form/FormMultipleGrading';
import FormGrading from '../components/pages/Admin/Management/ManagementAssessment/Form/FormGrading';


function Admin({ user }) {
  const [collapsedNav, setCollapsedNav] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [spinning, setSpinning] = useState(false);
  const [permission, setPermission] = useState();

  const successNoti = (msg) => {
    messageApi.open({
      type: 'success',
      content: msg,
    });
  };
  const errorNoti = (msg) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };

  useEffect(() => {
    if (user) {
      setPermission(user.permission)
      console.log("permission", user)
    }
  }, [user])

  return (
    <div className="Admin flex flex-col sm:flex-row lg:flex-row xl:flex-row  h-[100vh] bg-[#FEFEFE]">
      {contextHolder}
      <Spin spinning={spinning} fullscreen />
      <Nav collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} setSpinning={setSpinning} user={user} />
      <div className='Admin-Content bg-[#FEFEFE] flex-1 h-full overflow-auto p-2 sm:p-5 sm:px-7 lg:p-5 lg:px-2 xl:p-5 xl:px-2'>
        <Routes>
          <Route path="/" element={<Dashboard user={user} collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />

          <Route path="/management-program/description" element={<ManageProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-program/create" element={<CreateProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-program/po-plo" element={<PoPlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-program/update" element={<UpdateProgram collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />

          <Route path="/Program" element={<Program collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/hung" element={<Template collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/point" element={<FormPoint collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />

          <Route path="/management-po/list" element={<ManagePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-po/store" element={<StorePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-po/create" element={<CreatePo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-po/update/:id" element={<UpdatePoById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />

          <Route path="/management-plo/list" element={<ManagePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-plo/store" element={<StorePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-plo/create" element={<CreatePlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-plo/update/:id" element={<UpdatePloById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />

          {/* <Route path="/management-rubric" element={<Rubic collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} /> */}

          <Route path="/management-subject/list" element={<Subject collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-subject/create" element={<CreateSubject collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-subject/store" element={<StoreSubject collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-subject/update/:id" element={<UpdateSubject collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />


          <Route path="/management-subject/:id/clo/update" element={<Clo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
         
          <Route path="/management-subject/:id/clo/create" element={<CreateClo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-subject/:id/clo/store" element={<StoreClo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-subject/:id/clo-plo" element={<CloPlo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />

          <Route path="/management-subject/:id/chapter/update" element={<Chapter collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-subject/:id/chapter/create" element={<CreateChapter collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-subject/:id/chapter/store" element={<StoreChapter collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-subject/:id/chapter-clo" element={<ChapterClo collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-subject/:id/chapter/update/:chapter_id" element={<UpdateChapter collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />

          <Route path="/management-grading/list" element={<ManagementAssessment collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-grading/store" element={<ManagementAssessmentStore collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />

          
          
          <Route path="/management-grading/:description" element={<ManagementAssessmentGrading collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />          
          <Route path="/management-grading/:description/student-code/:studentCode/assessment/:assessment_id/rubric/:rubric_id" element={<FormGrading collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />

          <Route path="/management-grading" element={<ManagementAssessment collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-grading/update/:description/student-code/:studentCode/assessment/:assessment_id/rubric/:rubric_id" element={<FormUpdateGrading collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          {/* lưu ý */}
          <Route path="/management-grading/:description/couse/:couse_id/rubric/:rubric_id" element={<FormMultipleGrading collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />

          {/* <Route path="/management-point" element={<FormPoint collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning}/>} /> */}
          <Route path="/management-rubric/list" element={<ManagementRubric collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-rubric/create" element={<CreateRubic collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-rubric/update/:id" element={<UpdateRubricById collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-rubric/store" element={<StoreRubric collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />


          <Route path="/management-rubric/:id/rubric-items/list" element={<MangementRubricItems collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-rubric/:id/rubric-items/create" element={<CreateRubicItems collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/management-rubric/:id/rubric-items/store" element={<StoreRubicItems collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          {/* <Route path="/management-rubric/:id/rubric-items/:rubric_item_id" element={<UpdateRubicItems collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} /> */}
          <Route path="/management-rubric/:id/rubric-items/template" element={<View collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />

          <Route path="/student" element={<Student collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/student/:id/profile" element={<ProfileStudent collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/student/store" element={<StoreStudent collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />

          {permission == 2 || permission == 3 && (
            <>
              <Route path="/class" element={<Class collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
              <Route path="/class/store" element={<StoreClass collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
            </>
          )}

          <Route path="/course" element={<Course collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/course/:id" element={<DetailCourse collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="/course/store" element={<StoreCourse collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />

          {permission === 3 && (
            <>
              <Route path="/teacher" element={<Teacher collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
              <Route path="/teacher/store" element={<StoreTeacher collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
            </>
          )}
          <Route path="/teacher/:id/profile" element={<TeacherProfile collapsedNav={collapsedNav} setCollapsedNav={setCollapsedNav} successNoti={successNoti} errorNoti={errorNoti} setSpinning={setSpinning} />} />
          <Route path="*" element={<NotFound />} /> {/* Add this line */}
        </Routes>
      </div>
    </div>
  );
}

export default Admin;
