import { Fragment, useRef, useState, useEffect, useCallback } from "react";
import { data } from "./data";
import { Views } from "./common/constant";
import FullCalendar from "@fullcalendar/react";
import DatePicker from "./Component/DatePicker";
import ExternalEventItem from "./Component/ExternalEventItem";
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
    const threeDaysView = {
      timeGridWeek: {
        type: Views.TIME_GRID_WEEK,
        duration: { days: 3 },
      },
    };

    const fourDaysView = {
      timeGridWeek: {
        type: Views.TIME_GRID_WEEK,
        duration: { days: 4 },
      },
    };

    const twoWeeksView = {
      timeGridWeek: {
        type: Views.TIME_GRID_WEEK,
        duration: { days: 14 },
      },
    };

    const threeWeeksView = {
      timeGridWeek: {
        type: Views.TIME_GRID_WEEK,
        duration: { days: 21 },
      },
    };

    const fourWeeksView = {
      timeGridWeek: {
        type: Views.TIME_GRID_TWO_WEEK,
        duration: { days: 28 },
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
          setViewType({ ...twoWeeksView });
          break;
        }
        case Views.TIME_GRID_THREE_WEEK: {
          setViewType({ ...threeWeeksView });
          break;
        }
        case Views.TIME_GRID_FOUR_WEEK: {
          setViewType({ ...fourWeeksView });
          break;
        }
        case Views.TIME_GRID_THREE_DAY: {
          setViewType({ ...threeDaysView });
          break;
        }
        case Views.TIME_GRID_FOUR_DAY: {
          setViewType({ ...fourDaysView });
          break;
        }
      }
      setSelectView(e.target.value);
      calendarRef.current.getApi().changeView(Views.TIME_GRID_WEEK);
    }
  };

  // Handle date pick
  const handleDatePick = (date) => {
    switch (selectView) {
      // day
      case Views.TIME_GRID_DAY: {
        calendarRef.current.getApi().gotoDate(date);
        break;
      }
      // three days
      case Views.TIME_GRID_THREE_DAY: {
        if (Array.isArray(date)) {
          const [start] = date;
          calendarRef.current.getApi().gotoDate(start);
        }
        break;
      }
      // four days
      case Views.TIME_GRID_FOUR_DAY: {
        if (Array.isArray(date)) {
          const [start] = date;
          calendarRef.current.getApi().gotoDate(start);
        }
        break;
      }
      // week
      case Views.TIME_GRID_WEEK: {
        if (Array.isArray(date)) {
          const [start] = date;
          calendarRef.current.getApi().gotoDate(start);
        } else {
          calendarRef.current.getApi().gotoDate(date);
        }
        break;
      }
      // two weeks
      case Views.TIME_TWO_WEEK: {
        if (Array.isArray(date)) {
          const [start] = date;
          calendarRef.current.getApi().gotoDate(start);
        } else {
          calendarRef.current.getApi().gotoDate(date);
        }
        break;
      }
      // three weeks
      case Views.TIME_THREE_WEEK: {
        if (Array.isArray(date)) {
          const [start] = date;
          calendarRef.current.getApi().gotoDate(start);
        } else {
          calendarRef.current.getApi().gotoDate(date);
        }
        break;
      }
      // four weeks
      case Views.TIME_FOUR_WEEK: {
        if (Array.isArray(date)) {
          const [start] = date;
          calendarRef.current.getApi().gotoDate(start);
        } else {
          calendarRef.current.getApi().gotoDate(date);
        }
        break;
      }
      // month
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

  // Hanlde event drag outside calendar
  const handleEventDragOutSide = (e) => {
    let trashEl = document.getElementById("external-events"); //as HTMLElement;

    let x1 = trashEl.offsetLeft;
    let x2 = trashEl.offsetLeft + trashEl.offsetWidth;
    let y1 = trashEl.offsetTop;
    let y2 = trashEl.offsetTop + trashEl.offsetHeight;

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
  const renderEventContent = useCallback(
    (eventInfo) => {
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
    },
    [JSON.stringify(eventsData), JSON.stringify(externalEvents)]
  );

  // Display external events 
  const renderExternalEventContent = useCallback(() => {
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
    })
  }, [JSON.stringify(eventsData), JSON.stringify(externalEvents)])

  return (
    <Fragment>
      <div className="fc-header">
        <select
          className="fc-view-select"
          value={selectView}
          onChange={handleViewSelect}
        >
          <option value={Views.TIME_GRID_DAY}>day</option>
          <option value={Views.TIME_GRID_THREE_DAY}>3 days rolling</option>
          <option value={Views.TIME_GRID_FOUR_DAY}>4 days rolling</option>
          <option value={Views.TIME_GRID_WEEK}>week</option>
          <option value={Views.TIME_GRID_TWO_WEEK}>2 weeks</option>
          <option value={Views.TIME_GRID_THREE_WEEK}>3 weeks</option>
          <option value={Views.TIME_GRID_FOUR_WEEK}>4 weeks</option>
          <option value={Views.DAY_GRID_MONTH}>month</option>
        </select>

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
            ref={calendarRef}
            headerToolbar={false}
            editable={true}
            selectable={true}
            selectMirror={false}
            dayMaxEvents={true}
            weekends={true}
            initialView={viewType}
            views={viewType}
            events={eventsData}
            eventMinHeight={20}
            eventClassNames="calendar-event"
            eventDragStop={handleEventDragOutSide}
            eventContent={renderEventContent}
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
