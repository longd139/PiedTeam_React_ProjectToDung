import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { LoginSchema, type LoginSchemaType } from "../schema";
import { useLoginMutation } from "../hooks/useAuth";
import FormField from "../components/FormField";
import SubmitBtn from "../components/SubmitBtn";
import AuthCard from "../components/AuthCard";

const LoginPage = () => {
  const loginMutation = useLoginMutation();
  ("render ... loginpage");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    mode: "onTouched",
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleLogin = async (data: LoginSchemaType) => {
    // e.preventDefault();
    loginMutation.mutate(data);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <AuthCard title="Welcome !" description="Sign in to continue">
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="n@example.com"
            register={register("email")}
            error={errors.email}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            register={register("password")}
            error={errors.password}
          />

          <SubmitBtn
            isPending={loginMutation.isPending}
            isSubmitting={isSubmitting}
            label="Login"
            pendingLabel="Đang đăng nhập"
          />
        </form>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
