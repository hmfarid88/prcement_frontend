
'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import ExcelExport from "@/app/components/ExcellGeneration";
import { useSearchParams } from "next/navigation";

type Product = {
    srname: string;
    month: number;
    saleQty: number;
    totalValue: number;
};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const searchParams = useSearchParams();
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/datewise-sr-sale-summary?username=${encodeURIComponent(username)}&startDate=${startDate}&endDate=${endDate}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, startDate, endDate]);

    const totalSale = filteredProducts.reduce((total, product) => {
        return total + product?.totalValue;
    }, 0);

    const MONTH_NAMES = [
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER"
    ];

    return (
        <div className="container-2xl">
            <div className="flex w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
                <div className="flex flex-col p-5 gap-4  w-full">
                    <div className="flex justify-between pl-5 pr-5 pt-1">
                        <div className="flex gap-2">
                            <ExcelExport tableRef={contentToPrint} fileName="sales_summary" />
                            <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                        </div>
                    </div>
                    <div className="flex w-full justify-center p-5">
                        <div className="overflow-x-auto">
                            <div ref={contentToPrint} className="flex-1 p-5">
                                <div className="flex flex-col items-center pb-5"><h4 className="font-bold">MARKETING OFFICER SUMMARY</h4>
                                    <h4>FROM {startDate} TO {endDate}</h4>
                                </div>
                                <table className="table table-zebra table-xs md:table-sm table-pin-rows">
                                    <thead className="sticky top-16 bg-base-100">
                                        <tr>
                                            <th>SN</th>
                                            <th>MARKETING OFFICER NAME</th>
                                            <th>MONTH NAME</th>
                                            <th>QTY</th>
                                            <th>SALE VALUE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts?.map((product, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className="uppercase">{product?.srname}</td>
                                                <td className="uppercase">{MONTH_NAMES[product?.month - 1]}</td>
                                                <td>{Number(product?.totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number(product?.totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    <tfoot>
                                        <tr className="font-semibold text-lg">
                                            <td colSpan={3}></td>
                                            <td>TOTAL</td>
                                            <td>{Number(totalSale?.toFixed(2)).toLocaleString('en-IN')}</td>

                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page