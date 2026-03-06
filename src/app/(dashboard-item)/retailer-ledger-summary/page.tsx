'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useRouter } from "next/navigation";
import DateToDate from "@/app/components/DateToDate";
import ExcelExport from "@/app/components/ExcellGeneration";
import CurrentDate from "@/app/components/CurrentDate";

type Product = {
    category: string;
    retailerName: string;
    salesPerson: string;
    debit: number;
    credit: number;
};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [groupByCategory, setGroupByCategory] = useState(false);
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const groupedData = Object.values(
        filteredProducts.reduce((acc: any, item) => {

            const key = item.category || "Unknown";

            if (!acc[key]) {
                acc[key] = {
                    category: key,
                    debit: 0,
                    credit: 0
                };
            }

            acc[key].debit += item.debit;
            acc[key].credit += item.credit;

            return acc;

        }, {})
    );

    useEffect(() => {
        fetch(`${apiBaseUrl}/retailer/retailerBalance`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl]);

    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.category?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.retailerName?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.salesPerson?.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    const totalDebit = filteredProducts.reduce((total, product) => {
        return total + product.debit;
    }, 0);

    const totalCredit = filteredProducts.reduce((total, product) => {
        return total + product.credit;
    }, 0);

    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
                <div className="flex p-2"><DateToDate routePath="/datewise-retail-ledger-summary" /></div>
                <div className="flex w-full justify-between pl-5 pr-5 pt-1">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setGroupByCategory(!groupByCategory)}
                            className="btn btn-sm btn-primary mt-2"
                        >
                            {groupByCategory ? "Normal View" : "Group View"}
                        </button>
                        <ExcelExport tableRef={contentToPrint} fileName="retailer_ledger_summary" />
                        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                    </div>
                </div>
                <div className="flex w-full justify-center">
                    <div className="overflow-x-auto">
                        <div ref={contentToPrint} className="flex-1 p-5">
                            <div className="flex flex-col items-center pb-5"><h4 className="font-bold">MARKET LEDGER</h4>
                                <h4><CurrentDate /></h4>
                            </div>
                            <table className="table table-md table-pin-rows table-zebra">
                                <thead className="sticky top-16 bg-base-100">
                                    <tr>
                                        <th>SN</th>
                                        <th>CATEGORY</th>
                                        <th>MARKET OFFICER</th>
                                        <th>RETAILER</th>
                                        <th>MARKET DEBIT</th>
                                        <th>MARKET CREDIT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!groupByCategory && filteredProducts?.map((product, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{product?.category}</td>
                                            <td>{product?.salesPerson}</td>
                                            <td>{product?.retailerName}</td>
                                            <td>{product?.debit}</td>
                                            <td>{product?.credit}</td>
                                        </tr>
                                    ))}

                                    {groupByCategory && groupedData.map((item: any, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.category}</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>{item.debit}</td>
                                            <td>{item.credit}</td>
                                        </tr>
                                    ))}

                                </tbody>

                                <tfoot>
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={3}></td>
                                        <td>TOTAL</td>
                                        <td>{Number((totalDebit).toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number((totalCredit).toFixed(2)).toLocaleString('en-IN')}</td>
                                    </tr>

                                </tfoot>
                            </table>
                            <div className="flex justify-end font-extrabold">
                                BALANCE: {Number((totalCredit - totalDebit).toFixed(2)).toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page

