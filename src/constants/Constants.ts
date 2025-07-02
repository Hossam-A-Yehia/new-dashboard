import { t } from 'i18next';
export const CLIENT = 1;
export const SERVICE_PROVIDER_FREELANCE = 2;
export const SERVICE_PROVIDER_FIRM = 3;
export const SERVICE_PROVIDER_CONTRACTOR = 4;
export const SERVICE_PROVIDER_CRAFTSMEN = 5;
export const SUPPLIER = 6;
export const ADMIN = 7;
export const MARKETING = 8;
export const SERVICE = 1;
export const PRODUCT_GROUP = 2;

export const SERVICE_PROVIDER_SERVICE_TYPE = 1;
export const SUPPLIER_SERVICE_TYPE = 2;
export const USER_TYPE = [
  { label: t('user_type.client'), value: CLIENT },
  { label: t('user_type.design_freelance'), value: SERVICE_PROVIDER_FREELANCE },
  { label: t('user_type.design_firm'), value: SERVICE_PROVIDER_FIRM },
  { label: t('user_type.contractor'), value: SERVICE_PROVIDER_CONTRACTOR },
  { label: t('user_type.craftsmen'), value: SERVICE_PROVIDER_CRAFTSMEN },
  { label: t('user_type.supplier'), value: SUPPLIER },
];

export const ADMIN_TYPE = [ADMIN];
export const SUPPLIER_TYPE = [SUPPLIER];
export const SERVICEPROVIDER_TYPE = [
  SERVICE_PROVIDER_FIRM,
  SERVICE_PROVIDER_FREELANCE,
  SERVICE_PROVIDER_CRAFTSMEN,
  SERVICE_PROVIDER_CONTRACTOR,
];
export const SERVICEPROVIDER_TYPE_PROJECTS = [
  SERVICE_PROVIDER_FIRM,
  SERVICE_PROVIDER_FREELANCE,
  SERVICE_PROVIDER_CONTRACTOR,
];

export const PROFESSIONALS = [
  SERVICE_PROVIDER_CRAFTSMEN,
  SERVICE_PROVIDER_CONTRACTOR,
  SERVICE_PROVIDER_FIRM,
  SERVICE_PROVIDER_FREELANCE,
];
export const YEARS_OF_EXPERIENCE = [
  { label: t('years_of_experience.less_than_5_years'), id: 1 },
  { label: t('years_of_experience.between_5_to_10_years'), id: 2 },
  { label: t('years_of_experience.between_10_to_20_years'), id: 3 },
  { label: t('years_of_experience.more_than_20_years'), id: 4 },
];
export const VOLUME_OF_WORK = [
  { label: t('volume_of_work.less_than_5'), id: 1 },
  { label: t('volume_of_work.between_5_to_10'), id: 2 },
  { label: t('volume_of_work.between_10_to_20'), id: 3 },
  { label: t('volume_of_work.between_20_to_50'), id: 4 },
  { label: t('volume_of_work.more_than_20'), id: 5 },
];
export const NUMBER_OF_EMPLOYEES = [
  { label: t('number_of_employees.less_than_20'), id: 1 },
  { label: t('number_of_employees.between_50_to_100'), id: 2 },
  { label: t('number_of_employees.between_100_to_500'), id: 3 },
  { label: t('number_of_employees.more_than_500'), id: 4 },
];
export const SUPPLIER_CLASSIFICATIONS = [
  { label: t('MANUFACTURE'), id: 8 },
  { label: t('AGENT'), id: 9 },
  { label: t('HYPERSHOP'), id: 10 },
  { label: t('DISTRIBUTER'), id: 11 },
];
export const CONTRACTOR_CLASSIFICATIONS = [
  { label: t('classifications.first'), id: 1 },
  { label: t('classifications.second'), id: 2 },
  { label: t('classifications.third'), id: 3 },
  { label: t('classifications.fourth'), id: 4 },
  { label: t('classifications.fifth'), id: 5 },
  { label: t('classifications.sixth'), id: 6 },
  { label: t('classifications.seventh'), id: 7 },
];
export const PRICE_RANGE = [
  { label: '$', id: 1 },
  { label: '$$', id: 2 },
  { label: '$$$', id: 3 },
  { label: '$$$$', id: 4 },
];
export const EXCEPTIONS = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  PRECONDITION_REQUIRED: 428,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
};

