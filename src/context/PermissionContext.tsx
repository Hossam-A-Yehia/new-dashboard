import React, { createContext, useContext } from "react";
import { PERMISSIONS } from "../constants/Constants";

const PermissionContext = createContext<Record<string, boolean>>({});

interface UserData {
  roles?: { permissions?: { name: string }[] }[];
}

export const PermissionProvider = ({ userData, children }: { userData: UserData; children: React.ReactNode }) => {
  const permissions = userData?.roles?.[0]?.permissions || [];
  const hasPermission = (permissionName: string) => {
    return permissions.some((perm) => perm.name === permissionName);
  };
  const permissionValue = {
    // project permissions
    canCreateProject: hasPermission(PERMISSIONS.CREATE_PROJECT),
    canEditProject: hasPermission(PERMISSIONS.EDIT_PROJECT),
    canDeleteProject: hasPermission(PERMISSIONS.DELETE_PROJECT),
    // idea permissions
    canCreateIdea: hasPermission(PERMISSIONS.CREATE_IDEA),
    canEditIdea: hasPermission(PERMISSIONS.EDIT_IDEA),
    canDeleteIdea: hasPermission(PERMISSIONS.DELETE_IDEA),
    // product permissions
    canCreateProduct: hasPermission(PERMISSIONS.CREATE_PRODUCT),
    canEditProduct: hasPermission(PERMISSIONS.EDIT_PRODUCT),
    canDeleteProduct: hasPermission(PERMISSIONS.DELETE_PRODUCT),
    canBulkUploadProducts: hasPermission(PERMISSIONS.BULK_UPLOAD_PRODUCTS),
    // users permissions
    canCreateUser: hasPermission(PERMISSIONS.CREATE_USER),
    canEditUser: hasPermission(PERMISSIONS.EDIT_USER),
    canDeleteUser: hasPermission(PERMISSIONS.DELETE_USER),
    canRequestTechnicalUsers: hasPermission(PERMISSIONS.REQUEST_TECHNICAL_USERS),
    canApproveTechnicalUsers: hasPermission(PERMISSIONS.APPROVE_TECHNICAL_USERS),
    // orders permissions
    canProcessOrders: hasPermission(PERMISSIONS.PROCESS_ORDERS),
    // Settings permissions
    canManageSettings: hasPermission(PERMISSIONS.MANAGE_SETTINGS),
    // Setting Roles Permissions
    canCreateRole: hasPermission(PERMISSIONS.CREATE_ROLE),
    canEditRole: hasPermission(PERMISSIONS.EDIT_ROLE),
    canAssignRoleToUser: hasPermission(PERMISSIONS.ASSIGN_ROLE_TO_USER),
    // Branch permissions
    canCreateBranch: hasPermission(PERMISSIONS.CREATE_BRANCH),
    canEditBranch: hasPermission(PERMISSIONS.EDIT_BRANCH),
    canDeleteBranch: hasPermission(PERMISSIONS.DELETE_BRANCH),
    // Address permissions
    canCreateAddress: hasPermission(PERMISSIONS.CREATE_ADDRESS),
    canEditAddress: hasPermission(PERMISSIONS.EDIT_ADDRESS),
    canDeleteAddress: hasPermission(PERMISSIONS.DELETE_ADDRESS),
    // Image permissions
    canUploadImage: hasPermission(PERMISSIONS.UPLOAD_IMAGE),
    canDeleteImage: hasPermission(PERMISSIONS.DELETE_IMAGE),
    // Category permissions
    canCreateCategory: hasPermission(PERMISSIONS.CREATE_CATEGORY),
    canEditCategory: hasPermission(PERMISSIONS.EDIT_CATEGORY),
    canDeleteCategory: hasPermission(PERMISSIONS.DELETE_CATEGORY),
    canSelectCategory: hasPermission(PERMISSIONS.SELECT_CATEGORY),
    canUnselectCategory: hasPermission(PERMISSIONS.UNSELECT_CATEGORY),
    // Service permissions
    canCreateService: hasPermission(PERMISSIONS.CREATE_SERVICE),
    canEditService: hasPermission(PERMISSIONS.EDIT_SERVICE),
    canDeleteService: hasPermission(PERMISSIONS.DELETE_SERVICE),
    canSelectService: hasPermission(PERMISSIONS.SELECT_SERVICE),
    canUnselectService: hasPermission(PERMISSIONS.UNSELECT_SERVICE),
    canSuggestService: hasPermission(PERMISSIONS.SUGGEST_SERVICE),
    canApproveServiceSuggestion: hasPermission(PERMISSIONS.APPROVE_SERVICE_SUGGESION),
    // canRejectServiceSuggestion: hasPermission(PERMISSIONS.APPROVE_SERVICE_SUGGESION),
    // Attributes permissions
    canCreateAttribute: hasPermission(PERMISSIONS.CREATE_ATTRIBUTE),
    canEditAttribute: hasPermission(PERMISSIONS.EDIT_ATTRIBUTE),
    canDeleteAttribute: hasPermission(PERMISSIONS.DELETE_ATTRIBUTE),
    // Ad permissions
    canCreateAd: hasPermission(PERMISSIONS.CREATE_AD),
    canEditAd: hasPermission(PERMISSIONS.EDIT_AD),
    canDeleteAd: hasPermission(PERMISSIONS.DELETE_AD),
    // Blogs permissions
    canCreateBlog: hasPermission(PERMISSIONS.CREATE_BLOG),
    canEditBlog: hasPermission(PERMISSIONS.EDIT_BLOG),
    canDeleteBlog: hasPermission(PERMISSIONS.DELETE_BLOG),
    // Ask permissions
    canCreateAsk: hasPermission(PERMISSIONS.CREATE_ASK),
    canEditAsk: hasPermission(PERMISSIONS.EDIT_ASK),
    canReplyAsk: hasPermission(PERMISSIONS.REPLY_ASK),
    canDiscussAsk: hasPermission(PERMISSIONS.DISCUSS_ASK),
    // RFQ permissions
    canCreateRFQ: hasPermission(PERMISSIONS.CREATE_RFQ),
    canDiscussRFQ: hasPermission(PERMISSIONS.DISCUSS_REQ),
    // Invitation permissions
    canReplyInvitation: hasPermission(PERMISSIONS.REPLY_INVITATION),
    canProcessInvitation: hasPermission(PERMISSIONS.PROCESS_INVITATION),
    // Multiactions permissions
    canAccessMultiActions: hasPermission(PERMISSIONS.ACCESS_MULTIACTIONS),
  };

  return (
    <PermissionContext.Provider value={permissionValue}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionContext);