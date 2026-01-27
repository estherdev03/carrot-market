import { InputHTMLAttributes } from "react";

interface InputProps {
  title: string;
  errors?: string[];
  name: string;
}
export default function Input({
  title,
  errors = [],
  name,
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2 group">
      <label htmlFor={title} className="group-focus-within:text-orange-400 ">
        {title}
      </label>
      <input
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400 no-spinner"
        id={title}
        name={name}
        {...rest}
      />
      {
        <span className="text-red-500 font-medium">
          {errors.length > 0 ? errors[0] : ""}
        </span>
      }
    </div>
  );
}
