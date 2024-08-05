import { useEffect, useState } from "react";
import { message } from 'antd';
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavProgram from "../../Utils/DropdownAndNav/DropdownAndNavProgram";

const ManageProgram = (nav) => {
    const { setCollapsedNav } = nav;
    const [programData, setProgramData] = useState({});

    const allProgramNotIsDelete = async () => {
        try {
            const program = await axiosAdmin.get('/program/IT');
            setProgramData(program.data)
            console.log(program.data);
        } catch (error) {
            console.error("Error fetching program data:", error);
            message.error(error.message || 'Error fetching program data');
        };
    }
    useEffect(() => {
        allProgramNotIsDelete()
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


    return (
        <div className="flex w-full flex-col justify-center leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7">
            <DropdownAndNavProgram />
            <div className="w-full border mt-5 rounded-lg">
                <div className="w-full border-collapse border">
                    <div className="w-full">
                        <div className="w-full border-1 bg-[#475569] text-white text-center">Mô tả</div>
                    </div>
                    <div className="border-1 text-justify leading-8 p-5">
                        <div className="w-full text-2xl text-[#475569] mb-5 font-bold">{programData?.programName}</div>
                        <div dangerouslySetInnerHTML={{ __html: programData?.description }}></div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ManageProgram;
