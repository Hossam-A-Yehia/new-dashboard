import apiClient from '@/config/apiClient';
import userEndpoints from '@/config/endpoints/userEndpoints';
import { GetBusinessUsersAPIParams } from '@/types/Services';

export const getUser = async () => {
  const response = await apiClient.get(`${userEndpoints.getUser}`);
  return response.data.payload;
};

export const mutateTechnicalUser = () => apiClient.post(userEndpoints.technical_user);

export const getBusinessUsers = (params: GetBusinessUsersAPIParams) => {
  const {
    page = 1,
    paginate = true,
    filteredId,
    accountStatus,
    yearsOfExperience,
    classifications,
    numberOfEmployees,
    volumeOfWork,
    email,
    username,
    businessName,
    businessEmail,
    hotLine,
    referralCode,
    userType,
    userTypes,
    countryId,
    cityId,
    businessphone,
    priceRange,
    packages,
    filteredPackages,
    DeletedUsers,
    userId,
  } = params;

  const queryParams: string[] = [`page=${page}`];

  if (filteredId !== undefined) {
    queryParams.push(`filters[id][$eq]=${filteredId}`);
  }
  if (userId !== undefined) {
    queryParams.push(`filters[user_id][$eq]=${userId}`);
  }
  if (accountStatus !== undefined) {
    queryParams.push(`filters[user][account_status][$eq]=${accountStatus}`);
  }
  if (yearsOfExperience !== undefined) {
    queryParams.push(`filters[years_of_experience][$eq]=${yearsOfExperience}`);
  }
  if (classifications !== undefined) {
    queryParams.push(
      `filters[classifications][business_user_classifications.classification][$eq]=${classifications}`,
    );
  }
  if (packages !== undefined) {
    queryParams.push(`filters[user][subscription][package_id][$eq]=${packages}`);
  }
  if (numberOfEmployees !== undefined) {
    queryParams.push(`filters[number_of_employees][$eq]=${numberOfEmployees}`);
  }
  if (volumeOfWork !== undefined) {
    queryParams.push(`filters[volume_of_work][$eq]=${volumeOfWork}`);
  }
  if (email !== undefined) {
    queryParams.push(`filters[user][users.email][$eq]=${email}`);
  }
  if (businessEmail !== undefined) {
    queryParams.push(`filters[business_email][$eq]=${businessEmail}`);
  }
  if (hotLine !== undefined) {
    queryParams.push(`filters[hotline][$contains]=${hotLine}`);
  }

  if (referralCode !== undefined) {
    queryParams.push(`filters[user][users.referral_code][$contains]=${referralCode}`);
  }
  if (businessphone !== undefined) {
    queryParams.push(`filters[phone][$contains]=${businessphone}`);
  }
  if (username !== undefined) {
    queryParams.push(`filters[user][users.username][$contains]=${username}`);
  }
  if (filteredPackages !== undefined) {
    queryParams.push(`filters[$or][0][package][name_en][$contains]=${filteredPackages}`);
    queryParams.push(`filters[$or][1][package][name_ar][$contains]=${filteredPackages}`);
  }
  if (businessName !== undefined) {
    queryParams.push(`filters[business_name][$contains]=${businessName}`);
  }
  if (userType !== undefined) {
    queryParams.push(`filters[user][users.user_type][$eq]=${userType}`);
  }
  if (userTypes !== undefined && userTypes.length) {
    userTypes.forEach((userType: number, index: number) => {
      queryParams.push(`filters[user][user_type][$in][${index}]=${userType}`);
    });
  }
  if (priceRange !== undefined) {
    queryParams.push(`filters[price_range][$eq]=${priceRange}`);
  }

  if (cityId !== undefined) {
    queryParams.push(`filters[city_id][$eq]=${cityId}`);
  }
  if (countryId !== undefined) {
    queryParams.push(`filters[city][country][countries.id][$eq]=${countryId}`);
  }
  const queryString = queryParams.join('&');
  if (!paginate) {
    return apiClient.get(`${userEndpoints.businessUserDetails}?${queryString}`);
  }
  if (DeletedUsers === 'true') {
    return apiClient.get(
      `${userEndpoints.getUserDashboard}?filters[deleted_at][$notNull]=${DeletedUsers}&${queryString}`,
    );
  }
  return apiClient.get(`${userEndpoints.businessUserDetails}?${queryString}`, {
    headers: {
      paginate: true,
    },
  });
};

