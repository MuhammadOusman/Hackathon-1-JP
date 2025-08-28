import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./AuthSlice/AuthSlice";
import singleUserReducer from "./SingleUserSlice/SingleUserSlice";
import branchReducer from "./BranchSlice";
import productReducer from "./ProductSlice";
import orderReducer from "./OrderSlice";
import offersReducer from "./OffersSlice";
import employeesReducer from "./EmployeesSlice";
import reviewsReducer from "./ReviewsSlice";
import cartReducer from "./CartSlice";
export const store = configureStore({
  reducer: {
    userReducer,
    singleUserReducer,
    branchReducer,
    productReducer,
    orderReducer,
    offersReducer,
    employeesReducer,
    reviewsReducer,
  cartReducer,
  },
});
