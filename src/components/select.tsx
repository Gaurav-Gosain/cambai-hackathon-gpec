import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type SelectProps = {
  items: { label: string; deviceId: string }[];
  dataset: string;
  placeholder: string;
  onChange: (id: string) => void;
};

export function SelectCustom(props: SelectProps) {
  const devices = props.items.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.deviceId === value.deviceId),
  );

  return (
    <Select onValueChange={props.onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={props.placeholder} />
      </SelectTrigger>
      <SelectContent className="w-[180px]">
        <SelectGroup>
          {devices.map((item) => {
            return (
              <SelectItem key={item.deviceId} value={item.deviceId}>
                {item.label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
