// Libraries
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Route } from 'react-router-dom';

//DAO
import {CartDAO} from './utils/CartDAO';

// Views
import { ProductDetail } from './views/ProductDetail/ProductDetail.jsx';
import { Products } from './views/Products/Products.jsx';
import { Landing } from './views/Landing/Landing.jsx';
import { Cart } from "./views/Cart/Cart.jsx";

// Components
import {Banner} from "./components/Banner/Banner.jsx";

// Contexts
import {QueryContext} from "./contexts/QueryContext";
import {CartContext} from "./contexts/CartContext";

// Utils
import {parseQueries} from "./utils/parseQueries";
import {serverRequests} from "./utils/serverRequests";

export const App = props =>{

  let queries = parseQueries( useLocation().search );
  let [queryParams, setQueryParams] = useState(queries || {});

  let cartDAO = new CartDAO();
  let [cart, setCart] = useState( cartDAO.items );
  cartDAO.itemStateSetter = setCart;

  return(
    <div id={'App'}>
      <QueryContext.Provider value={queryParams}>
        <CartContext.Provider value={{ cart, cartAccess: cartDAO }}>

          <Banner/>

          <Route exact path='/products'>
            <Products/>
          </Route>

          <Route exact path='/products/:productId'>
            <ProductDetail />
          </Route>

          <Route exact path='/cart'>
            <Cart/>
          </Route>

          <Route exact path='/'>
            <Landing/>
          </Route>

        </CartContext.Provider>
      </QueryContext.Provider>
    </div>
  );
}