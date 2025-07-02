import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";
import { CustomBreadcrumbs } from "@/components/organisms/Breadcrumbs/CustomBreadcrumbs";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/generalUtils";
import { useFetchRecievedAsks } from "@/hooks/recievedAsks";


type RecievedAsksFile = {
  url: string;
};

const RecievedAsksDetails = () => {
  const queryParams = useQuery();
  const { id: discussionable_id } = useParams();
  const { t } = useTranslation();
  queryParams.id = discussionable_id ?? "";
  const { data, isLoading } = useFetchRecievedAsks({ ...queryParams, isEnabled: true });

  const allRecievedAsks = useMemo(() =>
    data?.data?.payload?.data ?? [],
    [data]);

  const selectedRecievedAsks = allRecievedAsks[0]
  if (!selectedRecievedAsks && !isLoading) {
    return (
      <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
        <CustomBreadcrumbs items={[
          { label: t("received_asks.recievedAsksList") },
          { label: t("received_asks.details") }
        ]} />
        <p className="text-red-500 mt-8">{t("received_asks.not_found")}</p>
      </div>
    );
  }


  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <CustomBreadcrumbs items={[
        { label: t("received_asks.recievedAsksList") },
        { label: t("received_asks.details") }
      ]} />

      <div className="bg-white shadow rounded-2xl p-6 md:p-10 mt-6 space-y-8">
        {/* Title and Content */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t("received_asks.title")}
          </h2>
          <p className="text-gray-700 text-base">{selectedRecievedAsks?.invitable?.title}</p>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {t("received_asks.content")}
          </h2>
          <p className="text-gray-700 text-base">{selectedRecievedAsks?.invitable?.content}</p>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {t("received_asks.description")}
          </h3>
          <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
            {selectedRecievedAsks?.invitable?.description || selectedRecievedAsks?.invitable?.content}
          </p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {selectedRecievedAsks?.invitable?.service?.service_type === 1
                ? t("received_asks.service")
                : t("received_asks.productGroup")
                || "received_asks.notAvailable"}
            </h4>
            <p className="text-gray-600 mt-1">{selectedRecievedAsks?.invitable?.service?.name_en}</p>
          </div>
        </div>

        {/* Files */}
        <div className="mt-10">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            {t("received_asks.files")}
            </h4>

          {selectedRecievedAsks?.invitable?.files?.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedRecievedAsks.invitable?.files.map((file: RecievedAsksFile & { created_at: string }, index: number) => {
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
                          {t("received_asks.document")} {index + 1}
                        </a>
                        <p className="text-sm text-gray-500">
                          {t("received_asks.uploaded")}: {formattedDate}, {formattedTime}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500">{t("received_asks.noFileAvailable")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecievedAsksDetails;
