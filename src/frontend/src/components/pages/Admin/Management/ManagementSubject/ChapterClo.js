import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Tooltip, message, Button } from 'antd';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavChapter from "../../Utils/DropdownAndNav/DropdownAndNavChapter";
import BackButton from "../../Utils/BackButton/BackButton";
const ChapterClo = (nav) => {
    const location = useLocation();
    const isActive = (path) => location.pathname.startsWith(path);
    const { id } = useParams();
    const { setCollapsedNav } = nav;

    const [clos, setClos] = useState([]);
    const [chapters, setChapter] = useState([]);
    const [ChapterClos, setChapterClos] = useState([]);
    const [compareChapterClos, setCompareChapterClos] = useState([]);

    const [ChapterArr, setChapterArr] = useState([]);


    const GetAllClo = async () => {
        try {
            const response = await axiosAdmin.get(`/clos?subject_id=${id}&isDelete=false`);

            //console.log(response.data);
            setClos(response.data);
        } catch (error) {
            console.error('Error fetching POs:', error);
        }
    };

    const GetArrChapterBySubjectID = async () => {
        try {
            const response = await axiosAdmin.get(`/subject/${id}/?only_chapter_ids=true`);
            setChapterArr(response?.data?.chapter_ids);
            //console.log(response.data); 
            //message.success('CLOs fetched successfully.');
        } catch (error) {
            console.error('Error fetching chapters:', error);
            if (error.response && error.response.status === 404) {
                message.error('No chapters found for the given subject ID.');
            } else {
                message.error('An error occurred while fetching chapters.');
            }
        }
    };

    const GetAllPlo = async () => {
        try {
            const response = await axiosAdmin.get(`/chapters?subject_id=${id}&isDelete=false`);
            setChapter(response?.data)
        } catch (error) {
            console.error('Error fetching PLOs:', error);
        }
    };
    const handleSaveOrDelete = async () => {

        let luu = [];
        let xoa = [];
        luu = compareChapterClos.filter(compareItem => {
            return !ChapterClos.some(cloPloItem => cloPloItem.clo_id === compareItem.clo_id && cloPloItem.chapter_id === compareItem.chapter_id);
        });

        xoa = ChapterClos.filter(cloPloItem => {
            return !compareChapterClos.some(compareItem => compareItem.clo_id === cloPloItem.clo_id && compareItem.chapter_id === cloPloItem.chapter_id);
        });
        console.log(xoa)
        if (luu.length > 0) {
            try {
                const response = await axiosAdmin.post('/clo-chapter', { dataSave: luu });
                message.success(response.data.message);
            } catch (error) {
                console.error("Error:", error);
                message.error(error.response?.data?.message || 'Error saving data');
            }
        }

        if (xoa.length > 0) {
            try {
                const response = await axiosAdmin.delete('/clo-chapter', { data: { dataDelete: xoa } });
                message.success(response.data.message);
            } catch (error) {
                console.error("Error:", error);
                message.error(error.response?.data?.message || 'Error deleting data');
            }
        }
    }
    const GetAllChapterClo = async () => {
        try {
            //ChapterArr is []
            const chapterIds = JSON.stringify(ChapterArr); // Chuyển đổi mảng ChapterArr thành chuỗi JSON

                // Thực hiện yêu cầu GET với tham số truy vấn
                const response = await axiosAdmin.get('/clo-chapter', {
                    params: { chapter_ids: chapterIds }
                });


            const id_clo_chapters = response.data.map(item => ({ chapter_id: item.chapter_id, clo_id: item.clo_id }));
            console.log(id_clo_chapters)

            setChapterClos(response.data.map(item => ({ id_clo_chapter: item.id_clo_chapter, clo_id: item.clo_id, chapter_id: item.chapter_id })));
            setCompareChapterClos(response.data.map(item => ({ clo_id: item.clo_id, chapter_id: item.chapter_id })))
        } catch (error) {
            console.error('Error fetching PO-PLO mappings:', error);
        }
    };

    const handleCheckboxChange = (chapter_id, clo_id, checked) => {
        if (checked) {
            setCompareChapterClos([...compareChapterClos, { chapter_id, clo_id }]);
        } else {
            setCompareChapterClos(compareChapterClos.filter(item => !(item.chapter_id === chapter_id && item.clo_id === clo_id)));
        }
    };

    useEffect(() => {
        GetAllClo();
        GetArrChapterBySubjectID()
        GetAllPlo();

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
    }, []);
    useEffect(() => {

        GetAllChapterClo();

    }, [ChapterArr]);

    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 relative">
            <div className='w-full flex justify-between'>
                <div className='h-full my-auto p-5 hidden sm:block'>
                    <BackButton />
                </div>
                <div className='w-full sm:w-fit bg-[white] border-slate-300 rounded-xl border-2 p-2 justify-center items-center flex gap-4 flex-col'>
                    <div className='flex justify-end w-full flex-wrap items-center gap-1'>
                        <Button color="primary" onClick={handleSaveOrDelete}>
                            Save
                        </Button>
                    </div>
                </div>
            </div>
            <div className="pl-5 mt-2">
                <h1 className="text-2xl font-bold text-[#6366F1] text-left">Map Clo Plo</h1>
            </div>
            <div className="p-5 pt-0 pb-10 mt-5 flex justify-end items-start relative">
                <div className="sticky left-0 top-0 z-50 block sm:hidden lg:hidden xl:hidden">
                    <table>
                        <thead>
                            <tr>
                                <th className="p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-[#475569] text-[#fefefe]">Chương</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chapters.map((chapter_item, index) => (
                                <tr key={index} className="w-full h-full ">
                                    <td className="border w-[200px] p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">
                                        <Tooltip title={chapter_item.description} color={'#ff9908'}>
                                            <span>{chapter_item.chapterName}</span>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="h-full w-[400px] sm:w-[640px] lg:w-full xl:w-full overflow-auto">
                    <table className="border-collapse table-auto w-full">
                        <thead>
                            <tr>
                                <th className="p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 hidden sm:block lg:block xl:block bg-[#475569]  text-[#fefefe]">CLO</th>
                                {clos.map((clo_item, index) => (
                                    <th key={index} className="p-2 lg:w-[8%] xl:w-[8%] text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-[#475569]  text-[#fefefe]">
                                        <Tooltip title={clo_item.description} color={'#ff9908'}>
                                            <span>{clo_item.cloName}</span>
                                        </Tooltip>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {chapters.map((chapter_item, index) => (
                                <tr key={index} className="w-full h-full">
                                    <td className="border p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 hidden sm:block lg:block xl:block">
                                        <Tooltip title={chapter_item.description} color={'#ff9908'}>
                                            <span>{chapter_item.chapterName}</span>
                                        </Tooltip>
                                    </td>
                                    {clos.map((clo_item) => {
                                        const isFound = compareChapterClos.some(
                                            (item) => item.chapter_id === chapter_item.chapter_id && item.clo_id === clo_item.clo_id
                                        );
                                        const found = isFound ? true : false;
                                        return (
                                            <td key={clo_item.clo_id} className="border p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={found}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        handleCheckboxChange(chapter_item.chapter_id, clo_item.clo_id, isChecked);
                                                    }}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}


export default ChapterClo;
