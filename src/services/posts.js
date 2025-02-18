export const getPosts = async (page = 1, perPage = 50) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/public/v2/posts?page=${page}&per_page=${perPage}`,
        {
            headers: {
                Authorization: `${import.meta.env.VITE_ACCESS_TOKEN}`,
            },
        }
    );

    const result = await response.json();
    console.log("Fetched Result:", result);

    if (!response.ok) {
        throw new Error(result?.message || "Failed to fetch posts");
    }

    return result;
};

export const getPostById = async (id) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/public/v2/posts/${id}`,
        {
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
            },
        }
    );

    const result = await response.json();
    return result;
};

export const createPost = async (request) => {
    const formData = new FormData();
    formData.append("title", request.title);
    formData.append("body", request.body);

    const userId = encodeURIComponent(request.user_id);

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/public/v2/users/${userId}/posts`,
        {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
            },
            body: formData,
        }
    );

    const result = await response.json();
    console.log("Fetched Result:", result);

    if (!response.ok) {
        throw new Error(result?.message || 'Failed to create post');
    }

    return result;
};




