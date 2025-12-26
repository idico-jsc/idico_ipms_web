import * as React from "react"

import { Calendar } from "@/components/atoms/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/atoms/popover"

export interface DatePickerProps {
    date?: Date
    onDateChange?: (date: Date | undefined) => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children?: React.ReactNode
    align?: "start" | "center" | "end"
    captionLayout?: "dropdown" | "dropdown-months" | "dropdown-years" | "label"
    className?: string
}

export function DatePicker({
    date,
    onDateChange,
    open: controlledOpen,
    onOpenChange,
    children,
    align = "start",
    captionLayout = "dropdown",
    className,
}: DatePickerProps) {
    const [internalOpen, setInternalOpen] = React.useState(false)

    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? onOpenChange : setInternalOpen

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className={className}>{children}</div>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align={align}>
                <Calendar
                    mode="single"
                    selected={date}
                    captionLayout={captionLayout}
                    onSelect={(selectedDate) => {
                        onDateChange?.(selectedDate)
                        setOpen?.(false)
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}
