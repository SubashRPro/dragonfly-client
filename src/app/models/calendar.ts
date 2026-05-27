export interface CalendarEventsParams {
  customer_ID: string;
  pageNumber: number;
  numberOfItemPerPage: number;
  timelineFrom: string;
  timelineTo: string;
  status: number;
}

export interface AddCalendarEventsParams {
  calendar_ID?: string;
  customer_ID: string;
  calendar_Date: string;
  calendar_Time: string;
  calendar_Events: string;
  calendar_Description: string;
  is_Active?: number;
}
