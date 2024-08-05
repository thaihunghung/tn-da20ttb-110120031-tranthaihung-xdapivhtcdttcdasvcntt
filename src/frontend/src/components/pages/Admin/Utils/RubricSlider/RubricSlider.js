import React from 'react';
import { Slider, Tooltip } from "@nextui-org/react";

const RubricSlider = ({ maxScore, index, defaultValue, handleSliderChange, rubricsItem_id, StudentName, studentID}) => {
  

  const getMarks = (maxScore) => {
    let marks = [];
    if (maxScore === 1) {
      marks = [
        { value: 0, label: "0" },
        { value: 0.25, label: "0.25" },
        { value: 0.5, label: "0.5" },
        { value: 0.75, label: "0.75" },
        { value: 1, label: "1" },
      ];
    } else if (maxScore === 1.25) {
      marks = [
        { value: 0, label: "0" },
        { value: 0.5, label: "0.5" },
        { value: 0.75, label: "0.75" },
        { value: 1, label: "1" },
        { value: 1.25, label: "1.25" },
      ];
    }else if (maxScore === 1.5) {
      marks = [
        { value: 0, label: "0" },
        { value: 0.5, label: "0.5" },
        { value: 1, label: "1" },
        { value: 1.5, label: "1.5" },
      ];
    } else if (maxScore === 1.75) {
      marks = [
        { value: 0, label: "0" },
        { value: 0.25, label: "0.5" },
        { value: 1, label: "1" },
        { value: 1.5, label: "1.5" },
        { value: 1.75, label: "1.75" },
      ];
    } else if (maxScore === 2) {
      marks = [
        { value: 0, label: "0" },
        { value: 0.5, label: "0.5" },
        { value: 1, label: "1" },
        { value: 1.5, label: "1.5" },
        { value: 2, label: "2" },
      ];
    } else if (maxScore === 0.75) {
      marks = [
        { value: 0, label: "0" },
        { value: 0.25, label: "0.25" },
        { value: 0.5, label: "0.5" },
        { value: 0.5, label: "0.75" },
      ];
    }  else if (maxScore === 0.5) {
      marks = [
        { value: 0, label: "0" },
        { value: 0.25, label: "0.25" },
        { value: 0.5, label: "0.5" },
      ];
    } else if (maxScore === 0.25) {
      marks = [
        { value: 0, label: "0" },
        { value: 0.25, label: "0.25" },
      ];
    }
    return marks;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-full">
      <Slider
        size="lg"
        label={<span>{StudentName}</span>}
        showTooltip={true}
        step={0.25}
        maxValue={maxScore}
        minValue={0}
        defaultValue={defaultValue}
        className="max-w-full"
        marks={getMarks(maxScore)}
        onChange={(value) => handleSliderChange(index, value, rubricsItem_id, studentID)}
      />
    </div>
  );
};

export default RubricSlider;
