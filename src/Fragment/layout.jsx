import React from 'react'
import Banner from '../components/Banner'
import Product from '../Pages/Product'

function layout({children}) {
  return (
    <div>
        <Banner/>
        {children}
        <Product/>
        </div>
  )
}

export default layout