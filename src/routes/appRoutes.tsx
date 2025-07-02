import { JSX } from 'react';
import HomePage from '../pages/HomePage/HomePage';
import { ADMIN_TYPE, MARKETING, SERVICEPROVIDER_TYPE, SUPPLIER_TYPE } from '@/constants/Constants';
import Projects from '@/pages/Projects/Projects';
import ProjectIdeas from '@/pages/Ideas/ProjectIdeas';
import Products from '@/pages/Products/Products';
import RFQs from '@/pages/RFQs/RFQs';
import RFQsDetails from '@/pages/RFQs/RFQsDetails';
import ASKs from '@/pages/ASKs/ASks';
import ASKsDetails from '@/pages/ASKs/ASKsDetails';
import Invitations from '@/pages/Invitations/Invitations';
import InvitationsDetails from '@/pages/Invitations/InvitaionsDetails';
import RecievedAsks from '@/pages/RecievedAsks/RecievedAsks';
import RecievedAsksDetails from '@/pages/RecievedAsks/RecievedAsksDetails';
import Wallets from '@/pages/Wallets/Wallets';
import Orders from '@/pages/Orders/Orders';
import OrderDetails from '@/pages/OrderDetails/OrderDetails';
import Variants from '@/pages/variants/Variants';
import AddRfqPage from '@/pages/AddRfq/AddRfqPage';
import SubUsers from '@/pages/SubUsers/Subusers';
import Quotations from '@/pages/Quotations/Quotations';
import Replies from '@/pages/Replies/Replies';
import DiscussionPage from '@/pages/Discussion/DiscussionPage';
import SubscriptionPage from '@/pages/SubscriptionPage/SubscriptionPage';

export interface AppRoute {
  path: string;
  element: JSX.Element;
  allowedTypes: number[];
  isPublic?: boolean;
}

const appRoutes: AppRoute[] = [
  {
    path: '/',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/users',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE, MARKETING],
  },
  {
    path: '/user-form',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/user/:id',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/user',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE, MARKETING],
  },
  {
    path: '/user-gallery',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/branches',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/addresses',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/business-users',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/categories',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/services',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/ideas',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/product-group',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/projects/:id/ideas',
    element: <ProjectIdeas />,
    allowedTypes: [...ADMIN_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/projects',
    element: <Projects />,
    allowedTypes: [...ADMIN_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/variants',
    element: <Variants />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE],
  },
  {
    path: '/products',
    element: <Products />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE],
  },
  {
    path: '/attributes',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/google-crawling',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/setting',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/packages',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/packages/:id',
    element: <SubscriptionPage />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/faqs',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/help/:id',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/rfqs',
    element: <RFQs />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/rfp-details/:id',
    element: <RFQsDetails />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/discussion/:id',
    element: <DiscussionPage />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/rfp/:id/quotations',
    element: <Quotations />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/ask/:id/replies',
    element: <Replies />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/ask-details/:id',
    element: <ASKsDetails />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/invitation-details/:id',
    element: <InvitationsDetails />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/reveived-asks-details/:id',
    element: <RecievedAsksDetails />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/ask/:id/replies',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/add-rfq',
    element: <AddRfqPage />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/add-ask',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/asks',
    element: <ASKs />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/profile',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/profileinfo',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE, ...ADMIN_TYPE],
  },
  {
    path: '/wallets',
    element: <Wallets />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/service-requests',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/groups',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/activities',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/orders',
    element: <Orders />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE],
  },
  {
    path: '/my-orders',
    element: <Orders isMyOrder />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/supplier-order/:id',
    element: <OrderDetails />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE],
  },
  {
    path: '/client-order/:id',
    element: <OrderDetails isMyOrder />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/notifications',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/ads-manager',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/news',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/wallet-points',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE, ...ADMIN_TYPE],
  },
  {
    path: '/wallet-money',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE, ...ADMIN_TYPE],
  },
  {
    path: '/invitations',
    element: <Invitations />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/reveived-asks',
    element: <RecievedAsks />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/technical-docs/craete-product',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE],
  },
  {
    path: '/technical-docs/user-serviceId',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE],
  },
  {
    path: '/technical-docs/attributes',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE],
  },
  {
    path: '/technical-docs/download-template',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE],
  },
  {
    path: '/technical-docs/insert-products',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE],
  },
  {
    path: '/technical-user-requests',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/roles',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/subUsers',
    element: <SubUsers />,
    allowedTypes: [...SERVICEPROVIDER_TYPE, ...SUPPLIER_TYPE],
  },
  {
    path: '/reviews',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/rfp/:id/discussion',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/invitation/:id/discussion',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/ask/:id/discussion',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/received-ask/:id/discussion',
    element: <HomePage />,
    allowedTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/logout',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    path: '/policy',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '/terms-and-conditions',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE],
  },
  {
    path: '*',
    element: <HomePage />,
    allowedTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
];

export default appRoutes;
