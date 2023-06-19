import { Fragment, useCallback, useRef, useState } from "react";
import { data } from "./data";
import FullCalendar from '@fullcalendar/react'
import DatePicker from "react-datepicker"
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

function App() {
  const [eventsData, setEventsData] = useState(data);

  const [currentEvents, setCurrentEvents] = useState([]);

  const [selectView, setSelectView] = useState("timeGridDay");

  const [startDate, setStartDate] = useState(new Date());

  const calendarRef = useRef(null);

  let eventGuid = 0

  const events = useCallback(() => {
    return eventsData.map((event) => (
      {
        id: createEventId(),
        title: `${event.tile.header} ${event.tile.content[1]}`,
        start: event.time_window.start,
        end: event.time_window.end,
      }
    ))
  }, [eventsData])

  const createEventId = () => {
    return String(eventGuid++)
  }

  const handleViewSelect = (e) => {    
    setSelectView(e.target.value)
  }

  const handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  const handleEvents = (e) => {
    setCurrentEvents(e)
  }

  const handleDateClick = (e) => {
    console.log(e.event)
  }

  const renderEventContent = (eventInfo) => {
    return <div>
      <i>{eventInfo.event.title}</i>
    </div>
  }

  return (
    <Fragment>
      <div>
        <select onChange={handleViewSelect}>
          <option value="timeGridDay">day</option>
          <option value="timeGridWeek">week</option>
          <option value="dayGridMonth">month</option>
        </select>

        <DatePicker
          monthsShown={2}
          showYearDropdown
          inline={false}
        />
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
        headerToolbar={{
          left: "",
          center: "",
          right: "timeGridDay timeGridWeek dayGridMonth"
        }}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        initialView='dayGridMonth'
        views={[selectView]}
        initialEvents={events()} // alternatively, use the `events` setting to fetch from a feed
        select={handleDateSelect}
        eventsSet={handleEvents} // called after events are initialized/added/changed/removed
        eventContent={renderEventContent} // custom render function
        eventChange={handleDateClick}
      /* you can update a remote database when these fire:
      eventAdd={function(){}}
      eventRemove={function(){}}
      */
      />
    </Fragment>
  );
}

export default App;
