import React from "react";
import ProductStock from "@/app/components/ProductStock";


const Page: React.FC = () => {
  return (
    <div className="container-2xl min-h-screen">
      <div className="flex-col md:flex w-full items-center justify-center p-5">
        <ProductStock />
      </div>
    </div>

  )
}

export default Page