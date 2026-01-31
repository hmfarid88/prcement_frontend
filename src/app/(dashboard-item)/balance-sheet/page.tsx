"use client"
import CurrentDate from '@/app/components/CurrentDate';
import { useAppSelector } from '@/app/store';
import React, { useEffect, useRef, useState } from 'react'
import { FcPrint } from 'react-icons/fc';
import { useReactToPrint } from 'react-to-print';
interface ProductStock {
  costPrice: number;
  productQty: number;
}

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    const [openingCash, setOpeningCash] = useState(0);
    useEffect(() => {
        fetch(`${apiBaseUrl}/finance/opening-cash`)
            .then(response => response.json())
            .then(data => setOpeningCash(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiBaseUrl, username]);

    const [openingCapital, setOpeningCapital] = useState(0);
    useEffect(() => {
        fetch(`${apiBaseUrl}/finance/opening-capital`)
            .then(response => response.json())
            .then(data => setOpeningCapital(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiBaseUrl, username]);

    const [openingStock, setOpeningStock] = useState(0);
    useEffect(() => {
        fetch(`${apiBaseUrl}/finance/opening-stock`)
            .then(response => response.json())
            .then(data => setOpeningStock(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiBaseUrl, username]);

    const [netSumAmount, setNetSumAmount] = useState(0);
     useEffect(() => {
        fetch(`${apiBaseUrl}/paymentApi/net-sum-today?username=${username}`)
          .then(response => response.json())
          .then(data => setNetSumAmount(data.netSumAmount))
          .catch(error => console.error('Error fetching data:', error));
      }, [apiBaseUrl, username]);

    const [retailerDue, setRetailerDue] = useState(0);
    useEffect(() => {
        fetch(`${apiBaseUrl}/retailer/retailerDue`)
            .then(response => response.json())
            .then(data => setRetailerDue(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiBaseUrl, username]);

    const [supplierDue, setSupplierDue] = useState(0);
    useEffect(() => {
        fetch(`${apiBaseUrl}/supplierBalance/supplierDue`)
            .then(response => response.json())
            .then(data => setSupplierDue(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiBaseUrl, username]);

    
const [stockValue, setStockValue] = useState<number>(0);
useEffect(() => {
  fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
    .then(response => response.json())
    .then((data: ProductStock[]) => {
      const total = data.reduce(
        (sum: number, product: ProductStock) =>
          sum + (product.costPrice * product.productQty),
        0
      );

      setStockValue(total);
    })
    .catch(error => console.error('Error fetching products:', error));
}, [apiBaseUrl, username]);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex justify-between pl-5 pr-5">
                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>
            <div className="w-full card">
                <div ref={contentToPrint} className="flex flex-col w-full items-center justify-center pt-5">
                    <div className="flex flex-col items-center justify-center">
                        <h4 className='font-bold'>BALANCE SHEET</h4>
                        <h4 className='font-semibold'><CurrentDate /></h4>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="flex w-full items-center justify-between text-sm font-semibold p-5">
                            <h4>ASSETS</h4>
                            <h4>LIABILITIES</h4>
                        </div>
                        <div className="flex w-full gap-10">
                            <div className="flex">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>DESCRIPTION</th>
                                            <th>AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>OPENING CASH</td>
                                            <td>{Number((openingCash).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                        <tr>
                                            <td>OPENING STOCK</td>
                                            <td>{Number((openingStock).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                        <tr>
                                            <td>CASH IN HAND</td>
                                            <td>{Number((netSumAmount).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                        
                                        <tr>
                                            <td>TOTAL PRODUCT STOCK</td>
                                            <td>{Number((stockValue).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                        <tr>
                                            <td>RETAILER DUE</td>
                                            <td>{Number((retailerDue).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                     
                                    </tbody>
                                    <tfoot>
                                        <tr className='text-sm font-bold'>
                                            <td>TOTAL ASSETS</td>
                                            <td>{Number((netSumAmount + retailerDue + stockValue).toFixed(2)).toLocaleString('en-IN')}</td>

                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div>
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>DESCRIPTION</th>
                                            <th>AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className='font-semibold'>
                                            <td className='text-sm'>OPENING CAPITAL</td>
                                            <td>{Number((openingCapital).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                        <tr className='font-semibold'>
                                            <td className='text-sm'>SUPPLIER DUE</td>
                                            <td>{Number((supplierDue).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                        <tr className='font-semibold'>
                                            <td className='text-sm'>OWNER&apos;S EQUITY </td>
                                            <td>{Number(((netSumAmount + retailerDue + stockValue) - (openingCapital + supplierDue)).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>

                                    </tbody>
                                    <tfoot>
                                        <tr className='text-sm font-bold'>
                                            <td>TOTAL LIABILITIES</td>
                                            <td>{Number(((netSumAmount + retailerDue + stockValue) - (openingCapital)).toFixed(2)).toLocaleString('en-IN')}</td>
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




