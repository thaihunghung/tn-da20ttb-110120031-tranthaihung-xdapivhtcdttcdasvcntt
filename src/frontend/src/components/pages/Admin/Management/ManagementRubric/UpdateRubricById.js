// UpdateRubricById.js

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"; 
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Switch } from "@nextui-org/react";
import { Select} from "antd"; 
import DropdownAndNavPo from "../../Utils/DropdownAndNav/DropdownAndNavPo";
import Cookies from "js-cookie";

const UpdateRubricById = (nav) => {

    const { id } = useParams();
    const navigate = useNavigate();
    const teacher_id = Cookies.get('teacher_id');
    if (!teacher_id) {
      navigate('/login');
    }

    const { setCollapsedNav } = nav;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [rubric_id, setRubric_id] = useState();
    const [subject_id, setSubject_id] = useState();
    const [rubricName, setRubricName] = useState("");
    const [comment, setComment] = useState();

    const [subjectData, setSubject] = useState([]);

    const [isDelete, setisDelete] = useState(false);

    const [scrollBehavior, setScrollBehavior] = useState("inside");

    const handleSubjectSelectChange = (value, option) => {

        setSubject_id(value);
      };


    const getBrubricByID = async () => {
        try {
            const response = await axiosAdmin.get(`/rubric/${id}`);
            if (response.data) {
                setRubric_id(response.data.rubric_id)
                setRubricName(response.data.rubricName)
                setComment(response.data.comment)
                setSubject_id(response.data.subject_id)
            }
            console.log(response.data);
        } catch (error) {
            console.error("lỗi", error);
        }
    }

    const getAllSubject = async () => {
        try {
            const response = await axiosAdmin.get(`/subjects/isDelete/false`);
            if (response.data) {
                setSubject(response.data);
            }
            console.log(response);
        } catch (error) {
            console.error("lỗi", error);
        }
    }

    const UpdatePos = async () => {
        try {
            const data = {
                rubric_id: rubric_id,
                subject_id : subject_id,
                comment: comment,
                rubricName: rubricName,
            }
            console.log(data);
            await axiosAdmin.put(`/rubric/${id}`, { data: data });
            onClose(navigate("/admin/management-rubric/list"))
        } catch (error) {
            console.error("lỗi", error);
        }
    }
    useEffect(() => {
        onOpen()
        getBrubricByID()
        getAllSubject()
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setCollapsedNav(true);
            } else {
                setCollapsedNav(false);
            }
            //console.log(window.innerWidth);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="flex w-full flex-col justify-center items-start leading-8 p-2 bg-[#f5f5f5]-500">
            <Modal isOpen={isOpen} scrollBehavior={scrollBehavior}>
                <ModalContent className="m-auto">
                    <ModalHeader className="flex flex-col gap-1">Cập nhật</ModalHeader>
                    <ModalBody>   
                        <Select
                            defaultValue={"Chọn subject"}
                            value={subject_id}
                            onChange={handleSubjectSelectChange}
                            size="large"
                            className="w-full"
                        >
                            {subjectData.map((subject) => (
                                <Select.Option
                                    key={subject.subject_id}
                                    value={subject.subject_id}
                                >
                                    {subject.subjectName}
                                </Select.Option>
                            ))}
                        </Select>        
                        <Input
                            label="Tên rubric"
                            placeholder="Enter your rubric"
                            value={rubricName}
                            onValueChange={setRubricName}
                            className="max-w-xs"
                        />
                        <Input
                            label="comment"
                            placeholder="Enter your comment"
                            value={comment}
                            onValueChange={setComment}
                            className="max-w-xs"
                        />   
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            radius="sm"
                            as={Link}
                            to="/admin/management-rubric/list/"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        <Button onClick={UpdatePos} color="primary" radius="sm">
                            <span className="font-medium">Cập nhật</span>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            
            <DropdownAndNavPo />
        </div>
    );
}

export default UpdateRubricById;
