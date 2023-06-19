import { Fragment, useRef, useState } from "react";
import { data } from "./data";
import FullCalendar from "@fullcalendar/react";
import DatePicker from "react-datepicker";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const [eventsData, setEventsData] = useState(() => {
    return data.map((data) => ({
      id: data.event.id,
      title: `${data.tile.header}<>${[
        data.tile.content[0],
        "-",
        data.tile.content[1],
      ].join(" ")}`,
      start: data.event.start,
      end: data.event.end,
    }));
  });

  const [selectView, setSelectView] = useState("dayGridMonth");

  const [startDate, setStartDate] = useState(new Date());

  const [endDate, setEndDate] = useState(new Date());

  const calendarRef = useRef(null);

  const createEventId = () => {
    let eventGuid = 0;
    return String(eventGuid++);
  };

  const handleViewSelect = (e) => {
    setSelectView(e.target.value);
    calendarRef.current.getApi().changeView(e.target.value);
  };

  const handleDatePick = (date) => {
    setStartDate(date);
    calendarRef.current.getApi().gotoDate(date);
  };

  const handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };

  const handleEventUpdate = (e) => {
    const idx = eventsData.findIndex((event) => event.id === e.event.id);

    eventsData[idx].title.split("<>")[1].split("-")[1] = moment(
      e.event.start
    ).format("MM/DD/YYYY");

    eventsData[idx].start = moment(e.event.start).format();
    eventsData[idx].end = moment(e.event.end).format();

    console.log(eventsData[idx].title);

    setEventsData(eventsData);
  };

  const renderEventContent = (eventInfo) => {
    const content = eventInfo.event.title.split("<>");
    return (
      <div
        style={{
          width: "100%",
          padding: "10px",
          overflow: "hidden",
          borderRadius: "4px",
        }}
      >
        <small>{content[0]}</small>
        <br />
        <small>{content[1]}</small>
      </div>
    );
  };

  return (
    <Fragment>
      <div className="fc-header">
        <select
          className="fc-view-select"
          value={selectView}
          onChange={handleViewSelect}
        >
          <option value="timeGridDay">day</option>
          <option value="timeGridWeek">week</option>
          <option value="dayGridMonth">month</option>
        </select>

        <DatePicker
          monthsShown={2}
          selected={startDate}
          onChange={handleDatePick}
        />
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          resourceTimeGridPlugin,
        ]}
        headerToolbar={false}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        views={[selectView]}
        initialEvents={eventsData}
        select={handleDateSelect}
        eventContent={renderEventContent} // custom render function
        eventResize={handleEventUpdate}
        eventChange={handleEventUpdate}
        /* you can update a remote database when these fire:
      eventChange={() => {}}
    eventAdd={function(){}}
    eventRemove={function(){}}
    */
      />
    </Fragment>
  );
}

export default App;
