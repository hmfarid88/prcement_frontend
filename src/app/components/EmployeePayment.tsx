"use client"
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { useAppSelector } from "@/app/store";
import Select from "react-select";


const EmployeePayment = () => {
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
    const [employeeName, setEmployeeName] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [amount, setPaymentAmount] = useState("");
    const [note, setPaymentNote] = useState("");

    const handleEmployeePayment = async (e: any) => {
        e.preventDefault();
        if (!employeeName || !month || !year || !amount) {
            toast.warning("Item is empty !");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/paymentApi/employeePayment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date, employeeName, month, year, amount, note, username }),
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
            setMonth("")
            setPaymentNote("");
            setPaymentAmount("");
        }
    };

    const [employeeOption, setEmployeeOption] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getEmployeeInfo`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.employeeName,
                    label: item.employeeName
                }));
                setEmployeeOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    const [totalValue, setTotalValue] = useState(0);

    const handleMonthChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMonth = e.target.value;
        setMonth(selectedMonth);

        if (!employeeName || !year || !selectedMonth) {
            setTotalValue(0);
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/paymentApi/employee-total-taken?username=${username}&employeeName=${employeeName}&year=${year}&month=${selectedMonth}`);
            const data = await response.json();

            setTotalValue(data || 0);
        } catch (error) {
            console.error("Error fetching data:", error);
            setTotalValue(0);
        }
    }

    return (
        <div className='flex flex-col gap-2 items-center justify-center p-2'>
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">DATE</span>
                </div>
                <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="border rounded-md p-2 mt-1.5 bg-white text-black  w-full max-w-xs h-[40px]" />
            </label>

            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">PICK EMPLOYEE</span>
                </div>
                <Select className="text-black" name="employee" onChange={(selectedOption: any) => setEmployeeName(selectedOption.value)} options={employeeOption} />
            </label>

            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">SELECT YEAR</span>
                </div>
                <select className='select select-bordered text-black bg-white' onChange={(e: any) => { setYear(e.target.value) }}>
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
                <select className='select select-bordered text-black bg-white' value={month} onChange={handleMonthChange}>
                    <option value="" selected disabled>Select . . .</option>
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
            {totalValue > 0 && (
                <p className='pl-2 text-success font-bold'>Total Taken : {totalValue}</p>
            )}
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">PAYMENT NOTE</span>
                </div>
                <input type="text" name='note' value={note} onChange={(e) => setPaymentNote(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs text-black bg-white" />
            </label>

            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">PAYMENT AMOUNT</span>
                </div>
                <input type="number" value={amount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs text-black bg-white" />
            </label>

            <label className="form-control w-full max-w-xs pt-3">
                <button onClick={handleEmployeePayment} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
            </label>
        </div>
    )
}

export default EmployeePayment