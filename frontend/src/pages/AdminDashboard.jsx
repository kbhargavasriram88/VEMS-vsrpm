import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  FaRegCalendarAlt, FaRegNewspaper, FaImages, FaUserPlus, 
  FaUsers, FaChalkboardTeacher, FaEnvelope, FaEye, FaSpinner,
  FaSync, FaArrowUp, FaChartBar, FaChartLine, FaChartPie, FaLayerGroup
} from 'react-icons/fa';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

// ── Animated Count Hook ────────────────────────────────────────────────────────
const useCountUp = (target, duration = 1200) => {
  const [count, setCount] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
};

// ── Stat Card ──────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, delta, deltaLabel, icon: Icon, colorClass, borderColor }) => {
  const animated = useCountUp(value);
  return (
    <div style={{ background: 'var(--bg-card)', borderColor, borderWidth: 1, borderStyle: 'solid' }}
      className="rounded-xl p-5 flex justify-between items-start transition-all hover:shadow-lg">
      <div>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm font-bold mb-1">{label}</p>
        <h3 style={{ color: 'var(--text-main)' }} className="text-3xl font-extrabold mb-2">{animated.toLocaleString()}</h3>
        <p className="text-sm text-green-500 font-bold flex items-center gap-1">
          <FaArrowUp size={10} /> +{delta} {deltaLabel}
        </p>
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${colorClass}`}>
        <Icon size={16} />
      </div>
    </div>
  );
};

// ── Chart Wrapper ──────────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, icon: Icon, iconColor, children }) => (
  <div style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)', borderWidth: 1, borderStyle: 'solid' }}
    className="rounded-xl p-6 flex flex-col gap-4 shadow-sm">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} style={{ color: iconColor }} />
        <h3 style={{ color: 'var(--text-main)' }} className="text-base font-bold">{title}</h3>
      </div>
      <p style={{ color: 'var(--text-muted)' }} className="text-xs">{subtitle}</p>
    </div>
    <div style={{ background: 'var(--bg-inner)', borderColor: 'var(--border-subtle)', borderWidth: 1, borderStyle: 'solid' }}
      className="flex-grow flex items-center justify-center rounded-xl p-2">
      {children}
    </div>
  </div>
);

// ── 1. Line Chart: Monthly Admissions ─────────────────────────────────────────
const LineChart = ({ trend }) => {
  const [hovered, setHovered] = useState(null);
  if (!trend || trend.length < 2) return null;

  const W = 560, H = 220, PX = 50, PY = 30;
  const maxVal = Math.max(...trend.map(d => d.count), 1);
  const pts = trend.map((d, i) => ({
    x: PX + i * (W - 2 * PX) / (trend.length - 1),
    y: H - PY - (d.count / maxVal) * (H - 2 * PY),
    ...d,
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${pts[pts.length-1].x} ${H - PY} L ${pts[0].x} ${H - PY} Z`;

  return (
    <div className="relative w-full" style={{ height: 220 }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
          const y = PY + r * (H - 2 * PY);
          return (
            <g key={i}>
              <line x1={PX} y1={y} x2={W - PX} y2={y} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4" className="dark:stroke-white/10" />
              <text x={PX - 8} y={y + 4} textAnchor="end" fontSize={9} fill="#9ca3af">{Math.round(maxVal * (1 - r))}</text>
            </g>
          );
        })}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={H - 10} textAnchor="middle" fontSize={9} fill="#9ca3af">{p.month}</text>
        ))}
        <path d={areaPath} fill="url(#lg1)" />
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={hovered === i ? 7 : 4.5}
            fill="#3b82f6" stroke="#fff" strokeWidth={2} className="cursor-pointer transition-all"
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
        ))}
      </svg>
      {hovered !== null && (
        <div className="chart-tooltip absolute z-20 pointer-events-none bg-gray-900 rounded-lg px-3 py-2 text-xs font-bold shadow-2xl"
          style={{
            left: `${(pts[hovered].x / W) * 100}%`,
            top: `${(pts[hovered].y / H) * 100 - 15}%`,
            transform: 'translate(-50%, -100%)',
            color: '#fff',
          }}>
          <div style={{ color: '#d1d5db' }}>{pts[hovered].month}</div>
          <div style={{ color: '#93c5fd' }}>{pts[hovered].count} Inquiries</div>
        </div>
      )}
    </div>
  );
};

