import { Fragment, useState, useEffect } from "react";
import { Views } from "../common/constant";
import { extendMoment } from "moment-range";
import Moment from "moment";
import DatePicker from "react-datepicker"

const moment = extendMoment(Moment)

const DatePickerCom = ({
    viewType,
    onChange
}) => {
    const [startDate, setStartDate] = useState(new Date());

    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        if (viewType === Views.TIME_GRID_DAY) setStartDate(new Date());
    }, [viewType])

    const getProps = () => {
        switch (viewType) {
            case Views.TIME_GRID_DAY: {
                return {
                    selected: startDate,
                }
            }
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
                }
            }
            case Views.DAY_GRID_MONTH: {
                let dateOfMonth = [];

                const excludeDates = [];

                const year = startDate.getFullYear()

                const month = startDate.getMonth();

                const firstDayOfMonth = new Date(year, month, 1);

                const lastDayOfMonth = new Date(year, month + 1, 0);

                const range = moment.range(moment(firstDayOfMonth), moment(lastDayOfMonth));

                const dates = Array.from(range.by("day"));

                dateOfMonth = [...dates];

                dateOfMonth.forEach((date) => excludeDates.push(new Date(date)))

                return {
                    selected: startDate,
                    dateFormat: "MMMM - yyyy",
                    excludeDates: excludeDates,
                }
            }
        }
    }

    const handleDatePick = (d) => {
        switch (viewType) {
            case Views.TIME_GRID_DAY: {
                setStartDate(d);

                return onChange && onChange(d)
            }
            case Views.TIME_GRID_WEEK: {
                if (typeof d === "object") {
                    const [start, end] = d;

                    setStartDate(start)

                    setEndDate(end)
                }
                return onChange && onChange(d)
            }
            case Views.DAY_GRID_MONTH: {
                setStartDate(d);

                return onChange && onChange(d)
            }
        }
    }

    return <Fragment>
        <DatePicker
            {...getProps()}
            monthsShown={2}
            onChange={handleDatePick}
        />
    </Fragment>
}

export default DatePickerCom