import apiClient from "@/config/apiClient";
import walletEndpoints from "@/config/endpoints/walletEndpoints";

interface GetWalletsParams {
  id?: number | string;
  userId?: number | string;
  page?: number;
  currentBalanceRange?: [number, number];
  totalEarnedRange?: [number, number];
  username?: string;
}

export const getWalletsAPI = (params: GetWalletsParams) => {
  const {
    page = 1,
    userId,
    currentBalanceRange,
    totalEarnedRange,
    username
  } = params;

  interface Range {
    start: number;
    end: number;
  }

  type RangeInput = string | [number, number] | undefined | null;

  const parseRange = (range: RangeInput): Range | null => {
    if (!range) return null;
    if (Array.isArray(range)) {
      const [start, end] = range;
      return { start, end };
    }
    const [start, end] = range.split("-").map(Number);
    return { start, end };
  };

  const currentBalance = parseRange(currentBalanceRange);
  const totalEarned = parseRange(totalEarnedRange);


  const queryParams = [`page=${page}`];

 
  if (userId !== undefined) {
    queryParams.push(`filters[user_id][$eq]=${userId}`);
  }
  if (currentBalance !== undefined && currentBalance !== null) {
    queryParams.push(
      `filters[current_balance][$between][0]=${currentBalance.start}&filters[current_balance][$between][1]=${currentBalance.end}`
    );
  }

  if (totalEarned !== undefined && totalEarned !== null) {
    queryParams.push(
      `filters[total_earned][$between][0]=${totalEarned.start}&filters[total_earned][$between][1]=${totalEarned.end}`
    );
  }
  if (username) {
    queryParams.push(`filters[user][username][$contains]=${username}`);
  }
  const queryString = queryParams.join("&");
  return apiClient.get(`${walletEndpoints.wallet}?${queryString}`, { headers: { paginate: true } });
};
