import { getAllItems } from "@/api/items";
import { CACHE_KEY_ITEMS } from "@/features/Item/consts";
import { Item } from "@/features/Item/types/types";
import { useQuery } from "@tanstack/react-query";

const useItems = (pageSize: number) => {
	return useQuery<Item[], Error>({
		queryKey: [CACHE_KEY_ITEMS],
		queryFn: () =>
			getAllItems({
				params: {
					limit: pageSize,
				},
			}),
	});
};

export default useItems;
