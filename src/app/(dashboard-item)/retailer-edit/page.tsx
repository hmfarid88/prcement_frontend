"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Select from "react-select";
import { useSearchParams } from 'next/navigation';


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const searchParams = useSearchParams();
    const retailer = searchParams.get('retailerName');
    const [pending, setPending] = useState(false);

    const [id, setId] = useState("");
    const [retailerName, setRetailerName] = useState("");
    const [retailerCode, setRetailerCode] = useState("");
    const [thanaName, setThanaName] = useState("");
    const [zillaName, setZillaName] = useState("");
    const [areaName, setAreaName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [salesPerson, setSalesPerson] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (!retailer) return;
        fetch(`${apiBaseUrl}/api/getRetailerInfoByRetailer?retailerName=${retailer}`)
            .then(response => response.json())
            .then(data => {
                setId(data.id);
                setRetailerName(data.retailerName);
                setRetailerCode(data.retailerCode);
                setThanaName(data.thanaName);
                setZillaName(data.zillaName);
                setAreaName(data.areaName);
                setMobileNumber(data.mobileNumber);
                setSalesPerson(data.salesPerson);
                setStatus(data.status);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, retailer]);

    const handleUpdateSubmit = async (e: any) => {
        e.preventDefault();
        if (!retailerName || !retailerCode || !thanaName || !zillaName || !areaName || !mobileNumber || !salesPerson || !status) {
            toast.warning("Item is empty !")
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/updateRetailerInfo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ retailerName, retailerCode, thanaName, zillaName, areaName, mobileNumber, salesPerson, status }),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                toast.success("Information updated successfully.");
               
            }

        } catch (error:any) {
            toast.error(error.message)
        } finally {
            setPending(false);
           
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


    return (
        <div className='container-2xl min-h-screen pb-5'>
            <div className="flex flex-col w-full items-center justify-center p-2">

                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">RETAILER NAME</span>
                    </div>
                    <input type='text' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={retailerName} onChange={(e) => setRetailerName(e.target.value)} />
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
                    <div className="flex justify-between gap-2">
                        <p className='capitalize w-[50%] p-2 bg-white text-black rounded-md'>{salesPerson}</p>
                        <Select className="text-black w-[50%]" onChange={(selectedOption: any) => setSalesPerson(selectedOption.value)} options={personOption} />
                    </div>
                </label>

                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">STATUS</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <p className='capitalize w-[50%] p-2 bg-white text-black rounded-md'>{status}</p>
                        <select className='select select-sm select-bordered h-[40px] w-[50%] bg-white text-black rounded-md' onChange={(e: any) => { setStatus(e.target.value) }}>
                            <option selected disabled>Select . . .</option>
                            <option value="Active">Active</option>
                            <option value="Deactive">Deactive</option>

                        </select>
                    </div>
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

        </div>
    )
}

export default Page