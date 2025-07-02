import Button from "@/components/atoms/Button/Button";
import Loader from "@/components/atoms/Loader/Loader";
import { CheckboxGroup } from "@/components/molecules/CheckboxGroup/CheckboxGroup";
import Pagination from "@/components/molecules/Pagination/Pagination";
import UserCard from "@/components/molecules/RFQs/UserCard/UserCard";
import {
  PRICE_RANGE,
  VOLUME_OF_WORK,
  YEARS_OF_EXPERIENCE,
} from "@/constants/Constants";
import { useFetchAskBusinessUsers } from "@/hooks/useAsks";
import { useLanguage } from "@/hooks/useLanguage";
import { useFetchRfpBusinessUsers } from "@/hooks/rfqs";
import { UsersListProps } from "@/types/RFQs";
import { BusinessInfoType } from "@/types/User";
import { Form } from "formik";
import { t } from "i18next";
import  { useCallback, useEffect, useMemo, useState } from "react";
import { MdOutlinePerson } from "react-icons/md";
import NoData from "@/components/molecules/NoDate/NoDate";

const useFetchBusinessUsers = (isAsk: boolean | undefined, options: any) => {
  const askData = useFetchAskBusinessUsers(isAsk ? options : null);
  const rfpData = useFetchRfpBusinessUsers(!isAsk ? options : null);

  return isAsk ? askData : rfpData;
};
export default function UsersList({
  setStep,
  setIds,
  city,
  service,
  isMutatePutLoading,
  isAsk,
}: UsersListProps) {
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [selectedCount, setSelectedCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYearsOfExperience, setSelectedYearsOfExperience] = useState<
    number[]
  >([]);
  const [selectedVolumeOfWork, setSelectedVolumOfWork] = useState<number[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number[]>([]);
  const lang = useLanguage();
  const { data, isLoading } = useFetchBusinessUsers(isAsk, {
    serviceId: service,
    priceRanges: selectedPriceRange,
    volumOfWork: selectedVolumeOfWork,
    yearsOfExperience: selectedYearsOfExperience,
    classifications: [],
    page: currentPage,
    city,
    cityId: undefined,
  });

  const businessUsers: BusinessInfoType[] = useMemo(
    () => data?.data?.payload?.data || [],
    [data]
  );
  const lastPage = data?.data?.payload?.last_page;

  const handleCheck = useCallback(
    (id: number) => {
      const newCheckedItems = { ...checkedItems, [id]: !checkedItems[id] };
      setCheckedItems(newCheckedItems);

      const selectedCount =
        Object.values(newCheckedItems).filter(Boolean).length;
      setSelectedCount(selectedCount);

      const allChecked =
        businessUsers.length > 0 &&
        businessUsers.every((item) => newCheckedItems[item.id]);
      setCheckedAll(allChecked);
    },
    [checkedItems, businessUsers]
  );

  const updateIds = useCallback(() => {
    const selectedIds = Object.keys(checkedItems)
      .filter((key) => checkedItems[+key])
      .map((key) => parseInt(key, 10))
      .map((id) => businessUsers.find((user) => user.id === id)?.user_id)
      .filter((id) => id !== undefined)
      .map(String);

    setIds({ ids: selectedIds });
  }, [checkedItems, businessUsers, setIds]);

  useEffect(() => {
    updateIds();
  }, [checkedItems, updateIds]);

  useEffect(() => setCurrentPage(1), []);
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= lastPage) setCurrentPage(page);
  };

  const handleSelectAll = useCallback(() => {
    const allChecked = !checkedAll;
    const newCheckedItems = businessUsers.reduce(
      (acc, user) => ({ ...acc, [user.id]: allChecked }),
      {}
    );
    setCheckedItems(newCheckedItems);
    setCheckedAll(allChecked);
    setSelectedCount(allChecked ? businessUsers.length : 0);
  }, [checkedAll, businessUsers]);

  const handleCheckboxChange = (id: number) => () => {
    if (!checkedItems[id] && selectedCount >= 10) {
      alert("You can only select up to 10 users.");
      return;
    }
    handleCheck(id);
  };

  return (
    <Form>
      <div className="flex items-center justify-between mb-5 ">
        <div className="w-fit">
          <Button
            dataTestid="select_all"
            variant="outlineMain"
            type="button"
            onClick={handleSelectAll}
          >
            {checkedAll ? t("rfq.deselect_all") : t("rfq.select_all")}
          </Button>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-md shadow-sm">
          <MdOutlinePerson className="text-blue-500 text-lg" />
          <div className="text-sm font-medium text-gray-700 whitespace-nowrap flex gap-1">
            {t("rfq.selected")}
            <div className="text-blue-600 font-semibold">
              {selectedCount}
            </div>{" "}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-5">
        <aside className="col-span-1 flex flex-col gap-3">
          <CheckboxGroup
            title={t("rfq.years_of_experience")}
            options={YEARS_OF_EXPERIENCE}
            opened
            selectedOptions={selectedYearsOfExperience}
            onChange={setSelectedYearsOfExperience}
          />
          <CheckboxGroup
            title={t("rfq.volum_of_work")}
            options={VOLUME_OF_WORK}
            selectedOptions={selectedVolumeOfWork}
            onChange={setSelectedVolumOfWork}
          />
          <CheckboxGroup
            title={t("rfq.price_range")}
            options={PRICE_RANGE}
            selectedOptions={selectedPriceRange}
            onChange={setSelectedPriceRange}
          />
        </aside>
        <div className="h-fit col-span-2 md:col-span-3 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {businessUsers?.map((user) => (
            <div key={user.id}>
              <UserCard
                id={user.id}
                coverImage={user.profile}
                logoImg={user.logo}
                name={user.business_name}
                city={user.city[`name_${lang}`] || user.city.name_en || ""}
                country={
                  user.city.country[`name_${lang}`] ||
                  user.city.country.name_en ||
                  ""
                }
                isChecked={checkedItems[user.id] || false}
                onCheckboxChange={handleCheckboxChange(user.id)}
                isDisabled={selectedCount >= 10 && !checkedItems[user.id]}
              />
            </div>
          ))}
          {businessUsers.length === 0 && !isLoading && (
            <div
              className="col-span-3 w-1/2 mx-auto mt-5"
              data-testid="no-data"
            >
              <NoData />
            </div>
          )}
          {isLoading && (
            <div className="mt-10 col-span-3" data-testid="loader-wrapper">
              <Loader />
            </div>
          )}
        </div>
      </div>
      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onPageChange={handlePageChange}
        />
      )}
      <div className="flex items-center gap-3 justify-between mt-6 ml-[20px] ltr:md:ml-[300px] rtl:md:mr-[300px]">
        <div className="w-fit">
          <Button variant="main" type="button" onClick={() => setStep(1)}>
            {t("rfq.previous")}
          </Button>
        </div>
        <div className="w-fit">
          <Button
            type="submit"
            disabled={selectedCount === 0 || isMutatePutLoading}
          >
            <i className="mdi mdi-plus-circle-outline me-1" />
            {t("rfq.submit")}
          </Button>
        </div>
      </div>
    </Form>
  );
}
