import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { CATEGORY_META } from '@/data/educationData';
import { Category } from '@/types/education';
import { Flame, Target, Clock, TrendingUp } from 'lucide-react';

interface Props {
  childId: string;
  childName: string;
}

const CHART_COLORS = [
  'hsl(340, 82%, 62%)', // pink
  'hsl(210, 90%, 56%)', // blue
  'hsl(150, 70%, 45%)', // green
  'hsl(25, 95%, 53%)',  // orange
  'hsl(262, 83%, 58%)', // purple
  'hsl(174, 72%, 46%)', // teal
  'hsl(48, 96%, 53%)',  // yellow
  'hsl(0, 84%, 60%)',   // red
];

export const AnalyticsDashboard = ({ childId, childName }: Props) => {
  const { getWeeklyTrend, getCategoryStats, getStreakDays, getDailySnapshots } = useAnalyticsStore();

  const weeklyData = useMemo(() => getWeeklyTrend(childId), [childId]);
  const categoryStats = useMemo(() => getCategoryStats(childId), [childId]);
  const streak = useMemo(() => getStreakDays(childId), [childId]);
  const snapshots = useMemo(() => getDailySnapshots(childId, 7), [childId]);

  const totalActivities = weeklyData.reduce((s, d) => s + d.activities, 0);
  const totalCorrect = weeklyData.reduce((s, d) => s + d.correct, 0);
  const weeklyAccuracy = totalActivities > 0 ? Math.round((totalCorrect / totalActivities) * 100) : 0;
  const totalMinutes = snapshots.reduce((s, d) => s + Math.round(d.secondsUsed / 60), 0);

  const pieData = categoryStats.map(c => ({
    name: CATEGORY_META[c.category as Category]?.title || c.category,
    value: c.total,
    accuracy: c.accuracy,
  }));

  const hasData = totalActivities > 0;

  if (!hasData) {
    return (
      <div className="text-center py-6">
        <p className="text-4xl mb-2">📊</p>
        <p className="text-muted-foreground font-semibold">{childName} ainda não tem dados de atividades</p>
        <p className="text-xs text-muted-foreground mt-1">Os gráficos aparecerão após as primeiras atividades</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/20 rounded-2xl p-3.5 border border-border/30 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Flame size={14} className="text-kid-orange" />
            <span className="text-xs font-bold text-muted-foreground">Sequência</span>
          </div>
          <p className="text-2xl font-extrabold font-baloo text-foreground">{streak} {streak === 1 ? 'dia' : 'dias'}</p>
        </div>
        <div className="bg-muted/20 rounded-2xl p-3.5 border border-border/30 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Target size={14} className="text-kid-green" />
            <span className="text-xs font-bold text-muted-foreground">Precisão</span>
          </div>
          <p className="text-2xl font-extrabold font-baloo text-foreground">{weeklyAccuracy}%</p>
        </div>
        <div className="bg-muted/20 rounded-2xl p-3.5 border border-border/30 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <TrendingUp size={14} className="text-kid-blue" />
            <span className="text-xs font-bold text-muted-foreground">Atividades (7d)</span>
          </div>
          <p className="text-2xl font-extrabold font-baloo text-foreground">{totalActivities}</p>
        </div>
        <div className="bg-muted/20 rounded-2xl p-3.5 border border-border/30 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock size={14} className="text-kid-purple" />
            <span className="text-xs font-bold text-muted-foreground">Tempo (7d)</span>
          </div>
          <p className="text-2xl font-extrabold font-baloo text-foreground">{totalMinutes} min</p>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div>
        <h4 className="text-sm font-bold text-muted-foreground mb-3">Atividades por dia</h4>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                formatter={(value: number, name: string) => [value, name === 'correct' ? 'Acertos' : 'Total']}
              />
              <Bar dataKey="activities" fill="hsl(210, 90%, 56%)" radius={[6, 6, 0, 0]} name="Total" />
              <Bar dataKey="correct" fill="hsl(150, 70%, 45%)" radius={[6, 6, 0, 0]} name="Acertos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      {pieData.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-muted-foreground mb-3">Categorias mais jogadas</h4>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={50} paddingAngle={3}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="font-semibold text-foreground flex-1">{item.name}</span>
                  <span className="text-muted-foreground">{item.value}x</span>
                  <span className={`font-bold ${item.accuracy >= 70 ? 'text-kid-green' : 'text-kid-orange'}`}>{item.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Accuracy Trend */}
      <div>
        <h4 className="text-sm font-bold text-muted-foreground mb-3">Evolução da precisão</h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData.map(d => ({
              ...d,
              accuracy: d.activities > 0 ? Math.round((d.correct / d.activities) * 100) : 0,
            }))}>
              <defs>
                <linearGradient id="accuracyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(150, 70%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(150, 70%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 20%, 90%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
                formatter={(value: number) => [`${value}%`, 'Precisão']}
              />
              <Area type="monotone" dataKey="accuracy" stroke="hsl(150, 70%, 45%)" fill="url(#accuracyGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
