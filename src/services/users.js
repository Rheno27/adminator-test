export const getUser = async () => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/public/v2/users`,
        {
            headers: {
                Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
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


export const getUserByEmail = async (name, email) => {
    const response = await fetch(
    `${import.meta.env.VITE_API_URL}/public/v2/users?name=${name}&email=${email}`,
    {
        headers: {
        Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
        },
    }
    );

    const result = await response.json();
    console.log('Fetched Result:', result);

    if (!response.ok) {
        throw new Error(result?.message || 'Failed to fetch user');
    }

    if (!Array.isArray(result) || result.length === 0) {
        throw new Error('User tidak ditemukan!');
    }

    return result[0];
};

export const createUser = async (request) => {
    const formData = new FormData();
    formData.append("name", request.name);
    formData.append("gender", request.gender);
    formData.append("email", request.email);
    formData.append("status", request.status);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/public/v2/users`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
            
        },
        body: JSON.stringify(request),
    });
    console.log("access token", import.meta.env.ACCESS_TOKEN);
    console.log("response", response);

    if (!response.ok) {
        throw new Error(response?.message || "Failed to create user");
    }

    const result = await response.json();
    return {
        userId: result?.data?.id,
        message: result?.message || "User created successfully!",
    };
};

export const updateUser = async (request) => {
    const formData = new FormData();
    formData.append("name", request.name);
    formData.append("email", request.email);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/public/v2/users/${request.id}`, {
        method: "PATCH",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(response?.message || "Failed to update user");
    }

    const result = await response.json();
    return {
        userId: result?.data?.id,
        message: result?.message || "User updated successfully!",
    };
};