import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, { message: "Nhập FullName vào dm !" })
      .min(3, { message: "Tên dưới 2 chữ à !" }),
    email: z
      .email({ message: "Không biết Email là gì à!" })
      .min(1, { message: "nhập email vào DM !" }),
    password: z
      .string()
      .min(1, { message: "Nhập password vào DM " })
      .min(6, { message: "Password phải có ít nhất 6 ký tự" })
      .regex(/[A-Z]/, "Thêm chữ in hoa vào DM !")
      .regex(/[0-9]/, "Thêm số vào DM !")
      .regex(/[!@#$%^&*]/, "Thêm ký tự đặc biệt vào DM !"),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    // custom validation cho cả object
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp vui lòng nhập lại !",
        path: ["confirmPassword"], // Gán lỗi vào trường này
      });
    }
  });
export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const LoginSchema = z.object({
  email: z
    .email({ message: "Gõ email vào DM" })
    .min(1, { message: "nhập email vào DM !" }),
  password: z.string().min(1, { message: "Nhập password vào DM " }),
});
export type LoginSchemaType = z.infer<typeof LoginSchema>;
