import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_ITEMS } from "@/features/Item/consts";
import { Item } from "@/features/Item/types/types";
import { deleteItem } from "@/api/items";
import useToast from "./useToast";

const useDeleteItem = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (item: Item) => deleteItem(item),

		onMutate: (item: Item) => {
			const items = queryClient.getQueryData<Item[]>([CACHE_KEY_ITEMS]) || [];
			const index = items.findIndex((itemToFind) => itemToFind.id === item.id);
			const newItems = [...items];
			newItems.splice(index, 1);

			queryClient.setQueryData<Item[]>([CACHE_KEY_ITEMS], () => newItems);

			return { previousItems: [...items] };
		},

		onError: (_error, newItem, context) => {
			if (!context) return;
			toast.error(`something wrong with deleting item: ${newItem.title}`);
			queryClient.setQueryData<Item[]>(
				[CACHE_KEY_ITEMS],
				context.previousItems,
			);
		},
	});
};

export default useDeleteItem;
