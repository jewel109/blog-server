import { Client } from "@elastic/elasticsearch";
import { elasticSearchUri } from "./configUtils";
import { NotificationI } from "../core/doamin/model/notificationModel";

const client = new Client({ node: elasticSearchUri })
export async function indexNotification(notification: NotificationI) {
  try {
    const response = await client.index({
      index: 'notifications',  // Name of the index
      document: notification,   // Notification object to index
    });
    console.log('Notification indexed:', response);
  } catch (error) {
    console.error('Error indexing notification:', error);
  }
}
