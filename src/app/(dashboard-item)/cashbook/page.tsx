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

const CashBook = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  const [netSumAmount, setNetSumAmount] = useState(0);

  useEffect(() => {
    fetch(`${apiBaseUrl}/paymentApi/net-sum-before-today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => setNetSumAmount(data.netSumAmount))
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });

  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/paymentApi/payments/today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => setPayments(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  const totalCredit = () => {
    return payments.reduce((debit, payment) => debit + (payment.amount), 0);
  };

  const [receives, setReceives] = useState<Receive[]>([]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/paymentApi/receives/today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => setReceives(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  const totalDebit = () => {
    return receives.reduce((credit, receive) => credit + (receive.amount), 0);
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
              <h4>CASH BOOK</h4>
              <h4>{date}</h4>
            </div>
            <div className="flex w-full justify-between font-bold p-5">
              <h4>DEBIT</h4>
              <h4>CREDIT</h4>
            </div>
            <div className="flex w-full gap-10">
              <div className="flex">
                <table className="table table-xs md:table-sm table-pin-rows">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>DESCRIPTION</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className='font-semibold'>
                      <td>{date}</td>
                      <td>BALANCE B/D</td>
                      <td>{(netSumAmount ?? 0).toLocaleString('en-IN')}</td>
                    </tr>
                    {receives?.map((receive, index) => (
                      <tr key={index}>
                        <td>{receive.date}</td>
                        <td className='capitalize'>{receive.name}, {receive.note}</td>
                        <td>{(receive.amount ?? 0).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    <tr className='font-semibold'>
                      <td colSpan={1}></td>
                      <td>TOTAL</td>
                      <td>{(totalDebit() + netSumAmount).toLocaleString('en-IN')}</td>
                    </tr>

                  </tbody>
                  <tfoot>
                    <tr className='font-semibold'>
                      <td></td>
                      <td>BALANCE B/D</td>
                      <td>{((totalDebit() + netSumAmount) - (totalCredit())).toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div>
                <table className="table table-xs md:table-sm table-pin-rows">

                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>DESCRIPTION</th>
                      <th>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.date}</td>
                        <td className='capitalize'>{payment.name} {payment.note}</td>
                        <td>{(payment.amount ?? 0).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    <tr className='font-semibold'>
                      <td>{date}</td>
                      <td>TOTAL CREDIT</td>
                      <td>{Number(totalCredit()).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className='font-semibold'>
                      <td>{date}</td>
                      <td>BALANCE C/D</td>
                      <td>{((totalDebit() + netSumAmount) - (totalCredit())).toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className='font-semibold'>
                      <td colSpan={1}></td>
                      <td>TOTAL</td>
                      <td>{(totalCredit() + ((totalDebit() + netSumAmount) - (totalCredit()))).toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
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

export default CashBook