import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";

import type { Ritual } from "../type";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
interface CardRitualsProps {
  ritual: Ritual;
}

const CardRituals = ({ ritual }: CardRitualsProps) => {
  const navigate = useNavigate();
  return (
    <>
      <Card
        key={ritual.id}
        className="flex flex-col border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="line-clamp-2 text-sm font-semibold text-slate-900 ">
              {ritual.name}
            </div>
            {ritual.isHot && (
              <span className="rounded-full bg-amber-500 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] shrink-0">
                HOT
              </span>
            )}
          </div>
          <CardDescription>
            <div className="px-0 col-span-5">
              <div className="line-clamp-3 text-sm text-slate-600 ">
                {ritual.description || "Nghi lễ không có mô tả."}
              </div>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 px-6 py-4">
          <div>
            <p>
              <span className="font-bold">Ngày trên:</span> {ritual.dateSolar}
            </p>
            <p>
              <span className="font-bold">Ngày dưới</span>: {ritual.dateLunar}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className=" py-2 px-6 border-2  border-black hover:text-white hover:bg-black"
            title="Xem chi tiết"
            onClick={() => navigate(`/ritual/${ritual.id}`)}
          >
            VIEW
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className=" py-2 px-6 border-2  border-black bg-black text-white hover:border-transparent "
            title="Chỉnh sửa"
            onClick={() => navigate(`/admin/rituals/${ritual.id}/edit`)}
          >
            Edit
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default CardRituals;
