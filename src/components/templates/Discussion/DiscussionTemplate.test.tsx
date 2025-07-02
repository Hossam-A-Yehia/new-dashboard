import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, vi } from "vitest";
import DiscussionTemplate from "./DiscussionTemplate";
import { useFetchUser } from "../../../hooks/useUser";
import {
  useFetchDiscussion,
  useMutateAddMessage,
} from "../../../hooks/useDiscussion";
import { useQuery } from "../../../hooks/useQuery";
import { toast } from "react-toastify";
import React from "react";
import { UserProvider } from "../../../context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/hooks/useUser", () => ({
  useFetchUser: vi.fn(),
}));
vi.mock("@/hooks/useDiscussion", () => ({
  useFetchDiscussion: vi.fn(),
  useMutateAddMessage: vi.fn(),
}));
vi.mock("@/hooks/useQuery", () => ({
  useQuery: vi.fn(),
}));
vi.mock("react-toastify", () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

const queryClient = new QueryClient();

describe("DiscussionTemplate", () => {
  const mockUserData = { id: "user123" };
  const mockMessages = [{ id: 1, message: "Hello" }];
  const mockMutateAddMessage = vi.fn();

  beforeEach(() => {
    (useFetchUser as any).mockReturnValue({ data: mockUserData });
    (useFetchDiscussion as any).mockReturnValue({
      data: { payload: { data: mockMessages, last_page: 2 } },
      isLoading: false,
    });
    (useMutateAddMessage as any).mockReturnValue({
      mutateAsync: mockMutateAddMessage,
      isPending: false,
    });
    (useQuery as any).mockReturnValue({
      receiverId: "receiver123",
      isrfq: "true",
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <DiscussionTemplate rfqId="123" />
        </UserProvider>
      </QueryClientProvider>
    );
    expect(screen.getByTestId("discussion-container")).toBeDefined();
    expect(screen.getByTestId("discussion-title")).toBeDefined();
  });

  it("loads messages correctly", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <DiscussionTemplate rfqId="123" />
        </UserProvider>
      </QueryClientProvider>
    );
    expect(screen.getByTestId("message-list")).toBeDefined();
    expect(screen.getByTestId("message-1")).toBeDefined();
  });

  it("displays a success toast message on successful message submission", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <DiscussionTemplate rfqId="123" />
        </UserProvider>
      </QueryClientProvider>
    );
    const messageInput = screen.getByTestId("message");
    const submitButton = screen.getByTestId("submit-button");
    fireEvent.change(messageInput, { target: { value: "New message" } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(toast.info).toHaveBeenCalled());
  });

  it("displays an error toast message on failed message submission", async () => {
    mockMutateAddMessage.mockRejectedValueOnce(new Error("Failed"));

    render(
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <DiscussionTemplate rfqId="123" />
        </UserProvider>
      </QueryClientProvider>
    );
    const messageInput = screen.getByTestId("message");
    const submitButton = screen.getByTestId("submit-button");
    fireEvent.change(messageInput, { target: { value: "New message" } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
