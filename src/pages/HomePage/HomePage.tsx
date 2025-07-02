import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Container, Box, Tabs, Tab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CustomBreadcrumbs } from '@/components/organisms/Breadcrumbs/CustomBreadcrumbs';
import excludedUserTypesFields from '@/helper/excludedUserTypes';
import { useFetchBusinessUsers } from '@/hooks/useUser';
import { useUser } from '@/context/UserContext';
import { ADMIN, SUPPLIER, USER_TYPE } from '@/constants/Constants';
import './homePage.css';
import UpdateBusinessTemplate from '@/components/templates/UpdateBusiness/UpdateBusinessTemplate';
import UpdateUserCategories from '@/components/templates/UpdateBusiness/UpdateUserCategories/UpdateUserCategories';
import UpdateUserServices from '@/components/templates/UpdateBusiness/UpdateUserServices/UpdateUserServices';
import Branches from '@/components/templates/UpdateBusiness/Branches/Branches';
import Addresses from '@/components/templates/UpdateBusiness/Addresses/Addresses';
import UserGallery from '@/components/templates/UpdateBusiness/Gallery/Gallery';
import SuggestService from '@/components/templates/UpdateBusiness/SuggestService/SuggestService';
const UserForm = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const userIdParam = new URLSearchParams(location.search).get('id');
  const userId = userIdParam ? parseInt(userIdParam, 10) : undefined;

  const [activeTab, setActiveTab] = useState(0);
  const [isQueryEnabled, setQueryEnabled] = useState(false);
  const { userData: userDataResponse } = useUser();

  const isAdmin = userDataResponse?.payload?.user_type === ADMIN;

  const { data: businessUsersData } = useFetchBusinessUsers(
    isQueryEnabled ? { filteredId: userId } : { userId: userDataResponse?.id },
  );

  const users = businessUsersData?.data.payload.data || [];
  const selectedUser = users?.filter((user: { id: number | undefined; }) => user.id === userId)[0]
  const isSupplier = selectedUser?.user?.user_type === SUPPLIER;

  useEffect(() => {
    if (!selectedUser) {
      setQueryEnabled(true);
    }
  }, [selectedUser]);
  const shouldShowBranchesTab = !excludedUserTypesFields.some(
    (user) => user.value === selectedUser?.user?.user_type,
  );

  const shouldShowGalleryTab = USER_TYPE.some(
    (user) => user.value === selectedUser?.user?.user_type,
  );

  const getTabLabel = (key: any) => {
    switch (key) {
      case 'product-service':
        return isSupplier ? t('ProfileHomePage.Product_Group') : t('ProfileHomePage.Services');
      case 'suggest':
        return isSupplier ? t('ProfileHomePage.Suggest_Product_Group') : t('ProfileHomePage.Suggest_Services');
      default:
        return t(key);
    }
  };

  const breadcrumbItems = [
    { label: t('BreadcrumbItems.Profile') },
    {
      label:
        activeTab === 0
          ? t('BreadcrumbItems.Business_Info')
          : activeTab === 1
            ? t('BreadcrumbItems.Categories')
            : activeTab === 2
              ? getTabLabel('product-service')
              : activeTab === 3 && shouldShowBranchesTab
                ? t('BreadcrumbItems.Branches')
                : activeTab === (shouldShowBranchesTab ? 4 : 3)
                  ? t('BreadcrumbItems.Addresses')
                  : activeTab === (shouldShowBranchesTab ? 5 : 4) && shouldShowGalleryTab
                    ? t('BreadcrumbItems.Gallery')
                    : getTabLabel('suggest'),
    },
  ];

  return (
    <div className="page-content">
      <Container maxWidth="xl">
        <Box mb={2}>
          <CustomBreadcrumbs items={breadcrumbItems} />
        </Box>

        <Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  fontSize: '13px',
                  fontWeight: 500,
                  padding: '12px 16px',
                  color: '#f05b20',
                  borderColor: 'red',
                  textTransform: 'none',
                },
                '& .MuiTab-root.Mui-selected': {
                  color: '#f05b20',
                },
            
              }}
            >
              <Tab label={t('ProfileHomePage.Business_Info')} />
              <Tab label={t('ProfileHomePage.Categories')} disabled={!selectedUser} />
              <Tab label={getTabLabel('product-service')} disabled={!selectedUser} />
              {shouldShowBranchesTab && <Tab label={t('ProfileHomePage.Branches')} disabled={!selectedUser} />}
              <Tab label={t('ProfileHomePage.Addresses')} disabled={!selectedUser} />
              {shouldShowGalleryTab && <Tab label={t('ProfileHomePage.Gallery')} disabled={!selectedUser} />}
              {!isAdmin && <Tab label={getTabLabel('suggest')} disabled={!selectedUser} />}
              {isAdmin && selectedUser && (
                <Tab
                  label={
                    <Link
                      to={
                        isSupplier
                          ? `/products?page=1&username=${selectedUser.user.username}`
                          : `/projects?page=1&username=${selectedUser.user.username}`
                      }
                      className="text-main hover:underline"
                    >
                      {isSupplier ? t('Products') : t('Projects')}
                    </Link>
                  }
                />
              )}
            </Tabs>
          </Box>

          <Box p={3}>
            {activeTab === 0 && (
              <UpdateBusinessTemplate />
            )}
            {activeTab === 1 && selectedUser && (
              <UpdateUserCategories/>
            )}
            {activeTab === 2 && selectedUser && (
              <UpdateUserServices/>
            )}
            {activeTab === 3 && selectedUser && (
              <Branches selectedUser={selectedUser}/>
            )}
            {activeTab === 4 && selectedUser && (
              <Addresses selectedUser={selectedUser}/>
            )}
            {activeTab === 5 && selectedUser && (
              <UserGallery userId={selectedUser.user_id}/>
            )}
            {activeTab === 6 && selectedUser && (
              <SuggestService userId={selectedUser.user_id}/>
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default UserForm;
