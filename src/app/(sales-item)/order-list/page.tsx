'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import Print from "@/app/components/Print";
import CurrentDate from "@/app/components/CurrentDate";

type Product = {
    date: string;
    retailer: string;
    orderNote: string;
    productName: string;
    saleRate: number;
    orderQty: number;
    deliveredQty: number;
};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const contentToPrint = useRef<HTMLDivElement>(null);

    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);


    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getPendingOrder?username=${encodeURIComponent(username)}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.retailer.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.date.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.productName.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.orderNote.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    const totalQty = filteredProducts.reduce((acc, item) => acc + item.orderQty, 0);
    const totalDeliQty = filteredProducts.reduce((acc, item) => acc + item.deliveredQty, 0);
    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] items-center justify-center p-4">

                <div className="flex w-full justify-between pl-5 pr-5 pt-1">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                    <Print contentRef={contentToPrint} />
                </div>
                <div className="flex w-full justify-center">
                    <div className="overflow-x-auto">
                        <div ref={contentToPrint} className="flex-1 p-5">
                            <div className="flex flex-col items-center pb-5"><h4 className="font-bold">ORDER REPORT</h4><CurrentDate /></div>
                            <table className="table table-xs md:table-sm table-pin-rows">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>ORDER DATE</th>
                                        <th>RETAILER</th>
                                        <th>PRODUCT NAME</th>
                                        <th>ORDER NOTE</th>
                                        <th>SALE PRICE</th>
                                        <th>ORDER QTY</th>
                                        <th>DELIVERED QTY</th>
                                        <th>PENDING QTY</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts?.map((product, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{product.date}</td>
                                            <td className="capitalize">{product.retailer}</td>
                                            <td className="capitalize">{product.productName}</td>
                                            <td className="uppercase">{product.orderNote}</td>
                                            <td>{Number(product.saleRate.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(product.orderQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number((product.deliveredQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number((product.orderQty - product.deliveredQty).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={5}></td>
                                        <td>TOTAL</td>
                                        <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number(totalDeliQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number((totalQty - totalDeliQty).toFixed(2)).toLocaleString('en-IN')}</td>
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