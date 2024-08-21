import React, { useEffect, useState } from "react";
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Input, Button } from "@nextui-org/react";
import { message } from 'antd';
import "./Program.css"
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavProgram from "../../Utils/DropdownAndNav/DropdownAndNavProgram";

const UpdateProgram = (nav) => {
    const { setCollapsedNav } = nav;

    const [activeTab, setActiveTab] = useState(0);
    const [nameP, setNameP] = useState("");
    const [Program, setProgram] = useState({});
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [convertedContent, setConvertedContent] = useState(null);

    const getProgram = async () => {
        try {
            const response = await axiosAdmin.get('/program/IT');
            setProgram(response.data);
            setNameP(response.data.programName)
        } catch (error) {
            console.error("Error fetching program:", error);
            message.error('Error fetching program');
        }
    };

    useEffect(() => {
        getProgram();
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

    useEffect(() => {
        if (Program && Program.description) {
            const contentState = convertFromHTML(Program.description);
            if (contentState) {
                setEditorState(EditorState.createWithContent(contentState));
            }
        }
    }, [Program]);

    useEffect(() => {
        if (editorState) {
            let html = convertToHTML(editorState.getCurrentContent());
            setConvertedContent(html);
        }
    }, [editorState]);

    const handleUpdate = async () => {
        try {
            if (nameP === "") {
                alert("Dữ liệu lỗi");
                document.getElementById("name-program").focus();
                return;
            }
            const data = { programName: nameP, description: convertedContent };
            const response = await axiosAdmin.put('/program/IT', { data: data });
            if (response.status === 200) {
                message.success('Program updated successfully');
            } else {
                message.error(response.data.message || 'Error updating program');
            }
        } catch (error) {
            console.error("Error updating program:", error);
            message.error('Error updating program');
        }
    }

    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7 bg-[#f5f5f5]-500">
            <DropdownAndNavProgram />

            <Tabs
                tabs={[
                    {
                        title: 'Thông tin',
                        content: (
                            <div className="w-full rounded-lg">
                                <div className="w-full flex flex-col gap-2">
                                    <Input
                                        label="Tên"
                                        placeholder="Vui lòng nhập tên chương trình"
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
                                        <Button onClick={handleUpdate} className="mt-5 px-20 max-w-[300px] text-[#FEFEFE] hover:bg-[#475569] bg-[#AF84DD]">
                                            Cập nhật
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                ]}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        </div>
    );
}

export default UpdateProgram;

function Tabs({ tabs, activeTab, setActiveTab }) {
    return (
        <div>
            <table className="mb-2">
                <tbody>
                    <tr className="tab-buttons border-collapse border-[#020401] border">
                        {tabs.map((tab, index) => (
                            <td key={index}>
                                <button
                                    onClick={() => {
                                        setActiveTab(index);
                                    }}
                                    className={`${index === activeTab ? 'active bg-[#475569] text-[#FEFEFE] font-bold' : ' text-[#020401]'} text-base border p-2 px-7`}
                                >
                                    {tab.title}
                                </button>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <div className="w-full mt-5 rounded-lg">
                {tabs[activeTab].content}
            </div>
        </div>
    );
}
