import { useMutation } from "@tanstack/react-query";
import { ritualApi } from "../services";

const useRitualList = () => {
  return useMutation({
    mutationFn: () => ritualApi.getAllRitual(),
    onSuccess: (res) => {
      console.log(res);
    },
  });
};

export default useRitualList;