// ── 2. Bar Chart: Grade Distribution ─────────────────────────────────────────
const BarChart = ({ dist }) => {
  const [hovered, setHovered] = useState(null);
  if (!dist) return null;

  const W = 560, H = 220, PX = 45, PY = 25;
  const maxVal = Math.max(...dist.map(d => d.count), 1);
  const chartW = W - 2 * PX;
  const barW = Math.max(Math.floor(chartW / dist.length) - 8, 10);

  const bars = dist.map((d, i) => {
    const x = PX + i * (chartW / dist.length) + 4;
    const bH = (d.count / maxVal) * (H - 2 * PY);
    const y = H - PY - bH;
    return { x, y, bH, ...d };
  });

  return (
    <div className="relative w-full" style={{ height: 220 }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="lg2h" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
          const y = PY + r * (H - 2 * PY);
          return (
            <g key={i}>
              <line x1={PX} y1={y} x2={W - PX} y2={y} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4" className="dark:stroke-white/10" />
              <text x={PX - 8} y={y + 4} textAnchor="end" fontSize={9} fill="#9ca3af">{Math.round(maxVal * (1 - r))}</text>
            </g>
          );
        })}
        {bars.map((b, i) => (
          <rect key={i} x={b.x} y={b.y} width={barW} height={Math.max(b.bH, 2)} rx={3}
            fill={hovered === i ? 'url(#lg2h)' : 'url(#lg2)'}
            className="cursor-pointer transition-all"
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
        ))}
        {bars.map((b, i) => (
          <text key={i} x={b.x + barW / 2} y={H - 8} textAnchor="middle" fontSize={8} fill="#9ca3af">
            {b.grade.replace(' Class', '')}
          </text>
        ))}
      </svg>
      {hovered !== null && (
        <div className="chart-tooltip absolute z-20 pointer-events-none bg-gray-900 rounded-lg px-3 py-2 text-xs font-bold shadow-2xl"
          style={{
            left: `${((bars[hovered].x + barW / 2) / W) * 100}%`,
            top: `${(bars[hovered].y / H) * 100 - 10}%`,
            transform: 'translate(-50%, -100%)',
            color: '#fff',
          }}>
          <div style={{ color: '#d1d5db' }}>{bars[hovered].grade}</div>
          <div style={{ color: '#fde68a' }}>{bars[hovered].count} Inquiries</div>
        </div>
      )}
    </div>
  );
};

