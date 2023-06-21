import { useEffect } from "react";
import { Draggable } from "@fullcalendar/interaction";

const ExternalEventItem = ({ item, title, eventsData, setEventsData }) => {
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

        eventEl.remove();

        return event;
      },
    });
    return () => draggable.destroy();
  });

  return (
    <div id={item.id} title={item.title} className="events-item">
      <small>{title[0]}</small>
      <br />
      <small>{title[1]}</small>
    </div>
  );
};

export default ExternalEventItem;
