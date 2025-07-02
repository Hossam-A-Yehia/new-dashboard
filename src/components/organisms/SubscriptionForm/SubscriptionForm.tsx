import React, { useEffect, useState } from "react";
import { Form, FormikProps } from "formik";
import {
  useFetchCurrentPackages,
  useMutateCancelPackages,
} from "@/hooks/usePackages";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaDollarSign,
  FaAward,
  FaExclamationTriangle,
  FaCrown,
  FaRocket,
  FaLeaf,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/hooks/useLanguage";
interface PackageType {
  id: number;
  name_en: string;
  name_ar: string;
  desc_en: string;
  desc_ar: string;
  price: number;
  duration: number;
  no_ideas: number;
  no_invitation: number;
  no_cvs: number;
  no_media: number;
  no_calls: number;
  no_rfp: number;
}

interface UserUsageType {
  no_ideas: number;
  no_invitation: number;
  no_cvs: number;
  no_media: number;
  no_calls: number;
  no_rfp: number;
}

interface PackageLimitsType {
  no_ideas: number;
  no_invitation: number;
  no_cvs: number;
  no_media: number;
  no_calls: number;
  no_rfp: number;
}

interface SubscriptionFormProps {
  formikProps: FormikProps<{ package_id: number }>;
  isLoading: boolean;
}

