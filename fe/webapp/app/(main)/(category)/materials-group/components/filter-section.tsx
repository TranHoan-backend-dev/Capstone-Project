"use client";

import React from "react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";

export const FilterSection = () => {
  return (
    <GenericSearchFilter
      isCollapsible
      gridClassName="grid grid-cols-1 lg:grid-cols-3 gap-x-4 gap-y-3"
      icon={<SearchIcon size={18} />}
      title=""
    >
      <section className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="w-full md:col-span-1">
            <CustomInput label="Mã nhóm vật tư" />
          </div>

          <div className="md:col-span-1">
            <CustomInput label="Tên nhóm vật tư" />
          </div>
        </div>
      </section>
    </GenericSearchFilter>
  );
};
