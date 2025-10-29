import React, { useMemo, useState } from "react";
import { Music, Calendar as CalendarIcon, MapPin, Phone, Mail, Facebook, Instagram, Youtube, Ticket, Clock, Building2, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

const ACCENT = "#a6ff00";
const ACCENT_RING = "ring-[rgba(166,255,0,0.35)]";

const EVENTS = [
  { id: "e1", title: "Labor 12 + Guests", date: "2025-11-15", doors: "7:00 PM", show: "8:00 PM", price: "$25 adv / $30 door", tag: "Rock" },
  { id: "e2", title: "Holiday Market & Makers Fair", date: "2025-12-06", doors: "10:00 AM", show: "", price: "Free Entry", tag: "Market" },
  { id: "e3", title: "New Year’s Bash w/ DJ Neon", date: "2025-12-31", doors: "8:00 PM", show: "9:30 PM", price: "$40 GA", tag: "Dance" },
  { id: "e4", title: "Private Conference – Amarillo Tech Meetup", date: "2026-01-18", doors: "8:00 AM", show: "9:00 AM", price: "By Invite", tag: "Corporate" }
];

function classNames(...c) { return c.filter(Boolean).join(" "); }
function toDateStr(d){ return d.toISOString().slice(0,10); }
function getMonthMatrix(year, monthIndex){
  const first = new Date(year, monthIndex, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay()+6)%7));
  const weeks = [];
  let cur = new Date(start);
  for (let w=0; w<6; w++){
    const days = [];
    for (let i=0; i<7; i++){
      days.push(new Date(cur));
      cur.setDate(cur.getDate()+1);
    }
    weeks.push(days);
  }
  return weeks;
}

const TAGS = ["All", "Rock", "Dance", "Market", "Corporate"];

function Pill({children}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
      <CheckCircle2 size={14} style={{color: ACCENT}}/> {children}
    </span>
  );
}

function Section({id, heading, sub, children}) {
  return (
    <section id={id} className="relative py-16 sm:py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-black to-black"/>
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            <span className="pr-2" style={{color: ACCENT}}>▍</span>{heading}
          </h2>
          {sub && <p className="mt-2 max-w-3xl text-white/70">{sub}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function EventCard({evt}) {
  const d = new Date(evt.date);
  const day = d.toLocaleDateString(undefined, { day: '2-digit'});
  const mon = d.toLocaleDateString(undefined, { month: 'short'});
  const weekday = d.toLocaleDateString(undefined, { weekday: 'short'});
  return (
    <div className={classNames(
      "group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm hover:translate-y-[-2px] transition",
      `hover:shadow-[0_0_0_2px_${ACCENT}]`
    )}>
      <div className="flex items-center gap-4">
        <div className="flex w-14 flex-col items-center justify-center rounded-xl bg-black/60 border border-white/10 p-2">
          <span className="text-xs uppercase text-white/60">{weekday}</span>
          <span className="text-2xl font-bold" style={{color: ACCENT}}>{day}</span>
          <span className="text-xs uppercase text-white/60">{mon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-white truncate">{evt.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-1"><Clock size={16}/> {evt.doors && <>Doors {evt.doors}</>} {evt.show && <> · Show {evt.show}</>}</span>
            <span className="inline-flex items-center gap-1"><Ticket size={16}/> {evt.price}</span>
            {evt.tag && <span className="rounded-md border border-white/10 bg-black/50 px-2 py-0.5 text-xs" style={{color: ACCENT}}>{evt.tag}</span>}
          </div>
        </div>
        <a href="#tickets" className={classNames("shrink-0 rounded-xl px-3 py-2 text-sm font-semibold transition", `bg-[${ACCENT}] text-black hover:brightness-90`)}>
          Tickets
        </a>
      </div>
    </div>
  );
}

function MonthCalendar({value, onChange, events}) {
  const year = value.getFullYear();
  const mIndex = value.getMonth();
  const weeks = useMemo(()=>getMonthMatrix(year, mIndex), [year, mIndex]);
  const eventDates = useMemo(()=> new Set(events.map(e=>e.date)), [events]);

  const monthLabel = value.toLocaleDateString(undefined, { month: 'long', year: 'numeric'});

  function prev(){ const d=new Date(value); d.setMonth(value.getMonth()-1); onChange(d); }
  function next(){ const d=new Date(value); d.setMonth(value.getMonth()+1); onChange(d); }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={prev} className={classNames("rounded-xl border border-white/10 p-2 hover:bg-white/10", ACCENT_RING)}>
          <ChevronLeft />
        </button>
        <div className="text-lg font-semibold" style={{color: ACCENT}}>{monthLabel}</div>
        <button onClick={next} className={classNames("rounded-xl border border-white/10 p-2 hover:bg-white/10", ACCENT_RING)}>
          <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase text-white/60">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=> <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {weeks.flat().map((d, idx)=>{
          const inMonth = d.getMonth() === mIndex;
          const key = toDateStr(d);
          const hasEvent = eventDates.has(key);
          return (
            <div key={idx} className={classNames(
              "aspect-square rounded-xl border p-1 text-right text-sm",
              inMonth ? "border-white/10 bg-black/40" : "border-white/5 bg-black/20 text-white/40"
            )}>
              <div className="flex h-full w-full flex-col items-end">
                <span className="pr-1 pt-1">{d.getDate()}</span>
                {hasEvent && <span className="mt-auto mb-1 h-1.5 w-1.5 rounded-full" style={{backgroundColor: ACCENT}}/>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RockwellEventCenterSite() {
  const [filter, setFilter] = useState("All");
  const [month, setMonth] = useState(()=>{ const d=new Date(); d.setDate(1); return d; });

  const filtered = useMemo(()=>{
    if(filter === "All") return EVENTS;
    return EVENTS.filter(e=> e.tag === filter);
  }, [filter]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="#home" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg border border-white/20 bg-black/70" style={{boxShadow: `0 0 0 2px ${ACCENT} inset`}}/>
            <span className="text-lg font-bold tracking-wide">ROCKWELL <span className="text-white/60">EVENT CENTER</span></span>
          </a>
          <nav className="hidden gap-6 sm:flex text-sm">
            {[
              ["Events", "#events"],
              ["Venue", "#venue"],
              ["Host an Event", "#host"],
              ["Contact", "#contact"],
            ].map(([label,href])=> (
              <a key={label} href={href} className="hover:text-white/80" style={{color: ACCENT}}>{label}</a>
            ))}
          </nav>
          <a href="#host" className="rounded-xl px-3 py-2 text-sm font-semibold" style={{backgroundColor: ACCENT, color: "#000"}}>Book Now</a>
        </div>
      </header>

      <Section id="events" heading="Events & Calendar" sub="Discover what's on deck and plan your night out.">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-white/70">Filter:</span>
              {TAGS.map(t=> (
                <button key={t} onClick={()=>setFilter(t)} className={classNames(
                  "rounded-full border px-3 py-1 text-sm",
                  filter===t ? "border-white/20 bg-white/10" : "border-white/10 hover:bg-white/5"
                )} style={filter===t?{boxShadow:`0 0 0 2px ${ACCENT} inset`, color: ACCENT}:{}}>
                  {t}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filtered.map(evt => <EventCard key={evt.id} evt={evt} />)}
              {filtered.length===0 && <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">No events match this filter.</div>}
            </div>
          </div>
          <div className="md:col-span-1">
            <MonthCalendar value={month} onChange={setMonth} events={EVENTS} />
            <div className="mt-3 text-xs text-white/60">Dots mark days with events.</div>
          </div>
        </div>
      </Section>
    </div>
  );
}
