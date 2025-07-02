export interface GetBusinessUsersAPIParams {
    page?: number;
    paginate?: boolean;
    filteredId?: number;
    accountStatus?: string;
    yearsOfExperience?: number;
    classifications?: string;
    numberOfEmployees?: number;
    volumeOfWork?: number;
    email?: string;
    username?: string;
    businessName?: string;
    businessEmail?: string;
    hotLine?: string;
    referralCode?: string;
    userType?: string;
    userTypes?: number[];
    countryId?: number;
    cityId?: number;
    businessphone?: string;
    priceRange?: string;
    packages?: number;
    filteredPackages?: string;
    DeletedUsers?: string;
    userId?: number;
  }
  