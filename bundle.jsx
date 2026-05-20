// ============= bundle.jsx =============
// (concatenated from data, icons, components, views, export, app)

// Mock student data: ม.5/3 — 45 คน
// ชื่อสมมติ — generic Thai names

const FIRST_NAMES_M = [
  "กิตติ", "ชนินทร์", "ณัฐพล", "ธนกร", "ปรเมศวร์", "พิชญุตม์", "ภาคิน", "ศุภกร",
  "อนุภัทร", "ธีรภัทร", "วชิรวิทย์", "ปุณยวีร์", "ภูริช", "นภัส", "วรเมธ",
  "ชยพล", "สิรภพ", "ปกรณ์", "อัครพล", "ธนากร", "พีรพัฒน์", "กฤตเมธ",
];

const FIRST_NAMES_F = [
  "ปาณิศา", "ณัฐนิชา", "ศิรประภา", "ปวีณ์ธิดา", "พิมพ์ลภัส", "ภัทรวดี",
  "ชนัญชิดา", "อนัญญา", "ธัญชนก", "กชกร", "พิชญา", "วรินทร",
  "ปรียาภัทร", "ณัฏฐธิดา", "ลภัสรดา", "สุพิชญา", "ฐิติรัตน์", "พรรณวรท",
  "วรัทยา", "นันท์นภัส", "อรปรียา", "เบญจรัตน์", "ชาลิสา",
];

const LAST_NAMES = [
  "ศรีสุข", "ทองดี", "พงษ์เจริญ", "วัฒนสุข", "บุญมา", "สมบูรณ์", "อินทรประเสริฐ",
  "เจริญรัตน์", "วงศ์วาน", "แสงทอง", "พรหมศรี", "ใจดี", "มั่นคง", "สว่างใจ",
  "นิลพัฒน์", "ขจรเดช", "สีหราช", "พัฒนากุล", "เกษมสุข", "ธรรมรักษ์",
  "ปัญญาวงศ์", "บุญยรัตน์", "ชาญชัย", "วิเศษศรี", "ตั้งใจดี",
];

function rand(arr, seed) {
  return arr[seed % arr.length];
}

function genStudents() {
  const students = [];
  for (let i = 0; i < 45; i++) {
    const isM = i % 2 === 0;
    const firstPool = isM ? FIRST_NAMES_M : FIRST_NAMES_F;
    const seed = i * 13 + 7;
    const first = rand(firstPool, Math.floor(seed * 1.3));
    const last = rand(LAST_NAMES, Math.floor(seed * 0.7));
    students.push({
      id: `s${String(i + 1).padStart(2, '0')}`,
      number: i + 1,
      firstName: first,
      lastName: last,
      gender: isM ? "ช" : "ญ",
      studentId: `${66000 + 300 + i}`,
    });
  }
  return students;
}

const INITIAL_STUDENTS = genStudents();

// Generate sample attendance for past 30 school days for variety
function genSampleAttendance() {
  const data = {};
  const today = new Date();
  // Start about 60 days back, only weekdays
  for (let d = 60; d >= 1; d--) {
    const date = new Date(today);
    date.setDate(today.getDate() - d);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue; // skip weekends
    const key = formatDate(date);
    const dayRecord = {};
    INITIAL_STUDENTS.forEach((s, idx) => {
      // pseudo-random pattern, mostly present
      const r = (idx * 17 + d * 31) % 100;
      let status = "present";
      if (r < 4) status = "absent";
      else if (r < 7) status = "leave";
      else if (r < 12) status = "late";
      dayRecord[s.id] = { status, note: "" };
    });
    data[key] = dayRecord;
  }
  return data;
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const STATUSES = [
  { key: "present", label: "มา", short: "ม", cls: "present" },
  { key: "absent",  label: "ขาด", short: "ข", cls: "absent" },
  { key: "leave",   label: "ลา", short: "ล", cls: "leave" },
  { key: "late",    label: "สาย", short: "ส", cls: "late" },
];

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
const THAI_MONTHS_SHORT = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];
const THAI_DAYS = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

