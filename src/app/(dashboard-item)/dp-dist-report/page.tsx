// 'use client'
// import React, { useState, useEffect, useRef } from "react";
// import { useAppSelector } from "@/app/store";
// import Print from "@/app/components/Print";
// import CurrentMonthYear from "@/app/components/CurrentMonthYear";
// import DateToDate from "@/app/components/DateToDate";
// import { MdOutlineEditNote } from "react-icons/md";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import ExcelExport from "@/app/components/ExcellGeneration";

// type Product = {
//   date: string;
//   warehouse: string;
//   customer: string;
//   note: string;
//   productName: string;
//   invoiceNo: string;
//   transport: string;
//   truckNo: string;
//   rent: number;
//   dpRate: number;
//   productQty: number;
//   productId: number;
// };


// const Page = () => {
//   const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const uname = useAppSelector((state) => state.username.username);
//   const username = uname ? uname.username : 'Guest';
//   const contentToPrint = useRef<HTMLDivElement>(null);

//   const [filterCriteria, setFilterCriteria] = useState('');
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [allProducts, setAllProducts] = useState<Product[]>([]);
//   const router = useRouter();

//   const handleEdit = (productId: number) => {
//     if (!productId) {
//       toast.warning("Product id is required !");
//       return;
//     }
//     router.push(`/saleinfo-edit?productId=${productId}`);

//   }

//   useEffect(() => {
//     fetch(`${apiBaseUrl}/api/getSoldProduct?username=${encodeURIComponent(username)}`)
//       .then(response => response.json())
//       .then(data => {
//         setAllProducts(data);
//         setFilteredProducts(data);
//       })
//       .catch(error => console.error('Error fetching products:', error));
//   }, [apiBaseUrl, username]);
//   useEffect(() => {
//     const searchWords = filterCriteria.toLowerCase().split(" ");
//     const filtered = allProducts.filter(product =>
//       searchWords.every(word =>
//         (product.warehouse?.toLowerCase().includes(word) || '') ||
//         (product.customer?.toLowerCase().includes(word) || '') ||
//         (product.note?.toLowerCase().includes(word) || '') ||
//         (product.transport?.toLowerCase().includes(word) || '') ||
//         (product.truckNo?.toLowerCase().includes(word) || '') ||
//         (product.productName?.toLowerCase().includes(word) || '') ||
//         (product.invoiceNo?.toLowerCase().includes(word) || '') ||
//         (product.date?.toLowerCase().includes(word) || '')
//       )
//     );

//     setFilteredProducts(filtered);
//   }, [filterCriteria, allProducts]);


//   const handleFilterChange = (e: any) => {
//     setFilterCriteria(e.target.value);
//   };
//   const totalValue = filteredProducts.reduce((total, product) => {
//     return total + (product.dpRate * product.productQty);
//   }, 0);
//   const totalQty = filteredProducts.reduce((acc, item) => acc + item.productQty, 0);
//   const totalRent = filteredProducts.reduce((acc, item) => acc + item.rent, 0);
//   return (
//     <div className="container-2xl">
//       <div className="flex flex-col w-full min-h-[calc(100vh-228px)] items-center justify-center p-4">
//         <div className="flex p-2"><DateToDate routePath="/datewise-distreport" /></div>
//         <div className="flex w-full justify-between pl-5 pr-10 pt-1">
//           <label className="input input-bordered flex max-w-xs  items-center gap-2">
//             <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
//               <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
//             </svg>
//           </label>
//           <div className="flex gap-2">
//             <ExcelExport tableRef={contentToPrint} fileName="distribution_report" />
//             <Print contentRef={contentToPrint} />
//           </div>

