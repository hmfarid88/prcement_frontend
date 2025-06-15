"use client"
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const AddEmployee = () => {

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);

    const [employeeName, setEmployeeName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleUserAdd = async () => {

        try {
            const response = await fetch(`${apiBaseUrl}/auth/addNewUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: 'employee@gmail.com', username: employeeName, password: 'charu2024', roles: 'ROLE_SALES' }),
            });

            if (response.ok) {
                // toast.success("Employee added successfully!");

            } else {
                const data = await response.json();
                toast.error(data.message || "Error adding user.");
            }
        } catch (error: any) {
            toast.error(error.message || "Error adding user.")
        }
    };

    const handleEmployeeSubmit = async (e: any) => {
        e.preventDefault();
        if (!employeeName || !fatherName || !address || !phoneNumber) {
            toast.warning("Item is empty !")
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addEmployeeInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employeeName, fatherName, address, phoneNumber }),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                await handleUserAdd();
                toast.success("Employee added successfully !");
            }

        } catch (error) {
            toast.error("Invalid employee item !")
        } finally {
            setPending(false);
            setEmployeeName("")
            setFatherName("")
            setAddress("")
            setPhoneNumber("")

        }
    };
    return (
        <div className='container'>
            <div className="flex flex-col w-full items-center p-2">
                <div className="overflow-x-auto">
                    <label className="form-control w-full max-w-xs pt-2">
                        <div className="label">
                            <span className="label-text-alt">EMPLOYEE NAME</span>
                        </div>
                        <input type='text' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} placeholder='Type Here' />
                    </label>
                    <label className="form-control w-full max-w-xs pt-2">
                        <div className="label">
                            <span className="label-text-alt">FATHER&apos;S NAME</span>
                        </div>
                        <input type='text' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder='Type Here' />
                    </label>
                    <label className="form-control w-full max-w-xs pt-2">
                        <div className="label">
                            <span className="label-text-alt">ADDRESS</span>
                        </div>
                        <input type='text' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Type Here' />
                    </label>

                    <label className="form-control w-full max-w-xs pt-2">
                        <div className="label">
                            <span className="label-text-alt">MOBILE NUMBER</span>
                        </div>
                        <input type='text' maxLength={11} minLength={11} className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={phoneNumber} onChange={(e: any) => setPhoneNumber(e.target.value.replace(/\D/g, ""))} placeholder='Type Here' />
                    </label>
                    <label className="form-control w-full max-w-xs pt-5">
                        <button className="btn btn-success rounded-md btn-sm h-[40px] w-full max-w-xs" onClick={handleEmployeeSubmit} disabled={pending} >{pending ? "Submitting..." : "ADD EMPLOYEE"}</button>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default AddEmployee