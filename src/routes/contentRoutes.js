import React from 'react';
import { useAuthContext } from '../context/authContext';
import CustomerDetail from '../pages/admin/customerDetail';
import CustomerPanel from '../pages/admin/customerPanel';
import OrderPanel from '../pages/admin/orderPanel';
import ProductPanel from '../pages/admin/productPanel';
import SettingPanel from '../pages/admin/settingPanel';

const adminRoutes = [
  {
    id: crypto.randomUUID(),
    title: 'Product List',
    route: 'products',
    isActiveRoute: true,
    element: <ProductPanel />
  },
  {
    id: crypto.randomUUID(),
    title: 'Order List',
    route: 'orders',
    isActiveRoute: true,
    element: <OrderPanel />
  },
  {
    id: crypto.randomUUID(),
    title: 'Customer List',
    route: 'customers',
    isActiveRoute: true,
    element: <CustomerPanel />
  },
  {
    id: crypto.randomUUID(),
    title: 'Customer List',
    route: 'customers/:id/detail',
    isActiveRoute: false,
    element: <CustomerDetail />
  },
  {
    id: crypto.randomUUID(),
    title: 'Settings',
    route: 'settings',
    isActiveRoute: true,
    element: <SettingPanel />
  },
]

// const customerRoutes = [
//   {
//     id: crypto.randomUUID(),
//     title: 'My Orders',
//     route: 'my_orders',
//     isActiveRoute: true,
//     element: <EmployeeAttendencePanel />
//   },
//   {
//     id: crypto.randomUUID(),
//     title: 'Profile',
//     route: 'profile',
//     isActiveRoute: true,
//     element: <EmployeeProfile />
//   },
// ]


const ContentRoute = () => {
  const { userData } = useAuthContext();

  // let defaultRoutes = userData !== null ? userData?.isAdmin ? adminRoutes :  customerRoutes : [];
  let defaultRoutes = adminRoutes;
  return {
    defaultRoutes
  };
}

export default ContentRoute

