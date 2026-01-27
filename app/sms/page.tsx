"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useActionState } from "react";
import { smsLogin } from "./actions";

const initialState = {
  token: false,
  phone: "(+1)",
};

export default function Login() {
  const [state, action] = useActionState(smsLogin, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className=" text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number</h2>
      </div>
      <form action={action} className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          {state?.token ? (
            <Input
              name="token"
              title="Verification code"
              type="number"
              placeholder="Verification code"
              required
              errors={[]}
              min={100000}
              max={999999}
            />
          ) : (
            <Input
              name="phone"
              title="Phone number"
              type="text"
              placeholder="Phone number"
              required
              errors={state.formErrors}
              defaultValue={`${state?.phone?.toString()} `}
            />
          )}
        </div>
        <Button text={state?.token ? "Verify" : "Send Verification SMS"} />
      </form>
    </div>
  );
}
