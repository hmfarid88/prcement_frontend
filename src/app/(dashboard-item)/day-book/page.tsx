"use client"
import { useAppSelector } from '@/app/store';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { FcPrint } from 'react-icons/fc';
import { useReactToPrint } from 'react-to-print';
interface Payment {
    date: string;
    name: string;
    note: string;
    amount: number;
}
interface Receive {
    date: string;
    name: string;
    note: string;
    amount: number;
}
type Product = {
    date: string;
    customer: string;
    productName: string;
    dpRate: number;
    productQty: number;
};
type PProduct = {
    date: string;
    supplier: string;
    productName: string;
    costPrice: number;
    productQty: number;
};
const DayBook = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const searchParams = useSearchParams();
    const date = searchParams.get('date');

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [allPProducts, setAllPProducts] = useState<PProduct[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/paymentApi/payments/today?username=${username}&date=${date}`)
            .then(response => response.json())
            .then(data => setPayments(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiBaseUrl, date, username]);


    const [receives, setReceives] = useState<Receive[]>([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/paymentApi/receives/today?username=${username}&date=${date}`)
            .then(response => response.json())
            .then(data => setReceives(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiBaseUrl, date, username]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getDatewiseSoldProduct?username=${encodeURIComponent(username)}&startDate=${date}&endDate=${date}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);

            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, date]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/datewise-stock-ledger?username=${encodeURIComponent(username)}&startDate=${date}&endDate=${date}`)
            .then(response => response.json())
            .then(data => {
                setAllPProducts(data);

            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, date]);

    const totalDebit = () => {
        return receives.reduce((credit, receive) => credit + (receive.amount), 0);
    };

    const totalPurse = () => {
        return allPProducts.reduce((credit, receive) => credit + (receive.costPrice * receive.productQty), 0);
    };

    const totalSale = () => {
        return allProducts.reduce((credit, receive) => credit + (receive.dpRate * receive.productQty), 0);
    };

    const totalCredit = () => {
        return payments.reduce((debit, payment) => debit + (payment.amount), 0);
    };

    return (
        <div className='container min-h-screen'>
            <div className="flex justify-between pl-5 pr-5">
                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>
            <div className="w-full card">
                <div ref={contentToPrint} className="flex w-full items-center justify-center pt-5">
                    <div className="overflow-x-auto">
                        <div className="flex flex-col items-center font-bold">
                            <h4>DAY BOOK</h4>
                            <h4>{date}</h4>
                        </div>
                        <div className="flex w-full justify-between font-bold p-5">
                            <h4>DEBIT</h4>
                            <h4>CREDIT</h4>
                        </div>
                        <div className="flex w-full gap-10">
                            <div className="flex">
                                <table className="table table-sm md:table-md table-pin-rows">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>DATE</th>
                                            <th>DESCRIPTION</th>
                                            <th>AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {receives?.map((receive, index) => (
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>{receive.date}</td>
                                                <td className='capitalize'>{receive.name}, {receive.note}</td>
                                                <td>{(receive.amount ?? 0).toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                        {allPProducts?.map((purse, index) => (
                                            <tr key={index}>
                                               <td>{(receives?.length || 0) + index + 1}</td>
                                                <td>{purse.date}</td>
                                                <td className='capitalize'>{purse.supplier}, {purse.productName}, {purse.productQty}</td>
                                                <td>{(purse.costPrice * purse.productQty).toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}

                                    </tbody>
                                    <tfoot>
                                        <tr className='font-semibold'>
                                            <td></td>
                                            <td></td>
                                            <td>TOTAL DEBIT</td>
                                            <td>{Number((totalDebit() + totalSale()).toFixed(2)).toLocaleString('en-IN')}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div className='flex'>
                                <table className="table table-sm md:table-md table-pin-rows">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>DATE</th>
                                            <th>DESCRIPTION</th>
                                            <th>AMOUNT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((payment, index) => (
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>{payment.date}</td>
                                                <td className='capitalize'>{payment.name} {payment.note}</td>
                                                <td>{(payment.amount ?? 0).toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                        {allProducts.map((sales, index) => (
                                            <tr key={index}>
                                                <td>{(payments?.length || 0) + index + 1}</td>
                                                <td>{sales.date}</td>
                                                <td className='capitalize'>{sales.customer}, {sales.productName}, {sales.productQty}</td>
                                                <td>{(sales.dpRate * sales.productQty).toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>

                                        <tr className='font-semibold'>
                                            <td></td>
                                            <td></td>
                                            <td>TOTAL CREDIT</td>
                                            <td>{Number((totalCredit() + totalPurse()).toFixed(2)).toLocaleString('en-IN')}</td>
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

export default DayBook