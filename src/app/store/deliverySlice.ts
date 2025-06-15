import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'

interface Product {
    id: string;
    orderId: number;
    date: string;
    retailer: string;
    orderNote: string;
    productName: string;
    saleRate: string;
    orderQty: string;
    transport: string;
    truckNo: string;
    rent: string;
    username: string;

}

interface ProductState {
    products: Product[];
}

const initialState: ProductState = {
    products: [],
};

export const deliverySlice = createSlice({
    name: "deliveryProducts",
    initialState,
    reducers: {
        addProducts: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find(
                (pro) =>
                    pro.username === action.payload.username &&
                    pro.retailer === action.payload.retailer &&
                    pro.productName === action.payload.productName &&
                    pro.saleRate === action.payload.saleRate &&
                    pro.transport === action.payload.transport &&
                    pro.truckNo === action.payload.truckNo

            );
            if (exist) {
                exist.orderQty = (
                    parseFloat(exist.orderQty) + parseFloat(action.payload.orderQty)
                ).toString();
            } else {
                state.products.push(action.payload);
            }
        },

        deleteProduct: (state, action) => {
            const id = action.payload;
            state.products = state.products.filter((product) => product.id !== id);
        },
        deleteAllProducts: (state) => {
            state.products = [];
        },
    },
});
export const selectTotalQuantity = createSelector(
    (state: { deliveryProducts: ProductState }) => state.deliveryProducts.products,
    (products) =>
        products.reduce(
            (total, product) => total + parseFloat(product.orderQty || "0"),
            0
        )
);

export const { addProducts, deleteProduct, deleteAllProducts } = deliverySlice.actions;

export default deliverySlice.reducer;

