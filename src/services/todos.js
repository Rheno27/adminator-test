export const getTodos = async (page = 1, perPage = 50) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/public/v2/todos?page=${page}&per_page=${perPage}`,
        {
            headers: {
                Authorization: `${import.meta.env.VITE_ACCESS_TOKEN}`
            },
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch todos");
    }

    return result;
};
