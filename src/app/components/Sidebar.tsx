
import Link from 'next/link'
import { IoHomeOutline } from "react-icons/io5";
import { RiSecurePaymentLine } from "react-icons/ri";
import { GoDatabase } from "react-icons/go";
import { TbReportSearch } from "react-icons/tb";
import { MdOutlineEmojiTransportation, MdOutlinePayments, MdOutlineSell } from "react-icons/md";
import { PiUserListDuotone, PiTargetDuotone, PiUsersFourFill } from "react-icons/pi";
import { VscRepo } from "react-icons/vsc";
import { MdOutlineInterests } from "react-icons/md";
import { GrUserAdmin } from "react-icons/gr";
import CashBook from './CashBook';
import Invoice from './Invoice';
import { BsCalendarDate, BsDatabaseAdd } from 'react-icons/bs';
import { RiListUnordered } from "react-icons/ri";
import { TbLayoutDistributeVertical } from "react-icons/tb";
import { FaHandHoldingMedical } from "react-icons/fa";
import { CgUserList } from "react-icons/cg";
import { FaScaleBalanced, FaUsers } from "react-icons/fa6";
import DayBook from './DayBook';


export const Sidebar = () => {

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
                    <ul className="menu p-4 w-64 min-h-full bg-base-200 text-base-content">
                        <li><Link href="/dashboard"><IoHomeOutline size={20} /> HOME</Link></li>
                        <li><Link href="/purchase"><BsDatabaseAdd size={20} /> PURCHASE</Link></li>
                        <li><Link href="/order-create"><RiListUnordered size={20} /> ORDER CREATE</Link></li>
                        <li><Link href="/order-delivery"><TbLayoutDistributeVertical size={20} /> ORDER DELIVERY</Link></li>
                        <li>
                            <details>
                                <summary><RiSecurePaymentLine size={20} /> TRANSACTION</summary>
                                <ul>
                                    <li><Link href="/payment">PAYMENT</Link></li>
                                    <li><Link href="/receive">RECEIVE</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><GoDatabase size={20} /> STOCK REPORT</summary>
                                <ul>
                                    <li><Link href="/stockreport">PRODUCT STOCK</Link></li>
                                    <li><Link href="/purchase-ledger">PURCHASE REPORT</Link></li>

                                </ul>
                            </details>
                        </li>
                        <li><Link href="/dp-dist-report"><MdOutlineSell size={20} /> SALE REPORT</Link></li>
                        <li>
                            <details>
                                <summary><MdOutlinePayments size={20} /> PAYMENT REPORT</summary>
                                <ul>
                                    <li><Link href="/expense-report"> EXPENSE REPORT</Link></li>
                                    <li><Link href="/office-pay-report"> CASH PAYMENT</Link></li>
                                    <li><Link href="/employee-pay-report"> EMPLOYEE PAYMENT</Link></li>
                                    <li><Link href="/supplier-pay-report"> SUPPLIER PAYMENT</Link></li>
                                    <li><Link href="/transport-pay-report"> TRANSPORT PAYMENT</Link></li>
                                    <li><Link href="/retailer-commission-report"> RETAILER COMMISSION</Link></li>

                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><FaHandHoldingMedical size={20} /> RECEIVE REPORT</summary>
                                <ul>
                                    <li><Link href="/office-receive-report"> CASH RECEIVE</Link></li>
                                    <li><Link href="/retailer-pay-report"> RETAILER PAYMENT</Link></li>
                                    <li><Link href="/supplier-commission-report"> SUPPLIER COMMISSION</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li><Link href="/retailer-ledger"> <PiUserListDuotone size={20} /> MARKET LEDGER</Link></li>
                        <li><Link href="/supplier-ledger"> <CgUserList size={20} /> SUPPLIER LEDGER</Link></li>
                        <li><Link href="/transport-ledger"> <MdOutlineEmojiTransportation size={20} /> TRANSPORT LEDGER</Link></li>
                        <li><Link href="/payment-receive"> <FaUsers size={20} /> PAY-RECV LEDGER</Link></li>
                        <li><Link href="/employee-target-summary"> <PiTargetDuotone size={20} /> TARGET LEDGER</Link></li>
                        <li>
                            <details>
                                <summary><PiUsersFourFill size={20} /> BUSINESS PERSON</summary>
                                <ul>
                                    <li><Link href="/retailer-list"> RETAILER LIST</Link></li>
                                    <li><Link href="/employee-list"> EMPLOYEE LIST</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><a className='flex gap-2'><VscRepo size={20} /> CASH BOOK </a></summary>
                                <ul>
                                    <li>
                                        <CashBook />
                                    </li>
                                </ul>
                            </details>
                        </li>
                        <li>
                            <details>
                                <summary><a className='flex gap-2'><BsCalendarDate size={17} /> DAY BOOK </a></summary>
                                <ul>
                                    <li>
                                        <DayBook />
                                    </li>
                                </ul>
                            </details>
                        </li>
                        {/* <li>
                            <details>
                                <summary><a className='flex gap-2'><PiNotebook size={20} />FIND INVOICE </a></summary>
                                <ul>
                                    <li>
                                        <Invoice />
                                    </li>
                                </ul>
                            </details>
                        </li> */}
                        <li><Link href="/monthly-profit"><MdOutlineInterests size={20} /> PROFIT / LOSS</Link></li>
                        <li><Link href="/balance-sheet"><FaScaleBalanced size={20} /> BALANCE SHEET</Link></li>
                        <li><Link href="/adminstration"><GrUserAdmin size={20} /> ADMINSTRATION</Link></li>

                    </ul>

                </div>
            </div>

        </div>
    )
}

export default Sidebar