import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

interface SubmitBtnType {
  isSubmitting?: boolean;
  isPending: boolean;
  label: string;
  type?: "submit" | "button";
  pendingLabel: string;
  onClicked?: () => void;
}

const SubmitBtn = ({
  isSubmitting,
  isPending,
  label,
  pendingLabel,
  type,
  onClicked,
}: SubmitBtnType) => {
  return (
    <Button
      onClick={onClicked}
      type={type}
      className="w-full"
      disabled={isSubmitting}
    >
      {(isSubmitting || isPending) && <Spinner />}
      {isSubmitting || isPending ? pendingLabel : label}
    </Button>
  );
};

export default SubmitBtn;
