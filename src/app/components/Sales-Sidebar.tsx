import React from 'react'
import Link from 'next/link'
import { IoHomeOutline } from "react-icons/io5";
import { RiListUnordered } from "react-icons/ri";
import { PiUserListDuotone } from "react-icons/pi";
import { GrUserAdmin } from "react-icons/gr";
import { BsReverseListColumnsReverse } from "react-icons/bs";
import { TbReportSearch } from 'react-icons/tb';

export const SalesSidebar = () => {
    return (
        <div>
            <div className="drawer lg:drawer-open z-50">
                <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    <div className="flex-none lg:hidden">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </label>
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-60 min-h-full bg-base-200 text-base-content">
                        <li><Link href="/sales-dashboard"><IoHomeOutline size={20} /> HOME</Link></li>
                        <li><Link href="/sales-order"><RiListUnordered size={20} /> ORDER CREATE</Link></li>
                        <li><Link href="/order-list"><BsReverseListColumnsReverse size={20} /> ORDER LIST</Link></li>
                        <li><Link href="/dist-report"><TbReportSearch size={20} /> DELIVERY REPORT</Link></li>
                        <li><Link href="/sales-retailer-ledger"><PiUserListDuotone size={20} /> RETAILER LEDGER</Link></li>
                        <li><Link href="/sales-admin"><GrUserAdmin size={20} /> ADMINSTRATION</Link></li>

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SalesSidebar