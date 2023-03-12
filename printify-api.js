const printifyApiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjUyZDk4M2M2NmRjYjZiMjNmN2UwMDdjZWJjNThhNDk2ZWM5OGI4NWRmYmJiYTUzOWY5YmQ1NGYxM2IzM2MwZjk4MzcwNDY2MzNjOGNkYWFmIiwiaWF0IjoxNjU4MzEzNjUxLjUxOTk2MiwibmJmIjoxNjU4MzEzNjUxLjUxOTk2NCwiZXhwIjoxNjg5ODQ5NjUxLjQ3MzA4Niwic3ViIjoiNTgwMjM1NiIsInNjb3BlcyI6WyJzaG9wcy5tYW5hZ2UiLCJzaG9wcy5yZWFkIiwiY2F0YWxvZy5yZWFkIiwib3JkZXJzLnJlYWQiLCJvcmRlcnMud3JpdGUiLCJwcm9kdWN0cy5yZWFkIiwicHJvZHVjdHMud3JpdGUiLCJ3ZWJob29rcy5yZWFkIiwid2ViaG9va3Mud3JpdGUiLCJ1cGxvYWRzLnJlYWQiLCJ1cGxvYWRzLndyaXRlIiwicHJpbnRfcHJvdmlkZXJzLnJlYWQiXX0.AiNoHNTlGiWjAdbYNRybzL_nUZVaMVjna-4MMwn8wDZh-o6XuW5Riy7fWT3GHyfp6strYh7LeDTI2zywD7w';
const shopId = '4848266';
const printifyBaseUrl = 'https://api.printify.com/v1';


export const stockCheck = async (bluprintId, printProviderId, variantId) => {
  return await fetch(`${printifyBaseUrl}/catalog/blueprints/${bluprintId}/print_providers/${printProviderId}/variants.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${printifyApiKey}`,
      'show-out-of-stock': 0,
    }
  })
  .then(response => {
    if (!response.ok) throw response.status;
    return response.json();
  })
  .then(data => {
    console.log(data)
    const inStock = data.variants.some(variant => variant.id == variantId);
    return { inStock: inStock, availableVariants: data };
  })
  .catch((error) => {
    return { error: error };
  });
}


export const createOrder = async (body) => {
  return await fetch(`${printifyBaseUrl}/shops/${shopId}/orders.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${printifyApiKey}`
    },
    body: JSON.stringify(body),
  })
  .then(response => {
    if (!response.ok) throw response.status;
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    return data;
  })
  .catch((error) => {
    return { error: error };
  });
}


export const getOrderInfo = async (orderId) => {
  return await fetch(`${printifyBaseUrl}/shops/${shopId}/orders/${orderId}.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${printifyApiKey}`
    }
  })
  .then(response => {
    if (!response.ok) throw response.status;
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    return data;
  })
  .catch((error) => {
    return { error: error };
  });
}


export const getAllOrders = async () => {
  return await fetch(`${printifyBaseUrl}/shops/${shopId}/orders.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${printifyApiKey}`
    }
  })
  .then(response => {
    if (!response.ok) throw response.status;
    return response.json();
  })
  .then(data => {
    // console.log('Success:', data);getAllOrders
    return data;
  })
  .catch((error) => {
    return { error: error };
  });
}