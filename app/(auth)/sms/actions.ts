"use server";

import crypto from "crypto";
import { z } from "zod";
import validator from "validator";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import twilio from "twilio";

interface ActionState {
  token: boolean;
  phone?: string;
  formErrors?: string[];
}

const tokenExists = async (token: number) => {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
};

const isValidToken = async (token: number, phone: string) => {
  const result = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      user: true,
    },
  });
  if (result?.user.phone?.trim() !== phone.trim()) return false;
  else return true;
};

async function createToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) return createToken();
  else return token;
}

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "en-CA"),
    "Invalid phone number!",
  );

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "Invalid token!");

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
      //Delete previous token if exists
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      const token = await createToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                phone: result.data,
                username: crypto.randomBytes(10).toString("hex"),
              },
            },
          },
        },
      });
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
      await client.messages.create({
        body: `Your Carrot Market verification code is: ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: result.data, //Can only use personal phone number right now due to trial account
      });
      return { token: true, phone: phone?.toString() };
    }
  } else {
    const result = await tokenSchema.safeParseAsync(token);
    if (!result.success) {
      return {
        formErrors: z.flattenError(result.error).formErrors,
        token: true,
        phone: prevState.phone?.toString(),
      };
    } else {
      const isValid = await isValidToken(+token!, prevState.phone!.toString());
      if (!isValid)
        return {
          formErrors: ["Invalid token!"],
          token: true,
          phone: prevState.phone?.toString(),
        };
      const { userId } = await db.sMSToken.delete({
        where: {
          token: token?.toString(),
        },
        select: {
          userId: true,
        },
      });
      const session = await getSession();
      session.id = userId;
      await session.save();
      redirect("/profile");
    }
  }
}
