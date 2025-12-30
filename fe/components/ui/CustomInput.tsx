import { Input, InputProps } from '@heroui/react'
import React from 'react'

interface CustomInputProps extends InputProps {
    type?: string;
    label: string;
}

const CustomInput = ({
    type = "text",
    label,
    isRequired,
    ...props
}: CustomInputProps) => {
    return (
        <Input
            type={type}
            label={label}
            labelPlacement="inside"
            variant="bordered"
            radius="md"
            isRequired={isRequired}
            {...props}
        />
    )
}

export default CustomInput