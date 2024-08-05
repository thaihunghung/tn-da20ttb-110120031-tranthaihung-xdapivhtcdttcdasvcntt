// src/hooks/UseNavigate/UseNavigate.js
import { useNavigate } from 'react-router-dom';

const UseNavigate = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return handleNavigate;
};

export default UseNavigate;
