"use client"
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { useAppSelector } from "@/app/store";
import { FcPlus } from 'react-icons/fc';
import Select from "react-select";

const Expense = () => {
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

  // expense
  const [expenseId, setExpenseId] = useState("");
  const [expense, setExpense] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [expensAmount, setExpenseAmount] = useState("");

  const handleExpenseAdd = async (e: any) => {
    e.preventDefault();
    if (!expense) {
      toast.warning("Name is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/addExpenseName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expenseName:expense, username }),
      });

      if (response.ok) {
        toast.success("Expense added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid name !")
    } finally {
      setPending(false);
      setExpense("");
     
    }
  };
  const handleExpenseSubmit = async (e: any) => {
    e.preventDefault();
    if (!expenseName || !expenseNote || !expensAmount) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/paymentApi/expenseRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, expenseName, expenseNote, amount: expensAmount, username }),
      });

      if (response.ok) {
        toast.success("Expense added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setExpenseNote("");
      setExpenseAmount("");
    }
  };
  const [itemOption, setItemOption] = useState([]);
  useEffect(() => {
    const fetchMadeProducts = () => {
      fetch(`${apiBaseUrl}/api/getExpenseName?username=${username}`)
        .then(response => response.json())
        .then(data => {
          const transformedData = data.map((product: any) => ({
            value: product.expenseName,
            label: product.expenseName
          }));
          setItemOption(transformedData);
        })
        .catch(error => console.error('Error fetching products:', error));
    };

    // Fetch data initially
    fetchMadeProducts();
  }, [apiBaseUrl, username, expense, expenseId]);

   const handleExpenseNameDelete = async (e: any) => {
          e.preventDefault();
          try {
              const response = await fetch(`${apiBaseUrl}/api/deleteExpenseName?expenseName=${encodeURIComponent(expenseId)}`, {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                });
  
              if (!response.ok) {
                  const error = await response.json();
                  toast.error(error.message);
                  // toast.error("Sorry, name is not deleted!");
              } else {
                  toast.success("Name deleted successfully.");
  
              }
  
          } catch (error: any) {
              toast.error(error.message)
          }
      }
  return (
    <div className='flex flex-col gap-2 items-center justify-center p-2'>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">DATE</span>
        </div>
        <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-bordered text-black bg-white w-full max-w-xs h-[38px]" />
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">EXPENSE NAME</span>
          <a href="#expense_add" className="btn btn-xs btn-circle btn-ghost"><FcPlus size={20} /></a>
        </div>
        <Select className="text-black w-full" name="payment" onChange={(selectedOption: any) => setExpenseName(selectedOption.value)} options={itemOption} />
        {/* <select className='select select-bordered text-black bg-white' onChange={(e: any) => { setExpenseName(e.target.value) }}>
          <option selected disabled>Select . . .</option>
          <option value="OFFICE COST">OFFICE COST</option>
          <option value="OIL COST">OIL COST</option>
          <option value="MOTORCYCLE COST">MOTORCYCLE COST</option>
          <option value="MOBILE BILL">MOBILE BILL</option>
          <option value="INCENTIVE">INCENTIVE</option>
          <option value="TRANSPORT COST">TRANSPORT COST</option>
          <option value="OTHERS">OTHERS</option>
        </select> */}

      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">EXPENSE NOTE</span>
        </div>
        <input type="text" name='note' autoComplete='note' value={expenseNote} onChange={(e) => setExpenseNote(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs text-black bg-white h-[38px]" />
      </label>

      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text-alt">EXPENSE AMOUNT</span>
        </div>
        <input type="number" value={expensAmount} onChange={(e) => setExpenseAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs text-black bg-white h-[38px]" />
      </label>


      <label className="form-control w-full max-w-xs pt-3">
        <button onClick={handleExpenseSubmit} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
      </label>
      <div className="modal sm:modal-middle" role="dialog" id="expense_add">
        <div className="modal-box">
          <div className="flex w-full items-center justify-center p-2">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">ADD EXPENSE NAME</span>
              </div>
              <div className="flex items-center justify-between">
                <input type="text" value={expense} name="expense" onChange={(e: any) => setExpense(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                <button onClick={handleExpenseAdd} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
              </div>
            </label>
          </div>
          <div className="flex w-full justify-center pt-5">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">DELETE EXPENSE NAME</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Select className="text-black w-full" name="payment" onChange={(selectedOption: any) => setExpenseId(selectedOption.value)} options={itemOption} />
                <button onClick={handleExpenseNameDelete} className="btn btn-sm btn-square btn-error">X</button>
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

export default Expense