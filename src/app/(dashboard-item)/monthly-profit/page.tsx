'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import Print from "@/app/components/Print";
import CurrentMonthYear from "@/app/components/CurrentMonthYear";
import DateToDate from "@/app/components/DateToDate";
import ExcelExport from "@/app/components/ExcellGeneration";
import Link from "next/link";


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const contentToPrint = useRef<HTMLDivElement>(null);

    const [filterCriteria, setFilterCriteria] = useState('');

    const [data, setData] = useState<any>(null);
    useEffect(() => {
        fetch(`${apiBaseUrl}/finance/monthly-profit?username=${encodeURIComponent(username)}`)
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
  
    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] items-center justify-center p-4">
                <div className="flex p-5 justify-end items-end"><DateToDate routePath="/datewise-profit-summary" /></div>

                <div className="flex w-full justify-between pl-5 pr-5 pt-1">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                    <div className="flex gap-2">
                        <ExcelExport tableRef={contentToPrint} fileName="profit_report" />
                        <Print contentRef={contentToPrint} />
                    </div>

                </div>
                <div className="flex w-full justify-center">
                    <div className="overflow-x-auto">
                        <div ref={contentToPrint} className="flex-1 p-5">
                            <div className="flex flex-col items-center pb-5"><h4 className="font-bold">PROFIT REPORT</h4><CurrentMonthYear /></div>
                           <table className="table-zebra">
                            <tr>
                                <td className="text-lg">Sales Profit:</td>
                                <td className="text-lg">{Number(data?.salesProfit.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td className="text-lg"><button className="btn btn-md btn-link"><Link href="/profit-report">Details</Link></button></td>
                            </tr>
                            <tr>
                                <td className="text-lg">Supplier Commission:</td>
                                <td className="text-lg">{Number(data?.supplierCommission.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td className="text-lg"><button className="btn btn-md btn-link"><Link href="/supplier-commission-report">Details</Link></button></td>
                            </tr>
                            <tr>
                                <td className="text-lg">Transport Rent:</td>
                                <td className="text-lg">{Number(data?.rent.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td className="text-lg"><button className="btn btn-md btn-link"><Link href="/transport-pay-report">Details</Link></button></td>
                            </tr>
                            <tr>
                               <td className="text-lg">Expense:</td> 
                               <td className="text-lg">{Number(data?.expense.toFixed(2)).toLocaleString('en-IN')}</td> 
                               <td className="text-lg"><button className="btn btn-md btn-link"><Link href="/expense-report">Details</Link></button></td> 
                            </tr>
                            <tr>
                               <td className="text-lg">Employee Payment:</td>  
                               <td className="text-lg">{Number(data?.employeePayment.toFixed(2)).toLocaleString('en-IN')}</td>  
                               <td className="text-lg"><button className="btn btn-md btn-link"><Link href="/employee-pay-report">Details</Link></button></td>  
                            </tr>
                           </table>
                                                       
                            <hr className="my-3" />
                            <tr>
                             <td className="text-lg font-bold">Net Profit: </td>     
                             <td className="text-lg font-bold">{Number(data?.netProfit.toFixed(2)).toLocaleString('en-IN')}</td>     
                            </tr>
                          
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page