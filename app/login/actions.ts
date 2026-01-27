"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import { z } from "zod";

const formSchema = z.object({
  email: z.email().toLowerCase(),
  password: z
    .string({
      error: (err) =>
        err.input === undefined
          ? "Password is required."
          : "Password must be a string.",
    })
    .min(PASSWORD_MIN_LENGTH, "Password is too short!")
    .regex(
      PASSWORD_REGEX,
      "Password must contain uppercase, lowercase, a number and special characters",
    ),
});

export const login = async (prevState: any, formData: FormData) => {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return { ...z.flattenError(result.error), data };
  } else {
    console.log(result.data);
  }
};
