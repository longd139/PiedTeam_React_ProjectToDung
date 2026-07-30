# 📚 Nhật Ký Học Tập: React + TypeScript + Vite

> **Dự án:** projectToDung
> **Ngày bắt đầu:** 30/07/2026
> **Stack:** React 19 · TypeScript 5.9 · Vite 8 · Tailwind CSS v4 · shadcn/ui

---

## Mục Lục

1. [Cấu Trúc Dự Án](#1-cấu-trúc-dự-án)
2. [TypeScript Nâng Cao](#2-typescript-nâng-cao)
3. [State Management](#3-state-management)
4. [Routing & Guards](#4-routing--guards)
5. [Forms & Validation](#5-forms--validation)
6. [API Integration](#6-api-integration)
7. [Authentication Flow](#7-authentication-flow)
8. [UI & Styling](#8-ui--styling)
9. [Custom Hooks](#9-custom-hooks)
10. [Xử Lý Trạng Thái Bất Đồng Bộ](#10-xử-lý-trạng-thái-bất-đồng-bộ)
11. [Ghi Chú & Câu Hỏi](#11-ghi-chú--câu-hỏi)

---

## 1. Cấu Trúc Dự Án

### Feature-based Architecture

Dự án tổ chức theo **feature** (tính năng), không phải theo loại file. Đây là pattern phổ biến cho dự án vừa và lớn:

```
src/
├── app/              # Cấu hình ứng dụng (router, providers, store)
├── features/         # Mỗi feature là một module độc lập
│   ├── auth/         #   - types, services, hooks, components, pages riêng
│   ├── admin/
│   └── ritual/
└── shared/           # Code dùng chung giữa các feature
    ├── components/   #   - ui/ (shadcn), common/ (guard, state components)
    ├── hooks/        #   - useDebounce
    ├── layouts/      #   - MainLayout, AdminLayout
    ├── services/     #   - BaseService (generic CRUD factory)
    └── types/        #   - Shared types (UserRole, PaginatedResponse...)
```

> **💡 Ghi nhớ:** Feature-based giúp code dễ mở rộng, mỗi feature đóng gói mọi thứ nó cần. Khi cần xóa một feature, chỉ cần xóa folder của nó.

---

## 2. TypeScript Nâng Cao

### 2.1 Generic Type Factory

File `src/shared/services/BaseService.ts` demo một factory function với **4 type parameters**:

```typescript
// TEntity, TCreateDto, TUpdateDto, TFilterParams đều là generic
export function createBaseService<
  TEntity,
  TCreateDto = Partial<TEntity>,
  TUpdateDto = Partial<TEntity>,
  TFilterParams = Record<string, unknown>
>(endpoint: string) {
  return {
    getAll: (params?: TFilterParams) =>
      apiClient.get<PaginatedResponse<TEntity>>(endpoint, { params }),
    getById: (id: string | number) =>
      apiClient.get<TEntity>(`${endpoint}/${id}`),
    create: (data: TCreateDto) =>
      apiClient.post<TEntity>(endpoint, data),
    update: (id: string | number, data: TUpdateDto) =>
      apiClient.put<TEntity>(`${endpoint}/${id}`, data),
    delete: (id: string | number) =>
      apiClient.delete(`${endpoint}/${id}`),
  };
}
```

> **💡 Ghi nhớ:** Generic giúp tạo code tái sử dụng cao. Factory function này một lần viết, dùng cho mọi entity (rituals, users, categories...). `Partial<T>` là utility type tạo tất cả field thành optional.

### 2.2 Zod Schema Inference

```typescript
// Định nghĩa schema validation
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Tự động suy ra TypeScript type từ schema
type LoginFormData = z.infer<typeof LoginSchema>;
// → { email: string; password: string }
```

> **💡 Ghi nhớ:** `z.infer` giúp tránh khai báo type trùng lặp — schema là nguồn duy nhất của sự thật (single source of truth).

### 2.3 Discriminated Union Types

```typescript
type UserRole = "user" | "admin";
```

Dùng để giới hạn giá trị hợp lệ, TypeScript sẽ báo lỗi nếu gán giá trị khác.

### 2.4 Utility Types đã dùng

| Utility Type | Mô tả | Ví dụ trong dự án |
|---|---|---|
| `Partial<T>` | Tất cả field thành optional | `UpdateRitualDto = Partial<CreateRitualDto>` |
| `Record<K, V>` | Object type với key K, value V | `Record<string, unknown>` cho filter params |
| `React.ComponentProps<"button">` | Lấy type props của element HTML | Kết hợp với `VariantProps` cho Button |

---

## 3. State Management

### 3.1 Hai Loại State

Dự án dùng **2 thư viện** cho 2 loại state khác nhau:

| Loại State | Thư viện | Dùng cho |
|---|---|---|
| **Client State** | Zustand | Auth token, user role (lưu localStorage) |
| **Server State** | TanStack React Query | Dữ liệu từ API (rituals, categories, user info) |

> **💡 Ghi nhớ:** Client state là state "sở hữu" bởi client (auth, theme, UI). Server state là bản cache của dữ liệu server — React Query lo việc fetch, cache, refetch, stale cho mình.

### 3.2 Zustand với Middleware

```typescript
// src/features/auth/store.ts
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        accessToken: null,
        role: null,
        setAuth: (token, role) => set({ accessToken: token, role }),
        logout: () => set({ accessToken: null, role: null }),
      }),
      { name: "auth-storage" } // key trong localStorage
    ),
    { name: "AuthStore" } // tên trong Redux DevTools
  )
);
```

- `persist`: tự động lưu vào localStorage, khi reload trang vẫn giữ token
- `devtools`: debug được với Redux DevTools extension

### 3.3 React Query Configuration

```typescript
// src/lib/queryClient.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 phút mới coi là "cũ"
      gcTime: 30 * 60 * 1000,        // 30 phút mới xóa cache
      retry: 2,                       // Thử lại 2 lần nếu fail
      refetchOnWindowFocus: false,    // Không refetch khi focus lại tab
    },
  },
});
```

> **💡 Ghi nhớ:** `staleTime` vs `gcTime` — stale là "cũ, cần fetch lại", gc (garbage collect) là "xóa hẳn khỏi bộ nhớ". `staleTime < gcTime` luôn đúng.

---

## 4. Routing & Guards

### 4.1 Router Setup

Dùng `createBrowserRouter` (React Router v7) với nested routes:

```typescript
// src/app/router.tsx
const router = createBrowserRouter([
  {
    element: <MainLayout />,  // Layout chứa navbar + footer
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/rituals", element: <RitualCataLog /> },
      {
        path: "/login",
        element: <GuestRoute><LoginPage /></GuestRoute>
      },
      {
        path: "/profile",
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
      },
      {
        path: "/admin",
        element: <ProtectedRoute allowedRole={["admin"]}><AdminLayout /></ProtectedRoute>,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "rituals", element: <ManageRitualList /> },
        ],
      },
    ],
  },
]);
```

### 4.2 Route Guards

Hai loại guard trong dự án:

| Guard | Mục đích | Logic |
|---|---|---|
| `ProtectedRoute` | Chỉ cho user đã login | Kiểm tra token → nếu không có → redirect `/login` |
| `GuestRoute` | Chỉ cho user CHƯA login | Kiểm tra token → nếu có rồi → redirect `/` |

**Role-based access** được tích hợp trong `ProtectedRoute` — truyền `allowedRole={["admin"]}` để giới hạn quyền.

> **💡 Ghi nhớ:** Guard pattern dùng `<Outlet />` hoặc wrapper component. Trong dự án này, `ProtectedRoute` và `GuestRoute` là wrapper components (render `children` nếu pass, nếu không thì `<Navigate to="..." />`).

---

## 5. Forms & Validation

### 5.1 Stack Form

```
react-hook-form (quản lý form state)
    + @hookform/resolvers (kết nối với Zod)
        + zod (schema validation)
```

### 5.2 Ví dụ Form Đăng Ký

```typescript
// Schema (src/features/auth/schema.ts)
const RegisterSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Phải có ít nhất 1 chữ hoa")
    .regex(/[0-9]/, "Phải có ít nhất 1 chữ số")
    .regex(/[^A-Za-z0-9]/, "Phải có ít nhất 1 ký tự đặc biệt"),
  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  // Custom validation: kiểm tra 2 password khớp nhau
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Mật khẩu không khớp",
      path: ["confirmPassword"],
    });
  }
});
```

```typescript
// Component
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  resolver: zodResolver(RegisterSchema),
  mode: "onTouched", // Validate khi blur khỏi field
});
```

### 5.3 Các Validation Mode

| Mode | Validate khi nào |
|---|---|
| `onSubmit` | Chỉ khi submit (mặc định) |
| `onBlur` | Khi blur khỏi field |
| `onTouched` | Sau khi blur lần đầu, validate mỗi khi thay đổi |
| `onChange` | Validate ngay khi gõ |
| `all` | Validate cả onSubmit + onBlur |

> **💡 Ghi nhớ:** `superRefine` cho phép validate logic phức tạp liên quan đến nhiều field (cross-field validation).

---

## 6. API Integration

### 6.1 Axios Instance với Interceptors

```typescript
// src/lib/apiClient.ts

// Request Interceptor: Gắn token vào mọi request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Xử lý lỗi 401 + refresh token
apiClient.interceptors.response.use(
  (response) => response.data.data, // Unwrap data
  async (error) => {
    if (error.response?.status === 401) {
      // Cơ chế queue: gom các request bị 401 cùng lúc
      // Gọi refresh token 1 lần, rồi retry tất cả
    }
  }
);
```

### 6.2 Cơ Chế Refresh Token Queue

Khi nhiều request cùng bị 401:
1. Request đầu tiên trigger refresh token
2. Các request sau được đưa vào **hàng đợi** (queue)
3. Khi refresh xong, retry tất cả request trong queue với token mới
4. Nếu refresh thất bại → logout

> **💡 Ghi nhớ:** Queue pattern tránh gọi refresh token nhiều lần cùng lúc, và đảm bảo không request nào bị mất.

### 6.3 Generic CRUD Service

`createBaseService` tạo sẵn các method: `getAll`, `getById`, `create`, `update`, `delete`. Mỗi entity chỉ cần gọi:

```typescript
const ritualService = createBaseService<Ritual, CreateRitualDto>("/rituals");
```

---

## 7. Authentication Flow

### 7.1 Luồng Đăng Nhập

```
Login Form → POST /auth/login → Nhận JWT token
  → Lưu token vào Zustand (persist xuống localStorage)
  → Giải mã JWT bằng jwt-decode để lấy role
  → Redirect: admin → /admin, user → /
```

### 7.2 JWT Decode

```typescript
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;    // user id
  role: string;   // "user" | "admin"
  exp: number;    // expiration time
}

const payload = jwtDecode<JwtPayload>(token);
```

### 7.3 Luồng Đăng Xuất

```
Logout → Xóa token khỏi Zustand store
  → Clear toàn bộ React Query cache (queryClient.clear())
  → Redirect về /login
```

> **💡 Ghi nhớ:** Khi logout phải clear cả **Zustand** (client state) lẫn **React Query cache** (server state) để tránh data cũ hiển thị cho user mới.

---

## 8. UI & Styling

### 8.1 Stack UI

```
Tailwind CSS v4 (utility CSS)
  + shadcn/ui (components build trên Radix UI primitives)
    + Radix UI (headless, accessible UI primitives)
      + CVA (class-variance-authority - variant management)
```

### 8.2 shadcn/ui Components Đã Dùng

- **Button** — 6 variants: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link` + 4 sizes
- **Card** — Compound component: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction`
- **Input** — Với trạng thái `disabled` và `destructive` (lỗi)
- **Label** — Dùng Radix Label primitive (accessibility)
- **Select** — Dropdown chọn (Radix Select)
- **DropdownMenu** — Menu xổ xuống (dùng cho theme toggle)
- **Pagination** — Phân trang
- **Sonner** — Toast notifications (góc phải trên, rich colors)

### 8.3 Dark Mode

Dùng `next-themes` với `ThemeProvider`:

```tsx
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

- `attribute="class"`: toggle class `.dark` trên `<html>`
- `defaultTheme="system"`: theo cài đặt hệ điều hành
- CSS variables dùng OKLCH color space (hiện đại, màu sắc chính xác hơn RGB/HSL)

### 8.4 cn() Utility

```typescript
// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- `clsx`: nối class có điều kiện
- `twMerge`: giải quyết xung đột Tailwind (class sau ghi đè class trước)

---

## 9. Custom Hooks

### 9.1 useDebounce

```typescript
// src/shared/hooks/useDebounce.ts
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Cleanup
  }, [value, delay]);

  return debouncedValue;
}
```

> **💡 Ghi nhớ:** Generic `<T>` cho phép hook dùng với mọi kiểu dữ liệu. Luôn cleanup timer trong `useEffect` để tránh memory leak.

### 9.2 Các Hook React Query

| Hook | Pattern | Mục đích |
|---|---|---|
| `useUser` | `useQuery({ queryKey: ["user"], queryFn })` | Fetch thông tin user hiện tại |
| `useRitualCatalog` | `useQuery({ queryKey, queryFn })` | Fetch danh sách rituals có filter + pagination |
| `useRitualDetail` | `useQuery({ queryKey, queryFn, enabled: !!id })` | Fetch 1 ritual, chỉ chạy khi có id |
| `useRitualCategories` | `useQuery({ queryKey: ["categories"], queryFn })` | Fetch danh sách categories |
| `useLogin` / `useRegister` | `useMutation({ mutationFn, onSuccess, onError })` | Gửi form login/register |
| `useLogout` | `useMutation({ mutationFn, onSuccess })` | Đăng xuất |

> **💡 Ghi nhớ:** `enabled: !!id` ngăn query chạy khi id là `undefined` (tránh request lỗi). Đây là pattern quan trọng với detail page.

---

## 10. Xử Lý Trạng Thái Bất Đồng Bộ

### 10.1 Pattern 3 State Components

Dự án dùng 3 component chuyên biệt để xử lý mọi trạng thái async:

```tsx
// ProfilePage.tsx
if (isLoading) return <LoadingState />;
if (isError)   return <ErrorState message={error.message} onRetry={refetch} />;
if (!data)     return <EmptyState />;
return <div>{/* UI chính */}</div>;
```

| Component | Khi nào dùng | Props chính |
|---|---|---|
| `LoadingState` | Đang fetch | (tự động hiển thị spinner) |
| `ErrorState` | Fetch thất bại | `message`, `onRetry` |
| `EmptyState` | Fetch thành công nhưng không có data | (hiển thị "No data found") |

> **💡 Ghi nhớ:** Luôn xử lý cả 3 trạng thái: loading, error, empty. Thiếu 1 trong 3 là bug UI.

### 10.2 Submit Button với Loading State

```tsx
<SubmitBtn isLoading={isSubmitting}>
  {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
</SubmitBtn>
```

Button tự disable và hiển thị spinner khi đang submit (tránh double submit).

---

## 11. Ghi Chú & Câu Hỏi

### Điểm cần tìm hiểu thêm

- [ ] `useMemo` và `useCallback` — dự án chưa dùng, khi nào cần tối ưu với 2 hook này?
- [ ] `React.lazy` và `Suspense` — code splitting cho các trang
- [ ] `AbortController` — hủy request khi component unmount
- [ ] React 19 features mới (useOptimistic, useActionState...)
- [ ] `BaseServicesP.ts` khác gì với `BaseService.ts`? Có phải bản đang phát triển?

### Best Practices Đã Học

1. ✅ **Không gọi API trực tiếp trong component** — dùng custom hook React Query
2. ✅ **Tách biệt Client State và Server State** — Zustand vs React Query
3. ✅ **Schema validation là single source of truth** — Zod + z.infer
4. ✅ **Generic factory cho CRUD** — viết một lần, dùng nhiều nơi
5. ✅ **Interceptor pattern cho auth** — gắn token tự động, refresh token queue
6. ✅ **3-state async UI** — Loading / Error / Empty luôn được xử lý
7. ✅ **Route guards cho auth** — ProtectedRoute + GuestRoute tách biệt

### Ghi Chú Riêng

<!-- Viết ghi chú của bạn ở đây -->




---

### Tech Stack Tổng Quan

| Layer | Công Nghệ |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Routing | React Router v7 |
| Forms | react-hook-form + Zod |
| Server State | TanStack React Query v5 |
| Client State | Zustand v5 |
| HTTP | Axios |
| Auth | JWT + jwt-decode |
| Theme | next-themes (dark/light) |
| Icons | Lucide React |
| Toast | Sonner |
| Font | Geist Variable |

---

> **Tip:** Mỗi buổi học, ghi thêm ghi chú vào phần [Ghi Chú Riêng](#ghi-chú-riêng) ở trên. Đánh dấu `[x]` vào các mục trong danh sách "cần tìm hiểu thêm" khi đã học xong.
