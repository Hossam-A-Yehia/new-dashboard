import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import ListAltIcon from '@mui/icons-material/ListAlt';
import OrderIcon from '@mui/icons-material/Pages';
import CategoryIcon from '@mui/icons-material/Category';
import WorkIcon from '@mui/icons-material/Work';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import LayersIcon from '@mui/icons-material/Layers';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InventoryIcon from '@mui/icons-material/Inventory';
import SearchIcon from '@mui/icons-material/Search';
import WalletIcon from '@mui/icons-material/Wallet';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import MailIcon from '@mui/icons-material/Mail';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HistoryIcon from '@mui/icons-material/History';
import PolicyIcon from '@mui/icons-material/Policy';
import ArticleIcon from '@mui/icons-material/Article';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CommentIcon from '@mui/icons-material/Comment';
import BookIcon from '@mui/icons-material/Book';

import {
  ADMIN_TYPE,
  MARKETING,
  PRODUCT_GROUP,
  SERVICE,
  SERVICE_PROVIDER_CONTRACTOR,
  SERVICE_PROVIDER_FIRM,
  SERVICEPROVIDER_TYPE,
  SERVICEPROVIDER_TYPE_PROJECTS,
  SUPPLIER_TYPE,
} from '@/constants/Constants';
import { t } from 'i18next';

export const getMenuItems = (userData: { business_user_detail: { id: any; }; id: any; }) => [
  {
    text: t('MenuItems.Profile'),
    path: `/profile?id=${userData?.business_user_detail?.id ?? ''}`,
    icon: <HomeIcon />,
    userTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    text: t('MenuItems.Users_List'),
    path: '/users?page=1',
    icon: <PeopleIcon />,
    userTypes: [...ADMIN_TYPE, MARKETING],
  },
  {
    text: t('MenuItems.Business_users'),
    path: '/business-users?page=1',
    icon: <BusinessIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Technical_users_requests'),
    path: '/technical-user-requests',
    icon: <ListAltIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Roles_and_permissions'),
    path: '/roles',
    icon: <SettingsIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Employees'),
    path: '/subUsers',
    icon: <PeopleIcon />,
    userTypes: [SERVICE_PROVIDER_CONTRACTOR, SERVICE_PROVIDER_FIRM, ...SUPPLIER_TYPE],
  },
  {
    text: t('MenuItems.Categories'),
    path: '/categories',
    icon: <CategoryIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Services'),
    path: `/services?page=1&serviceType=${SERVICE}`,
    icon: <WorkIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Product_Group'),
    path: `/product-group?page=1&serviceType=${PRODUCT_GROUP}`,
    icon: <GroupWorkIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Projects'),
    path: '/projects?page=1',
    icon: <LayersIcon />,
    userTypes: [...ADMIN_TYPE, ...SERVICEPROVIDER_TYPE_PROJECTS],
  },
  {
    text: t('MenuItems.Ideas'),
    path: '/ideas?page=1',
    icon: <LayersIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Products'),
    path: '/products?page=1',
    icon: <ShoppingBagIcon />,
    userTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE],
  },
  {
    text: t('MenuItems.Packages'),
    path: '/packages',
    icon: <InventoryIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Package'),
    path: `/packages/${userData?.id ?? ''}`,
    icon: <InventoryIcon />,
    userTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    text: t('MenuItems.Attributes'),
    path: '/attributes',
    icon: <InventoryIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Google_Crawling'),
    path: '/google-crawling',
    icon: <SearchIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Wallets'),
    path: '/wallets',
    icon: <WalletIcon />,
    userTypes: [...ADMIN_TYPE, ...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    text: t('MenuItems.RFQs'),
    path: '/rfqs',
    icon: <RequestQuoteIcon />,
    userTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE, ...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Invitations'),
    path: '/invitations',
    icon: <MailIcon />,
    userTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    text: t('MenuItems.Asks'),
    path: '/asks',
    icon: <BarChartIcon />,
    userTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE, ...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Received_Asks'),
    path: '/reveived-asks',
    icon: <BarChartIcon />,
    userTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    text: t('MenuItems.Service_Request'),
    path: '/service-requests',
    icon: <SupportAgentIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Activities'),
    path: '/activities?page=1',
    icon: <HistoryIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Policy'),
    path: '/policy',
    icon: <PolicyIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Incoming_orders'),
    path: '/orders',
    icon: <OrderIcon />,
    userTypes: [...SUPPLIER_TYPE, ...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.My_orders'),
    path: '/my-orders',
    icon: <ListAltIcon />,
    userTypes: [...SUPPLIER_TYPE, ...SERVICEPROVIDER_TYPE],
  },
  {
    text: t('MenuItems.Settings'),
    path: '/setting',
    icon: <SettingsIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.News'),
    path: '/news?page=1',
    icon: <ArticleIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Ads-Manager'),
    path: '/ads-manager?page=1',
    icon: <AdUnitsIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.FAQs'),
    path: '/faqs',
    icon: <QuestionAnswerIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Reviews'),
    path: '/reviews',
    icon: <CommentIcon />,
    userTypes: [...ADMIN_TYPE],
  },
  {
    text: t('MenuItems.Technical_docs'),
    path: '/technical-docs',
    icon: <BookIcon />,
    userTypes: [...SUPPLIER_TYPE],
  },
];
