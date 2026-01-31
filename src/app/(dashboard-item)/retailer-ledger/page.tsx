'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import DateToDate from "@/app/components/DateToDate";
import ExcelExport from "@/app/components/ExcellGeneration";
import CurrentMonthYear from "@/app/components/CurrentMonthYear";

type Product = {
  category: string;
  qty:number;
  // areaName: string;
  // retailerName: string;
  // retailerCode: string;
  // salesPerson: string;
  // totalProductQty: number;
  // totalProductValue: number;
  // totalPayment: number;
  // totalCommission: number;
  debit: number;
  credit: number;
  openingBalance: number;
};


const Page = () => {
  const router = useRouter();
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

  // const [showDetails, setShowDetails] = useState(false);

  // const handleDetails = (retailerName: string) => {
  //   if (!retailerName) {
  //     toast.warning("Retailer name is missing!");
  //     return;
  //   }
  //   router.push(`/details-retailer-ledger?retailerName=${encodeURIComponent(retailerName)}&username=${encodeURIComponent(username)}`);
  // };

  const handleDetails = (category: string) => {
    if (!category) {
      toast.warning("Particular name is missing!");
      return;
    }
    router.push(`/marketing-officher-ledger?category=${encodeURIComponent(category)}`);
  };

  // useEffect(() => {
  //   fetch(`${apiBaseUrl}/retailer/retailerBalance`)
  //     .then(response => response.json())
  //     .then(data => {
  //       setAllProducts(data);
  //       setFilteredProducts(data);
  //     })
  //     .catch(error => console.error('Error fetching products:', error));
  // }, [apiBaseUrl]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/retailer/categoryRetailerBalance`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl]);


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
  //   return total + product.totalProductQty;
  // }, 0);
  // const totalValue = filteredProducts.reduce((total, product) => {
  //   return total + product.totalProductValue;
  // }, 0);
  // const totalPayment = filteredProducts.reduce((total, product) => {
  //   return total + product.totalPayment;
  // }, 0);
  // const totalCommission = filteredProducts.reduce((total, product) => {
  //   return total + product.totalCommission;
  // }, 0);
  // const totalBalance = filteredProducts.reduce((total, product) => {
  //   return total + product.totalProductValue - product.totalPayment - product.totalCommission;
  // }, 0);

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

  // const categoryTotals = filteredProducts.reduce((acc, product) => {
  //   const balance = product.totalProductValue - product.totalPayment - product.totalCommission;
  //   if (!acc[product.category]) {
  //     acc[product.category] = { balance: 0 };
  //   }
  //   acc[product.category].balance += balance;
  //   return acc;
  // }, {} as Record<string, { balance: number }>);

  // const groupedByCategory = filteredProducts.reduce((acc, product) => {
  //   if (!acc[product.category]) acc[product.category] = [];
  //   acc[product.category].push(product);
  //   return acc;
  // }, {} as Record<string, Product[]>);

  return (
    <div className="container-2xl">
      <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
        <div className="flex p-2"><DateToDate routePath="/datewise-retail-ledger" /></div>
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
            {/* <div className="flex w-full justify-end p-5">
              <button
                onClick={() => setShowDetails(prev => !prev)}
                className="btn btn-sm btn-info mb-2"
              >
                {showDetails ? "Hide Details" : "Show Details"}
              </button>
            </div> */}
            <div ref={contentToPrint} className="flex-1 p-5">
              <div className="flex flex-col items-center pb-5"><h4 className="font-bold">MARKET LEDGER</h4>
                <h4><CurrentMonthYear /></h4>
              </div>
              <table className="table table-md table-pin-rows table-zebra">
                <thead className="sticky top-16 bg-base-100">
                  {/* 
                   */}
                  <tr>
                    <th>SN</th>
                    <th>CATEGORY</th>
                    <th>OPENING</th>
                    <th>QTY</th>
                    <th>DEBIT</th>
                    <th>CREDIT</th>
                    <th>CLOSING</th>
                    <th>DETAILS</th>
                  </tr>
                </thead>
                {/* <tbody>
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
                </tbody> */}

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
                  {/* <tr className="font-semibold text-lg">
                    <td colSpan={5}></td>
                    <td>TOTAL</td>
                    <td>{totalQty.toLocaleString('en-IN')}</td>
                    <td>{totalValue.toLocaleString('en-IN')}</td>
                    <td>{totalPayment.toLocaleString('en-IN')}</td>
                    <td>{totalCommission.toLocaleString('en-IN')}</td>
                    <td></td>
                    <td>{totalBalance.toLocaleString('en-IN')}</td>
                  </tr> */}
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

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page

// 'use client';
// import React, { useState, useEffect, useRef } from "react";
// import { useAppSelector } from "@/app/store";
// import { FcPrint } from "react-icons/fc";
// import { useReactToPrint } from "react-to-print";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import CurrentDate from "@/app/components/CurrentDate";
// import DateToDate from "@/app/components/DateToDate";
// import ExcelExport from "@/app/components/ExcellGeneration";

// type Product = {
//   category: string;
//   areaName: string;
//   retailerName: string;
//   retailerCode: string;
//   salesPerson: string;
//   totalProductQty: number;
//   totalProductValue: number;
//   totalPayment: number;
//   totalCommission: number;
// };

// const Page = () => {
//   const router = useRouter();
//   const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const uname = useAppSelector((state) => state.username.username);
//   const username = uname ? uname.username : "Guest";

//   const contentToPrint = useRef(null);
//   const handlePrint = useReactToPrint({
//     content: () => contentToPrint.current,
//   });

//   const [filterCriteria, setFilterCriteria] = useState("");
//   const [allProducts, setAllProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
//   const [expandedSalesPerson, setExpandedSalesPerson] = useState<string | null>(null);

//   const handleDetails = (retailerName: string) => {
//     if (!retailerName) {
//       toast.warning("Retailer name is missing!");
//       return;
//     }
//     router.push(
//       `/details-retailer-ledger?retailerName=${encodeURIComponent(retailerName)}&username=${encodeURIComponent(username)}`
//     );
//   };

//   // Fetch retailer data
//   useEffect(() => {
//     fetch(`${apiBaseUrl}/retailer/retailerBalance`)
//       .then((res) => res.json())
//       .then((data) => {
//         setAllProducts(data);
//         setFilteredProducts(data);
//       })
//       .catch((error) => console.error("Error fetching products:", error));
//   }, [apiBaseUrl]);

//   // Filter search
//   useEffect(() => {
//     const query = filterCriteria.toLowerCase();
//     const filtered = allProducts.filter(
//       (p) =>
//         p.category?.toLowerCase().includes(query) ||
//         p.areaName?.toLowerCase().includes(query) ||
//         p.retailerName?.toLowerCase().includes(query) ||
//         p.retailerCode?.toLowerCase().includes(query) ||
//         p.salesPerson?.toLowerCase().includes(query)
//     );
//     setFilteredProducts(filtered);
//   }, [filterCriteria, allProducts]);

//   const handleFilterChange = (e: any) => setFilterCriteria(e.target.value);

//   // Group by category → salesperson
//   const groupedByCategory = filteredProducts.reduce((acc, product) => {
//     if (!acc[product.category]) acc[product.category] = {};
//     if (!acc[product.category][product.salesPerson]) acc[product.category][product.salesPerson] = [];
//     acc[product.category][product.salesPerson].push(product);
//     return acc;
//   }, {} as Record<string, Record<string, Product[]>>);

//   // Grand totals
//   const totalQty = filteredProducts.reduce((t, p) => t + p.totalProductQty, 0);
//   const totalValue = filteredProducts.reduce((t, p) => t + p.totalProductValue, 0);
//   const totalPayment = filteredProducts.reduce((t, p) => t + p.totalPayment, 0);
//   const totalCommission = filteredProducts.reduce((t, p) => t + p.totalCommission, 0);
//   const totalBalance = filteredProducts.reduce(
//     (t, p) => t + (p.totalProductValue - p.totalPayment - p.totalCommission),
//     0
//   );

//   return (
//     <div className="container-2xl">
//       <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
//         <div className="flex p-2">
//           <DateToDate routePath="/datewise-retail-ledger" />
//         </div>

//         <div className="flex w-full justify-between pl-5 pr-5 pt-1">
//           <label className="input input-bordered flex max-w-xs items-center gap-2">
//             <input
//               type="text"
//               value={filterCriteria}
//               onChange={handleFilterChange}
//               className="grow"
//               placeholder="Search"
//             />
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 16 16"
//               fill="currentColor"
//               className="h-4 w-4 opacity-70"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </label>

//           <div className="flex gap-2">
//             <ExcelExport tableRef={contentToPrint} fileName="retailer_ledger" />
//             <button onClick={handlePrint} className="btn btn-ghost btn-square">
//               <FcPrint size={36} />
//             </button>
//           </div>
//         </div>

//         <div className="flex w-full justify-center">
//           <div className="overflow-x-auto w-full">
//             <div ref={contentToPrint} className="flex-1 p-5">
//               <div className="flex flex-col items-center pb-5">
//                 <h4 className="font-bold">RETAILER LEDGER</h4>
//                 <h4>
//                   <CurrentDate />
//                 </h4>
//               </div>

//               <table className="table table-xs md:table-sm table-zebra">
//                 <thead className="sticky top-16 bg-base-100">
//                   <tr>
//                     <th>SN</th>
//                     <th>CATEGORY / SALESPERSON / RETAILER</th>
//                     <th>QTY</th>
//                     <th>VALUE</th>
//                     <th>PAYMENT</th>
//                     <th>COMMISSION</th>
//                     <th>BALANCE</th>
//                     <th>DETAILS</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {Object.entries(groupedByCategory).map(([category, salesPersons], cIndex) => {
//                     const categoryTotals = Object.values(salesPersons).flat();
//                     const catQty = categoryTotals.reduce((a, p) => a + p.totalProductQty, 0);
//                     const catValue = categoryTotals.reduce((a, p) => a + p.totalProductValue, 0);
//                     const catPayment = categoryTotals.reduce((a, p) => a + p.totalPayment, 0);
//                     const catCommission = categoryTotals.reduce((a, p) => a + p.totalCommission, 0);
//                     const catBalance = catValue - catPayment - catCommission;

//                     return (
//                       <React.Fragment key={category}>
//                         {/* CATEGORY ROW */}
//                         <tr
//                           className="bg-gray-200 font-semibold cursor-pointer"
//                           onClick={() =>
//                             setExpandedCategory((prev) => (prev === category ? null : category))
//                           }
//                         >
//                           <td>{cIndex + 1}</td>
//                           <td className="uppercase">{category}</td>
//                           <td>{catQty.toLocaleString("en-IN")}</td>
//                           <td>{catValue.toLocaleString("en-IN")}</td>
//                           <td>{catPayment.toLocaleString("en-IN")}</td>
//                           <td>{catCommission.toLocaleString("en-IN")}</td>
//                           <td>{catBalance.toLocaleString("en-IN")}</td>
//                           <td>
//                             {expandedCategory === category ? "▲ Hide" : "▼ Show"}
//                           </td>
//                         </tr>

//                         {/* SALESPERSON ROWS */}
//                         {expandedCategory === category &&
//                           Object.entries(salesPersons).map(([salesPerson, retailers], sIndex) => {
//                             const spQty = retailers.reduce((a, p) => a + p.totalProductQty, 0);
//                             const spValue = retailers.reduce((a, p) => a + p.totalProductValue, 0);
//                             const spPayment = retailers.reduce((a, p) => a + p.totalPayment, 0);
//                             const spCommission = retailers.reduce((a, p) => a + p.totalCommission, 0);
//                             const spBalance = spValue - spPayment - spCommission;

//                             return (
//                               <React.Fragment key={salesPerson}>
//                                 <tr
//                                   className="bg-base-200 cursor-pointer"
//                                   onClick={() =>
//                                     setExpandedSalesPerson((prev) =>
//                                       prev === salesPerson ? null : salesPerson
//                                     )
//                                   }
//                                 >
//                                   <td></td>
//                                   <td className="pl-6 capitalize">
//                                     {salesPerson || "Unknown Salesperson"}
//                                   </td>
//                                   <td>{spQty.toLocaleString("en-IN")}</td>
//                                   <td>{spValue.toLocaleString("en-IN")}</td>
//                                   <td>{spPayment.toLocaleString("en-IN")}</td>
//                                   <td>{spCommission.toLocaleString("en-IN")}</td>
//                                   <td>{spBalance.toLocaleString("en-IN")}</td>
//                                   <td>
//                                     {expandedSalesPerson === salesPerson ? "▲" : "▼"}
//                                   </td>
//                                 </tr>

//                                 {/* RETAILER ROWS */}
//                                 {expandedSalesPerson === salesPerson &&
//                                   retailers.map((r, rIndex) => {
//                                     const balance =
//                                       r.totalProductValue - r.totalPayment - r.totalCommission;
//                                     return (
//                                       <tr key={rIndex} className="text-sm">
//                                         <td></td>
//                                         <td className="pl-12 uppercase">
//                                           {r.retailerName} ({r.retailerCode})
//                                         </td>
//                                         <td>{r.totalProductQty.toLocaleString("en-IN")}</td>
//                                         <td>{r.totalProductValue.toLocaleString("en-IN")}</td>
//                                         <td>{r.totalPayment.toLocaleString("en-IN")}</td>
//                                         <td>{r.totalCommission.toLocaleString("en-IN")}</td>
//                                         <td>{balance.toLocaleString("en-IN")}</td>
//                                         <td>
//                                           <button
//                                             onClick={() => handleDetails(r.retailerName)}
//                                             className="btn btn-xs btn-success"
//                                           >
//                                             Details
//                                           </button>
//                                         </td>
//                                       </tr>
//                                     );
//                                   })}
//                               </React.Fragment>
//                             );
//                           })}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>

//                 <tfoot>
//                   <tr className="font-semibold text-lg bg-base-200">
//                     <td colSpan={2} className="text-right">
//                       GRAND TOTAL:
//                     </td>
//                     <td>{totalQty.toLocaleString("en-IN")}</td>
//                     <td>{totalValue.toLocaleString("en-IN")}</td>
//                     <td>{totalPayment.toLocaleString("en-IN")}</td>
//                     <td>{totalCommission.toLocaleString("en-IN")}</td>
//                     <td>{totalBalance.toLocaleString("en-IN")}</td>
//                     <td></td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;
