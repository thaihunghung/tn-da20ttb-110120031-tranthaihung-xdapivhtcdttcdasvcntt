import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Button, message } from 'antd';
import { Input } from "@nextui-org/react";

import DropdownAndNavChapter from "../../Utils/DropdownAndNav/DropdownAndNavChapter";
import DownloadAndUpload from "../../Utils/DownloadAndUpload/DownloadAndUpload";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import Tabs from "../../Utils/Tabs/Tabs";
const CreateChapter = (nav) => {
    const { id } = useParams();
    const { setCollapsedNav } = nav;
    const [fileList, setFileList] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [chapterName, setChapterName] = useState("");
    const [Description, setDescription] = useState("");
    const [current, setCurrent] = useState(0);

    const handleOnChangeTextName = (nameP) => {
        setCurrent(nameP);
    };

    const handleSave = async () => {
        try {
            const data = {
                subject_id: id,
                chapterName: chapterName,
                description: Description,
            }

            const response = await axiosAdmin.post('/chapter', { data: data });
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

    const handleDownloadPo = async () => {
        try {
            const response = await axiosAdmin.get('/chapter/templates/post', {
                responseType: 'blob'
            });

            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'chapter.xlsx';
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
    }, []);

    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
            <DropdownAndNavChapter/>
            <div className="w-full mt-5 px-5 rounded-lg">
                <Tabs tabs=
                    {[
                        {
                            title: 'Nhập liệu bằng form',
                            content:
                                <div className="w-full rounded-lg border">
                                    <div className="w-[50%] p-5 flex flex-col gap-2">
                                        <Input
                                            label="Name Clo"
                                            placeholder="Enter your name Chapter"
                                            value={chapterName}
                                            onValueChange={setChapterName}

                                        />
                                        <Input
                                            label="Description"
                                            placeholder="Enter your Description"
                                            value={Description}
                                            onValueChange={setDescription}

                                        />
                                
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
                            <DownloadAndUpload props={props} endpoint={'chapter'} method={'POST'} Data={parseInt(id)} handleDownload={handleDownloadPo} handleOnChangeTextName={handleOnChangeTextName} current={current} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                        }
                    ]}
                    activeTab={activeTab} setActiveTab={setActiveTab}
                />
            </div>
        </div>
    );
}

export default CreateChapter;