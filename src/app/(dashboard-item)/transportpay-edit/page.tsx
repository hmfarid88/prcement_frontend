"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/app/store';
import Select from "react-select";


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [pending, setPending] = useState(false);
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
    const [date, setDate] = useState("");
    const [transport, setTransport] = useState("");
    const [note, setNote] = useState("");
    const [amount, setAmount] = useState("");


    useEffect(() => {
        if (!id) return;
        fetch(`${apiBaseUrl}/paymentApi/getTransportPayInfo/${id}`)
            .then(response => response.json())
            .then(data => {
                setDate(data.date);
                setTransport(data.transport);
                setNote(data.note);
                setAmount(data.amount);

            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, id]);

    const handleUpdateSubmit = async (e: any) => {
        e.preventDefault();
        if (!id || !date || !transport || !note || !amount) {
            toast.warning("Item is empty !")
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/paymentApi/updateTransportPayInfo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, date, transport, note, amount }),
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
            const response = await fetch(`${apiBaseUrl}/api/deleteTransportPayById/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (!response.ok) {
                // const error = await response.json();
                toast.error("Sorry, item is not deleted!");
            } else {
                toast.success("Item deleted successfully.");

            }

        } catch (error: any) {
            toast.error(error.message)
        }
    }
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
        <div className='container-2xl min-h-screen pb-5'>
            <div className="flex flex-col w-full items-center justify-center p-2">

                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">DATE</span>
                    </div>
                    <div className="flex gap-2">
                        <input type='text' className='input input-md h-[40px] w-[50%] bg-white text-black border rounded-md border-slate-300' value={date} readOnly />
                        <input type='date' className='input input-bordered h-[40px] w-[50%] bg-white text-black' max={maxDate} onChange={(e) => setDate(e.target.value)} />
                    </div>
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">TRANSPORT</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <p className='capitalize w-[50%] p-2 bg-white text-black rounded-md'>{transport}</p>
                        <Select className="text-black w-[50%]" name="retailer" onChange={(selectedOption: any) => setTransport(selectedOption.value)} options={transportOption} />
                    </div>
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">NOTE</span>
                    </div>
                    <input type='text' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={note} onChange={(e: any) => setNote(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">AMOUNT</span>
                    </div>
                    <input type='number' step="any" name='rate' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='Type Here' />
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