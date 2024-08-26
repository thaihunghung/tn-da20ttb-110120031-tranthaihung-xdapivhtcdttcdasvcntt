import { useEffect, useState } from "react";
import { Tooltip, message } from 'antd';
import { Button } from "@nextui-org/react";
import { axiosAdmin } from "../../../../../service/AxiosAdmin";
import BackButton from "../../Utils/BackButton/BackButton";
const PoPlo = (nav) => {
    const { setCollapsedNav } = nav;
  
    const [pos, setPos] = useState([]);
    const [plos, setPlos] = useState([]);
    const [poPlos, setPoPlos] = useState([]);
    const [comparePoPlos, setComparePoPlos] = useState([]);

    const GetAllPo = async () => {
        try {
            const response = await axiosAdmin.get('/pos/isDelete/false');
            setPos(response.data);
        } catch (error) {
            console.error('Error fetching POs:', error);
        }
    };

    const GetAllPlo = async () => {
        try {
            const response = await axiosAdmin.get('/plos/isDelete/false');
            setPlos(response.data)
        } catch (error) {
            console.error('Error fetching PLOs:', error);
        }
    };
    const handleSaveOrDelete= async ()=>{
        let luu = [];
        let xoa = [];
        luu = comparePoPlos.filter(compareItem => {
            return !poPlos.some(poPloItem => poPloItem.po_id === compareItem.po_id && poPloItem.plo_id === compareItem.plo_id);
        });

        xoa = poPlos.filter(poPloItem => {
            return !comparePoPlos.some(compareItem => compareItem.po_id === poPloItem.po_id && compareItem.plo_id === poPloItem.plo_id);
        });

        if (luu.length > 0) {
            try {
              const response = await axiosAdmin.post('/po-plo', { dataSave: luu });
              message.success(response.data.message);
            } catch (error) {
              console.error("Error:", error);
              message.error(error.response?.data?.message || 'Error saving data');
            }
          }
        
          if (xoa.length > 0) {
            try {
              const response = await axiosAdmin.delete('/po-plo', { data: { dataDelete: xoa } });
              message.success(response.data.message);
            } catch (error) {
              console.error("Error:", error);
              message.error(error.response?.data?.message || 'Error deleting data');
            }
          }
    }
    const GetAllPoPlo = async () => {
        try {
            const response = await axiosAdmin.get('/po-plo');
            const po_plo_ids = response.data.map(item => ({ po_id: item.po_id, plo_id: item.plo_id }));
            console.log(po_plo_ids);

            setPoPlos(response.data.map(item => ({id_po_plo: item.id_po_plo, po_id: item.po_id, plo_id: item.plo_id })));
            setComparePoPlos(response.data.map(item => ({ po_id: item.po_id, plo_id: item.plo_id })))
        } catch (error) {
            console.error('Error fetching PO-PLO mappings:', error);
        }
    };

    // Hàm xử lý thay đổi trạng thái của checkbox
    const handleCheckboxChange = (plo_id, po_id, checked) => {
        if (checked) {
            setComparePoPlos([...comparePoPlos, { plo_id, po_id }]);
        } else {
            setComparePoPlos(comparePoPlos.filter(item => !(item.plo_id === plo_id && item.po_id === po_id)));
        }
    };

    useEffect(() => {
        GetAllPo();
        GetAllPlo();
        GetAllPoPlo();
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
        <div className="flex w-full flex-col justify-center leading-8 ">
            <div className='w-full flex justify-between mb-2'>
                <div className='h-full my-auto p-5 hidden sm:block'>
                    <BackButton />
                </div>
                <div className='w-full sm:w-fit bg-[white] border-slate-300 rounded-xl border-2 p-2 justify-center items-center flex gap-4 flex-col min-w-[320px]'>
                    <div className='flex  justify-between sm:justify-end w-full flex-wrap items-center gap-1 '>
                        <div className="pl-5 mt-2 block sm:hidden">
                            <h1 className="text-2xl font-bold text-[#6366F1] text-justify">Ánh xạ PO và PLO</h1>
                        </div>
                        <Button color="primary" onClick={handleSaveOrDelete}>
                            Lưu
                        </Button>
                    </div>
                </div>
            </div>
            <div className="p-5 px-2 sm:p-5 border-2 border-default rounded-xl bg-[#fefefe] shadow-sm">
                <div className="pl-5 mt-2 hidden sm:block">
                    <h1 className="text-2xl font-bold text-[#6366F1] text-left">Ánh xạ PO và PLO</h1>
                </div>
                <div className="w-full  mt-5 ">
                    <table className="table-auto w-full border-collapse border rounded-2xl">
                        <thead className="w-full">
                            <tr>
                                <th className="p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-[#475569] text-[#fefefe]">PLO</th>
                                <th className="p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-[#475569] text-[#fefefe] hidden sm:hidden lg:block xl:block">Nội dung</th>
                                {pos.map((po_item) => (
                                    <th key={po_item.po_id} className="p-2 lg:w-[8%] xl:w-[8%] text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-[#475569] text-[#fefefe]">
                                        <Tooltip title={po_item.description} color={'#FF9908'}>
                                            <span>{po_item.poName}</span>
                                        </Tooltip>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="w-full">
                            {plos.map((plo_item, index) => (
                                <tr key={index} className="w-full text-[#020401]">
                                    <td className="border p-2 text-center sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">
                                        <span className="hidden sm:hidden lg:block xl:block">{plo_item.ploName}</span>
                                        <Tooltip title={plo_item.description}
                                            color={'#FF9908'}
                                            className="block sm:block lg:hidden xl:hidden text-[#020401]"
                                        >
                                            <span>{plo_item.ploName}</span>
                                        </Tooltip>
                                    </td>
                                    <td className="border p-2 text-left sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 hidden sm:hidden lg:block xl:block">
                                        <span className="w-[100px]">{plo_item.description}</span>
                                    </td>
                                    {pos.map((po_item) => {
                                        const isFound = comparePoPlos.some(
                                            (item) => item.plo_id === plo_item.plo_id && item.po_id === po_item.po_id
                                        );
                                        const found = isFound ? true : false;
                                        return (
                                            <td key={po_item.po_id} className="border p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">
                                                <input
                                                    type="checkbox"
                                                    checked={found}
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        handleCheckboxChange(plo_item.plo_id, po_item.po_id, isChecked);
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


export default PoPlo;
