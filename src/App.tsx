import {
  BarChart3,
  Shield,
  Users,
  Swords,
  AlertTriangle,
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

import { useEffect, useState } from "react";

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

export default function App() {
  const avgSyncLevel = Math.round(
    syncLevels.reduce((sum, level) => sum + level, 0) / Math.max(syncLevels.length, 1)
  );
  const maxSyncLevel = Math.max(...syncLevels);

  const bestPercent = Math.min(...recentRaidResults.map((r) => r.percent));
  const latestPercent = recentRaidResults[recentRaidResults.length - 1].percent;
  const visualPath = `${import.meta.env.BASE_URL}images/union-visual.png`;
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
    <div className="min-h-screen bg-[#090b11] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,173,51,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_25%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_35%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 lg:px-10">
          <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-center text-sm font-medium text-amber-100 shadow-[0_0_20px_rgba(252,211,77,0.08)]">
            ※非公式のファンサイトです
          </div>
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
                        Discordは22時頃に活動が多いです。VCもあります(チャット参加OK)。
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
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,11,17,0.08),rgba(9,11,17,0.18))]" />
                </div>
                <p className="mt-3 px-1 text-[8px] leading-4 text-white/45 sm:text-[9px] sm:leading-4 break-words">
                  GODDESS OF VICTORY: NIKKEの画像・権利は権利者に帰属
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
                        background: 'rgba(9,11,17,0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 16,
                        color: 'white',
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
                  <LineChart data={recentRaidResults}
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
                      formatter={(value: number | string) => [`TOP ${Number(value).toFixed(2)}%`, '成績']}
                      contentStyle={{
                        background: 'rgba(9,11,17,0.95)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 16,
                        color: 'white',
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
      </div>
    </div>
  );
}
