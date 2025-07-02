import React from "react";
import { useFormik } from "formik";
import {
  AiOutlinePaperClip,
  AiOutlineSend,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import Input from "@/components/atoms/Input/Input";
import { BiPaperclip } from "react-icons/bi";

interface MessageInputProps {
  onSubmit: (values: any, formikHelpers: any) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSubmit, isLoading }) => {
  const formik = useFormik({
    initialValues: {
      message: "",
      file: null as File | null,
    },
    onSubmit: (values, formikHelpers) => {
      onSubmit(values, formikHelpers);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex items-center flex-col w-full gap-3 p-3 border rounded-lg shadow-sm bg-white"
    >
      <div className="flex items-center gap-3 p-3 border rounded-lg shadow-sm bg-white w-full">
        <Input
          type="text"
          name="message"
          value={formik.values.message}
          onChange={formik.handleChange}
          placeholder="Type your message..."
          id={"message"}
        />
        <label className="cursor-pointer text-gray-500 hover:text-blue-500 transition">
          <AiOutlinePaperClip size={24} />
          <input
            data-testid="file-input"
            type="file"
            name="file"
            className="hidden"
            onChange={(event) =>
              formik.setFieldValue("file", event.currentTarget.files?.[0])
            }
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition flex items-center justify-center"
          disabled={isLoading}
          data-testid="submit-button"
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin" size={20} />
          ) : (
            <AiOutlineSend size={20} />
          )}
        </button>
      </div>
      {formik.values.file && (
        <div className="mt-2 flex items-center justify-between p-2 border border-gray-300 rounded-lg w-full">
          <div className="flex items-center">
            <BiPaperclip size={16} className="text-blue-500 mr-2" />
            <p className="text-sm text-gray-700">{formik.values.file.name}</p>
          </div>
          <button
            className="text-red-500 hover:text-red-700 text-lg font-bold"
            onClick={() => formik.setFieldValue("file", null)}
          >
            &times;
          </button>
        </div>
      )}
    </form>
  );
};

export default MessageInput;
