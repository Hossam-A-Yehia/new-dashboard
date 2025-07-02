import {
  SERVICE_PROVIDER_CRAFTSMEN,
  SERVICE_PROVIDER_FREELANCE,
  USER_TYPE,
} from '@/constants/Constants';

const excludedUserTypesFields = USER_TYPE.filter(
  (type: { value: any }) =>
    type.value === SERVICE_PROVIDER_FREELANCE || type.value === SERVICE_PROVIDER_CRAFTSMEN,
);

export default excludedUserTypesFields;
