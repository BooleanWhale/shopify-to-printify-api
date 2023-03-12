import fs from "fs";
import { getAllOrders } from './printify-api.js'

export const addToOpenOrders = (shopifyId, printifyId) => {
  const newOrder = { shopifyId: shopifyId, printifyId: printifyId };
  const openOrders = JSON.parse(fs.readFileSync('./openOrders.json'));
  const newOpenOrders = [...openOrders, newOrder]
  fs.writeFileSync('./openOrders.json', JSON.stringify(newOpenOrders), 'utf8'); 
}

// Can accept string or array of strings
export const removeFromOpenOrders = (orderIds) => {
  const openOrders = JSON.parse(fs.readFileSync('./openOrders.json'));
  const newOpenOrders = openOrders.filter(order => {
    if (typeof variable === 'string') {
      return order.printifyId !== orderIds;
    } else {
      return !orderIds.some(orderId => orderId === order.printifyId)
    }
  })
  fs.writeFileSync('./openOrders.json', JSON.stringify(newOpenOrders), 'utf8'); 
}

export const removeAllClosedOrders = async () => {
  const closedStatuses = ['canceled', 'fullfilled'];
  const openPrintifyOrders = await getAllOrders().filter(order => {
    return !closedStatuses.includes(order.status);
  });
  const openOrders = JSON.parse(fs.readFileSync('./openOrders.json'));
  const closedOrders = [];
  const newOpenOrders = openOrders.filter(order => {
    const isOpen = openPrintifyOrders.some(printifyOrder => printifyOrder.id === order.printifyId);
    if (!isOpen) closedOrders.push(order);
    return isOpen;
  })
  fs.writeFileSync('./openOrders.json', JSON.stringify(newOpenOrders), 'utf8');
  return {closedOrders, openOrders: newOpenOrders};
}