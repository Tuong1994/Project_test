import { Fragment, useRef, useState } from "react";
import { data } from "./data";
import { Views } from "./common/constant";
import FullCalendar from "@fullcalendar/react";
import DatePicker from "./Component/DatePicker";
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
      backgroundColor: "",
    }));
  });

  const [selectView, setSelectView] = useState(Views.TIME_GRID_WEEK);

  const calendarRef = useRef(null);

  const createEventId = () => {
    let eventGuid = 0;
    return String(eventGuid++);
  };

  // Handle change view
  const handleViewSelect = (e) => {
    setSelectView(e.target.value);
    calendarRef.current.getApi().changeView(e.target.value);
  };

  // Handle date pick
  const handleDatePick = (date) => {
    switch (selectView) {
      case Views.TIME_GRID_DAY: {
        calendarRef.current.getApi().gotoDate(date);
        break;
      }
      case Views.TIME_GRID_WEEK: {
        if (typeof date === "object") {
          const [start] = date;
          calendarRef.current.getApi().gotoDate(start)
        }
        break;
      }
      case Views.DAY_GRID_MONTH: {
        calendarRef.current.getApi().gotoDate(date);
        break;
      }
    }
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
      });
    }
  };

  // Update Event
  const handleEventUpdate = (e) => {
    const events = [...eventsData];

    const idx = events.findIndex((event) => event.id === e.event.id);

    const firstTitle = events[idx].title.split("<>")[0];

    console.log(firstTitle)

    const splitTitle = events[idx].title.split("<>")[1];

    const date = splitTitle.split("-")

    const lastTitle = [...date.slice(0, 1), "-", moment(e.event.start).format("MM/DD/YYYY")].join(" ")

    const event = {
      ...events[idx],
      title: `${firstTitle}<>${lastTitle}`,
      start: moment(e.event.start).format(),
      end: moment(e.event.end).format(),
      backgroundColor: "red",
    }

    events[idx] = event;

    setEventsData(events);
  };

  // Display event
  const renderEventContent = (eventInfo) => {
    const content = eventInfo.event.title.split("<>");
    return (
      <div
        style={{
          width: "100%",
          padding: "10px",
          overflow: "hidden",
          borderRadius: "4px",
          backgroundColor: eventInfo.event.backgroundColor
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
          <option value={Views.TIME_GRID_DAY}>day</option>
          <option value={Views.TIME_GRID_WEEK}>week</option>
          <option value={Views.DAY_GRID_MONTH}>month</option>
        </select>

        <DatePicker viewType={selectView} onChange={handleDatePick} />
      </div>

      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          resourceTimeGridPlugin,
        ]}
        ref={calendarRef}
        headerToolbar={false}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        initialView={selectView}
        initialEvents={eventsData}
        views={selectView}
        events={eventsData}
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventResize={handleEventUpdate}
        eventChange={handleEventUpdate}
     />
    </Fragment>
  );
}

export default App;
