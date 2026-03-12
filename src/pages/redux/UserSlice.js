import { createSlice } from "@reduxjs/toolkit";

const userslice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    currentcity: null,
    currentstate: null,
    currentaddress: null,
    currentshops: null,
    currentitems: null,
    cartitems: [],
     totalamount:0,
      myorders:null,
      socket:null,
      searchitems:[]
  },

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },

    setCurrentCity: (state, action) => {
      state.currentcity = action.payload;
    },

    setCurrentState: (state, action) => {
      state.currentstate = action.payload;
    },

    setCurrentAddress: (state, action) => {
      state.currentaddress = action.payload;
    },

    setCurrentShops: (state, action) => {
      state.currentshops = action.payload;
    },

    setCurrentitems: (state, action) => {
      state.currentitems = action.payload;
    },
      setsocket: (state, action) => {
      state.socket = action.payload;
    },


    Addtocart: (state, action) => {
      const newItem = action.payload;

      // যদি item already থাকে, quantity বাড়াও
      const existingItem = state.cartitems.find(
        (item) => item.id === newItem.id
      );

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        if (!existingItem.shop && newItem.shop) {
          existingItem.shop = newItem.shop;
        }
      } else {
        // push করার আগে shallow copy নিই যাতে Immer proxy revoke না হয়
        state.cartitems.push({ ...newItem });
      }
        state.totalamount=state.cartitems.reduce((sum,i)=>sum+i.price*i.quantity,0)
 console.log("🛒 Updated cart:", JSON.parse(JSON.stringify(state.cartitems)));
    },
 Updatquantity: (state, action) => {
  const { id, quantity } = action.payload;

  // state থেকে cartitems নিচ্ছি
  const item = state.cartitems.find(i => i.id === id);

  if (item) {
    item.quantity = quantity;
  }
  state.totalamount=state.cartitems.reduce((sum,i)=>sum+i.price*i.quantity,0)
},
RemoveItem: (state, action) => {
  const { id } = action.payload;
  state.cartitems = state.cartitems.filter(i => i.id !== id);
    state.totalamount=state.cartitems.reduce((sum,i)=>sum+i.price*i.quantity,0)
},
setMyorders:(state,action)=>{
  state.myorders=action.payload



},

 setSerachItems:(state,action)=>{

   state.searchitems=action.payload



 }






    }
  
});

export const {
  setUserData,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  setCurrentShops,
  setCurrentitems,
  Addtocart,
   Updatquantity,
   RemoveItem,
   totalamount,
   setMyorders,
   setsocket,
   setSerachItems
 

} = userslice.actions;

export default userslice.reducer;
