"use client"
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";

const ShopInfo = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);

    const [shopName, setShopName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");

    const submitShopInfo = async (e: any) => {
        e.preventDefault();
        if (!shopName || !phoneNumber || !address || !email) {
            toast.warning("All field is required");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/invoice/addShopInfo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shopName, phoneNumber, address, email, username }),
            });

            if (!response.ok) {
                toast.error("Product sale not submitted !");
                return;
            } else {
                setShopName("");
                setPhoneNumber("");
                setAddress("");
                setEmail("")
                toast.success("Info added successfully.")
            }
        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        } finally {
            setPending(false);
        }

    }
    return (

        <div className="container">
            <div className="flex flex-col w-full items-center gap-2 p-2">
                <div className="overflow-x-auto">
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">SHOP NAME</span>
                        </div>
                        <input type="text" name="item" onChange={(e: any) => setShopName(e.target.value)} value={shopName} placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">PHONE NUMBER</span>
                        </div>
                        <input type="text" maxLength={11} name="item" onChange={(e: any) => setPhoneNumber(e.target.value.replace(/\D/g, ""))} value={phoneNumber} placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">ADDRESS</span>
                        </div>
                        <input type="text" name="item" onChange={(e: any) => setAddress(e.target.value)} value={address} placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">EMAIL</span>
                        </div>
                        <input type="text" name="item" onChange={(e: any) => setEmail(e.target.value)} value={email} placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" />
                    </label>
                    <label className="form-control w-full max-w-xs pt-5">
                        <button onClick={submitShopInfo} disabled={pending} className="btn btn-outline btn-success">{pending ? "Submitting..." : "SUBMIT"}</button>
                    </label>
                </div>
            </div>
        </div>

    )
}

export default ShopInfo