import { useRitualCatalog } from "../hooks/useRitualCatalog";
import { ErrorState } from "@/shared/components/common/ErrorState";
import { EmptyState } from "@/shared/components/common/EmptyState";
import CardRituals from "../components/CardRituals";
import { LoadingState } from "@/shared/components/common/LoadingState";
import RitualsTitleList from "../components/RitualsTitleList";
import { Pagination } from "@/shared/components/common/Pagination";
import { useEffect, useState } from "react";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import useDebounce from "@/shared/hooks/useDebounce";

const RitualCatalog: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [hot, setHot] = useState<boolean | undefined>(undefined);
  const debounceSearch = useDebounce(search, 500);
  const { rituals, isLoading, pagination, isError, refetch, error } =
    useRitualCatalog({ page: page, search: debounceSearch, isHot: hot });

  // if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;
  // if (rituals.length === 0) return <EmptyState />;

  const handleisHot = (item: string | undefined) => {
    if (item === "true") setHot(true);
    else if (item === "false") setHot(false);
    else setHot(undefined);
  };
  const handlePageChange = (page: number) => {
    setPage(page);
  };
  const items = [
    { label: "true", value: "true" },
    { label: "false", value: "false" },
    { label: "--", value: "undefined" },
  ];
  return (
    <>
      <RitualsTitleList title="Danh sách lễ">
        <div>
          <div className="flex">
            <Input
              placeholder="find name"
              onChange={(e) => setSearch(e.target.value)}
            />
            {/* <Button type="button" onClick={handleFind}>
              Find
            </Button> */}
          </div>

          <Select onValueChange={(value) => handleisHot(value)}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="isHot" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>is Hot</SelectLabel>
                {items.map((item) => (
                  <SelectItem key={item.label} value={item.value + ""}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <br></br>
        {isLoading ? (
          <LoadingState />
        ) : rituals.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {rituals.map((ritual) => (
                <CardRituals ritual={ritual} />
              ))}
            </div>
            {pagination && (
              <Pagination
                meta={pagination}
                onPageChange={handlePageChange}
                className="mt-8"
              />
            )}
          </>
        )}
      </RitualsTitleList>
    </>
  );
};

export default RitualCatalog;
