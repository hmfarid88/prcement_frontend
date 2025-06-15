"use client"
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { useAppSelector } from "@/app/store";
import Select from "react-select";

const TransportPayment = () => {
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
  const [transport, setTransport] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleTransportPayment = async (e: any) => {
    e.preventDefault();
    if (!transport || !amount || !note) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/paymentApi/transportPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, transport, note, amount, username }),
      });

      if (response.ok) {
        toast.success("Payment successfull !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setNote("");
      setAmount("");
    }
  };

  const [transportOption, setTransportOption] = useState([]);
     useEffect(() => {
 
         fetch(`${apiBaseUrl}/api/getTransport?username=${username}`)
             .then(response => response.json())
             .then(data => {
                 const transformedData = data.map((item: any) => ({
                     id: item.id,
                     value: item.transport,
                     label: item.transport
                 }));
                 setTransportOption(transformedData);
             })
             .catch(error => console.error('Error fetching products:', error));
 
     }, [apiBaseUrl, username, transport]);

  return (
    <div className='flex flex-col gap-2 items-center justify-center p-2'>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">DATE</span>
        </div>
        <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-bordered bg-white text-black  w-full max-w-xs h-[38px]" />
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">PICK TRANSPORT</span>
        </div>
        <Select className="text-black" name="transport" onChange={(selectedOption: any) => setTransport(selectedOption.value)} options={transportOption} />
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">PAYMENT NOTE</span>
        </div>
        <input type="text" name='note' value={note} onChange={(e) => setNote(e.target.value)} placeholder="Type here" className="input input-bordered text-black bg-white w-full max-w-xs h-[38px]" />
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">PAYMENT AMOUNT</span>
        </div>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Type here" className="input input-bordered text-black bg-white w-full max-w-xs h-[38px]" />
      </label>

      <label className="form-control w-full max-w-xs pt-3">
        <button onClick={handleTransportPayment} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
      </label>
    </div>
  )
}

export default TransportPayment