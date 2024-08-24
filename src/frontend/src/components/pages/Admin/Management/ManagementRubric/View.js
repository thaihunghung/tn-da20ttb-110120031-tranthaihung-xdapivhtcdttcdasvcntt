import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import DropdownAndNavRubricItems from "../../Utils/DropdownAndNav/DropdownAndNavRubricItems";
import BackButton from "../../Utils/BackButton/BackButton";

const View = () => {
    const { id } = useParams();
    const [RubicItemsData, setRubicItemsData] = useState([]);
    const GetRubricData = async () => {
        try {
            const response = await axiosAdmin.get(`/rubric/${id}/items?isDelete=false`);
            console.log(response.data.rubric);
            if(response.data){
                setRubicItemsData(response.data.rubric.rubricItems);
            }
        } catch (error) {
            console.error('Error fetching rubric data:', error);
            throw error;
        }
    };

    useEffect(() => {
        GetRubricData();
    }, []);

    return (
        <div className='flex w-full flex-col justify-center pb-10 leading-8 pt-5 px-4 sm:px-4 lg:px-7 xl:px-7 bg-[#f5f5f5]-500'>
             <div className='w-full flex justify-between'>
                <div className='h-full my-auto p-5 hidden sm:block'>
                    <BackButton />
                </div>
                
            </div>
            <div className="p-5 px-2 sm:p-5 sm:pb-10 border-2 border-default rounded-xl bg-[#fefefe] shadow-sm">
    <div className="pl-5 pb-5">
        <h1 className="text-2xl font-bold text-[#6366F1] text-center">Tổng quan</h1>
    </div>
    <div className="w-full overflow-x-auto mx-auto">
        <table className="border-collapse border leading-6 border-[#ff8077] w-full">
            <thead>
                <tr className="border border-[#ff8077] h-[20px]">
                    <th className="border border-[#ff8077] py-2 px-4 text-left">CLO</th>
                    <th className="border border-[#ff8077] py-2 px-4 text-left">PLO</th>
                    <th className="border border-[#ff8077] py-2 px-4 text-left">Tiêu chí</th>
                    <th className="border border-[#ff8077] py-2 px-4 text-left">Tổng điểm</th>
                </tr>
            </thead>
            <tbody>
                {RubicItemsData.map((item, i) => (
                    <tr key={item.rubricsItem_id} className="border border-[#ff8077]">
                        <td className="border border-[#ff8077] py-2 px-4 text-center">{item.CLO.cloName}</td>
                        <td className="border border-[#ff8077] py-2 px-4 text-center">{item.PLO.ploName}</td>
                        <td className="border border-[#ff8077] py-2 px-4 text-justify">
                            <span dangerouslySetInnerHTML={{ __html: item.description }} />
                        </td>
                        <td className="border border-[#ff8077] py-2 px-4 text-center">
                            {item.maxScore}
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot className="border-t border-[#ff8077]">
                <tr>
                    <td className="py-5"></td>
                    <td className="py-5"></td>
                    <td className="py-5"></td>
                    <td className="py-5"></td>
                </tr>
            </tfoot>
        </table>
    </div>
</div>

        </div>
    );
};

export default View;
