import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";

const ConfirmAction = ({
  isConfirmActionOpen,
  selectedCourse,
  setIsConfirmActionOpen,
  successNoti
}) => {
  const handleOnOKClick = async (onClose) => {
    console.log("selectedCourse", selectedCourse);
    try {
      if (selectedCourse) {
        const response = await axiosAdmin.put(
          `/course/isDelete/${selectedCourse.course_id}`
        );
        if (response.status === 200) {
          successNoti('Ẩn thành công')
          onClose();
        } else {
          console.error("Failed to delete class");
        }
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  return (
    <Modal
      isOpen={isConfirmActionOpen}
      onOpenChange={setIsConfirmActionOpen}
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
            <ModalHeader>Cảnh báo</ModalHeader>
            <ModalBody>
              <p className="text-[16px]">
                Bạn có chắc ẩn môn học này chứ
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                className="font-medium"
                onClick={() => {
                  handleOnOKClick(onClose);
                }}
              >
                Ok
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmAction;
