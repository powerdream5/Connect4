import { useEffect, useRef, useState } from "react";
import "./App.css";
import { getDate, getToday, formatTimeTo12Hr } from "./utils/helper";
import CalSerice from "./services/cal.service";

function App() {
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const selDate = useRef<HTMLSelectElement>(null);
  const selDateMobile = useRef<HTMLSelectElement>(null);
  const calService = new CalSerice();

  async function fetchSlots(date: string) {
    return (await calService.fetchSlots(date)).map((slot) => {
      return formatTimeTo12Hr(slot.time);
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      // Example usage:
      const availabilityData = [
        {
          userId: 1,
          availability: {
            busy: [
              {
                start: "2024-10-09T17:00:00.000Z",
                end: "2024-10-09T17:15:00.000Z",
              },
              {
                start: "2024-10-09T16:15:00.000Z",
                end: "2024-10-09T16:30:00.000Z",
              },
            ],
            timezone: "America/Los_Angeles",
            workingHours: {
              days: [1, 2, 3, 4, 5],
              startTime: 960,
              endTime: 1439,
              userId: 1,
            },
          },
        },
        {
          userId: 2,
          availability: {
            busy: [
              {
                start: "2024-10-09T17:00:00.000Z",
                end: "2024-10-09T17:15:00.000Z",
              },
              {
                start: "2024-10-09T16:15:00.000Z",
                end: "2024-10-09T16:30:00.000Z",
              },
            ],
            timezone: "America/Chicago",
            workingHours: {
              days: [1, 2, 3, 4, 5],
              startTime: 840,
              endTime: 1320,
              userId: 2,
            },
          },
        },
      ];

      const targetDate = "2024-10-09";
      const periodMinutes = 30;
      const targetTimezone = "America/Los_Angeles";
      const availabilityModel = "all";

      const availableSlots = calService.findAvailableSlots(
        availabilityData,
        targetDate,
        targetTimezone,
        periodMinutes,
        availabilityModel
      );

      console.log(availableSlots);

      setSlots(availableSlots.map((slot) => formatTimeTo12Hr(slot)));
    };

    fetchData();
  }, []);

  async function handleDateChange() {
    if (selDate.current) {
      const slots = await fetchSlots(selDate.current.value);
      setSlots(slots);
      setSelectedDate(selDate.current.value);
    }
  }

  async function handleDateChangeMobile() {
    if (selDateMobile.current) {
      const slots = await fetchSlots(selDateMobile.current.value);
      setSlots(slots);
      setSelectedDate(selDateMobile.current.value);
    }
  }

  return (
    <div className="h-screen flex md:items-center justify-center bg-slate-100">
      <div className="calContainer flex-grow bg-white rounded-lg p-8 flex flex-col md:flex-row overflow-scroll">
        <div className="datePick shrink-0 mb-8">
          <label className="datePickLg">
            Pick a Date:
            <select ref={selDate} onChange={handleDateChange} size={9}>
              {getDate().map((date) => {
                const selected = date.value === selectedDate;
                return (
                  <option
                    key={date.value}
                    value={date.value}
                    selected={selected}
                  >
                    {date.label}
                  </option>
                );
              })}
            </select>
          </label>

          <label className="datePickMobile">
            <div>Pick a Date:</div>
            <select ref={selDateMobile} onChange={handleDateChangeMobile}>
              {getDate().map((date) => {
                const selected = date.value === selectedDate;
                return (
                  <option
                    key={date.value}
                    value={date.value}
                    selected={selected}
                  >
                    {date.label}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
        <div className="flex flex-grow flex-col">
          <div className="mb-8 shrink-0">Timezone: America/Los Angeles</div>
          <div className="flex flex-grow flex-wrap overflow-scroll slotContainer">
            {slots.length == 0 && (
              <div>
                <span className="text-slate-500">
                  No Available Slots, Please pick another date.
                </span>
              </div>
            )}
            {slots.length > 0 &&
              slots.map((slot) => {
                return (
                  <button className="slot" key={slot}>
                    {slot}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
