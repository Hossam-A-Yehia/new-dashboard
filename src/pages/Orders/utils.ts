interface StatusItem {
  value: number;
  label: string;
}

interface StatusLabelAndClass {
  label: string;
  statusClass: string;
}

const getStatusLabelAndClass = (
  statuses: StatusItem[],
  value: number,
  classMap: Record<number, string>
): StatusLabelAndClass => {
  const status = statuses.find((item) => item.value === value);
  const label = status?.label || "Unknown";
  const statusClass = classMap[value] || "text-dark";
  return { label, statusClass };
};

// Bootstrap-based status color mappings
const orderStatusClasses = {
  1: "text-warning",  // PENDING (orange)
  2: "text-primary",  // PARTIALLY_ACCEPTED (blue)
  3: "text-danger",   // REJECTED (red)
  4: "text-success",  // COMPLETED (green)
};

const deliveryStatusClasses = {
  1: "text-warning",  // PENDING 
  2: "text-primary",  // DELIVERD
  3: "text-success",  // PARTIALY_DELIVERD 
  4: "text-danger",   // REJECTED 
};

export { orderStatusClasses, deliveryStatusClasses, getStatusLabelAndClass };
