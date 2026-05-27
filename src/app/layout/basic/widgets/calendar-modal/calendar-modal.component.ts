import { formatDate } from "@angular/common";
import {
  Component,
  Inject,
  Injector,
  LOCALE_ID,
  OnInit,
  OnChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { dateTimePickerUtil, toDate } from "@delon/util";
import {
  CalendarOptions,
  EventClickArg,
  EventApi,
  FullCalendarComponent,
} from "@fullcalendar/angular";
import { Calendar, DateSelectArg } from "@fullcalendar/core";
import enLocale from "@fullcalendar/core/locales/en-gb";
import zhLocale from "@fullcalendar/core/locales/zh-cn";
import { DateClickArg } from "@fullcalendar/interaction";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";
import {
  AddCalendarEventsParams,
  CalendarEventsParams,
} from "src/app/models/calendar";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-calendar-modal",
  templateUrl: "./calendar-modal.component.html",
  styleUrls: ["./calendar-modal.component.less"],
})
export class CalendarModalComponent implements OnInit {
  @ViewChild("calendar") calendarComponent: FullCalendarComponent | undefined;
  isVisible = false;
  isVisibleItem = false;
  validateForm: FormGroup;
  loading: boolean = false;
  langKey: any = localStorage.getItem("lang");
  calendarOptions!: CalendarOptions;
  public events: any[] = [];
  calendarApi: Calendar | undefined;
  calendarEventsParams: CalendarEventsParams = {} as CalendarEventsParams;
  pageNumber: number = 1;
  numberOfItemPerPage: number = 100;
  listData: any = [];
  initialEvents: any = [];
  isEdit: boolean = false;
  addCalendarEventsParams: AddCalendarEventsParams =
    {} as AddCalendarEventsParams;

  constructor(
    private modal: NzModalService,
    private http: ApiService,
    private injector: Injector,
    private fb: FormBuilder,
    private message: NzMessageService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.validateForm = this.fb.group({
      calendar_Date: [null, [Validators.required]],
      calendar_Events: ["", [Validators.required]],
      calendar_Time: [new Date(), [Validators.required]],
      calendar_Description: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    //  this.getAllCalendarEvents();
    // temporary fixed will change this
    if (localStorage.getItem("lang") === "en-US") {
      this.calendarOptions = {
        locale: enLocale,
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        initialView: "dayGridMonth",
        eventTimeFormat: {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
        weekends: true,
        editable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        eventClick: this.handleEventClick.bind(this),
        eventsSet: this.handleEvents.bind(this),
        dateClick: this.handleDateEvents.bind(this),
      };
    } else {
      this.calendarOptions = {
        locale: zhLocale,
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        },
        initialView: "dayGridMonth",
        eventTimeFormat: {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
        weekends: true,
        editable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        eventClick: this.handleEventClick.bind(this),
        eventsSet: this.handleEvents.bind(this),
        dateClick: this.handleDateEvents.bind(this),
      };
    }
  }

  delCalendar(eventId: string) {
    this.modal.confirm({
      nzTitle: `Are you sure you want to delete event`,
      nzOnOk: () => {
        this.http.deleteCalendarEvent(eventId).subscribe((res) => {
          this.message.success("delete success");
          this.getAllCalendarEvents();
          this.isVisibleItem = false;
        });
      },
    });
  }
  editEventClick(clickInfo: any) {
    this.isVisibleItem = true;
    this.isEdit = true;
    const dateStr = clickInfo.calendar_Date.replace(
      "00:00:00",
      `${clickInfo.calendar_Time}`
    );
    this.addCalendarEventsParams = {
      ...clickInfo,
      calendar_Time: this.formatDateFun(dateStr),
    };
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.isVisibleItem = true;
    this.isEdit = true;
    const res = this.listData.filter(
      (item: any) => item.calendar_ID === clickInfo.event.id
    )[0];
    const dateStr = res.calendar_Date.replace(
      "00:00:00",
      `${res.calendar_Time}`
    );
    this.addCalendarEventsParams = {
      ...res,
      calendar_Time: this.formatDateFun(dateStr),
    };
  }

  handleDateEvents(events: DateClickArg) {
    this.validateForm.reset();
    this.addCalendarEventsParams.calendar_Date = events.dateStr;
    var t = new Date();
    var t_s = t.getTime();
    t.setTime(t_s + 1000 * 60 * 60);
    this.addCalendarEventsParams.calendar_Time = this.formatDateFun(t);
    this.isEdit = false;
    this.isVisibleItem = true;
  }
  formatDateFun(date: any, format: string = "d MMM yyyy h:mm a") {
    return formatDate(date, format, this.locale);
  }
  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: "",
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  currentEvents: EventApi[] = [];

  showModal() {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  handleItemCancel() {
    this.isVisibleItem = false;
  }

  getAllCalendarEvents() {
    this.http
      .getAllCalendarEvents({
        ...this.calendarEventsParams,
        customer_ID: this.tokenSrv.get()?.customer_id,
      })
      .subscribe((res: any) => {
        this.listData = res.data;
        this.initialEvents = res.data.map((item: any) => {
          const dateStr = item.calendar_Date.replace(
            "00:00:00",
            `${item.calendar_Time}`
          );
          return {
            info: { ...item },
            id: item.calendar_ID,
            title: item.calendar_Events,
            start: dateStr,
            description: item.calendar_Description,
            backgroundColor: item.is_Active === 1 ? "#00B5F2" : "#f16b6b",
          };
        });
        this.calendarOptions.events = this.initialEvents;
      });
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      if (this.isEdit) {
        this.editCalendarEvent();
      } else {
        this.addCalendarEvent();
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  addCalendarEvent() {
    this.loading = true;
    this.http
      .addCalendarEvent({
        ...this.validateForm.value,
        calendar_Time: this.formatDateFun(
          this.validateForm.value.calendar_Time,
          "HH:mm:00"
        ),
        customer_ID: this.tokenSrv.get()?.customer_id,
      })
      .subscribe(
        (res) => {
          this.message.success("Save success");
          this.isVisibleItem = false;
          // this.getAllCalendarEvents();
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  editCalendarEvent() {
    this.loading = true;
    this.http
      .updateCalendarEvent({
        ...this.validateForm.value,
        calendar_Time: this.formatDateFun(
          this.validateForm.value.calendar_Time,
          "HH:mm:00"
        ),
        customer_ID: this.tokenSrv.get()?.customer_id,
        calendar_ID: this.addCalendarEventsParams.calendar_ID,
      })
      .subscribe(
        (res) => {
          this.message.success("Update success");
          this.isVisibleItem = false;
          this.getAllCalendarEvents();
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }
}
