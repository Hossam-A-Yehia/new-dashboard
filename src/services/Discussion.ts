import apiClient from "@/config/apiClient";
import discussionEndpoints from "@/config/endpoints/discussionEndpoint";
import { DiscussionParams } from "@/types/Discussion";

export const getDiscussion = async ({
  discussionable_id,
  user_id,
  discussionable_type,
  page = 1,
}: DiscussionParams): Promise<any> => {
  const queryString = `page=${page}`;
  const response = await apiClient.get(
    `${discussionEndpoints.getDiscussion}?discussionable_type=${discussionable_type}&discussionable_id=${discussionable_id}&user_id=${user_id}&${queryString}`
  );
  return response.data;
};

export const mutateAddMessage = async (data: any) => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const response = await apiClient.post(
    `${discussionEndpoints.addMessage}`,
    data,
    {
      headers,
    }
  );
  return response.data;
};
