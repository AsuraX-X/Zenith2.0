import { useEffect, useMemo, useState } from "react";
import { BiChevronDown } from "react-icons/bi";

const OPEN_TIME = 10; // 10:00 AM
const CLOSE_TIME = 21.5; // 9:30 PM

function getTimeSlots(
  date: Date,
  startHour: number,
  endHour: number,
  intervalMinutes = 30
) {
  const slots: string[] = [];
  const slotDate = new Date(date);
  slotDate.setSeconds(0, 0);

  for (
    let hour = startHour;
    hour < endHour || (hour === Math.floor(endHour) && endHour % 1 !== 0);
    hour += intervalMinutes / 60
  ) {
    slotDate.setHours(Math.floor(hour), (hour % 1) * 60, 0, 0);
    const label = slotDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    slots.push(label);
  }
  return slots;
}

function getAvailableSlots() {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const closeDate = new Date(today);
  closeDate.setHours(Math.floor(CLOSE_TIME), (CLOSE_TIME % 1) * 60, 0, 0);

  if (now < closeDate) {
    // Today: from next available slot after now to 9:30pm
    const nextSlot = new Date(now);
    nextSlot.setSeconds(0, 0);
    if (nextSlot.getHours() < OPEN_TIME) {
      nextSlot.setHours(OPEN_TIME, 0, 0, 0);
    } else if (nextSlot.getMinutes() < 30) {
      nextSlot.setMinutes(30, 0, 0);
    } else {
      nextSlot.setHours(nextSlot.getHours() + 1, 0, 0, 0);
    }
    // Ensure that if the nextSlot is still before closing time, show the slot
    const startHour = Math.max(
      OPEN_TIME,
      nextSlot.getHours() + nextSlot.getMinutes() / 60
    );
    // If current time is after or at 9:30pm, show tomorrow's slots
    if (startHour >= CLOSE_TIME) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return {
        date: tomorrow,
        slots: getTimeSlots(tomorrow, OPEN_TIME + 0.5, CLOSE_TIME),
      };
    }
    return {
      date: today,
      slots: getTimeSlots(today, startHour, CLOSE_TIME),
    };
  } else {
    // After 9:30pm: next day 10:30am to 9:30pm
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return {
      date: tomorrow,
      slots: getTimeSlots(tomorrow, OPEN_TIME + 0.5, CLOSE_TIME),
    };
  }
}

const SchedulePopUp = ({ action }: { action: () => void }) => {
  const { date, slots } = useMemo(getAvailableSlots, []);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [schedule, setSchedule] = useState("");

  // useEffect(() => {
  //   localStorage.setItem("slot", schedule);
  // }, [schedule]);

  return (
    <div className="p-6 rounded-lg bg-[#0e1113] text-[#f3f4f6] shadow-lg shadow-black/50">
      <h3 className="text-[#e5e7eb] text-lg font-semibold mb-2">
        Schedule a Time Slot
      </h3>
      <div>
        <div>
          <strong className="text-[#cbd5e1]">
            {date.toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </strong>
        </div>
        <div className="relative mt-3 w-60">
          <button
            type="button"
            className="w-full flex justify-between items-center cursor-pointer p-2 bg-[#181c1f] text-[#f3f4f6] border border-[#23272b] rounded focus:border-[#ff1200] focus:outline-none focus:ring-2 focus:ring-[#ff1200] text-left"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {schedule || "Select a time slot"} <BiChevronDown size={20} />
          </button>
          {dropdownOpen && (
            <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-[#181c1f] border border-[#23272b] rounded shadow-lg">
              <div
                onClick={() => {
                  setSchedule("");
                  setDropdownOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-[#ff1200] hover:text-white ${
                  schedule === "" ? "bg-[#23272b]" : ""
                }`}
              >
                None
              </div>
              {slots.map((slot) => (
                <div
                  key={slot}
                  onClick={() => {
                    setSchedule(slot);
                    setDropdownOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-[#ff1200] hover:text-white ${
                    schedule === slot ? "bg-[#23272b]" : ""
                  }`}
                >
                  {slot}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        {schedule && (
          <div className="mt-4 text-[#ff1200] font-semibold">
            <strong>Selected:</strong> {schedule}
          </div>
        )}
      </div>
      <div className="w-full flex justify-center items-center pt-4">
        <button
          onClick={() => {
            action();
          }}
          className="bg-[#0e1113] border border-[#ff1200] py-2 px-4 rounded-lg cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SchedulePopUp;
