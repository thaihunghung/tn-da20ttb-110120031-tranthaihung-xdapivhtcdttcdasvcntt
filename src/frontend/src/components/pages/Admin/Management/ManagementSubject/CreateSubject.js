import { useEffect, useState } from "react";

import { Input } from "@nextui-org/react";
import { Button, message, Select } from 'antd';

import DropdownAndNavSubject from "../../Utils/DropdownAndNav/DropdownAndNavSubject";
import DownloadAndUpload from "../../Utils/DownloadAndUpload/DownloadAndUpload";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import Tabs from "../../Utils/Tabs/Tabs";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const CreateSubject = (nav) => {
    const { setCollapsedNav } = nav;
    const [fileList, setFileList] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [subjectName, setSubjectName] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [description, setDescription] = useState("");
    const [numberCredit, setNumberCredit] = useState("");
    const [numberCreditsTheory, setNumberCreditsTheory] = useState("");
    const [numberCreditsPractice, setNumberCreditsPractice] = useState("");
    const [typeSubject, setTypeSubject] = useState("");
    const [current, setCurrent] = useState(0);

    const handleOnChangeTextName = (nameP) => {
        setCurrent(nameP);
    };

    const navigate = useNavigate();
    const teacher_id = Cookies.get('teacher_id');
    if (!teacher_id) {
        navigate('/login');
    }

    const handleSave = async () => {
        try {
            if (!/^\d{6}$/.test(subjectCode)) {
                message.error('SubjectCode must be a 6-digit number');
                return;
            }
            const data = {
                subjectName: subjectName,
                teacher_id: teacher_id,
                subjectCode: subjectCode,
                description: description,
                numberCredits: parseInt(numberCredit),
                numberCreditsTheory: parseInt(numberCreditsTheory),
                numberCreditsPractice: parseInt(numberCreditsPractice),
                typesubject: typeSubject
            }

            const response = await axiosAdmin.post('/subject', { data: data });
            if (response.status === 201) {
                message.success('Data saved successfully');
            } else {
                message.error(response.data.message || 'Error saving data');
            }
        } catch (error) {
            console.error(error);
            message.error('Error saving data');
        }
    }

    const handleDownloadSubject = async () => {
        try {
            const response = await axiosAdmin.get('/subject/templates/post', {
                responseType: 'blob'
            });


            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'subject.xlsx';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                setCurrent(1);
            }
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setCollapsedNav(true);
            } else {
                setCollapsedNav(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [setCollapsedNav]);
    const DataTypeSubject = [
        { key: '1', TypeSubject: 'Đại cương' },
        { key: '2', TypeSubject: 'Cơ sở ngành' },
        { key: '3', TypeSubject: 'Chuyên ngành' },
        { key: '4', TypeSubject: 'Thực tập đồ án' },
    ];
    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7">
            <DropdownAndNavSubject />
            <div className="w-full mt-5 px-5 rounded-lg">
                <Tabs tabs=
                    {[
                        {
                            title: 'Nhập liệu bằng form',
                            content:
                                <div className="w-full rounded-lg border">
                                    <div className="w-[50%] p-5 flex flex-col gap-2">
                                        <Input
                                            label="Tên subject"
                                            placeholder="Enter your name subject"
                                            value={subjectName}
                                            onValueChange={setSubjectName}
                                            className="w-full"
                                        />

                                        <Input
                                            label="Tên subject"
                                            placeholder="Enter SubjectCode format: '000000'"
                                            value={subjectCode}
                                            onValueChange={setSubjectCode}
                                            className="w-full"
                                        />

                                        <Input
                                            label="Mô tả"
                                            placeholder="Enter your Description"
                                            value={description}
                                            onValueChange={setDescription}
                                            className="w-full"
                                        />
                                        <Input
                                            label="Số tín chỉ"
                                            placeholder="Enter your NumberCredit"
                                            value={numberCredit}
                                            onValueChange={setNumberCredit}
                                            className="w-full"
                                        />
                                        <Input
                                            label="Số tín chỉ lý thuyết"
                                            placeholder="Enter your NumberCreditsTheory"
                                            value={numberCreditsTheory}
                                            onValueChange={setNumberCreditsTheory}
                                            className="w-full"
                                        />
                                        <Input
                                            label="Số tín chỉ thực hành"
                                            placeholder="Enter your NumberCreditsPractice"
                                            value={numberCreditsPractice}
                                            onValueChange={setNumberCreditsPractice}
                                            className="w-full"
                                        />
                                      
                                      <span className="font-bold text-left">Chọn loại học phần</span>

        <Select
            value={typeSubject}
            onChange={(value) => setTypeSubject(value)}
            size="large"
            className="w-full"
        >
            {DataTypeSubject.map((TypeSubject) => (
                <Select.Option
                    key={TypeSubject.key}
                    value={TypeSubject.TypeSubject}
                >
                    {TypeSubject.TypeSubject}
                </Select.Option>
            ))}
        </Select>
                                        <div className="w-full flex justify-center items-center">
                                            <Button color="primary" onClick={handleSave} className="max-w-[300px] mt-5 px-20">
                                                Tạo
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                        },
                        {
                            title: 'Nhập liệu CSV',
                            content:
                                <DownloadAndUpload props={props} endpoint={'subject'} method={'POST'} handleDownload={handleDownloadSubject} handleOnChangeTextName={handleOnChangeTextName} current={current} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                        }
                    ]}
                    activeTab={activeTab} setActiveTab={setActiveTab}
                />
            </div>
        </div>
    );
}


export default CreateSubject;