// ── 3. Donut Chart: Admission Status ─────────────────────────────────────────
const DonutChart = ({ statusData }) => {
  const [hovered, setHovered] = useState(null);
  if (!statusData) return null;

  const STATUS_COLORS = { 'New': '#3b82f6', 'Under Review': '#f59e0b', 'Approved': '#22c55e', 'Rejected': '#ef4444' };
  const actualTotal = statusData.reduce((s, d) => s + d.count, 0);
  const totalForCalc = actualTotal || 1;
  const CX = 100, CY = 100, R = 70, IR = 45;
  const circumference = 2 * Math.PI * R;

  let offset = 0;
  const segments = statusData.map(d => {
    const pct = d.count / totalForCalc;
    const dashLen = pct * circumference;
    const seg = { ...d, offset, dashLen, pct };
    offset += dashLen;
    return seg;
  });

  return (
    <div className="flex flex-col items-center gap-4 w-full py-2">
      <div className="relative" style={{ width: 200, height: 200 }}>
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke={STATUS_COLORS[seg.status] || '#6366f1'}
              strokeWidth={hovered === i ? 28 : 24}
              strokeDasharray={`${seg.dashLen} ${circumference - seg.dashLen}`}
              strokeDashoffset={-seg.offset}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          <circle cx={CX} cy={CY} r={IR} style={{ fill: 'var(--bg-card)' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold" style={{ color: 'var(--text-main)' }}>{actualTotal}</span>
          <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Total</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 w-full max-w-xs">
        {segments.map((seg, i) => (
          <div key={i}
            className={`flex items-center gap-2 cursor-pointer rounded-lg px-2 py-1 transition-all ${hovered === i ? 'bg-gray-100 dark:bg-white/5' : ''}`}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[seg.status] }} />
            <span className="text-xs font-semibold truncate" style={{ color: 'var(--text-muted)' }}>{seg.status}</span>
            <span className="text-xs font-extrabold ml-auto" style={{ color: STATUS_COLORS[seg.status] }}>{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── 4. Multi-Line Chart: Content Overview ────────────────────────────────────
const MultiLineChart = ({ data }) => {
  const [hovered, setHovered] = useState(null);
  if (!data || data.length < 2) return null;

  const SERIES = [
    { key: 'news',   color: '#3b82f6', label: 'News' },
    { key: 'events', color: '#22c55e', label: 'Events' },
    { key: 'gallery',color: '#a855f7', label: 'Gallery' },
  ];

  const W = 560, H = 200, PX = 50, PY = 25;
  const allVals = data.flatMap(d => SERIES.map(s => d[s.key]));
  const maxVal = Math.max(...allVals, 1);

  const getPoints = (key) => data.map((d, i) => ({
    x: PX + i * (W - 2 * PX) / (data.length - 1),
    y: H - PY - (d[key] / maxVal) * (H - 2 * PY),
    val: d[key],
    month: d.month,
    key,
  }));

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="relative w-full" style={{ height: 200 }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
            const y = PY + r * (H - 2 * PY);
            return (
              <g key={i}>
                <line x1={PX} y1={y} x2={W - PX} y2={y} stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4" className="dark:stroke-white/10" />
                <text x={PX - 8} y={y + 4} textAnchor="end" fontSize={9} fill="#9ca3af">{Math.round(maxVal * (1 - r))}</text>
              </g>
            );
          })}
          {data.map((d, i) => {
            const x = PX + i * (W - 2 * PX) / (data.length - 1);
            return <text key={i} x={x} y={H - 8} textAnchor="middle" fontSize={9} fill="#9ca3af">{d.month}</text>;
          })}

          {SERIES.map(s => {
            const pts = getPoints(s.key);
            const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
            return (
              <g key={s.key}>
                <path d={linePath} fill="none" stroke={s.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y}
                    r={hovered?.key === s.key && hovered?.idx === i ? 6 : 3.5}
                    fill={s.color} stroke="#fff" strokeWidth={1.5} className="cursor-pointer transition-all"
                    onMouseEnter={() => setHovered({ key: s.key, idx: i, ...p, color: s.color, label: s.label })}
                    onMouseLeave={() => setHovered(null)} />
                ))}
              </g>
            );
          })}
        </svg>
        {hovered && (
          <div className="chart-tooltip absolute z-20 pointer-events-none bg-gray-900 rounded-lg px-3 py-2 text-xs font-bold shadow-2xl"
            style={{
              left: `${(hovered.x / W) * 100}%`,
              top: `${(hovered.y / H) * 100 - 15}%`,
              transform: 'translate(-50%, -100%)',
              color: '#fff',
            }}>
            <div style={{ color: '#d1d5db' }}>{hovered.month}</div>
            <div style={{ color: hovered.color }}>{hovered.label}: {hovered.val}</div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-6 flex-wrap">
        {SERIES.map(s => (
          <div key={s.key} className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded-full" style={{ background: s.color }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main AdminDashboard ───────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await api.get('/dashboard/stats');
      setData(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => fetchStats(true), 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return 'text-blue-500';
      case 'Under Review': return 'text-orange-500';
      case 'Approved': return 'text-green-500';
      case 'Rejected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-textSecondary gap-3">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
        <p className="text-sm font-bold">Loading dashboard statistics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <p className="text-base font-bold text-red-500">Failed to load dashboard statistics.</p>
        <button onClick={() => fetchStats()} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors">
          Retry
        </button>
      </div>
    );
  }

  const { counts, recentAdmissions } = data;

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: 'var(--text-main)' }} className="text-2xl font-extrabold mb-1">Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm font-medium">Home / Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span style={{ color: 'var(--text-muted)' }} className="text-xs hidden sm:block">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-xs font-bold rounded-lg transition-all"
            style={{ color: '#fff' }}
          >
            <FaSync className={refreshing ? 'animate-spin' : ''} size={10} /> Refresh
          </button>
          <div style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)', borderWidth: 1, borderStyle: 'solid', color: 'var(--text-muted)' }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} <FaRegCalendarAlt />
          </div>
        </div>
      </div>

      {/* ── Top Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total News" value={counts.news} delta={counts.newsThisMonth} deltaLabel="this month"
          icon={FaRegNewspaper} colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
          borderColor="rgba(59,130,246,0.15)" />
        <StatCard label="Total Events" value={counts.events} delta={counts.eventsThisMonth} deltaLabel="this month"
          icon={FaRegCalendarAlt} colorClass="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20"
          borderColor="rgba(34,197,94,0.15)" />
        <StatCard label="Gallery Photos" value={counts.gallery} delta={counts.galleryThisMonth} deltaLabel="this month"
          icon={FaImages} colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20"
          borderColor="rgba(168,85,247,0.15)" />
        <StatCard label="Admission Requests" value={counts.admissions} delta={counts.admissionsThisMonth} deltaLabel="this month"
          icon={FaUserPlus} colorClass="bg-orange-100 dark:bg-orange-900/30 text-orange-500 border-orange-200 dark:border-orange-500/20"
          borderColor="rgba(249,115,22,0.15)" />
      </div>

      {/* ── Charts Row 1: Line + Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Admission Inquiries" subtitle="6-month trend from database" icon={FaChartLine} iconColor="#3b82f6">
            <LineChart trend={data.monthlyTrend} />
          </ChartCard>
        </div>
        <div>
          <ChartCard title="Admission Status" subtitle="Live breakdown by status" icon={FaChartPie} iconColor="#a855f7">
            <DonutChart statusData={data.statusDistribution} />
          </ChartCard>
        </div>
      </div>

      {/* ── Charts Row 2: Bar + Multi-Line ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Applications by Grade" subtitle="Distribution across Class I–X" icon={FaChartBar} iconColor="#f59e0b">
          <BarChart dist={data.gradeDistribution} />
        </ChartCard>
        <ChartCard title="Content Published per Month" subtitle="News · Events · Gallery over 6 months" icon={FaLayerGroup} iconColor="#22c55e">
          <MultiLineChart data={data.contentOverview} />
        </ChartCard>
      </div>

      {/* ── Recent Admissions Table ── */}
      <div style={{ background: 'var(--bg-card)', borderColor: 'var(--border-main)', borderWidth: 1, borderStyle: 'solid' }}
        className="rounded-xl overflow-hidden shadow-sm">
        <div style={{ borderColor: 'var(--border-subtle)', borderBottomWidth: 1, borderBottomStyle: 'solid' }}
          className="px-6 py-5 flex justify-between items-center">
          <h2 style={{ color: 'var(--text-main)' }} className="text-base font-bold">Recent Admissions</h2>
          <button onClick={() => navigate('/admin/admissions')} className="text-sm text-blue-500 font-bold hover:underline bg-transparent">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: 'var(--bg-inner)', borderColor: 'var(--border-subtle)', borderBottomWidth: 1, borderBottomStyle: 'solid' }}>
                {['#','Student Name','Class','Parent Name','Date','Status','Action'].map(h => (
                  <th key={h} style={{ color: 'var(--text-muted)' }} className="py-3 px-6 text-xs font-bold uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentAdmissions.map((item, index) => (
                <tr key={item._id} style={{ borderColor: 'var(--border-subtle)', borderBottomWidth: 1, borderBottomStyle: 'solid' }}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td style={{ color: 'var(--text-muted)' }} className="py-3 px-6 text-sm">{index + 1}</td>
                  <td style={{ color: 'var(--text-main)' }} className="py-3 px-6 text-sm font-semibold">{item.studentName}</td>
                  <td style={{ color: 'var(--text-muted)' }} className="py-3 px-6 text-sm">{item.gradeApplyingFor}</td>
                  <td style={{ color: 'var(--text-muted)' }} className="py-3 px-6 text-sm">{item.parentName}</td>
                  <td style={{ color: 'var(--text-muted)' }} className="py-3 px-6 text-sm">
                    {new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-6">
                    <span className={`text-xs font-bold ${getStatusStyle(item.status)}`}>{item.status}</span>
                  </td>
                  <td className="py-3 px-6">
                    <button onClick={() => navigate('/admin/admissions')} className="text-gray-400 hover:text-blue-500 transition-colors" title="View Details">
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={counts.students} delta={counts.studentsThisMonth} deltaLabel="this month"
          icon={FaUsers} colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
          borderColor="rgba(59,130,246,0.15)" />
        <StatCard label="Total Teachers" value={counts.faculty} delta={counts.facultyThisMonth} deltaLabel="this month"
          icon={FaChalkboardTeacher} colorClass="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20"
          borderColor="rgba(34,197,94,0.15)" />
        <StatCard label="Events This Month" value={counts.eventsThisMonth} delta={0} deltaLabel="active"
          icon={FaRegCalendarAlt} colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20"
          borderColor="rgba(168,85,247,0.15)" />
        <StatCard label="Messages" value={counts.messages} delta={counts.messagesThisMonth} deltaLabel="this month"
          icon={FaEnvelope} colorClass="bg-orange-100 dark:bg-orange-900/30 text-orange-500 border-orange-200 dark:border-orange-500/20"
          borderColor="rgba(249,115,22,0.15)" />
      </div>

    </div>
  );
};

export default AdminDashboard;
