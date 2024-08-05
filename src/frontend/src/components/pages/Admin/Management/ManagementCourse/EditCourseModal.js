import React from 'react';
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Tooltip,
  Avatar,
  ModalContent,
} from "@nextui-org/react";

const EditCourseModal = ({
  isEditModalOpen,
  handleCloseEditModal,
  handleEditSubmit,
  form,
  setForm,
  subjects,
  classes,
  academicYears,
  semesters,
  teachers,
  showYearInputs,
  toggleYearInputs,
  isInvalid,
  handleYearXChange,
  handleSaveAcademicYear,
  setIsEditModalOpen
}) => {
  return (
    <Modal
      backdrop="opaque"
      isOpen={isEditModalOpen}
      onOpenChange={(isOpen) => setIsEditModalOpen(isOpen)}
      radius="lg"
      classNames={{
        body: "py-6",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "border-[#292f46] bg-[#fefefe] dark:bg-[#19172c] text-[#292f46]",
        header: "border-b-[1px] border-[#292f46]",
        footer: "border-t-[1px] border-[#292f46]",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Edit Course</ModalHeader>
            <ModalBody>
              <Input
                clearable
                bordered
                fullWidth
                label="Course Name"
                name="courseName"
                value={form.courseName}
                onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                css={{ mb: 20 }}
              />
              <Select
                labelPlacement="outside"
                variant="underlined"
                label="Học phần"
                placeholder="Lựa chọn học phần"
                defaultSelectedKeys={[form.subject_id]}
                value={form.class_id}
                onChange={(e) => setForm({ ...form, subject_id: parseInt(e.target.value) })}
                css={{ mb: 20 }}
              >
                {subjects.map((item) => (
                  <SelectItem key={item.subject_id} value={item.subject_id}>
                    {item.subjectName}
                  </SelectItem>
                ))}
              </Select>

              <div className="flex items-center mb-4 justify-end">
                {showYearInputs == false && (
                  <Select
                    variant="underlined"
                    labelPlacement="outside"
                    label="Năm học"
                    placeholder="Chọn năm học"
                    defaultSelectedKeys={[form.academic_year_id]}
                    value={form.academic_year_id}
                    onChange={(e) => setForm({ ...form, academic_year_id: parseInt(e.target.value) })}
                    css={{ mb: 20 }}
                  >
                    {academicYears.map((item) => (
                      <SelectItem key={item.academic_year_id} value={item.academic_year_id}>
                        {item.description}
                      </SelectItem>
                    ))}
                  </Select>
                )}

                <Tooltip showArrow={true} content="Click để tạo năm học mới">
                  <Button
                    isIconOnly
                    onClick={toggleYearInputs}
                    className="ml-2">
                    <i className="fa-solid fa-plus"></i>
                  </Button>
                </Tooltip>
              </div>
              {showYearInputs && (
                <div>
                  <div className="absolute -mt-14 text-small font-semibold">
                    Nhập năm bắt đầu, năm kết thúc tự động tăng 1
                  </div>
                  <div className="flex justify-between items-center gap-2 mt-0 justify-items-center">
                    <p>Năm học</p>
                    <div className="flex items-center gap-4 w-[80%] justify-items-center text-center text-sm">
                      <Input
                        className="text-center"
                        isInvalid={isInvalid}
                        type="number"
                        label="Năm bắt đầu"
                        value={form.yearX}
                        onChange={handleYearXChange}
                        variant="bordered"
                      />
                      <p> - </p>
                      <Input
                        isInvalid={isInvalid}
                        type="number"
                        label="Năm kết thúc"
                        readOnly
                        value={form.yearY}
                        onChange={(e) => setForm({ ...form, yearY: e.target.value })}
                        variant="bordered"
                      />
                      <Button onClick={() => handleSaveAcademicYear()}>
                        Chọn
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <Select
                variant="underlined"
                labelPlacement="outside"
                label="Học ký"
                placeholder="Chọn học kỳ"
                defaultSelectedKeys={[form.semester_id]}
                value={form.semester_id}
                onChange={(e) => setForm({ ...form, semester_id: parseInt(e.target.value) })}
                css={{ mb: 20 }}
              >
                {semesters.map((item) => (
                  <SelectItem key={item.semester_id} value={item.semester_id}>
                    {item.descriptionLong}
                  </SelectItem>
                ))}
              </Select>
              <Select
                labelPlacement="outside"
                label="Lớp học"
                placeholder="Chọn lớp học"
                defaultSelectedKeys={[form.class_id]}
                value={form.class_id}
                onChange={(e) => setForm({ ...form, class_id: parseInt(e.target.value) })}
                css={{ mb: 20 }}
              >
                {classes.map((item) => (
                  <SelectItem key={item.class_id} value={item.class_id}>
                    {item.className}
                  </SelectItem>
                ))}
              </Select>

              <Select
                items={teachers}
                onChange={(e) => setForm({ ...form, teacher_id: parseInt(e.target.value) })}
                value={form.teacher_id}
                defaultSelectedKeys={[form.teacher_id]}
                label="Assigned to"
                placeholder="Select a user"
                labelPlacement="outside"
                classNames={{
                  base: "max-w-xs",
                  trigger: "h-12",
                }}
                renderValue={(items) => {
                  return items.map((item) => (
                    <div key={item.data.key} className="flex items-center gap-2">
                      <Avatar
                        alt={item.data.name}
                        className="flex-shrink-0"
                        size="sm"
                        src={item.data.imgURL}
                      />
                      <div className="flex flex-col">
                        <span>{item.data.name}</span>
                        <span className="text-default-500 text-tiny">({item.data.email})</span>
                      </div>
                    </div>
                  ));
                }}
              >
                {(teacher) => (
                  <SelectItem key={teacher.teacher_id} textValue={teacher.name}>
                    <div className="flex gap-2 items-center">
                      <Avatar alt={teacher.name} className="flex-shrink-0" size="sm" src={teacher.imgURL} />
                      <div className="flex flex-col">
                        <span className="text-small">{teacher.name}</span>
                        <span className="text-tiny text-default-400">{teacher.email}</span>
                      </div>
                    </div>
                  </SelectItem>
                )}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="foreground" variant="light" onPress={handleCloseEditModal}>
                Close
              </Button>
              <Button className="bg-[#6f4ef2] shadow-lg text-white shadow-indigo-500/20" onPress={handleEditSubmit}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditCourseModal;
