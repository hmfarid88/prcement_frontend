"use client"
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { useAppSelector } from "@/app/store";
import Select from "react-select";


const SupplierCommission = () => {
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
    const [supplierName, setSupplierName] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [amount, setPaymentAmount] = useState("");
    const [note, setPaymentNote] = useState("");

    const handleSupplierPayment = async (e: any) => {
        e.preventDefault();
        if (!supplierName || !month || !year || !amount) {
            toast.warning("Item is empty !");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/paymentApi/supplierCommission`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date, supplierName, month, year, amount, note, username }),
            });

            if (response.ok) {
                toast.success("Payment added successfully !");
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Invalid transaction !")
        } finally {
            setPending(false);
            setPaymentNote("");
            setPaymentAmount("");
        }
    };

    const [supplierOption, setSupplierOption] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getSuppliersName?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.supplierName,
                    label: item.supplierName
                }));
                setSupplierOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    return (
        <div className='flex flex-col gap-2 items-center justify-center p-2'>
       
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">DATE</span>
                    </div>
                    <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-bordered bg-white text-black h-[38px]  w-full max-w-xs" />
                </label>

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">PICK SUPPLIER</span>
                    </div>
                    <Select className="text-black" name="supplier" onChange={(selectedOption: any) => setSupplierName(selectedOption.value)} options={supplierOption} />
                </label>

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">SELECT YEAR</span>
                    </div>
                    <select className='select select-bordered bg-white text-black' onChange={(e: any) => { setYear(e.target.value) }}>
                        <option selected disabled>Select . . .</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                        <option value="2030">2030</option>
                    </select>
                </label>

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">SELECT MONTH</span>
                    </div>
                    <select className='select select-bordered bg-white text-black' onChange={(e: any) => { setMonth(e.target.value) }}>
                        <option selected disabled>Select . . .</option>
                        <option value="1">JANUARY</option>
                        <option value="2">FEBRUARY</option>
                        <option value="3">MARCH</option>
                        <option value="4">APRIL</option>
                        <option value="5">MAY</option>
                        <option value="6">JUNE</option>
                        <option value="7">JULY</option>
                        <option value="8">AUGUST</option>
                        <option value="9">SEPTEMBER</option>
                        <option value="10">OCTOBER</option>
                        <option value="11">NOVEMBER</option>
                        <option value="12">DECEMBER</option>
                    </select>
                </label>

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">PAYMENT NOTE</span>
                    </div>
                    <input type="text" value={note} onChange={(e) => setPaymentNote(e.target.value)} placeholder="Type here" className="input input-bordered bg-white text-black h-[38px] w-full max-w-xs" />
                </label>

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">PAYMENT AMOUNT</span>
                    </div>
                    <input type="number" value={amount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Type here" className="input input-bordered bg-white text-black h-[38px] w-full max-w-xs" />
                </label>

                <label className="form-control w-full max-w-xs pt-3">
                    <button onClick={handleSupplierPayment} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
                </label>
        </div>
    )
}

export default SupplierCommission