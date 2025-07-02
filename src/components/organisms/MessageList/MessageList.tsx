import React from "react";
import { t } from "i18next";
import { RiFileTextFill } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import { UrlObject } from "url";
import Button from "@/components/atoms/Button/Button";
import { Link } from "react-router-dom";

interface MessageListProps {
  messages: any[];
  userId: string;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

interface MessageItemProps {
  message: any;
  userId: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, userId }) => {
  const isSender = message.sender_id === userId;

  return (
    <div
      key={message.id}
      data-testid={`message-${message.id}`}
      className={`message mb-2 ${
        isSender ? "bg-blue-100 message-you" : "bg-gray-100 message-john"
      } p-3 rounded-lg`}
    >
      <strong>
        {isSender ? t("discussion.you") : t("discussion.other_party")}:
      </strong>{" "}
      <span>{message.message}</span>
      {message.files && message.files.length > 0 && (
        <div
          data-testid={`file-preview-${message.id}`}
          className="file-preview mt-2"
        >
          {message.files.map(
            (file: { url: string | UrlObject }, index: number) => {
              // Convert UrlObject to string if necessary
              let fileUrl: string | undefined;
              if (typeof file.url === "string") {
                fileUrl = file.url;
              } else if (file.url && typeof file.url === "object" && "pathname" in file.url) {
                // Only use pathname if it's a string
                fileUrl = typeof file.url.pathname === "string" ? file.url.pathname : undefined;
              }

              return (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center p-2 rounded-lg"
                    style={{ backgroundColor: "#9e9e9e14" }}
                  >
                    <RiFileTextFill className="text-green-500 text-xl" />
                  </div>
                  {fileUrl ? (
                    <Link
                      to={fileUrl}
                      target="_blank"
                      className="text-green-500 flex gap-2 items-center"
                      data-testid={`file-link-${message.id}-${index}`}
                    >
                      <FaEye />
                      <span>{t("discussion.view")}</span>
                    </Link>
                  ) : (
                    <a
                      href={"#"}
                      className="text-green-500 flex gap-2 items-center"
                      data-testid={`file-link-${message.id}-${index}`}
                    >
                      <FaEye />
                      <span>{t("discussion.file")}</span>
                    </a>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

const LoadMoreButton: React.FC<{
  isLoading: boolean;
  onLoadMore: () => void;
}> = ({ isLoading, onLoadMore }) => (
  <div className="text-center mb-4">
    <Button
      variant="main"
      onClick={onLoadMore}
      disabled={isLoading}
      data-testid="load-more-button"
    >
      {t("discussion.view_more")}
    </Button>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="text-center mt-4">
    <span
      className="animate-spin border-4 border-gray-300 border-t-blue-500 rounded-full w-6 h-6 inline-block"
      data-testid="loading-spinner"
    ></span>
    <span className="sr-only">{t("Loading...")}</span>
  </div>
);

const MessageList: React.FC<MessageListProps> = ({
  messages,
  userId,
  isLoading,
  hasMore,
  onLoadMore,
}) => {
  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div
      className="border p-4 rounded-lg bg-white shadow-md h-[350px] overflow-y-scroll"
      data-testid="message-list"
    >
      {hasMore && (
        <LoadMoreButton isLoading={isLoading} onLoadMore={onLoadMore} />
      )}
      {sortedMessages.length > 0 ? (
        sortedMessages.map((msg) => (
          <MessageItem key={msg.id} message={msg} userId={userId} />
        ))
      ) : (
        <div
          data-testid="no-discussions"
          className="text-center text-gray-500 mt-4"
        >
          {t("discussion.no_discussions")}
        </div>
      )}
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default MessageList;
