/* eslint-disable */
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

import useDebounce from "@/shared/hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

const RitualCatalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  // const [hot, setHot] = useState<boolean | undefined>(undefined);
  const debounceSearch = useDebounce(search, 500);
  const { rituals, isLoading, pagination, isError, refetch, error } =
    useRitualCatalog({
      page: Number(searchParams.get("page") || 1),
      search: searchParams.get("search") || undefined,
      isHot: Boolean(searchParams.get("isHot")),
      limit: Number(searchParams.get("limit") || 10),
    });

  if (isError) return <ErrorState message={error?.message} onRetry={refetch} />;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    // set (key, value)
    setSearchParams(params);
  };
  const items = [
    { label: "Tất cả", value: "all" },
    { label: "true", value: "true" },
    { label: "false", value: "false" },
  ];
  const handleFilterChange = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // vì phân trang là bước cuối cùng
    setSearchParams(params);
  };
  useEffect(() => {
    if (debounceSearch !== searchParams.get(search)) {
      const params = new URLSearchParams(searchParams);
      if (debounceSearch) {
        params.set("search", debounceSearch);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      setSearchParams(params);
    }
  }, [debounceSearch]);
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

          <Select
            value={searchParams.get("isHot") || "all"}
            onValueChange={(value) =>
              handleFilterChange("isHot", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="isHot" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>is Hot</SelectLabel>
                {items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
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
