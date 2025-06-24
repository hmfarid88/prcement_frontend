"use client"
import React, { useEffect, useState } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteProduct, deleteAllProducts, selectTotalQuantity } from "@/app/store/deliverySlice";
import { toast } from 'react-toastify';
import { FcPlus } from 'react-icons/fc';

const OrderDelivery = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);

    const dispatch = useAppDispatch();
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const products = useAppSelector((state) => state.deliveryProducts.products);
    const totalQuantity = useAppSelector(selectTotalQuantity);

    const [maxDate, setMaxDate] = useState('');
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
        setOrderDate(formattedDate)
    }, []);

    const [orderDate, setOrderDate] = useState("");
    const [retailer, setRetailer] = useState("");
    const [productName, setProductName] = useState("");
    const [saleRate, setSaleRate] = useState("");
    const [orderQty, setOrderQty] = useState("");
    const [orderNote, setOrderNote] = useState("");
    const [orderedQty, setOrderedQty] = useState("");
    const [orderId, setOrderId] = useState("");
    const [transportId, setTransportId] = useState("");
    const [transportName, setTransportName] = useState("");
    const [truckno, setTruckNo] = useState("");
    const [rentAmount, setRentAmount] = useState("");

    const invoiceNo = uid();
    const [temporary, setTemporary] = useState(false);

    const confirmOrderDelivery = (e: any) => {
        e.preventDefault();
        const isConfirmed = window.confirm("Are you confirm to delivery ?");
        if (isConfirmed) {
            handleFinalOrderSubmit(e);
        }
    };
    const [transport, setTransport] = useState("");
    const handleTransport = async (e: any) => {
        e.preventDefault();
        if (!transport.trim()) {
            toast.warning("Item is empty !");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addTransport`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transport, username }),
            });

            if (response.ok) {
                toast.success("Transport added successfully !");
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Invalid transport name !")
        } finally {
            setPending(false);
            setTransport("");
        }
    };
    const handleOrderSubmit = async (e: any) => {
        e.preventDefault();
        if (!orderDate || !retailer || !productName || !saleRate || !orderQty || !orderNote || !transportName || !truckno || !rentAmount) {
            toast.warning("Item is empty !");
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/api/findLastQty?username=${username}&productName=${productName}`);
            if (!response.ok) {
                toast.error("Failed to fetch remaining quantity!");
                return;
            }

            const data = await response.json();
            const remainingQty = data;
            const totalSoldQty = products
                .filter(p => p.productName === productName && p.username === username)
                .reduce((total, p) => total + Number(p.orderQty || 0), 0);
            if (remainingQty < Number(orderQty) + totalSoldQty) {
                toast.warning("Insufficient stock quantity !");
                return;
            }

            const product = { id: uid(), orderId: 0, date: orderDate, retailer, orderNote, productName, saleRate, orderQty, transport: transportName, truckNo: truckno, rent: rentAmount, username }
            dispatch(addProducts(product));
            setOrderNote("")
            setSaleRate("")
            setOrderQty("")
            setTruckNo("")
        } catch (error) {
            console.error("Error submitting order:", error);
            toast.error("An error occurred while submitting the order.");
        }
    }
    const handleSingleOrder = async (e: any) => {
        e.preventDefault();

        if (!orderId || !orderedQty) {
            toast.warning("Need to select order & quantity!");
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/api/getExistingSingleOrder?orderId=${orderId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const productData = data[0];
            if (productData.orderQty < orderedQty) {
                toast.warning("Sorry, not enough qty!");
                return;
            }
            const qtyresponse = await fetch(`${apiBaseUrl}/api/findLastQty?username=${username}&productName=${productData.productName}`);
            if (!qtyresponse.ok) {
                toast.error("Failed to fetch remaining quantity!");
                return;
            }

            const qtydata = await qtyresponse.json();
            const remainingQty = qtydata;

            const totalSoldQty = products
                .filter(p => p.productName === productData.productName && p.username === username)
                .reduce((total, p) => total + Number(p.orderQty || 0), 0);
            if (remainingQty < Number(orderedQty) + totalSoldQty) {
                toast.warning("Insufficient stock quantity !");
                return;
            }
            const productToOrder = {
                id: uid(),
                orderId: productData.orderId,
                date: orderDate,
                retailer: productData.retailer,
                orderNote: productData.orderNote,
                productName: productData.productName,
                saleRate: productData.saleRate,
                orderQty: orderedQty,
                transport: transportName,
                truckNo: truckno,
                rent: rentAmount,
                username: username

            };

            dispatch(addProducts(productToOrder));
            setOrderedQty("");
            setTruckNo("");
            setRentAmount("");
        } catch (error) {
            console.error('Error fetching product:', error);
        }

    };

    const handleDeleteProduct = (id: any) => {
        dispatch(deleteProduct(id));
    };

    const productInfo = products.map(product => ({
        ...product,
        customer: product.retailer,
        dpRate: product.saleRate,
        productQty: product.orderQty,
        invoiceNo: invoiceNo,
        status: 'sold',
        note: product.orderNote

    }));

    const handleFinalOrderSubmit = async (e: any) => {
        e.preventDefault();
        if (products.length === 0) {
            toast.warning("Sorry, your order list is empty!");
            return;
        }

        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/productDistribution`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productInfo),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                dispatch(deleteAllProducts());
                setTruckNo('')
                toast.success("Product delivery successfull !");
                // router.push(`/invoice?invoiceNo=${invoiceNo}`);
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
                    label: item.retailerName
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

    const [orderOption, setOrderOption] = useState([]);
    useEffect(() => {

        fetch(`${apiBaseUrl}/api/getExistingAllOrder`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item[0],
                    label: `${item[1]}, ${item[2]}, ${item[3]}, ${item[4]}`
                }));
                setOrderOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, username]);

    const handleTransportNameDelete = async (e: any) => {
        e.preventDefault();
        try {
          const response = await fetch(`${apiBaseUrl}/api/deleteTransportName?transport=${encodeURIComponent(transportId)}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
    
          });
    
          if (!response.ok) {
            // const error = await response.json();
            toast.error("Sorry, name is not deleted!");
          } else {
            toast.success("Name deleted successfully.");
    
          }
    
        } catch (error: any) {
          toast.error(error.message)
        }
      }

    return (
        <div className="container w-full">
            <div className="flex items-center justify-center w-full p-3">
                <a href="#my_modal_orderlist"><button className='btn btn-sm btn-outline btn-ghost'>ORDER LIST</button></a>
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full items-center justify-center p-2">
                <div className="flex flex-col min-h-80 w-full md:w-1/2 gap-1 items-center">
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">DELIVERY DATE</span>
                        </div>
                        <input type="date" name="date" onChange={(e: any) => setOrderDate(e.target.value)} max={maxDate} value={orderDate} className="border rounded-md p-2 mt-1.5 bg-white text-black  w-full max-w-xs h-[40px]" />
                    </label>
                    <div className="flex w-full max-w-xs justify-between">
                        <div className="label">
                            <span className="label-text-alt">RETAILER NAME</span>
                        </div>
                        <div className="label gap-2">
                            <span className="label-text-alt">TEMPORARY</span>
                            <input type="checkbox" className="checkbox checkbox-success w-[20px] h-[20px]" checked={temporary}
                                onChange={(e) => setTemporary(e.target.checked)} />
                        </div>
                    </div>
                    <label className="form-control w-full max-w-xs">

                        {!temporary && (
                            <Select className="text-black" name="retailer" onChange={(selectedOption: any) => setRetailer(selectedOption.value)} options={retailerOption} />
                        )}
                        {temporary && (
                            <label className="form-control w-full max-w-xs">
                                <input
                                    type="text"
                                    name="temporary"
                                    onChange={(e: any) => setRetailer(e.target.value)}
                                    placeholder="Type Here" value={retailer}
                                    className="input input-bordered rounded-md w-full max-w-xs h-[40px] bg-white text-black" />

                            </label>
                        )}
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">DELIVERY NOTE</span>
                        </div>
                        <input type='text' name='note' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={orderNote} onChange={(e) => setOrderNote(e.target.value)} placeholder='Type Here' />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">PRODUCT NAME</span>
                        </div>
                        <Select className="text-black" name="pname" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={itemOption} />

                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">QUANTITY</span>
                        </div>
                        <input type='number' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={orderQty} onChange={(e) => setOrderQty(e.target.value)} placeholder='00' />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">SALE RATE</span>
                        </div>
                        <input type='number' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={saleRate} onChange={(e) => setSaleRate(e.target.value)} placeholder='00' />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">TRANSPORT</span>
                            <a href="#transport_add" className="btn btn-xs btn-circle btn-ghost"><FcPlus size={20} /></a>
                        </div>
                        <Select className="text-black" name="transport" onChange={(selectedOption: any) => setTransportName(selectedOption.value)} options={transportOption} />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">TRUCK NO</span>
                        </div>
                        <input type='text' name='truckno' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={truckno} onChange={(e) => setTruckNo(e.target.value)} placeholder='Type Here' />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">RENT AMOUNT</span>
                        </div>
                        <input type='number' name='rent' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} placeholder='Type Here' />
                    </label>

                    <label className="form-control w-full max-w-xs pt-5">
                        <button onClick={handleOrderSubmit} className="btn btn-success rounded-md btn-sm h-[40px] w-full max-w-xs" >ADD PRODUCT</button>
                    </label>
                </div>

                <div className="flex flex-col w-full md:w-1/2 items-center p-2">
                    <div className="flex">
                        <div className="avatar-group -space-x-6 rtl:space-x-reverse">
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content w-12">
                                    <span>{totalQuantity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto h-auto">
                        <table className="table table-xs md:table-sm table-pin-rows w-full">
                            <thead>
                                <tr className="font-bold">
                                    <th>SN</th>
                                    <th>Date</th>
                                    <th>Retailer</th>
                                    <th>Note</th>
                                    <th>Products</th>
                                    <th>Qty</th>
                                    <th>Rate</th>
                                    <th>Truck No</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.date}</td>
                                        <td>{item.retailer}</td>
                                        <td>{item.orderNote}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.orderQty}</td>
                                        <td>{item.saleRate}</td>
                                        <td>{item.truckNo}</td>

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
                    <div className="flex flex-col items-center justify-center gap-3 pt-10">
                        <button onClick={confirmOrderDelivery} className="btn btn-success btn-sm w-full max-w-xs" disabled={pending} >{pending ? "Submitting..." : "FINAL SUBMIT"}</button>
                    </div>
                </div>
                <div className="modal sm:modal-middle" role="dialog" id="my_modal_orderlist">
                    <div className="modal-box">
                        <div className="flex flex-col w-full justify-between gap-2 h-72 p-2">
                            <div className="flex">
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">SELECT ORDER</span>
                                    </div>
                                    <Select className="text-black w-[200px]" name="retailer" onChange={(selectedOption: any) => setOrderId(selectedOption.value)} options={orderOption} />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">ORDER QTY</span>
                                    </div>
                                    <div className="flex">
                                        <input type="number" value={orderedQty} name="qty" onChange={(e: any) => setOrderedQty(e.target.value)} placeholder="Type..." className="input input-bordered w-[100px] h-[40px] max-w-xs bg-white text-black border border-slate-400" />
                                    </div>
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">TRANSPORT</span>
                                    </div>
                                    <Select className="text-black w-[200px]" name="transport" onChange={(selectedOption: any) => setTransportName(selectedOption.value)} options={transportOption} />
                                </label>
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">TRUCK NO</span>
                                    </div>
                                    <div className="flex">
                                        <input type="text" value={truckno} name="truckno" onChange={(e: any) => setTruckNo(e.target.value)} placeholder="Type ...." className="input input-bordered w-[100px] h-[40px] max-w-xs bg-white text-black border border-slate-400" />
                                    </div>
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text-alt">RENT AMOUNT</span>
                                    </div>
                                    <input type='number' name='rent' className='input input-md h-[40px] w-[200px] bg-white text-black border rounded-md border-slate-300' value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} placeholder='Type Here' />
                                </label>
                                <label className="form-control w-full mt-8 max-w-xs">
                                    <button disabled={pending} onClick={handleSingleOrder} className="btn btn-sm btn-success w-[100px] h-[40px]">{pending ? "Adding..." : "ADD"}</button>
                                </label>
                            </div>
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
                <div className="modal sm:modal-middle" role="dialog" id="transport_add">
                    <div className="modal-box">
                        <div className="flex w-full items-center justify-center p-2">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text-alt">ADD TRANSPORT</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <input type="text" value={transport} name="transport" onChange={(e: any) => setTransport(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" />
                                    <button onClick={handleTransport} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
                                </div>
                            </label>
                        </div>
                        <div className="flex w-full justify-center pt-5">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text-alt">DELETE TRANSPORT NAME</span>
                                </div>
                                <div className="flex items-center justify-center gap-3">
                                    <Select className="text-black w-full" name="payment" onChange={(selectedOption: any) => setTransportId(selectedOption.value)} options={transportOption} />
                                    <button onClick={handleTransportNameDelete} className="btn btn-sm btn-square btn-error">X</button>
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

export default OrderDelivery