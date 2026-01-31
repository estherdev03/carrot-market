"use server";

import bcrypt from "bcrypt";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "Email does not exist!"),
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

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return { ...z.flattenError(result.error), data };
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? "xxxx",
    );
    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();

      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["Incorrect password!"],
          email: [],
        },
        data,
      };
    }
  }
};
