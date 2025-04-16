import { useEffect, useState } from 'react';

export const useDynamicInputs = (initial = [{ subject: '', class: '' }]) => {
  const [inputs, setInputs] = useState(initial);

  const handleChange = (index: number, field: keyof typeof initial[0], value: string) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  const addInput = () => {
    setInputs([...inputs, { subject: '', class: '' }]);
  };

  const removeInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  return {
    inputs,
    handleChange,
    addInput,
    removeInput
  };
};
