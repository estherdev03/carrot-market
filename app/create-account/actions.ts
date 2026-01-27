"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import { z } from "zod";

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const formSchema = z
  .object({
    username: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Username is required!"
            : "Username must be a string!",
      })
      .toLowerCase()
      .trim(),
    email: z.email().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "Password is too short!")
      .regex(
        PASSWORD_REGEX,
        "Password must contain uppercase, lowercase, a number and special characters",
      ),
    confirmPassword: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "Password is too short!"),
  })
  .refine(checkPasswords, {
    error: "Confirm password is not correct",
    path: ["confirmPassword"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = formSchema.safeParse(data);
  if (!result.success) {
    return { ...z.flattenError(result.error), data };
  } else {
    console.log(result.data);
  }
}
