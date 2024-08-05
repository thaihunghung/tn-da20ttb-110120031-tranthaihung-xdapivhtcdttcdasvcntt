// src/hooks/UseTeacherId/UseTeacherId.js
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UseTeacherId = () => {
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    const id = Cookies.get('teacher_id');
    setTeacherId(id);
  }, []);

  return teacherId;
};

export default UseTeacherId;