//         </div>
//         <div className="flex w-full items-center justify-center">
//           <div className="overflow-x-auto">
//             <div ref={contentToPrint} className="flex-1 p-5">
//               <div className="flex flex-col items-center pb-5"><h4 className="font-bold">DELIVERY REPORT</h4><CurrentMonthYear /></div>
//               <table className="table table-xs md:table-sm table-pin-rows table-zebra">
//                 <thead className="sticky top-16 bg-base-100">
//                   <tr>
//                     <th>SN</th>
//                     <th>DATE</th>
//                     <th>WAREHOUSE</th>
//                     <th>RETAILER</th>
//                     <th>NOTE</th>
//                     <th>PRODUCT</th>
//                     <th>INVOICE NO</th>
//                     <th>TRANSPORT</th>
//                     <th>TRUCK NO</th>
//                     <th>TRUCK RENT</th>
//                     <th>QTY</th>
//                     <th>SALE RATE</th>
//                     <th>SUB TOTAL</th>
//                     <th>EDIT</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredProducts?.map((product, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>{product.date}</td>
//                       <td className="capitalize">{product.warehouse}</td>
//                       <td className="capitalize">{product.customer}</td>
//                       <td className="capitalize">{product.note}</td>
//                       <td className="capitalize">{product.productName}</td>
//                       <td className="uppercase">{product.invoiceNo}</td>
//                       <td className="uppercase">{product.transport}</td>
//                       <td className="uppercase">{product.truckNo}</td>
//                       <td>{product.rent.toLocaleString('en-IN')}</td>
//                       <td>{product.productQty.toLocaleString('en-IN')}</td>
//                       <td>{Number(product.dpRate.toFixed(2)).toLocaleString('en-IN')}</td>
//                       <td>{Number((product.dpRate * product.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
//                       <td><button onClick={() => handleEdit(product.productId)} className="btn btn-primary btn-xs"><MdOutlineEditNote size={24} /></button></td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr className="font-semibold text-lg">
//                     <td colSpan={8}></td>
//                     <td>TOTAL</td>
//                     <td>{Number(totalRent.toFixed(2)).toLocaleString('en-IN')}</td>
//                     <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
//                     <td></td>
//                     <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Page

// 'use client'
// import React, { useState, useEffect, useRef } from "react";
// import { useAppSelector } from "@/app/store";
// import Print from "@/app/components/Print";
// import CurrentMonthYear from "@/app/components/CurrentMonthYear";
// import DateToDate from "@/app/components/DateToDate";
// import { MdOutlineEditNote } from "react-icons/md";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import ExcelExport from "@/app/components/ExcellGeneration";

// type Product = {
//   date: string;
//   category: string;
//   saleperson: string;
//   customer: string;
//   note: string;
//   productName: string;
//   invoiceNo: string;
//   transport: string;
//   truckNo: string;
//   rent: number;
//   dpRate: number;
//   productQty: number;
//   productId: number;
// };

// const Page = () => {
//   const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const uname = useAppSelector((state) => state.username.username);
//   const username = uname ? uname.username : "Guest";
//   const contentToPrint = useRef<HTMLDivElement>(null);

//   const [filterCriteria, setFilterCriteria] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [allProducts, setAllProducts] = useState<Product[]>([]);
//   const [expandedCategory, setExpandedWarehouse] = useState<string | null>(null);
//   const router = useRouter();

//   const handleEdit = (productId: number) => {
//     if (!productId) {
//       toast.warning("Product id is required !");
//       return;
//     }
//     router.push(`/saleinfo-edit?productId=${productId}`);
//   };

//   // Fetch product data
//   useEffect(() => {
//     fetch(`${apiBaseUrl}/api/getSoldProduct?username=${encodeURIComponent(username)}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setAllProducts(data);
//         setFilteredProducts(data);
//       })
//       .catch((error) => console.error("Error fetching products:", error));
//   }, [apiBaseUrl, username]);

