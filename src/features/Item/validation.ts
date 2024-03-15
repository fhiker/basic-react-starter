import * as zod from "zod";

const createItemSchema = zod.object({
	title: zod.string().min(3),
	size: zod.coerce.number().gte(5),
});

const updateItemSchema = zod.object({
	title: zod.string().min(3),
	size: zod.coerce.number().gte(5),
});

export { createItemSchema, updateItemSchema };
