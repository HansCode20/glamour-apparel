
import React, {useState, useEffect} from 'react';
import NavbarDashboard from './DashboardCore/AboveComponents';
import ItemBox from './DashboardCore/ItemBox';
import TotalPrice from './DashboardCore/TotalPrice';
import AllUser from './DashboardCore/AllUser';
import BoxImage from './DashboardCore/BoxImage';
import Loading from "./../../Features/Loading";

function DashboardLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate a 1 second loading time

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-5">
      <div>
        <NavbarDashboard />
        <hr />
      </div>
      <div>
        <ItemBox />
      </div>
      <div className='flex justify-between items-center flex-col lg:flex-row'>
        <TotalPrice />
        <AllUser/>
      </div>
      <div>
          <BoxImage />
      </div>
    </div>
  );
}

export default DashboardLayout;