//   // Handle filtering
//   useEffect(() => {
//     const searchWords = filterCriteria.toLowerCase().split(" ");
//     const filtered = allProducts.filter((product) =>
//       searchWords.every(
//         (word) =>
//           product.category?.toLowerCase().includes(word) ||
//           product.saleperson?.toLowerCase().includes(word) ||
//           product.customer?.toLowerCase().includes(word) ||
//           product.note?.toLowerCase().includes(word) ||
//           product.transport?.toLowerCase().includes(word) ||
//           product.truckNo?.toLowerCase().includes(word) ||
//           product.productName?.toLowerCase().includes(word) ||
//           product.invoiceNo?.toLowerCase().includes(word) ||
//           product.date?.toLowerCase().includes(word)
//       )
//     );
//     setFilteredProducts(filtered);
//   }, [filterCriteria, allProducts]);

//   const handleFilterChange = (e: any) => {
//     setFilterCriteria(e.target.value);
//   };

//   const toggleDetails = (warehouse: string) => {
//     setExpandedWarehouse((prev) => (prev === warehouse ? null : warehouse));
//   };

//   // Compute overall totals
//   const totalValue = filteredProducts.reduce(
//     (total, product) => total + product.dpRate * product.productQty,
//     0
//   );
//   const totalQty = filteredProducts.reduce((acc, item) => acc + item.productQty, 0);
//   const totalRent = filteredProducts.reduce((acc, item) => acc + item.rent, 0);

//   // Group by category
//   const groupedData = filteredProducts.reduce((acc, product) => {
//     const category = product.category || "Unknown";
//     if (!acc[category]) acc[category] = [];
//     acc[category].push(product);
//     return acc;
//   }, {} as Record<string, Product[]>);

//   return (
//     <div className="container-2xl">
//       <div className="flex flex-col w-full min-h-[calc(100vh-228px)] items-center justify-center p-4">
//         <div className="flex p-2">
//           <DateToDate routePath="/datewise-distreport" />
//         </div>

//         <div className="flex w-full justify-between pl-5 pr-10 pt-1">
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
//             <ExcelExport tableRef={contentToPrint} fileName="distribution_report" />
//             <Print contentRef={contentToPrint} />
//           </div>
//         </div>

//         <div className="flex w-full items-center justify-center">
//           <div className="overflow-x-auto w-full">
//             <div ref={contentToPrint} className="flex-1 p-5">
//               <div className="flex flex-col items-center pb-5">
//                 <h4 className="font-bold">DELIVERY REPORT</h4>
//                 <CurrentMonthYear />
//               </div>

//               <table className="table table-xs md:table-sm table-pin-rows table-zebra w-full">
//                 <thead className="sticky top-16 bg-base-100">
//                   <tr>
//                     <th>SN</th>
//                     <th>DATE</th>
//                     <th>CATEGORY</th>
//                     <th>MARKETING OFFICHER</th>
//                     <th>RETAILER</th>
//                     <th>NOTE</th>
//                     <th>PRODUCT</th>
//                     <th>INVOICE NO</th>
//                     <th>TRANSPORT</th>
//                     <th>TRUCK NO</th>
//                     <th>TRUCK RENT</th>
//                     <th>QTY</th>
//                     <th>SALE RATE</th>
//                     <th>SUB TOTAL</th>
//                     <th>ACTION</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {Object.entries(groupedData).map(([category, products], wIndex) => {
//                     const totalQty = products.reduce((sum, p) => sum + p.productQty, 0);
//                     const totalValue = products.reduce(
//                       (sum, p) => sum + p.dpRate * p.productQty,
//                       0
//                     );
//                     const totalRent = products.reduce((sum, p) => sum + p.rent, 0);
//                     const avgRate = totalQty > 0 ? totalValue / totalQty : 0;

