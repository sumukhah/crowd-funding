import React, { useEffect, useState } from "react";
import { validPriceTypes } from "../utils/constants";
import { Form, Input, Select } from "antd";
import { convertEtherToWei } from "../utils/helper";

export default function PriceInput({ onChangeInput, ...otherProps }) {
  const [priceType, setPriceType] = useState(validPriceTypes.ETHER);
  const [price, setPrice] = useState({});

  const onChangeValue = (e) => {
    setPrice({ [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setInputValue(price, priceType);
  }, [price, priceType]);

  const setInputValue = (price, priceType) => {
    const name = Object.keys(price)[0];
    if (priceType === validPriceTypes.ETHER) {
      onChangeInput(name, convertEtherToWei(price[name]));
    } else {
      onChangeInput(name, price[name]);
    }
  };

  return (
    <Input
      {...otherProps}
      onChange={onChangeValue}
      addonAfter={
        <Select defaultValue={priceType} onChange={setPriceType}>
          <Select.Option value={validPriceTypes.ETHER}>ether</Select.Option>
          <Select.Option value={validPriceTypes.WEI}>wei</Select.Option>
        </Select>
      }
    />
  );
}
