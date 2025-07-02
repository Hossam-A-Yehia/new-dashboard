export function useOptions<Option>({
  options,
  labelKey,
  valueKey,
}: {
  options: Option[];
  labelKey: keyof Option;
  valueKey: keyof Option;
}) {
  if (!options.length || !options) return [];

  const labelValueType = typeof options[0][labelKey];
  const valueValueType = typeof options[0][valueKey];
  if (!["string", "number"].includes(labelValueType)) {
    throw new Error("labelKey must be a string or number");
  }
  if (!["string", "number"].includes(valueValueType)) {
    throw new Error("valueKey must be a string or number");
  }

  return options.map((option) => {
    return {
      label: option[labelKey] as string,
      value: option[valueKey] as string | number,
    };
  });
}
