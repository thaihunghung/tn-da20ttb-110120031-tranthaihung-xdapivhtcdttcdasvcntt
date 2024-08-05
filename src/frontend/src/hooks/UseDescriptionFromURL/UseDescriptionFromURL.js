import { useLocation } from 'react-router-dom';

const UseDescriptionFromURL = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const descriptionString = searchParams.get('description');
  let descriptionURL = null;

  if (descriptionString) {
    try {
      descriptionURL = decodeURIComponent(descriptionString);
    } catch (error) {
      console.error('Error processing description:', error);
    }
  }

  return descriptionURL;
};

export default UseDescriptionFromURL;
