interface Item {
  value?: string | number;
  label: string;
  id?: string | number;
}

export const findLabelByValue = (
  value: string | number,
  items: Item[]
): string | null => {
  return items.find((item) => item.value === value)?.label || null;
};
export const findLabelById = (
  value: string | number,
  items: Item[]
): string | null => {
  return items.find((item) => item.id === value)?.label || null;
};

type FormattedDateTime = {
  formattedDate: string;
  formattedTime: string;
};

export const formatDate = (dateString: string): FormattedDateTime => {
  const lang = localStorage.getItem("appLanguage") || "en";
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string provided");
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat(
    `${lang}-US`,
    dateOptions
  ).format(date);
  const formattedTime = new Intl.DateTimeFormat(
    `${lang}-US`,
    timeOptions
  ).format(date);
  return { formattedDate, formattedTime };
};

export const containsAnyElement = <T>(
  firstArray: T[],
  secondArray: T[]
): boolean => {
  return secondArray.some((element) => firstArray.includes(element));
};