//                     return (
//                       <React.Fragment key={category}>
//                         {/* Warehouse summary row */}
//                         <tr className="bg-gray-200 font-semibold">
//                           <td>{wIndex + 1}</td>
//                           <td colSpan={2} className="capitalize">
//                             {category}
//                           </td>
//                           <td></td>
//                           <td colSpan={3}>Total Retailer: {products.length}</td>
//                           <td></td>
//                           <td></td>
//                           <td></td>
//                           <td>{Number(totalRent.toFixed(2)).toLocaleString("en-IN")}</td>
//                           <td>{Number(totalQty.toFixed(2)).toLocaleString("en-IN")}</td>
//                           <td>{Number(avgRate.toFixed(2)).toLocaleString("en-IN")}</td>
//                           <td>{Number(totalValue.toFixed(2)).toLocaleString("en-IN")}</td>
//                           <td>
//                             <button
//                               onClick={() => toggleDetails(category)}
//                               className="btn btn-sm btn-info"
//                             >
//                               {expandedCategory === category
//                                 ? "Hide Details"
//                                 : "Show Details"}
//                             </button>
//                           </td>
//                         </tr>

//                         {/* Expand product details */}
//                         {expandedCategory === category &&
//                           products.map((product, index) => (
//                             <tr key={index} className="text-sm">
//                               <td>{index + 1}</td>
//                               <td>{product.date}</td>
//                               <td></td>
//                               <td className="capitalize">{product.saleperson}</td>
//                               <td className="capitalize">{product.customer}</td>
//                               <td className="capitalize">{product.note}</td>
//                               <td className="capitalize">{product.productName}</td>
//                               <td className="uppercase">{product.invoiceNo}</td>
//                               <td className="uppercase">{product.transport}</td>
//                               <td className="uppercase">{product.truckNo}</td>
//                               <td>
//                                 {product.rent.toLocaleString("en-IN")}
//                               </td>
//                               <td>
//                                 {product.productQty.toLocaleString("en-IN")}
//                               </td>
//                               <td>
//                                 {Number(product.dpRate.toFixed(2)).toLocaleString("en-IN")}
//                               </td>
//                               <td>
//                                 {Number(
//                                   (product.dpRate * product.productQty).toFixed(2)
//                                 ).toLocaleString("en-IN")}
//                               </td>
//                               <td>
//                                 <button
//                                   onClick={() => handleEdit(product.productId)}
//                                   className="btn btn-primary btn-xs"
//                                 >
//                                   <MdOutlineEditNote size={18} />
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>

//                 <tfoot>
//                   <tr className="font-semibold text-lg">
//                     <td colSpan={9}></td>
//                     <td>TOTAL</td>
//                     <td>{Number(totalRent.toFixed(2)).toLocaleString("en-IN")}</td>
//                     <td>{Number(totalQty.toFixed(2)).toLocaleString("en-IN")}</td>
//                     <td></td>
//                     <td>{Number(totalValue.toFixed(2)).toLocaleString("en-IN")}</td>
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

'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import Print from "@/app/components/Print";
import CurrentMonthYear from "@/app/components/CurrentMonthYear";
import DateToDate from "@/app/components/DateToDate";
import { MdOutlineEditNote } from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ExcelExport from "@/app/components/ExcellGeneration";

type Product = {
  date: string;
  category: string;
  saleperson: string;
  customer: string;
  note: string;
  productName: string;
  invoiceNo: string;
  transport: string;
  truckNo: string;
  rent: number;
  dpRate: number;
  productQty: number;
  productId: number;
};

