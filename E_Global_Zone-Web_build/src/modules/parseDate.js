/**
 * parseDate: get Date Object and return YYYY-MM-DD
 * @param {Date} date
 * @returns {string}
 */
const parseDate = (date) => {
    let dateString;
    dateString = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" + (date.getMonth() +1) : (date.getMonth()+1)}-${date.getDate()}`;
    return dateString;
};

export default parseDate;