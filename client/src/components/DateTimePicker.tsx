import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateTimePickerProps {
    value: Date | null,
    setValue: (date: Date | null) => void
}

const DateTimePicker = ({ value, setValue }: DateTimePickerProps) =>
    <DatePicker
        selected={value}
        onChange={(date) => setValue(date)}
        timeInputLabel="Time:"
        dateFormat="MM/dd/yyyy hh:mm aa"
        showTimeInput
    />;

export default DateTimePicker;