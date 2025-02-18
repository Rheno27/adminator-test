export const getComments = async (page = 1, perPage = 50) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/public/v2/comments?page=${page}&per_page=${perPage}`,
        {
            headers: {
                Authorization: `${import.meta.env.VITE_ACCESS_TOKEN}`
            },
        }
    );

    const result = await response.json();
    console.log("Fetched Result:", result);

    if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch comments");
    }

    return result;
};

export const getCommentById = async (id) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/public/v2/comments/${id}`,
        {
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
            },
        }
    );

    const result = await response.json();
    return result;
};
