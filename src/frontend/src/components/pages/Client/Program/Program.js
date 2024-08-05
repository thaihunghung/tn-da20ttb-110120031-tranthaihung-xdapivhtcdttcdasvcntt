import React, { useState, useEffect } from "react";
import { axiosAdmin } from "../../../../service/AxiosAdmin";
import "./Program.css";

const Program = (nav) => {
  const { setCollapsedNav } = nav;
  const [pos, setPos] = useState([]);
  const [plos, setPlos] = useState([]);
  const [poPlos, setPoPlos] = useState([]);

  const GetAllPo = async () => {
    try {
      const response = await axiosAdmin.get('/po');
      setPos(response.data);
    } catch (error) {
      console.error('Error fetching POs:', error);
    }
  };

  const GetAllPlo = async () => {
    try {
      const response = await axiosAdmin.get('/plo');
      setPlos(response.data);
    } catch (error) {
      console.error('Error fetching PLOs:', error);
    }
  };

  const GetAllPoPlo = async () => {
    try {
      const response = await axiosAdmin.get('/po-plo');
      setPoPlos(response.data);
    } catch (error) {
      console.error('Error fetching PO-PLO mappings:', error);
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
    <div className="w-full flex flex-col p-2 sm:p-5 lg:p-10 xl:p-10">
      <table className="table-autoborder-collapse border">
        <thead>
          <tr>
            <th className="p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white hidden sm:block lg:block xl:block">STT</th>
            <th className="p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white">PLO</th>
            <th className="p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white hidden sm:hidden lg:block xl:block">Nội dung</th>
            {pos.map((po_item) => (
              <th key={po_item.po_id} className="p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white">
                {po_item.po_id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plos.map((plo_item, index) => (
            <tr key={index}>
              <td className="border p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 hidden sm:block lg:block xl:block">{index + 1}</td>
              <td className="border p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">{plo_item.plo_id}</td>
              <td className="border p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 hidden sm:hidden lg:block xl:block">{plo_item.plo_name}</td>
              {pos.map((po_item) => {
                const found = poPlos.find(
                  (item) => item.plo_id === plo_item.id && item.po_id === po_item.id
                );
                return (
                  <td key={po_item.po_id} className="border p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">
                    {found ? 'X' : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <table className="table-auto border-collapse border">
        <thead>
          <tr>
            <th className="p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white hidden sm:block lg:block xl:block">STT</th>
            <th className="p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white">PLO</th>
            <th className="p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white hidden sm:hidden lg:block xl:block">Nội dung</th>
            {pos.map((po_item) => (
              <th key={po_item.po_id} className="p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 bg-gray-800 text-white">
                {po_item.po_id}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plos.map((plo_item, index) => (
            <tr key={index}>
              <td className="border p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 hidden sm:block lg:block xl:block">{index + 1}</td>
              <td className="border p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">{plo_item.plo_id}</td>
              <td className="border p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2 hidden sm:hidden lg:block xl:block">{plo_item.plo_name}</td>
              {pos.map((po_item) => {
                const found = poPlos.find(
                  (item) => item.plo_id === plo_item.id && item.po_id === po_item.id
                );
                return (
                  <td key={po_item.po_id} className="border p-2 sm:px-4 sm:py-2 lg:px-4 lg:py-2 xl:px-4 xl:py-2">
                    <input
                      type="checkbox"
                      checked={found}
                      onChange={(e) => {}}
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
  );
};

export default Program;
