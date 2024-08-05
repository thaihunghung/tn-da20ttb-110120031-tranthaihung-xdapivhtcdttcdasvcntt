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

const ModalUpdateAssessment = ({
    isOpen,
    onOpenChange,
    onSubmit,
    editRubric,
    setEditRubric,
    DataCourse,
    filterRubicData
}) => {
    const [selectedDate, setSelectedDate] = useState(new CalendarDate(2001, 1, 1));
    const navigate = useNavigate();
    const teacher_id = Cookies.get('teacher_id');

    useEffect(() => {
        if (!teacher_id) {
            navigate('/login');
        }
    }, [teacher_id, navigate]);

    useEffect(() => {
        if (editRubric.date) {
            const dateParts = editRubric.date.split('-');
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10);
            const day = parseInt(dateParts[2], 10);
            setSelectedDate(new CalendarDate(year, month, day));
        }
    }, [editRubric]);

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

    const handleDateChange = (newDate) => {
        const formattedDate = `${newDate.year}-${newDate.month}-${newDate.day}`;
        setEditRubric((prev) => ({
            ...prev,
            date: formattedDate,
        }));
        setSelectedDate(newDate);
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
                        <ModalHeader className="text-[#FF9908]">Update Assessment</ModalHeader>
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
                                        {filterRubicData.map((Rubric) => (
                                            <SelectItem key={Rubric.rubric_id} value={Rubric.rubric_id}>
                                                {Rubric.rubricName}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Textarea
                                        fullWidth
                                        label="generalDescription"
                                        name="generalDescription"
                                        placeholder="Enter your description"
                                        value={editRubric.generalDescription || ''}
                                        onChange={handleChange}
                                        rows={4}
                                        minRows={4}
                                        maxRows={6}
                                    />

                                    <Input
                                        fullWidth
                                        label="place"
                                        name="place"
                                        value={editRubric.place || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                        <DateInput
                                            label="Date"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                        />
                                    </div>
                                    <Divider className="mt-4" />
                                </form>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onClick={onClose}>
                                Cancel
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
                                Update
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ModalUpdateAssessment;
