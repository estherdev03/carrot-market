"use client";

import SocialLogin from "@/components/social-login";
import { login } from "./actions";
import { useActionState } from "react";
import Input from "@/components/input";
import Button from "@/components/button";

export default function Login() {
  const [state, action] = useActionState(login, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className=" text-2xl">Hello!</h1>
        <h2 className="text-xl">Login with email and password</h2>
      </div>
      <form action={action} className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <Input
            title="Email"
            type="email"
            placeholder="john.doe@example.com"
            required
            name="email"
            errors={state?.fieldErrors.email}
            defaultValue={
              state?.data.email ? state.data.email.toString() : undefined
            }
          />
          <Input
            title="Password"
            type="password"
            placeholder="***********"
            required
            name="password"
            errors={state?.fieldErrors.password}
          />
        </div>
        <Button text="Login" />
      </form>
      <SocialLogin />
    </div>
  );
}
