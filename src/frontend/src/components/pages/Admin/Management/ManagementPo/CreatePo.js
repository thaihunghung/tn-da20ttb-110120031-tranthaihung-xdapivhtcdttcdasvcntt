import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { Button, Select, message} from 'antd';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavPo from "../../Utils/DropdownAndNav/DropdownAndNavPo";
import DownloadAndUpload from "../../Utils/DownloadAndUpload/DownloadAndUpload";
import Tabs from "../../Utils/Tabs/Tabs";

const CreatePo = (nav) => {
    const { setCollapsedNav } = nav;
    const [fileList, setFileList] = useState([]);
    const [programData, setProgramData] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [poName, setPoName] = useState("");
    const [Description, setDescription] = useState("");
    const [program_id, setProgram_id] = useState();
    const [current, setCurrent] = useState(0);

    const handleSave = async () => {
        try {
            if (poName === "") {
                alert("dữ liệu lỗi")
                document.getElementById("name-program").focus();
                return;
            }
            const data = {
                poName: poName,
                description: Description,
                program_id: program_id
            }

            const response = await axiosAdmin.post('/po', { data: data });
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

    const handleOnChangeTextName = (nameP) => {
        setCurrent(nameP);
    };

    const getAllProgram = async () => {
        try {
            const response = await axiosAdmin.get(`/program/isDelete/false`);
            if (response.data) {
                setProgramData(response.data);
            }
            console.log(response);
        } catch (error) {
            console.error("Error fetching programs:", error);
            message.error('Error fetching programs');
        }
    }
 
    const handleDownloadPo = async () => {
        try {
            const response = await axiosAdmin.get('/po/templates/post', {
                responseType: 'blob'
            });

            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'po.xlsx';
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
        getAllProgram()
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
        <div className="flex w-full flex-col px-4 justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
            <DropdownAndNavPo />
            <div className="w-full mt-5 rounded-lg">
                <Tabs tabs=
                    {[
                        {
                            title: 'Nhập liệu bằng form',
                            content:
                                <div className="w-full rounded-lg border">
                                    <div className="w-[50%] p-5 flex flex-col gap-2">
                                        <Input
                                            label="Name Po"
                                            placeholder="Enter your name Po"
                                            value={poName}
                                            onValueChange={setPoName}

                                        />
                                        <Input
                                            label="Description"
                                            placeholder="Enter your Description"
                                            value={Description}
                                            onValueChange={setDescription}

                                        />
                                        <Select
                                            defaultValue={"Chọn chương trình"}
                                            value={program_id}
                                            onChange={setProgram_id}
                                            size="large"
                                            className="w-full"
                                        >
                                            {programData.map((program) => (
                                                <Select.Option
                                                    key={program.program_id}
                                                    value={program.program_id}
                                                >
                                                    {program.programName}
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
                            <DownloadAndUpload props={props} handleDownload={handleDownloadPo} endpoint={'po'} method={'POST'} handleOnChangeTextName={handleOnChangeTextName} current={current} setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                        }
                    ]}
                    activeTab={activeTab} setActiveTab={setActiveTab}
                />
            </div>
        </div>
    );
}

export default CreatePo;
