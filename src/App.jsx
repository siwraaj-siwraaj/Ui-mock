import { useState } from "react";
import {
  LayoutDashboard, BriefcaseBusiness, CalendarCheck2, WalletCards,
  BarChart3, Users, Settings, Search, Bell, Plus, ArrowUpRight,
  Clock3, CheckCircle2, CircleAlert, ChevronDown, Menu, X, MoreHorizontal
} from "lucide-react";

const nav = [
  ["Overview", LayoutDashboard], ["Work", BriefcaseBusiness],
  ["Attendance", CalendarCheck2], ["Payments", WalletCards],
  ["Reports", BarChart3], ["Employees", Users]
];

const work = [
  { title: "Production planning", owner: "Ananya Rao", progress: 82, status: "In progress" },
  { title: "Monthly attendance review", owner: "Rahul Kumar", progress: 64, status: "In progress" },
  { title: "Payment reconciliation", owner: "Meera S", progress: 100, status: "Completed" }
];

function App() {
  const [active, setActive] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState("Admin");

  return (
    <div className="app">
      <aside className={mobileOpen ? "sidebar open" : "sidebar"}>
        <div className="brand"><div className="brand-mark">U</div><div><b>UI Template</b><span>Work management</span></div></div>
        <div className="workspace"><span>Workspace</span><button><span>Acme Operations</span><ChevronDown size={15}/></button></div>
        <nav>{nav.map(([label, Icon]) =>
          <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => {setActive(label);setMobileOpen(false)}}><Icon size={19}/><span>{label}</span></button>
        )}</nav>
        <div className="sidebar-bottom">
          <button className="nav-item"><Settings size={19}/><span>Settings</span></button>
          <div className="user-mini"><div className="avatar">SC</div><div><b>Shivaraj</b><span>{role}</span></div><MoreHorizontal size={18}/></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X/> : <Menu/>}</button>
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{active}</strong></div>
          <div className="top-actions">
            <div className="search"><Search size={17}/><input placeholder="Search anything..." /></div>
            <button className="icon-btn"><Bell size={19}/><i/></button>
            <button className="role-switch" onClick={() => setRole(role === "Admin" ? "Employee" : "Admin")}>{role}<ChevronDown size={15}/></button>
          </div>
        </header>

        <div className="content">
          <section className="welcome">
            <div><p className="eyebrow">Monday, 26 September 2026</p><h1>Good morning, Shivaraj <span>✦</span></h1><p>Here’s what’s happening across your workspace today.</p></div>
            <button className="primary"><Plus size={18}/> Create work</button>
          </section>

          <section className="stats">
            <Stat icon={Users} label="Total employees" value="48" change="+4 this month" />
            <Stat icon={CalendarCheck2} label="Present today" value="42" change="87.5% attendance" />
            <Stat icon={BriefcaseBusiness} label="Active work" value="23" change="8 due this week" />
            <Stat icon={WalletCards} label="Pending payments" value="₹1.84L" change="12 employees" />
          </section>

          <section className="grid">
            <div className="card attendance-card">
              <div className="card-head"><div><h2>Attendance</h2><p>Today’s workforce overview</p></div><button className="ghost">View details <ArrowUpRight size={16}/></button></div>
              <div className="attendance-body">
                <div className="ring"><div><strong>87.5%</strong><span>Present</span></div></div>
                <div className="attendance-legend">
                  <Legend label="Present" value="42" cls="present"/><Legend label="Late" value="3" cls="late"/><Legend label="Absent" value="3" cls="absent"/>
                </div>
              </div>
              <div className="attendance-note"><Clock3 size={16}/><span>Average check-in time</span><b>9:08 AM</b></div>
            </div>

            <div className="card activity-card">
              <div className="card-head"><div><h2>Recent activity</h2><p>Latest workspace updates</p></div><button className="icon-btn"><MoreHorizontal size={19}/></button></div>
              <div className="activity-list">
                <Activity icon={CheckCircle2} title="Payment marked as paid" text="Rahul Kumar · ₹12,500" time="12 min ago"/>
                <Activity icon={BriefcaseBusiness} title="New work assigned" text="Production planning · Ananya Rao" time="38 min ago"/>
                <Activity icon={CalendarCheck2} title="Attendance updated" text="3 employees checked in" time="1 hr ago"/>
                <Activity icon={CircleAlert} title="Work deadline approaching" text="Inventory audit · Tomorrow" time="2 hrs ago"/>
              </div>
            </div>
          </section>

          <section className="card work-card">
            <div className="card-head"><div><h2>Work overview</h2><p>Track active assignments and progress</p></div><button className="ghost">See all work <ArrowUpRight size={16}/></button></div>
            <div className="table-wrap"><table><thead><tr><th>Work</th><th>Assigned to</th><th>Progress</th><th>Status</th><th></th></tr></thead><tbody>
              {work.map((item) => <tr key={item.title}><td><b>{item.title}</b><span className="sub">Updated today</span></td><td><div className="person"><div className="avatar small">{item.owner.split(" ").map(x=>x[0]).join("").slice(0,2)}</div>{item.owner}</div></td><td><div className="progress"><div><span style={{width:item.progress+"%"}}/></div><b>{item.progress}%</b></div></td><td><span className={item.status === "Completed" ? "badge done" : "badge"}>{item.status}</span></td><td><button className="icon-btn"><MoreHorizontal size={18}/></button></td></tr>)}
            </tbody></table></div>
          </section>

          <section className="quick">
            <Quick icon={Plus} title="Create new work" text="Assign a task to your team" />
            <Quick icon={CalendarCheck2} title="Manage attendance" text="Review today’s check-ins" />
            <Quick icon={WalletCards} title="Process payments" text="Review pending payouts" />
            <Quick icon={BarChart3} title="View reports" text="Explore workforce insights" />
          </section>
        </div>

        <div className="mobile-nav">{nav.slice(0,5).map(([label,Icon]) => <button key={label} className={active===label?"active":""} onClick={()=>setActive(label)}><Icon size={19}/><span>{label}</span></button>)}</div>
      </main>
    </div>
  );
}

function Stat({icon:Icon,label,value,change}) { return <div className="stat"><div className="stat-icon"><Icon size={19}/></div><p>{label}</p><strong>{value}</strong><span>{change}</span></div> }
function Legend({label,value,cls}) { return <div><i className={cls}/><span>{label}</span><b>{value}</b></div> }
function Activity({icon:Icon,title,text:detail,time}) { return <div className="activity"><div className="activity-icon"><Icon size={17}/></div><div><b>{title}</b><span>{detail}</span></div><time>{time}</time></div> }
function Quick({icon:Icon,title,text}) { return <button className="quick-card"><div className="quick-icon"><Icon size={19}/></div><div><b>{title}</b><span>{text}</span></div><ArrowUpRight size={17}/></button> }

export default App;
