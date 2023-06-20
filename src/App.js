import { Fragment, useRef, useState, useEffect } from "react";
import { data } from "./data";
import { Views } from "./common/constant";
import FullCalendar from "@fullcalendar/react";
import DatePicker from "./Component/DatePicker";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const [externalEvents, setExternalEvents] = useState([
    { title: "Event 1", id: "1" },
  ]);

  const [eventsData, setEventsData] = useState([]);

  const [selectView, setSelectView] = useState(Views.TIME_GRID_WEEK);

  const calendarRef = useRef(null);

  // Convert data and set events data
  useEffect(() => {
    const events = data.map((data) => {
      const splitTitle = data.tile.header.split(" ")[0];

      const firstPartTitle = [
        splitTitle,
        ",",
        moment(data.event.start).format("HH:mm "),
        "-",
        moment(data.event.end).format("HH:mma"),
      ].join(" ");

      const lastPartTitle = [
        data.tile.content[0],
        "-",
        data.tile.content[1],
      ].join(" ");

      const title = `${firstPartTitle}<>${lastPartTitle}`;

      return {
        id: data.event.id,
        title: title,
        start: moment(data.event.start).format("YYYY-MM-DD HH:mm"),
        end: moment(data.event.end).format("YYYY-MM-DD HH:mm"),
        backgroundColor: "",
      };
    });

    setEventsData(events);
  }, []);

  // handle drag external event item
  useEffect(() => {
    let draggableEl = document.getElementById("external-events");
    const draggable = new Draggable(draggableEl, {
      itemSelector: ".events-item",
      eventData: function (eventEl) {
        const id = eventEl.getAttribute("id");

        const title = eventEl.getAttribute("title");

        const event = {
          id,
          title,
        };

        eventsData.push(event);

        setEventsData(eventsData);

        return event;
      },
    });
    return () => draggable.destroy();
  });

  // Handle change view
  const handleViewSelect = (e) => {
    const views = {
      timeGridTwoWeek: {
        type: Views.TIME_GRID_WEEK,
        duration: { days: 14 },
      },
    };

    if (
      e.target.value === Views.TIME_GRID_DAY ||
      e.target.value === Views.TIME_GRID_WEEK ||
      e.target.value === Views.DAY_GRID_MONTH
    ) {
      setSelectView(e.target.value);
      calendarRef.current.getApi().changeView(e.target.value);
    }
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
          calendarRef.current.getApi().gotoDate(start);
        }
        break;
      }
      case Views.DAY_GRID_MONTH: {
        calendarRef.current.getApi().gotoDate(date);
        break;
      }
    }
  };

  // Update Event
  const handleEventUpdate = (e) => {
    const events = [...eventsData];

    const idx = events.findIndex((event) => event.id === e.event.id);

    const firstPartTitle = events[idx].title.split("<>")[0];

    const subFirstPartTitle = firstPartTitle.split(" ");

    const lastPartTitle = events[idx].title.split("<>")[1];

    const subLastPartTitle = lastPartTitle ? lastPartTitle.split("-") : "";

    const firstTitle = [
      ...subFirstPartTitle.slice(0, 1),
      ",",
      moment(e.event.start).format("HH:mm "),
      "-",
      moment(e.event.end).format("HH:mma"),
    ].join(" ");

    const lastTitle = [
      ...subLastPartTitle.slice(0, 1),
      "-",
      moment(e.event.start).format("MM/DD/YYYY"),
    ].join(" ");

    const event = {
      ...events[idx],
      title: `${firstTitle}<>${lastTitle}`,
      start: moment(e.event.start).format("YYYY-MM-DD HH:mm"),
      end: moment(e.event.end).format("YYYY-MM-DD HH:mm"),
      backgroundColor: "red",
    };

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
          padding: "5px",
          overflow: "hidden",
          borderRadius: "4px",
          backgroundColor: eventInfo.event.backgroundColor,
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
          <option value={Views.TIME_GRID_TWO_WEEK}>2 weeks</option>
          <option value={Views.DAY_GRID_MONTH}>month</option>
        </select>

        <DatePicker viewType={selectView} onChange={handleDatePick} />
      </div>

      <div className="fc-container">
        <div className="container-events" id="external-events">
          <h3 style={{ textAlign: "center" }}>Events</h3>

          {externalEvents.map((item) => (
            <div
              key={item.id}
              id={item.id}
              title={item.title}
              className="events-item"
            >
              {item.title}
            </div>
          ))}
        </div>

        <div className="container-calendar">
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
            selectMirror={false}
            dayMaxEvents={true}
            weekends={true}
            initialView={selectView}
            views={selectView}
            events={eventsData}
            eventMinHeight={70}
            eventContent={renderEventContent}
            eventResize={handleEventUpdate}
            eventChange={handleEventUpdate}
          />
        </div>
      </div>
    </Fragment>
  );
}

export default App;
