import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Redux
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import ProductSlice, { fetchProducts } from './Features/ProductSlice'
import { productApi } from './Features/ProductApi.js'
import cartReducer from './Features/CartSlice.js'

const store = configureStore({
  reducer: {
    product: ProductSlice,
    cart: cartReducer,
    [productApi.reducerPath]: productApi.reducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(productApi.middleware)
})

store.dispatch(fetchProducts())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
)
