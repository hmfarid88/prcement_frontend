"use client"
import React, { FormEvent, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

const Page = () => {
    const [pending, setPending] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [roles, setRoles] = useState("");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleUserAdd = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email || !username || !password || !roles) {
            toast.error("All fields are required!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/auth/addNewUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password, roles }),
            });

            if (response.ok) {
                setEmail("");
                setUserName("");
                setPassword("");
                setRoles("");
                toast.success("User added successfully!");

            } else {
                const data = await response.json();
                toast.error(data.message || "Error adding user.");
            }
        } catch (error: any) {
            toast.error(error.message || "Error adding user.")
        } finally {
            setPending(false);
        }
    };
    return (
        <div className='container-2xl'>
            <div className="flex w-full items-center justify-center pt-10">
                <div className="card shadow shadow-slate-700 w-full max-w-sm p-5">
                    <form onSubmit={handleUserAdd}>
                        <h1 className='font-bold tracking-widest p-2'>ADD NEW USER</h1>
                        <div className="flex flex-col">
                            <div className="flex p-2">
                                <label className="input input-bordered flex items-center w-full max-w-xs gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                                    <input type="text" name='email' value={email} onChange={(e: any) => setEmail(e.target.value)} className="grow" placeholder="Email" />
                                </label>
                            </div>
                            <div className="flex p-2">
                                <label className="input input-bordered flex items-center w-full max-w-xs gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                                    <input type="text" name='name' value={username} onChange={(e: any) => setUserName(e.target.value)} className="grow" placeholder="Username" />
                                </label>
                            </div>
                            <div className="flex p-2">
                                <label className="input input-bordered flex items-center w-full max-w-xs gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                                    <input type="password" value={password} name='password' onChange={(e: any) => setPassword(e.target.value)} className="grow" placeholder='Password' />
                                </label>
                            </div>
                            <div className="flex p-2">
                                <select name='roles' value={roles} onChange={(e) => setRoles(e.target.value)} className="select select-bordered w-full max-w-xs">
                                    <option selected>SELECT ROLE</option>
                                    <option value="ROLE_ACCOUNTANT">ACCOUNTANT</option>
                                    <option value="ROLE_SALES">SALES</option>
                                    <option value="ROLE_ADMIN">ADMIN</option>
                                </select>
                            </div>
                            <div className="flex p-2">
                                <button type='submit' className='btn btn-success w-full max-w-xs'>{pending ? "Submitting..." : "ADD USER"}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer autoClose={1000} theme='dark' />
        </div>
    )
}

export default Page