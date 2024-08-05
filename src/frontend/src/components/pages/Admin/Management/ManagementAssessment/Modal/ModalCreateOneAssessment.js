import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Tooltip,
    Input,
    Select,
    SelectItem,
    Button,
    Textarea,
    DateInput,
    Divider,
    ModalFooter,
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../../service/AxiosAdmin";
import { CalendarDate } from "@internationalized/date";

const ModalCreateOneAssessment = ({
    isOpen,
    onOpenChange,
    onSubmit,
    editRubric,
    setEditRubric,
    DataCourse,
    RubicData,
    StudentData
}) => {
    const navigate = useNavigate();
    const teacher_id = Cookies.get('teacher_id');

    const [RubricArray, setRubricArray] = useState([]);
    const [CourseArray, setCourseArray] = useState([]);

    useEffect(() => {
        if (!teacher_id) {
            navigate('/login');
        }
    }, [teacher_id, navigate]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditRubric((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCourseChange = (e) => {
        const Value = e.target.value;
        setEditRubric((prev) => ({
            ...prev,
            course_id: Value,
        }));
    };

    const handleRubricSelectChange = (e) => {
        const Value = e.target.value;
        setEditRubric((prev) => ({
            ...prev,
            rubric_id: Value,
        }));
    };
    const handleStudentSelectChange = (e) => {
        const Value =new Set(e.target.value.split(","))
        const valuesArray = Array.from(Value)
        setEditRubric((prev) => ({
            ...prev,
            student_id: valuesArray,
        }));
    };


    useEffect(() => {
        // Assuming DataCourse and RubicData contain arrays of course and rubric objects
        setCourseArray(DataCourse);
        setRubricArray(RubicData);

        console.log("RubricArray", RubricArray);
        console.log("CourseArray", CourseArray);
    }, [DataCourse, RubicData]);

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
                        <ModalHeader className="text-[#FF9908]">Tạo mới lần chấm cho sinh viên</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col h-full">
                                <form
                                    className="flex flex-col gap-3 h-full"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        onSubmit(editRubric);
                                        onClose();
                                    }}
                                >
                                    <Select
                                        label="course"
                                        name="course_id"
                                        defaultSelectedKeys={[editRubric.course_id]}
                                        value={editRubric.course_id || ''}
                                        onChange={handleCourseChange}
                                        fullWidth
                                        isDisabled
                                    >
                                        {DataCourse.map((course) => (
                                            <SelectItem key={course.course_id} value={course.course_id}>
                                                {`${course.courseCode} - ${course.courseName}`}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <Select
                                        label="Rubric"
                                        name="rubric_id"
                                        defaultSelectedKeys={[editRubric.rubric_id]}
                                        value={editRubric.rubric_id || ''}
                                        onChange={handleRubricSelectChange}
                                        fullWidth
                                        isDisabled
                                    >
                                        {RubicData.map((Rubric) => (
                                            <SelectItem key={Rubric.rubric_id} value={Rubric.rubric_id}>
                                                {Rubric.rubricName}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Textarea
                                        fullWidth
                                        label="description"
                                        name="description"
                                        placeholder="Enter your description"
                                        value={editRubric.generalDescription || ''}
                                        onChange={handleChange}
                                        rows={4}
                                        minRows={4}
                                        maxRows={6}
                                        isDisabled
                                    />
                                     <Select
                                        label="Student"
                                        name="student_id"
                                        value={editRubric.student_id || []}
                                        onChange={handleStudentSelectChange}
                                        fullWidth
                                        selectionMode="multiple"
                                    >
                                        {StudentData.map((student) => (
                                            <SelectItem key={student.student_id} value={student.student_id}>
                                                {student.name}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <Divider className="mt-4" />
                                </form>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onClick={onClose}>
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onSubmit(editRubric);
                                    onClose();
                                }}
                            >
                                Tạo mới
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ModalCreateOneAssessment;
