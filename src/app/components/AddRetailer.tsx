"use client"
import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { toast } from 'react-toastify';
import { FaRegEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';

const AddRetailer = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [retailerName, setRetailerName] = useState("");
    const [retailerCode, setRetailerCode] = useState("");
    const [thanaName, setThanaName] = useState("");
    const [zillaName, setZillaName] = useState("");
    const [areaName, setAreaName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [salesPerson, setSalesPerson] = useState("");
    const [retailer, setRetailer] = useState("");
    const handleEdit = (e: any) => {
        e.preventDefault();
        if (!retailer) {
            toast.warning("Retailer name  is required !");
            return;
        }
        router.push(`/retailer-edit?retailerName=${retailer}`);
        setRetailer("");
    }
    const handleRetailerSubmit = async (e: any) => {
        e.preventDefault();
        if (!retailerName || !retailerCode || !thanaName || !zillaName || !areaName || !mobileNumber || !salesPerson) {
            toast.warning("Item is empty !")
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addRetailerInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ retailerName, retailerCode, thanaName, zillaName, areaName, mobileNumber, salesPerson, status: 'Active' }),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                toast.success("Retailer added successfully !");
            }

        } catch (error) {
            toast.error("Invalid retailer item !")
        } finally {
            setPending(false);
            setRetailerName("")
            setRetailerCode("")
            setThanaName("")
            setZillaName("")
            setAreaName("")
            setMobileNumber("")
            setSalesPerson("")
        }
    };
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
    const [retailerOption, setRetailerOption] = useState([]);
    useEffect(() => {

        fetch(`${apiBaseUrl}/api/getRetailerInfo`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.retailerName,
                    label: `${item.retailerName} (${item.retailerCode})`
                }));
                setRetailerOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, retailerName]);
    return (
        <div className='container'>

            <div className="flex flex-col w-full items-center p-2">
                <div className="overflow-x-auto">
                    <div className="flex w-full items-end justify-end">
                        <a href="#my_modal_retailer_edit" className="btn btn-square btn-ghost"><FaRegEdit size={24} /></a>
                    </div>
                    <label className="form-control w-full max-w-xs pt-2">
                        <div className="label">
                            <span className="label-text-alt">RETAILER NAME</span>
                        </div>
                        <input type='text' name='retailer' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={retailerName} onChange={(e) => setRetailerName(e.target.value)} placeholder='Type Here' />
                    </label>
                    <label className="form-control w-full max-w-xs pt-2">
                        <div className="label">
                            <span className="label-text-alt">RETAILER CODE</span>
                        </div>
                        <input type='text' name='code' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={retailerCode} onChange={(e) => setRetailerCode(e.target.value)} placeholder='Type Here' />
                    </label>
                    <label className="form-control w-full max-w-xs pt-2">
                        <div className="label">
                            <span className="label-text-alt">THANA NAME</span>
                        </div>
                        <input type='text' name='thana' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={thanaName} onChange={(e) => setThanaName(e.target.value)} placeholder='Type Here' />
                    </label>
                    <label className="form-control w-full max-w-xs pt-2">
                        <div className="label">
                            <span className="label-text-alt">ZILLA NAME</span>
                        </div>
                        <input type='text' name='zilla' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={zillaName} onChange={(e) => setZillaName(e.target.value)} placeholder='Type Here' />
                    </label>
                    <label className="form-control w-full max-w-xs pt-2">
                        <div className="label">
                            <span className="label-text-alt">AREA NAME</span>
                        </div>
                        <input type='text' name='area' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={areaName} onChange={(e) => setAreaName(e.target.value)} placeholder='Type Here' />
                    </label>
                    <label className="form-control w-full max-w-xs pt-2">
                        <div className="label">
                            <span className="label-text-alt">MOBILE NUMBER</span>
                        </div>
                        <input type='text' maxLength={11} minLength={11} className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={mobileNumber} onChange={(e: any) => setMobileNumber(e.target.value.replace(/\D/g, ""))} placeholder='Type Here' />
                    </label>
                    <label className="form-control w-full max-w-xs pt-2">
                        <div className="label">
                            <span className="label-text-alt">SALES PERSON</span>
                        </div>
                        <Select className="text-black" name="sales person" onChange={(selectedOption: any) => setSalesPerson(selectedOption.value)} options={personOption} />

                    </label>
                    <label className="form-control w-full max-w-xs pt-5">
                        <button className="btn btn-success rounded-md btn-sm h-[40px] w-full max-w-xs" onClick={handleRetailerSubmit} disabled={pending} >{pending ? "Submitting..." : "ADD RETAILER"}</button>
                    </label>
                </div>
            </div>
            <div className="modal sm:modal-middle" role="dialog" id="my_modal_retailer_edit">
                <div className="modal-box">
                    <div className="flex w-full gap-5 p-2 h-72">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">RETAILER NAME</span>
                            </div>
                            <Select className="text-black" name="retailer" onChange={(selectedOption: any) => setRetailer(selectedOption.value)} options={retailerOption} />
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

export default AddRetailer