import { Fragment, useRef, useState, useEffect } from "react";
import { data } from "./data";
import { Views } from "./common/constant";
import FullCalendar from "@fullcalendar/react";
import DatePicker from "./Component/DatePicker";
import ExternalEventItem from "./Component/ExternalEventItem";
import EventItem from "./Component/EventItem";
import Select from "./Component/Select";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const [externalEvents, setExternalEvents] = useState([]);

  const [eventsData, setEventsData] = useState([]);

  const [selectView, setSelectView] = useState(Views.TIME_GRID_WEEK);

  const [viewType, setViewType] = useState(Views.TIME_GRID_WEEK);

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

  // Handle change view
  const handleViewSelect = (e) => {
    const views = {
      timeGridWeek: {
        type: Views.TIME_GRID_WEEK,
      },
    };

    // Plugins view type
    if (
      e.target.value === Views.TIME_GRID_DAY ||
      e.target.value === Views.TIME_GRID_WEEK ||
      e.target.value === Views.DAY_GRID_MONTH
    ) {
      setSelectView(e.target.value);
      setViewType(e.target.value);
      calendarRef.current.getApi().changeView(e.target.value);
    }
    // Custom view type
    else {
      switch (e.target.value) {
        case Views.TIME_GRID_TWO_WEEK: {
          setViewType({
            ...views,
            timeGridWeek: { ...views.timeGridWeek, duration: { days: 14 } },
          });
          break;
        }
        case Views.TIME_GRID_THREE_WEEK: {
          setViewType({
            ...views,
            timeGridWeek: { ...views.timeGridWeek, duration: { days: 21 } },
          });
          break;
        }
        case Views.TIME_GRID_FOUR_WEEK: {
          setViewType({
            ...views,
            timeGridWeek: { ...views.timeGridWeek, duration: { days: 28 } },
          });
          break;
        }
        case Views.TIME_GRID_THREE_DAY: {
          setViewType({
            ...views,
            timeGridWeek: { ...views.timeGridWeek, duration: { days: 3 } },
          });
          break;
        }
        case Views.TIME_GRID_FOUR_DAY: {
          setViewType({
            ...views,
            timeGridWeek: { ...views.timeGridWeek, duration: { days: 4 } },
          });
          break;
        }
      }
      setSelectView(e.target.value);
      calendarRef.current.getApi().changeView(Views.TIME_GRID_WEEK);
    }
  };

  // Handle date pick
  const handleDatePick = (date) => {
    if (!date) return;

    switch (selectView) {
      case Views.TIME_GRID_DAY || Views.DAY_GRID_MONTH: {
        calendarRef.current.getApi().gotoDate(date);
        break;
      }
      default: {
        calendarRef.current.getApi().gotoDate(date?.[0] || date);
      }
    }
  };

  // Update Event
  const handleEventUpdate = (e) => {
    const events = [...eventsData];

    const idx = events.findIndex((event) => event.id === e.event.id);

    const [firstPartTitle, lastPartTitle] = events[idx].title.split("<>");

    const subFirstPartTitle = firstPartTitle.split(" ");

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

  // Hanlde event drag outside calendar
  const handleEventDragOutSide = (e) => {
    let trashEl = document.getElementById("external-events"); //as HTMLElement;

    const { offsetHeight, offsetLeft, offsetWidth, offsetTop } = trashEl;

    let x1 = offsetLeft;
    let x2 = offsetLeft + offsetWidth;
    let y1 = offsetTop;
    let y2 = offsetTop + offsetHeight;

    if (
      e.jsEvent.pageX >= x1 &&
      e.jsEvent.pageX <= x2 &&
      e.jsEvent.pageY >= y1 &&
      e.jsEvent.pageY <= y2
    ) {
      const events = [...externalEvents];
      events.push(e.event);
      e.event.remove();
      setExternalEvents(events);
    }
  };

  // Display event
  const renderEventContent = (eventInfo) => {
    const content = eventInfo.event.title.split("<>");
    return <EventItem eventInfo={eventInfo} content={content} />;
  };

  // Display external events
  const renderExternalEventContent = () => {
    return externalEvents.map((item) => {
      const title = item.title.split("<>");
      return (
        <ExternalEventItem
          key={item.id}
          item={item}
          title={title}
          eventsData={eventsData}
          setEventsData={setEventsData}
        />
      );
    });
  };

  return (
    <Fragment>
      <div className="fc-header">
        <Select selectView={selectView} handleViewSelect={handleViewSelect} />

        <DatePicker viewType={selectView} onChange={handleDatePick} />
      </div>

      <div className="fc-container">
        <div className="container-events" id="external-events">
          <h3 style={{ textAlign: "center" }}>Events</h3>

          {renderExternalEventContent()}
        </div>

        <div className="container-calendar">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              resourceTimeGridPlugin,
            ]}
            selectable
            editable
            weekends
            dayMaxEvents
            ref={calendarRef}
            headerToolbar={false}
            selectMirror={false}
            initialView={viewType}
            views={viewType}
            events={eventsData}
            eventMinHeight={20}
            eventClassNames="calendar-event"
            eventContent={renderEventContent}
            eventDragStop={handleEventDragOutSide}
            eventReceive={handleEventUpdate}
            eventResize={handleEventUpdate}
            eventChange={handleEventUpdate}
          />
        </div>
      </div>
    </Fragment>
  );
}

export default App;
