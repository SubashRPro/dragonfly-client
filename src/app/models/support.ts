export interface IAddTicketParams {
  customer_ID: string;
  ticket_Type: string;
  ticket_Category: string;
  ticket_Message: string;
  upload_Support_Document: SupportDocument[];
}

export interface SupportDocument {
  documentType: string;
  fileName: string;
  fileType: string;
  b64String: string;
}

export interface ITicketActivitiesParams {
  ticket_ID: string;
  pageNumber: number;
  numberOfItemPerPage: number;
  timelineFrom: string;
  timelineTo: string;
}
