// CreateRubic.js
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { Select, message } from 'antd';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const CreateRubic = (nav) => {
    const { loadData, isOpen, onClose } = nav;

    const [rubricName, setRubricName] = useState("");
    const [Comment, setComment] = useState("");
    const [subject_id, setSubject_id] = useState();
    const [DataSubject, setDataSubject] = useState([]);
    const navigate = useNavigate();
    const teacher_id = Cookies.get('teacher_id');
    if (!teacher_id) {
        navigate('/login');
    }
    const onCloseModal = () => {
        onClose(
            navigate(`/admin/management-rubric/list`)
        ); // This function can be called to close the modal
    };
    const handleSave = async () => {
        if (!subject_id) {
            message.error('Please select a subject');
            return; // Dừng hàm nếu subject_id là null
        }
        if (!rubricName) {
            message.error('Please input rubricName');
            return; // Dừng hàm nếu subject_id là null
        }

        const subjectName = DataSubject.find(subject => subject.subject_id === subject_id)?.subjectName;
        const subjectCode = DataSubject.find(subject => subject.subject_id === subject_id)?.subjectCode;
        
        const combinedString = `${subjectCode} - ${subjectName} - ${rubricName}`;
        try {
            const data = {
                subject_id: subject_id,
                teacher_id: teacher_id,
                rubricName: combinedString,
                comment: Comment,
            }

            const response = await axiosAdmin.post('/rubric', { data: data });
            if (response.status === 201) {
                message.success('Data saved successfully');
                loadData()
                onCloseModal()

            } else {
                message.error(response.data.message || 'Error saving data');
            }
        } catch (error) {
            console.error(error);
            message.error('Error saving data');
        }
    }
    const getAllSubject = async () => {
        try {
            const response = await axiosAdmin.get(`/subjects/isDelete/false`);
            if (response.data) {
                setDataSubject(response.data);
            }
            console.log(response);
        } catch (error) {
            console.error("Error fetching subjects:", error);
            message.error('Error fetching subjects');
        }
    }
    useEffect(() => {
        getAllSubject()
    }, []);

    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 bg-[#f5f5f5]-500">
            <div className="w-full mt-5 px-5 rounded-lg">
                <Modal
                    size="xl"
                    isOpen={isOpen}
                    scrollBehavior="outside"
                    hideCloseButton
                    motionProps={{
                        variants: {
                            enter: {
                                y: 0,
                                opacity: 1,
                                transition: {
                                    duration: 0.2,
                                    ease: "easeOut",
                                },
                            },
                            exit: {
                                y: -20,
                                opacity: 0,
                                transition: {
                                    duration: 0.1,
                                    ease: "easeIn",
                                },
                            },
                        }
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-[#FF9908]">Tạo mới bảng tiêu chí DG</ModalHeader>
                                <ModalBody>
                                    <div className='flex flex-col sm:flex-col sm:items-start lg:flex-row  xl:flex-row  justify-center items-center gap-2'>
                                        <div className='flex-1 w-full sm:w-full items-center p-5 pb-0 sm:pb-0 lg:pb-5 xl:pb-5  justify-center flex flex-col gap-2 sm:flex-col lg:flex-col xl:flex-col'>
                                            <div className='text-left w-full font-bold'>Chọn học phần:</div>
                                            <Select
                                                defaultValue={"Chọn học phần"}
                                                value={subject_id}
                                                onChange={setSubject_id}
                                                size="large"
                                                className="w-full"
                                            >
                                                {DataSubject.map((subject) => (
                                                    <Select.Option
                                                        key={subject.subject_id}
                                                        value={subject.subject_id}
                                                    >
                                                        {subject.subjectCode}{' - '}{subject.subjectName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                            <span className="text-left w-full font-bold">SubjectName + RubricName</span>
                                            <Input
                                                label="Tên bảng TC"
                                                placeholder="Nhập tên bảng TC"
                                                value={rubricName}
                                                onValueChange={setRubricName}

                                            />
                                            <Input
                                                label="Ghi chú"
                                                placeholder="Nhập ghi chú"
                                                value={Comment}
                                                onValueChange={setComment}

                                            />

                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onClick={onCloseModal}>
                                        Hủy
                                    </Button>
                                    <Button color="primary" onClick={handleSave}>
                                        Tạo
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}


export default CreateRubic;
