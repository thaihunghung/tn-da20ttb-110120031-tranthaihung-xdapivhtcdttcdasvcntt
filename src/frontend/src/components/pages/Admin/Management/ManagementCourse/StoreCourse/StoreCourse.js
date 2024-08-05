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
import { columns, fetchCoursesData } from "./Data";
import { axiosAdmin } from "../../../../../../service/AxiosAdmin";
import { capitalize } from "../../../Utils/capitalize";

const INITIAL_VISIBLE_COLUMNS = ["courseCode", "courseName", "teacherName", "actions"];

const StoreCourse = (props) => {
  const navigate = useNavigate();
  const { setCollapsedNav, successNoti } = props;
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "course_name",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [courseData, setCourseData] = useState([]);
  const [courseClick, setCourseClick] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

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

  const handleEditCourse = (item) => {
    if (item && item.course_id) {
      setCourseClick(item);
      setSelectedCourseId(item.course_id);
      setIsEditModalOpen(true);
    } else {
      console.error("Invalid course data", item);
    }
  };

  const getAllCourse = async (page, rowsPerPage) => {
    const { courses, total } = await fetchCoursesData(page, rowsPerPage);
    setCourseData(courses);
    setTotalCourses(total);
  };

  useEffect(() => {
    getAllCourse(page, rowsPerPage);
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
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredCourses = [...courseData];

    if (hasSearchFilter) {
      filteredCourses = filteredCourses.filter((item) =>
        item.course_name.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.course_id.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.teacher.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredCourses;
  }, [courseData, filterValue]);

  const pages = Math.ceil(totalCourses / rowsPerPage);

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
      case "course_id":
        return cellValue;
      case "course_name":
        return cellValue;
      case "teacherName":
        return (
          <>
            {item.teacher.name}
          </>
        );
      case "classCode":
        return (
          <>
            {item.class.classCode}
          </>
        );
        case "className":
          return (
            <>
              {item.class.className}
            </>
          );
      case "actions":
        return (
          <div className="flex justify-center items-center gap-2">
            <Tooltip content="Restore this course">
              <Button isIconOnly auto onClick={() => handleChangeIdDelete(item.course_id)}>
                <RedoOutlined />
              </Button>
            </Tooltip>
            <Tooltip content="Download student list">
              <Button
                isIconOnly
                auto
                color="primary"
                onClick={() => {
                  handleDownloadTemplateExcel(item.course_id);
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
        const response = await axiosAdmin.put(`/course/isDelete/${deleteId}`);
        if (response) {
          getAllCourse(page, rowsPerPage);
          successNoti("Moved to trash successfully");
          setDeleteId(null);
        } else {
          console.error("Failed to delete course");
        }
      }
    } catch (error) {
      console.error('Error deleting course:', error);
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
            placeholder="Search by course name, course code, or teacher name..."
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
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="secondary" onClick={() => navigate('/admin/course')}>
              Manage Course
            </Button>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#6366F1]">Danh sách khóa học bị ẩn</h1>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {totalCourses} courses</span>
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
    totalCourses,
    onSearchChange,
    hasSearchFilter,
    visibleColumns
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
            <Tooltip showArrow={true} content={`Move ${selectedCount} to trash`}>
              <Button className="text-[#FEFEFE]" variant="light" color="danger" onClick={() => handleDeleteClick()}>
                Hide Course
              </Button>
            </Tooltip>
            <Tooltip showArrow={true} content="Clear selection">
              <Button className="text-[#FEFEFE]" variant="light" onClick={handleClearSelection}>
                X
              </Button>
            </Tooltip>
          </div>
        </div>
      )
    );
  }, [selectedKeys, handleDeleteClick, handleClearSelection, totalCourses]);

  const handleChangeIdDelete = async (id) => {
    try {
      const response = await axiosAdmin.put(`/course/isDelete/${id}`);
      if (response) {
        getAllCourse(page, rowsPerPage);
        console.log(response.data.message);
        successNoti("Course restored successfully");
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

        <TableBody emptyContent={"No courses found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.course_id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default StoreCourse;
