// TODO: add a /help .get that returns a json of [...{name,endpoint,description}]

import express from "express";
import fs from "fs";
import { stockCheck, createOrder, getOrderInfo, getAllOrders } from './printify-api.js';
import { addToOpenOrders, removeAllClosedOrders } from './openOrders.js'

const app = express();
const PORT = 8080;

app.use(express.json())
app.listen(PORT, () => console.log(`live on ${PORT}`));

const checkOrders = () => {
  console.log('Auto checking orders');
  
  setInterval(async () => {
    console.log('getting order info');
    const ordersInfo = await getAllOrders();
    console.log(ordersInfo.data.length);
  }, 1000 * 5);
}

checkOrders();

app.get('/open-order-status', async (request, response) => {
  const openOrders = JSON.parse(fs.readFileSync('./openOrders.json'));
  const closedStatuses = ['canceled', 'fullfilled'];

  const checkedOrders = await Promise.all(openOrders.map(async openOrder => {
    const order = await getOrderInfo(openOrder.printifyId);
    return { status: order.status, printifyId: order.id }
  }))

  const stillOpenOrders = openOrders.filter(order => {
    const status = checkedOrders.find(checkedOrder => checkedOrder.printifyId === order.printifyId).status;
    return !closedStatuses.includes(status);
  });

  response.status(200).send({
    openOrders: stillOpenOrders
  });
});


app.post('/create-order', (request, response) => {
  createOrder(request.body)
  .then(data => {
    console.log('Success:', data);
    response.status(200).send({
      orderDetails: data
    });
  });
});


app.post('/stock-check', (request, response) => {
  const { bluprintId, printProviderId, variantId } = request.body;

  stockCheck(bluprintId, printProviderId, variantId)
  .then(data => {
    response.status(200).send({
      ...data
    });
  })
  .catch((error) => {
    response.status(200).send({
      error: error
    });
  });
});


app.post('/create-order-with-stock-check', async (request, response) => {
  const shopifyId = request.body.external_id
  const lineItems = request.body.line_items;

  const checkedStock = await Promise.all(lineItems.map(async item => {
    const { blueprint_id, print_provider_id, variant_id } = item;
    const itemStock = await stockCheck(blueprint_id, print_provider_id, variant_id);
    return { blueprint_id, variant_id, inStock: itemStock.inStock }
  }))

  const outOfStockItems = checkedStock.filter(item => !item.inStock);

  if (outOfStockItems.length !== 0) {
    response.status(200).send({
      error: 'Some items not in stock',
      items: outOfStockItems
    });
  } else {
    createOrder(request.body)
    .then(data => {
      addToOpenOrders(shopifyId, data.id);
      response.status(200).send({
        orderDetails: data,
        items: checkedStock
      });
    });
  }
});