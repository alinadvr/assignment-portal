"use client";

import { useEffect, useRef, useState } from "react";

import { twMerge } from "tailwind-merge";
import { IconChevronDown } from "@tabler/icons-react";

export type SelectProps = {
  label?: string;
  error?: boolean;
  value?: string | number;
  required?: boolean;
  className?: string;
  fullWidth?: boolean;
  helperText?: string;
  placeholder?: string;
  wrapperClassName?: string;
  defaultValue?: string | number;
  options?: { value: string | number; label: string }[];
  optionsError?: string;
  onOpen?: () => void;
  onChange?: (value: string) => void;
};

const Select = ({
  label,
  value,
  error,
  options,
  required,
  className,
  fullWidth,
  helperText,
  placeholder,
  defaultValue,
  optionsError,
  wrapperClassName,
  onOpen,
  onChange,
}: SelectProps) => {
  const [selected, setSelected] = useState<string>(
    defaultValue?.toString() ?? value?.toString() ?? "",
  );
  const [isOpen, setIsOpen] = useState(false);

  const selectRef = useRef(null);

  useEffect(() => {
    if (!selectRef.current) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (!selectRef.current) return;

      if (!e.composedPath().includes(selectRef.current)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("click", handleOutsideClick);
    else document.removeEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);

    if (onOpen) onOpen();
  };

  const handleSelect = (value: string | number) => {
    const valueString = value.toString();

    setSelected(valueString);
    setIsOpen(false);

    if (onChange) onChange(valueString);
  };

  return (
    <div
      ref={selectRef}
      className={twMerge(
        "relative flex flex-col gap-1",
        fullWidth ? "w-full" : "w-fit",
        wrapperClassName,
      )}
    >
      {label && (
        <p
          aria-label="select-label"
          className={twMerge(
            "w-fit cursor-pointer pl-4 text-sm",
            error ? "text-red-700" : "text-gray-500",
          )}
          onClick={handleOpen}
        >
          {label} {required && <span className="text-red-700">*</span>}
        </p>
      )}
      <button
        type="button"
        data-testid="select-button"
        onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
        className={twMerge(
          "box-content flex h-6 items-center justify-between rounded-full border bg-transparent px-6 py-1.5 text-white transition-all",
          error
            ? "border-red-600"
            : isOpen
              ? "border-gray-500 shadow-[0_0_4px_tranparent] shadow-indigo-300"
              : "border-gray-700",
          className,
        )}
      >
        <span data-testid="select-value">
          {selected ? selected : placeholder}
        </span>
        <IconChevronDown size={16} color="gray" />
      </button>
      <ul
        data-testid="select-dropdown"
        className={twMerge(
          "absolute inset-x-0 z-20 overflow-hidden rounded-lg bg-gray-700 shadow-lg transition-all duration-300",
          isOpen
            ? label
              ? "top-[4.25rem]"
              : "top-11"
            : label
              ? "top-14"
              : "top-9",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        {options ? (
          options.map(({ label, value }) => (
            <li
              key={value}
              onClick={() => handleSelect(value)}
              className="cursor-pointer px-6 py-2 font-medium text-gray-950 transition-colors duration-100 hover:bg-gray-600 hover:text-gray-300"
            >
              {label}
            </li>
          ))
        ) : optionsError ? (
          <li className="px-6 py-2 text-red-600">{optionsError}</li>
        ) : (
          <li className="p-6">
            <div className="mx-auto size-10 animate-spin rounded-full border-4 border-gray-800 border-t-gray-600"></div>
          </li>
        )}
      </ul>
      {helperText && (
        <p
          data-testid="select-helperText"
          className={twMerge(
            "mt-0.5 w-fit pl-4 text-xs",
            error ? "text-red-700" : "text-gray-300",
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
