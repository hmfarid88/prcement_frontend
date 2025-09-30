// 'use client'
// import React, { useState, useEffect, useRef } from "react";
// import { FcPrint } from "react-icons/fc";
// import { useReactToPrint } from 'react-to-print';
// import { useSearchParams } from "next/navigation";
// import CurrentDate from "@/app/components/CurrentDate";
// import ExcelExport from "@/app/components/ExcellGeneration";

// type Product = {
//     date: string;
//     note: string;
//     productName: string;
//     productQty: number;
//     dpRate: number;
//     productValue: number;
//     payment: number;
//     commission: number;

// };


// const Page = () => {

//     const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//     const searchParams = useSearchParams();
//     const retailerName = searchParams.get('retailerName');
//     const username = searchParams.get('username');

//     const contentToPrint = useRef(null);
//     const handlePrint = useReactToPrint({
//         content: () => contentToPrint.current,
//     });
//     const [filterCriteria, setFilterCriteria] = useState('');
//     const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//     const [allProducts, setAllProducts] = useState<Product[]>([]);


//     useEffect(() => {
//         fetch(`${apiBaseUrl}/retailer/retailer-details?retailerName=${encodeURIComponent(retailerName ?? "")}&username=${encodeURIComponent(username ?? "")}`)
//             .then(response => response.json())
//             .then(data => {
//                 setAllProducts(data);
//                 setFilteredProducts(data);
//             })
//             .catch(error => console.error('Error fetching products:', error));
//     }, [apiBaseUrl, username, retailerName]);

// useEffect(() => {
//                 const searchWords = filterCriteria.toLowerCase().split(" ");
//                 const filtered = allProducts.filter(product =>
//                   searchWords.every(word =>
//                     (product.date?.toLowerCase().includes(word) || '') ||
//                     (product.note?.toLowerCase().includes(word) || '') ||
//                     (product.productName?.toLowerCase().includes(word) || '')

//                )
//                 );

//                 setFilteredProducts(filtered);
//               }, [filterCriteria, allProducts]);

//     const handleFilterChange = (e: any) => {
//         setFilterCriteria(e.target.value);
//     };
//     const totalQty = filteredProducts.reduce((acc, item) => acc + item.productQty, 0);
//     const totalValue = filteredProducts.reduce((acc, item) => acc + item.productValue, 0);
//     const totalPayment = filteredProducts.reduce((acc, item) => acc + item.payment, 0);
//     const totalComm = filteredProducts.reduce((acc, item) => acc + item.commission, 0);
//     let cumulativeBalance = 0;
//     return (
//         <div className="container-2xl">
//             <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
//                 <div className="flex w-full justify-between pl-5 pr-5 pt-1">
//                     <label className="input input-bordered flex max-w-xs  items-center gap-2">
//                         <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//                             <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
//                         </svg>
//                     </label>
//                    <div className="flex gap-2">
//                     <ExcelExport tableRef={contentToPrint} fileName="datewise_retailer_ledger" />
//                     <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
//                     </div>
//                 </div>
//                 <div className="flex w-full justify-center">
//                     <div className="overflow-x-auto">
//                         <div ref={contentToPrint} className="flex-1 p-5">
//                             <div className="flex flex-col items-center pb-5"><h4 className="font-bold">RETAILER LEDGER</h4>
//                                 <h4 className="font-bold capitalize">Retailer : {retailerName}</h4>
//                                 <h4><CurrentDate /></h4>
//                             </div>
//                             <table className="table table-xs md:table-sm table-pin-rows table-zebra">
//                                <thead className="sticky top-16 bg-base-100">
//                                     <tr>
//                                         <th>SN</th>
//                                         <th>DATE</th>
//                                         <th>NOTE</th>
//                                         <th>PRODUCT</th>
//                                         <th>QTY</th>
//                                         <th>RATE</th>
//                                         <th>TOTAL VALUE</th>
//                                         <th>PAYMENT</th>
//                                         <th>COMMISSION</th>
//                                         <th>BALANCE</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredProducts?.map((product, index) => {
//                                         const currentBalance = product.productValue - product.payment - product.commission;
//                                         cumulativeBalance += currentBalance;

//                                         return (
//                                             <tr key={index}>
//                                                 <td>{index + 1}</td>
//                                                 <td>{product?.date}</td>
//                                                 <td className="capitalize">{product?.note}</td>
//                                                 <td>{product?.productName}</td>
//                                                 <td>{Number(product?.productQty.toFixed(2)).toLocaleString('en-IN')}</td>
//                                                 <td>{Number(product?.dpRate.toFixed(2)).toLocaleString('en-IN')}</td>
//                                                 <td>{Number(product?.productValue.toFixed(2)).toLocaleString('en-IN')}</td>
//                                                 <td>{Number(product?.payment.toFixed(2)).toLocaleString('en-IN')}</td>
//                                                 <td>{Number(product?.commission.toFixed(2)).toLocaleString('en-IN')}</td>
//                                                 <td>{Number(cumulativeBalance.toFixed(2)).toLocaleString('en-IN')}</td>

