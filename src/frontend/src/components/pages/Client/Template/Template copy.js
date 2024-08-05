import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { AxiosClient } from '../../../../service/AxiosClient';


import { RadioGroup, Radio } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";
import { Collapse } from 'antd';


import { axiosAdmin } from "../../../../service/AxiosAdmin";



const DownloadDiv = () => {

    const handleDownload = async () => {
        // const divContent = document.getElementById('downloadDiv').innerHTML;
        // const htmlString = `
        //     <!DOCTYPE html>
        //     <html lang="en">
        //     <head>
        //         <meta charset="UTF-8">
        //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //         <title>Downloaded Div Content</title>
        //         <script src="https://cdn.tailwindcss.com"></script>
        //         <style>
        //         @media print {
        //             table { page-break-inside:auto }
        //             .test { page-break-inside:avoid; page-break-after:auto }
        //             thead { display:table-header-group }
        //             tfoot { display:table-footer-group }
        //             .hung { background-color: black !important; }
        //             thead { display: table-header-group; }
        //             tfoot { display: table-footer-group; }
        //         }
        //         </style>
        //     </head>
        //     <body>
        //         ${divContent}
        //     </body>
        //     </html>
        // `;
        try {
            const response = await axiosAdmin.get('pdf', {
                id: 1
            }, { responseType: 'blob', withCredentials: true });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'test.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Button color="primary" onClick={handleDownload}>
            Download
        </Button>
    );
};

const Template = () => {

    const [selectedValues, setSelectedValues] = useState([]);
    const [RubicData, setRubicData] = useState([]);
    const [RubicItemsData, setRubicItemsData] = useState([]);


    const GetRubricData = async () => {
        try {
            // const response = await axiosAdmin.get(`/rubric/${1}/items?isDelete=false`);
            // setRubicData(response.data.rubric);
            // setRubicItemsData(response.data.rubric.rubricItems);


            const response = await axiosAdmin.get(`/assessment/${1563}/items`);
      console.log("response?.data");
      console.log(response?.data);
      setRubicData(response?.data?.MetaAssessment?.Rubric)
      setRubicItemsData(response?.data?.MetaAssessment?.Rubric?.RubricItems)

        } catch (error) {
            console.error('Error fetching rubric data:', error);
            throw error;
        }
    };

    useEffect(() => {
        GetRubricData();
    }, []);

    return (
        <div>
            <DownloadDiv />
            <div className='w-full text-sm' id="downloadDiv">
                <div className="w-full pl-[2cm] pr-[1cm] font-times">
                    <div className="w-full flex justify-center items-center">
                        <div className="w-[40%] flex flex-col justify-center items-center">
                            <div>TRƯỜNG ĐẠI HỌC TRÀ VINH</div>
                            <div className="font-bold">KHOA KỸ THUẬT CÔNG NGHỆ</div>
                            <div className="w-[40%] border-1 border-black"></div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-center">
                            <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                            <div className="font-bold">Độc lập - Tự do - Hạnh Phúc</div>
                            <div className="w-[30%] border-1 border-black"></div>
                        </div>
                    </div>
                    <div className="text-xl font-bold w-full text-center mt-5 flex flex-col">
                        <span>PHIẾU CHẤM ĐÁNH GIÁ BÁO CÁO</span>
                        {/* <span>HỌC PHẦN {RubicData.subject.subjectName.toUpperCase() }</span> */}
                    </div>
                    {/* <div className="text-center text-base">(Mã HP: {RubicData.subject.subjectCode })</div> */}
                    <div className="w-full text-left text-base">Nhóm<span className="text-lg">: .........</span> Chủ đề: ...........................................................................................................................................................................................</div>
                    <div className="w-full text-left text-base">+ Họ và tên SV1<span className="text-lg">: ....................................................................................</span> MSSV: ....................................................................................</div>
                    <div className="w-full text-left text-base">+ Họ và tên SV2<span className="text-lg">: ....................................................................................</span> MSSV: ....................................................................................</div>
                    <div className="w-full text-left text-base">+ Họ và tên SV3<span className="text-lg">: ....................................................................................</span> MSSV: ....................................................................................</div>
                </div>
                <table className='border-collapse border-[1px] border-[#020401] w-full h-full text-base mt-5 font-times'>
                    <thead>
                        <tr className="border-[1px] border-b-0 w-full border-[#020401] h-[20px]">
                            <th className="border-[1px] border-[#020401] w-[20%]">CLO</th>
                            <th className="border-[1px] border-[#020401] w-[50%]">Nội dung báo cáo</th>
                            <th className="border-[1px] border-[#020401] w-[50px] text-wrap p-0">
                                <div className="flex flex-col items-center">
                                    <span>Điểm</span>
                                </div>
                            </th>
                            <th className="border-[1px] border-[#020401] w-[20px]">SV1</th>
                            <th className="border-[1px] border-[#020401] w-[20px]">SV2</th>
                            <th className="border-[1px] border-r-[2px] border-[#020401] w-[20px]">SV3</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RubicItemsData.map((item) => (
                            <tr key={item.rubricsItem_id} className="border-[1px] border-b-0 border-[#020401] p-5">
                                <td className="border-[1px] border-[#020401] px-2 text-justify">{item.CLO.cloName + ': ' + item.CLO.description}</td>
                                <td className="border-[1px] border-[#020401] text-justify p-2">
                                    <span dangerouslySetInnerHTML={{ __html: item.description }} />
                                </td>
                                <td className="border-[1px] border-r-0 border-[#020401] text-center p-0 w-[10px]">
                                    <div className="w-full text-center text-base overflow-hidden text-overflow-ellipsis whitespace-nowrap">
                                        {item.maxScore}
                                    </div>
                                </td>
                                <td className="border-[1px] border-[#020401]"></td>
                                <td className="border-[1px] border-[#020401]"></td>
                                <td className="border-[1px] border-[#020401] border-r-[2px]"></td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="h-[20px]">
                            <td className="border-[1px] border-[#020401]"></td>
                            <td className="border-[1px] border-[#020401]"></td>
                            <td className="border-[1px] border-[#020401] w-[10px]"></td>
                            <td className="border-[1px] border-[#020401]"></td>
                            <td className="border-[1px] border-[#020401]"></td>
                            <td className="border-[1px] border-[#020401] border-r-[2px]"></td>
                        </tr>
                    </tfoot>
                </table>
                <div className="w-full pl-[2cm] pr-[1cm] text-base font-times" style={{ pageBreakInside: 'avoid' }}>
                    <div className="w-full flex mt-[50px] justify-end pl-[2cm] pr-[1cm]">
                        <div className="w-[50%] mr-[20px]">
                            <div className="w-full text-center">
                                Trà Vinh,<span className="italic"> ngày ... tháng ... năm ... </span>
                            </div>
                            <div className="w-full text-center font-bold">
                                GV CHẤM BÁO CÁO
                            </div>
                            <div className="w-full text-center">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Template;
