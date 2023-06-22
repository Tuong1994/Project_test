import { Views } from "../common/constant";

const Select = ({selectView, handleViewSelect}) => {
  return (
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
  );
};

export default Select;
