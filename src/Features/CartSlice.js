import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';  // Ensure the import path is correct

const initialState = {
  cartitems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
  favoriteItems: localStorage.getItem('favoriteItems') ? JSON.parse(localStorage.getItem('favoriteItems')) : [],
  cartTotalQuantity: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')).reduce((total, item) => total + item.cartQuantity, 0) : 0,
  cartTotalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const itemIndex = state.cartitems.findIndex((item) => item.id === action.payload.id);
      if (itemIndex >= 0) {
        state.cartitems[itemIndex] = {
          ...state.cartitems[itemIndex],
          cartQuantity: state.cartitems[itemIndex].cartQuantity + 1,
        };
        toast.info(`Increased ${state.cartitems[itemIndex].title} quantity`, {
          position: 'top-center',
          autoClose: 1000,
        });
      } else {
        const tempProduct = { ...action.payload, cartQuantity: 1 };
        state.cartitems.push(tempProduct);
        toast.success(`${action.payload.title} added to cart`, {
          position: 'top-center',
          autoClose: 1000,
        });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartitems));

      state.cartTotalQuantity = state.cartitems.reduce(
        (total, item) => total + item.cartQuantity,
        0
      );
    },

    addToFavorite(state, action) {
      const itemIndex = state.favoriteItems.findIndex((item) => item.id === action.payload.id);
      if (itemIndex >= 0) {
        state.favoriteItems[itemIndex] = {
          ...state.favoriteItems[itemIndex],
          cartQuantity: state.favoriteItems[itemIndex].cartQuantity + 1,
        };
        toast.info(`Increased ${state.favoriteItems[itemIndex].title} quantity`, {
          position: 'top-center',
          autoClose: 1000,
        });
      } else {
        const tempProduct = { ...action.payload, cartQuantity: 1 };
        state.favoriteItems.push(tempProduct);
        toast.success(`${action.payload.title} added to favorites`, {
          position: 'top-center',
          autoClose: 1000,
        });
      }
      localStorage.setItem('favoriteItems', JSON.stringify(state.favoriteItems));
    },

    removeFavoriteCart(state, action) {
      const nextFavoriteItems = state.favoriteItems.filter(
        (favoriteItem) => favoriteItem.id !== action.payload.id
      );

      state.favoriteItems = nextFavoriteItems;
      localStorage.setItem('favoriteItems', JSON.stringify(state.favoriteItems));
      toast.success(`${action.payload.title} removed from favorites`, {
        position: 'top-center',
        autoClose: 1000,
      });

      state.cartTotalQuantity = state.cartitems.reduce(
        (total, item) => total + item.cartQuantity,
        0
      );
    },


    removeFromCart(state, action) {
      const nextCartItems = state.cartitems.filter(
        (cartItem) => cartItem.id !== action.payload.id
      );

      state.cartitems = nextCartItems;
      localStorage.setItem('cartItems', JSON.stringify(state.cartitems));
      toast.success(`${action.payload.title} removed from cart`, {
        position: 'top-center',
        autoClose: 1000,
      });
      state.cartTotalQuantity = state.cartitems.reduce(
        (total, item) => total + item.cartQuantity,
        0
      );
    },

    removeFromFavorite(state, action) {
      const nextFavoriteItems = state.favoriteItems.filter(
        (favoriteItem) => favoriteItem.id !== action.payload.id
      );

      state.favoriteItems = nextFavoriteItems;
      localStorage.setItem('favoriteItems', JSON.stringify(state.favoriteItems));
      toast.success(`${action.payload.title} removed from favorites`, {
        position: 'top-center',
        autoClose: 1000,
      });
    },

    decreaseCart(state, action) {
      const itemIndex = state.cartitems.findIndex(
        (cartItem) => cartItem.id === action.payload.id
      );

      if (state.cartitems[itemIndex].cartQuantity > 1) {
        state.cartitems[itemIndex].cartQuantity -= 1;
        toast.info(`Decreased ${state.cartitems[itemIndex].title} quantity`, {
          position: 'top-center',
          autoClose: 1000,
        });
      } else if (state.cartitems[itemIndex].cartQuantity === 1) {
        const nextCartItems = state.cartitems.filter(
          (cartItem) => cartItem.id !== action.payload.id
        );
        state.cartitems = nextCartItems;
        localStorage.setItem('cartItems', JSON.stringify(state.cartitems));
        toast.success(`${action.payload.title} removed from cart`, {
          position: 'top-center',
          autoClose: 1000,
        });
      }

      state.cartTotalQuantity = state.cartitems.reduce(
        (total, item) => total + item.cartQuantity,
        0
      );
    },

    increaseCart(state, action) {
      const itemIndex = state.cartitems.findIndex(
        (cartItem) => cartItem.id === action.payload.id
      );

      if (state.cartitems[itemIndex].cartQuantity >= 1) {
        state.cartitems[itemIndex].cartQuantity += 1;
        toast.info(`Increased ${state.cartitems[itemIndex].title} quantity`, {
          position: 'top-center',
          autoClose: 1000,
        });
      } else if (state.cartitems[itemIndex].cartQuantity === 1) {
        const nextCartItems = state.cartitems.filter(
          (cartItem) => cartItem.id !== action.payload.id
        );
        state.cartitems = nextCartItems;
        localStorage.setItem('cartItems', JSON.stringify(state.cartitems));
        toast.success(`${action.payload.title} removed from cart`, {
          position: 'top-center',
          autoClose: 1000,
        });
      }
      state.cartTotalQuantity = state.cartitems.reduce(
        (total, item) => total + item.cartQuantity,
        0
      );
    },

    clearCart(state, action) {
      state.cartitems = [];
      localStorage.setItem('cartItems', JSON.stringify(state.cartitems));
      toast.success(`Cart cleared`, {
        position: 'top-center',
        autoClose: 1000,
      });
      state.cartTotalQuantity = state.cartitems.reduce(
        (total, item) => total + item.cartQuantity,
        0
      );
    },
    clearCartWithoutNotification(state, action) {
      state.cartitems = [];
      localStorage.setItem('cartItems', JSON.stringify(state.cartitems));
      state.cartTotalQuantity = state.cartitems.reduce(
        (total, item) => total + item.cartQuantity,
        0
      );
    },
    
  },
});


export const { addToCart, addToFavorite, removeFromCart, removeFromFavorite, decreaseCart, increaseCart, clearCart, clearCartWithoutNotification } = cartSlice.actions;
export default cartSlice.reducer;
