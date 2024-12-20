import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Tooltip,
  Pagination,
  DropdownItem,
  DropdownMenu,
  Dropdown,
  DropdownTrigger,
} from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { SearchOutlined, DeleteFilled, EditFilled, RedoOutlined } from '@ant-design/icons';
import { studentColumns, fetchStudentsData } from "./Data";
import { axiosAdmin } from "../../../../../../service/AxiosAdmin";

const INITIAL_VISIBLE_COLUMNS = ["studentCode", "email", "name", "classNameShort", "actions"];

const StoreStudent = (props) => {
  const navigate = useNavigate();
  const { setCollapsedNav, successNoti } = props;
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [studentData, setStudentData] = useState([]);
  const [studentClick, setStudentClick] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const hasSearchFilter = Boolean(filterValue);

  const handleDownloadTemplateExcel = async (id) => {
    try {
      const response = await axiosAdmin.get(`/student/course/${id}`, {
        responseType: 'blob'
      });

      if (response && response.data) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Students.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleEditStudent = (item) => {
    if (item && item.student_id) {
      setStudentClick(item);
      setSelectedStudentId(item.student_id);
      setIsEditModalOpen(true);
    } else {
      console.error("Invalid student data", item);
    }
  };

  const getAllStudents = async (page, rowsPerPage) => {
    const { students, total } = await fetchStudentsData(page, rowsPerPage);
    setStudentData(students);
    setTotalStudents(total);
  };

  useEffect(() => {
    getAllStudents(page, rowsPerPage);
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsedNav(true);
      } else {
        setCollapsedNav(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [page, rowsPerPage]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return studentColumns;

    return studentColumns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredStudents = [...studentData];

    if (hasSearchFilter) {
      filteredStudents = filteredStudents.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.studentCode.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.email.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredStudents;
  }, [studentData, filterValue]);

  const pages = Math.ceil(totalStudents / rowsPerPage);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "studentCode":
        return cellValue;
      case "email":
        return cellValue;
      case "name":
        return cellValue;
      case "classNameShort":
        return cellValue;
      case "className":
        return cellValue;
      case "actions":
        return (
          <div className="flex justify-center items-center gap-2">
            <Tooltip content="Khôi phục sinh viên này">
              <Button isIconOnly auto onClick={() => handleChangeIdDelete(item.student_id)}>
                <RedoOutlined />
              </Button>
            </Tooltip>
            <Tooltip content="Tải danh sách sinh viên">
              <Button
                isIconOnly
                auto
                color="primary"
                onClick={() => {
                  handleDownloadTemplateExcel(item.student_id);
                }}
              >
                <i className="fa-solid fa-download"></i>
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

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

  const handleDeleteClick = async () => {
    try {
      if (deleteId) {
        const response = await axiosAdmin.put(`/student/isDelete/${deleteId}`);
        if (response) {
          getAllStudents(page, rowsPerPage);
          successNoti("Chuyển vào thùng rác thành công");
          setDeleteId(null);
        } else {
          console.error("Failed to delete student");
        }
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleClearSelection = () => {
    setSelectedKeys(new Set([]));
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by student name, student code, or email..."
            startContent={<SearchOutlined />}
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
                {studentColumns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="secondary" onClick={() => navigate('/admin/student')}>
              Manage Student
            </Button>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#6366F1]">Danh sách sinh viên bị ẩn</h1>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {totalStudents} students</span>
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
    onRowsPerPageChange,
    totalStudents,
    onSearchChange,
    hasSearchFilter,
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
  }, [selectedKeys, filteredItems.length, page, pages, hasSearchFilter]);

  const selectedItemsBar = useMemo(() => {
    const allSelected = selectedKeys === "all";
    const selectedCount = allSelected ? rowsPerPage : selectedKeys.size;

    return (
      selectedCount > 0 && (
        <div className="flex justify-between items-center text-[#FEFEFE] bg-[#FF8077] py-2 px-4 rounded-lg mb-4">
          <div>{selectedCount} selected</div>
          <div className="flex gap-3 ">
            <Tooltip showArrow={true} content={`Chuyển ${selectedCount} vào thùng rác`}>
              <Button className="text-[#FEFEFE]" variant="light" color="danger" onClick={() => handleDeleteClick()}>
                Ẩn sinh viên
              </Button>
            </Tooltip>
            <Tooltip showArrow={true} content="Bỏ chọn">
              <Button className="text-[#FEFEFE]" variant="light" onClick={handleClearSelection}>
                X
              </Button>
            </Tooltip>
          </div>
        </div>
      )
    );
  }, [selectedKeys, handleDeleteClick, handleClearSelection, totalStudents]);

  const handleChangeIdDelete = async (id) => {
    try {
      const response = await axiosAdmin.put(`/student/isDelete/${id}`);
      if (response) {
        getAllStudents(page, rowsPerPage);
        console.log(response.data.message);
        successNoti("Khôi phục sinh viên thành công");
      }
    } catch (err) {
      console.log("Error: " + err.message);
    };
  }

  return (
    <>
      {selectedItemsBar}
      <Table
        className="text-left"
        aria-label="Example table with custom cells, pagination and sorting"
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

        <TableBody emptyContent={"No students found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.student_id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default StoreStudent;
