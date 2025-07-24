"use client"
import React, { useEffect, useState } from 'react'
import { FaRegEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Select from "react-select";
import { useRouter } from 'next/navigation';

const AddEmployee = () => {

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);
    const router = useRouter();

    const [employeeName, setEmployeeName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [employee, setEmployee] = useState("");

    const handleEdit = (e: any) => {
        e.preventDefault();
        if (!employee) {
            toast.warning("Employee name  is required !");
            return;
        }
        router.push(`/employee-edit?employeeName=${encodeURIComponent(employee)}`);
        setEmployee("");
    }
    const handleUserAdd = async () => {

        try {
            const response = await fetch(`${apiBaseUrl}/auth/addNewUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: 'employee@gmail.com', username: employeeName, password: 'prcement', roles: 'ROLE_SALES' }),
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
    
        }, [apiBaseUrl, employeeName]);
    return (
        <div className='container'>
            <div className="flex flex-col w-full items-center p-2">
                <div className="overflow-x-auto">
                    <div className="flex w-full items-end justify-end">
                        <a href="#employee_edit" className="btn btn-square btn-ghost"><FaRegEdit size={24} /></a>
                    </div>
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
            <div className="modal sm:modal-middle" role="dialog" id="employee_edit">
                <div className="modal-box">
                    <div className="flex w-full gap-5 p-2 h-72">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">EMPLOYEE NAME</span>
                            </div>
                            <Select className="text-black" name="retailer" onChange={(selectedOption: any) => setEmployee(selectedOption.value)} options={employeeOption} />
                        </label>
                        <div className='pt-9'><button onClick={handleEdit} className="btn btn-sm btn-success">GO</button></div>
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

export default AddEmployee