function formatThaiDate(d) {
  return `${d.getDate()} ${THAI_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}
function formatThaiDateShort(d) {
  return `${d.getDate()} ${THAI_MONTHS_SHORT[d.getMonth()]} ${(d.getFullYear() + 543) % 100}`;
}
function thaiWeekday(d) { return "วัน" + THAI_DAYS[d.getDay()]; }

// Term info — for a school year, term 1 (พ.ค.–ก.ย.), term 2 (พ.ย.–มี.ค.)
function getTermInfo(date) {
  const d = date || new Date();
  const m = d.getMonth(); // 0-11
  const y = d.getFullYear();
  // Term 1: May (4) – Sep (8) of year Y, academic year Y
  // Term 2: Nov (10)–Mar (2) (next year), academic year Y if Nov-Dec, else Y-1 if Jan-Mar
  let term, ay, start, end;
  if (m >= 4 && m <= 8) {
    term = 1; ay = y;
    start = new Date(y, 4, 1);
    end = new Date(y, 8, 30);
  } else if (m >= 10) {
    term = 2; ay = y;
    start = new Date(y, 10, 1);
    end = new Date(y + 1, 2, 31);
  } else if (m <= 2) {
    term = 2; ay = y - 1;
    start = new Date(y - 1, 10, 1);
    end = new Date(y, 2, 31);
  } else {
    // ปิดเทอม
    term = 1; ay = y;
    start = new Date(y, 4, 1);
    end = new Date(y, 8, 30);
  }
  return { term, ay, start, end, label: `เทอม ${term}/${(ay + 543)}` };
}

// All weekday dates in a term
function termDates(termInfo) {
  const out = [];
  const d = new Date(termInfo.start);
  while (d <= termInfo.end) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

Object.assign(window, {
  INITIAL_STUDENTS, STATUSES, genSampleAttendance,
  formatDate, parseDate, formatThaiDate, formatThaiDateShort,
  thaiWeekday, THAI_MONTHS, THAI_MONTHS_SHORT, THAI_DAYS,
  getTermInfo, termDates,
});


// Lightweight inline SVG icons — stroke-based, 20px default
const Icon = ({ name, size = 20, ...props }) => {
  const paths = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    chevronLeft: <path d="M15 6l-6 6 6 6"/>,
    chevronRight: <path d="M9 6l6 6-6 6"/>,
    chevronDown: <path d="M6 9l6 6 6-6"/>,
    refresh: <><path d="M3 12a9 9 0 019-9c2.5 0 4.7 1 6.3 2.7L21 8M21 4v4h-4"/><path d="M21 12a9 9 0 01-9 9c-2.5 0-4.7-1-6.3-2.7L3 16M3 20v-4h4"/></>,
    download: <><path d="M12 4v12m0 0l-4-4m4 4l4-4"/><path d="M4 20h16"/></>,
    check: <path d="M5 12l5 5 9-11"/>,
    checkAll: <><path d="M3 12l4 4 8-10"/><path d="M9 14l4 4 8-10"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    trash: <><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13"/><path d="M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"/></>,
    edit: <><path d="M4 20h4l10-10-4-4L4 16v4z"/><path d="M14 6l4 4"/></>,
    note: <><path d="M5 4h10l4 4v12a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"/><path d="M14 4v5h5"/><path d="M8 13h7M8 17h5"/></>,
    search: <><circle cx="11" cy="11" r="6"/><path d="M20 20l-3.5-3.5"/></>,
    close: <path d="M6 6l12 12M6 18L18 6"/>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 19a6 6 0 0112 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a4 4 0 015 4"/></>,
    history: <><path d="M3 12a9 9 0 109-9c-3 0-5.5 1.3-7 3.5"/><path d="M3 4v4h4"/><path d="M12 7v5l3 2"/></>,
    excel: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M3 12h6"/><path d="M14 9l4 6M18 9l-4 6"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></>,
    save: <><path d="M5 4h11l3 3v13a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"/><rect x="7" y="13" width="10" height="7"/><path d="M7 4v5h7V4"/></>,
    cloudUp: <><path d="M7 18a5 5 0 01-1-9.9 7 7 0 0113.5 2A4.5 4.5 0 0118 18"/><path d="M12 12v8m0-8l-3 3m3-3l3 3"/></>,
    cloudDown: <><path d="M7 18a5 5 0 01-1-9.9 7 7 0 0113.5 2A4.5 4.5 0 0118 18"/><path d="M12 20v-8m0 8l-3-3m3 3l3-3"/></>,
    upload: <><path d="M12 20V8m0 0l-4 4m4-4l4 4"/><path d="M4 4h16"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {paths[name]}
    </svg>
  );
};

window.Icon = Icon;

// Helper: ชื่อเต็ม รวมคำนำหน้า (ถ้ามี)
function fullName(s) {
  if (!s) return "";
  const parts = [s.prefix, s.firstName, s.lastName].filter(x => x && String(x).trim());
  return parts.join(" ");
}
window.fullName = fullName;


// Shared components

const Modal = ({ title, children, onClose, footer }) => {
  React.useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="modal-overlay" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="btn-ghost btn-icon" onClick={onClose} aria-label="ปิด">
            <Icon name="close" size={18}/>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

const Toast = ({ msg, onDone }) => {
  React.useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [msg, onDone]);
  return <div className="toast">{msg}</div>;
};

const StatusButtonGroup = ({ value, onChange }) => (
  <div className="status-group" role="radiogroup">
    {window.STATUSES.map(s => (
      <button
        key={s.key}
        className={`status-btn ${s.cls} ${value === s.key ? 'active' : ''}`}
        onClick={() => onChange(s.key)}
        role="radio"
        aria-checked={value === s.key}
      >
        {s.label}
      </button>
    ))}
  </div>
);

const SummaryCards = ({ counts, total }) => (
  <div className="summary">
    {window.STATUSES.map(s => (
      <div key={s.key} className={`summary-card ${s.cls}`}>
        <div className="label"><span className="dot"></span>{s.label}</div>
        <div className="value">{counts[s.key] || 0}</div>
        <div className="sub">จาก {total} คน · {total ? Math.round((counts[s.key] || 0) / total * 100) : 0}%</div>
      </div>
    ))}
  </div>
);

const DateControl = ({ date, onChange }) => {
  const d = window.parseDate(date);
  const shift = (n) => {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + n);
    onChange(window.formatDate(nd));
  };
  return (
    <div className="date-control">
      <button className="nav-btn" onClick={() => shift(-1)} aria-label="วันก่อนหน้า">
        <Icon name="chevronLeft" size={16}/>
      </button>
      <div className="date-display">
        {window.formatThaiDate(d)}
        <span className="weekday">{window.thaiWeekday(d)}</span>
      </div>
      <input type="date" value={date} onChange={(e) => onChange(e.target.value)} />
      <button className="nav-btn" onClick={() => shift(1)} aria-label="วันถัดไป">
        <Icon name="chevronRight" size={16}/>
      </button>
    </div>
  );
};

Object.assign(window, { Modal, Toast, StatusButtonGroup, SummaryCards, DateControl });


// =========================================================
// Daily attendance view
// =========================================================
const DailyView = ({ students, date, setDate, dayRecord, setStatus, setNote, markAll, toast }) => {
  const [search, setSearch] = React.useState("");
  const [noteEditing, setNoteEditing] = React.useState(null); // student id
  const [noteDraft, setNoteDraft] = React.useState("");

  const filtered = students.filter(s =>
    !search ||
    (fullName(s)).includes(search) ||
    s.studentId.includes(search) ||
    String(s.number).includes(search)
  );

  const counts = React.useMemo(() => {
    const c = { present: 0, absent: 0, leave: 0, late: 0 };
    students.forEach(s => {
      const r = dayRecord[s.id];
      if (r && c[r.status] !== undefined) c[r.status]++;
    });
    return c;
  }, [students, dayRecord]);

  const completed = students.filter(s => dayRecord[s.id]).length;

  const openNote = (student) => {
    setNoteEditing(student);
    setNoteDraft(dayRecord[student.id]?.note || "");
  };

  return (
    <>
      <div className="toolbar">
        <DateControl date={date} onChange={setDate} />
        <div className="toolbar-actions">
          <button className="btn btn-secondary" onClick={() => markAll('present')}>
            <Icon name="checkAll" size={16}/>
            มาทั้งห้อง
          </button>
        </div>
      </div>

      <SummaryCards counts={counts} total={students.length} />

      <DailySummary students={students} dayRecord={dayRecord} />

      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">รายชื่อนักเรียน</div>
            <div className="panel-sub">บันทึกแล้ว {completed}/{students.length} คน</div>
          </div>
          <div className="search-box">
            <Icon name="search" size={16} style={{color: 'var(--text-subtle)'}}/>
            <input
              placeholder="ค้นหาชื่อ / เลขที่ / รหัส"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="title">ไม่พบนักเรียน</div>
            <div>ลองค้นหาด้วยคำอื่น</div>
          </div>
        ) : filtered.map(s => {
          const rec = dayRecord[s.id] || {};
          return (
            <div className="student-row" key={s.id}>
              <div className="num">{String(s.number).padStart(2, '0')}</div>
              <div className="name">
                <div className="full">{fullName(s)}</div>
                <div className="meta">รหัส {s.studentId} · {s.gender}</div>
              </div>
              <StatusButtonGroup
                value={rec.status}
                onChange={(st) => setStatus(s.id, st)}
              />
              <button
                className={`note-btn ${rec.note ? 'has-note' : ''}`}
                onClick={() => openNote(s)}
                title={rec.note || "เพิ่มหมายเหตุ"}
                aria-label="หมายเหตุ"
              >
                <Icon name="note" size={18}/>
              </button>
            </div>
          );
        })}
      </div>

      {noteEditing && (
        <Modal
          title={`หมายเหตุ — ${fullName(noteEditing)}`}
          onClose={() => setNoteEditing(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setNoteEditing(null)}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={() => {
                setNote(noteEditing.id, noteDraft);
                setNoteEditing(null);
                toast(noteDraft ? "บันทึกหมายเหตุแล้ว" : "ลบหมายเหตุแล้ว");
              }}>
                <Icon name="save" size={16}/>บันทึก
              </button>
            </>
          }
        >
          <div className="field">
            <label>เหตุผล / รายละเอียด</label>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="เช่น ใบลาป่วย, มาสาย 15 นาที, ลากิจไปงานญาติ ฯลฯ"
              autoFocus
            />
          </div>
          <div className="subtle">หมายเหตุจะแสดงเป็นหมายเหตุประกอบในไฟล์ Excel ที่ส่งออก</div>
        </Modal>
      )}
    </>
  );
};

window.DailyView = DailyView;


// =========================================================
// History view — per-term matrix
// =========================================================
const HistoryView = ({ students, attendance }) => {
  const [termOffset, setTermOffset] = React.useState(0); // 0 = current, -1 = previous

  // Compute term to show
  const today = new Date();
  let baseInfo = window.getTermInfo(today);
  // Shift by termOffset (each term ~6 months)
  const shiftedBase = new Date(baseInfo.start);
  shiftedBase.setMonth(shiftedBase.getMonth() + termOffset * 6);
  const termInfo = window.getTermInfo(shiftedBase);

  const dates = window.termDates(termInfo);
  const dateKeys = dates.map(d => window.formatDate(d));

  // Per-student totals
  const totals = React.useMemo(() => {
    const out = {};
    students.forEach(s => {
      out[s.id] = { present: 0, absent: 0, leave: 0, late: 0 };
      dateKeys.forEach(k => {
        const r = attendance[k]?.[s.id];
        if (r && out[s.id][r.status] !== undefined) out[s.id][r.status]++;
      });
    });
    return out;
  }, [students, attendance, termInfo.start.getTime()]);

  return (
    <div className="history-grid">
      <div className="term-picker">
        <h3>ภาคเรียน</h3>
        <div style={{display:'flex', flexDirection:'column', gap: 8}}>
          {[0, -1, -2].map(off => {
            const b = new Date(baseInfo.start);
            b.setMonth(b.getMonth() + off * 6);
            const ti = window.getTermInfo(b);
            const active = off === termOffset;
            return (
              <button
                key={off}
                className={`btn ${active ? 'btn-primary' : 'btn-secondary'}`}
                style={{justifyContent:'flex-start'}}
                onClick={() => setTermOffset(off)}
              >
                {ti.label}
              </button>
            );
          })}
        </div>
        <div className="divider"></div>
        <div className="subtle">
          <div>เริ่ม: {window.formatThaiDateShort(termInfo.start)}</div>
          <div>สิ้นสุด: {window.formatThaiDateShort(termInfo.end)}</div>
          <div style={{marginTop:8}}>วันเรียน {dateKeys.length} วัน</div>
        </div>
      </div>

      <div className="history-table-wrap">
        <table className="history-table">
          <thead>
            <tr>
              <th>#</th>
              <th className="name" style={{position:'sticky', left:0, background:'var(--surface-2)'}}>ชื่อ-นามสกุล</th>
              <th>มา</th>
              <th>ขาด</th>
              <th>ลา</th>
              <th>สาย</th>
              {dates.map((d, i) => (
                <th key={i} className="date">{d.getDate()}/{d.getMonth()+1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(s => {
              const t = totals[s.id];
              return (
                <tr key={s.id}>
                  <td className="num">{s.number}</td>
                  <td className="name">{fullName(s)}</td>
                  <td><span className="status-pill present">{t.present}</span></td>
                  <td><span className="status-pill absent">{t.absent}</span></td>
                  <td><span className="status-pill leave">{t.leave}</span></td>
                  <td><span className="status-pill late">{t.late}</span></td>
                  {dateKeys.map(k => {
                    const r = attendance[k]?.[s.id];
                    if (!r) return <td key={k} className="date"><span className="status-pill empty">—</span></td>;
                    const cfg = window.STATUSES.find(x => x.key === r.status);
                    return (
                      <td key={k} className="date" title={r.note}>
                        <span className={`status-pill ${cfg.cls}`}>{cfg.short}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

window.HistoryView = HistoryView;
window.computeTermInfo = (offset) => {
  const base = window.getTermInfo(new Date());
  const shifted = new Date(base.start);
  shifted.setMonth(shifted.getMonth() + offset * 6);
  return window.getTermInfo(shifted);
};


// =========================================================
// Room Switcher (dropdown) — สลับระหว่างห้องต่างๆ
// =========================================================
const RoomSwitcher = ({ rooms, activeRoomId, onSwitch, onAdd, onRename, onRemove, studentCount }) => {
  const [open, setOpen] = React.useState(false);
  const [renaming, setRenaming] = React.useState(null); // room object
  const [adding, setAdding] = React.useState(false);
  const [draftName, setDraftName] = React.useState("");
  const ref = React.useRef(null);

  const active = rooms.find(r => r.id === activeRoomId) || rooms[0];

  React.useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleAddSubmit = () => {
    const n = draftName.trim();
    if (!n) return;
    onAdd(n);
    setAdding(false);
    setDraftName("");
    setOpen(false);
  };

  const handleRenameSubmit = () => {
    const n = draftName.trim();
    if (!n || !renaming) return;
    onRename(renaming.id, n);
    setRenaming(null);
    setDraftName("");
  };

  const handleRemove = (room) => {
    if (window.confirm(`ลบห้อง "${room.name}"?\nข้อมูลนักเรียน ${room.students.length} คน และประวัติเช็คชื่อทั้งหมดจะหายไป\n\nต้องการดำเนินการต่อ?`)) {
      onRemove(room.id);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '2px 8px', marginTop: 1,
          background: 'var(--surface-2)', borderRadius: 6,
          fontSize: 13, color: 'var(--text-muted)',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontWeight: 500, color: 'var(--text)' }}>{active?.name || '—'}</span>
        <span>· {studentCount} คน</span>
        <Icon name="chevronDown" size={12}/>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0,
          minWidth: 240, background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 8,
          boxShadow: 'var(--shadow)', zIndex: 50, padding: 6,
        }}>
          {rooms.map(r => (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '6px 8px', borderRadius: 6,
              background: r.id === activeRoomId ? 'var(--surface-2)' : 'transparent',
            }}>
              <button
                onClick={() => { onSwitch(r.id); setOpen(false); }}
                style={{
                  flex: 1, textAlign: 'left',
                  fontSize: 14,
                  color: 'var(--text)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: r.id === activeRoomId ? 500 : 400 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.students.length} คน</div>
              </button>
              <button
                title="แก้ไขชื่อห้อง"
                onClick={(e) => { e.stopPropagation(); setRenaming(r); setDraftName(r.name); }}
                style={{ padding: 4, borderRadius: 4, color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <Icon name="edit" size={14}/>
              </button>
              {rooms.length > 1 && (
                <button
                  title="ลบห้องนี้"
                  onClick={(e) => { e.stopPropagation(); handleRemove(r); }}
                  style={{ padding: 4, borderRadius: 4, color: 'var(--absent)', cursor: 'pointer' }}
                >
                  <Icon name="trash" size={14}/>
                </button>
              )}
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }}/>
          {!adding ? (
            <button
              onClick={() => { setAdding(true); setDraftName(""); }}
              style={{
                width: '100%', textAlign: 'left',
                padding: '6px 8px', borderRadius: 6,
                color: 'var(--text)', fontSize: 14,
                display: 'flex', alignItems: 'center', gap: 6,
                cursor: 'pointer',
              }}
            >
              <Icon name="plus" size={14}/> เพิ่มห้องใหม่
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 4, padding: '4px' }}>
              <input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubmit(); if (e.key === 'Escape') setAdding(false); }}
                placeholder="เช่น ม.5/4"
                autoFocus
                style={{ flex: 1, padding: '6px 8px', border: '1px solid var(--border-strong)', borderRadius: 6, fontSize: 14 }}
              />
              <button onClick={handleAddSubmit} className="btn btn-primary btn-sm">เพิ่ม</button>
            </div>
          )}
        </div>
      )}

      {renaming && (
        <Modal
          title="แก้ไขชื่อห้อง"
          onClose={() => { setRenaming(null); setDraftName(""); }}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => { setRenaming(null); setDraftName(""); }}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={handleRenameSubmit}><Icon name="save" size={16}/>บันทึก</button>
            </>
          }
        >
          <div className="field">
            <label>ชื่อห้อง</label>
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmit(); }}
              autoFocus
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
window.RoomSwitcher = RoomSwitcher;


// =========================================================
// Daily Summary — แสดงรายชื่อคนขาด/ลา/มาสาย
// =========================================================
const DailySummary = ({ students, dayRecord }) => {
  const groups = { absent: [], leave: [], late: [] };
  students.forEach(s => {
    const rec = dayRecord[s.id];
    if (rec && groups[rec.status]) {
      groups[rec.status].push({ ...s, note: rec.note });
    }
  });

  const sections = [
    { key: 'absent', label: 'ขาด', color: 'var(--absent)', bg: 'var(--absent-bg)', border: 'var(--absent-border)' },
    { key: 'leave', label: 'ลา', color: 'var(--leave)', bg: 'var(--leave-bg)', border: 'var(--leave-border)' },
    { key: 'late', label: 'มาสาย', color: 'var(--late)', bg: 'var(--late-bg)', border: 'var(--late-border)' },
  ];

  const totalAbnormal = groups.absent.length + groups.leave.length + groups.late.length;
  if (totalAbnormal === 0) {
    return (
      <div className="panel" style={{ marginBottom: 16, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🎉</span>
          <div>
            <div style={{ fontWeight: 500 }}>มากันครบทั้งห้อง!</div>
            <div className="subtle">ไม่มีคนขาด ลา หรือมาสาย</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel" style={{ marginBottom: 16 }}>
      <div className="panel-header" style={{ padding: '10px 18px' }}>
        <div className="panel-title">สรุปวันนี้</div>
        <div className="panel-sub">{totalAbnormal} คน · มา {students.length - totalAbnormal} คน</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 1, background: 'var(--border)' }}>
        {sections.map(sec => {
          const list = groups[sec.key];
          return (
            <div key={sec.key} style={{ background: 'var(--surface)', padding: '12px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{
                  display: 'inline-block', width: 8, height: 8, borderRadius: 99,
                  background: sec.color,
                }}/>
                <span style={{ fontWeight: 500 }}>{sec.label}</span>
                <span style={{
                  background: sec.bg, color: sec.color,
                  fontSize: 12, padding: '1px 8px', borderRadius: 10,
                  fontWeight: 600,
                }}>
                  {list.length}
                </span>
              </div>
              {list.length === 0 ? (
                <div className="subtle" style={{ fontSize: 13 }}>—</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {list.map(s => (
                    <div key={s.id} style={{ fontSize: 13, lineHeight: 1.4 }}>
                      <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', marginRight: 6 }}>
                        {String(s.number).padStart(2, '0')}
                      </span>
                      {fullName(s)}
                      {s.note && (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 28, marginTop: 1 }}>
                          ↳ {s.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
window.DailySummary = DailySummary;



const ImportStudentsModal = ({ onClose, onImport }) => {
  const [mode, setMode] = React.useState('file'); // 'file' | 'paste'
  const [pasteText, setPasteText] = React.useState('');
  const [parsed, setParsed] = React.useState(null); // { rows, headers, error }
  const [loading, setLoading] = React.useState(false);

  // แปลง array of cells (row) → student object
  // รองรับคอลัมน์: เลขที่ | เลขประจำตัว | คำนำหน้า | ชื่อ | นามสกุล
  // ถ้ามีน้อยกว่า ก็ map ตามที่มี
  function parseRows(rows) {
    if (!rows || rows.length === 0) return [];

    // ตรวจหา header row โดยมองหาคำสำคัญ
    let dataStart = 0;
    let columnMap = { number: 0, studentId: 1, prefix: 2, firstName: 3, lastName: 4 };

    const headerRow = rows[0].map(c => String(c || '').trim());
    const hasHeader = headerRow.some(c =>
      /เลขที่|ลำดับ|number|no\.?$/i.test(c) ||
      /ชื่อ|name/i.test(c) ||
      /รหัส|เลขประจำตัว|id$/i.test(c)
    );

    if (hasHeader) {
      dataStart = 1;
      columnMap = {};
      headerRow.forEach((h, i) => {
        if (/เลขที่|ลำดับ|^no\.?$|^#$/i.test(h)) columnMap.number = i;
        else if (/รหัส|เลขประจำตัว|^id$|student.*id/i.test(h)) columnMap.studentId = i;
        else if (/คำนำ|prefix|title/i.test(h)) columnMap.prefix = i;
        else if (/ชื่อจริง|^ชื่อ$|first.*name|fname/i.test(h)) columnMap.firstName = i;
        else if (/นามสกุล|last.*name|lname|surname/i.test(h)) columnMap.lastName = i;
        else if (/ชื่อ.*สกุล|name$/i.test(h) && columnMap.firstName === undefined) columnMap.firstName = i;
      });
    }

    const students = [];
    for (let i = dataStart; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.every(c => !c || String(c).trim() === '')) continue;

      const get = (key) => {
        const idx = columnMap[key];
        if (idx === undefined) return '';
        const v = row[idx];
        return v === null || v === undefined ? '' : String(v).trim();
      };

      // คอลัมน์ "ชื่อ" ใน sheet เดิมอาจมีคำนำหน้า+ชื่อปนกัน (เช่น "นาย กิตติชัย")
      // ถ้าไม่มีคอลัมน์ prefix แยก ลองแยกจากชื่อ
      let prefix = get('prefix');
      let firstName = get('firstName');
      let lastName = get('lastName');

      if (!prefix && firstName) {
        const m = firstName.match(/^(นาย|นาง|น\.ส\.|นางสาว|เด็กชาย|เด็กหญิง|ด\.ช\.|ด\.ญ\.)\s*(.+)$/);
        if (m) {
          prefix = m[1];
          firstName = m[2];
        }
      }

      const numberRaw = get('number');
      const number = parseInt(numberRaw, 10);

      const student = {
        number: isNaN(number) ? (students.length + 1) : number,
        studentId: get('studentId'),
        prefix: prefix,
        firstName: firstName,
        lastName: lastName,
        gender: /หญิง|น\.ส\.|นางสาว|เด็กหญิง|ด\.ญ\./.test(prefix) ? 'ญ' : 'ช',
      };

      // ต้องมีอย่างน้อย firstName หรือ studentId
      if (student.firstName || student.studentId) {
        students.push(student);
      }
    }

    return students;
  }

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = window.XLSX.read(buf, { type: 'array' });
      const sheetName = wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const rows = window.XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      const students = parseRows(rows);
      if (students.length === 0) {
        setParsed({ error: 'ไม่พบข้อมูลนักเรียนในไฟล์ — ตรวจสอบรูปแบบหัวตาราง' });
      } else {
        setParsed({ students });
      }
    } catch (err) {
      console.error(err);
      setParsed({ error: 'อ่านไฟล์ไม่ได้: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleParsePaste = () => {
    setLoading(true);
    try {
      const lines = pasteText.split(/\r?\n/);
      const rows = lines.map(l => l.split('\t'));
      const students = parseRows(rows);
      if (students.length === 0) {
        setParsed({ error: 'ไม่พบข้อมูล — ลองตรวจสอบว่า Copy มาจาก Excel (เซลล์แยกด้วย Tab)' });
      } else {
        setParsed({ students });
      }
    } catch (err) {
      setParsed({ error: 'พาร์สไม่ได้: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!parsed || !parsed.students) return;
    if (!confirm(`จะนำเข้านักเรียน ${parsed.students.length} คน\n\n⚠️ การนำเข้าจะแทนที่รายชื่อเดิมทั้งหมด\nและลบประวัติเช็คชื่อเก่าด้วย\n\nต้องการดำเนินการต่อ?`)) return;
    onImport(parsed.students);
  };

  return (
    <Modal
      title="นำเข้ารายชื่อนักเรียน"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>ยกเลิก</button>
          {parsed && parsed.students && (
            <button className="btn btn-primary" onClick={handleConfirm}>
              <Icon name="check" size={16}/>นำเข้า {parsed.students.length} คน
            </button>
          )}
        </>
      }
    >
      {!parsed && (
        <>
          <div className="tabs" style={{ marginBottom: 16, width: 'fit-content' }}>
            <button className={mode === 'file' ? 'active' : ''} onClick={() => setMode('file')}>อัปโหลดไฟล์</button>
            <button className={mode === 'paste' ? 'active' : ''} onClick={() => setMode('paste')}>วางข้อความ</button>
          </div>

          {mode === 'file' && (
            <div>
              <div style={{ padding: 24, border: '2px dashed var(--border-strong)', borderRadius: 8, textAlign: 'center' }}>
                <Icon name="upload" size={32} style={{ color: 'var(--text-subtle)', marginBottom: 8 }}/>
                <div style={{ marginBottom: 12, color: 'var(--text-muted)' }}>เลือกไฟล์ Excel (.xlsx, .xls) หรือ CSV</div>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  style={{ display: 'block', margin: '0 auto' }}
                />
              </div>
            </div>
          )}

          {mode === 'paste' && (
            <div>
              <div className="field">
                <label>วางข้อมูลจาก Excel ที่นี่ (Ctrl+V)</label>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder={"เลขที่\tเลขประจำตัว\tคำนำหน้า\tชื่อ\tนามสกุล\n1\t04771\tนาย\tกิตติชัย\tมูลสาร\n2\t04813\tนาย\tกฤษณะ\tแกมนิล"}
                  style={{ minHeight: 160, fontFamily: 'monospace', fontSize: 13 }}
                />
              </div>
              <button className="btn btn-primary" onClick={handleParsePaste} disabled={!pasteText.trim() || loading}>
                ตรวจสอบข้อมูล
              </button>
            </div>
          )}

          <div className="divider"></div>
          <div className="subtle" style={{ lineHeight: 1.7 }}>
            <div style={{ fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>📋 รูปแบบที่รองรับ:</div>
            • แถวแรกเป็นหัวตาราง (เลขที่, เลขประจำตัว, คำนำหน้า, ชื่อ, นามสกุล)<br/>
            • ช่องว่างปล่อยว่างได้ — ระบบจะเว้นไว้<br/>
            • ถ้า "ชื่อ" มีคำนำหน้าปนมา (เช่น "นาย กิตติชัย") ระบบจะแยกอัตโนมัติ
          </div>
        </>
      )}

      {parsed && parsed.error && (
        <div style={{ padding: 16, background: 'var(--absent-bg)', color: 'var(--absent)', borderRadius: 8, marginBottom: 12 }}>
          ❌ {parsed.error}
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-sm btn-secondary" onClick={() => setParsed(null)}>ลองใหม่</button>
          </div>
        </div>
      )}

      {parsed && parsed.students && (
        <div>
          <div style={{ marginBottom: 12 }}>
            ✅ พบนักเรียน <strong>{parsed.students.length}</strong> คน — ตรวจสอบรายการก่อนนำเข้า:
          </div>
          <div style={{ maxHeight: 320, overflow: 'auto', border: '1px solid var(--border)', borderRadius: 8 }}>
            <table className="history-table" style={{ minWidth: 0, width: '100%' }}>
              <thead>
                <tr>
                  <th>เลขที่</th>
                  <th>รหัส</th>
                  <th>ชื่อ-สกุล</th>
                </tr>
              </thead>
              <tbody>
                {parsed.students.map((s, i) => (
                  <tr key={i}>
                    <td className="num">{s.number}</td>
                    <td className="num">{s.studentId || '—'}</td>
                    <td>{fullName(s) || <span style={{ color: 'var(--text-subtle)' }}>(ว่าง)</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 10 }}>
            <button className="btn btn-sm btn-ghost" onClick={() => setParsed(null)}>← เลือกไฟล์/วางข้อมูลใหม่</button>
          </div>
        </div>
      )}
    </Modal>
  );
};
window.ImportStudentsModal = ImportStudentsModal;


// =========================================================
// Manage students view
// =========================================================
const ManageView = ({ students, addStudent, removeStudent, updateStudent, toast }) => {
  const [adding, setAdding] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [draft, setDraft] = React.useState({ prefix: "", firstName: "", lastName: "", gender: "ช", studentId: "" });
  const [importing, setImporting] = React.useState(false);

  const startAdd = () => {
    const nextNum = (Math.max(0, ...students.map(s => s.number))) + 1;
    setDraft({
      prefix: "",
      firstName: "",
      lastName: "",
      gender: "ช",
      studentId: "",
    });
    setAdding(true);
  };

  const startEdit = (s) => {
    setEditing(s);
    setDraft({ prefix: s.prefix || "", firstName: s.firstName || "", lastName: s.lastName || "", gender: s.gender || "ช", studentId: s.studentId || "" });
  };

  const save = () => {
    if (!draft.firstName.trim()) { toast("กรุณากรอกชื่อ"); return; }
    if (editing) {
      updateStudent(editing.id, draft);
      toast("บันทึกข้อมูลแล้ว");
      setEditing(null);
    } else {
      addStudent(draft);
      toast("เพิ่มนักเรียนแล้ว");
      setAdding(false);
    }
  };

  const confirmDel = (s) => {
    if (confirm(`ลบ "${fullName(s)}" ออกจากห้อง?\nข้อมูลการเช็คชื่อย้อนหลังจะถูกลบด้วย`)) {
      removeStudent(s.id);
      toast("ลบนักเรียนแล้ว");
    }
  };

  return (
    <div className="manage-grid">
      <div className="panel">
        <div className="panel-header">
          <div>
            <div className="panel-title">จัดการรายชื่อนักเรียน</div>
            <div className="panel-sub">ทั้งหมด {students.length} คน</div>
          </div>
          <div style={{display:'flex', gap: 8, flexWrap: 'wrap'}}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (window.confirm("ใส่เลขที่ใหม่ 1, 2, 3, ... ตามลำดับปัจจุบัน?\n(ใช้หลังลบนักเรียนเพื่อให้เลขที่ไม่กระโดด)")) {
                  if (typeof window.resequenceStudents === 'function') window.resequenceStudents();
                }
              }}
              title="ใส่เลขที่ใหม่ 1, 2, 3, ..."
            >
              <Icon name="refresh" size={16}/>
              จัดลำดับ
            </button>
            <button className="btn btn-secondary" onClick={() => setImporting(true)}>
              <Icon name="upload" size={16}/>
              นำเข้ารายชื่อ
            </button>
            <button className="btn btn-primary" onClick={startAdd}>
              <Icon name="plus" size={16}/>
              เพิ่มนักเรียน
            </button>
          </div>
        </div>
        {students.length === 0 ? (
          <div className="empty">
            <div className="title">ยังไม่มีนักเรียน</div>
            <div>กดปุ่ม "เพิ่มนักเรียน" หรือ "นำเข้ารายชื่อ" เพื่อเริ่มต้น</div>
          </div>
        ) : students.map(s => (
          <div className="list-row" key={s.id}>
            <div className="num mono" style={{color:'var(--text-muted)'}}>{String(s.number).padStart(2, '0')}</div>
            <div className="name">
              <div style={{fontWeight: 500}}>{fullName(s)}</div>
              <div className="subtle">
                {s.studentId ? `รหัส ${s.studentId}` : ''}
                {s.studentId && s.gender ? ' · ' : ''}
                {s.gender ? `เพศ ${s.gender === 'ช' ? 'ชาย' : 'หญิง'}` : ''}
              </div>
            </div>
            <div className="row">
              <button className="btn btn-ghost btn-sm" onClick={() => startEdit(s)}>
                <Icon name="edit" size={14}/>แก้ไข
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => confirmDel(s)}>
                <Icon name="trash" size={14}/>ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      {(adding || editing) && (
        <Modal
          title={editing ? "แก้ไขข้อมูลนักเรียน" : "เพิ่มนักเรียนใหม่"}
          onClose={() => { setAdding(false); setEditing(null); }}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => { setAdding(false); setEditing(null); }}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={save}>
                <Icon name="save" size={16}/>บันทึก
              </button>
            </>
          }
        >
          <div className="field-row">
            <div className="field">
              <label>คำนำหน้า</label>
              <input value={draft.prefix} onChange={(e) => setDraft({...draft, prefix: e.target.value})} placeholder="เช่น นาย น.ส. เด็กชาย"/>
            </div>
            <div className="field">
              <label>เพศ</label>
              <select value={draft.gender} onChange={(e) => setDraft({...draft, gender: e.target.value})}>
                <option value="ช">ชาย</option>
                <option value="ญ">หญิง</option>
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>ชื่อจริง *</label>
              <input value={draft.firstName} onChange={(e) => setDraft({...draft, firstName: e.target.value})} autoFocus/>
            </div>
            <div className="field">
              <label>นามสกุล</label>
              <input value={draft.lastName} onChange={(e) => setDraft({...draft, lastName: e.target.value})}/>
            </div>
          </div>
          <div className="field">
            <label>รหัส/เลขประจำตัว</label>
            <input value={draft.studentId} onChange={(e) => setDraft({...draft, studentId: e.target.value})}/>
          </div>
        </Modal>
      )}

      {importing && (
        <ImportStudentsModal
          onClose={() => setImporting(false)}
          onImport={(list) => {
            if (typeof window.replaceStudents === 'function') {
              window.replaceStudents(list);
              toast(`นำเข้ารายชื่อ ${list.length} คนเรียบร้อย`);
            }
            setImporting(false);
          }}
        />
      )}
    </div>
  );
};

window.ManageView = ManageView;


// Excel export — produces a multi-sheet workbook for a school term
// Sheets:
//   1) สรุปรายเทอม — student × totals (มา/ขาด/ลา/มาสาย/รวม/%การมา)
//   2) ตารางรายวัน — student × dates matrix (ม/ข/ล/ส)
//   3) บันทึกหมายเหตุ — long-form list of all notes
//   4) ข้อมูลห้อง — class metadata

function exportTermToExcel({ students, attendance, termInfo, className }) {
  const XLSX = window.XLSX;
  if (!XLSX) {
    alert("ไม่สามารถโหลดไลบรารี Excel ได้");
    return;
  }

  const dates = window.termDates(termInfo);
  const dateKeys = dates.map(d => window.formatDate(d));
  const dateHeaders = dates.map(d => `${d.getDate()}/${d.getMonth()+1}`);

  // ----- Sheet 1: Summary -----
  const summaryAOA = [];
  summaryAOA.push([`รายงานสรุปการเช็คชื่อนักเรียน — ${className}`]);
  summaryAOA.push([`${termInfo.label}  (${window.formatThaiDateShort(termInfo.start)} – ${window.formatThaiDateShort(termInfo.end)})`]);
  summaryAOA.push([`วันเรียนทั้งหมด ${dateKeys.length} วัน`]);
  summaryAOA.push([]);
  summaryAOA.push(["เลขที่", "รหัสนักเรียน", "ชื่อ-นามสกุล", "เพศ", "มา", "ขาด", "ลา", "สาย", "รวมบันทึก", "% การมาเรียน"]);

  students.forEach(s => {
    let counts = { present: 0, absent: 0, leave: 0, late: 0 };
    let recorded = 0;
    dateKeys.forEach(k => {
      const r = attendance[k]?.[s.id];
      if (r && counts[r.status] !== undefined) {
        counts[r.status]++;
        recorded++;
      }
    });
    const attendRate = recorded
      ? Math.round(((counts.present + counts.late) / recorded) * 1000) / 10
      : 0;
    summaryAOA.push([
      s.number, s.studentId, fullName(s),
      s.gender === 'ช' ? 'ชาย' : 'หญิง',
      counts.present, counts.absent, counts.leave, counts.late,
      recorded, attendRate,
    ]);
  });

  // Totals row
  const totals = { present: 0, absent: 0, leave: 0, late: 0 };
  students.forEach(s => {
    dateKeys.forEach(k => {
      const r = attendance[k]?.[s.id];
      if (r && totals[r.status] !== undefined) totals[r.status]++;
    });
  });
  summaryAOA.push([]);
  summaryAOA.push(["", "", "รวมทั้งห้อง", "",
    totals.present, totals.absent, totals.leave, totals.late,
    totals.present + totals.absent + totals.leave + totals.late, ""]);

  const ws1 = XLSX.utils.aoa_to_sheet(summaryAOA);
  ws1['!cols'] = [
    {wch:8}, {wch:12}, {wch:28}, {wch:6},
    {wch:8}, {wch:8}, {wch:8}, {wch:8}, {wch:12}, {wch:14},
  ];
  ws1['!merges'] = [
    { s: {r:0,c:0}, e: {r:0,c:9} },
    { s: {r:1,c:0}, e: {r:1,c:9} },
    { s: {r:2,c:0}, e: {r:2,c:9} },
  ];

  // ----- Sheet 2: Daily matrix -----
  const matrixAOA = [];
  matrixAOA.push([`ตารางเช็คชื่อรายวัน — ${className} — ${termInfo.label}`]);
  matrixAOA.push([]);
  const header = ["เลขที่", "รหัส", "ชื่อ-นามสกุล", ...dateHeaders];
  matrixAOA.push(header);

  students.forEach(s => {
    const row = [s.number, s.studentId, fullName(s)];
    dateKeys.forEach(k => {
      const r = attendance[k]?.[s.id];
      if (!r) { row.push(""); return; }
      const cfg = window.STATUSES.find(x => x.key === r.status);
      row.push(cfg ? cfg.short : "");
    });
    matrixAOA.push(row);
  });

  // Daily totals row
  const dailyTotals = ["", "", "รวมมา/วัน"];
  dateKeys.forEach(k => {
    const day = attendance[k] || {};
    let p = 0;
    Object.values(day).forEach(r => { if (r.status === 'present') p++; });
    dailyTotals.push(p || "");
  });
  matrixAOA.push([]);
  matrixAOA.push(dailyTotals);

  const ws2 = XLSX.utils.aoa_to_sheet(matrixAOA);
  ws2['!cols'] = [{wch:8}, {wch:12}, {wch:28}, ...dateHeaders.map(() => ({wch:5}))];
  ws2['!merges'] = [{ s: {r:0,c:0}, e: {r:0,c:Math.min(15, dateHeaders.length + 2)} }];

  // ----- Sheet 3: Notes -----
  const notesAOA = [["วันที่", "เลขที่", "ชื่อ-นามสกุล", "สถานะ", "หมายเหตุ"]];
  dateKeys.forEach(k => {
    const day = attendance[k];
    if (!day) return;
    students.forEach(s => {
      const r = day[s.id];
      if (r && r.note) {
        const cfg = window.STATUSES.find(x => x.key === r.status);
        notesAOA.push([
          k, s.number, fullName(s),
          cfg ? cfg.label : r.status,
          r.note,
        ]);
      }
    });
  });
  if (notesAOA.length === 1) notesAOA.push(["—", "", "ไม่มีหมายเหตุในเทอมนี้", "", ""]);
  const ws3 = XLSX.utils.aoa_to_sheet(notesAOA);
  ws3['!cols'] = [{wch:12}, {wch:8}, {wch:28}, {wch:10}, {wch:50}];

  // ----- Sheet 4: Metadata -----
  const metaAOA = [
    ["ข้อมูลรายงาน"],
    [],
    ["ห้องเรียน", className],
    ["ภาคเรียน", termInfo.label],
    ["วันที่เริ่มเทอม", window.formatThaiDate(termInfo.start)],
    ["วันที่สิ้นสุดเทอม", window.formatThaiDate(termInfo.end)],
    ["วันเรียนทั้งหมด", dateKeys.length],
    ["จำนวนนักเรียน", students.length],
    ["วันที่ส่งออก", window.formatThaiDate(new Date())],
    [],
    ["รหัสสถานะ"],
    ["ม", "มาเรียน (Present)"],
    ["ข", "ขาดเรียน (Absent)"],
    ["ล", "ลา (Leave)"],
    ["ส", "มาสาย (Late)"],
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(metaAOA);
  ws4['!cols'] = [{wch:20}, {wch:30}];
  ws4['!merges'] = [{ s: {r:0,c:0}, e: {r:0,c:1} }, { s: {r:10,c:0}, e: {r:10,c:1} }];

  // ----- Assemble -----
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, "สรุปรายเทอม");
  XLSX.utils.book_append_sheet(wb, ws2, "ตารางรายวัน");
  XLSX.utils.book_append_sheet(wb, ws3, "บันทึกหมายเหตุ");
  XLSX.utils.book_append_sheet(wb, ws4, "ข้อมูลห้อง");

  const safeClassName = className.replace(/[\/\\]/g, '-');
  const filename = `เช็คชื่อ_${safeClassName}_${termInfo.label.replace(/[\/\s]/g, '-')}.xlsx`;
  XLSX.writeFile(wb, filename);
}

window.exportTermToExcel = exportTermToExcel;


// =========================================================
// Main app — wires up state, persistence, tabs
// =========================================================
const { useState, useEffect, useMemo } = React;

const STORAGE_KEY = "attendance_v1";
const LAST_SYNC_KEY = "attendance_last_sync";

// ===== Google Sheets Sync =====
// ส่งข้อมูลขึ้น Google Sheets (multi-room)
async function uploadToSheets(state) {
  const url = window.SHEETS_URL;
  if (!url) throw new Error("ยังไม่ได้ตั้งค่า SHEETS_URL ใน index.html");

  // ส่งทั้ง state แบบ multi-room
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      rooms: state.rooms,
      activeRoomId: state.activeRoomId,
    }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "ส่งข้อมูลไม่สำเร็จ");
  return json;
}

// ดึงข้อมูลจาก Google Sheets
async function downloadFromSheets() {
  const url = window.SHEETS_URL;
  if (!url) throw new Error("ยังไม่ได้ตั้งค่า SHEETS_URL ใน index.html");

  const res = await fetch(url, { method: "GET" });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "ดึงข้อมูลไม่สำเร็จ");
  return json.data;
}

function makeRoomId() {
  return "r_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// แปลง state เก่า (ห้องเดียว) เป็น state ใหม่ (หลายห้อง)
function migrateToMultiRoom(oldState) {
  if (oldState && oldState.rooms && oldState.activeRoomId) {
    return oldState; // เป็น format ใหม่อยู่แล้ว
  }
  // format เก่า
  const roomId = makeRoomId();
  return {
    rooms: {
      [roomId]: {
        id: roomId,
        name: oldState?.className || "ม.5/3",
        students: oldState?.students || [],
        attendance: oldState?.attendance || {},
      }
    },
    activeRoomId: roomId,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return migrateToMultiRoom(parsed);
    }
  } catch (e) { console.warn(e); }
  // First run: seed with mock data
  const roomId = makeRoomId();
  return {
    rooms: {
      [roomId]: {
        id: roomId,
        name: "ม.5/3",
        students: window.INITIAL_STUDENTS,
        attendance: window.genSampleAttendance(),
      }
    },
    activeRoomId: roomId,
  };
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.warn(e); }
}

const App = () => {
  const [state, setState] = useState(loadState);
  const { rooms, activeRoomId } = state;
  const activeRoom = rooms[activeRoomId] || Object.values(rooms)[0];
  const students = activeRoom?.students || [];
  const attendance = activeRoom?.attendance || {};
  const className = activeRoom?.name || "";
  const roomList = Object.values(rooms);

  const [tab, setTab] = useState("daily");
  const [date, setDate] = useState(() => window.formatDate(new Date()));
  const [toastMsg, setToastMsg] = useState(null);
  const [syncing, setSyncing] = useState(null); // 'upload' | 'download' | null
  const [lastSync, setLastSync] = useState(() => {
    try { return localStorage.getItem(LAST_SYNC_KEY) || null; } catch (e) { return null; }
  });
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => 
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );

  // PWA install prompt
  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const onInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      setToastMsg("ติดตั้งแอปสำเร็จ ✓");
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  // Default date to most recent weekday (don't land on weekend)
  useEffect(() => {
    const d = window.parseDate(date);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) {
      const nd = new Date(d);
      nd.setDate(nd.getDate() - (dow === 0 ? 2 : 1));
      setDate(window.formatDate(nd));
    }
  }, []);

  useEffect(() => { saveState(state); }, [state]);

  const dayRecord = attendance[date] || {};

  // อัปเดต state ทั้งก้อน (สำหรับ room-level changes)
  const update = (fn) => setState(prev => fn(prev));

  // อัปเดตเฉพาะ active room (สำหรับ student/attendance changes)
  const updateRoom = (fn) => setState(prev => {
    const room = prev.rooms[prev.activeRoomId];
    if (!room) return prev;
    return {
      ...prev,
      rooms: { ...prev.rooms, [prev.activeRoomId]: fn(room) },
    };
  });

  // ===== Room management =====
  const switchRoom = (roomId) => {
    update(prev => ({ ...prev, activeRoomId: roomId }));
  };

  const addRoom = (name) => {
    const newId = makeRoomId();
    update(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [newId]: { id: newId, name: name || "ห้องใหม่", students: [], attendance: {} },
      },
      activeRoomId: newId,
    }));
    setToastMsg(`เพิ่มห้อง "${name}" แล้ว`);
  };

  const renameRoom = (roomId, newName) => {
    update(prev => ({
      ...prev,
      rooms: { ...prev.rooms, [roomId]: { ...prev.rooms[roomId], name: newName } },
    }));
  };

  const removeRoom = (roomId) => {
    update(prev => {
      const newRooms = { ...prev.rooms };
      delete newRooms[roomId];
      const remainingIds = Object.keys(newRooms);
      if (remainingIds.length === 0) {
        // ถ้าลบห้องสุดท้าย สร้างห้องเปล่าให้
        const fallbackId = makeRoomId();
        return {
          rooms: { [fallbackId]: { id: fallbackId, name: "ห้องใหม่", students: [], attendance: {} } },
          activeRoomId: fallbackId,
        };
      }
      return {
        rooms: newRooms,
        activeRoomId: prev.activeRoomId === roomId ? remainingIds[0] : prev.activeRoomId,
      };
    });
    setToastMsg("ลบห้องแล้ว");
  };

  // ===== Student/Attendance handlers (เฉพาะ active room) =====
  const setStatus = (studentId, status) => {
    updateRoom(room => ({
      ...room,
      attendance: {
        ...room.attendance,
        [date]: {
          ...(room.attendance[date] || {}),
          [studentId]: { ...(room.attendance[date]?.[studentId] || {}), status },
        },
      },
    }));
  };

  const setNote = (studentId, note) => {
    updateRoom(room => {
      const existing = room.attendance[date]?.[studentId] || { status: 'present' };
      return {
        ...room,
        attendance: {
          ...room.attendance,
          [date]: {
            ...(room.attendance[date] || {}),
            [studentId]: { ...existing, note },
          },
        },
      };
    });
  };

  const markAll = (status) => {
    updateRoom(room => {
      const next = { ...(room.attendance[date] || {}) };
      room.students.forEach(s => {
        next[s.id] = { ...(next[s.id] || {}), status };
      });
      return { ...room, attendance: { ...room.attendance, [date]: next } };
    });
    setToastMsg(`บันทึก "มา" ทั้งห้อง ${students.length} คน`);
  };

  const addStudent = (data) => {
    updateRoom(room => {
      const maxNum = Math.max(0, ...room.students.map(s => s.number));
      const id = "s" + Date.now().toString(36);
      return {
        ...room,
        students: [...room.students, { ...data, id, number: maxNum + 1 }],
      };
    });
  };

  const removeStudent = (id) => {
    updateRoom(room => {
      const newAtt = {};
      Object.entries(room.attendance).forEach(([k, v]) => {
        const copy = { ...v };
        delete copy[id];
        newAtt[k] = copy;
      });
      return {
        ...room,
        students: room.students.filter(s => s.id !== id),
        attendance: newAtt,
      };
    });
  };

  const updateStudent = (id, data) => {
    updateRoom(room => ({
      ...room,
      students: room.students.map(s => s.id === id ? { ...s, ...data } : s),
    }));
  };

  // นำเข้ารายชื่อ — แทนที่ทั้งหมดในห้องนี้ + ลบประวัติเช็คชื่อเก่า
  const replaceStudents = (newList) => {
    updateRoom(room => {
      const studentsWithIds = newList.map((s, i) => ({
        ...s,
        id: s.id || `s${Date.now().toString(36)}_${i}`,
        number: s.number || (i + 1),
      }));
      return {
        ...room,
        students: studentsWithIds,
        attendance: {}, // ล้างประวัติเก่า เพราะ id เปลี่ยน
      };
    });
  };

  // จัดลำดับเลขที่ใหม่ — แค่ใส่เลข 1, 2, 3, ... ตามลำดับที่อยู่ในรายการ
  // (ไม่เรียงใหม่ — ใช้หลังลบนักเรียนเพื่อให้เลขไม่กระโดด)
  const resequenceStudents = () => {
    updateRoom(room => ({
      ...room,
      students: room.students.map((s, i) => ({ ...s, number: i + 1 })),
    }));
    setToastMsg("จัดลำดับเลขที่ใหม่แล้ว");
  };

  // ให้ Modal ต่างๆ เรียกได้ผ่าน window
  React.useEffect(() => {
    window.replaceStudents = replaceStudents;
    window.resequenceStudents = resequenceStudents;
    return () => {
      delete window.replaceStudents;
      delete window.resequenceStudents;
    };
  }, []);

  const handleExport = () => {
    const refDate = tab === 'history'
      ? window.computeTermInfo(0).start
      : window.parseDate(date);
    const termInfo = window.getTermInfo(refDate);
    window.exportTermToExcel({ students, attendance, termInfo, className });
    setToastMsg(`ส่งออก Excel ${termInfo.label} แล้ว`);
  };

  // ส่งข้อมูลขึ้น Google Sheets
  const handleUpload = async () => {
    if (syncing) return;
    if (!window.SHEETS_URL) {
      setToastMsg("ยังไม่ได้ตั้งค่า Google Sheets URL");
      return;
    }
    setSyncing('upload');
    try {
      await uploadToSheets(state);
      const now = new Date().toISOString();
      try { localStorage.setItem(LAST_SYNC_KEY, now); } catch (e) {}
      setLastSync(now);
      setToastMsg("ส่งขึ้น Google Sheets แล้ว ✓");
    } catch (err) {
      console.error(err);
      setToastMsg("ส่งไม่สำเร็จ: " + err.message);
    } finally {
      setSyncing(null);
    }
  };

  // ดึงข้อมูลจาก Google Sheets (จะทับข้อมูลในเครื่อง)
  const handleDownload = async () => {
    if (syncing) return;
    if (!window.SHEETS_URL) {
      setToastMsg("ยังไม่ได้ตั้งค่า Google Sheets URL");
      return;
    }
    const ok = window.confirm(
      "การดึงข้อมูลจะทับข้อมูลในเครื่องนี้ทั้งหมด\n" +
      "ถ้ามีการเช็คชื่อในเครื่องนี้ที่ยังไม่ได้ส่งขึ้น Sheets จะหายไป\n\n" +
      "ต้องการดำเนินการต่อ?"
    );
    if (!ok) return;

    setSyncing('download');
    try {
      const data = await downloadFromSheets();
      if (!data) {
        setToastMsg("ยังไม่มีข้อมูลใน Google Sheets");
        return;
      }
      // รองรับทั้ง format ใหม่ (rooms) และ format เก่า
      if (data.rooms && data.activeRoomId) {
        setState({ rooms: data.rooms, activeRoomId: data.activeRoomId });
      } else if (data.students && data.attendance) {
        // format เก่า — migrate
        setState(migrateToMultiRoom({
          students: data.students,
          attendance: data.attendance,
          className: data.className || className,
        }));
      } else {
        throw new Error("รูปแบบข้อมูลไม่ถูกต้อง");
      }
      const now = new Date().toISOString();
      try { localStorage.setItem(LAST_SYNC_KEY, now); } catch (e) {}
      setLastSync(now);
      setToastMsg("ดึงข้อมูลจาก Google Sheets แล้ว ✓");
    } catch (err) {
      console.error(err);
      setToastMsg("ดึงไม่สำเร็จ: " + err.message);
    } finally {
      setSyncing(null);
    }
  };

  return (
    <div className="app">
      <header className="appbar">
        <div className="brand">
          <div className="brand-mark">ช</div>
          <div className="brand-text">
            <div className="brand-title">ระบบเช็คชื่อนักเรียน</div>
            <RoomSwitcher
              rooms={roomList}
              activeRoomId={activeRoomId}
              onSwitch={switchRoom}
              onAdd={addRoom}
              onRename={renameRoom}
              onRemove={removeRoom}
              studentCount={students.length}
            />
          </div>
        </div>
        <div className="tabs">
          <button className={tab === 'daily' ? 'active' : ''} onClick={() => setTab('daily')}>
            <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
              <Icon name="check" size={14}/>เช็คชื่อวันนี้
            </span>
          </button>
          <button className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>
            <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
              <Icon name="history" size={14}/>ประวัติเทอม
            </span>
          </button>
          <button className={tab === 'manage' ? 'active' : ''} onClick={() => setTab('manage')}>
            <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
              <Icon name="users" size={14}/>จัดการนักเรียน
            </span>
          </button>
        </div>
        <div style={{display:'flex', gap: 8, alignItems:'center'}}>
          {installPrompt && (
            <button className="btn btn-secondary" onClick={handleInstall} title="ติดตั้งเป็นแอป">
              <Icon name="download" size={16}/>
              <span className="install-label">ติดตั้งแอป</span>
            </button>
          )}
          <button
            className="btn btn-secondary"
            onClick={handleDownload}
            disabled={syncing !== null}
            title="ดึงข้อมูลจาก Google Sheets"
          >
            <Icon name="cloudDown" size={16}/>
            <span className="install-label">{syncing === 'download' ? 'กำลังดึง...' : 'ดึงจาก Sheets'}</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleUpload}
            disabled={syncing !== null}
            title="ส่งข้อมูลขึ้น Google Sheets"
          >
            <Icon name="cloudUp" size={16}/>
            <span className="install-label">{syncing === 'upload' ? 'กำลังส่ง...' : 'ส่งขึ้น Sheets'}</span>
          </button>
          <button className="btn btn-primary" onClick={handleExport}>
            <Icon name="excel" size={16}/>
            <span className="install-label">ส่งออก Excel</span>
          </button>
        </div>
      </header>

      <main className="main">
        {tab === 'daily' && (
          <DailyView
            students={students}
            date={date}
            setDate={setDate}
            dayRecord={dayRecord}
            setStatus={setStatus}
            setNote={setNote}
            markAll={markAll}
            toast={setToastMsg}
          />
        )}
        {tab === 'history' && (
          <HistoryView students={students} attendance={attendance} />
        )}
        {tab === 'manage' && (
          <ManageView
            students={students}
            addStudent={addStudent}
            removeStudent={removeStudent}
            updateStudent={updateStudent}
            toast={setToastMsg}
          />
        )}
      </main>

      {toastMsg && <Toast msg={toastMsg} onDone={() => setToastMsg(null)} />}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

