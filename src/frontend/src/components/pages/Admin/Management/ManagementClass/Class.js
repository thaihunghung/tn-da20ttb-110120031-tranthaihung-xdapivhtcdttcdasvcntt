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
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import { SearchOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import { columns, fetchClassesData } from "./Data";
import ConfirmAction from "./ConfirmAction";
import AddClassModal from "./AddClassModal";
import { capitalize } from "../../Utils/capitalize";
import EditClassModal from "./EditClassModal";

const INITIAL_VISIBLE_COLUMNS = ["classCode", "className", "nameTeacher", "actions"];

const Class = (props) => {
  const navigate = useNavigate();
  const { setCollapsedNav, successNoti } = props;
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "className",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [classData, setClassData] = useState([]);
  const [classClick, setClassClick] = useState([]);
  const [totalClasses, setTotalClasses] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const hasSearchFilter = Boolean(filterValue);

  const handleDownloadTemplateExcel = async (id) => {
    try {
      const response = await axiosAdmin.get(`/student-course/${id}`, {
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

  const handleEditClass = (item) => {
    if (item && item.class_id) {
      setClassClick(item);
      setSelectedClassId(item.class_id);
      setIsEditModalOpen(true);
    } else {
      console.error("Invalid class data", item);
    }
  };

  const getAllClass = async (page, rowsPerPage, searchTerm = "") => {
    const { classes, total } = await fetchClassesData(page, rowsPerPage, searchTerm);
    setClassData(classes);
    setTotalClasses(total);
  };

  useEffect(() => {
    getAllClass(page, rowsPerPage, filterValue);
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
  }, [page, rowsPerPage, filterValue]);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const pages = Math.ceil(totalClasses / rowsPerPage);

  const sortedItems = useMemo(() => {
    return [...classData].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, classData]);

  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "classCode":
        return cellValue;
      case "className":
        return cellValue;
      case "nameTeacher":
        return (
          <>
            {item.teacher.name}
          </>
        );
      case "actions":
        return (
          <div className="flex justify-center items-center gap-2">
            <Tooltip content="Cập nhật thông tin lớp học">
              <Button isIconOnly auto onClick={() => handleEditClass(item)}>
                <EditFilled />
              </Button>
            </Tooltip>
            <Tooltip content="Tải danh sách sinh viên">
              <Button
                isIconOnly
                auto
                color="primary"
                onClick={() => {
                  handleDownloadTemplateExcel(item.class_id);
                }}
              >
                <i className="fa-solid fa-download"></i>
              </Button>
            </Tooltip>
            <Tooltip content="Chuyển vào thùng rác">
              <Button
                isIconOnly
                auto
                color="warning"
                onClick={() => {
                  setIsConfirmOpen(true);
                  setConfirmMessage('Bạn có chắc muốn ẩn đi lớp này chứ');
                  setDeleteId(item.class_id);
                }}
              >
                <DeleteFilled />
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
    setFilterValue(value);
    setPage(1);
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const handleDeleteClick = async () => {
    try {
      if (deleteId) {
        const response = await axiosAdmin.put(`/class/isDelete/${deleteId}`);
        if (response) {
          getAllClass(page, rowsPerPage, filterValue);
          successNoti("Chuyển vào thùng rác thành công");
          setDeleteId(null);
        } else {
          console.error("Failed to delete class");
        }
      }
    } catch (error) {
      console.error('Error deleting class:', error);
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
            placeholder="Search by class name, class code, or teacher name..."
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
            <Button color="primary" endContent={<i className="fa-solid fa-plus"></i>}
              onClick={() => setIsAddClassOpen(true)}
            >
              Create new
            </Button>

            <Button color="secondary" onClick={() => navigate('/admin/class/store')}>
              Manage Blocked
            </Button>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#6366F1]">Danh sách các lớp</h1>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {totalClasses} classes</span>
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
    totalClasses,
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
            : `${selectedKeys.size} of ${classData.length} selected`}
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
  }, [selectedKeys, classData.length, page, pages]);

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
                Ẩn lớp
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
  }, [selectedKeys, handleDeleteClick, handleClearSelection, totalClasses]);

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

        <TableBody emptyContent={"No classes found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.class_id}>
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
        onSubmit={handleDeleteClick}
      />
      <AddClassModal
        isOpen={isAddClassOpen}
        onOpenChange={setIsAddClassOpen}
        fetchClasses={() => getAllClass(page, rowsPerPage, filterValue)}
      />
      <EditClassModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={classClick}
        classId={selectedClassId}
        fetchClasses={() => getAllClass(page, rowsPerPage, filterValue)}
      />
    </>
  );
};

export default Class;
