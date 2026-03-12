import { createSlice } from "@reduxjs/toolkit";

const ownerslice=createSlice({
    name:"owner",
    initialState:{
      shopData:null,
      ownerorders:null,

      


    },
    reducers:{
        setShopData:(state,action)=>{
            state.shopData=action.payload










        },
        setownerorders:(state,action)=>{

       state.ownerorders=action.payload



        },
        updateownerorderstatus: (state, action) => {
  const { orderId, shopId, status } = action.payload;
  const order = state.ownerorders.find(o => o._id === orderId);
  if (order) {
    const shopOrder = order.shopOrder.find(s => s.shop._id === shopId);
    if (shopOrder) {
      shopOrder.status = status;
    }
  }
}

       
     





    },

















})
export const {setShopData,setownerorders,updateownerorderstatus}=ownerslice.actions;
export  default ownerslice.reducer