//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
//                                 <tfoot>
//                                     <tr className="font-semibold text-lg">
//                                         <td colSpan={4}></td>
//                                         <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
//                                         <td></td>
//                                         <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
//                                         <td>{Number(totalPayment.toFixed(2)).toLocaleString('en-IN')}</td>
//                                         <td>{Number(totalComm.toFixed(2)).toLocaleString('en-IN')}</td>
//                                     </tr>
//                                 </tfoot>
//                             </table>
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
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useSearchParams } from "next/navigation";
import CurrentDate from "@/app/components/CurrentDate";
import ExcelExport from "@/app/components/ExcellGeneration";

type Product = {
  date: string;
  note: string;
  productName: string;
  productQty: number;
  dpRate: number;
  productValue: number;
  payment: number;
  commission: number;
  balance: number;
};

const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const searchParams = useSearchParams();
  const retailerName = searchParams.get('retailerName');
  const username = searchParams.get('username');

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });

  // ✅ Pagination states
  const [page, setPage] = useState(0);
  const [size] = useState(30); // rows per page
  const [totalPages, setTotalPages] = useState(0);

  const [filterCriteria, setFilterCriteria] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // ✅ Fetch paginated data
  useEffect(() => {
    fetch(
      `${apiBaseUrl}/retailer/retailer-details?retailerName=${encodeURIComponent(retailerName ?? "")}&username=${encodeURIComponent(username ?? "")}&page=${page}&size=${size}`
    )
      .then(response => response.json())
      .then(data => {
        setAllProducts(data.content || []);
        setFilteredProducts(data.content || []);
        setTotalPages(data.totalPages || 0);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username, retailerName, page, size]);

  // ✅ Search filter
  useEffect(() => {
    const searchWords = filterCriteria.toLowerCase().split(" ");
    const filtered = allProducts.filter(product =>
      searchWords.every(word =>
        (product.date?.toLowerCase().includes(word) || '') ||
        (product.note?.toLowerCase().includes(word) || '') ||
        (product.productName?.toLowerCase().includes(word) || '')
      )
    );
    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);

  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };

  // ✅ Totals
  const totalQty = filteredProducts.reduce((acc, item) => acc + item.productQty, 0);
  const totalValue = filteredProducts.reduce((acc, item) => acc + item.productValue, 0);
  const totalPayment = filteredProducts.reduce((acc, item) => acc + item.payment, 0);
  const totalComm = filteredProducts.reduce((acc, item) => acc + item.commission, 0);

 
  return (
    <div className="container-2xl">
      <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
        {/* 🔍 Search + Export + Print */}
        <div className="flex w-full justify-between pl-5 pr-5 pt-1">
          <label className="input input-bordered flex max-w-xs items-center gap-2">
            <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>
          <div className="flex gap-2">
            <ExcelExport tableRef={contentToPrint} fileName="datewise_retailer_ledger" />
            <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
          </div>
        </div>

        {/* 📊 Table */}
        <div className="flex w-full justify-center">
          <div className="overflow-x-auto">
            <div ref={contentToPrint} className="flex-1 p-5">
              <div className="flex flex-col items-center pb-5">
                <h4 className="font-bold">RETAILER LEDGER</h4>
                <h4 className="font-bold capitalize">Retailer : {retailerName}</h4>
                <h4><CurrentDate /></h4>
              </div>

              <table className="table table-xs md:table-sm table-pin-rows table-zebra">
                <thead className="sticky top-16 bg-base-100">
                  <tr>
                    <th>SN</th>
                    <th>DATE</th>
                    <th>NOTE</th>
                    <th>PRODUCT</th>
                    <th>QTY</th>
                    <th>RATE</th>
                    <th>TOTAL VALUE</th>
                    <th>PAYMENT</th>
                    <th>COMMISSION</th>
                    <th>BALANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts?.map((product, index) => (
                    <tr key={index}>
                      <td>{page * size + index + 1}</td>
                      <td>{product?.date}</td>
                      <td className="capitalize">{product?.note}</td>
                      <td>{product?.productName}</td>
                      <td>{Number(product?.productQty.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(product?.dpRate.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(product?.productValue.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(product?.payment.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(product?.commission.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(product?.balance.toFixed(2)).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}

                </tbody>
                <tfoot>
                  <tr className="font-semibold text-lg">
                    <td colSpan={4}></td>
                    <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td></td>
                    <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(totalPayment.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(totalComm.toFixed(2)).toLocaleString('en-IN')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* 📍 Pagination Controls */}
        <div className="flex justify-center mt-4 gap-2">
          <button
            className="btn btn-sm"
            disabled={page === 0}
            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${i === page ? "btn-active" : ""}`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-sm"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page;
