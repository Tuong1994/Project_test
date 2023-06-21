import { useState, useEffect } from "react";
import { Views } from "../common/constant";
import { extendMoment } from "moment-range";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Moment from "moment";

const moment = extendMoment(Moment);

const DatePickerCom = ({ viewType, onChange }) => {
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    setStartDate(new Date());
  }, [viewType]);

  // Get date picker props base on view type
  const getProps = () => {
    switch (viewType) {
      // day props
      case Views.TIME_GRID_DAY: {
        return {
          selected: startDate,
        };
      }
      // three days props
      case Views.TIME_GRID_THREE_DAY: {
        const prev = startDate.getDate() - 1;

        const next = startDate.getDate() + 1;

        const prevDay = new Date(startDate.setDate(prev)).toUTCString();

        const nextDay = new Date(startDate.setDate(next)).toUTCString();

        return {
          startDate: new Date(prevDay),
          endDate: new Date(nextDay),
          selectsRange: true,
          selected: startDate,
        };
      }
      // four days props
      case Views.TIME_GRID_FOUR_DAY: {
        const prev = startDate.getDate() - 2;

        const next = startDate.getDate() + 1;

        const prevDay = new Date(startDate.setDate(prev)).toUTCString();

        const nextDay = new Date(startDate.setDate(next)).toUTCString();

        return {
          startDate: new Date(prevDay),
          endDate: new Date(nextDay),
          selectsRange: true,
          selected: startDate,
        };
      }
      // week props
      case Views.TIME_GRID_WEEK: {
        const first = startDate.getDate() - startDate.getDay();

        const last = first + 6;

        const firstDayOfWeek = new Date(startDate.setDate(first)).toUTCString();

        const lastDayOfWeek = new Date(startDate.setDate(last)).toUTCString();

        return {
          startDate: new Date(firstDayOfWeek),
          endDate: new Date(lastDayOfWeek),
          selectsRange: true,
          selected: startDate,
          dateFormat: "MMMM/dd/yyyy",
        };
      }
      // two weeks props
      case Views.TIME_GRID_TWO_WEEK: {
        const first = startDate.getDate() - startDate.getDay();

        const last = first + 13;

        const firstDayOfWeek = new Date(startDate.setDate(first)).toUTCString();

        const lastDayOfWeek = new Date(startDate.setDate(last)).toUTCString();

        return {
          startDate: new Date(firstDayOfWeek),
          endDate: new Date(lastDayOfWeek),
          selectsRange: true,
          selected: startDate,
          dateFormat: "MMMM/dd/yyyy",
        };
      }
      // three weeks props
      case Views.TIME_GRID_THREE_WEEK: {
        const first = startDate.getDate() - startDate.getDay();

        const last = first + 20;

        const firstDayOfWeek = new Date(startDate.setDate(first)).toUTCString();

        const lastDayOfWeek = new Date(startDate.setDate(last)).toUTCString();

        return {
          startDate: new Date(firstDayOfWeek),
          endDate: new Date(lastDayOfWeek),
          selectsRange: true,
          selected: startDate,
          dateFormat: "MMMM/dd/yyyy",
        };
      }
      // four weeks props
      case Views.TIME_GRID_FOUR_WEEK: {
        const first = startDate.getDate() - startDate.getDay();

        const last = first + 27;

        const firstDayOfWeek = new Date(startDate.setDate(first)).toUTCString();

        const lastDayOfWeek = new Date(startDate.setDate(last)).toUTCString();

        return {
          startDate: new Date(firstDayOfWeek),
          endDate: new Date(lastDayOfWeek),
          selectsRange: true,
          selected: startDate,
          dateFormat: "MMMM/dd/yyyy",
        };
      }
      // month props
      case Views.DAY_GRID_MONTH: {
        let dateOfMonth = [];

        const excludeDates = [];

        const year = startDate.getFullYear();

        const month = startDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);

        const lastDayOfMonth = new Date(year, month + 1, 0);

        const range = moment.range(
          moment(firstDayOfMonth),
          moment(lastDayOfMonth)
        );

        const dates = Array.from(range.by("day"));

        dateOfMonth = [...dates];

        dateOfMonth.forEach((date) => excludeDates.push(new Date(date)));

        return {
          dateFormat: "MMMM - yyyy",
          selected: startDate,
          excludeDates: excludeDates,
        };
      }
    }
  };

  // Handle next week
  const handleNextWeek = () => {
    const first = startDate.getDate() - startDate.getDay();

    const firstDayOfWeek = new Date(startDate.setDate(first)).toUTCString();

    const date = new Date(
      new Date(firstDayOfWeek).setDate(new Date(firstDayOfWeek).getDate() + 7)
    );

    setStartDate(date);

    onChange && onChange(date);
  };

  // Handle prev week
  const handlePrevWeek = () => {
    const first = startDate.getDate() - startDate.getDay();

    const firstDayOfWeek = new Date(startDate.setDate(first)).toUTCString();

    const date = new Date(
      new Date(firstDayOfWeek).setDate(new Date(firstDayOfWeek).getDate() - 7)
    );

    setStartDate(date);

    onChange && onChange(date);
  };

  // Handle change date base on view type
  const handleDatePick = (d) => {
    switch (viewType) {
      // day
      case Views.TIME_GRID_DAY: {
        setStartDate(d);

        return onChange && onChange(d);
      }
      // three days
      case Views.TIME_GRID_THREE_DAY: {
        if (Array.isArray(d)) {
          const [start] = d;

          setStartDate(start);
        }

        return onChange && onChange(d);
      }
      // four days
      case Views.TIME_GRID_FOUR_DAY: {
        if (Array.isArray(d)) {
          const [start] = d;

          setStartDate(start);
        }

        return onChange && onChange(d);
      }
      // week
      case Views.TIME_GRID_WEEK: {
        if (Array.isArray(d)) {
          const [start] = d;

          setStartDate(start);
        }
        return onChange && onChange(d);
      }
      // two weeks
      case Views.TIME_TWO_WEEK: {
        if (Array.isArray(d)) {
          const [start] = d;

          setStartDate(start);
        }
        return onChange && onChange(d);
      }
      // three weeks
      case Views.TIME_THREE_WEEK: {
        if (Array.isArray(d)) {
          const [start] = d;

          setStartDate(start);
        }
        return onChange && onChange(d);
      }
      // four weeks
      case Views.TIME_FOUR_WEEK: {
        if (Array.isArray(d)) {
          const [start] = d;

          setStartDate(start);
        }
        return onChange && onChange(d);
      }
      // month
      case Views.DAY_GRID_MONTH: {
        setStartDate(d);

        return onChange && onChange(d);
      }
    }
  };

  return (
    <div className="fc-datepikcer">
      <button className="datepicker-action" onClick={handlePrevWeek}>
        <FaAngleLeft />
      </button>

      <DatePicker {...getProps()} monthsShown={2} onChange={handleDatePick} />

      <button className="datepicker-action" onClick={handleNextWeek}>
        <FaAngleRight />
      </button>
    </div>
  );
};

export default DatePickerCom;
