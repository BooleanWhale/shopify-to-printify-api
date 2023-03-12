const printifyApiKey = 'YOUR_PRINTIFY_KEY'
const shopId = 'YOUR_PRINTIFY_SHOP_ID';
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
