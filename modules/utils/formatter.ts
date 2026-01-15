// Date Formatting Utilities
const formatDate = (inputDateString: any) => {
    const date = new Date(inputDateString);

    const year = date.getFullYear();
    let month: any = date.getMonth() + 1;
    let day: any = date.getDate();
    let hours: any = date.getHours();
    let minuet: any = date.getMinutes();

    // Add leading zeros if necessary
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    if (hours < 10) hours = '0' + hours;
    if (minuet < 10) minuet = '0' + minuet;

    const outputDateString = `${year}-${month}-${day} ${hours}:${minuet}`;

    return outputDateString;
}

const formatDateHRF = (date: any) => {
    // Use the dateFormatter function here for full date formatting
    return dateFormatter(date); // This will return "Sunday, November 10, 2024"
}

const formatDataAndTime = (date: any) => {
    return new Date(date).toUTCString();
}

const formatYMD = (date: any) => {
    return new Date(date).toISOString().slice(0, 10);
}

const formatAmount = (amount: any) => {
    const _amount = amount?.toLocaleString('en-US') ?? 0.0
    return '$' + _amount;
}

export { formatDate, formatDateHRF, formatYMD, formatDataAndTime, formatAmount };

// New Date Formatter Function
export function dateFormatter(date: any) {
    if (date === undefined) return undefined;

    const result = new Date(date).toLocaleDateString("en-US", {
        weekday: "long", // full weekday name (e.g., "Sunday")
        year: "numeric", // full year (e.g., "2024")
        month: "long",   // full month name (e.g., "November")
        day: "numeric",  // numeric day (e.g., "10")
    });
    return result;  // Example: "Sunday, November 10, 2024"
}

// New Date Formatter with Custom Year Formatting
export function formatDateWithYear(date: any, type: 'Full' | '!Day' | '' = 'Full') {
    if (date === undefined) return undefined;

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const day = date.toLocaleDateString('en-US', { weekday: 'short' }); // Short day name (e.g., "Tue")
    const month = months[date.getMonth()]; // Abbreviated month name (e.g., "Dec")
    const dayOfMonth = date.getDate(); // Day of the month (e.g., 5)
    const year = date.getFullYear(); // Full year (e.g., 2023)

    let formattedDate = `${day} ${month} ${dayOfMonth}, ${year}`;

    switch (type) {
        case '!Day':
            formattedDate = `${month} ${dayOfMonth}, ${year}`;
            break;
        default:
            break;
    }

    return formattedDate;
}

// Date Formatter with Hours (Including AM/PM and Short Month)
export function dateFormatterWithHours(date: any) {
    if (date === undefined) return undefined;

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const d = new Date(date);
    const day = d.toLocaleDateString('en-US', { weekday: 'short' }); // Short day name (e.g., "Sun")
    const month = months[d.getMonth()]; // Abbreviated month name (e.g., "Dec")
    const dayOfMonth = d.getDate(); // Day of the month (e.g., 29)
    const year = d.getFullYear(); // Full year (e.g., 2024)
    let hours = d.getHours(); // Hours (e.g., 14 for 2 PM)
    const minutes = d.getMinutes(); // Minutes as a number
    const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM/PM

    // Adjust hours for 12-hour format
    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12; // Handle midnight
    }

    // Properly format minutes with a leading zero
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    // Formatted date: e.g., "Sun Dec 29, 2024 2:05 PM"
    const formattedDate = `${day} ${month} ${dayOfMonth}, ${year} ${hours}:${formattedMinutes} ${ampm}`;

    return formattedDate;
}




