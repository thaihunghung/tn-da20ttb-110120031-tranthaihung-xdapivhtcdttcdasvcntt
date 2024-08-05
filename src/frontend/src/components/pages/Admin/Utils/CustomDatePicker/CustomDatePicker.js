import React, { useState } from 'react';
import { Button, Popover, Input } from "@nextui-org/react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CustomDatePicker = ({ value, onChange }) => {
  const [visible, setVisible] = useState(false);

  const handleDateChange = (date) => {
    onChange(date);
    setVisible(false);
  };

  return (
    <Popover
      isOpen={visible}
      onOpenChange={setVisible}
      placement="bottom"
      triggerType="click"
    >
      <Popover.Trigger>
        <Input 
          value={value ? value.toLocaleDateString() : ''}
          placeholder="Select a date"
          readOnly
        />
      </Popover.Trigger>
      <Popover.Content>
        <Calendar onChange={handleDateChange} value={value} />
      </Popover.Content>
    </Popover>
  );
};

export default CustomDatePicker;
