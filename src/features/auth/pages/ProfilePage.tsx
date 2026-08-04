import { useUser } from "../hooks/useUser";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { TwinOrbit } from "@/shared/components/loading-ui/twin-orbit";
import AuthCard from "../components/AuthCard";
import SubmitBtn from "../components/SubmitBtn";

export default function ProfilePage() {
  const {
    data: user,
    isLoading, // true = lần đầu fetch, chưa có data
    // isError, // true = fetch bị lỗi
    error, // là biến/ object chứa cái lỗi đó
    refetch, // gọi lại query function để fetch lại manually
    isFetching, // True = đang fetch (dù có data hay ko) khi có
  } = useUser();
  // STATE 1: LOADING (lần đầu load)
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <TwinOrbit className="size-4.5" />
      </div>
    );

  // STATE 2: ERROR
  if (error)
    return (
      <ErrorState
        message={error?.message}
        onRetry={() => refetch()}
      ></ErrorState>
    );

  // STATE 3: EMPTY
  // if (!user) {
  //   return <div>Ko có gì !!!</div>;
  // }
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <AuthCard title="My Profile" description="Thông tin tài khoản của bạn">
        <p>
          Chào mừng <b>{user?.fullName}</b> đã trở lại!
        </p>
        <p>
          Email: <b>{user?.email}</b>
        </p>
        <br />
        <SubmitBtn
          onClicked={() => refetch()}
          type="button"
          isPending={isFetching}
          label="Refresh"
          pendingLabel="Đang refresh ..."
        />
      </AuthCard>
    </div>
  );
}
