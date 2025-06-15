'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import Print from "@/app/components/Print";
import CurrentMonthYear from "@/app/components/CurrentMonthYear";
import DateToDate from "@/app/components/DateToDate";

type Product = {
  productName: string;
  invoiceNo: string;
  dpRate: number;
  costPrice: number;
  productQty: number;
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
    fetch(`${apiBaseUrl}/api/getSoldProduct?username=${encodeURIComponent(username)}`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);


  useEffect(() => {
    const filtered = allProducts.filter(product =>
      (product.productName.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.invoiceNo.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
    );
    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);

  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };
  const totalValue = filteredProducts.reduce((total, product) => {
    return total + (product.dpRate * product.productQty);
  }, 0);
  const totalQty = filteredProducts.reduce((acc, item) => acc + item.productQty, 0);
  return (
    <div className="container-2xl">
      <div className="flex flex-col w-full min-h-[calc(100vh-228px)] items-center justify-center p-4">
      <div className="flex p-5 justify-end items-end"><DateToDate routePath="/datewise-profitreport" /></div>
        
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
          <div className="flex flex-col items-center pb-5"><h4 className="font-bold">PROFIT REPORT</h4><CurrentMonthYear /></div>
          <table className="table table-xs md:table-sm table-pin-rows">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>PRODUCT NAME</th>
                  <th>INVOICE NO</th>
                  <th>COST PRICE</th>
                  <th>SALE PRICE</th>
                  <th>UNIT PROFIT</th>
                  <th>QUANTITY</th>
                  <th>SUB TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.productName}</td>
                    <td className="uppercase">{product.invoiceNo}</td>
                    <td>{Number(product.costPrice.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(product.dpRate.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(product.dpRate-product.costPrice).toLocaleString('en-IN')}</td>
                    <td>{product.productQty.toLocaleString('en-IN')}</td>
                    <td>{Number(((product.dpRate-product.costPrice) * product.productQty).toFixed(2)).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold text-lg">
                  <td colSpan={5}></td>
                  <td>TOTAL</td>
                  <td>{totalQty}</td>
                  <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>
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