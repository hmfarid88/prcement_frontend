'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import CurrentDate from "@/app/components/CurrentDate";
import ExcelExport from "@/app/components/ExcellGeneration";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IoSearch } from "react-icons/io5";
import Select from "react-select";

type Product = {
  category: string;
  warehouse: string;
  productName: string;
  previousQty: number;
  todayEntryQty: number;
  todaySaleQty: number;
  presentQty: number;
  costPrice: number;
  totalValue: number;

};

const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const router = useRouter();
  const [maxDate, setMaxDate] = useState('');
  const [viewMode, setViewMode] = useState<"group" | "details">("group");

  const [productName, setProductName] = useState("");
  const [presentQty, setPresentQty] = useState("");
  const [transferQty, setTransferQty] = useState("");
  const [sourceWarehouse, setSourceWarehouse] = useState("");
  const [sourceCategory, setSourceCategory] = useState("");
  const [destinationWarehouse, setDestinationWarehouse] = useState("");
  const [destinationCategory, setDestinationCategory] = useState("");

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
  }, []);

  const [date, setStartDate] = useState("");
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!date) {
      toast.warning("Start date and end date required !");
      return;
    }
    // Use the dynamic routePath for navigation
    router.push(`/datewise-stockreport?date=${date}`);
    setStartDate("");
  };
  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [transferPending, setTransferPending] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [itemOption, setItemOption] = useState([]);

  useEffect(() => {
    const fetchMadeProducts = () => {
      const today = new Date().toLocaleDateString('en-CA');
      fetch(`${apiBaseUrl}/api/daily-stock-report?username=${encodeURIComponent(username)}&date=${today}`)
        // fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
        .then(response => response.json())
        .then(data => {
          const transformedData = data.map((product: any) => ({
            value: product.productName,
            label: `${product.warehouse}, ${product.category}, ${product.productName} (${product.presentQty}, ${product.costPrice.toFixed(2)})`,
            warehouse: product.warehouse,
            category: product.category,
            presentQty: product.presentQty,
          }));
          setItemOption(transformedData);
        })
        .catch(error => console.error('Error fetching products:', error));
    };

    // Fetch data initially
    fetchMadeProducts();
  }, [apiBaseUrl, username]);

  useEffect(() => {
    const today = new Date().toLocaleDateString('en-CA');
    fetch(`${apiBaseUrl}/api/daily-stock-report?username=${encodeURIComponent(username)}&date=${today}`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  const handleTransfer = async (e: any) => {
    e.preventDefault();
    if (!sourceWarehouse || !sourceCategory || !productName || !transferQty || !destinationWarehouse || !destinationCategory) {
      toast.warning("Sorry, must fill all the field!");
      return;
    }
    if (sourceCategory === destinationCategory) {
      toast.warning("Sorry, source category cannot be the same as destination category!");
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/transfer-stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sourceWarehouse, sourceCategory, productName, transferQty, destinationWarehouse, destinationCategory, username: username }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.message);
      } else {

        toast.success("Product transfer successfull !");
        setSourceWarehouse("");
        setSourceCategory("");
        setProductName("");
        setTransferQty("");
        setDestinationWarehouse("");
        setDestinationCategory("");
        setTransferModalOpen(false);
      }

    } catch (error) {
      toast.error("Invalid product item !")
    } finally {

    }
  };

  const categorySummary = Object.values(
    filteredProducts.reduce((acc: any, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          category: item.category,
          opening: 0,
          entry: 0,
          sold: 0,
          closing: 0,
        };
      }

      acc[item.category].opening += item.previousQty;
      acc[item.category].entry += item.todayEntryQty;
      acc[item.category].sold += item.todaySaleQty;
      acc[item.category].closing += item.presentQty;

      return acc;
    }, {})
  );

  useEffect(() => {
    const searchText = filterCriteria.toLowerCase().trim();
    let filtered = allProducts;
    if (searchText) {
      // If exact customer match
      const exactMatch = allProducts.filter(
        product => product.category?.toLowerCase() === searchText
      );
      if (exactMatch.length > 0) {
        filtered = exactMatch;
      } else {
        // Build one string containing outlet + product details
        filtered = allProducts.filter(product => {
          const combinedText = [
            product.warehouse,
            product.category,
            product.productName,

          ]
            .map(f => f?.toLowerCase() || "")
            .join(" ");

          return combinedText.includes(searchText);
        });
      }
    }
    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);

  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };
  const totalPrevious = filteredProducts.reduce((total, product) => {
    return total + product?.previousQty;
  }, 0);

  const totalTodayEntry = filteredProducts.reduce((total, product) => {
    return total + product?.todayEntryQty;
  }, 0);

  const totalTodaySale = filteredProducts.reduce((total, product) => {
    return total + product?.todaySaleQty;
  }, 0);

  const totalPrestntQty = filteredProducts.reduce((total, product) => {
    return total + product?.presentQty;
  }, 0);

  const totalCost = filteredProducts.reduce((total, product) => {
    return total + product?.costPrice;
  }, 0);

  const totalTotal = filteredProducts.reduce((total, product) => {
    return total + product?.totalValue;
  }, 0);

  type WarehouseGroup = {
    products: Product[];
    totalClosingQty: number;
    totalValue: number;
  };

  const warehouseGroups: Record<string, WarehouseGroup> = {};

  filteredProducts?.forEach((product) => {
    const warehouse = product.warehouse;

    if (!warehouseGroups[warehouse]) {
      warehouseGroups[warehouse] = {
        products: [],
        totalClosingQty: 0,
        totalValue: 0,
      };
    }

    warehouseGroups[warehouse].products.push(product);
    warehouseGroups[warehouse].totalClosingQty += product.presentQty;
    warehouseGroups[warehouse].totalValue += product.totalValue;
  });
  let serialNo = 1;
  return (
    <div className="container-2xl">
      <div className="flex w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
        <div className="flex flex-col p-5 gap-4  w-full">
          <div className='flex flex-col md:flex-row w-full items-center justify-center gap-3'>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">SELECT DATE</span>
              </div>
              <input
                type="date"
                name="date"
                onChange={(e: any) => setStartDate(e.target.value)}
                max={maxDate}
                value={date}
                className="input input-bordered"
              />
            </label>

            <label className="w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">SEARCH</span>
              </div>
              <button onClick={handleSubmit} className='btn btn-success'><IoSearch size={30} /></button>
            </label>

          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setTransferModalOpen(true)}
            >
              Transfer Stock
            </button>
          </div>
          {transferModalOpen && (
            <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="transfer-stock-title">
              <div className="modal-box max-w-3xl">
                <div className="mb-4 flex items-center justify-between">
                  <h2 id="transfer-stock-title" className="text-lg font-bold">TRANSFER STOCK</h2>
                  <button
                    type="button"
                    className="btn btn-sm btn-circle btn-ghost"
                    aria-label="Close transfer dialog"
                    disabled={transferPending}
                    onClick={() => setTransferModalOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text-alt">SOURCE PRODUCT</span>
                    </div>
                    <Select className="text-black" name="pname" onChange={(selectedOption: any) => { setSourceWarehouse(selectedOption.warehouse); setProductName(selectedOption.value); setSourceCategory(selectedOption.category); setPresentQty(selectedOption.presentQty); }} options={itemOption} />

                  </label>
                  <label className="form-control">
                    <span className="label-text-alt mb-1">TRANSFER QUANTITY</span>
                    <input
                      type="number"
                      min="0.01"
                      max={presentQty}
                      step="any"
                      className="input input-bordered"
                      value={transferQty}
                      onChange={(e) => setTransferQty(e.target.value)}
                      placeholder="Enter quantity"
                    />
                  </label>
                  <label className="form-control">
                    <span className="label-text-alt mb-1">DESTINATION WAREHOUSE</span>
                    <select className='select select-sm select-bordered bg-white text-black' onChange={(e: any) => { setDestinationWarehouse(e.target.value) }}>
                      <option selected disabled>Select . . .</option>
                      <option value="Vabnatola Ghat">Vabnatola Ghat</option>
                      <option value="Takerhat Ghat">Takerhat Ghat</option>
                      <option value="Nariya Godawn">Nariya Godawn</option>
                      <option value="Factory House">Factory House</option>
                      <option value="Iron House">Iron House</option>
                    </select>
                  </label>
                  <label className="form-control">
                    <span className="label-text-alt mb-1">DESTINATION CATEGORY</span>
                    <select className='select select-sm select-bordered bg-white text-black' onChange={(e: any) => { setDestinationCategory(e.target.value) }}>
                      <option selected disabled>Select . . .</option>
                      <option value="Pr Cement 1">Pr Cement 1</option>
                      <option value="Pr Cement 2">Pr Cement 2</option>
                      <option value="Pr Cement 3">Pr Cement 3</option>
                      <option value="Rod">Rod</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                </div>
                <div className="modal-action">
                  <button
                    type="button"
                    className="btn"
                    disabled={transferPending}
                    onClick={() => setTransferModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="button" onClick={handleTransfer} className="btn btn-primary" disabled={transferPending}>
                    {transferPending ? "TRANSFERRING..." : "TRANSFER STOCK"}
                  </button>
                </div>

              </div>
            </div>
          )}
          <div className="flex justify-between pl-5 pr-5 pt-1">
            <label className="input input-bordered flex max-w-xs  items-center gap-2">
              <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
              </svg>
            </label>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <button
                  className={`btn ${viewMode === "group" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setViewMode("group")}
                >
                  Group View
                </button>
                <button
                  className={`btn ${viewMode === "details" ? "btn-primary" : "btn-outline"}`}
                  onClick={() => setViewMode("details")}
                >
                  Details
                </button>
              </div>
              <ExcelExport tableRef={contentToPrint} fileName="stock_report" />
              <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>
          </div>
          <div className="flex w-full justify-center p-5">
            <div className="overflow-x-auto">
              <div ref={contentToPrint} className="flex-1 p-5">
                <div className="flex justify-center">
                  <img src="/img/crowncement-logo.png" alt="Logo" className="m-4" />
                </div>
                <div className="flex w-full justify-center items-center">
                  <img src="/img/logo.png" alt="Logo" className="w-16 h-20 mr-3" />
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">P.R CEMENT CENTER</h2>
                    <p className="text-sm">Char Sayedpur, Narayanganj - 1400</p>
                    <p className="text-sm">Phone: 01675-336060 | Email: prcementcenter@gmail.com</p>
                  </div>
                </div>
                <div className="flex flex-col items-center pb-5"><h4 className="font-bold">PRODUCT STOCK</h4>
                  <h4><CurrentDate /></h4>
                </div>
                <table className="table table-zebra table-xs md:table-sm table-pin-rows">

                  {/* <thead className="sticky top-16 bg-base-100">
                    <tr>
                      <th>SN</th>
                      <th>WAREHOUSE</th>
                      <th>CATEGORY</th>
                      <th>PRODUCT</th>
                      <th>OPENING</th>
                      <th>ENTRY</th>
                      <th>SOLD</th>
                      <th>CLOSING</th>
                      <th>AVE RATE</th>
                      <th>VALUE</th>
                      <th>SUMMARY</th>
                    </tr>
                  </thead>
                  <tbody>

                    {Object.entries(warehouseGroups)?.map(([warehouse, { products, totalClosingQty, totalValue }]) => {
                      return products.map((product, idx) => (
                        <tr key={`${warehouse}-${idx}`}>
                          <td>{serialNo++}</td>
                          <td className="uppercase">{product.warehouse}</td>
                          <td className="uppercase">{product.category}</td>
                          <td className="uppercase">{product.productName}</td>
                          <td>{Number(product.previousQty?.toFixed(2)).toLocaleString('en-IN')}</td>
                          <td>{Number(product.todayEntryQty?.toFixed(2)).toLocaleString('en-IN')}</td>
                          <td>{Number(product.todaySaleQty?.toFixed(2)).toLocaleString('en-IN')}</td>
                          <td>{Number(product.presentQty?.toFixed(2)).toLocaleString('en-IN')}</td>
                          <td>{Number(product.costPrice?.toFixed(2)).toLocaleString('en-IN')}</td>
                          <td>{Number(product.totalValue?.toFixed(2)).toLocaleString('en-IN')}</td>

                          {idx === 0 && (
                            <td rowSpan={products.length} className="bg-base-200 text-center">
                              <div className="border border-slate-700 p-2">
                                <div className="font-bold">{warehouse}</div>
                                <div>Closing Qty: {Number(totalClosingQty?.toFixed(2)).toLocaleString("en-IN")}</div>
                                <div>Value: {Number(totalValue?.toFixed(2)).toLocaleString("en-IN")}</div>
                              </div>
                            </td>
                          )}
                        </tr>
                      ));
                    })}
                  </tbody> */}
                  {/* <tfoot>
                    <tr className="font-semibold text-lg">
                      <td colSpan={2}></td>
                      <td>TOTAL</td>
                      <td>{Number(totalPrevious?.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(totalTodayEntry?.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(totalTodaySale?.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(totalPrestntQty?.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(totalCost?.toFixed(2)).toLocaleString('en-IN')}</td>
                      <td>{Number(totalTotal?.toFixed(2)).toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot> */}
                  <thead>
                    {viewMode === "details" ? (
                      <tr>
                        <th>SN</th>
                        <th>WAREHOUSE</th>
                        <th>CATEGORY</th>
                        <th>PRODUCT</th>
                        <th>OPENING</th>
                        <th>ENTRY</th>
                        <th>SOLD</th>
                        <th>CLOSING</th>
                        <th>AVE RATE</th>
                        <th>VALUE</th>
                        <th>SUMMARY</th>
                      </tr>
                    ) : (
                      <tr>
                        <th>SN</th>
                        <th>CATEGORY</th>
                        <th>OPENING</th>
                        <th>ENTRY</th>
                        <th>SOLD</th>
                        <th>CLOSING</th>
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {viewMode === "details" ? (
                      Object.entries(warehouseGroups).map(
                        ([warehouse, { products, totalClosingQty, totalValue }]) =>
                          products.map((product, idx) => (
                            <tr key={`${warehouse}-${idx}`}>
                              <td>{serialNo++}</td>
                              <td>{product.warehouse}</td>
                              <td>{product.category}</td>
                              <td>{product.productName}</td>
                              <td>{product.previousQty.toFixed(2)}</td>
                              <td>{product.todayEntryQty.toFixed(2)}</td>
                              <td>{product.todaySaleQty.toFixed(2)}</td>
                              <td>{product.presentQty.toFixed(2)}</td>
                              <td>{product.costPrice.toFixed(2)}</td>
                              <td>{product.totalValue.toFixed(2)}</td>

                              {idx === 0 && (
                                <td rowSpan={products.length}>
                                  <div>
                                    <div>{warehouse}</div>
                                    <div>Closing: {totalClosingQty.toFixed(2)}</div>
                                    <div>Value: {totalValue.toFixed(2)}</div>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))
                      )
                    ) : (
                      categorySummary.map((item: any, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.category}</td>
                          <td>{Number(item.opening.toFixed(2)).toLocaleString("en-IN")}</td>
                          <td>{Number(item.entry.toFixed(2)).toLocaleString("en-IN")}</td>
                          <td>{Number(item.sold.toFixed(2)).toLocaleString("en-IN")}</td>
                          <td>{Number(item.closing.toFixed(2)).toLocaleString("en-IN")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>

                  <tfoot>
                    {viewMode === "details" ? (
                      <tr className="font-semibold text-lg">
                        <td colSpan={4}>TOTAL</td>
                        <td>{Number(totalPrevious.toFixed(2)).toLocaleString("en-IN")}</td>
                        <td>{Number(totalTodayEntry.toFixed(2)).toLocaleString("en-IN")}</td>
                        <td>{Number(totalTodaySale.toFixed(2)).toLocaleString("en-IN")}</td>
                        <td>{Number(totalPrestntQty.toFixed(2)).toLocaleString("en-IN")}</td>
                        <td>{Number(totalCost.toFixed(2)).toLocaleString("en-IN")}</td>
                        <td>{Number(totalTotal.toFixed(2)).toLocaleString("en-IN")}</td>
                        <td></td>
                      </tr>
                    ) : (
                      <tr className="font-semibold text-lg">
                        <td></td>
                        <td>TOTAL</td>
                        <td>{Number(totalPrevious.toFixed(2)).toLocaleString("en-IN")}</td>
                        <td>{Number(totalTodayEntry.toFixed(2)).toLocaleString("en-IN")}</td>
                        <td>{Number(totalTodaySale.toFixed(2)).toLocaleString("en-IN")}</td>
                        <td>{Number(totalPrestntQty.toFixed(2)).toLocaleString("en-IN")}</td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page