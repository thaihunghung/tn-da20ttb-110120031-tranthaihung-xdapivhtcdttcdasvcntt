import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Pagination,
  Chip,
  User,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../../service/AxiosAdmin";
import { columns, fetchBlockedTeachersData, permissions } from "./Data";
import { capitalize } from "../../../Utils/capitalize";
import { useNavigate } from "react-router-dom";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const INITIAL_VISIBLE_COLUMNS = ["name", "teacherCode", "permissionName", "actions"];

export default function BlockedTeachersPage(props) {
  const { setCollapsedNav, successNoti, errorNoti } = props;
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [blockedTeachers, setBlockedTeachers] = useState([]);
  const [totalBlockedTeachers, setTotalBlockedTeachers] = useState(0);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const hasSearchFilter = Boolean(filterValue);

  useEffect(() => {
    const loadBlockedTeachers = async () => {
      const { teachers, total } = await fetchBlockedTeachersData(page, rowsPerPage);
      setBlockedTeachers(teachers);
      setTotalBlockedTeachers(total);
    };

    loadBlockedTeachers();
  }, [page, rowsPerPage]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredTeachers = [...blockedTeachers];

    if (hasSearchFilter) {
      filteredTeachers = filteredTeachers.filter((teacher) =>
        teacher.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        teacher.teacherCode.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredTeachers;
  }, [blockedTeachers, filterValue]);

  const pages = Math.ceil(totalBlockedTeachers / rowsPerPage);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const renderCell = useCallback((teacher, columnKey) => {
    const cellValue = teacher[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: teacher.imgURL }}
            description={teacher.email}
            name={cellValue}
          >
            {teacher.email}
          </User>
        );
      case "permissionName":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{teacher.typeTeacher}</p>
          </div>
        );
      case "permission":
        return (
          <Chip className="capitalize" color={statusColorMap[teacher.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem onClick={() => handleUnBlockClick(teacher.teacher_id)}>Unblock</DropdownItem>
                <DropdownItem onClick={() => handleDeleteClick(teacher.teacher_id)}>Delete</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const handleDeleteClick = async (teacherId) => {
    try {
      const response = await axiosAdmin.patch('/teachers/delete', { data: [{ id: teacherId }] });
      if (response.status === 200) {
        const { teachers, total } = await fetchBlockedTeachersData(page, rowsPerPage);
        setBlockedTeachers(teachers);
        setTotalBlockedTeachers(total);
        setSelectedKeys(new Set([]));
        successNoti("Xóa thành công");
      } else {
        console.error("Failed to delete teacher");
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleUnBlockClick = async (teacherId) => {
    try {
      const response = await axiosAdmin.patch('/teachers/unblock', { data: [{ id: teacherId }] });
      if (response.status === 200) {
        const { teachers, total } = await fetchBlockedTeachersData(page, rowsPerPage);
        setBlockedTeachers(teachers);
        setTotalBlockedTeachers(total);
        setSelectedKeys(new Set([]));
        successNoti("Mở khóa thành công");
      } else {
        console.error("Failed to unblock teacher");
      }
    } catch (error) {
      console.error('Error unblocking teacher:', error);
    }
  };

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name, teacher code ..."
            startContent={<i className="fa-solid fa-magnifying-glass"></i>}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<i className="fa-solid fa-chevron-down"></i>} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="secondary" onClick={() => navigate('/admin/teacher')}>
              Manage Teacher
            </Button>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#6366F1]">Danh sách giáo viên bị chặn</h1>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {totalBlockedTeachers} blocked teachers</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onRowsPerPageChange,
    totalBlockedTeachers,
    onSearchChange,
    onClear,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button isDisabled={page <= 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={page >= pages} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, filteredItems.length, page, pages]);

  const selectedItemsBar = useMemo(() => {
    return (
      selectedKeys.size > 0 && (
        <div className="flex justify-between items-center text-[#FEFEFE]  bg-[#6366F1]/75 py-2 px-4 rounded-lg mb-4">
          <div>{selectedKeys.size} selected</div>
          <div className="flex gap-3 ">
            <Tooltip showArrow={true} content={`Unblock ${selectedKeys.size} teachers`}>
              <Button className="text-[#FEFEFE]" variant="light" onClick={handleUnBlockClick}>
                Unblock
              </Button>
            </Tooltip>
            {/* <Tooltip showArrow={true} content={`Chuyển ${selectedKeys.size} vào thùng rác`}>
              <Button className="text-[#FEFEFE]" variant="light" color="danger" onClick={() => handleDeleteClick()}>
                Delete
              </Button>
            </Tooltip> */}
            <Tooltip showArrow={true} content="Clear selection">
              <Button className="text-[#FEFEFE] text-2xl" variant="light" onClick={() => setSelectedKeys(new Set([]))}>
                X
              </Button>
            </Tooltip>
          </div>
        </div>
      )
    );
  }, [selectedKeys, handleUnBlockClick]);

  return (
    <>
      {selectedItemsBar}
      <Table
        className="text-left"
        aria-label="Blocked teachers table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody emptyContent={"No blocked teachers found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.teacher_id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ConfirmAction
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={confirmAction}
        message={confirmMessage}
      />
    </>
  );
}

function ConfirmAction({ isOpen, onOpenChange, onConfirm, message }) {
  const handleOnOKClick = (onClose) => {
    onClose();
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
        {(onClose) => (
          <>
            <ModalHeader>Warning</ModalHeader>
            <ModalBody>
              <p className="text-[16px]">
                {message}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onClick={onClose}>
                Cancel
              </Button>
              <Button color="danger" className="font-medium" onClick={() => handleOnOKClick(onClose)}>
                Ok
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
