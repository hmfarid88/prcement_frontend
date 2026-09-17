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
import ExcelExport from "@/app/components/ExcellGeneration";

type Product = {
    date: string;
    warehouse: string;
    category: string;
    productName: string;
    openingQty: number;
    storedQty: number;
    soldQty: number;
    closingQty: number;
    costPrice: number;
};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getCurrentMonthStockLedger?username=${encodeURIComponent(username)}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    // useEffect(() => {
    //     const filtered = allProducts.filter(product =>
    //         (product.warehouse?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
    //         (product.category?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
    //         (product.productName?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
    //         (product.date?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
    //         (product.status?.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
    //     );
    //     setFilteredProducts(filtered);
    // }, [filterCriteria, allProducts]);

    useEffect(() => {
        const searchText = filterCriteria.toLowerCase().trim();
        let filtered = allProducts;
        if (searchText) {
          // If exact customer match
          const exactMatch = allProducts.filter(
            product => product.category?.toLowerCase() === searchText
          );
          if (exactMatch.length > 0) {
            filtered = exactMatch;
          } else {
            // Build one string containing outlet + product details
            filtered = allProducts.filter(product => {
              const combinedText = [
                product.category,
                product.productName,
                product.warehouse,
                product.date,
             
              ]
                .map(f => f?.toLowerCase() || "")
                .join(" ");

              return combinedText.includes(searchText);
            });
          }
        }
        setFilteredProducts(filtered);
      }, [filterCriteria, allProducts]);

    // useEffect(() => {
    //     const searchText = filterCriteria.toLowerCase().trim();

    //     if (!searchText) {
    //         setFilteredProducts(allProducts);
    //         return;
    //     }

    //     const searchWords = searchText.split(/\s+/);

    //     const filtered = allProducts.filter(product => {
    //         const combinedText = [
    //             product.warehouse,
    //             product.category,
    //             product.productName,
    //             product.date,

    //         ]
    //             .map(value => String(value ?? "").toLowerCase())
    //             .join(" ");

    //         // Every search word must exist somewhere
    //         return searchWords.every(word =>
    //             combinedText.includes(word)
    //         );
    //     });

    //     setFilteredProducts(filtered);

    // }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    const openingQty = filteredProducts.reduce((total, product) => {
        return total + product.openingQty;
    }, 0);

    const storedQty = filteredProducts.reduce((total, product) => {
        return total + product.storedQty;
    }, 0);

    const soldQty = filteredProducts.reduce((total, product) => {
        return total + product.soldQty;
    }, 0);

    const closingQty = filteredProducts.reduce((total, product) => {
        return total + product.closingQty;
    }, 0);


    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] items-center justify-center p-4">
                <div className="flex p-5"><DateToDate routePath="/datewise-stock-ledger" /></div>
                <div className="flex w-full justify-between pl-5 pr-5 pt-1">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                    <div className="flex gap-2">
                        <ExcelExport tableRef={contentToPrint} fileName="stock_ledger" />
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
                            <div className="flex flex-col items-center pb-5"><h4 className="font-bold">STOCK LEDGER</h4><CurrentMonthYear /></div>
                            <table className="table table-xs md:table-sm table-pin-rows table-zebra">
                                <thead className="sticky top-16 bg-base-100">
                                    <tr>
                                        <th>SN</th>
                                        <th>DATE</th>
                                        <th>WAREHOUSE</th>
                                        <th>CATEGORY</th>
                                        <th>PRODUCT</th>
                                        <th>OPENING</th>
                                        <th>STORED</th>
                                        <th>SOLD</th>
                                        <th>CLOSING</th>
                                        <th>RATE</th>
                                        <th>EDIT</th>
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
                                            <td>{Number(product.openingQty).toLocaleString('en-IN')}</td>
                                            <td>{Number(product.storedQty).toLocaleString('en-IN')}</td>
                                            <td>{Number(product.soldQty).toLocaleString('en-IN')}</td>
                                            <td>{Number(product.closingQty).toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="font-semibold text-lg">
                                        <td colSpan={4}></td>
                                        <td>TOTAL</td>
                                        <td>{Number(openingQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number(storedQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number(soldQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number(closingQty.toFixed(2)).toLocaleString('en-IN')}</td>
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