import React from "react";
import { Upload, Divider, Steps, Button } from 'antd';
import CustomUpload from "../../CustomUpload/CustomUpload";
import { UploadOutlined } from '@ant-design/icons';
const DownloadAndUpload = ({
  props, LoadData, Data, teacher, setCurrent, fileList, setFileList, handleDownload, endpoint, current, 
  handleOnChangeTextName, 
  method,
  disabled,
  itemStep
}) => {
    
  return (
    <div className="w-full rounded-lg">
    <div className=' w-full flex justify-center items-center'>
        <div className='w-full  flex flex-col px-2  sm:gap-5 sm:justify-center h-fix sm:px-5 lg:px-5 xl:px-5 sm:flex-col  lg:flex-col  xl:flex-col  gap-[20px]'>
            <div className='px-10 hidden sm:hidden lg:block xl:block'>
                <Divider />
                <Steps
                    current={current}
                    onChange={handleOnChangeTextName}
                    items={itemStep ? itemStep : [
                        { title: 'Bước 1', description: 'Tải về form' },
                        { title: 'Bước 2', description: 'Tải lại form' },
                        { title: 'Bước 3', description: 'Chờ phản hồi' }
                    ]}
                />
            </div>

            <div className='flex flex-col gap-5 justify-center items-center w-full  sm:flex-col sm:w-full lg:flex-row xl:flex-row'>
                <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%]  flex justify-start items-center'>
                    <div className='p-10 w-full mt-10 h-fix sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center  gap-5 rounded-lg'>
                        <div><p className='w-full text-center'>
                            {endpoint === '/assessment' ? 'Lấy tất cả sinh viên' : 'Tải Mẫu'}
                        </p></div>
                        <Button className='w-full bg-primary flex items-center justify-center  p-5 rounded-lg' onClick={handleDownload} disabled={disabled}>
                            <scan>Tải xuống mẫu </scan>
                        </Button>

                    </div>
                </div>
                <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-center items-center'>
                    <div className='p-10 w-full mt-10 sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
                        <div><p className='w-full text-center'>
                            {endpoint === '/assessment' ? 'Tải lại sinh viên' : 'Gửi lại mẫu'}
                            </p></div>
                        <Upload {...props} >
                            <Button icon={<UploadOutlined />} className='text-center items-center rounded-lg px-10 h-[40px]'>Select File</Button>
                        </Upload>
                    </div>
                </div>
                <div className='w-full sm:w-[80%] lg:w-[30%] xl:w-[30%] flex justify-end items-center'>
                    <div className='p-10 w-full mt-10 sm:h-fix  lg:min-h-[250px] xl:min-h-[250px] border-blue-500 border-1 flex flex-col items-center justify-center gap-5 rounded-lg'>
                        <div><p className='w-full text-center'>

                            {endpoint === '/assessment' ? 'Tạo lần chấm' : 'Cập nhật Dữ liệu'}
                        </p></div>
                        <CustomUpload endpoint={endpoint} method={method} LoadData={LoadData} Data={Data} teacher={teacher}  setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  );
}

export default DownloadAndUpload;

