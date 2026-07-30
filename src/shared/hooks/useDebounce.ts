import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: 500): T {
  // T : nhận vào bất kỳ type nào và trả ra chính hành động bị delay đó
  const [debounce, setDebounce] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounce(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]); // dependence: effect chạy lại khi value hoặc delay thay đổi
  return debounce;
}
export default useDebounce;
