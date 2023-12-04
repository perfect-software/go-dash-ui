export const formatDate = (inputDate) => {
  const parts = inputDate.split("-");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  } else {
    return "Invalid date format";
  }
};
export const getformatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};
export const formatDDMMYYYYDate = (dateString) => {
  if (!dateString) return "";
  const formattedDateString = dateString.replace(/\//g, "-");
  const date = new Date(formattedDateString);
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);

  return formattedDate.replace(/\//g, "-");
};

export const formatToLocalDDMMYYYY = (dateTimeString) => {
  if (!dateTimeString) return "";

  const datePart = dateTimeString.split(" ")[0];

  const [year, month, day] = datePart.split("-");
  const formattedDate = `${day}-${month}-${year}`;
  console.log(formatDate);
  return formattedDate;
};

export function getCurrentYearLastTwoDigits() {
  const currentYear = new Date().getFullYear();
  const lastTwoDigits = currentYear.toString().slice(-2);
  return lastTwoDigits;
}
