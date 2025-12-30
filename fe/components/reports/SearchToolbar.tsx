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
    <div className="flex flex-col md:flex-row items-center gap-4 py-2">
      <div className="relative flex-1 w-full md:max-w-xs">
        <Input
          type="text"
          placeholder="Nhập từ khóa tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="bordered"
          classNames={{
            inputWrapper: "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 h-10",
            input: "text-sm dark:text-white"
          }}
          startContent={
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-zinc-500" />
          }
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <Button className="flex-1 md:flex-none bg-blue-600 dark:bg-primary text-white hover:bg-blue-700 h-10 px-6 font-bold">
          <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
          Xuất file
        </Button>

        <Button className="flex-1 md:flex-none bg-blue-600 dark:bg-primary text-white hover:bg-blue-700 h-10 px-6 font-bold">
          <BookmarkIcon className="mr-2 h-5 w-5" />
          Lưu
        </Button>
      </div>
    </div>
  );
};
