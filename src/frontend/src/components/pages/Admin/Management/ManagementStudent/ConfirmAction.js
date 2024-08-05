import React from "react";
import { Modal, Button, useDisclosure, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

const ConfirmAction = ({ isOpen, onOpenChange, onConfirm, message }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>Confirm Action</ModalHeader>
        <ModalBody>
          <p>{message}</p>
        </ModalBody>
        <ModalFooter>
          <Button auto flat onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button auto color="error" onClick={onConfirm}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmAction;
