"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { Input, Button } from "@heroui/react";

export const SearchToolbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-xs">
        <Input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          }
        />
      </div>

      <Button className="bg-blue-600 text-white hover:bg-blue-700">
        <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
        Xuất file
      </Button>

      <Button className="bg-blue-600 text-white hover:bg-blue-700">
        <BookmarkIcon className="mr-2 h-4 w-4" />
        Lưu
      </Button>
    </div>
  );
};
