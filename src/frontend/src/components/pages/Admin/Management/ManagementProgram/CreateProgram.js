import { useEffect, useState } from "react";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { Input } from "@nextui-org/react";
import { Button, message } from 'antd';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';

import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavProgram from "../../Utils/DropdownAndNav/DropdownAndNavProgram";
import DownloadAndUpload from "../../Utils/DownloadAndUpload/DownloadAndUpload";
import Tabs from "../../Utils/Tabs/Tabs";

const CreateProgram = (nav) => {
    const { setCollapsedNav } = nav;

    const [activeTab, setActiveTab] = useState(0);
    const [nameP, setNameP] = useState("");
    const [current, setCurrent] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [convertedContent, setConvertedContent] = useState(null);

    const handleSave = async () => {
        try {
            if (nameP === "") {
                alert("dữ liệu lỗi");
                document.getElementById("name-program").focus();
                return;
            }
            const data = { programName: nameP, description: convertedContent };
            const response = await axiosAdmin.post('/program', { data });

            if (response.status === 201) {
                message.success('Data saved successfully');
            } else {
                message.error(response.data.message || 'Error saving data');
            }
        } catch (error) {
            console.error(error);
            message.error('Error saving data');
        }
    };
    const handleOnChangeTextName = (nameP) => {
        setCurrent(nameP);
    };
    const handleDownloadProgram = async () => {
        try {
            const response = await axiosAdmin.get('program/templates/post', {
                responseType: 'blob'
            });

            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'program.xlsx';
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
        if (editorState) {
            let html = convertToHTML(editorState.getCurrentContent());
            setConvertedContent(html);
        }
    }, [editorState]);

    useEffect(() => {
        const handleResize = () => {
            setCollapsedNav(window.innerWidth < 1024);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [setCollapsedNav]);

    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7 bg-[#f5f5f5]-500">
            <DropdownAndNavProgram />
            <div className="w-full mt-5 rounded-lg">
                <Tabs tabs={[
                    {
                        title: 'Nhập liệu',
                        content: (
                            <div className="w-full rounded-lg">
                                <div className="w-full flex flex-col gap-2">
                                    <Input
                                        label="Name"
                                        placeholder="Enter your name program"
                                        value={nameP}
                                        onValueChange={setNameP}
                                        id="name-program"
                                    />
                                    <span className="font-bold text-left">Mô tả:</span>
                                    <Editor
                                        editorState={editorState}
                                        onEditorStateChange={setEditorState}
                                        wrapperClassName="wrapper-class w-full"
                                        editorClassName="editor-class px-5 border w-full"
                                        toolbarClassName="toolbar-class"
                                    />
                                    <div className="w-full flex justify-center items-center">
                                        <Button onClick={handleSave} className="mt-5 px-20 max-w-[300px] text-[#FEFEFE] hover:bg-[#475569] bg-[#AF84DD]">
                                            Tạo
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    },
                    {
                        title: 'Excels',
                        content: (
                            <DownloadAndUpload props={props} handleDownload={handleDownloadProgram} handleOnChangeTextName={handleOnChangeTextName} endpoint={'program'} method={'POST'} current={current}  setCurrent={setCurrent} fileList={fileList} setFileList={setFileList} />
                        )
                    }
                ]} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
        </div>
    );
};

export default CreateProgram;