export const mutateEditBusinessUser = ({ userData, userId }: { userData: any; userId: number }) => {
  const apiUrl = `${userEndpoints.businessUsers}/${userId}`;

  let headers = {
    'Content-Type': 'application/json',
  };

  if (userData instanceof FormData) {
    headers = {
      'Content-Type': 'multipart/form-data',
    };
    return apiClient.post(apiUrl, userData, { headers });
  }

  return apiClient.patch(apiUrl, userData, { headers });
};

export const userServices = async (userId: string) => {
  const queryParams: string[] = [];
  queryParams.push(`filters[user_id][$eq]=${userId}`);
  const queryString = queryParams.join('&');
  const response = await apiClient.get(`${userEndpoints.userServices}?${queryString}`, {
    headers: { paginationItems: '50' },
  });
  return response.data;
};

export const getBasicUsersAPI = (params: { paginate?: true | undefined; username: any; first_name: any; last_name: any; email: any; phone: any; user_type: any; country_id: any; city_id: any; account_status: any; page?: 1 | undefined; filteredId: any; userTypes?: never[] | undefined; DeletedUsers: any; created_by: any; createdBy: any; }) => {
  const {
    paginate = true,
    username,
    first_name,
    last_name,
    email,
    phone,
    user_type,
    country_id,
    city_id,
    account_status,
    page = 1,
    filteredId,
    userTypes = [],
    DeletedUsers,
    created_by,
    createdBy,
  } = params;

  let queryParams: string[] = [];

  if (paginate) {
    queryParams = [`page=${page}`];
  }

  if (filteredId !== undefined && filteredId.trim()) {
    queryParams.push(`filters[id][$eq]=${filteredId}`);
  }
  if (account_status !== undefined) {
    queryParams.push(`filters[account_status][$eq]=${account_status}`);
  }
  if (user_type !== undefined) {
    queryParams.push(`filters[user_type][$eq]=${user_type}`);
  }
  if (userTypes !== undefined && userTypes.length) {
    userTypes.forEach((userType, index) => {
      queryParams.push(`filters[user_type][$in][${index}]=${userType}`);
    });
  }
  if (phone !== undefined && phone.trim()) {
    queryParams.push(`filters[phone][$contains]=${phone}`);
  }
  if (email !== undefined && email.trim()) {
    queryParams.push(`filters[email][$contains]=${email}`);
  }
  if (last_name !== undefined && last_name.trim()) {
    queryParams.push(`filters[last_name][$contains]=${last_name}`);
  }
  if (first_name !== undefined && first_name.trim()) {
    queryParams.push(`filters[first_name][$contains]=${first_name}`);
  }
  if (username !== undefined && username.trim()) {
    queryParams.push(`filters[username][$contains]=${username}`);
  }
  if (country_id !== undefined) {
    queryParams.push(`filters[city][country][countries.id][$eq]=${country_id}`);
  }
  if (city_id !== undefined) {
    queryParams.push(`filters[city_id][$eq]=${city_id}`);
  }
  if (DeletedUsers !== undefined) {
    queryParams.push(`filters[deleted_at][$notNull]=${DeletedUsers}`);
  }
  if (created_by) {
    queryParams.push(`filters[creator][username][$contains]=${created_by}`);
  }
  if (createdBy) {
    queryParams.push(`filters[created_by][$eq]=${createdBy}`);
  }
  const queryString = queryParams.join("&");
  if (paginate === undefined) {
    return apiClient.get(`${userEndpoints.getUserDashboard}?${queryString}`);
  }
  return apiClient.get(
    `${userEndpoints.getUserDashboard}?${queryString}`,
    { headers:{
      paginate: true
    } }
  );
};

export const getUserServicesAPI = ({ userId, serviceId, categoryId }: { userId: string; serviceId?: string; categoryId?: string }) => {
  const queryParams = [];
  if (serviceId !== undefined) {
    queryParams.push(`filters[service_id][$eq]=${serviceId}`);
  }
  if (categoryId !== undefined) {
    queryParams.push(`filters[service][category][id][$eq]=${categoryId}`);
  }
  const queryString = queryParams.join("&");

  return apiClient.get(`${userEndpoints.users}/${userId}/services?${queryString}`);
};


interface MutateForceDeleteBasicUserResponse {
  [key: string]: any;
}
export const mutateForceDeleteBasicUser = (userId: number | string): Promise<MutateForceDeleteBasicUserResponse> =>
  apiClient.delete(`${userEndpoints.getUserDashboard}/${userId}?forceDelete=true`);

