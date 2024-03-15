import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_ITEMS } from "@/features/Item/consts";
import { createItem } from "@/api/items";
import { createItemSchema } from "@/features/Item/validation";
import { z } from "zod";

const useCreateItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: z.infer<typeof createItemSchema>) => createItem(data),

		//OPRIMISTIC UPDATES

		// onMutate: (newItem: Item) => {
		// 	const previousItems =
		// 		queryClient.getQueryData<Item[]>([CACHE_KEY_ITEMS]) || [];

		// 	queryClient.setQueryData<Item[]>([CACHE_KEY_ITEMS], (items = []) => [
		// 		newItem,
		// 		...items,
		// 	]);

		// 	return { previousItems };
		// },

		onSuccess: (savedItem, newItem) => {
			console.log("SUCCESS");
			queryClient.resetQueries({
				queryKey: [CACHE_KEY_ITEMS],
			});

			//OPTIMISTIC UPDATES ON SUCCES

			// queryClient.setQueryData<Item[]>([CACHE_KEY_ITEMS], (items) =>
			// items?.map((item) =>
			//   item === savedItem ? savedItem : item
			// )
			//   );
		},

		//OPTIMISTIC UPDATES ERROR ROLLBACK

		// onError: (error, newItem, context) => {
		// 	if (!context) return;

		// 	queryClient.setQueryData<Item[]>(
		// 		[[CACHE_KEY_ITEMS]],
		// 		context.previousItems,
		// 	);
		// },
	});
};

export default useCreateItem;
