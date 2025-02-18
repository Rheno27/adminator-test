export const getComments = async () => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/public/v2/comments`,
        {
            headers: {
                Authorization: `${import.meta.env.VITE_ACCESS_TOKEN}`
            },
        }
    );

    const result = await response.json();
    console.log("Fetched Result:", result);

    if (!response.ok) {
        throw new Error(result?.message);
    }

    return result;
};
