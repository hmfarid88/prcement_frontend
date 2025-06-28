'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CurrentDate from "@/app/components/CurrentDate";
import DateToDate from "@/app/components/DateToDate";

type Product = {
  retailerName: string;
  retailerCode: string;
  salesPerson: string;
  totalProductQty: number;
  totalProductValue: number;
  totalPayment: number;
  totalCommission: number;
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


  const handleDetails = (retailerName: string) => {
    if (!retailerName) {
      toast.warning("Retailer name is missing!");
      return;
    }
    router.push(`/sales-details-retailer-ledger?salesPerson=${encodeURIComponent(username)}&retailerName=${encodeURIComponent(retailerName)}`);

  }

  useEffect(() => {
    fetch(`${apiBaseUrl}/retailer/salesRetailerBalance?salesPerson=${username}`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);


  useEffect(() => {
    const filtered = allProducts.filter(product =>
      (product.retailerName.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.retailerCode.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.salesPerson.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
    );
    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);

  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };

  const totalQty = filteredProducts.reduce((total, product) => {
    return total + product.totalProductQty;
  }, 0);
  const totalValue = filteredProducts.reduce((total, product) => {
    return total + product.totalProductValue;
  }, 0);
  const totalPayment = filteredProducts.reduce((total, product) => {
    return total + product.totalPayment;
  }, 0);
  const totalCommission = filteredProducts.reduce((total, product) => {
    return total + product.totalCommission;
  }, 0);
  const totalBalance = filteredProducts.reduce((total, product) => {
    return total + product.totalProductValue - product.totalPayment - product.totalCommission;
  }, 0);

  return (
    <div className="container-2xl">
      <div className="flex flex-col w-full min-h-[calc(100vh-228px)] items-center justify-center p-4">
        <div className="flex p-5 justify-center"><DateToDate routePath="/sales-datewise-retail-ledger" /></div>
        <div className="flex w-full justify-between pl-5 pr-5 pt-1 items-center">
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
              <div className="flex flex-col items-center pb-5"><h4 className="font-bold">RETAILER LEDGER</h4>
                <h4><CurrentDate /></h4>
              </div>
              <table className="table table-xs md:table-sm table-pin-rows">
                <thead className="sticky top-16 bg-base-100">
                  <tr>
                    <th>SN</th>
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
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts?.map((product, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="uppercase">{product?.retailerName}</td>
                      <td className="uppercase">{product?.retailerCode}</td>
                      <td className="uppercase">{product?.salesPerson}</td>
                      <td>{Number(product?.totalProductQty.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(product?.totalProductValue.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(product?.totalPayment.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(product?.totalCommission.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number((product?.totalPayment * 100 / product?.totalProductValue).toFixed(2)).toLocaleString('en-IN')} %</td>
                      <td>{Number((product?.totalProductValue - product?.totalPayment - product?.totalCommission).toFixed(2)).toLocaleString('en-IN')}</td>
                      <td><button onClick={() => handleDetails(product?.retailerName)} className="btn btn-xs btn-info">Details</button></td>

                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold text-lg">
                    <td colSpan={3}></td>
                    <td>TOTAL</td>
                    <td>{totalQty.toLocaleString('en-IN')}</td>
                    <td>{totalValue.toLocaleString('en-IN')}</td>
                    <td>{totalPayment.toLocaleString('en-IN')}</td>
                    <td>{totalCommission.toLocaleString('en-IN')}</td>
                    <td></td>
                    <td>{totalBalance.toLocaleString('en-IN')}</td>
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