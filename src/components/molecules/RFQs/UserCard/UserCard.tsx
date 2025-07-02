import CustomImage from "@/components/atoms/Image/CustomImage";
import React from "react";
import { FaCheck } from "react-icons/fa";
interface UserCardProps {
  id: string | number;
  coverImage: string;
  logoImg: string;
  name: string;
  city: string;
  country?: string;
  isChecked: boolean;
  onCheckboxChange: any;
  isDisabled: boolean;
}
const UserCard: React.FC<UserCardProps> = ({
  id,
  coverImage,
  logoImg,
  name,
  city,
  country,
  isChecked,
  onCheckboxChange,
  isDisabled,
}) => {
  return (
    <div
      data-testid="user-card"
      className={`relative overflow-hidden w-full border-2 rounded-lg ${
        isChecked ? "border-orange-600" : "border-gray-300"
      }`}
    >
      <div className="absolute top-2 right-2 z-50">
        <input
          data-testid="user-card-checkbox"
          type="checkbox"
          id={`selectCheckbox-${id}`}
          className="hidden"
          checked={isChecked}
          onChange={onCheckboxChange}
          disabled={isDisabled}
        />
        <label
          htmlFor={`selectCheckbox-${id}`}
          className={`flex items-center justify-center w-5 h-5 border rounded-full cursor-pointer ${
            isChecked
              ? "bg-orange-600 border-orange-600"
              : "bg-white border-gray-300"
          }`}
        >
          {isChecked && <FaCheck className="text-white text-sm" />}
        </label>
      </div>
      <div className="w-full h-[150px] relative">
        <CustomImage src={coverImage} alt="Cover" fill />
      </div>
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 rounded-full mr-3 ltr:ml-3 relative">
            <CustomImage
              src={logoImg}
              alt="Profile"
              fill
              className=" rounded-full"
            />
          </div>
          <div>
            <div className=" mt-4 text-md font-semibold text-gray-900 text-center truncate">
              {name.length > 18 ? `${name.slice(0, 18)}...` : name}
            </div>{" "}
            <div className="flex items-center mt-1">
              {country && (
                <div className="text-xs text-gray-600 mr-1 whitespace-nowrap">
                  {country},
                </div>
              )}
              <div className="text-xs text-gray-600">{city}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
