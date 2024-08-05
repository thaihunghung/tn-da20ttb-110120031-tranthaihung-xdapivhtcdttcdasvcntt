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
            <div className="pl-5 pb-5">
                <h1 className="text-2xl font-bold text-[#6366F1] text-center">Tổng quan</h1>
            </div>
            <div className="w-[26cm] overflow-auto mx-auto">
                <table className='border-collapse border leading-6 border-[#ff8077] w-full h-full'>
                    <thead>
                        <tr className="border border-b-0 border-[#ff8077] h-[20px]">
                            <th className="border border-b-0 border-[#ff8077]">CLO</th>
                            <th className="border border-b-0 border-[#ff8077]">PLO</th>
                            <th className="border border-b-0 border-[#ff8077]">Tiêu chí</th>
                            <th className="border border-b-0 border-r-0 border-[#ff8077]">Tổng điểm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RubicItemsData.map((item, i) => (

                            <tr key={item.rubricsItem_id} className="border border-b-0 border-[#ff8077] p-5">
                                <td className="border  border-[#ff8077] text-center px-2">{item.CLO.cloName}</td>
                                <td className="border  border-[#ff8077] text-center px-2">{item.PLO.ploName}</td>
                                <td className="border border-[#ff8077] test text-justify p-2">
                                    <span dangerouslySetInnerHTML={{ __html: item.description }} />
                                </td>
                                <td className="border border-r-0 border-[#ff8077] text-center px-2">
                                    {item.maxScore}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="border border-[#ff8077] p-5">
                        <tr className="h-[20px]">
                            <td className="p-5"></td>
                            <td className="p-5"></td>
                            <td className="p-5"></td>
                            <td className="p-5"></td>
                        </tr>
                    </tfoot>
                </table>

            </div>
        </div>
    );
};

export default View;
