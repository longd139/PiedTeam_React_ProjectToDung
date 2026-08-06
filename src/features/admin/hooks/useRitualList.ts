import { useMutation } from "@tanstack/react-query";
import { ritualApi } from "../services";

const useRitualList = () => {
  return useMutation({
    mutationFn: () => ritualApi.getAllRitual(),
  });
};

export default useRitualList;
