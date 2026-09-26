import { useMemo, useState } from "react";
import {
  LayoutDashboard, BriefcaseBusiness, CalendarCheck2, WalletCards, BarChart3, Users,
  Settings, Search, Bell, Plus, ArrowUpRight, Clock3, CheckCircle2, CircleAlert,
  ChevronDown, Menu, X, MoreHorizontal, Filter, Download, TrendingUp, UserPlus,
  CircleDollarSign, ClipboardList, SlidersHorizontal, Sun, Moon
} from "lucide-react";

const nav = [
  ["Overview", LayoutDashboard], ["Work", BriefcaseBusiness], ["Attendance", CalendarCheck2],
  ["Payments", WalletCards], ["Advances", CircleDollarSign], ["Reports", BarChart3], ["Employees", Users]
];

const workSeed = [
  { title: "Production planning", owner: "Ananya Rao", progress: 82, status: "In progress", due: "Today" },
  { title: "Monthly attendance review", owner: "Rahul Kumar", progress: 64, status: "In progress", due: "Tomorrow" },
  { title: "Payment reconciliation", owner: "Meera S", progress: 100, status: "Completed", due: "25 Sep" },
  { title: "Inventory audit", owner: "Vikram Shah", progress: 38, status: "At risk", due: "Tomorrow" },
  { title: "Weekly production report", owner: "Priya Nair", progress: 76, status: "In progress", due: "28 Sep" }
];

const employeesSeed = [
  ["Ananya Rao","Production","Present","₹28,500"], ["Rahul Kumar","Operations","Late","₹25,000"],
  ["Meera S","Accounts","Present","₹31,500"], ["Vikram Shah","Warehouse","Absent","₹22,000"],
  ["Priya Nair","Production","Present","₹27,500"], ["Arjun Das","Operations","Present","₹24,000"]
];

function App() {
  const [active, setActive] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState("Admin");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [advances, setAdvances] = useState([
    {employee:"Rahul Kumar", amount:"₹8,000", reason:"Emergency advance", date:"24 Sep 2026", status:"Pending"},
    {employee:"Ananya Rao", amount:"₹5,000", reason:"Travel advance", date:"20 Sep 2026", status:"Approved"},
    {employee:"Meera S", amount:"₹3,500", reason:"Medical advance", date:"18 Sep 2026", status:"Recovered"}
  ]);
  const [workItems, setWorkItems] = useState(workSeed);
  const [theme, setTheme] = useState(() => localStorage.getItem("ui-template-theme") || "light");
  const toggleTheme = () => setTheme((current) => {
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem("ui-template-theme", next);
    return next;
  });

  const go = (page) => { setActive(page); setMobileOpen(false); setQuery(""); };

  const page = {
    Overview: <OverviewPage go={go} />,
    Work: <WorkPage items={workItems} setItems={setWorkItems} query={query} setQuery={setQuery} openModal={()=>setModal("work")} />,
    Attendance: <AttendancePage query={query} setQuery={setQuery} />,
    Payments: <PaymentsPage query={query} setQuery={setQuery} />,
    Advances: <AdvancesPage advances={advances} openModal={()=>setModal("advance")} />,
    Reports: <ReportsPage />,
    Employees: <EmployeesPage query={query} setQuery={setQuery} openModal={()=>setModal("employee")} />,
    Settings: <SettingsPage role={role} />
  }[active];

  return <div className={"app theme-" + theme}>
    {mobileOpen && <button className="sidebar-backdrop" aria-label="Close menu" onClick={()=>setMobileOpen(false)} />}
    <aside className={mobileOpen ? "sidebar open" : "sidebar"}>
      <div className="brand"><div className="brand-mark">U</div><div><b>UI Template</b><span>Work management</span></div></div>
      <div className="workspace"><span>Workspace</span><button><span>Acme Operations</span><ChevronDown size={15}/></button></div>
      <nav>{nav.map(([label, Icon]) => <button key={label} className={active===label?"nav-item active":"nav-item"} onClick={()=>go(label)}><Icon size={19}/><span>{label}</span></button>)}</nav>
      <div className="sidebar-bottom">
        <div className="theme-switcher">
          <div className="theme-switch-label"><div className="theme-switch-icon">{theme==="light"?<Sun size={16}/>:<Moon size={16}/>}</div><div><b>{theme==="light"?"Light theme":"Dark theme"}</b><span>{theme==="light"?"Switch to dark":"Switch to light"}</span></div></div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label={"Switch to " + (theme==="light"?"dark":"light") + " theme"}><span className={theme==="dark"?"active":""}>{theme==="light"?<Sun size={13}/>:<Moon size={13}/>}</span></button>
        </div>
        <button className={active==="Settings"?"nav-item active":"nav-item"} onClick={()=>go("Settings")}><Settings size={19}/><span>Settings</span></button>
        <div className="user-mini"><div className="avatar">SC</div><div><b>Shivaraj</b><span>{role}</span></div><MoreHorizontal size={18}/></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="icon-btn menu" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen?<X/>:<Menu/>}</button>
        <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{active}</strong></div>
        <div className="top-actions">
          <div className="search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search anything..." /></div>
          <button className="icon-btn"><Bell size={19}/><i/></button>
          <button className="role-switch" onClick={()=>setRole(role==="Admin"?"Employee":"Admin")}>{role}<ChevronDown size={15}/></button>
        </div>
      </header>
      <div className="content">{page}</div>
      <button className="fab-plus" onClick={()=>setModal("actions")} aria-label="Open quick actions"><Plus size={22}/></button>
      <div className="mobile-nav">{nav.slice(0,5).map(([label,Icon])=><button key={label} className={active===label?"active":""} onClick={()=>go(label)}><Icon size={19}/><span>{label}</span></button>)}</div>
    </main>

    {modal==="work" && <WorkModal close={()=>setModal(null)} add={(item)=>{setWorkItems(v=>[item,...v]);setModal(null)}} />}
    {modal==="employee" && <EmployeeModal close={()=>setModal(null)} />}
    {modal==="advance" && <AdvanceModal close={()=>setModal(null)} add={(item)=>{setAdvances(v=>[item,...v]);setModal(null)}} />}
    {modal==="actions" && <QuickActions close={()=>setModal(null)} choose={(action)=>{setModal(null);setTimeout(()=>setModal(action),0)}} />}
    {modal==="labour" && <LabourModal close={()=>setModal(null)} />}
    {modal==="payment" && <PaymentModal close={()=>setModal(null)} />}
    {modal==="attendance" && <AttendanceModal close={()=>setModal(null)} />}
  </div>;
}

