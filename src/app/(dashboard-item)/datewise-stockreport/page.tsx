// 'use client'
// import React, { useState, useEffect, useRef } from "react";
// import { useAppSelector } from "@/app/store";
// import { FcPrint } from "react-icons/fc";
// import { useReactToPrint } from 'react-to-print';
// import ExcelExport from "@/app/components/ExcellGeneration";
// import { useSearchParams } from "next/navigation";

// type Product = {
//     warehouse: string;
//     productName: string;
//     costPrice: number;
//     remainingQty: number;
// };


// const Page = () => {
//     const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//     const uname = useAppSelector((state) => state.username.username);
//     const username = uname ? uname.username : 'Guest';
//     const searchParams = useSearchParams();
//     const date = searchParams.get('date');
//     const contentToPrint = useRef(null);
//     const handlePrint = useReactToPrint({
//         content: () => contentToPrint.current,
//     });
//     const [filterCriteria, setFilterCriteria] = useState('');
//     const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//     const [allProducts, setAllProducts] = useState<Product[]>([]);

//     useEffect(() => {
//         fetch(`${apiBaseUrl}/api/getDatewiseProductStock?username=${encodeURIComponent(username)}&date=${date}`)
//             .then(response => response.json())
//             .then(data => {
//                 setAllProducts(data);
//                 setFilteredProducts(data);
//             })
//             .catch(error => console.error('Error fetching products:', error));
//     }, [apiBaseUrl, username, date]);


//     useEffect(() => {
//         const filtered = allProducts.filter(product =>
//             (product.warehouse?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
//             (product.productName.toLowerCase().includes(filterCriteria.toLowerCase()) || '')

//         );
//         setFilteredProducts(filtered);
//     }, [filterCriteria, allProducts]);

//     const handleFilterChange = (e: any) => {
//         setFilterCriteria(e.target.value);
//     };
//     const totalValue = filteredProducts.reduce((total, product) => {
//         return total + product.costPrice * product.remainingQty;
//     }, 0);

//     const totalQty = filteredProducts.reduce((total, product) => {
//         return total + product.remainingQty;
//     }, 0);

//     const groupedByWarehouse = filteredProducts.reduce((acc, product) => {
//         if (!acc[product.warehouse]) acc[product.warehouse] = [];
//         acc[product.warehouse].push(product);
//         return acc;
//     }, {} as Record<string, Product[]>);

//     return (
//         <div className="container-2xl">
//             <div className="flex w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
//                 <div className="flex flex-col w-full">
//                     <div className="flex justify-between pl-5 pr-5 pt-1">
//                         <label className="input input-bordered flex max-w-xs  items-center gap-2">
//                             <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//                                 <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
//                             </svg>
//                         </label>
//                         <div className="flex gap-2">
//                             <ExcelExport tableRef={contentToPrint} fileName="stock_report" />
//                             <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
//                         </div>
//                     </div>
//                     <div className="flex w-full justify-center p-5">
//                         <div className="overflow-x-auto">
//                             <div ref={contentToPrint} className="flex-1 p-5">
//                                 <div className="flex flex-col items-center pb-5"><h4 className="font-bold">PRODUCT STOCK</h4>
//                                     <h4>{date}</h4>
//                                 </div>
//                                 <table className="table table-zebra table-xs md:table-sm table-pin-rows">
//                                     <thead className="sticky top-16 bg-base-100">
//                                         <tr>
//                                             <th>SN</th>
//                                             <th>WAREHOUSE</th>
//                                             <th>PRODUCT</th>
//                                             <th>COST PRICE</th>
//                                             <th>QUANTITY</th>
//                                             <th>SUB TOTAL</th>
//                                             <th>SUMMARY</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {Object.entries(groupedByWarehouse).map(([warehouse, products]) => {
//                                             const warehouseTotalValue = products.reduce((sum, p) => sum + (p.costPrice * p.remainingQty), 0);
//                                             const warehouseTotalQty = products.reduce((sum, p) => sum + p.remainingQty, 0);

//                                             return products.map((product, idx) => (
//                                                 <tr key={`${warehouse}-${idx}`}>
//                                                     <td>{idx + 1}</td>
//                                                     <td className="capitalize">{product?.warehouse}</td>
//                                                     <td className="capitalize">{product.productName}</td>
//                                                     <td>{Number(product.costPrice.toFixed(2)).toLocaleString('en-IN')}</td>
//                                                     <td>{product.remainingQty.toLocaleString('en-IN')}</td>
//                                                     <td>{Number((product.costPrice * product.remainingQty).toFixed(2)).toLocaleString('en-IN')}</td>

//                                                     {/* Show total column only on the first row of this warehouse */}
//                                                     {idx === 0 && (
//                                                         <td rowSpan={products.length} className="bg-base-200 text-center">
//                                                             <div className="border border-slate-700 p-1">
//                                                                 <div className="font-bold">{warehouse}</div>
//                                                                 <div>Total Qty: {warehouseTotalQty.toLocaleString('en-IN')}</div>
//                                                                 <div>Total Value: {Number(warehouseTotalValue.toFixed(2)).toLocaleString('en-IN')}</div>
//                                                             </div>
//                                                         </td>
//                                                     )}
//                                                 </tr>
//                                             ));
//                                         })}
//                                     </tbody>


