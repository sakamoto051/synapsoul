import React from 'react';
import { User } from 'lucide-react';
import { Tag } from '@prisma/client';
import { formatDateInJST } from '~/utils/date';

const RoomCard = ({ name, details, tags, createdAt }: { name: string, details: string, tags: Tag[], createdAt: Date }) => {
  // 作成日をJSTでフォーマット
  const formattedDate = formatDateInJST(createdAt);

  return (
    <div className="relative bg-gray-800 rounded-lg p-4 text-white">
      {/* 作成日を右下に配置 */}
      <p className="absolute bottom-2 right-2 text-xs text-gray-400">
        {formattedDate}
      </p>
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-sm text-gray-300 mb-4">{details}</p>
      <div className="flex flex-col space-y-2">
        <div className="flex justify-left space-x-2">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs bg-gray-700 rounded-full px-2 py-1">
              {tag.name}
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <User size={14} className="text-black" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
