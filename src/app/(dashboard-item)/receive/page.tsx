import React from 'react'
import OfficeReceive from '@/app/components/OfficeReceive';
import RetailerPayment from '@/app/components/RetailerPayment';
import SupplierCommission from '@/app/components/SupplierCommission';

const Receive = () => {
  return (
    <div className='container-2xl min-h-screen'>
      <div className="flex w-full items-center justify-center">
        <div role="tablist" className="tabs tabs-bordered">
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="CASH RECEIVE" defaultChecked />
          <div role="tabpanel" className="tab-content p-10">
            <OfficeReceive />
          </div>
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="RETAILER PAYMENT" />
          <div role="tabpanel" className="tab-content p-10">
            <RetailerPayment />
          </div>
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="SUPPLIER COMMISSION" />
          <div role="tabpanel" className="tab-content p-10">
            <SupplierCommission />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Receive