const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : "Guest";
  const contentToPrint = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [filterCriteria, setFilterCriteria] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSalesperson, setExpandedSalesperson] = useState<string | null>(null);

  const handleEdit = (productId: number) => {
    if (!productId) {
      toast.warning("Product id is required!");
      return;
    }
    router.push(`/saleinfo-edit?productId=${productId}`);
  };

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getSoldProduct?username=${encodeURIComponent(username)}`)
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, [apiBaseUrl, username]);

  useEffect(() => {
    const searchWords = filterCriteria.toLowerCase().split(" ");
    const filtered = allProducts.filter((product) =>
      searchWords.every(
        (word) =>
          product.category?.toLowerCase().includes(word) ||
          product.saleperson?.toLowerCase().includes(word) ||
          product.customer?.toLowerCase().includes(word) ||
          product.note?.toLowerCase().includes(word) ||
          product.transport?.toLowerCase().includes(word) ||
          product.truckNo?.toLowerCase().includes(word) ||
          product.productName?.toLowerCase().includes(word) ||
          product.invoiceNo?.toLowerCase().includes(word) ||
          product.date?.toLowerCase().includes(word)
      )
    );
    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);

  const handleFilterChange = (e: any) => setFilterCriteria(e.target.value);

  // Totals for footer
  const totalValue = filteredProducts.reduce(
    (sum, p) => sum + p.dpRate * p.productQty,
    0
  );
  const totalQty = filteredProducts.reduce((sum, p) => sum + p.productQty, 0);
  const totalRent = filteredProducts.reduce((sum, p) => sum + p.rent, 0);

  // Group by Category > Salesperson
  const groupedData = filteredProducts.reduce((acc, product) => {
    const category = product.category || "Unknown";
    const salesperson = product.saleperson || "Unknown";
    if (!acc[category]) acc[category] = {};
    if (!acc[category][salesperson]) acc[category][salesperson] = [];
    acc[category][salesperson].push(product);
    return acc;
  }, {} as Record<string, Record<string, Product[]>>);

  return (
    <div className="container-2xl">
      <div className="flex flex-col w-full min-h-[calc(100vh-228px)] items-center justify-center p-4">
        {/* Top Controls */}
        <div className="flex p-2">
          <DateToDate routePath="/datewise-distreport" />
        </div>

        <div className="flex w-full justify-between pl-5 pr-10 pt-1">
          <label className="input input-bordered flex max-w-xs items-center gap-2">
            <input
              type="text"
              value={filterCriteria}
              onChange={handleFilterChange}
              className="grow"
              placeholder="Search"
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
              <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
            </svg>
          </label>

          <div className="flex gap-2">
            <a href="#sr_summary" className="btn btn-ghost text-lg">Marketing Officer Summary</a>
            <a href="#sale_summary" className="btn btn-ghost text-lg">Sale Summary</a>
            <ExcelExport tableRef={contentToPrint} fileName="sale_report" />
            <Print contentRef={contentToPrint} />
          </div>
        </div>

        {/* Table */}
        <div className="flex w-full items-center justify-center">
          <div className="overflow-x-auto w-full">
            <div ref={contentToPrint} className="flex-1 p-5">
              <div className="flex flex-col items-center pb-5">
                <h4 className="font-bold">SALE REPORT</h4>
                <CurrentMonthYear />
              </div>

              <table className="table table-xs md:table-sm table-pin-rows table-zebra w-full">
                <thead className="sticky top-16 bg-base-100">
                  <tr>
                    <th>SN</th>
                    <th>DATE</th>
                    <th>CATEGORY</th>
                    <th>SALESPERSON</th>
                    <th>RETAILER</th>
                    <th>NOTE</th>
                    <th>PRODUCT</th>
                    <th>INVOICE NO</th>
                    <th>TRANSPORT</th>
                    <th>TRUCK NO</th>
                    <th>RENT</th>
                    <th>QTY</th>
                    <th>SALE RATE</th>
                    <th>SUBTOTAL</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.entries(groupedData).map(([category, salesMap], catIndex) => {
                    const catProducts = Object.values(salesMap).flat();
                    const catQty = catProducts.reduce((a, b) => a + b.productQty, 0);
                    const catValue = catProducts.reduce((a, b) => a + b.dpRate * b.productQty, 0);
                    const catRent = catProducts.reduce((a, b) => a + b.rent, 0);

                    return (
                      <React.Fragment key={category}>
                        {/* Category summary */}
                        <tr className="bg-gray-200 font-semibold">
                          <td>{catIndex + 1}</td>
                          <td colSpan={2}>{category}</td>
                          <td colSpan={4}>Total Marketing Officers: {Object.keys(salesMap).length}</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>{catRent.toLocaleString("en-IN")}</td>
                          <td>{catQty.toLocaleString("en-IN")}</td>
                          <td></td>
                          <td>{catValue.toLocaleString("en-IN")}</td>
                          <td>
                            <button
                              onClick={() =>
                                setExpandedCategory((prev) =>
                                  prev === category ? null : category
                                )
                              }
                              className="btn btn-xs btn-info"
                            >
                              {expandedCategory === category ? "Hide" : "Details"}
                            </button>
                          </td>
                        </tr>

                        {expandedCategory === category &&
                          Object.entries(salesMap).map(([salesperson, products]) => {
                            const salesQty = products.reduce((a, b) => a + b.productQty, 0);
                            const salesValue = products.reduce((a, b) => a + b.dpRate * b.productQty, 0);
                            const salesRent = products.reduce((a, b) => a + b.rent, 0);

                            return (
                              <React.Fragment key={salesperson}>
                                {/* Salesperson summary */}
                                <tr className="bg-blue-100">
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td className="capitalize font-semibold">{salesperson}</td>
                                  <td colSpan={3}>Retailers: {new Set(products.map(p => p.customer)).size}</td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                  <td>{salesRent.toLocaleString("en-IN")}</td>
                                  <td>{salesQty.toLocaleString("en-IN")}</td>
                                  <td></td>
                                  <td>{salesValue.toLocaleString("en-IN")}</td>
                                  <td>
                                    <button
                                      onClick={() =>
                                        setExpandedSalesperson((prev) =>
                                          prev === salesperson ? null : salesperson
                                        )
                                      }
                                      className="btn btn-xs btn-warning"
                                    >
                                      {expandedSalesperson === salesperson ? "Hide" : "Details"}
                                    </button>
                                  </td>
                                </tr>

                                {/* Retailer-level details */}
                                {expandedSalesperson === salesperson &&
                                  products.map((p, idx) => (
                                    <tr key={idx} className="text-sm">
                                      <td>{idx + 1}</td>
                                      <td>{p.date}</td>
                                      <td></td>
                                      <td></td>
                                      <td className="capitalize">{p.customer}</td>
                                      <td className="capitalize">{p.note}</td>
                                      <td className="capitalize">{p.productName}</td>
                                      <td className="uppercase">{p.invoiceNo}</td>
                                      <td className="uppercase">{p.transport}</td>
                                      <td className="uppercase">{p.truckNo}</td>
                                      <td>{p.rent.toLocaleString("en-IN")}</td>
                                      <td>{p.productQty.toLocaleString("en-IN")}</td>
                                      <td>{p.dpRate.toLocaleString("en-IN")}</td>
                                      <td>{(p.dpRate * p.productQty).toLocaleString("en-IN")}</td>
                                      <td>
                                        <button
                                          onClick={() => handleEdit(p.productId)}
                                          className="btn btn-xs btn-primary"
                                        >
                                          <MdOutlineEditNote size={16} />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                              </React.Fragment>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
                </tbody>

                <tfoot>
                  <tr className="font-semibold text-lg">
                    <td colSpan={9}></td>
                    <td>TOTAL</td>
                    <td>{totalRent.toLocaleString("en-IN")}</td>
                    <td>{totalQty.toLocaleString("en-IN")}</td>
                    <td></td>
                    <td>{totalValue.toLocaleString("en-IN")}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="modal sm:modal-middle" role="dialog" id="sale_summary">
        <div className="modal-box">
          <div className="flex w-full items-center justify-center p-2">
           
            <DateToDate routePath="/sale-summary" />
          </div>
          <div className="modal-action">
            <a href="#" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="modal sm:modal-middle" role="dialog" id="sr_summary">
        <div className="modal-box">
          <div className="flex w-full items-center justify-center p-2">
           
            <DateToDate routePath="/sr-summary" />
          </div>
          <div className="modal-action">
            <a href="#" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
