
import React from 'react';
import { Modal, Button, ModalContent, ModalHeader, ModalBody, ModalFooter} from '@nextui-org/react';

export function ModalConfirmAction(props) {
  const { isOpen, onOpenChange, onConfirm, text } = props;
  const handleOnOKClick = (onpose) => {
    onpose();
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
  }
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
        {(onpose) => (
          <>
            <ModalHeader>Cảnh báo</ModalHeader>
            <ModalBody>
              <p className="text-[16px]">
                {text}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onpose}>
                Huỷ
              </Button>
              <Button color="danger" className="font-medium" onClick={() => handleOnOKClick(onpose)}>
                Xoá
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}