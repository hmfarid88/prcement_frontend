"use client"
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


const ClosingSetup = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [maxDate, setMaxDate] = useState('');
    const [pending, setPending] = useState(false);
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
    }, []);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            toast.warning("Start date and end date required !");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/closingSetup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ startDate, endDate }),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                toast.success("Closing date added successfully !");
            }

        } catch (error) {
            toast.error("Invalid employee item !")
        } finally {
            setPending(false);
            setStartDate("");
            setEndDate("");

        }

    };

    return (
        <div className='flex flex-col w-full items-center justify-center p-2'>
            <div className="overflow-x-auto">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">START DATE</span>
                    </div>
                    <input
                        type="date"
                        name="date"
                        onChange={(e: any) => setStartDate(e.target.value)}

                        value={startDate}
                        className="input input-bordered bg-white text-black"
                    />
                </label>

                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">END DATE</span>
                    </div>
                    <input
                        type="date"
                        name="date"
                        onChange={(e: any) => setEndDate(e.target.value)}

                        value={endDate}
                        className="input input-bordered bg-white text-black"
                    />
                </label>

                <label className="form-control w-full max-w-xs pt-3">
                    <button onClick={handleSubmit} className='btn btn-success' disabled={pending} >{pending ? "Adding..." : "ADD"}</button>
                </label>
            </div>
        </div>
    );
};

export default ClosingSetup;