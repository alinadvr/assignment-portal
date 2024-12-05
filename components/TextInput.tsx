import { ComponentProps } from "react";

import { twMerge } from "tailwind-merge";

type TextareaProps = {
  textarea: true;
} & ComponentProps<"textarea">;

type InputProps = ComponentProps<"input"> & { textarea?: false };

type TextInputProps = {
  label?: string;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: string;
  wrapperClassName?: string;
} & (TextareaProps | InputProps);

const TextInput = ({
  label,
  error,
  className,
  fullWidth,
  helperText,
  wrapperClassName,
  textarea = false,
  ...inputProps
}: TextInputProps) => {
  const inputClassName = twMerge(
    "border transition-all bg-transparent px-6 py-1.5 text-white",
    error
      ? "border-red-600"
      : "border-gray-700 shadow-[0_0_4px_tranparent] enabled:focus:border-gray-500 enabled:focus:shadow-indigo-300",
    textarea ? "rounded-xl resize-none h-40" : "rounded-full",
    className,
  );

  return (
    <div
      className={twMerge(
        "flex flex-col gap-1",
        fullWidth ? "w-full" : "w-fit",
        wrapperClassName,
      )}
    >
      {label && (
        <label
          htmlFor={inputProps.id}
          className={twMerge(
            "w-fit pl-4 text-sm",
            error ? "text-red-700" : "text-gray-500",
          )}
        >
          {label}{" "}
          {inputProps.required && <span className="text-red-700">*</span>}
        </label>
      )}
      {textarea ? (
        <textarea
          className={inputClassName}
          {...(inputProps as ComponentProps<"textarea">)}
        />
      ) : (
        <input
          className={inputClassName}
          {...(inputProps as ComponentProps<"input">)}
        />
      )}

      {helperText && (
        <p
          data-testid={`input${inputProps.id ? `-${inputProps.id.replaceAll("_", "-")}` : ""}-helperText`}
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

export default TextInput;
