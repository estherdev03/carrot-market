import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function Login() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className=" text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number</h2>
      </div>
      <form action="" className="flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <FormInput
            title="Phone number"
            type="number"
            placeholder="Phone number"
            required
            errors={[]}
          />
          <FormInput
            title="Verification code"
            type="number"
            placeholder="Verification code"
            required
            errors={[]}
          />
        </div>
        <FormButton loading={false} text="Verify" />
      </form>
    </div>
  );
}
