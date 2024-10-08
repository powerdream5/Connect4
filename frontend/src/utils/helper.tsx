export const getToday = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

export const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Add 1 day

    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

export const getDate = (): {label:string, value: string}[] => {
    return [
        {label: "Today", value: getToday()},
        {label: "Tomorrow", value: getTomorrow()},
        {label: "Mon Nov 18th", value: "2024-11-18"},
        {label: "Tue Nov 19th", value: "2024-11-19"},
        {label: "Wed Nov 20th", value: "2024-11-20"},
        {label: "Thu Nov 21st", value: "2024-11-21"},
        {label: "Fri Nov 22nd", value: "2024-11-22"},
        {label: "Sat Nov 23rd", value: "2024-11-23"},
        {label: "Sun Nov 24th", value: "2024-11-24"}
    ]
}

export const getFirstAndLastDayOfMonth = (dateString: string): {firstDay: string, lastDay: string} => {
    const date = new Date(dateString);
    
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    
    const lastDay = new Date(year, month + 1, 0);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    return {
        firstDay: formatDate(firstDay),
        lastDay: formatDate(lastDay),
    };
}

export const formatTimeTo12Hr = (datetime: string): string => {
    const date = new Date(datetime);

    let hours = date.getHours();
    const minutes = date.getMinutes();

    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
    
    return formattedTime;
}