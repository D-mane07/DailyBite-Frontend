

import {configureStore } from "@reduxjs/toolkit"
import userslice from "./UserSlice.js"
import ownerslice from "./OwnerSlice.js"
import MapSlice from "./MapSlice.js"
export const store=configureStore({
     reducer:{

        user:userslice,
        owner:ownerslice,
      Map:MapSlice
     },
     devTools:true  
   









})