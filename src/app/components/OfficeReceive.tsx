"use client"
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import Select from "react-select";
import { useAppSelector } from '@/app/store';
import { FcPlus } from 'react-icons/fc';

const OfficeReceive = () => {
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [pending, setPending] = useState(false);
  const [date, setDate] = useState("");
  const [maxDate, setMaxDate] = useState('');
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
    setDate(formattedDate);
  }, []);
  const [receiveName, setReceiveName] = useState("");
  const [receiveNote, setReceiveNote] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");

  const [paymentPerson, setPaymentPerson] = useState("");
  const handlePaymentNameAdd = async (e: any) => {
    e.preventDefault();
    if (!paymentPerson) {
      toast.warning("Name is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/addPaymentName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentPerson, username }),
      });

      if (response.ok) {
        toast.success("Name added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid payment name !")
    } finally {
      setPending(false);
      setPaymentPerson("");
    }
  };
  const handleReceiveSubmit = async (e: any) => {
    e.preventDefault();
    if (!receiveName || !receiveAmount) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/paymentApi/officeReceive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, receiveName, receiveNote, amount: receiveAmount, username }),
      });

      if (response.ok) {
        toast.success("Amount added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setReceiveNote("");
      setReceiveAmount("");
    }
  };
  const [paymentPersonOption, setPaymentPersonOption] = useState([]);
  useEffect(() => {

    fetch(`${apiBaseUrl}/api/getPaymentPerson?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.id,
          value: item.paymentPerson,
          label: item.paymentPerson
        }));
        setPaymentPersonOption(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));

  }, [apiBaseUrl, username, paymentPerson]);
  return (
    <div className='flex flex-col gap-2 items-center justify-center p-2'>
     
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">DATE</span>
          </div>
          <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-bordered bg-white text-black  w-full max-w-xs h-[40px]" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">RECEIVE NAME</span>
            <a href="#addReceiveName" className="btn btn-xs btn-circle btn-ghost"><FcPlus size={20} /></a>
          </div>
          <Select className="text-black" name="catagory" onChange={(selectedOption: any) => setReceiveName(selectedOption.value)} options={paymentPersonOption} />

        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">RECEIVE NOTE</span>
          </div>
          <input type="text" name='receiveNote' autoComplete='receiveNote' value={receiveNote} onChange={(e) => setReceiveNote(e.target.value)} placeholder="Type here" className="input input-bordered bg-white text-black h-[38px] w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">RECEIVE AMOUNT</span>
          </div>
          <input type="number" value={receiveAmount} onChange={(e) => setReceiveAmount(e.target.value)} placeholder="Type here" className="input input-bordered bg-white text-black h-[38px] w-full max-w-xs" />
        </label>

        <label className="form-control w-full max-w-xs pt-3">
          <button onClick={handleReceiveSubmit} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
        </label>
        <div className="modal sm:modal-middle" role="dialog" id="addReceiveName">
          <div className="modal-box">
            <div className="flex w-full items-center justify-center p-2">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">ADD PAYMENT NAME</span>
                </div>
                <div className="flex items-center justify-between">
                  <input type="text" value={paymentPerson} name="supplierItem" onChange={(e: any) => setPaymentPerson(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                  <button onClick={handlePaymentNameAdd} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
                </div>
              </label>
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
  )
}

export default OfficeReceive