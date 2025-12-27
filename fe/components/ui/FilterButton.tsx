import React from 'react'
import { FilterActionButton } from './FilterActionButton'
import { FunnelIcon } from '@heroicons/react/24/solid'

const FilterButton = () => {
    return (
        <FilterActionButton
            label="Lọc"
            icon={<FunnelIcon className="w-4 h-4" />}
            color="primary"
            className="bg-blue-600 hover:bg-blue-700"
            onPress={() => { }}
        />
    )
}

export default FilterButton