import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";

// React Icons
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { IoArrowBackCircle } from "react-icons/io5";
// Image Logo Sidebar
import Logo from "../../assets/Images/NoBackgroundLogo.png";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="relative flex">
      {/* Hamburger menu icon */}
      <div className="p-4 z-20 flex lg:hidden">
        <button onClick={handleOpen}>
          {open ? <IoMdClose className="text-3xl" /> : <GiHamburgerMenu className="text-3xl" />}
        </button>
      </div>

      {/* Sidebar */}
      <Card
        className={`fixed  top-0 left-0 h-screen w-[18rem] max-h-screen overflow-y-auto p-4 shadow-xl shadow-blue-gray-900/5 transition-transform duration-300 z-20 ${
          open ? 'translate-x-0' : '-translate-x-full' 
        } lg:translate-x-0 lg:static lg:sticky`}
      >
        <div className="flex justify-center  p-2 ">
          <Typography variant="h5" color="blue-gray">
            <img src={Logo} alt="Logo Dashboard" className="w-24" />
          </Typography>
        </div>

        <List className="space-y-5 p-2">
          <ListItem>
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Link to="/dashboard/core" className="text-xl font-semibold" onClick={handleOpen}>
              Dashboard
            </Link>
          </ListItem>

          <ListItem>
            <ListItemPrefix>
              <ShoppingBagIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Link to="/dashboard/product" className="text-xl font-semibold" onClick={handleOpen}>
              Product
            </Link>
          </ListItem>

          <ListItem>
            <ListItemPrefix>
              <FaUserFriends className="h-5 w-5" />
            </ListItemPrefix>
            <Link to="/dashboard/users" className="text-xl font-semibold" onClick={handleOpen}>
              Users
            </Link>
          </ListItem>

          <ListItem>
            <ListItemPrefix>
              <IoArrowBackCircle  className="h-5 w-5" />
            </ListItemPrefix>
            <Link to="/" className="text-xl font-semibold" onClick={handleOpen}>
              Back to Home
            </Link>
          </ListItem>
          
        </List>
      </Card>

      {/* Overlay to close sidebar */}
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-10 lg:hidden"
          onClick={handleOpen}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
