import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { DatePicker } from "@/components/molecules/date-picker"
import { cn } from "@/utils"

export interface DateInputProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  dateFormat?: string
  className?: string
  disabled?: boolean
  id?: string
  name?: string
}

const formatDate = (date: Date | undefined, format: string): string => {
  if (!date) return ""

  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()

  return format
    .replace("DD", day)
    .replace("MM", month)
    .replace("YYYY", year.toString())
    .replace("YY", year.toString().slice(-2))
}

const parseDate = (dateString: string, format: string): Date | undefined => {
  if (!dateString) return undefined

  const formatPattern = format
    .replace("DD", "(?<day>\\d{1,2})")
    .replace("MM", "(?<month>\\d{1,2})")
    .replace("YYYY", "(?<year>\\d{4})")
    .replace("YY", "(?<year>\\d{2})")

  const regex = new RegExp(`^${formatPattern}$`)
  const match = dateString.match(regex)

  if (!match || !match.groups) return undefined

  const day = parseInt(match.groups.day || "1", 10)
  const month = parseInt(match.groups.month || "1", 10) - 1
  let year = parseInt(match.groups.year || "0", 10)

  if (year < 100) {
    year += year < 50 ? 2000 : 1900
  }

  const date = new Date(year, month, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return undefined
  }

  return date
}

export function DateInput({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  dateFormat = "DD/MM/YYYY",
  className,
  disabled = false,
  id,
  name,
}: DateInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setInputValue(formatDate(value, dateFormat))
  }, [value, dateFormat])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    const parsedDate = parseDate(newValue, dateFormat)
    if (parsedDate) {
      onChange?.(parsedDate)
    }
  }

  const handleInputBlur = () => {
    if (!inputValue) {
      onChange?.(undefined)
      return
    }

    const parsedDate = parseDate(inputValue, dateFormat)
    if (parsedDate) {
      setInputValue(formatDate(parsedDate, dateFormat))
    } else {
      setInputValue(formatDate(value, dateFormat))
    }
  }

  return (
    <DatePicker
      date={value}
      onDateChange={onChange}
      open={open}
      onOpenChange={setOpen}
    >
      <div className={cn("relative", className)}>
        <Input
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setOpen(true)}
          disabled={disabled}
          tabIndex={-1}
        >
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </DatePicker>
  )
}
