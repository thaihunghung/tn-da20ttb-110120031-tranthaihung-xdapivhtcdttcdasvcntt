import React, { useEffect, useState } from "react";
import { message, DatePicker, Space } from 'antd';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Tooltip,
    Input,
    Select,
    SelectItem,
    Button,
    Textarea,
    DateInput,
    Divider,
} from "@nextui-org/react";

import CustomUpload from "../../../CustomUpload/CustomUpload";
import { CalendarDate } from "@internationalized/date";
import { axiosAdmin } from "../../../../../../service/AxiosAdmin";

const ModalCreateAssessment = ({
    isOpen,
    onOpenChange,
    onSubmit,
    load
}) => {
    const [rubric_id, setRubric_id] = useState();
    const [course_id, setCourse_id] = useState();
    const [courseName, setCourseName] = useState("");
    const [DataRubric, setDataRubric] = useState([]);
    const [filterRubicData, setfilterRubicData] = useState([]);
    const [RubicDataCompe, setRubicDataCompe] = useState([]);
    const [defaultRubric, setDefaultRubric] = useState("Chọn Rubric");
    const [DataCourse, setCourseByTeacher] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [newRubric, setNewRubric] = useState({
        teacher_id: Cookies.get('teacher_id'),
        course_id: "",
        rubric_id: "",
        description: "",
        courseName: "",
        place: "",
        date: "",
    });
    const today = new Date();
  const [selectedDate, setSelectedDate] = useState(new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()));
    const navigate = useNavigate();
    const teacher_id = Cookies.get('teacher_id');

    useEffect(() => {
        if (!teacher_id) {
            navigate('/login');
        }
    }, [teacher_id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewRubric((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCourseChange = (e) => {
        const Value = e.target.value;
        console.log("value");
        console.log(Value);
        setNewRubric((prev) => ({
            ...prev,
            course_id: Value,
        }));
        const selectedCourse = DataCourse.find(course => course.course_id === parseInt(Value));
        console.log("DataCourse");
        console.log(DataCourse);
        console.log("selectedCourse");
        console.log(selectedCourse);
        if (selectedCourse) {
            setCourse_id(selectedCourse.course_id);
            setCourseName(selectedCourse.courseCode + "_" + selectedCourse.courseName);

            setNewRubric((prev) => ({
                ...prev,
                courseName: selectedCourse.courseCode + "_" + selectedCourse.courseName,
            }));

            getRubricBySubject(selectedCourse.subject_id);
            setRubric_id(null);
        }
    };

    const handleRubricSelectChange = (e) => {
        const Value = e.target.value;
        setNewRubric((prev) => ({
            ...prev,
            rubric_id: Value,
        }));
    };

    const handleDateChange = (newDate) => {
        const formattedDate = `${newDate.year}-${newDate.month}-${newDate.day}`;
        setNewRubric((prev) => ({
            ...prev,
            date: formattedDate,
        }));
        setSelectedDate(newDate);
    };

    const getRubricBySubject = async (idSubject) => {
        try {
            const response = await axiosAdmin.get(`/subject/${idSubject}/rubrics?teacher_id=${teacher_id}`);
            if (response.data) {
                setDataRubric(response.data);
            }
        } catch (error) {
            console.error("Error fetching Rubric:", error);
        }
    };

    useEffect(() => {
        const filteredData = filterRubicData.filter(filterItem =>
            DataRubric.some(dataItem => dataItem.rubric_id === filterItem.rubric_id)
        );
        setRubicDataCompe(filteredData);
        setDefaultRubric('Chọn Rubric');
        console.log("Filtered Data:", filteredData);
    }, [DataRubric, filterRubicData]);

    useEffect(() => {
        const getAllRubricIsDeleteFalse = async () => {
            try {
                const response = await axiosAdmin.get(`/rubrics/checkScore?teacher_id=${teacher_id}&isDelete=false`);
                const updatedRubricData = response.data.rubric.map((rubric) => {
                    const status = {
                        status: rubric.RubricItem.length === 0 ? false : true,
                        _id: rubric.rubric_id
                    };
                    return {
                        rubric_id: rubric.rubric_id,
                        rubricName: rubric.rubricName,
                        status: status,
                        point: rubric.RubricItem[0]?.total_score ? rubric.RubricItem[0].total_score : 0.0,
                        action: rubric.rubric_id
                    };
                });
                setfilterRubicData(updatedRubricData);
                console.log(updatedRubricData);
            } catch (error) {
                console.error("Error: " + error.message);
                message.error('Error fetching Rubric data');
            }
        };

        const getCourseByTeacher = async () => {
            try {
                const response = await axiosAdmin.get(`/course/getByTeacher/${teacher_id}`);
                console.log(response.data.course);
                if (response.data) {
                    setCourseByTeacher(response.data.course);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
                //message.error('Error fetching course');
            }
        };

        getCourseByTeacher();
        getAllRubricIsDeleteFalse();
    }, [teacher_id]);

    const handleDownloadTemplateExcel = async () => {
        try {
            const data = { id: course_id };
            const response = await axiosAdmin.post('/course-enrollment/templates/data', { data: data }, {
                responseType: 'blob'
            });

            if (response && response.data) {
                const url = window.URL.createObjectURL(response.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'student.xlsx';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const handleFileChange = (e) => {
        setFileList([...e.target.files]);
    };

    const handleRemoveFile = (indexToRemove) => {
        setFileList((currentFiles) =>
            currentFiles.filter((_, index) => index !== indexToRemove)
        );
    };

    return (
        <Modal
            size="xl"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="outside"
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
                },
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="text-[#FF9908]">Tạo mới đánh giá</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col h-full pb-10">
                                {/* <Button onClick={() => { console.log(newRubric) }}> tesst</Button> */}
                                <form
                                    className="flex flex-col gap-3 h-full"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        // onSubmit(newRubric);
                                        onClose();
                                    }}
                                >
                                    <Select
                                        label="Chọn lớp môn học"
                                        name="course_id"
                                        value={newRubric.course_id || ''}
                                        onChange={handleCourseChange}
                                        fullWidth
                                    >
                                        {DataCourse.map((course) => (
                                            <SelectItem key={course.course_id} value={course.course_id}>
                                                {`${course.courseCode} - ${course.courseName}`}
                                            </SelectItem>
                                        ))}
                                    </Select>


                                    <Select
                                        label="Chọn bảng tiêu chí"
                                        name="rubric_id"
                                        value={newRubric.rubric_id || ''}
                                        onChange={handleRubricSelectChange}
                                        fullWidth
                                    >
                                        {RubicDataCompe.map((Rubric) => (
                                            <SelectItem key={Rubric.rubric_id} value={Rubric.rubric_id}>
                                                {Rubric.rubricName}
                                            </SelectItem>
                                        ))}
                                    </Select>


                                    <Textarea
                                        fullWidth
                                        label="mô tả chung"
                                        name="description"
                                        placeholder="nhận mô tả chung"
                                        value={newRubric.description || ''}
                                        onChange={handleChange}
                                        rows={4}
                                        minRows={4}
                                        maxRows={6}
                                    />

                                    <Input
                                        fullWidth
                                        label="Địa điểm"
                                        name="place"
                                        value={newRubric.place || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                        <DateInput
                                            label="Ngày đánh giá"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                    <Divider className="my-4" />
                                    <div>
                                        <h1 className="text-xl pb-2 font-bold text-[#6366F1]">Nhập thông tin sinh viên</h1>
                                    </div>
                                    <div className="flex flex-wrap gap-6 justify-center items-start">
                                        <div className="flex flex-col bg-white shadow-md rounded-lg p-4 justify-center items-center w-full md:w-auto">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Tải Mẫu CSV</h3>
                                            <Button
                                                className="bg-sky-500 text-white w-[125px] disabled:opacity-50"
                                                onClick={handleDownloadTemplateExcel}
                                                disabled={!newRubric.rubric_id}
                                            >
                                                Tải Sinh viên
                                            </Button>
                                        </div>

                                        <div className="flex flex-col bg-white shadow-md rounded-lg p-4 justify-center items-center w-full md:w-auto">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload File</h3>
                                            <label htmlFor="file-upload" className="cursor-pointer w-[125px]">
                                                <Button className="w-full bg-blue-500 text-white" auto flat as="span" color="primary">
                                                    Chọn file
                                                </Button>
                                            </label>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                style={{ display: "none" }}
                                                onChange={handleFileChange}
                                                multiple
                                            />
                                            {fileList.length > 0 && (
                                                <div className="mt-2 w-full">
                                                    <ul className="space-y-2">
                                                        {fileList.map((file, index) => (
                                                            <li
                                                                key={index}
                                                                className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                                                            >
                                                                <p className="text-gray-700">{file.name}</p>
                                                                <Button
                                                                    auto
                                                                    flat
                                                                    color="error"
                                                                    size="xs"
                                                                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                                                                    onClick={() => handleRemoveFile(index)}
                                                                >
                                                                    X
                                                                </Button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col bg-white shadow-md rounded-lg p-4 justify-center items-center w-full md:w-auto">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Lưu file</h3>
                                            {newRubric.course_id && newRubric.rubric_id && newRubric.description && newRubric.courseName && newRubric.place && newRubric.date ? (
                                                <CustomUpload
                                                    endpoint={'/meta-assessment'}
                                                    method="POST"
                                                    fileList={fileList}
                                                    setFileList={setFileList}
                                                    Data={newRubric}
                                                    LoadData={load}
                                                />
                                            ) : (
                                                <Tooltip content="Fill all fields to enable upload" placement="top">
                                                    <Button className="bg-gray-500 text-white w-[125px]" disabled>
                                                        Start Upload
                                                    </Button>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ModalCreateAssessment;
