import { AxiosRequestConfig } from "axios";
import axiosInstance from "./api-client";
import { createItemSchema, updateItemSchema } from "@/features/Item/validation";
import { z } from "zod";
import { Item } from "@/features/Item/types/types";

async function getAllItems(
	config: AxiosRequestConfig<unknown> | undefined,
): Promise<Item[]> {
	return axiosInstance.get("items", config).then((res) => res.data);
}

async function createItem(
	data: z.infer<typeof createItemSchema>,
): Promise<Item> {
	const validatedData = createItemSchema.parse(data);
	return axiosInstance.post("items", validatedData).then((res) => res.data);
}
async function updateItem(
	item: Item,
	data: Omit<Partial<Item>, "id">,
): Promise<Item> {
	const validatedData = updateItemSchema.parse(data);
	return axiosInstance
		.patch(`items/${item.id}`, validatedData)
		.then((res) => res.data);
}

async function deleteItem(item: Item): Promise<string> {
	return axiosInstance.delete(`items/${item.id}`);
}

export { getAllItems, createItem, updateItem, deleteItem };