const Button = ({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "main" | "delete";
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}) => {
  const baseClasses =
    "inline-flex items-center justify-center px-4 py-2 border font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white border-transparent focus:ring-blue-500",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-700 border-gray-300 focus:ring-blue-500",
    main: "w-full bg-blue-600 hover:bg-blue-700 text-white border-transparent focus:ring-blue-500 py-3 text-base",
    delete:
      "bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 focus:ring-red-500",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mx-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

const Loader = () => (
  <div className="flex justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const SubscriptionForm = ({ formikProps }: SubscriptionFormProps) => {
  const { t } = useTranslation();
  const lang = useLanguage();
  const { setFieldValue } = formikProps;
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(
    null
  );
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { mutate: cancelPackage, isPending: isSubmitting } =
    useMutateCancelPackages();

  const { data: packages, isLoading: isLoadingPackages } =
    useFetchCurrentPackages();
  const userUsage = packages?.user_usage || ({} as UserUsageType);
  const packageLimits = packages?.package_limits || ({} as PackageLimitsType);
  const currentSubscription = packages?.subscription;

  useEffect(() => {
    const otherPackages = packages?.other_packages || [];
    if (otherPackages.length > 0 && !selectedPackage) {
      const defaultPackage =
        otherPackages.find(
          (pkg: PackageType) => pkg.id === currentSubscription?.package_id
        ) || otherPackages[0];
      setSelectedPackage(defaultPackage);
      setFieldValue("package_id", defaultPackage.id);
    }
  }, [packages, setFieldValue, currentSubscription, selectedPackage]);

  const calculatePercentage = (used: number, limit: number): number => {
    if (limit === 0 || limit === -1) return used > 0 ? 100 : 0;
    return Math.min(Math.round((used / limit) * 100), 100);
  };
  const handleSubscription = () => {
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = () => {
    cancelPackage(undefined, {
      onSuccess: () => {
        toast.success(t('subscription.current_subscription.cancel_subscription'));
        setShowCancelDialog(false);
      },
      onError: (error) => {
        toast.error(
          error?.message ||
          t('error_occurred')
        );
      },
    });
  };

  const handleCloseCancelDialog = () => {
    setShowCancelDialog(false);
  };

  const getColorByPercentage = (percentage: number): string => {
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    return "bg-main";
  };

  const renderUsageBar = (
    used: number,
    limit: number,
    label: string,
    icon: React.ReactNode
  ) => {
    const percentage = calculatePercentage(used, limit);
    const barColor = getColorByPercentage(percentage);

    return (
      <div className="mb-3">
        <div className="flex justify-between items-center text-sm mb-1">
          <span className="flex items-center text-gray-700 font-medium">
            {icon}
            <span className="ml-2">{label}</span>
          </span>
          <span className="text-gray-600 font-medium">
            {used} / {limit === -1 ? "∞" : limit}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`${barColor} h-2.5 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const getPackageIcon = (price: number) => {
    if (price === 0) return <FaLeaf className="h-7 w-7 text-green-500" />;
    if (price < 200) return <FaRocket className="h-7 w-7 text-blue-500" />;
    return <FaCrown className="h-7 w-7 text-amber-500" />;
  };

  if (isLoadingPackages) {
    return (
      <div className="flex items-center justify-center min-h-80 py-12">
        <Loader />
      </div>
    );
  }

  return (
    <Form className="space-y-8">
      {/* Cancel Subscription Modal */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseCancelDialog}></div>

            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={handleCloseCancelDialog}
                >
                  <span className="sr-only">Close</span>
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    {t('subscription.current_subscription.cancel_confirmation.title')}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {t('subscription.current_subscription.cancel_confirmation.message')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleConfirmCancel}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('subscription.current_subscription.cancel_subscription') : t('subscription.current_subscription.cancel_confirmation.confirm')}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  onClick={handleCloseCancelDialog}
                >
                  {t('subscription.current_subscription.cancel_confirmation.keep')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Subscription Card */}
      {currentSubscription && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaAward className="mx-2 h-5 w-5 text-blue-600" />
            {t('subscription.current_subscription.title')}
          </h2>

          <div className="rounded-2xl overflow-hidden border border-blue-200 shadow-sm">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white rounded-full p-2 mx-3">
                    <FaCheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      {currentSubscription.package_name}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {currentSubscription.package_title}
                    </p>
                  </div>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${currentSubscription.status === "active"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {currentSubscription.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Subscription Details */}
                <div className="lg:col-span-1">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    {t('subscription.current_subscription.subscription_details')}
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <FaDollarSign className="h-5 w-5 text-gray-400 mx-3" />
                      <div>
                        <div className="text-sm font-medium">{t('subscription.current_subscription.price')}</div>
                        <div className="font-semibold text-lg">
                          {currentSubscription.amount} $
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <FaCalendarAlt className="h-5 w-5 text-gray-400 mx-3" />
                      <div>
                        <div className="text-sm font-medium">
                          {t('subscription.current_subscription.next_billing_date')}
                        </div>
                        <div className="font-semibold">
                          {currentSubscription.next_billing_date}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button
                        variant="delete"
                        onClick={handleSubscription}
                      >
                        <FaExclamationTriangle className="h-4 w-4 mx-2" />
                        {t('subscription.current_subscription.cancel_subscription')}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Usage Meters */}
                <div className="lg:col-span-2">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    {t('subscription.current_subscription.current_usage')}
                  </h4>

                  <div className="space-y-1">
                    {renderUsageBar(
                      userUsage.no_ideas,
                      packageLimits.no_ideas,
                      t('subscription.usage.ideas'),
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                      </svg>
                    )}
                    {renderUsageBar(
                      userUsage.no_invitation,
                      packageLimits.no_invitation,
                      t('subscription.usage.invitations'),
                      <svg
                        className="w-4 h-4 text-purple-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                    )}
                    {renderUsageBar(
                      userUsage.no_cvs,
                      packageLimits.no_cvs,
                      t('subscription.usage.cvs'),
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {renderUsageBar(
                      userUsage.no_media,
                      packageLimits.no_media,
                      t('subscription.usage.media_uploads'),
                      <svg
                        className="w-4 h-4 text-pink-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {renderUsageBar(
                      userUsage.no_calls,
                      packageLimits.no_calls,
                      t('subscription.usage.calls'),
                      <svg
                        className="w-4 h-4 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    )}
                    {renderUsageBar(
                      userUsage.no_rfp,
                      packageLimits.no_rfp,
                      t('subscription.usage.rfps'),
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedPackage && (
        <div
          id="confirm-section"
          className="mb-10 p-8 bg-white rounded-xl border border-gray-200 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {t('subscription.subscription_summary.title')}
          </h2>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-blue-100 rounded-lg p-3 mx-4">
                  {getPackageIcon(selectedPackage.price)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {lang === "en"
                      ? selectedPackage.name_en
                      : selectedPackage.name_ar}
                  </h3>
                  <div className="text-gray-600 text-sm">
                    {lang === "en"
                      ? selectedPackage.desc_en
                      : selectedPackage.desc_ar}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {selectedPackage.price} $
                </div>
                <div className="text-sm text-gray-500">
                  per {selectedPackage.duration} month
                  {selectedPackage.duration !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <FaExclamationTriangle className="h-5 w-5 text-amber-500 mt-0.5 mx-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-amber-800 font-medium">
                  {t('subscription.subscription_summary.important_info')}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {t('subscription.subscription_summary.info_message')}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-gray-500">
            {t('subscription.subscription_summary.terms')}
          </p>
        </div>
      )}
    </Form>
  );
};

export default SubscriptionForm;
