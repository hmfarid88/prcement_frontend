'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import DateToDate from "@/app/components/DateToDate";
import ExcelExport from "@/app/components/ExcellGeneration";
import CurrentMonthYear from "@/app/components/CurrentMonthYear";
import { IoSearch } from "react-icons/io5";

type Product = {
    category: string;
    qty: number;
    debit: number;
    credit: number;
    openingBalance: number;
};


const Page = () => {
    const router = useRouter();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const searchParams = useSearchParams();
    const salesPerson = searchParams.get('category');
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [maxDate, setMaxDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
    }, []);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            toast.warning("Start date and end date required !");
            return;
        }
        // Use the dynamic routePath for navigation
        router.push(`/datewise-marketwise-retailer?salesPerson=${encodeURIComponent(salesPerson ?? "")}&startDate=${startDate}&endDate=${endDate}`);
        setStartDate("");
        setEndDate("");
    };

    const handleDetails = (category: string) => {
        if (!category) {
            toast.warning("Particular name is missing!");
            return;
        }
        router.push(`/details-retailer-ledger?retailerName=${encodeURIComponent(category)}&username=${encodeURIComponent(username)}`);
    };


    useEffect(() => {
        fetch(`${apiBaseUrl}/retailer/marketwiseRetailerBalance?salesPerson=${encodeURIComponent(salesPerson ?? "")}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, salesPerson]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.category?.toLowerCase().includes(filterCriteria.toLowerCase()) || '')

        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };


    const totalOpening = filteredProducts.reduce((total, product) => {
        return total + product.openingBalance;
    }, 0);

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.qty;
    }, 0);

    const totalDebit = filteredProducts.reduce((total, product) => {
        return total + product.debit;
    }, 0);

    const totalCredit = filteredProducts.reduce((total, product) => {
        return total + product.credit;
    }, 0);


    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
                <div className="flex p-2">
                    <div className='flex flex-col md:flex-row w-full gap-3'>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">START DATE</span>
                            </div>
                            <input
                                type="date"
                                name="date"
                                onChange={(e: any) => setStartDate(e.target.value)}
                                max={maxDate}
                                value={startDate}
                                className="input input-bordered"
                            />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">END DATE</span>
                            </div>
                            <input
                                type="date"
                                name="date"
                                onChange={(e: any) => setEndDate(e.target.value)}
                                max={maxDate}
                                value={endDate}
                                className="input input-bordered"
                            />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">SEARCH</span>
                            </div>
                            <button onClick={handleSubmit} className='btn btn-success'><IoSearch size={30} /></button>
                        </label>

                    </div>

                </div>
                <div className="flex w-full justify-between pl-5 pr-5 pt-1">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                    <div className="flex gap-2">
                        <ExcelExport tableRef={contentToPrint} fileName="retailer_ledger" />
                        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                    </div>
                </div>
                <div className="flex w-full justify-center">
                    <div className="overflow-x-auto">

                        <div ref={contentToPrint} className="flex-1 p-5">
                            <div className="flex flex-col items-center pb-5"><h4 className="font-bold">RETAILER LEDGER</h4>
                                <h4 className="uppercase font-semibold">MARKETING OFFICHER : {salesPerson}</h4>
                                <h4><CurrentMonthYear /></h4>
                            </div>
                            <table className="table table-md table-pin-rows table-zebra">
                                <thead className="sticky top-16 bg-base-100">
                                    <tr>
                                        <th>SN</th>
                                        <th>PARTICULARS</th>
                                        <th>OPENING</th>
                                        <th>QTY</th>
                                        <th>DEBIT</th>
                                        <th>CREDIT</th>
                                        <th>CLOSING</th>
                                        <th>DETAILS</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredProducts?.map((product, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{product?.category}</td>
                                            <td>{product?.openingBalance}</td>
                                            <td>{product?.qty}</td>
                                            <td>{product?.debit}</td>
                                            <td>{product?.credit}</td>
                                            <td>{product?.openingBalance + product?.debit - product?.credit}</td>
                                            <td>
                                                <button onClick={() => handleDetails(product?.category)} className="btn btn-sm btn-info">Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                                <tfoot>

                                    <tr className="font-semibold text-lg">
                                        <td></td>
                                        <td>TOTAL</td>
                                        <td>{totalOpening.toLocaleString('en-IN')}</td>
                                        <td>{totalQty.toLocaleString('en-IN')}</td>
                                        <td>{totalDebit.toLocaleString('en-IN')}</td>
                                        <td>{totalCredit.toLocaleString('en-IN')}</td>
                                        <td>{(totalOpening + totalDebit - totalCredit).toLocaleString('en-IN')}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
