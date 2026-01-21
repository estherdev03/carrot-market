interface FormInputProps {
  title: string;
  type: string;
  placeholder: string;
  required: boolean;
  errors: string[];
}
export default function FormInput({
  type,
  placeholder,
  required,
  errors,
  title,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2 group">
      <label htmlFor={title} className="group-focus-within:text-orange-400 ">
        {title}
      </label>
      <input
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400 no-spinner"
        type={type}
        placeholder={placeholder}
        required={required}
        id={title}
      />
      {errors.map((error, idx) => (
        <span key={idx} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
