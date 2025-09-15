"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Select from "react-select";
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/app/store';


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
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
    const [productName, setProductName] = useState("");
    const [dpRate, setDpRate] = useState("");
    const [productQty, setProductQty] = useState("");
    const [customer, setCustomer] = useState("");
    const [transport, setTransport] = useState("");
    const [truckNo, setTruckNo] = useState("");
    const [rent, setRent] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (!productId) return;
        fetch(`${apiBaseUrl}/api/getSaleInfo/${productId}`)
            .then(response => response.json())
            .then(data => {
                setDate(data.date);
                setProductName(data.productName);
                setDpRate(data.dpRate);
                setProductQty(data.productQty);
                setCustomer(data.customer);
                setTransport(data.transport);
                setTruckNo(data.truckNo);
                setRent(data.rent);
                setNote(data.note);

            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, productId]);

    const handleUpdateSubmit = async (e: any) => {
        e.preventDefault();
        if (!productId || !date || !productName || !dpRate || !productQty || !customer || !truckNo || !note) {
            toast.warning("Item is empty !")
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/updateSaleInfo/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, date, productName, dpRate, productQty, customer, transport, truckNo, rent, note }),
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
            const response = await fetch(`${apiBaseUrl}/api/deleteProductSale/${productId}`, {
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

    const [itemOption, setItemOption] = useState([]);
    useEffect(() => {

        const fetchMadeProducts = () => {
            fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
                .then(response => response.json())
                .then(data => {
                    const transformedData = data.map((product: any) => ({
                        value: product.productName,
                        label: `${product.productName} (${product.remainingQty}, ${product.costPrice.toFixed(2)})`
                    }));
                    setItemOption(transformedData);
                })
                .catch(error => console.error('Error fetching products:', error));
        };

        // Fetch data initially
        fetchMadeProducts();
    }, [apiBaseUrl, username]);

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

    }, [apiBaseUrl]);

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
                        <span className="label-text-alt">RETAILER</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <p className='capitalize w-[50%] p-2 bg-white text-black rounded-md'>{customer}</p>
                        <Select className="text-black w-[50%]" name="retailer" onChange={(selectedOption: any) => setCustomer(selectedOption.value)} options={retailerOption} />
                    </div>
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">PRODUCT NAME</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <p className='capitalize w-[50%] p-2 bg-white text-black rounded-md'>{productName}</p>
                        <Select className="text-black w-[50%]" name="pname" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={itemOption} />
                    </div>
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">PRODUCT RATE</span>
                    </div>
                    <input type='number' step="any" name='rate' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={dpRate} onChange={(e) => setDpRate(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">QUANTITY</span>
                    </div>
                    <input type='number' step="any" name='qty' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={productQty} onChange={(e) => setProductQty(e.target.value)} placeholder='Type Here' />
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
                        <span className="label-text-alt">TRUCK NO</span>
                    </div>
                    <input type='text' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={truckNo} onChange={(e: any) => setTruckNo(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">TRUCK RENT</span>
                    </div>
                    <input type='number' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={rent} onChange={(e: any) => setRent(e.target.value)} placeholder='Type Here' />
                </label>

                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">NOTE</span>
                    </div>
                    <input type='text' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={note} onChange={(e: any) => setNote(e.target.value)} placeholder='Type Here' />
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