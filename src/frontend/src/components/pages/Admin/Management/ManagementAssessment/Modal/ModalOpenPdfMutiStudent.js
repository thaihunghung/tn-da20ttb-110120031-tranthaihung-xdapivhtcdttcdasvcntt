import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Tooltip,
    Input,
    Select,
    SelectItem,
    Button,
    Textarea,
    DateInput,
    Divider,
    ModalFooter,
    Spinner,
} from "@nextui-org/react";
import { axiosAdmin } from "../../../../../../service/AxiosAdmin";

import { FaPortrait, FaArrowsAltH, FaArrowsAltV } from 'react-icons/fa';
import { UseTeacherAuth } from "../../../../../../hooks";


const ModalOpenPdfMutiStudent = ({
    isOpen,
    onOpenChange,
    AllMutiAssessment
}) => {
    UseTeacherAuth()
    const [loading, setLoading] = useState(false);
    const [zoom, setZoom] = useState(1);
    const handleZoomIn = () => {
        setZoom(zoom + 0.1);
    };

    const handleZoomOut = () => {
        setZoom(zoom - 0.1);
    };

    const handleDownload = async (landscape = false) => {
        setLoading(true);
        const divContent = document.getElementById('downloadDiv').innerHTML;
        const htmlString = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Downloaded Div Content</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                @media print {
                    table { page-break-inside:auto }
                    .test { page-break-inside:avoid; page-break-after:auto }
                    thead { display:table-header-group }
                    tfoot { display:table-footer-group }
                    .hung { background-color: black !important; }
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                }
                </style>
            </head>
            <body>
                ${divContent}
            </body>
            </html>
        `;
        try {
            const response = await axiosAdmin.post('/pdf',
                { html: htmlString, landscape },
                { responseType: 'blob', withCredentials: true }
            );

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
        } finally {
            setLoading(false);
        }
    };
    const checkData2 = Array.isArray(AllMutiAssessment.data2) && AllMutiAssessment.data2.length > 0;
    const checkData3 = Array.isArray(AllMutiAssessment.data3) && AllMutiAssessment.data3.length > 0;

    const findAssessmentScores = (data1, data2, data3) => {
        return (data1 || []).map((item, index) => {
            return {
                ...item,
                score1: item?.AssessmentItems?.assessmentScore || 0,
                score2: data2 && data2[index] ? data2[index]?.AssessmentItems?.assessmentScore || 0 : 0,
                score3: data3 && data3[index] ? data3[index]?.AssessmentItems?.assessmentScore || 0 : 0
            };
        });
    };

    let assessmentScores = [];

    if (checkData2 && checkData3) {
        assessmentScores = findAssessmentScores(AllMutiAssessment.data1, AllMutiAssessment.data2, AllMutiAssessment.data3);
    } else if (checkData2) {
        assessmentScores = findAssessmentScores(AllMutiAssessment.data1, AllMutiAssessment.data2, []);
    } else if (checkData3) {
        assessmentScores = findAssessmentScores(AllMutiAssessment.data1, [], AllMutiAssessment.data3);
    } else {
        assessmentScores = findAssessmentScores(AllMutiAssessment.data1, [], []);
    }

    return (
        <Modal
            size="5xl"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            scrollBehavior="outside"
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
                },
            }} className="overflow-auto no-scrollbar"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="text-[#FF9908]">Tổng kết chấm</ModalHeader>
                        <ModalBody>
                            <div className="flex space-x-4">
                                <Button
                                    variant="light"
                                    onClick={() => handleDownload(false)}
                                    className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow-sm transition ease-in-out duration-150"
                                >
                                    <FaArrowsAltV className="text-lg" />
                                    <span>PDF dọc</span>
                                </Button>
                                <Button
                                    variant="light"
                                    onClick={() => handleDownload(true)}
                                    className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow-sm transition ease-in-out duration-150"
                                >
                                    <FaArrowsAltH className="text-lg" />
                                    <span>PDF ngang</span>
                                </Button>
                                {loading && (
                                    <div className="flex items-center space-x-2">
                                        <Spinner size="sm" color="primary" />
                                        <span>Loading...</span>
                                    </div>
                                )}
                            </div>
                            <div className="relative w-full h-full flex flex-col justify-center items-center">
                                <div className="flex justify-end mb-2 w-full ">
                                    <button className="px-2 py-1 bg-blue-500 text-white rounded mr-2" onClick={handleZoomIn}>Phóng to</button>
                                    <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={handleZoomOut}>Thu nhỏ</button>
                                </div>
                                <div className="overflow-auto w-full flex flex-col justify-center items-center border p-4" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
                                    <div className='w-full text-sm' id="downloadDiv">
                                        <div className="w-full min-w-[16cm] pl-[2cm] pr-[1cm] font-times">
                                            <div className="w-full flex justify-center items-center">
                                                <div className="w-[40%] flex flex-col justify-center items-center">
                                                    <div>TRƯỜNG ĐẠI HỌC TRÀ VINH</div>
                                                    <div className="font-bold">KHOA KỸ THUẬT CÔNG NGHỆ</div>
                                                    <div className="w-[40%] border border-black"></div>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center items-center">
                                                    <div className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                                                    <div className="font-bold">Độc lập - Tự do - Hạnh Phúc</div>
                                                    <div className="w-[30%] border border-black"></div>
                                                </div>
                                            </div>
                                            <div className="text-xl font-bold w-full text-center mt-5 flex flex-col">
                                                <span>PHIẾU CHẤM ĐÁNH GIÁ BÁO CÁO</span>
                                                <span>HỌC PHẦN {AllMutiAssessment?.subject?.subjectName?.toUpperCase()}</span>
                                            </div>
                                            <div className="text-center text-base">(Mã HP: {AllMutiAssessment?.subject?.subjectCode})</div>
                                            <div className="w-full text-left text-base p-2 italic"> Chủ đề: <br />
                                                <span className="uppercase font-bold text-lg">
                                                    {AllMutiAssessment?.description}
                                                </span>
                                            </div>
                                            
                                        </div>
                                        <div className="w-full flex flex-col gap-4 p-4">
                                                {AllMutiAssessment?.students.map((student, index) => (
                                                    <div key={index} className="flex flex-col w-full gap-2 p-4 border border-black rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-[80px] font-semibold text-black">SV{index + 1}:</span>
                                                            <span className="text-lg font-medium text-black">{student?.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-[80px] font-semibold text-black">MSSV:</span>
                                                            <span className="text-lg font-medium text-black">{student?.studentCode}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        <table className='border-collapse border border-black w-full min-w-[16cm] text-base mt-5 font-times'>
                                            <thead>
                                                <tr className="border border-b-0 border-black h-[20px]">
                                                    <th className="border border-black w-[20%]">CLO</th>
                                                    <th className="border border-black w-[50%]">Nội dung báo cáo</th>
                                                    <th className="border border-black w-[20px] text-wrap p-0">
                                                        <div className="flex flex-col items-center">
                                                            <span>Điểm</span>
                                                        </div>
                                                    </th>
                                                    <th className="border border-black w-[20px]">SV1</th>

                                                    {checkData2 && (
                                                        <th className="border border-black w-[20px]">SV2</th>
                                                    )}
                                                    {checkData3 && (
                                                        <th className="border border-r-[1px] border-black w-[20px]">SV3</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(assessmentScores) && assessmentScores.length > 0 ? (
                                                    assessmentScores.map((item) => (
                                                        <tr key={item.rubricsItem_id} className="border border-b-0 border-black p-5">
                                                            <td className="border border-black px-2 text-justify">{item?.CLO?.cloName + ': ' + item?.CLO?.description}</td>
                                                            <td className="border border-black text-justify p-2">
                                                                <span dangerouslySetInnerHTML={{ __html: item?.description }} />
                                                            </td>
                                                            <td className="border border-r-0 border-black text-center">
                                                                <div className="w-full text-center text-base overflow-hidden text-ellipsis whitespace-nowrap">
                                                                    {item?.maxScore}
                                                                </div>
                                                            </td>
                                                            <td className="border border-black">
                                                                <div className="w-full text-center text-base overflow-hidden text-ellipsis whitespace-nowrap">
                                                                    {item.score1}
                                                                </div>
                                                            </td>
                                                            {checkData2 && (
                                                                <td className="border border-black">
                                                                    <div className="w-full text-center text-base overflow-hidden text-ellipsis whitespace-nowrap">
                                                                        {item?.score2 !== undefined ? item?.score2 : 'N/A'}
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {checkData3 && (
                                                                <td className="border border-black border-r-[1px]">
                                                                    <div className="w-full text-center text-base overflow-hidden text-ellipsis whitespace-nowrap">
                                                                        {item?.score3 !== undefined ? item?.score3 : 'N/A'}
                                                                    </div>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="text-center">No data available</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                            <tfoot>
                                                <tr className="h-[60px]">
                                                    <td className="border border-black border-r-0"></td>
                                                    <td className="border border-black border-x-1 text-center font-bold" colSpan={2}>Tổng điểm:</td>
                                                    <td className={`border border-black border-x-0 font-bold text-center`}>{AllMutiAssessment?.totalScore[0]}</td>
                                                    {checkData2 && (
                                                        <td className={`border border-black font-bold text-center ${checkData3 ? '' : 'w-[20px]'}`}>{AllMutiAssessment?.totalScore[1]}</td>
                                                    )}
                                                    {checkData3 && (
                                                        <td className="border border-black font-bold text-center">{AllMutiAssessment?.totalScore[2]}</td>
                                                    )}
                                                </tr>
                                            </tfoot>
                                        </table>
                                        <div className="w-full min-w-[16cm] pl-[2cm] pr-[1cm] gap-2 text-base font-times flex items-center" style={{ pageBreakInside: 'avoid' }}>
                                            <div className="flex-1 flex mt-4 border border-black rounded-lg">
                                                <div className="w-full gap-2 p-4 flex flex-col justify-center items-center text-lg">
                                                    <div className="w-full  border-b border-black pb-2 mb-2">
                                                    </div>
                                                    <div className="w-full h-[100px] flex justify-between items-stretch ">
                                                        {AllMutiAssessment?.students.map((student, index) => (
                                                            <div key={index} className="flex-1 flex flex-col items-center">
                                                                <div className="font-bold text-base text-center h-[60%]">
                                                                    {student.name}
                                                                </div>
                                                                <div className="font-bold text-lg text-center h-[40%]">
                                                                    {AllMutiAssessment?.totalScore[index]}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 flex mt-[20px] justify-end">
                                                <div className="w-full mr-[20px]">
                                                    <div className="w-full text-center">
                                                        Trà Vinh,<span className="italic"> ngày ... tháng ... năm ... </span>
                                                    </div>
                                                    <div className="w-full text-center font-bold">
                                                        GV CHẤM BÁO CÁO
                                                    </div>
                                                    <div className="w-full text-center mt-10 font-bold">
                                                        {
                                                            AllMutiAssessment?.teacher
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onClick={onClose}>
                                Hủy
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ModalOpenPdfMutiStudent;