//                                     <tfoot>
//                                         <tr className="font-semibold text-lg">
//                                             <td colSpan={3}></td>
//                                             <td>TOTAL</td>
//                                             <td>{totalQty.toLocaleString('en-IN')}</td>
//                                             <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
//                                         </tr>
//                                     </tfoot>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Page



'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import ExcelExport from "@/app/components/ExcellGeneration";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { IoSearch } from "react-icons/io5";

type Product = {
    warehouse: string;
    productName: string;
    previousQty: number;
    todayEntryQty: number;
    todaySaleQty: number;
    presentQty: number;
    costPrice: number;
    totalValue: number;

};


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const router = useRouter();
    const [maxDate, setMaxDate] = useState('');
    const searchParams = useSearchParams();
    const targetDate = searchParams.get('date');
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
    }, []);

    const [date, setStartDate] = useState("");
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!date) {
            toast.warning("Start date and end date required !");
            return;
        }
        // Use the dynamic routePath for navigation
        router.push(`/datewise-stockreport?date=${date}`);
        setStartDate("");

    };
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/daily-stock-report?username=${encodeURIComponent(username)}&date=${targetDate}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, targetDate]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.warehouse?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.productName.toLowerCase().includes(filterCriteria.toLowerCase()) || '')

        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
    const totalPrevious = filteredProducts.reduce((total, product) => {
        return total + product?.previousQty;
    }, 0);

    const totalTodayEntry = filteredProducts.reduce((total, product) => {
        return total + product?.todayEntryQty;
    }, 0);

    const totalTodaySale = filteredProducts.reduce((total, product) => {
        return total + product?.todaySaleQty;
    }, 0);

    const totalPrestntQty = filteredProducts.reduce((total, product) => {
        return total + product?.presentQty;
    }, 0);

    const totalCost = filteredProducts.reduce((total, product) => {
        return total + product?.costPrice;
    }, 0);

    const totalTotal = filteredProducts.reduce((total, product) => {
        return total + product?.totalValue;
    }, 0);


    return (
        <div className="container-2xl">
            <div className="flex w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
                <div className="flex flex-col p-5 gap-4  w-full">
                    <div className='flex flex-col md:flex-row w-full items-center justify-center gap-3'>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">SELECT DATE</span>
                            </div>
                            <input
                                type="date"
                                name="date"
                                onChange={(e: any) => setStartDate(e.target.value)}
                                max={maxDate}
                                value={date}
                                className="input input-bordered"
                            />
                        </label>

                        <label className="w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">SEARCH</span>
                            </div>
                            <button onClick={handleSubmit} className='btn btn-success'><IoSearch size={30} /></button>
                        </label>

                    </div>
                    <div className="flex justify-between pl-5 pr-5 pt-1">
                        <label className="input input-bordered flex max-w-xs  items-center gap-2">
                            <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                                <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                            </svg>
                        </label>
                        <div className="flex gap-2">
                            <ExcelExport tableRef={contentToPrint} fileName="stock_report" />
                            <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                        </div>
                    </div>
                    <div className="flex w-full justify-center p-5">
                        <div className="overflow-x-auto">
                            <div ref={contentToPrint} className="flex-1 p-5">
                                <div className="flex flex-col items-center pb-5"><h4 className="font-bold">PRODUCT STOCK</h4>
                                    <h4>{targetDate}</h4>
                                </div>
                                <table className="table table-zebra table-xs md:table-sm table-pin-rows">

                                    <thead className="sticky top-16 bg-base-100">
                                        <tr>
                                            <th>SN</th>
                                            <th>WAREHOUSE</th>
                                            <th>PRODUCT</th>
                                            <th>OPENING</th>
                                            <th>ENTRY</th>
                                            <th>SOLD</th>
                                            <th>PURCHASE RATE</th>
                                            <th>CLOSING</th>
                                            <th>VALUE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts?.map((product, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className="uppercase">{product.warehouse}</td>
                                                <td className="uppercase">{product.productName}</td>
                                                <td>{Number(product?.previousQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number(product?.todayEntryQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number(product?.todaySaleQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number(product?.presentQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number(product?.costPrice.toFixed(2)).toLocaleString('en-IN')}</td>
                                                <td>{Number(product?.totalValue.toFixed(2)).toLocaleString('en-IN')}</td>

                                            </tr>
                                        ))}
                                    </tbody>

                                    <tfoot>
                                        <tr className="font-semibold text-lg">
                                            <td colSpan={2}></td>
                                            <td>TOTAL</td>
                                            <td>{Number(totalPrevious?.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(totalTodayEntry?.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(totalTodaySale?.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(totalPrestntQty?.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(totalCost?.toFixed(2)).toLocaleString('en-IN')}</td>
                                            <td>{Number(totalTotal?.toFixed(2)).toLocaleString('en-IN')}</td>
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