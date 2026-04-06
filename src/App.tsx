import {
  BarChart3,
  Shield,
  Users,
  Swords,
  AlertTriangle,
  Menu,
  X,
  CalendarDays,
  Home,
  Search,
  Filter,
  Clock3,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Papa from "papaparse";

const unionInfo = {
  name: "PEACH",
  id: "12894",
  currentMembers: 29,
  maxMembers: 32,
  recruitmentStatus: "募集中",
};

const removalRules = ["未ログイン3日以上", "ハード戦無凸"];

const syncLevels = [
  160, 242, 269, 289, 267, 386, 342, 415, 373, 385,
  439, 564, 595, 543, 569, 576, 562, 642, 594, 612,
  636, 604, 582, 621, 637, 662, 668, 688, 673,
];

const levelBins = [
  { range: "100-199", min: 100, max: 199 },
  { range: "200-299", min: 200, max: 299 },
  { range: "300-399", min: 300, max: 399 },
  { range: "400-499", min: 400, max: 499 },
  { range: "500-599", min: 500, max: 599 },
  { range: "600-699", min: 600, max: 699 },
];

const levelDistribution = levelBins.map((bin) => ({
  range: bin.range,
  members: syncLevels.filter((level) => level >= bin.min && level <= bin.max).length,
}));

const recentRaidResults = [
  { raid: "R7.9", percent: 1.98 },
  { raid: "R7.10", percent: 1.73 },
  { raid: "R7.11", percent: 1.49 },
  { raid: "R7.12", percent: 1.44 },
  { raid: "R8.1", percent: 1.5 },
  { raid: "R8.2", percent: 1.59 },
  { raid: "R8.3", percent: 1.51 },
];

type LevelTickProps = {
  x?: number;
  y?: number;
  payload?: { value: string };
  isMobile: boolean;
};

function LevelAxisTick({ x, y, payload, isMobile }: LevelTickProps) {
  if (x == null || y == null || !payload) return null;

  return (
    <text
      x={x}
      y={y + 18}
      textAnchor="middle"
      fill="rgba(255,255,255,0.6)"
      fontSize={isMobile ? 9 : 18}
    >
      {payload.value}
    </text>
  );
}

type RaidTickProps = {
  x?: number;
  y?: number;
  payload?: { value: string };
  isMobile: boolean;
};

function RaidAxisTick({ x, y, payload, isMobile }: RaidTickProps) {
  if (x == null || y == null || !payload) return null;

  return (
    <text
      x={x}
      y={y + 16}
      textAnchor="middle"
      fill="rgba(255,255,255,0.6)"
      fontSize={isMobile ? 11 : 14}
    >
      {payload.value}
    </text>
  );
}

type RaidDotProps = {
  cx?: number;
  cy?: number;
  payload?: { percent: number };
};

function CustomRaidDot({ cx, cy, payload }: RaidDotProps) {
  if (cx == null || cy == null || !payload) return null;

  const best = Math.min(...recentRaidResults.map((r) => r.percent));
  const isBest = payload.percent === best;

  if (isBest) {
    const points = [
      [0, -9],
      [2.4, -3.2],
      [8.6, -3.2],
      [3.6, 0.8],
      [5.5, 7.4],
      [0, 3.2],
      [-5.5, 7.4],
      [-3.6, 0.8],
      [-8.6, -3.2],
      [-2.4, -3.2],
    ]
      .map(([x, y]) => `${cx + x},${cy + y}`)
      .join(" ");

    return (
      <polygon
        points={points}
        fill="#ffd166"
        stroke="#fff3bf"
        strokeWidth={1.5}
        style={{ filter: "drop-shadow(0 0 6px rgba(255, 209, 102, 0.45))" }}
      />
    );
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="#ffffff"
      stroke="rgba(103,232,249,0.95)"
      strokeWidth={3}
    />
  );
}

type EventStatus = "implemented" | "unimplemented";

type EventItem = {
  status: EventStatus;
  name: string;
  startDate: string;
  endDate: string;
  archiveDate: string;
  daysToArchive: number | null;
  note: string;
};

type CsvRow = {
  読了?: string;
  "未実装/実装"?: string;
  名称?: string;
  イベ開始日?: string;
  イベ終了日?: string;
  アーカイブ追加日?: string;
  "イベ終了から\nアーカイブ追加まで(日)"?: string;
  備考?: string;
  [key: string]: string | undefined;
};

function normalizeStatus(value?: string): EventStatus {
  return value?.trim() === "◯" ? "implemented" : "unimplemented";
}

function normalizeText(value?: string) {
  return (value ?? "").trim();
}

function normalizeNumber(value?: string) {
  const raw = normalizeText(value);
  if (!raw || raw === "—" || raw === "-") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function parseDateLabel(value?: string) {
  const raw = normalizeText(value);
  if (!raw) return "—";
  return raw;
}

function statusLabel(status: EventStatus) {
  return status === "implemented" ? "実装済み" : "未実装";
}

function statusClass(status: EventStatus) {
  return status === "implemented"
    ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
    : "border-amber-300/20 bg-amber-300/10 text-amber-100";
}

function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const baseItem =
    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition";
  const activeItem = "bg-white/10 text-white";
  const inactiveItem = "text-white/80 hover:bg-white/5";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        メニュー
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-30 mt-2 min-w-[220px] overflow-hidden rounded-2xl border border-white/10 bg-[#11151f]/95 shadow-2xl backdrop-blur-xl">
          <NavLink
            to="/"
            end
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${baseItem} border-b border-white/10 ${isActive ? activeItem : inactiveItem}`
            }
          >
            <Home className="h-4 w-4 text-[#ffd38b]" />
            ダッシュボード
          </NavLink>

          <NavLink
            to="/events"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `${baseItem} ${isActive ? activeItem : inactiveItem}`
            }
          >
            <CalendarDays className="h-4 w-4 text-cyan-300" />
            イベント一覧
          </NavLink>
        </div>
      )}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#090b11] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,173,51,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_25%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_35%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-center text-sm font-medium text-amber-100 shadow-[0_0_20px_rgba(252,211,77,0.08)]">
            ※非公式のファンサイトです
          </div>
          <NavMenu />
        </div>
        {children}
      </div>
    </div>
  );
}

function DashboardPage() {
  const avgSyncLevel = Math.round(
    syncLevels.reduce((sum, level) => sum + level, 0) / Math.max(syncLevels.length, 1)
  );
  const maxSyncLevel = Math.max(...syncLevels);
  const bestPercent = Math.min(...recentRaidResults.map((r) => r.percent));
  const latestPercent = recentRaidResults[recentRaidResults.length - 1].percent;

  const visualPath = `${import.meta.env.BASE_URL}images/union-visual.png`;
  const mascotGifPath = `${import.meta.env.BASE_URL}images/union-mascot.gif`;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const barCategoryGap = isMobile ? 8 : 18;
  const maxBarSize = isMobile ? 48 : 56;

  return (
    <>
      <header className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.1fr_1fr] lg:p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-[#f6b44b]/40 bg-[#f6b44b]/10 px-3 py-1 text-sm text-[#ffd38b]">
                <Shield className="h-4 w-4" />
                NIKKE UNION DASHBOARD
              </div>
              <div className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                ※2026/4/1時点の情報参照
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-white/45">Union Profile</p>
              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <h1 className="text-5xl font-black tracking-tight sm:text-6xl">{unionInfo.name}</h1>

                <div className="inline-flex items-center gap-3 self-start rounded-2xl border border-white/10 bg-black/25 px-5 py-4 sm:mt-1">
                  <div className="text-xs uppercase tracking-[0.18em] text-white/45">Union ID</div>
                  <div className="text-2xl font-black tracking-[0.12em] text-white sm:text-3xl">
                    {unionInfo.id}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-white/45">Union Status</div>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="text-3xl font-black text-white">
                      {unionInfo.currentMembers}
                      <span className="text-lg text-white/55"> / {unionInfo.maxMembers}</span>
                    </div>
                    <div className="mt-1 text-sm text-white/62">現在の在籍メンバー数</div>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <div className="rounded-full border border-[#f6b44b]/30 bg-[#f6b44b]/10 px-3 py-1 text-sm font-semibold text-[#ffd38b]">
                      {unionInfo.recruitmentStatus}
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/78">
                      募集人数：{unionInfo.maxMembers - unionInfo.currentMembers}名
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-cyan-200">
                  <Shield className="h-4 w-4" />
                  <div className="text-sm font-semibold tracking-wide text-white">ユニオン内の運用</div>
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <div className="text-sm font-semibold text-white">ユニオンレイドの進め方</div>
                    <p className="mt-1 text-xs leading-5 text-white/62">
                      ノーマルは早い者勝ち、ハードは全員参加で時間指定あり。凸指定はありません。
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <div className="text-sm font-semibold text-white">協同作戦もユニオン内で実施</div>
                    <p className="mt-1 text-xs leading-5 text-white/62">
                      Discordでの協同作戦は22時頃が多いです。VCもあります(チャット参加OK)。
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <div className="text-sm font-semibold text-white">ネタバレのご配慮</div>
                    <p className="mt-1 text-xs leading-5 text-white/62">
                      ネタバレには気をつけましょう！ロール選択チャネルにてロールを選択しましょう。
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                  <img
                    src={mascotGifPath}
                    alt="ユニオンマスコットGIF"
                    className="w-full object-cover"
                  />
                </div>
                <p className="mt-3 px-1 text-[8px] leading-4 text-white/45 sm:text-[9px] sm:leading-4 break-words">
                  GODDESS OF VICTORY: NIKKEの画像・権利は権利者に帰属します。
                </p>
              </div>
            </div>
          </div>

          <div className="flex min-h-full flex-col rounded-3xl border border-[#f6b44b]/15 bg-[linear-gradient(180deg,rgba(246,180,75,0.14),rgba(255,255,255,0.03))] p-5 sm:p-6">
            <div className="flex-1 rounded-2xl border border-white/10 bg-black/15 p-3">
              <div className="relative flex h-full min-h-[240px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <img
                  src={visualPath}
                  alt="ユニオンビジュアル"
                  className="h-full min-h-[240px] w-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,11,17,0.08),rgba(9,11,17,0.18))]" />
              </div>
              <p className="mt-3 px-1 text-[8px] leading-4 text-white/45 sm:text-[9px] sm:leading-4 break-words">
                GODDESS OF VICTORY: NIKKEの画像・権利は権利者に帰属します。
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-[#f6b44b]/20 bg-[linear-gradient(180deg,rgba(246,180,75,0.14),rgba(255,255,255,0.02))] p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#f6b44b]/30 bg-[#f6b44b]/10 px-3 py-1 text-sm font-semibold text-[#ffd38b] shadow-[0_0_20px_rgba(246,180,75,0.12)]">
                  <Users className="h-4 w-4" />
                  加入・在籍ルール
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center gap-2 text-[#ffd38b]">
                  <AlertTriangle className="h-4 w-4" />
                  <div className="text-sm font-semibold tracking-wide text-white">脱退条件</div>
                </div>
                <div className="mt-3 grid gap-2">
                  {removalRules.map((rule) => (
                    <div
                      key={rule}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3"
                    >
                      <div className="h-2 w-2 rounded-full bg-[#ffd38b]" />
                      <div className="text-sm text-white/82">{rule}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs leading-5 text-white/60">
                  <div>※難しい場合は一言連絡ください</div>
                  <div>※加入は日本の方限定</div>
                  <div>※加入承認制</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[#ffd38b]">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                    Sync Level Distribution
                  </span>
                </div>
                <h2 className="mt-2 text-2xl font-bold">シンクロレベル分布</h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="grid grid-cols-2 gap-4 text-right">
                  <div>
                    <div className="text-xs text-white/45">平均シンクロLv</div>
                    <div className="text-xl font-bold">{avgSyncLevel}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/45">最高シンクロLv</div>
                    <div className="text-xl font-bold text-[#ffd38b]">{maxSyncLevel}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelDistribution} barCategoryGap={barCategoryGap}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis
                    dataKey="range"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    minTickGap={0}
                    tick={<LevelAxisTick isMobile={isMobile} />}
                    tickMargin={8}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.6)"
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(9,11,17,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 16,
                      color: "white",
                    }}
                  />
                  <Bar
                    dataKey="members"
                    radius={[10, 10, 0, 0]}
                    fill="rgba(246,180,75,0.95)"
                    maxBarSize={maxBarSize}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-cyan-200">
                  <Swords className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                    Union Raid Results
                  </span>
                </div>
                <h2 className="mt-2 text-2xl font-bold">ユニオンレイド成績推移</h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="grid grid-cols-2 gap-4 text-right">
                  <div>
                    <div className="text-xs text-white/45">最高成績</div>
                    <div className="text-xl font-bold">TOP {bestPercent.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/45">直近成績</div>
                    <div className="text-xl font-bold text-cyan-300">TOP {latestPercent.toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={recentRaidResults}
                  margin={{ top: 20, right: 24, left: 0, bottom: 8 }}
                >
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis
                    dataKey="raid"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    minTickGap={0}
                    tick={(props) => <RaidAxisTick {...props} isMobile={isMobile} />}
                    tickMargin={8}
                    padding={{ left: 8, right: 16 }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.6)"
                    tickLine={false}
                    axisLine={false}
                    reversed
                    domain={[2.1, 1.3]}
                    tickFormatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                  <Tooltip
                    formatter={(value: number | string) => [
                      `TOP ${Number(value).toFixed(2)}%`,
                      "成績",
                    ]}
                    contentStyle={{
                      background: "rgba(9,11,17,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 16,
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="percent"
                    stroke="rgba(103,232,249,0.95)"
                    strokeWidth={3}
                    dot={<CustomRaidDot />}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "implemented" | "unimplemented" | "archive-pending">("all");
  const [sortBy, setSortBy] = useState<"start-asc" | "start-desc">("start-asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse<CsvRow>(`${import.meta.env.BASE_URL}data/events.csv`, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data
          .map((row): EventItem | null => {
            const name = normalizeText(row["名称"]);
            if (!name) return null;

            return {
              status: normalizeStatus(row["未実装/実装"]),
              name,
              startDate: parseDateLabel(row["イベ開始日"]),
              endDate: parseDateLabel(row["イベ終了日"]),
              archiveDate: parseDateLabel(row["アーカイブ追加日"]),
              daysToArchive: normalizeNumber(row["イベ終了から\nアーカイブ追加まで(日)"]),
              note: normalizeText(row["備考"]) || "—",
            };
          })
          .filter((item): item is EventItem => item !== null);

        setEvents(parsed);
        setLoading(false);
      },
      error: () => {
        setEvents([]);
        setLoading(false);
      },
    });
  }, []);

  const stats = useMemo(() => {
    const implemented = events.filter((item) => item.status === "implemented").length;
    const unimplemented = events.filter((item) => item.status === "unimplemented").length;
    const archivePending = events.filter((item) => item.archiveDate === "—").length;

    return {
      total: events.length,
      implemented,
      unimplemented,
      archivePending,
    };
  }, [events]);

  const filteredEvents = useMemo(() => {
    let items = [...events];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.note.toLowerCase().includes(q)
      );
    }

    if (filter === "implemented") {
      items = items.filter((item) => item.status === "implemented");
    } else if (filter === "unimplemented") {
      items = items.filter((item) => item.status === "unimplemented");
    } else if (filter === "archive-pending") {
      items = items.filter((item) => item.archiveDate === "—");
    }

    items.sort((a, b) => {
      if (sortBy === "start-desc") {
        return b.startDate.localeCompare(a.startDate);
      }
      return a.startDate.localeCompare(b.startDate);
    });

    return items;
  }, [events, filter, query, sortBy]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3 text-cyan-200">
              <CalendarDays className="h-6 w-6" />
              <div className="text-sm font-semibold uppercase tracking-[0.2em]">Event List</div>
            </div>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">イベント一覧</h1>
            <p className="mt-2 text-sm leading-6 text-white/60">
              実装状況、開催期間、アーカイブ追加日を一覧で確認できます。
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
              <div className="text-xs text-white/45">全イベント数</div>
              <div className="mt-1 text-2xl font-black">{stats.total}</div>
            </div>
            <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 px-4 py-4">
              <div className="text-xs text-cyan-100/70">実装済み</div>
              <div className="mt-1 text-2xl font-black text-cyan-100">{stats.implemented}</div>
            </div>
            <div className="rounded-2xl border border-amber-300/15 bg-amber-300/10 px-4 py-4">
              <div className="text-xs text-amber-100/70">未実装</div>
              <div className="mt-1 text-2xl font-black text-amber-100">{stats.unimplemented}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr]">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <Search className="h-4 w-4 text-white/45" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="イベント名 / 備考で検索"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <Filter className="h-4 w-4 text-white/45" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="w-full bg-transparent text-sm text-white outline-none"
            >
              <option value="all" className="bg-[#11151f]">全件</option>
              <option value="implemented" className="bg-[#11151f]">実装済み</option>
              <option value="unimplemented" className="bg-[#11151f]">未実装</option>
              <option value="archive-pending" className="bg-[#11151f]">アーカイブ未追加</option>
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <Clock3 className="h-4 w-4 text-white/45" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full bg-transparent text-sm text-white outline-none"
            >
              <option value="start-asc" className="bg-[#11151f]">開始日が古い順</option>
              <option value="start-desc" className="bg-[#11151f]">開始日が新しい順</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-10 text-center text-white/60">
            読み込み中...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-10 text-center text-white/60">
            条件に一致するイベントがありません。
          </div>
        ) : (
          <>
            <div className="hidden xl:block">
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <div className="grid grid-cols-[120px_1.8fr_140px_140px_150px_150px_1.3fr] gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                  <div>状態</div>
                  <div>イベント名</div>
                  <div>開始日</div>
                  <div>終了日</div>
                  <div>アーカイブ</div>
                  <div>追加まで</div>
                  <div>備考</div>
                </div>

                <div className="divide-y divide-white/10">
                  {filteredEvents.map((item) => (
                    <div
                      key={`${item.name}-${item.startDate}`}
                      className="grid grid-cols-[120px_1.8fr_140px_140px_150px_150px_1.3fr] gap-4 px-5 py-4 text-sm text-white/82"
                    >
                      <div>
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                          {statusLabel(item.status)}
                        </span>
                      </div>
                      <div className="font-semibold text-white">{item.name}</div>
                      <div>{item.startDate}</div>
                      <div>{item.endDate}</div>
                      <div>{item.archiveDate || "—"}</div>
                      <div>{item.daysToArchive != null ? `${item.daysToArchive}日` : "—"}</div>
                      <div className="text-white/65">{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:hidden">
              {filteredEvents.map((item) => (
                <article
                  key={`${item.name}-${item.startDate}`}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                          {statusLabel(item.status)}
                        </span>
                        {item.archiveDate === "—" && (
                          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                            アーカイブ未追加
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-white">{item.name}</h3>
                    </div>
                    <Sparkles className="h-5 w-5 text-[#ffd38b]" />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                      <div className="text-[11px] text-white/45">開始日</div>
                      <div className="mt-1 text-sm font-semibold">{item.startDate}</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                      <div className="text-[11px] text-white/45">終了日</div>
                      <div className="mt-1 text-sm font-semibold">{item.endDate}</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                      <div className="text-[11px] text-white/45">アーカイブ追加日</div>
                      <div className="mt-1 text-sm font-semibold">{item.archiveDate || "—"}</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                      <div className="text-[11px] text-white/45">追加までの日数</div>
                      <div className="mt-1 text-sm font-semibold">
                        {item.daysToArchive != null ? `${item.daysToArchive}日` : "—"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                    <div className="text-[11px] text-white/45">備考</div>
                    <div className="mt-1 text-sm leading-6 text-white/75">{item.note}</div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default function App() {
  const basename = useMemo(() => import.meta.env.BASE_URL.replace(/\/$/, ""), []);

  return (
    <BrowserRouter basename={basename}>
      <Shell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
