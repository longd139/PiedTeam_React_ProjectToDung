import { Toaster } from "@/shared/components/ui/sonner";
import { QueryProvider } from "./providers/QueryProvider";
import { RouterProvider } from "./providers/RouterProvider";
import { ThemeProvider } from "next-themes";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProvider>
        <RouterProvider />
        <Toaster position="top-right" richColors></Toaster>
      </QueryProvider>
    </ThemeProvider>
  );
}
