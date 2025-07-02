import Button from '@/components/atoms/Button/Button';
import { CircularProgress, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { Form, Formik } from 'formik';
import { editInitialValues, initialValues } from './utils';
import { useUser } from '@/context/UserContext';
import { useTranslation } from 'react-i18next';
import {
  ADMIN_TYPE,
  SERVICE_PROVIDER_CONTRACTOR,
  SERVICE_PROVIDER_FIRM,
  SERVICE_PROVIDER_FREELANCE,
} from '@/constants/Constants';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useMutateAddProject, useMutateEditProject } from '@/hooks/Project';
import { useDebounce } from 'react-use';
import { useState } from 'react';
import { useFetchBusinessUsers } from '@/hooks/useUser';
import { Edit, Plus } from 'lucide-react';
import ProjectForm from './ProjectForm';

interface AddProjectModalProps {
  setModal: (value: boolean) => void;
  toggle: boolean;
  isEdit: boolean;
  selectedRow?: any;
}

function AddProjectModal({ setModal, toggle, isEdit, selectedRow }: AddProjectModalProps) {
  const queryClient = useQueryClient();
  const { userData } = useUser();
  const { t } = useTranslation();

  const { mutateAsync, isPending: isMutateLoading } = (
    isEdit ? useMutateEditProject : useMutateAddProject
  )();

  const [filteredName, setFilteredName] = useState('');
  const [inputSelectValue, setInputSelectValue] = useState('');

  const isNotAdmin = !ADMIN_TYPE.includes(userData?.user_type);
  const notAdminUser = isNotAdmin
    ? {
        id: userData?.id,
        user: {
          username: userData?.username,
          id: userData?.id,
        },
      }
    : null;

  useDebounce(() => setFilteredName(inputSelectValue), 500, [inputSelectValue]);

  const { data, isLoading: isUsersLoading } = useFetchBusinessUsers({
    username: filteredName,
    userTypes: [SERVICE_PROVIDER_FREELANCE, SERVICE_PROVIDER_FIRM, SERVICE_PROVIDER_CONTRACTOR],
  });

  const businessUsers = data?.data.payload.data || [];

  const handleSubmit = async (values: any, { resetForm, setErrors }: any) => {
    if (isEdit) {
      const structuredData = {
        title_ar: values.title_ar,
        description_ar: values.description_ar,
        title_en: values.title_en,
        description_en: values.description_en,
        city_id: values.city_id,
        creation_date: values.creation_date,
      };

      const initial = editInitialValues(selectedRow);
      const changedFields: Record<string, any> = {};
      (Object.keys(structuredData) as Array<keyof typeof structuredData>).forEach((key) => {
        if (structuredData[key] !== initial[key]) {
          changedFields[key] = structuredData[key];
        }
      });

      try {
        await mutateAsync({ data: changedFields, id: selectedRow.id });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        toast.info(t('common.project.success.updated'));
        setModal(false);
        resetForm();
      } catch (err: any) {
        if (err?.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else {
          toast.error(t(err.response.data.message));
        }
      }
    } else {
      values.category_id = [values.category_id.value];
      const structuredData = {
        businessUser_id: isNotAdmin
          ? userData.business_user_detail.id
          : values.businessUser_id.value2,
        title_ar: values.title_ar,
        description_ar: values.description_ar,
        title_en: values.title_en,
        description_en: values.description_en,
        city_id: values.city_id,
        creation_date: values.creation_date,
        category_ids: values.category_id,
        image: values.images[0].image,
      };

      const formData = new FormData();
      Object.entries(structuredData).forEach(([key, value]) => {
        if (key === 'category_ids') {
          value.forEach((id: any, index: number) => {
            formData.append(`category_ids[${index}]`, id);
          });
        } else {
          formData.append(key, value);
        }
      });

      try {
        await mutateAsync(formData);
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        toast.info(t('common.project.success.created'));
        setModal(false);
        resetForm();
      } catch (err: any) {
        if (err?.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else {
          toast.error(t(err.response.data.message));
        }
      }
    }
  };

  return (
    <Dialog open={toggle} onClose={() => setModal(false)} fullWidth maxWidth="md">
      <DialogTitle className="text-main">
        {isEdit ? t('common.project.edit') : t('common.project.add_new')}
      </DialogTitle>
      <Formik
        initialValues={
          isEdit && selectedRow
            ? editInitialValues(selectedRow)
            : initialValues(notAdminUser || userData)
        }
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <ProjectForm
              setInputSelectValue={setInputSelectValue}
              businessUsers={businessUsers}
              isUsersLoading={isUsersLoading}
              isMutatePutLoading={isMutateLoading}
              setModal={setModal}
              isEdit={isEdit}
            />
            <DialogActions>
              <div>
                <Button onClick={() => setModal(false)} variant="secondary">
                  {t('common.project.cancel')}
                </Button>
              </div>
              <div>
                <Button type="submit" variant="main" disabled={isMutateLoading}>
                  {isMutateLoading ? (
                    <CircularProgress size={20} className="mr-2" />
                  ) : isEdit ? (
                    <Edit size={15} className="mr-2" />
                  ) : (
                    <Plus size={15} className="mr-2" />
                  )}
                  {isEdit ? t('common.project.update') : t('common.project.save')}
                </Button>
              </div>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

export default AddProjectModal;
