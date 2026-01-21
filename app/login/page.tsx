import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function Login() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className=" text-2xl">Hello!</h1>
        <h2 className="text-xl">Login with email and password</h2>
      </div>
      <form action="" className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <FormInput
            title="Email"
            type="email"
            placeholder="Email"
            required
            errors={[]}
          />
          <FormInput
            title="Password"
            type="password"
            placeholder="Password"
            required
            errors={[]}
          />
        </div>
        <FormButton loading={false} text="Create Account" />
      </form>
      <SocialLogin />
    </div>
  );
}
