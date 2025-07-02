import Container from "@/components/atoms/Container/Container";
import { Formik } from "formik";
import Loader from "@/components/atoms/Loader/Loader";
import { useUser } from "@/context/UserContext";
import { PackagesValidation } from "./Subscriptionvalidation";
import SubscriptionForm from "@/components/organisms/SubscriptionForm/SubscriptionForm";
import { useTranslation } from "react-i18next";



interface InitialValues {
  package_id: number;
  source: string;
}

const SubscriptionTemplate = () => {
  const { userData: user, isLoading: isUserLoading } = useUser();
  const { t } = useTranslation();


  if (isUserLoading || !user) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader />
    </div>
  );

  const initialValues: InitialValues = {
    package_id: 0,
    source: "website",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              {t('subscription.title')}
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {t('subscription.description')}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <Formik
              initialValues={initialValues}
              validationSchema={PackagesValidation}
              onSubmit={() => {}}
            >
              {(formikProps) => (
                <SubscriptionForm
                  isLoading={formikProps.isSubmitting}
                  formikProps={formikProps as any}
                />
              )}
            </Formik>
          </div>

          <div className="mt-8 text-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-slate-500">
              <p>
                {t('subscription.need_help.title')}{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t('subscription.need_help.contact_sales')}
                </a>
              </p>
              <div className="hidden md:block h-4 w-px bg-slate-300"></div>
              <p>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t('subscription.need_help.view_faq')}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SubscriptionTemplate;