export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const CRAFTSMEN_ID = 751;
export const SUPPLIER_ID = 752;

export const file_types = [
  { label: t('CV'), value: 1 },
  { label: t('CR'), value: 2 },
  { label: t('TAX_CARD'), value: 3 },
  { label: t('CONTRACT'), value: 4 },
  { label: t('GRADUATION_CERTIFICATE'), value: 5 },
  { label: t('CERTIFICATES'), value: 6 },
  { label: t('OTHER'), value: 7 },
];

export const ORDER_STATUS = [
  { label: t('order.orders.status.all'), value: 0 },
  { label: t('order.orders.status.pending'), value: 1 }, //Pending
  { label: t('order.orders.status.partialy_accepted'), value: 2 }, //Partially accepted
  { label: t('order.orders.status.declined'), value: 3 }, //Declined
  { label: t('order.orders.status.completed'), value: 4 }, //Completed
];

export const DELIVERY_STATUS = [
  { label: t("PENDING"), value: 1 },
  { label: t("DELIVERD"), value: 2 },
  { label: t("PARTIALY_DELIVERD"), value: 3 },
  { label: t("REJECTED"), value: 4 },
];
export const RFP_STATUS = [
  { label: t('All'), value: 0 },
  { label: t('rfqs.status_enum.pending'), value: 1 },
  { label: t('rfqs.status_enum.in_progress'), value: 2 },
  { label: t('rfqs.status_enum.complated'), value: 3 },
  { label: t('rfqs.status_enum.declined'), value: 4 },
];

export const BUSINESS_USER_INVITATIONS_STATUS = [
  { label: t('PENDING'), value: 1 },
  { label: t('IN_PROGRESS'), value: 2 },
  { label: t('COMPLETED'), value: 3 },
  { label: t('DECLINE'), value: 4 },
  { label: t('ACCEPTED_FOR_ANOTHER_USER'), value: 5 },
];
export const SERVICES_TYPE = [
  { label: t('Service'), value: SERVICE },
  { label: t('Product Group'), value: PRODUCT_GROUP },
];

export const PENDING = 1;
export const ACCEPTED = 2;
export const REJECTED = 3;

export const SERVICES_STATUS_ENUM = [
  { label: t('PENDING'), value: PENDING },
  { label: t('APPROVED'), value: ACCEPTED },
  { label: t('REJECTED'), value: REJECTED },
];

export enum RFPStatusEnum {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Declined = 4,
}
export const RFPStatus = [
  { label: t("PENDING"), value: 1 },
  { label: t("IN_PROGRESS"), value: 2 },
  { label: t("COMPLETED"), value: 3 },
  { label: t("DECLINE"), value: 4 },
];
export enum InvitationStatusEnum {
  PENDING = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  DECLINE = 4,
  ACCEPTED_FOR_ANOTHER_USER = 5,
}

// For better using the status in invitations 
export const INVITATION_STATUS_OPTIONS = [
  { label: t("invitations.invitationStatus.Pending"), value: InvitationStatusEnum.PENDING },
  { label: t("invitations.invitationStatus.InProgress"), value: InvitationStatusEnum.IN_PROGRESS },
  { label: t("invitations.invitationStatus.Completed"), value: InvitationStatusEnum.COMPLETED },
  { label: t("invitations.invitationStatus.Declined"), value: InvitationStatusEnum.DECLINE },
  { label: t("invitations.invitationStatus.AcceptedforAnotherUser"), value: InvitationStatusEnum.ACCEPTED_FOR_ANOTHER_USER },
];

