// src/hooks/UseTeacherAuth/UseTeacherAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const UseTeacherAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const teacher_id = Cookies.get('teacher_id');
    if (!teacher_id) {
      navigate('/login');
    }
  }, [navigate]);

  return null; // or any other return value if needed
};

export default UseTeacherAuth;
