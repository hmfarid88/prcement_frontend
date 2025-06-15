"use client"
import React, { useEffect, useState } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteProduct, deleteAllProducts } from "@/app/store/productSlice";
import { toast } from 'react-toastify';
import { FcPlus } from 'react-icons/fc';

const ProductStock = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);

    const dispatch = useAppDispatch();
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const products = useAppSelector((state) => state.products.products);

    const [maxDate, setMaxDate] = useState('');
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
        setStockDate(formattedDate)
    }, []);

    const [stockDate, setStockDate] = useState("");
    const [supplier, setSupplier] = useState("");
    const [productName, setProductName] = useState("");
    const [costPrice, setCostPrice] = useState("");
    const [productQty, setProductQty] = useState("");


    const [supplierName, setSupplierName] = useState("");
    const handleSupplierItemSubmit = async (e: any) => {
        e.preventDefault();
        if (!supplierName) {
            toast.warning("Item is empty !");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addSupplierName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ supplierName, username }),
            });

            if (response.ok) {
                toast.success("Supplier added successfully !");
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Invalid supplier name !")
        } finally {
            setPending(false);
            setSupplierName("");
        }
    };

    const [productItemName, setProductItemName] = useState("");
    const handleProductNameSubmit = async (e: any) => {
        e.preventDefault();
        if (!productItemName) {
            toast.warning("Item is empty !");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addProductName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productName: productItemName, username }),
            });

            if (response.ok) {
                toast.success("Product added successfully !");
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Invalid product name !")
        } finally {
            setPending(false);
            setProductItemName("");
        }
    };

    const handleProductStock = (e: any) => {
        e.preventDefault();
        if (!stockDate || !productName) {
            toast.warning("Item is empty !");
            return;
        }
        const product = { id: uid(), date: stockDate, supplier, productName, costPrice, purchasePrice: costPrice, productQty, username, status: 'stored' }
        dispatch(addProducts(product));

    }
    const handleDeleteProduct = (id: any) => {
        dispatch(deleteProduct(id));
    };

    const handleFinalStockSubmit = async (e: any) => {
        e.preventDefault();
        if (products.length === 0) {
            toast.warning("Sorry, your product list is empty!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addAllProducts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(products),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                dispatch(deleteAllProducts());
                toast.success("Product added successfully !");
            }

        } catch (error) {
            toast.error("Invalid product item !")
        } finally {
            setPending(false);
        }
    };

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
    }, [apiBaseUrl, username, productItemName]);

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

    }, [supplierName, apiBaseUrl, username]);
    return (
        <div className="container w-full">
            <div className="flex flex-col md:flex-row gap-5 w-full items-center">
                <div className="flex flex-col min-h-96 w-1/2 items-center justify-center">
                    <div className="overflow-x-auto">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">STOCK DATE</span>
                            </div>
                            <input type="date" name="date" onChange={(e: any) => setStockDate(e.target.value)} max={maxDate} value={stockDate} className="border rounded-md p-2 mt-1.5 bg-white text-black  w-full max-w-xs h-[40px]" />
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">SUPPLIER NAME</span>
                                <a href="#my_modal_supplieradd" className="btn btn-xs btn-circle btn-ghost"><FcPlus size={20} /></a>
                            </div>
                            <Select className="text-black" name="catagory" onChange={(selectedOption: any) => setSupplier(selectedOption.value)} options={supplierOption} />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">PRODUCT NAME</span>
                                <a href="#my_modal_productadd" className="btn btn-xs btn-circle btn-ghost"><FcPlus size={20} /></a>
                            </div>
                            <Select className="text-black" name="pname" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={itemOption} />

                        </label>

                        <label className="form-control w-full max-w-xs pt-2">
                            <div className="label">
                                <span className="label-text-alt">PURCHASE QUANTITY</span>
                            </div>
                            <input type='number' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' onChange={(e) => setProductQty(e.target.value)} placeholder='00' />
                        </label>
                        <label className="form-control w-full max-w-xs pt-2">
                            <div className="label">
                                <span className="label-text-alt">PURCHASE RATE</span>
                            </div>
                            <input type='number' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' onChange={(e) => setCostPrice(e.target.value)} placeholder='00' />
                        </label>


                        <label className="form-control w-full max-w-xs pt-5">
                            <button onClick={handleProductStock} className="btn btn-success rounded-md btn-sm h-[40px] w-full max-w-xs" >ADD PRODUCT</button>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col w-1/2 items-center p-2">
                    <div className="flex justify-center w-full">
                        <div className="overflow-x-auto h-auto">
                            <table className="table table-xs md:table-sm table-pin-rows">
                                <thead>
                                    <tr className="font-bold">
                                        <th>SN</th>
                                        <th>Date</th>
                                        <th>Supplier</th>
                                        <th>Products</th>
                                        <th>Qty</th>
                                        <th>Rate</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.date}</td>
                                            <td>{item.supplier}</td>
                                            <td>{item.productName}</td>
                                            <td>{item.productQty}</td>
                                            <td>{item.costPrice}</td>
                                            <td>
                                                <button onClick={() => {
                                                    handleDeleteProduct(item.id);
                                                }} className="btn-xs rounded-md btn-outline btn-error"><RiDeleteBin6Line size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                    <div className="flex items-center justify-center pt-10">
                        <button onClick={handleFinalStockSubmit} className="btn btn-success btn-outline btn-sm max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT ALL"}</button>
                    </div>
                </div>
                <div className="modal sm:modal-middle" role="dialog" id="my_modal_supplieradd">
                    <div className="modal-box">
                        <div className="flex w-full items-center justify-center p-2">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text-alt">ADD SUPPLIER</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <input type="text" value={supplierName} name="supplierItem" onChange={(e: any) => setSupplierName(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                                    <button onClick={handleSupplierItemSubmit} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
                                </div>
                            </label>
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
                <div className="modal sm:modal-middle" role="dialog" id="my_modal_productadd">
                    <div className="modal-box">
                        <div className="flex w-full items-center justify-center p-2">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text-alt">ADD PRODUCT</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <input type="text" value={productItemName} name="productItem" onChange={(e: any) => setProductItemName(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                                    <button onClick={handleProductNameSubmit} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
                                </div>
                            </label>
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
        </div>
    )
}

export default ProductStock