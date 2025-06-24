"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Select from "react-select";
import { useSearchParams } from 'next/navigation';


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const searchParams = useSearchParams();
    const employee = searchParams.get('employeeName');
    const [pending, setPending] = useState(false);

    const [id, setId] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [address, setAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        if (!employee) return;
        fetch(`${apiBaseUrl}/api/getEmployeeInfoByEmployee?employeeName=${employee}`)
            .then(response => response.json())
            .then(data => {
                setId(data.id);
                setEmployeeName(data.employeeName);
                setFatherName(data.fatherName);
                setAddress(data.address);
                setPhoneNumber(data.phoneNumber);

            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, employee]);

    const handleUpdateSubmit = async (e: any) => {
        e.preventDefault();
        if (!employeeName || !fatherName || !address || !phoneNumber) {
            toast.warning("Item is empty !")
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/updateEmployeeInfo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employeeName, fatherName, address, phoneNumber }),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                toast.success("Information updated successfully.");

            }

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setPending(false);

        }
    };
 const handleDeleteSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiBaseUrl}/api/deleteEmployeeById/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (!response.ok) {
                // const error = await response.json();
                toast.error("Sorry, employee is not deleted!");
            } else {
                toast.success("Employee deleted successfully.");

            }

        } catch (error: any) {
            toast.error(error.message)
        }
    }
    const [personOption, setPersonOption] = useState([]);
    useEffect(() => {

        fetch(`${apiBaseUrl}/api/getEmployeeInfo`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.employeeName,
                    label: item.employeeName
                }));
                setPersonOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl]);


    return (
        <div className='container-2xl min-h-screen pb-5'>
            <div className="flex flex-col w-full items-center justify-center p-2">

                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">EMPLOYEE NAME</span>
                    </div>
                    <input type='text' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                </label>

                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">FATHER NAME</span>
                    </div>
                    <input type='text' name='father' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">ADDRESS</span>
                    </div>
                    <input type='text' name='zilla' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">PHONE NUMBER</span>
                    </div>
                    <input type='text' name='area' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder='Type Here' />
                </label>

                <label className="form-control w-full max-w-xs pt-5">
                    <button
                        className="btn btn-success w-full"
                        onClick={(e) => {
                            if (window.confirm("Are you sure you want to update this item?")) {
                                handleUpdateSubmit(e);
                            }
                        }}
                        disabled={pending}
                    >
                        {pending ? "Updating..." : "UPDATE"}
                    </button>

                </label>
            </div>
            <div className="flex items-center justify-center p-2">
                <label className="form-control w-full max-w-xs pt-5">
                    <button className="btn btn-error"
                        onClick={(e) => {
                            if (window.confirm("Are you sure you want to delete this item?")) {
                                handleDeleteSubmit(e);
                            }
                        }}

                    >
                        DELETE THIS ITEM
                    </button>

                </label>
            </div>
        </div>
    )
}

export default Page