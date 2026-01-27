"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

const phoneSchema = z
  .string()
  .trim()
  .transform((phone) => phone.slice(4).toString().trim())
  .refine(
    (phone) => validator.isMobilePhone(phone, "en-CA"),
    "Invalid phone number!",
  );

const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
  token: boolean;
  phone?: string;
  formErrors?: string[];
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);

    if (!result.success) {
      return {
        formErrors: z.flattenError(result.error).formErrors,
        token: false,
        phone: phone?.toString(),
      };
    } else {
      return { token: true, phone: phone?.toString() };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        formErrors: z.flattenError(result.error).formErrors,
        token: true,
      };
    } else {
      redirect("/");
    }
  }
}
