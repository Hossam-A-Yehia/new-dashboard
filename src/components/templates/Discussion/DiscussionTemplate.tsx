'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useFetchDiscussion, useMutateAddMessage } from '@/hooks/useDiscussion';
import { useQuery } from '@/hooks/useQuery';
import MessageList from '@/components/organisms/MessageList/MessageList';
import MessageInput from '@/components/organisms/MessageInput/MessageInput';
import './Discussion.css';
import { useUser } from '@/context/UserContext';
import { useParams } from 'react-router-dom';

const DiscussionTemplate = () => {
  const { id: rfqId } = useParams();

  const { userData } = useUser();
  const userId = userData?.id;
  const { receiverId } = useQuery();
  const { isrfq } = useQuery();
  const { type } = useQuery();

  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const discussionableType = isrfq === 'true' ? 1 : 2;

  const queryParams = {
    discussionable_id: String(rfqId),
    user_id: type === 'invitation' ? userId : receiverId,
    discussionable_type: discussionableType,
    page,
  };

  const { mutateAsync, isPending: isMutatePutLoading } = useMutateAddMessage();
  const {
    data: { payload: { data: discussion = [], last_page: lastPage = 1 } = {} } = {},
    isLoading,
  } = useFetchDiscussion(queryParams);

  useEffect(() => {
    if (page === 1) {
      setMessages(discussion);
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        ...discussion.filter(
          (msg: any) => !prevMessages.some((prevMsg: any) => prevMsg.id === msg.id),
        ),
      ]);
    }
    setHasMore(page < lastPage);
  }, [discussion, lastPage, page]);

  const handleSubmit = async (values: any, { resetForm }: any) => {
    const { message, file } = values;
    if (!message && !file) return;

    const structuredData = {
      message,
      discussionable_id: Number(rfqId),
      discussionable_type: 1,
      sender_id: userId,
      receiver_id: Number(receiverId),
      files: file ? [file] : [],
    };
    const form_data = new FormData();
    Object.entries(structuredData).forEach(([key, value]) => {
      if (value) {
        if (key === 'files' && Array.isArray(value)) {
          structuredData.files.forEach((file: File, index: number) => {
            if (file instanceof File) {
              form_data.append(`files[${index}]`, file);
            }
          });
        } else {
          form_data.append(key, value as any);
        }
      }
    });

    try {
      await mutateAsync(form_data);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          created_at: new Date().toISOString(),
          message,
          files: file ? [file] : [],
          sender_id: userId,
        },
      ]);
      resetForm();
      toast.info(t('discussion.success_message'));
    } catch (err: any) {
      toast.error(t(err.response?.data?.message || 'An error occurred'));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 h-screen" data-testid="discussion-container">
      <div className="text-center mb-8 mt-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2" data-testid="discussion-title">
          {t('discussion.discussion')}
        </h1>
      </div>
      <MessageList
        messages={messages}
        userId={String(userId)}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={() => setPage((prev) => prev + 1)}
      />
      <MessageInput onSubmit={handleSubmit} isLoading={isMutatePutLoading} />
      {isMutatePutLoading && (
        <div className="flex justify-center mt-3 text-blue-500">
          <AiOutlineLoading3Quarters className="animate-spin" size={24} />
          <span className="ml-2">{t('discussion.sending')}</span>
        </div>
      )}
    </div>
  );
};

export default DiscussionTemplate;
