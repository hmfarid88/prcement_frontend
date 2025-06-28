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
       
    }, []);
        const [date, setDate] = useState("");
        const [supplier, setSupplier] = useState("");
        const [productName, setProductName] = useState("");
        const [purchasePrice, setPurchasePrice] = useState("");
        const [productQty, setProductQty] = useState("");
        

    useEffect(() => {
        if (!productId) return;
        fetch(`${apiBaseUrl}/api/getProductEntry/${productId}`)
            .then(response => response.json())
            .then(data => {
                setDate(data.date);
                setSupplier(data.supplier);
                setProductName(data.productName);
                setPurchasePrice(data.purchasePrice);
                setProductQty(data.productQty);
             
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, productId]);

    const handleUpdateSubmit = async (e: any) => {
        e.preventDefault();
        if (!date || !supplier || !productName || !purchasePrice || !productQty) {
            toast.warning("Item is empty !")
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/updateEntryInfo/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date, supplier, productName, purchasePrice, productQty }),
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
            const response = await fetch(`${apiBaseUrl}/api/deleteEntryInfo/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                toast.success("Item deleted successfully.");

            }

        } catch (error: any) {
            toast.error(error.message)
        }
    }
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

    const [itemOption, setItemOption] = useState([]);
        useEffect(() => {
    
            const fetchMadeProducts = () => {
                fetch(`${apiBaseUrl}/api/getProductName?username=${username}`)
                    .then(response => response.json())
                    .then(data => {
                        const transformedData = data.map((product: any) => ({
                            value: product.productName,
                            label: product.productName
                        }));
                        setItemOption(transformedData);
                    })
                    .catch(error => console.error('Error fetching products:', error));
            };
    
            // Fetch data initially
            fetchMadeProducts();
        }, [apiBaseUrl, username]);
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
                        <span className="label-text-alt">SUPPLIER</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <p className='capitalize w-[50%] p-2 bg-white text-black rounded-md'>{supplier}</p>
                        <Select className="text-black w-[50%]" name="retailer" onChange={(selectedOption: any) => setSupplier(selectedOption.value)} options={supplierOption} />
                    </div>
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">PRODUCT NAME</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <p className='capitalize w-[50%] p-2 bg-white text-black rounded-md'>{productName}</p>
                        <Select className="text-black w-[50%]" name="retailer" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={itemOption} />
                    </div>
                 
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">PURCHASE PRICE</span>
                    </div>
                    <input type='number' step="any" name='rate' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">PRODUCT QTY</span>
                    </div>
                    <input type='number' step="any" name='rate' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={productQty} onChange={(e) => setProductQty(e.target.value)} placeholder='Type Here' />
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