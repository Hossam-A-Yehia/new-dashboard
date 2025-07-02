import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";
import { useFetchAsks } from "@/hooks/ask";
import { useUser } from "@/context/UserContext";
import { CustomBreadcrumbs } from "@/components/organisms/Breadcrumbs/CustomBreadcrumbs";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/generalUtils";

type ASKFile = {
  url: string;
};

const ASKsDetails = () => {
  const { userData } = useUser();
  const queryParams = useQuery();
  const { id } = useParams();
  const { t } = useTranslation();
  const modifiedQueryParams = useMemo(() => {
    const query = { ...queryParams };
    if (id) query.id = id;
    return query;

  }, [queryParams, id, userData?.business_user_detail?.id, userData?.user_type]);
  const { data, isLoading } = useFetchAsks({ ...modifiedQueryParams, isEnabled: true });

  const allASKs = useMemo(() =>
    data?.data?.payload?.data ?? [],
    [data]);
  const selectedASK = allASKs[0]
  if (!selectedASK && !isLoading) {
    return (
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <CustomBreadcrumbs items={[
          { label: t("ask_details.title.label1Asks") },
          { label: t("ask_details.title.label2AsksDetails") }
        ]}
        />
        <p className="text-red-500 mt-8">{t("ASK not found.")}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <CustomBreadcrumbs items={[
        { label: t("ask_details.title.label1Asks") },
        { label: t("ask_details.title.label2AsksDetails") }
      ]} />

      <div className="bg-white shadow rounded-2xl p-6 md:p-10 mt-6 space-y-8">
        {/* Subject */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t("ask_details.subject")}</h2>
          <p className="text-gray-700 text-base">{selectedASK?.subject}</p>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{t("ask_details.description")}</h3>
          <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
            {selectedASK?.description || selectedASK?.content}
          </p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-gray-700">{t("ask_details.category")}</h4>
            <p className="text-gray-600 mt-1">{selectedASK?.service?.category?.name_en}</p>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-700">
              {selectedASK?.service?.service_type === 1
                ? t("ask_details.service")
                : t("ask_details.productGroup")
                || "ask_details.notAvailable"}
            </h4>
            <p className="text-gray-600 mt-1">{selectedASK?.service?.name_en}</p>
          </div>
        </div>

        {/* Files */}
        <div className="mt-10">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">{t("ask_details.files")}</h4>

          {selectedASK?.files?.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedASK.files.map((file: ASKFile & { created_at: string }, index: number) => {
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
                          {t("ask_details.document")} {index + 1}
                        </a>
                        <p className="text-sm text-gray-500">
                          {t("ask_details.uploaded")}: {formattedDate}, {formattedTime}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500">{t("ask_details.no_files_available")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ASKsDetails;
