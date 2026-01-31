"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";

import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkPasswords = ({
  password,
  confirmPassword,
}: {
  password: string;
  confirmPassword: string;
}) => password === confirmPassword;

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};
const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

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
      .trim()
      .refine(checkUniqueUsername, "Username already exists!"),
    email: z
      .email()
      .toLowerCase()
      .refine(checkUniqueEmail, "Email already exists!"),
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

  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    console.log(z.flattenError(result.error));

    return { ...z.flattenError(result.error), data };
  } else {
    //Hash password
    const { username, email, password } = result.data;
    const hashedPassword = await bcrypt.hash(password, 12);

    //Save the user to db
    const user = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    //Log user in
    const session = await getSession();
    session.id = user.id;
    await session.save();

    redirect("/profile");
  }
}
