import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRegisterMutation } from "../hooks/useAuth";
import { registerSchema, type RegisterSchemaType } from "../schema";

import FormField from "../components/FormField";
import SubmitBtn from "../components/SubmitBtn";
import AuthCard from "../components/AuthCard";

export default function RegisterPage() {
  // const [loading, setLoading] = useState(false);
  // const setTokens = useAuthStore((state) => state.setTokens); // zustand
  // const navigate = useNavigate();
  const registerMutaion = useRegisterMutation();
  console.log("heheheh");
  const {
    register, //function để đăng ký những cái input với RHF
    handleSubmit, // dùng để submit
    formState: {
      errors,
      isSubmitting, // làm hiệu ứng
    }, // trạng thái của form
  } = useForm<RegisterSchemaType>({
    // mode : khi nào validate
    mode: "onTouched", // khi đụng vào input
    // onSubmit : validate khi bấm submit
    // onChange validate realtime khi gõ
    // onBlur: validate khi rời khỏi field
    // resolver: kết nối Zod schema với RHF
    resolver: zodResolver(registerSchema),
    // zodResolver = adapter chuyển Zod validation -> RHF errors format

    // defaulValues : giá trị khởi tạo (optional nhưng recommended)
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    // sử dụng mutation thay vì gọi API trực tiếp
    // mutation sẽ tự động gọi handle success/ error status
    registerMutaion.mutate(data);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <AuthCard title="Welcome to Shopping" description="Đăng ký để tiếp tục">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            id="fullName"
            type="text"
            placeholder="Nguyen Van A"
            label="Full Name"
            register={register("fullName")}
            error={errors.fullName}
          />
          <FormField
            id="email"
            type="email"
            placeholder="m@example.com"
            label="Email"
            register={register("email")}
            error={errors.email}
          />
          <FormField
            id="password"
            type="password"
            placeholder="••••••••"
            label="Password"
            register={register("password")}
            error={errors.password}
          />
          <FormField
            id="c_password"
            type="password"
            placeholder="••••••••"
            label="Confirm password"
            register={register("confirmPassword")}
            error={errors.confirmPassword}
          />

          <SubmitBtn
            isPending={registerMutaion.isPending}
            isSubmitting={isSubmitting}
            label="Register"
            pendingLabel="Đang đăng ký..."
          />
        </form>
      </AuthCard>
    </div>
  );
}
