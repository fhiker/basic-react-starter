import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_ITEMS } from "@/features/Item/consts";
import { Item } from "@/features/Item/types/types";
import { updateItem } from "@/api/items";
import useToast from "./useToast";

const useUpdateItem = () => {
	const queryClient = useQueryClient();

	const toast = useToast();

	return useMutation({
		mutationFn: (data: { item: Item; data: Omit<Partial<Item>, "id"> }) =>
			updateItem(data.item, data.data),

		//OPRIMISTIC UPDATES

		onMutate: (data: { item: Item; data: Omit<Partial<Item>, "id"> }) => {
			const items = queryClient.getQueryData<Item[]>([CACHE_KEY_ITEMS]) || [];
			const previousItems = [...items];
			const index = items.findIndex((item) => item.id === data.item.id);

			// create new item from old one, overwriting only fields that are present in data.data
			const updatedItem = {
				...items[index],
				...data.data,
			};

			// Don't modify the existing "items" array BUT create new one which then will be compared with old one for re-render
			const newItems = items?.map((item) =>
				item.id === data.item.id ? updatedItem : item,
			);

			queryClient.setQueryData<Item[]>([CACHE_KEY_ITEMS], () => newItems);

			return { previousItems: previousItems };
		},

		onSuccess: (savedItem) => {
			//OPTIMISTIC UPDATES ON SUCCESS
			const items = queryClient.getQueryData<Item[]>([CACHE_KEY_ITEMS]) || [];

			queryClient.setQueryData<Item[]>([CACHE_KEY_ITEMS], () => {
				return items?.map((item) =>
					item.id === savedItem.id ? savedItem : item,
				);
			});

			return savedItem;
		},

		//OPTIMISTIC UPDATES ERROR ROLLBACK

		onError: (_error, _newItem, context) => {
			if (!context) return;
			queryClient.setQueryData<Item[]>(
				[CACHE_KEY_ITEMS],
				context.previousItems,
			);
			toast.error("There was an error saving the changes to database!");
		},
	});
};

export default useUpdateItem;
