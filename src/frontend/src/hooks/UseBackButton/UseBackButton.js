// frontend/src/hooks/useBackButton.js
import { useNavigate } from 'react-router-dom';

const UseBackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  return handleBack;
};

export default UseBackButton;
