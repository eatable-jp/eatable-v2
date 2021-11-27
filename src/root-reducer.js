import { combineReducers } from 'redux';

import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage'

import sellerInfoReduce from "./slice/sellerInfoSlice";
import buyerInfoReduce from "./slice/buyerInfoSlice";
import cartReducer from "./slice/cartSlice";
import itemsReducer from "./slice/itemsSlice";
import purchasesReducer from "./slice/purchasesSlice";
import locationReducer from "./slice/locationSlice";
import sellersReducer from "./slice/sellersSlice";
import loginReducer from "./slice/loginSlice"
import userReducer from "./slice/userSlice"

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['sellerInfo', 'buyerInfo', 'cart', 'items', 'purchases', 'location', 'sellers', 'login','user' ]
}

const rootReducaer = combineReducers({
    sellerInfo: sellerInfoReduce,
    buyerInfo: buyerInfoReduce,
    cart: cartReducer,
    items: itemsReducer,
    purchases: purchasesReducer,
    location: locationReducer,
    sellers: sellersReducer ,
    login: loginReducer,
    user: userReducer
});

export default persistReducer(persistConfig, rootReducaer);