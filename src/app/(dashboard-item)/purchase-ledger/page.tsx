'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { MdOutlineEditNote } from "react-icons/md";
import { useReactToPrint } from 'react-to-print';
import CurrentMonthYear from "@/app/components/CurrentMonthYear";
import DateToDate from "@/app/components/DateToDate";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Product = {
    date: string;
    supplier: string;
    productName: string;
    status: string;
    dpRate: number;
    purchasePrice: number;
    costPrice: number;
    productQty: number;
    remainingQty: number;
    productId: number;

};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const router = useRouter();

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
        fetch(`${apiBaseUrl}/api/getAllProduct?username=${encodeURIComponent(username)}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    useEffect(() => {
        const searchWords = filterCriteria.toLowerCase().split(" ");
        const filtered = allProducts.filter(product =>
            searchWords.every(word =>
                (product.date?.toLowerCase().includes(word) || '') ||
                (product.productName?.toLowerCase().includes(word) || '') ||
                (product.supplier?.toLowerCase().includes(word) || '')
            )
        );

        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.productQty;
    }, 0);

    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] items-center justify-center p-4">
                <div className="flex p-5"><DateToDate routePath="/datewise-purchase-ledger" /></div>
                <div className="flex w-full justify-between pl-5 pr-5 pt-1">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
                <div className="flex w-full justify-center">
                    <div className="overflow-x-auto">
                        <div ref={contentToPrint} className="flex-1 p-5">
                            <div className="flex flex-col items-center pb-5"><h4 className="font-bold">PURCHASE LEDGER</h4><CurrentMonthYear /></div>
                            <table className="table table-xs md:table-sm table-pin-rows">
                                <thead className="sticky top-16 bg-base-100">
                                    <tr>
                                        <th>SN</th>
                                        <th>DATE</th>
                                        <th>SUPPLIER NAME</th>
                                        <th>PRODUCT</th>
                                        <th>P.PRICE</th>
                                        <th>AV.PRICE</th>
                                        <th>STATUS</th>
                                        <th>ENTRY QTY</th>
                                        <th>TOTAL QTY</th>
                                        <th>EDIT</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts?.map((product, index) => (
                                        <tr key={index} className="capitalize">
                                            <td>{index + 1}</td>
                                            <td>{product?.date}</td>
                                            <td>{product?.supplier}</td>
                                            <td>{product?.productName}</td>
                                            <td>{Number(product?.purchasePrice?.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(product?.costPrice?.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{product?.status}</td>
                                            <td>{Number(product?.productQty?.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(product?.remainingQty?.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td><button onClick={() => handleEdit(product.productId)} className="btn btn-primary btn-sm"><MdOutlineEditNote size={24} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={6}></td>
                                        <td>TOTAL</td>
                                        <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
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