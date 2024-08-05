import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ path }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (path) {
      navigate(path); // Điều hướng đến path nếu có
    } else {
      navigate(-1); // Quay lại trang trước đó nếu không có path
    }
  };

  return (
    <button
      onClick={handleBack}
      className="sm:bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-xl flex items-center justify-center sm:shadow-lg"
    >
      <i className="fa-solid fa-arrow-left text-xl"></i>
    </button>
  );
};

export default BackButton;
