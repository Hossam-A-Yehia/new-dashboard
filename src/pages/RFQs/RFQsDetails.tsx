import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";
import { useFetchRfqs } from "@/hooks/rfqs";
import { useUser } from "@/context/UserContext";
import { CustomBreadcrumbs } from "@/components/organisms/Breadcrumbs/CustomBreadcrumbs";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/generalUtils";

type RFQFile = {
  url: string;
};

const RFQsDetails = () => {
  const { userData } = useUser();
  const queryParams = useQuery();
  const { id } = useParams();
  const { t } = useTranslation();
  const modifiedQueryParams = useMemo(() => {
    const query = { ...queryParams };
    if (id) query.id = id;
    return query;

  }, [queryParams, id, userData?.business_user_detail?.id, userData?.user_type]);
  const { data, isLoading } = useFetchRfqs({ ...modifiedQueryParams, isEnabled: true });

  const allRFQs = data?.data?.payload?.data || [];
  const selectedRFQ = allRFQs[0]

  if (!selectedRFQ && !isLoading) {
    return (
      <div className="  min-h-screen">
        <CustomBreadcrumbs items={[{ label: t("rfqs.details") }]} />
        <p className="text-red-500 mt-8">{t("rfqs.not_found")}</p>
      </div>
    );
  }

  return (
    <div className="  min-h-screen">
      <CustomBreadcrumbs items={[{ label: t("rfqs.details") }]} />

      <div className="bg-white shadow rounded-2xl p-6 md:p-10 mt-6 space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t("rfqs.subject")}</h2>
          <p className="text-gray-700 text-base">{selectedRFQ?.subject}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("rfqs.description")}</h3>
          <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
            {selectedRFQ?.description || selectedRFQ?.content}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-gray-700">{t("rfqs.category")}</h4>
            <p className="text-gray-600 mt-1">{selectedRFQ?.service?.category?.name_en}</p>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-700">
              {selectedRFQ?.service?.service_type === 1
                ? t("rfqs.service")
                : t("rfqs.product_group")
                || t("rfqs.not_available")}
            </h4>
            <p className="text-gray-600 mt-1">{selectedRFQ?.service?.name_en}</p>
          </div>

        </div>

        <div className="mt-10">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">{t("rfqs.files")}</h4>

          {selectedRFQ?.files?.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedRFQ.files.map((file: RFQFile & { created_at: string }, index: number) => {
                const { formattedDate, formattedTime } = formatDate(file.created_at);
                return (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-white p-4 rounded-2xl shadow hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-blue-600 text-xl">📄</div>
                      <div>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-base font-medium text-blue-700 hover:underline"
                        >
                          {t("rfqs.document")} {index + 1}
                        </a>
                        <p className="text-sm text-gray-500">
                          {t("rfqs.uploaded")}: {formattedDate}, {formattedTime}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500">{t("rfqs.no_files")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFQsDetails;
