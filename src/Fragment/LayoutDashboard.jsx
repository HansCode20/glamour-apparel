import React from 'react'
import ItemBox from '../Dashboard/Pages/DashboardCore/ItemBox';
import LastTransaction from '../Dashboard/Pages/DashboardCore/LastTransaction';
import TotalPrice from '../Dashboard/Pages/DashboardCore/TotalPrice';
import BoxImage from '../Dashboard/Pages/DashboardCore/BoxImage';

const LayoutDashboard = ({children}) => {
  return (
    <div>
        <NavbarDashboard />
        <ItemBox/>
        <TotalPrice />
        <LastTransaction/>
        <BoxImage/>
        {children}
    </div>
  )
}

export default LayoutDashboard;