import React from 'react'
import Expense from '@/app/components/Expense';
import SupplierPayment from '@/app/components/SupplierPayment';
import OfficePayment from '@/app/components/OfficePayment';
import EmployeePayment from '@/app/components/EmployeePayment';
import RetailerCommission from '@/app/components/RetailerCommission';
import TransportPayment from '@/app/components/TransportPayment';

const Payment = () => {
  return (
    <div className='container-2xl min-h-screen'>
      <div className="flex w-full items-center justify-center p-2">
        <div className="overflow-x-auto">
          <div role="tablist" className="tabs tabs-bordered">
            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="EXPENSE" defaultChecked />
            <div role="tabpanel" className="tab-content p-10">
              <Expense />
            </div>
            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="CASH PAYMENT" />
            <div role="tabpanel" className="tab-content p-10">
              <OfficePayment />
            </div>
            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="SUPPLIER PAYMENT" />
            <div role="tabpanel" className="tab-content p-10">
              <SupplierPayment />
            </div>
            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="EMPLOYEE PAYMENT" />
            <div role="tabpanel" className="tab-content p-10">
              <EmployeePayment />
            </div>
            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="TRANSPORT PAYMENT" />
            <div role="tabpanel" className="tab-content p-10">
              <TransportPayment />
            </div>
            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="RETAILER COMMISSION" />
            <div role="tabpanel" className="tab-content p-10">
              <RetailerCommission />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment