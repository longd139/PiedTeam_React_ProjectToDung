import { useLocation, Navigate, Outlet } from "react-router-dom";

const Logout = () => {
  const token = localStorage.getItem("accessToken");
  const location = useLocation();

  if (token) {
    // localStorage.setItem("accessToken", "");
    localStorage.removeItem("accessToken");

    // 2. có token -> Đá về /login
    // replace: đè lịch sử, state: lưu địa chỉ cũ để quay lại sau
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // 3. Có token -> Cho đi tiếp vào các tầng bên trong
  return <Outlet />;
};

export default Logout;
