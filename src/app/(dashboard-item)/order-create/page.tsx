import OrderCreate from '@/app/components/OrderCreate'
import React from 'react'

const page = () => {
    return (
        <div className='container min-h-screen'>
            <div className="flex">
                <OrderCreate />
            </div>

        </div>
    )
}

export default page