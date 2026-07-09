'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useRouter, useSearchParams } from "next/navigation";
import ExcelExport from "@/app/components/ExcellGeneration";
import { MdOutlineEditNote } from "react-icons/md";
import { toast } from "react-toastify";

type Product = {
    date: string;
    category: string;
    warehouse: string;
    productName: string;
    status: string;
    dpRate: number;
    purchasePrice: number;
    productQty: number;
    remainingQty: number;
};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const router = useRouter();
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

    const handleEdit = (productId: number) => {
        if (!productId) {
            toast.warning("Product id is required !");
            return;
        }
        router.push(`/purchase-edit?productId=${encodeURIComponent(productId)}`);

    };
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getDatewiseStockLedger?username=${encodeURIComponent(username)}&startDate=${startDate}&endDate=${endDate}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, startDate, endDate]);

    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.warehouse?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.category?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.productName?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.date?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.status?.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.productQty;
    }, 0);
    const totalRemainingQty = filteredProducts.reduce((total, product) => {
        return total + product.remainingQty;
    }, 0);
    const totalPurchaseQty = filteredProducts.reduce(
        (sum, product) =>
            product.status === "stored"
                ? sum + Number(product.productQty)
                : sum,
        0
    );

    const totalSoldQty = filteredProducts.reduce(
        (sum, product) =>
            product.status === "sold"
                ? sum + Number(product.productQty)
                : sum,
        0
    );
    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4">

                <div className="flex w-full justify-between pl-5 pr-5 pt-1">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                    <div className="flex gap-2">
                        <ExcelExport tableRef={contentToPrint} fileName="datewise_stock_report" />
                        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                    </div>
                </div>
                <div className="flex w-full justify-center">
                    <div className="overflow-x-auto">
                        <div ref={contentToPrint} className="flex-1 p-5">
                            <div className="flex justify-center">
                                <img src="/img/crowncement-logo.png" alt="Logo" className="m-4" />
                            </div>
                            <div className="flex w-full justify-center items-center">
                                <img src="/img/logo.png" alt="Logo" className="w-16 h-20 mr-3" />
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold">P.R CEMENT CENTER</h2>
                                    <p className="text-sm">Char Sayedpur, Narayanganj - 1400</p>
                                    <p className="text-sm">Phone: 01675-336060 | Email: prcementcenter@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center pb-5"><h4 className="font-bold">STOCK LEDGER</h4>Date: {startDate} TO {endDate}</div>
                            <table className="table table-xs md:table-sm table-pin-rows table-zebra">
                                <thead className="sticky top-16 bg-base-100">

                                    <tr>
                                        <th>SN</th>
                                        <th>DATE</th>
                                        <th>WAREHOUSE</th>
                                        <th>CATEGORY</th>
                                        <th>PRODUCT</th>
                                        <th>STATUS</th>
                                        <th>PURCHASE</th>
                                        <th>SOLD</th>
                                        <th>RATE</th>
                                        <th>REMAINING</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{product.date}</td>
                                            <td>{product.warehouse}</td>
                                            <td>{product.category}</td>
                                            <td>{product.productName}</td>
                                            <td className="capitalize">{product.status}</td>
                                            <td>
                                                {product.status === "stored"
                                                    ? Number(product.productQty).toLocaleString("en-IN")
                                                    : 0}
                                            </td>

                                            <td>
                                                {product.status === "sold"
                                                    ? Number(product.productQty).toLocaleString("en-IN")
                                                    : 0}
                                            </td>
                                            <td>
                                                {Number(
                                                    product.status === "sold"
                                                        ? product.dpRate
                                                        : product.purchasePrice
                                                ).toLocaleString("en-IN")}
                                            </td>
                                            <td>{Number(product.remainingQty).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={5}></td>
                                        <td>TOTAL</td>
                                        <td>{Number(totalPurchaseQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number(totalSoldQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td></td>
                                        <td>{Number(totalRemainingQty.toFixed(2)).toLocaleString('en-IN')}</td>
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