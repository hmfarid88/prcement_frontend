"use client";
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../store';
import { HiCurrencyBangladeshi } from "react-icons/hi";
import { FcShipped, FcOrganization, FcShop, FcBullish  } from "react-icons/fc";

const HomeSummary = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const [date, setDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setDate(formattedDate)
  }, []);

  const [productStock, setProductStock] = useState<number>(0);
  const [totalValue, setTotalValue] = useState<number>(0);
  const [monthlyTotalValue, setMonthlyTotalValue] = useState<number>(0);
  const [totalDistValue, setTotalDistValue] = useState<number>(0);
  const [totalCollection, setTotalCollection] = useState<number>(0);
  const [payValue, setPayValue] = useState<number>(0);
  const [recvValue, setRecvValue] = useState<number>(0);

  const dashboardData = [
    { id: 1, title: "Product Stock" },
    { id: 2, title: "Today's Delivery" },
    { id: 3, title: "Monthly Delivery" },
    { id: 4, title: "Achieve" },
    { id: 5, title: "Cash Balance" }
  ];

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
      .then(response => response.json())
      .then(data => {
        // Create an object to store remaining quantities by productName
        const productStockByName = data.reduce((acc: { [key: string]: number }, product: { productName: string; remainingQty: number; }) => {
          // Accumulate the remainingQty for each productName
          if (acc[product.productName]) {
            acc[product.productName] += product.remainingQty;
          } else {
            acc[product.productName] = product.remainingQty;
          }
          return acc;
        }, {});

        // Set the state with the grouped data
        setProductStock(productStockByName);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getTotalSoldToday`)
      .then(response => response.json())
      .then(data => {
        setTotalValue(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getSoldProduct?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const total = data.reduce((total: number, product: { productQty: number }) => {
          return total + (product.productQty);
        }, 0);
        setMonthlyTotalValue(total);
      })
      .catch(error => console.error('Error fetching sales:', error));
  }, [apiBaseUrl, username]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/retailer/retailerBalance`)
      .then(response => response.json())
      .then(data => {
        const distTotal = data.reduce((total: number, payment: { totalProductValue: number }) => {
          return total + payment.totalProductValue;
        }, 0);
        const payTotal = data.reduce((total: number, payment: { totalPayment: number }) => {
          return total + payment.totalPayment;
        }, 0);
        setTotalDistValue(distTotal);
        setTotalCollection(payTotal)
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl]);

   
  useEffect(() => {
    fetch(`${apiBaseUrl}/paymentApi/payments/today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => {
        const payTotal = data.reduce((total: number, payment: { amount: number }) => {
          return total + payment.amount;
        }, 0);
        setPayValue(payTotal);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/paymentApi/receives/today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => {
        const recevTotal = data.reduce((total: number, payment: { amount: number }) => {
          return total + payment.amount;
        }, 0);
        setRecvValue(recevTotal);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

 
  const [netSumAmount, setNetSumAmount] = useState(0);
  useEffect(() => {
    fetch(`${apiBaseUrl}/paymentApi/net-sum-before-today?username=${username}&date=${date}`)
      .then(response => response.json())
      .then(data => setNetSumAmount(data.netSumAmount))
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, date, username]);

  return (
    <div className='flex flex-col md:flex-row gap-5 p-4 items-center justify-center w-full'>
      {dashboardData?.map((item) =>
        <div key={item.id} className="card shadow-md shadow-slate-700 border border-accent text-center font-bold h-32 w-60 p-2">
          {item.title === "Product Stock" ? (
            <div className='flex flex-col items-center justify-center'>
              <p> {item.title}</p><FcOrganization size={32} />
              <div className='text-left'>
                {Object.entries(productStock).map(([productName, remainingQty]) => (
                  <p key={productName} className='flex justify-between text-sm'>
                    <span>{productName}: </span>
                    <span className='font-bold'> {remainingQty.toLocaleString('en-IN')}</span>
                  </p>
                ))}
              </div>
            </div>
          ) : item.title === "Today's Delivery" ? (
            <div className='flex flex-col items-center justify-center'>
              <p>{item.title}</p><FcShipped size={32} />
              <p className='flex text-lg font-bold gap-2'> {Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</p>
            </div>
          ) : item.title === "Monthly Delivery" ? (
            <div className='flex flex-col items-center justify-center'>
              <p>{item.title}</p><FcShop size={32} />
              <p className='flex text-lg font-bold gap-2'> {Number(monthlyTotalValue.toFixed(2)).toLocaleString('en-IN')}</p>
            </div>
          ) : item.title === "Achieve" ? (
            <div className='flex flex-col items-center justify-center'>
              <p>{item.title}</p><FcBullish size={32} />
              <p className='flex text-lg font-bold gap-2'> {Number((totalCollection*100/totalDistValue).toFixed(2))} %</p>
            </div>
          ) : item.title === "Cash Balance" ? (
            <div className='flex flex-col items-center justify-center'>
              <p>{item.title}</p><HiCurrencyBangladeshi className='text-accent' size={32} />
              <p className='flex text-lg font-bold gap-2'> {Number((((netSumAmount + recvValue) - payValue)).toFixed(2)).toLocaleString('en-IN')}</p>
            </div>
          ) : (
            <p>{item.title}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default HomeSummary