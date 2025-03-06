export const getTest = async () => {
    try {
        const response = await fetch('http://localhost:8080/test', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return { message: 'Failed to fetch data' };
    }
};