function PageHeader({eyebrow, title, text, action}) {
  return <section className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p></div>{action}</section>;
}
function Toolbar({children}) { return <div className="toolbar">{children}</div>; }
function SearchBox({value,onChange,placeholder="Search..."}) { return <div className="search inline-search"><Search size={17}/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></div>; }
function MiniStat({icon:Icon,label,value,meta}) { return <div className="mini-stat"><div className="stat-icon"><Icon size={18}/></div><span>{label}</span><strong>{value}</strong><small>{meta}</small></div>; }

function OverviewPage({go}) {
  return <>
    <PageHeader eyebrow="Monday, 26 September 2026" title={<>Good morning, Shivaraj <span>✦</span></>} text="Here’s what’s happening across your workspace today." action={<button className="primary" onClick={()=>go("Work")}><Plus size={18}/> Create work</button>}/>
    <section className="stats">
      <MiniStat icon={Users} label="Total employees" value="48" meta="+4 this month"/>
      <MiniStat icon={CalendarCheck2} label="Present today" value="42" meta="87.5% attendance"/>
      <MiniStat icon={BriefcaseBusiness} label="Active work" value="23" meta="8 due this week"/>
      <MiniStat icon={WalletCards} label="Pending payments" value="₹1.84L" meta="12 employees"/>
    </section>
    <section className="grid">
      <div className="card"><CardHead title="Attendance" text="Today’s workforce overview" action={<button className="ghost" onClick={()=>go("Attendance")}>View details <ArrowUpRight size={16}/></button>}/>
        <div className="attendance-body"><div className="ring"><div><strong>87.5%</strong><span>Present</span></div></div><div className="attendance-legend"><Legend label="Present" value="42" cls="present"/><Legend label="Late" value="3" cls="late"/><Legend label="Absent" value="3" cls="absent"/></div></div>
        <div className="attendance-note"><Clock3 size={16}/><span>Average check-in time</span><b>9:08 AM</b></div>
      </div>
      <div className="card"><CardHead title="Recent activity" text="Latest workspace updates"/><div className="activity-list"><Activity icon={CheckCircle2} title="Payment marked as paid" detail="Rahul Kumar · ₹12,500" time="12 min ago"/><Activity icon={BriefcaseBusiness} title="New work assigned" detail="Production planning · Ananya Rao" time="38 min ago"/><Activity icon={CalendarCheck2} title="Attendance updated" detail="3 employees checked in" time="1 hr ago"/><Activity icon={CircleAlert} title="Work deadline approaching" detail="Inventory audit · Tomorrow" time="2 hrs ago"/></div></div>
    </section>
    <div className="card"><CardHead title="Work overview" text="Track active assignments and progress" action={<button className="ghost" onClick={()=>go("Work")}>See all work <ArrowUpRight size={16}/></button>}/><WorkTable items={workSeed.slice(0,3)}/></div>
    <section className="quick"><Quick icon={Plus} title="Create new work" text="Assign a task to your team" onClick={()=>go("Work")}/><Quick icon={CalendarCheck2} title="Manage attendance" text="Review today’s check-ins" onClick={()=>go("Attendance")}/><Quick icon={WalletCards} title="Process payments" text="Review pending payouts" onClick={()=>go("Payments")}/><Quick icon={BarChart3} title="View reports" text="Explore workforce insights" onClick={()=>go("Reports")}/></section>
  </>;
}

