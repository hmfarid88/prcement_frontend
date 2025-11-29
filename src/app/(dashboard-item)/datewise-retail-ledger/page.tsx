'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import ExcelExport from "@/app/components/ExcellGeneration";

type Product = {
    category: string;
    qty: number;
    debit: number;
    credit: number;
    openingBalance: number;
    // areaName: string;
    // retailerName: string;
    // retailerCode: string;
    // salesPerson: string;
    // totalProductQty: number;
    // totalProductValue: number;
    // totalPayment: number;
    // totalCommission: number;
};


const Page = () => {
    const router = useRouter();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const searchParams = useSearchParams();
    const newstartDate = searchParams.get('startDate');
    const newendDate = searchParams.get('endDate');
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    // const [showDetails, setShowDetails] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    const handleDetails = (category: string) => {
        if (!category) {
            toast.warning("Particular name is empty!");
            return;
        }
        // router.push(`/datewise-retailer-details?startDate=${newstartDate}&endDate=${newendDate}&retailerName=${encodeURIComponent(retailerName)}&username=${encodeURIComponent(username)}`);
        // router.push(`/details-retailer-ledger?retailerName=${encodeURIComponent(retailerName)}&username=${encodeURIComponent(username)}`);
        router.push(`/marketing-officher-ledger?category=${encodeURIComponent(category)}`);

    }

    useEffect(() => {
        fetch(`${apiBaseUrl}/retailer/datewiseCategoryRetailerBalance?startDate=${newstartDate}&endDate=${newendDate}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, newstartDate, newendDate]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.category?.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
            // (product.areaName?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            // (product.retailerName?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            // (product.retailerCode?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            // (product.salesPerson?.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    // const totalQty = filteredProducts.reduce((total, product) => {
    //     return total + product.totalProductQty;
    // }, 0);
    // const totalValue = filteredProducts.reduce((total, product) => {
    //     return total + product.totalProductValue;
    // }, 0);
    // const totalPayment = filteredProducts.reduce((total, product) => {
    //     return total + product.totalPayment;
    // }, 0);
    // const totalCommission = filteredProducts.reduce((total, product) => {
    //     return total + product.totalCommission;
    // }, 0);
    // const totalBalance = filteredProducts.reduce((total, product) => {
    //     return total + product.totalProductValue - product.totalPayment - product.totalCommission;
    // }, 0);
    // const categoryTotals = filteredProducts.reduce((acc, product) => {
    //     const balance = product.totalProductValue - product.totalPayment - product.totalCommission;
    //     if (!acc[product.category]) {
    //         acc[product.category] = { balance: 0 };
    //     }
    //     acc[product.category].balance += balance;
    //     return acc;
    // }, {} as Record<string, { balance: number }>);

    // const groupedByCategory = filteredProducts.reduce((acc, product) => {
    //     if (!acc[product.category]) acc[product.category] = [];
    //     acc[product.category].push(product);
    //     return acc;
    // }, {} as Record<string, Product[]>);
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
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4">
                <div className="flex w-full justify-between pl-5 pr-5 pt-1 items-center">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                    <div className="flex gap-2">
                        <ExcelExport tableRef={contentToPrint} fileName="datewise_retail_report" />
                        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                    </div>
                </div>
                <div className="flex w-full justify-center">
                    <div className="overflow-x-auto">
                        {/* <div className="flex justify-end p-5">
                            <button
                                onClick={() => setShowDetails(prev => !prev)}
                                className="btn btn-sm btn-info mb-2"
                            >
                                {showDetails ? "Hide Details" : "Show Details"}
                            </button>
                        </div> */}
                        <div ref={contentToPrint} className="flex-1 p-5">
                            <div className="flex flex-col items-center pb-5"><h4 className="font-bold">MARKET LEDGER</h4>
                                <h4>FROM {newstartDate} TO {newendDate}</h4>
                            </div>
                            {/* <table className="table table-xs md:table-sm table-pin-rows table-zebra">
                                <thead className="sticky top-16 bg-base-100">
                                    <tr>
                                        <th>SN</th>
                                        <th>CATEGORY</th>
                                        <th>AREA NAME</th>
                                        <th>RETAILER NAME</th>
                                        <th>CODE</th>
                                        <th>SALE PERSON</th>
                                        <th>QTY</th>
                                        <th>VALUE</th>
                                        <th>PAYMENT</th>
                                        <th>COMMISSION</th>
                                        <th>ACHIEVED</th>
                                        <th>BALANCE</th>
                                        <th>DETAILS</th>
                                        <th>SUMMARY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(groupedByCategory).map(([category, products]) => {
                                        return products.map((product, idx) => (
                                            <tr key={`${category}-${idx}`}>
                                                <td>{idx + 1}</td>
                                                <td className="uppercase">{product?.category}</td>
                                                <td className="uppercase">{product?.areaName}</td>
                                                <td className="uppercase">{product?.retailerName}</td>
                                                <td className="uppercase">{product?.retailerCode}</td>
                                                <td className="uppercase">{product?.salesPerson}</td>
                                                <td>{Number(product?.totalProductQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number(product?.totalProductValue.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number(product?.totalPayment.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number(product?.totalCommission.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number((product?.totalPayment * 100 / product?.totalProductValue).toFixed(2)).toLocaleString('en-IN')} %</td>
                                                <td>{Number((product?.totalProductValue - product?.totalPayment - product?.totalCommission).toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>
                                                    <button onClick={() => handleDetails(product?.retailerName)} className="btn btn-xs btn-info">Details</button>
                                                </td>
                                                {idx === 0 && (
                                                    <td rowSpan={products.length} className="bg-base-200 text-center">
                                                        <div className="border border-slate-700">
                                                            <div className="font-bold">{category}</div>
                                                            <div>
                                                                Total Due: {Number(categoryTotals[category]?.balance.toFixed(2)).toLocaleString('en-IN')}
                                                            </div>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ));
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={5}></td>
                                        <td>TOTAL</td>
                                        <td>{totalQty.toLocaleString('en-IN')}</td>
                                        <td>{totalValue.toLocaleString('en-IN')}</td>
                                        <td>{totalPayment.toLocaleString('en-IN')}</td>
                                        <td>{totalCommission.toLocaleString('en-IN')}</td>
                                        <td></td>
                                        <td>{totalBalance.toLocaleString('en-IN')}</td>
                                    </tr>
                                </tfoot>
                            </table> */}

                            {/* <table className="table table-xs md:table-sm table-pin-rows table-zebra">
                                <thead className="sticky top-16 bg-base-100">
                                    {showDetails ? (
                                        <tr>
                                            <th>SN</th>
                                            <th>CATEGORY</th>
                                            <th>AREA NAME</th>
                                            <th>RETAILER NAME</th>
                                            <th>CODE</th>
                                            <th>SALE PERSON</th>
                                            <th>QTY</th>
                                            <th>VALUE</th>
                                            <th>PAYMENT</th>
                                            <th>COMMISSION</th>
                                            <th>ACHIEVED</th>
                                            <th>BALANCE</th>
                                            <th>DETAILS</th>
                                            <th>SUMMARY</th>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <th>CATEGORY</th>
                                            <th className="text-center">TOTAL BALANCE</th>
                                        </tr>
                                    )}
                                </thead>

                                <tbody>
                                    {Object.entries(groupedByCategory).map(([category, products]) => {
                                        const balance = Number(categoryTotals[category]?.balance.toFixed(2)).toLocaleString('en-IN');

                                        if (!showDetails) {
                                            // SUMMARY MODE
                                            return (
                                                <tr key={category} className="bg-base-200 font-bold">
                                                    <td className="uppercase">{category}</td>
                                                    <td className="text-center">{balance}</td>
                                                </tr>
                                            );
                                        }

                                        // DETAILS MODE
                                        return products.map((product, idx) => (
                                            <tr key={`${category}-${idx}`}>
                                                <td>{idx + 1}</td>
                                                <td className="uppercase">{product?.category}</td>
                                                <td className="uppercase">{product?.areaName}</td>
                                                <td className="uppercase">{product?.retailerName}</td>
                                                <td className="uppercase">{product?.retailerCode}</td>
                                                <td className="uppercase">{product?.salesPerson}</td>
                                                <td>{Number(product?.totalProductQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number(product?.totalProductValue.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number(product?.totalPayment.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number(product?.totalCommission.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number((product?.totalPayment * 100 / product?.totalProductValue).toFixed(2)).toLocaleString('en-IN')} %</td>
                                                <td>{Number((product?.totalProductValue - product?.totalPayment - product?.totalCommission).toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>
                                                    <button onClick={() => handleDetails(product?.retailerName)} className="btn btn-xs btn-success">
                                                        Details
                                                    </button>
                                                </td>
                                                {idx === 0 && (
                                                    <td rowSpan={products.length} className="bg-base-200 text-center">
                                                        <div className="font-bold">{category}</div>
                                                        <div>Total Due: {balance}</div>
                                                    </td>
                                                )}
                                            </tr>
                                        ));
                                    })}
                                </tbody>
                                <tfoot>
                                    {showDetails ? (
                                        <tr className="font-semibold text-lg">
                                            <td colSpan={5}></td>
                                            <td>TOTAL</td>
                                            <td>{totalQty.toLocaleString('en-IN')}</td>
                                            <td>{totalValue.toLocaleString('en-IN')}</td>
                                            <td>{totalPayment.toLocaleString('en-IN')}</td>
                                            <td>{totalCommission.toLocaleString('en-IN')}</td>
                                            <td></td>
                                            <td>{totalBalance.toLocaleString('en-IN')}</td>
                                            <td colSpan={2}></td>
                                        </tr>
                                    ) : (
                                        <tr className="font-semibold text-lg bg-base-200">
                                            <td className="text-right">TOTAL BALANCE</td>
                                            <td className="text-center">{totalBalance.toLocaleString('en-IN')}</td>
                                        </tr>
                                    )}
                                </tfoot>
                            </table> */}
                            <table className="table table-md table-pin-rows table-zebra">
                                <thead className="sticky top-16 bg-base-100">
                                    {/* 
                   */}
                                    <tr>
                                        <th>SN</th>
                                        <th>PARTICULARS</th>
                                        <th>OPENING BALANCE</th>
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
                                        <td colSpan={2}></td>
                                        <td>TOTAL</td>
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