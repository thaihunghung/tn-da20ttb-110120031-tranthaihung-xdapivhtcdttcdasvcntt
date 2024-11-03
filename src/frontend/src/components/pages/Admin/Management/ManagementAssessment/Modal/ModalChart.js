import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem, Button, Textarea, } from "@nextui-org/react";
import { message } from 'antd';
import { axiosAdmin } from '../../../../../../service/AxiosAdmin';
import { UseNavigate, UseTeacherAuth, UseTeacherId } from '../../../../../../hooks';
import { fetchAssessmentsByidTeacher } from '../Data/DataAssessmentGrading';
import { Table } from '@nextui-org/react';
import { handleReplaceCharacters } from '../../../Utils/Utils';
import Chart from '../Chart';

function ModalChart({ isOpen, onOpenChange, score }) {
  UseTeacherAuth();

  return (
    <Modal
  size="5xl"
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
            <ModalHeader className="text-[#FF9908]"></ModalHeader>
            <ModalBody>
              <div className="w-full flex justify-center items-center">
          

             
             <Chart score={score}/>
    
              </div>

            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                onClick={() => {
                  onClose();
                }}
              >
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalChart;
