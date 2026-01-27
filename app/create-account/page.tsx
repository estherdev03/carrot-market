"use client";

import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { createAccount } from "./actions";
import { useActionState } from "react";
import Button from "@/components/button";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
  const [state, action] = useActionState(createAccount, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className=" text-2xl">Hello!</h1>
        <h2 className="text-xl">Fill in the form below to join</h2>
      </div>
      <form action={action} className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <Input
            title="Username"
            type="text"
            placeholder="john"
            required
            name="username"
            errors={state?.fieldErrors.username}
            defaultValue={
              state?.data.username ? state?.data.username.toString() : ""
            }
          />
          <Input
            title="Email"
            type="email"
            placeholder="john.doe@example.com"
            required
            name="email"
            errors={state?.fieldErrors.email}
            defaultValue={state?.data.email ? state?.data.email.toString() : ""}
          />
          <Input
            title="Password"
            type="password"
            placeholder="**********"
            required
            name="password"
            errors={state?.fieldErrors.password}
            minLength={PASSWORD_MIN_LENGTH}
          />
          <Input
            title="Confirm password"
            type="password"
            placeholder="**********"
            required
            name="confirmPassword"
            errors={state?.fieldErrors.confirmPassword}
            minLength={PASSWORD_MIN_LENGTH}
          />
        </div>
        <Button text="Create Account" />
      </form>
      <SocialLogin />
    </div>
  );
}
