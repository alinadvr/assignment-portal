import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = ComponentProps<"button"> & { fullWidth?: boolean };

const Button = ({
  type,
  className,
  fullWidth,
  children,
  ...buttonProps
}: ButtonProps) => {
  return (
    <button
      type={type ?? "button"}
      className={twMerge(
        "rounded-full bg-indigo-800 px-5 py-2.5 text-sm font-medium tracking-wide text-white transition-all enabled:hover:bg-indigo-900 enabled:focus:bg-indigo-950 enabled:active:scale-[0.97] enabled:active:bg-indigo-950 disabled:opacity-50",
        fullWidth ? "w-full" : "w-fit",
        className,
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Button;
