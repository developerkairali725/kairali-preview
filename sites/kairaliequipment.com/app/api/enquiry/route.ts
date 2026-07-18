// RFQ lead pipe — store-first (packages/forms spec): the lead is written to our
// own store server-side before any downstream CRM step; the service key never
// reaches the browser. Notification lane: info@kairali.com (LOCKED FACT).
import { enquiryRoute } from "@kairali/forms/route";

export const POST = enquiryRoute();
