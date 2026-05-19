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
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {paths[name]}
    </svg>
  );
};

window.Icon = Icon;


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
    (s.firstName + " " + s.lastName).includes(search) ||
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
                <div className="full">{s.firstName} {s.lastName}</div>
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
          title={`หมายเหตุ — ${noteEditing.firstName} ${noteEditing.lastName}`}
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
                  <td className="name">{s.firstName} {s.lastName}</td>
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
// Manage students view
// =========================================================
const ManageView = ({ students, addStudent, removeStudent, updateStudent, toast }) => {
  const [adding, setAdding] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [draft, setDraft] = React.useState({ firstName: "", lastName: "", gender: "ช", studentId: "" });

  const startAdd = () => {
    const nextNum = (Math.max(0, ...students.map(s => s.number))) + 1;
    setDraft({
      firstName: "",
      lastName: "",
      gender: "ช",
      studentId: String(66000 + 300 + students.length),
    });
    setAdding(true);
  };

  const startEdit = (s) => {
    setEditing(s);
    setDraft({ firstName: s.firstName, lastName: s.lastName, gender: s.gender, studentId: s.studentId });
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
    if (confirm(`ลบ "${s.firstName} ${s.lastName}" ออกจากห้อง?\nข้อมูลการเช็คชื่อย้อนหลังจะถูกลบด้วย`)) {
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
          <button className="btn btn-primary" onClick={startAdd}>
            <Icon name="plus" size={16}/>
            เพิ่มนักเรียน
          </button>
        </div>
        {students.length === 0 ? (
          <div className="empty">
            <div className="title">ยังไม่มีนักเรียน</div>
            <div>กดปุ่ม "เพิ่มนักเรียน" เพื่อเริ่มต้น</div>
          </div>
        ) : students.map(s => (
          <div className="list-row" key={s.id}>
            <div className="num mono" style={{color:'var(--text-muted)'}}>{String(s.number).padStart(2, '0')}</div>
            <div className="name">
              <div style={{fontWeight: 500}}>{s.firstName} {s.lastName}</div>
              <div className="subtle">รหัส {s.studentId} · เพศ {s.gender === 'ช' ? 'ชาย' : 'หญิง'}</div>
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
              <label>ชื่อจริง *</label>
              <input value={draft.firstName} onChange={(e) => setDraft({...draft, firstName: e.target.value})} autoFocus/>
            </div>
            <div className="field">
              <label>นามสกุล</label>
              <input value={draft.lastName} onChange={(e) => setDraft({...draft, lastName: e.target.value})}/>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>รหัสนักเรียน</label>
              <input value={draft.studentId} onChange={(e) => setDraft({...draft, studentId: e.target.value})}/>
            </div>
            <div className="field">
              <label>เพศ</label>
              <select value={draft.gender} onChange={(e) => setDraft({...draft, gender: e.target.value})}>
                <option value="ช">ชาย</option>
                <option value="ญ">หญิง</option>
              </select>
            </div>
          </div>
        </Modal>
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
      s.number, s.studentId, `${s.firstName} ${s.lastName}`,
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
    const row = [s.number, s.studentId, `${s.firstName} ${s.lastName}`];
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
          k, s.number, `${s.firstName} ${s.lastName}`,
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

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.students && parsed.attendance) return parsed;
    }
  } catch (e) { console.warn(e); }
  // First run: seed with mock data
  return {
    students: window.INITIAL_STUDENTS,
    attendance: window.genSampleAttendance(),
    className: "ม.5/3",
  };
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { console.warn(e); }
}

const App = () => {
  const [state, setState] = useState(loadState);
  const { students, attendance, className } = state;

  const [tab, setTab] = useState("daily");
  const [date, setDate] = useState(() => window.formatDate(new Date()));
  const [toastMsg, setToastMsg] = useState(null);
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

  const update = (fn) => setState(prev => fn(prev));

  const setStatus = (studentId, status) => {
    update(prev => ({
      ...prev,
      attendance: {
        ...prev.attendance,
        [date]: {
          ...(prev.attendance[date] || {}),
          [studentId]: { ...(prev.attendance[date]?.[studentId] || {}), status },
        },
      },
    }));
  };

  const setNote = (studentId, note) => {
    update(prev => {
      const existing = prev.attendance[date]?.[studentId] || { status: 'present' };
      return {
        ...prev,
        attendance: {
          ...prev.attendance,
          [date]: {
            ...(prev.attendance[date] || {}),
            [studentId]: { ...existing, note },
          },
        },
      };
    });
  };

  const markAll = (status) => {
    update(prev => {
      const next = { ...(prev.attendance[date] || {}) };
      prev.students.forEach(s => {
        next[s.id] = { ...(next[s.id] || {}), status };
      });
      return { ...prev, attendance: { ...prev.attendance, [date]: next } };
    });
    setToastMsg(`บันทึก "มา" ทั้งห้อง ${students.length} คน`);
  };

  const addStudent = (data) => {
    update(prev => {
      const maxNum = Math.max(0, ...prev.students.map(s => s.number));
      const id = "s" + Date.now().toString(36);
      return {
        ...prev,
        students: [...prev.students, { ...data, id, number: maxNum + 1 }],
      };
    });
  };

  const removeStudent = (id) => {
    update(prev => {
      const newAtt = {};
      Object.entries(prev.attendance).forEach(([k, v]) => {
        const copy = { ...v };
        delete copy[id];
        newAtt[k] = copy;
      });
      return {
        ...prev,
        students: prev.students.filter(s => s.id !== id),
        attendance: newAtt,
      };
    });
  };

  const updateStudent = (id, data) => {
    update(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, ...data } : s),
    }));
  };

  const handleExport = () => {
    // For the daily/history tabs, export the term containing the active date
    const refDate = tab === 'history'
      ? window.computeTermInfo(0).start  // current term default — could enhance
      : window.parseDate(date);
    const termInfo = window.getTermInfo(refDate);
    window.exportTermToExcel({ students, attendance, termInfo, className });
    setToastMsg(`ส่งออก Excel ${termInfo.label} แล้ว`);
  };

  return (
    <div className="app">
      <header className="appbar">
        <div className="brand">
          <div className="brand-mark">ช</div>
          <div className="brand-text">
            <div className="brand-title">ระบบเช็คชื่อนักเรียน</div>
            <div className="brand-sub">{className} · {students.length} คน</div>
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

