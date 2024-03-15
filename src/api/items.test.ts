import { describe, expect, vi, it, Mocked } from "vitest";
import { createItem, deleteItem, getAllItems, updateItem } from "./items";
import axiosInstance from "./api-client";

vi.mock("./api-client");
const mockedAxios = axiosInstance as Mocked<typeof axiosInstance>;

describe("get all items function", () => {
	it("should return items", async () => {
		const mockTest = [{ title: "asd", size: 6, id: "6" }];
		mockedAxios.get.mockResolvedValueOnce({
			data: mockTest,
		});

		const result = await getAllItems(undefined);

		expect(result).toBe(mockTest);
	});
});

describe("create item function", () => {
	it("should return created item", async () => {
		const mockTest = { title: "asd", size: 6 };
		mockedAxios.post.mockResolvedValueOnce({
			data: { ...mockTest, id: 6 },
		});

		const result = await createItem(mockTest);

		expect(result).toStrictEqual({ ...mockTest, id: 6 });
	});
});

describe("update item function", () => {
	it("should return updated items", async () => {
		const mockTestItem = { title: "asd", size: 6, id: "6" };
		const mockTest = { title: "asdoo", size: 6 };
		mockedAxios.patch.mockResolvedValueOnce({
			data: { ...mockTestItem, ...mockTest },
		});

		const result = await updateItem(mockTestItem, mockTest);

		expect(result).toStrictEqual({ ...mockTestItem, ...mockTest });
	});
});

describe("delete item function", () => {
	it("should return deleted item", async () => {
		const mockTest = { title: "asdoo", size: 6, id: "6" };
		mockedAxios.delete.mockResolvedValueOnce(mockTest.id);

		const result = await deleteItem(mockTest);

		expect(result).toStrictEqual(mockTest.id);
	});
});
