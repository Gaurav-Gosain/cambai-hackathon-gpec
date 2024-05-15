import React from "react";

type SelectProps = {
  items: { label: string; deviceId: string }[];
  dataset: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
};

export function Select(props: SelectProps) {
  const devices = props.items.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.deviceId === value.deviceId),
  );

  return (
    <select
      className="input p2 text-black px-2 rounded-lg ml-2"
      onChange={props.onChange}
    >
      {devices.map((item) => {
        const dataAttr = {
          [`data-${props.dataset}`]: item.deviceId,
        };
        return (
          <option key={item.deviceId} value={item.deviceId} {...dataAttr}>
            {item.label}
          </option>
        );
      })}
    </select>
  );
}
