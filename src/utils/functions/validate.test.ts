import { describe, expect, it } from "vitest";
import { z } from "zod";
import validate from "./validate";

describe("validate function", () => {
	it("Should return object with property error if validation fails", () => {
		const obj = { title: "la", size: 1 };
		const schema = z.object({
			title: z.string().min(3),
			size: z.coerce.number().gte(5),
		});

		const result = validate(obj, schema);

		expect(result.data).toStrictEqual({});
		expect(result.errors).lengthOf(2);
		expect(result.errors[0]).toHaveProperty("path");
		expect(result.errors[0]).toHaveProperty("message");
		expect(Array.isArray(result.errors[0].path)).toBe(true);
		expect(result.errors[0].message).toBeTypeOf("string");
	});

	it("Should return object with property data if validation success", () => {
		const obj = { title: "lala", size: 6 };
		const schema = z.object({
			title: z.string().min(3),
			size: z.coerce.number().gte(5),
		});

		const result = validate(obj, schema);

		expect(result.data).toStrictEqual(obj);
		expect(result.errors).lengthOf(0);
	});
});
