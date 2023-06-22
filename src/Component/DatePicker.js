import { useState, useEffect, useCallback, memo } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { Views } from "../common/constant";
import { extendMoment } from "moment-range";
import DatePicker from "react-datepicker";
import Moment from "moment";

const moment = extendMoment(Moment);

const DatePickerCom = ({ viewType, onChange }) => {
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    setStartDate(new Date());
    onChange && onChange(new Date());
  }, [viewType]);

  // Get date picker props base on view type
  const getProps = useCallback(() => {
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
        const prev = startDate.getDate() - 1;

        const next = startDate.getDate() + 2;

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
  }, [viewType, startDate]);

  // Handle prev/next
  const handleNavigator = (type) => {
    let date = "";

    const isPrev = type === "prev";

    switch (viewType) {
      case Views.TIME_GRID_DAY: {
        const d = startDate.getDate();

        date = new Date(
          new Date(startDate.setDate(isPrev ? d - 1 : d + 1)).toUTCString()
        );

        setStartDate(date);

        break;
      }
      case Views.TIME_GRID_THREE_DAY: {
        const d = startDate.getDate();

        date = new Date(
          new Date(startDate.setDate(isPrev ? d - 3 : d + 3)).toUTCString()
        );

        setStartDate(date);

        break;
      }
      case Views.TIME_GRID_FOUR_DAY: {
        const d = startDate.getDate();

        date = new Date(
          new Date(startDate.setDate(isPrev ? d - 4 : d + 4)).toUTCString()
        );

        setStartDate(date);

        break;
      }
      case Views.DAY_GRID_MONTH: {
        const year = startDate.getFullYear();

        const month = isPrev
          ? startDate.getMonth() - 1
          : startDate.getMonth() + 1;

        date = new Date(year, month, 1);

        setStartDate(date);

        break;
      }
      default: {
        const first = startDate.getDate() - startDate.getDay();

        const firstDayOfWeek = new Date(startDate.setDate(first)).toUTCString();

        date = new Date(
          new Date(firstDayOfWeek).setDate(
            isPrev
              ? new Date(firstDayOfWeek).getDate() - 7
              : new Date(firstDayOfWeek).getDate() + 7
          )
        );

        setStartDate(date);

        break;
      }
    }

    onChange && onChange(date);
  };

  // Handle change date base on view type
  const handleDatePick = (d) => {
    switch (viewType) {
      case Views.TIME_GRID_DAY || Views.DAY_GRID_MONTH: {
        setStartDate(d);

        return onChange && onChange(d);
      }
      default: {
        setStartDate(d?.[0] || d);

        return onChange && onChange(d);
      }
    }
  };

  return (
    <div className="fc-datepikcer">
      <button
        className="datepicker-action"
        onClick={() => handleNavigator("prev")}
      >
        <FaAngleLeft />
      </button>

      <DatePicker {...getProps()} monthsShown={2} onChange={handleDatePick} />

      <button
        className="datepicker-action"
        onClick={() => handleNavigator("next")}
      >
        <FaAngleRight />
      </button>
    </div>
  );
};

export default memo(DatePickerCom);