export const BALANCE_OPTIONS = [
  { label: '0 - 100', value: '0-100' },
  { label: '100 - 1000', value: '100-1000' },
  { label: '1000 - 5000', value: '1000-5000' },
  { label: '5000 - 10000', value: '5000-10000' },
];

export const FREELANCE_ID = 719;

export const PERMISSIONS = {
  // Idea permissions
  CREATE_IDEA: "create ideas",
  EDIT_IDEA: "edit ideas",
  DELETE_IDEA: "delete ideas",
  // Product permissions
  CREATE_PRODUCT: "create products",
  EDIT_PRODUCT: "edit products",
  DELETE_PRODUCT: "delete products",
  // Bulk Upload Products
  BULK_UPLOAD_PRODUCTS: "bulkUpload products",
  // Project permissions
  CREATE_PROJECT: "create projects",
  EDIT_PROJECT: "edit projects",
  DELETE_PROJECT: "delete projects",
  VIEW_PROJECT: "view projects",
  // User permissions
  CREATE_USER: "create users",
  EDIT_USER: "edit users",
  DELETE_USER: "delete users",
  VIEW_USER: "view users",
  // Technical User permissions
  REQUEST_TECHNICAL_USERS:"request technical users",
  APPROVE_TECHNICAL_USERS:"approve technical users",
  // Orders permissions
  PROCESS_ORDERS: "process orders",
  // Settings permissions
  MANAGE_SETTINGS:"manage settings",
  // Setting Roles Permissions
  CREATE_ROLE:"create role",
  EDIT_ROLE: "edit role",
  ASSIGN_ROLE_TO_USER:"assign role to user",
  // Branch permissions
  CREATE_BRANCH:"create branch",
  EDIT_BRANCH:"edit branch",
  DELETE_BRANCH:"delete branch",
  // Address permissions
  CREATE_ADDRESS:"create address",
  EDIT_ADDRESS:"edit address",
  DELETE_ADDRESS:"delete address",
  // Image permissions
  UPLOAD_IMAGE:"upload image",
  DELETE_IMAGE:"delete image",
  // Category permissions
  CREATE_CATEGORY:"create category",
  EDIT_CATEGORY:"edit category",
  DELETE_CATEGORY:"delete category",  
  SELECT_CATEGORY:"select category",
  UNSELECT_CATEGORY:"unselect category",
  // Service permissions
  CREATE_SERVICE:"create service",
  EDIT_SERVICE:"edit service",
  DELETE_SERVICE:"delete service",
  SELECT_SERVICE:"select service",
  UNSELECT_SERVICE:"unselect service",
  SUGGEST_SERVICE:"suggest service",
  APPROVE_SERVICE_SUGGESION:"approve service suggestion",
  // REJECT_SERVICE_SUGGESION:"reject service suggestion",
  // Attributes permissions
  CREATE_ATTRIBUTE:"create attribute",
  EDIT_ATTRIBUTE:"edit attribute",  
  DELETE_ATTRIBUTE:"delete attribute",
  // Ad permissions
  CREATE_AD:"create ad",
  EDIT_AD:"edit ad",
  DELETE_AD:"delete ad",
  // Blogs permissions
  CREATE_BLOG:"create blog",    
  EDIT_BLOG:"edit blog",
  DELETE_BLOG:"delete blog",
  // Ask permissions
  CREATE_ASK:"create ask",
  EDIT_ASK:"edit ask",
  REPLY_ASK:"reply ask",
  DISCUSS_ASK:"discuss ask",
  // RFQ permissions
  CREATE_RFQ:"create RFQ", 
  DISCUSS_REQ:"discuss RFQ", 
  // Invitation permissions
  REPLY_INVITATION:"reply invitation",
  PROCESS_INVITATION:"process invitation",
  // Multiactions permissions
  ACCESS_MULTIACTIONS:"access multiActions"
};