function WorkPage({items,setItems,query,setQuery,openModal}) {
  const filtered=items.filter(x=>(x.title+" "+x.owner+" "+x.status).toLowerCase().includes(query.toLowerCase()));
  const updateStatus=(title)=>setItems(items.map(x=>x.title===title?{...x,status:x.status==="Completed"?"In progress":"Completed",progress:x.status==="Completed"?60:100}:x));
  return <>
    <PageHeader eyebrow="Work management" title="Work" text="Plan assignments, monitor progress and keep deadlines visible." action={<button className="primary" onClick={openModal}><Plus size={18}/> New work</button>}/>
    <div className="card"><Toolbar><SearchBox value={query} onChange={setQuery} placeholder="Search work or employee..."/><button className="secondary"><Filter size={16}/> Filters</button><button className="secondary"><Download size={16}/> Export</button></Toolbar><WorkTable items={filtered} onToggle={updateStatus}/></div>
  </>;
}

function WorkTable({items,onToggle}) {
  return <div className="table-wrap"><table><thead><tr><th>Work</th><th>Assigned to</th><th>Progress</th><th>Due</th><th>Status</th><th></th></tr></thead><tbody>{items.map(item=><tr key={item.title}><td><b>{item.title}</b><span className="sub">Updated today</span></td><td><div className="person"><div className="avatar small">{initials(item.owner)}</div>{item.owner}</div></td><td><div className="progress"><div><span style={{width:item.progress+"%"}}/></div><b>{item.progress}%</b></div></td><td>{item.due}</td><td><button className={"badge "+badgeClass(item.status)} onClick={()=>onToggle&&onToggle(item.title)}>{item.status}</button></td><td><button className="icon-btn"><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table></div>;
}

function AttendancePage({query,setQuery}) {
  const [rows,setRows]=useState(employeesSeed.map((x,i)=>({name:x[0],team:x[1],status:x[2],time:i===1?"9:42 AM":i===3?"—":"8:"+String(48+i).padStart(2,"0")})));
  const filtered=rows.filter(x=>(x.name+" "+x.team).toLowerCase().includes(query.toLowerCase()));
  const cycle=(name)=>setRows(rows.map(x=>x.name===name?{...x,status:x.status==="Present"?"Late":x.status==="Late"?"Absent":"Present"}:x));
  return <>
    <PageHeader eyebrow="Monday, 26 September 2026" title="Attendance" text="Review check-ins, late arrivals and absences for your team." action={<button className="secondary"><CalendarCheck2 size={16}/> Today</button>}/>
    <div className="card"><Toolbar><SearchBox value={query} onChange={setQuery} placeholder="Search employee..."/><button className="secondary"><Filter size={16}/> All teams</button></Toolbar><div className="table-wrap"><table><thead><tr><th>Employee</th><th>Team</th><th>Check-in</th><th>Status</th><th>Action</th></tr></thead><tbody>{filtered.map(x=><tr key={x.name}><td><div className="person"><div className="avatar small">{initials(x.name)}</div><b>{x.name}</b></div></td><td>{x.team}</td><td>{x.time}</td><td><span className={"badge "+statusClass(x.status)}>{x.status}</span></td><td><button className="text-action" onClick={()=>cycle(x.name)}>Change status</button></td></tr>)}</tbody></table></div></div>
  </>;
}

function PaymentsPage({query,setQuery}) {
  const [tab,setTab]=useState("Pending");
  const [paid,setPaid]=useState(["Meera S"]);
  const payments=employeesSeed.map(x=>({name:x[0],team:x[1],amount:x[3],status:paid.includes(x[0])?"Paid":x[0]==="Vikram Shah"?"Overdue":"Pending"}));
  const visible=payments.filter(x=>(tab==="All"||x.status===tab)&&(x.name+" "+x.team).toLowerCase().includes(query.toLowerCase()));
  return <>
    <PageHeader eyebrow="Payroll workspace" title="Payments" text="Track employee payouts, pending amounts and payment history." action={<button className="primary"><Plus size={18}/> Record payment</button>}/>
    <div className="card"><Toolbar><div className="tabs">{["Pending","Paid","Overdue","All"].map(x=><button key={x} className={tab===x?"tab active":"tab"} onClick={()=>setTab(x)}>{x}</button>)}</div><SearchBox value={query} onChange={setQuery} placeholder="Search employee..."/></Toolbar><div className="table-wrap"><table><thead><tr><th>Employee</th><th>Team</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>{visible.map(x=><tr key={x.name}><td><div className="person"><div className="avatar small">{initials(x.name)}</div><b>{x.name}</b></div></td><td>{x.team}</td><td><b>{x.amount}</b></td><td><span className={"badge "+statusClass(x.status)}>{x.status}</span></td><td>{x.status!=="Paid"&&<button className="text-action" onClick={()=>setPaid(v=>[...v,x.name])}>Mark paid</button>}</td></tr>)}</tbody></table></div></div>
  </>;
}

function AdvancesPage({advances,openModal}) {
  return <>
    <PageHeader eyebrow="Employee advances" title="Advances" text="Track advance requests, approvals and recoveries for your team." action={<button className="primary" onClick={openModal}><Plus size={18}/> Add advance</button>}/>
    <div className="stats">
      <MiniStat icon={CircleDollarSign} label="Outstanding" value="₹13,000" meta="2 employees"/>
      <MiniStat icon={Clock3} label="Pending approval" value="₹8,000" meta="1 request"/>
      <MiniStat icon={CheckCircle2} label="Recovered" value="₹3,500" meta="This month"/>
      <MiniStat icon={Users} label="Employees with advances" value="2" meta="Active recoveries"/>
    </div>
    <div className="card"><Toolbar><button className="secondary"><Filter size={16}/> All statuses</button><button className="secondary"><Download size={16}/> Export</button></Toolbar>
      <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Amount</th><th>Reason</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>{advances.map((x,i)=><tr key={x.employee+x.date+i}><td><div className="person"><div className="avatar small">{initials(x.employee)}</div><b>{x.employee}</b></div></td><td><b>{x.amount}</b></td><td>{x.reason}</td><td>{x.date}</td><td><span className={"badge "+statusClass(x.status==="Recovered"?"Paid":x.status)}>{x.status}</span></td><td><button className="icon-btn"><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table></div>
    </div>
  </>;
}

function ReportsPage() {
  const bars=[58,72,64,82,76,91,87,96,84,93,89,98];
  return <>
    <PageHeader eyebrow="Insights" title="Reports" text="A clear view of attendance, work completion and payroll activity." action={<button className="secondary"><Download size={16}/> Export report</button>}/>
    <section className="stats"><MiniStat icon={TrendingUp} label="Work completion" value="78%" meta="+6.4% vs last month"/><MiniStat icon={CalendarCheck2} label="Attendance" value="91%" meta="+2.1% vs last month"/><MiniStat icon={WalletCards} label="Payroll processed" value="84%" meta="₹8.42L this month"/><MiniStat icon={Users} label="Team utilization" value="76%" meta="48 employees"/></section>
    <div className="report-grid">
      <div className="card"><CardHead title="Work completion trend" text="Last 12 periods"/><div className="bars">{bars.map((h,i)=><div key={i} className="bar-col"><span style={{height:h+"%"}}/><small>{i+1}</small></div>)}</div></div>
      <div className="card"><CardHead title="Work by status" text="Current assignments"/><div className="donut"><div><strong>23</strong><span>Active work</span></div></div><div className="report-legend"><Legend label="In progress" value="14" cls="present"/><Legend label="At risk" value="3" cls="late"/><Legend label="Completed" value="6" cls="done-dot"/></div></div>
    </div>
    <div className="card report-list"><CardHead title="Available reports" text="Ready-to-use workspace reports"/>{["Daily attendance summary","Monthly payment register","Work completion report","Employee productivity overview"].map((x,i)=><div className="report-row" key={x}><div className="quick-icon"><BarChart3 size={18}/></div><div><b>{x}</b><span>Updated {i+1} hour{i?"s":""} ago</span></div><button className="secondary">Open <ArrowUpRight size={15}/></button></div>)}</div>
  </>;
}

function EmployeesPage({query,setQuery,openModal}) {
  const filtered=employeesSeed.filter(x=>(x[0]+" "+x[1]).toLowerCase().includes(query.toLowerCase()));
  return <>
    <PageHeader eyebrow="People" title="Employees" text="Manage your team directory and keep employee details organized." action={<button className="primary" onClick={openModal}><UserPlus size={18}/> Add employee</button>}/>
    <div className="card"><Toolbar><SearchBox value={query} onChange={setQuery} placeholder="Search employee or team..."/><button className="secondary"><Filter size={16}/> Filter</button></Toolbar><div className="employee-grid">{filtered.map(x=><div className="employee-card" key={x[0]}><div className="person"><div className="avatar">{initials(x[0])}</div><div><b>{x[0]}</b><span>{x[1]}</span></div></div><span className={"badge "+statusClass(x[2])}>{x[2]}</span><div className="employee-meta"><span>Monthly pay</span><b>{x[3]}</b></div><button className="ghost wide">View profile <ArrowUpRight size={15}/></button></div>)}</div></div>
  </>;
}

function SettingsPage({role}) {
  const [prefs,setPrefs]=useState({alerts:true,compact:false,auto:true});
  const toggle=k=>setPrefs(v=>({...v,[k]:!v[k]}));
  return <>
    <PageHeader eyebrow="Workspace controls" title="Settings" text="Configure your workspace preferences. Backend settings will be connected later."/>
    <div className="settings-grid"><div className="card settings-card"><CardHead title="Workspace" text="Basic workspace information"/><label>Workspace name<input value="Acme Operations" readOnly/></label><label>Default role<input value={role} readOnly/></label></div><div className="card settings-card"><CardHead title="Preferences" text="Local UI preferences for this prototype"/><SettingRow title="Activity notifications" text="Show alerts for important workspace events" value={prefs.alerts} toggle={()=>toggle("alerts")}/><SettingRow title="Compact tables" text="Reduce row spacing in data tables" value={prefs.compact} toggle={()=>toggle("compact")}/><SettingRow title="Automatic check-in reminder" text="Keep reminder controls visible" value={prefs.auto} toggle={()=>toggle("auto")}/></div></div>
  </>;
}

function SettingRow({title,text,value,toggle}) { return <div className="setting-row"><div><b>{title}</b><span>{text}</span></div><button className={"toggle "+(value?"on":"")} onClick={toggle}><i/></button></div>; }
function CardHead({title,text,action}) { return <div className="card-head"><div><h2>{title}</h2><p>{text}</p></div>{action||<button className="icon-btn"><MoreHorizontal size={19}/></button>}</div>; }
function Legend({label,value,cls}) { return <div><i className={cls}/><span>{label}</span><b>{value}</b></div>; }
function Activity({icon:Icon,title,detail,time}) { return <div className="activity"><div className="activity-icon"><Icon size={17}/></div><div><b>{title}</b><span>{detail}</span></div><time>{time}</time></div>; }
function Quick({icon:Icon,title,text,onClick}) { return <button className="quick-card" onClick={onClick}><div className="quick-icon"><Icon size={19}/></div><div><b>{title}</b><span>{text}</span></div><ArrowUpRight size={17}/></button>; }
function initials(name) { return name.split(" ").map(x=>x[0]).join("").slice(0,2); }
function badgeClass(s) { return s==="Completed"?"done":s==="At risk"?"risk":""; }
function statusClass(s) { return s==="Present"||s==="Paid"?"done":s==="Late"?"late":s==="Overdue"||s==="Absent"?"risk":""; }

function WorkModal({close,add}) {
  const [title,setTitle]=useState(""); const [owner,setOwner]=useState("Ananya Rao");
  return <Modal title="Create new work" close={close}><label>Work title<input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Weekly production review"/></label><label>Assign to<select value={owner} onChange={e=>setOwner(e.target.value)}>{employeesSeed.map(x=><option key={x[0]}>{x[0]}</option>)}</select></label><div className="modal-actions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" disabled={!title.trim()} onClick={()=>add({title:title.trim(),owner,progress:0,status:"In progress",due:"This week"})}>Create work</button></div></Modal>;
}
function EmployeeModal({close}) { return <Modal title="Add employee" close={close}><label>Full name<input autoFocus placeholder="Employee name"/></label><label>Team<input placeholder="Department or team"/></label><label>Monthly pay<input placeholder="₹ 0"/></label><div className="modal-actions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" onClick={close}>Add employee</button></div></Modal>; }
function Modal({title,close,children}) { return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="modal"><div className="modal-head"><div><p className="eyebrow">UI prototype</p><h2>{title}</h2></div><button className="icon-btn" onClick={close}><X size={19}/></button></div>{children}</div></div>; }

export default App;


function QuickActions({close,choose}) {
  return <Modal title="Quick actions" close={close}>
    <div className="action-grid">
      <button className="action-tile" onClick={()=>choose("work")}><div className="quick-icon"><BriefcaseBusiness size={20}/></div><div><b>Add work</b><span>Create and assign a new work item</span></div></button>
      <button className="action-tile" onClick={()=>choose("advance")}><div className="quick-icon"><CircleDollarSign size={20}/></div><div><b>Add advance</b><span>Record an employee advance</span></div></button>
      <button className="action-tile" onClick={()=>choose("labour")}><div className="quick-icon"><Users size={20}/></div><div><b>Add labour</b><span>Add a worker to the workspace</span></div></button>
      <button className="action-tile" onClick={()=>choose("payment")}><div className="quick-icon"><WalletCards size={20}/></div><div><b>Process payments</b><span>Review and process pending payouts</span></div></button>
      <button className="action-tile" onClick={()=>choose("attendance")}><div className="quick-icon"><CalendarCheck2 size={20}/></div><div><b>Mark attendance</b><span>Record today’s employee attendance</span></div></button>
    </div>
  </Modal>;
}
function AdvanceModal({close,add}) {
  const [employee,setEmployee]=useState("Rahul Kumar"); const [amount,setAmount]=useState(""); const [reason,setReason]=useState("");
  return <Modal title="Add advance" close={close}><label>Employee<select value={employee} onChange={e=>setEmployee(e.target.value)}>{employeesSeed.map(x=><option key={x[0]}>{x[0]}</option>)}</select></label><label>Amount<input autoFocus value={amount} onChange={e=>setAmount(e.target.value)} placeholder="₹ 0"/></label><label>Reason<input value={reason} onChange={e=>setReason(e.target.value)} placeholder="Reason for advance"/></label><div className="modal-actions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" disabled={!amount.trim()} onClick={()=>add({employee,amount:amount.trim().startsWith("₹")?amount.trim():"₹"+amount.trim(),reason:reason.trim()||"Employee advance",date:"26 Sep 2026",status:"Pending"})}>Add advance</button></div></Modal>;
}
function LabourModal({close}) { return <Modal title="Add labour" close={close}><label>Full name<input autoFocus placeholder="Worker name"/></label><label>Work type<select><option>Production</option><option>Paper</option><option>Mesh</option><option>General labour</option></select></label><label>Daily rate<input placeholder="₹ 0"/></label><div className="modal-actions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" onClick={close}>Add labour</button></div></Modal>; }
function AttendanceModal({close}) { return <Modal title="Mark attendance" close={close}><label>Employee<select><option>Ananya Rao</option><option>Rahul Kumar</option><option>Meera S</option><option>Vikram Shah</option><option>Priya Nair</option><option>Arjun Das</option></select></label><label>Status<select><option>Present</option><option>Late</option><option>Absent</option></select></label><div className="modal-actions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" onClick={close}>Mark attendance</button></div></Modal>; }
function PaymentModal({close}) { return <Modal title="Process payments" close={close}><p className="modal-note">Review pending employee payouts from the Payments section before processing.</p><div className="payment-preview">{employeesSeed.filter(x=>x[0]!=="Meera S").slice(0,4).map(x=><div key={x[0]}><span>{x[0]}</span><b>{x[3]}</b></div>)}</div><div className="modal-actions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" onClick={close}>Process payments</button></div></Modal>; }
