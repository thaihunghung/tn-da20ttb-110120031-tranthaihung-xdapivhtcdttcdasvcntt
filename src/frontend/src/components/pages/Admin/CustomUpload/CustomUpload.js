import React, { useState } from 'react';
import { Button, message } from 'antd';
import { axiosAdmin } from '../../../../service/AxiosAdmin';

const CustomUpload = ({ endpoint, setCurrent, fileList, setFileList, method, LoadData, Data, teacher }) => {
  const [uploading, setUploading] = useState(false);
  const handleUpload = () => {
    console.log(Data)
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files[]', file);
    });
    formData.append('data', JSON.stringify(Data));
    
    setUploading(true);
    const axiosRequest = method === 'POST' ? axiosAdmin.post : axiosAdmin.put;

    axiosRequest(`/importExcel/${endpoint}`, formData)
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (data.error) {
          message.error(data.error);
          message.error(data.detail);
        } else {
          setFileList([]);
          message.success(data.message);
          //setCurrent(2);
          if (LoadData) {
            LoadData();
          }
        }
      })
      .catch((error) => {
        console.error('Upload failed:', error);
        message.error('Upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  
  return (
    <div className='text-xl w-full flex flex-col items-center mt-4'>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        className='w-full p-5 flex justify-center items-center rounded-lg'
      >
        <span className='w-full'>{uploading ? 'Đang tải lên' : 'Bắt đầu tải lên'}</span>
      </Button>
    </div>
  );
};

export default CustomUpload;
