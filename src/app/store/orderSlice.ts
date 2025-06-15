import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';

interface Product {
    id: string;
    date: string;
    retailer: string;
    orderNote: string;
    productName: string;
    saleRate: string;
    orderQty: string;
    deliveredQty: number;
    username: string;

}

interface ProductState {
    products: Product[];
}

const initialState: ProductState = {
    products: [],
};

export const orderSlice = createSlice({
    name: "orderProducts",
    initialState,
    reducers: {
       
        addProducts: (state, action: PayloadAction<Product>) => {
                    const exist = state.products.find(
                        (pro) =>
                            pro.username === action.payload.username &&
                            pro.retailer === action.payload.retailer &&
                            pro.productName === action.payload.productName &&
                            pro.saleRate === action.payload.saleRate
                          
        
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

export const selectTotalQuantity = (username: string) =>
    createSelector(
        (state: { orderProducts: ProductState }) => state.orderProducts.products,
        (products) =>
            products
                .filter((product) => product.username === username) 
                .reduce(
                    (total, product) => total + parseFloat(product.orderQty || "0"),
                    0
                )
    );
export const { addProducts, deleteProduct, deleteAllProducts } = orderSlice.actions;

export default orderSlice.reducer;

