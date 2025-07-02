import { render, screen, fireEvent } from "@testing-library/react";
import MessageList from "./MessageList";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/atoms/Button/Button", () => ({
  __esModule: true,
  default: ({ onClick, disabled, children }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="load-more-button"
    >
      {children}
    </button>
  ),
}));

describe("MessageList", () => {
  const userId = "user-1";
  const messages = [
    {
      id: "1",
      sender_id: "user-1",
      message: "Hello from sender",
      created_at: "2023-10-01T12:00:00Z",
    },
    {
      id: "2",
      sender_id: "user-2",
      message: "Hello from receiver",
      created_at: "2023-10-01T12:05:00Z",
      files: [{ url: "http://example.com/file1.pdf" }],
    },
  ];

  it("renders messages correctly", () => {
    render(
      <MessageList
        messages={messages}
        userId={userId}
        isLoading={false}
        hasMore={false}
        onLoadMore={() => {}}
      />
    );
    expect(screen.getByTestId("message-1")).toBeDefined();
    expect(screen.getByTestId("message-2")).toBeDefined();
    expect(screen.getByTestId("file-preview-2")).toBeDefined();
  });

  it("renders 'No discussions' when there are no messages", () => {
    render(
      <MessageList
        messages={[]}
        userId={userId}
        isLoading={false}
        hasMore={false}
        onLoadMore={() => {}}
      />
    );
    expect(screen.getByTestId("no-discussions")).toBeDefined();
  });
  it("renders the loading spinner when isLoading is true", () => {
    render(
      <MessageList
        messages={messages}
        userId={userId}
        isLoading={true}
        hasMore={false}
        onLoadMore={() => {}}
      />
    );
    expect(screen.getByTestId("loading-spinner")).toBeDefined();
  });

  it("renders the 'Load More' button when hasMore is true", () => {
    const onLoadMoreMock = vi.fn();
    render(
      <MessageList
        messages={messages}
        userId={userId}
        isLoading={false}
        hasMore={true}
        onLoadMore={onLoadMoreMock}
      />
    );
    const loadMoreButton = screen.getByTestId("load-more-button");
    expect(loadMoreButton).toBeDefined();
    fireEvent.click(loadMoreButton);
    expect(onLoadMoreMock).toHaveBeenCalled();
  });

  it("disables the 'Load More' button when isLoading is true", () => {
    render(
      <MessageList
        messages={messages}
        userId={userId}
        isLoading={true}
        hasMore={true}
        onLoadMore={() => {}}
      />
    );
    const loadMoreButton = screen.getByTestId("load-more-button");
    expect(loadMoreButton).toBeDisabled();
  });
});
