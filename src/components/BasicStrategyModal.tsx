import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const dealerHeaders = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];

type StrategyRow = {
  label: string;
  actions: string[];
};

const hardTotals: StrategyRow[] = [
  { label: '17-20', actions: Array(10).fill('S') },
  { label: '16', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
  { label: '15', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
  { label: '14', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
  { label: '13', actions: ['S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
  { label: '12', actions: ['H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'] },
  { label: '11', actions: Array(10).fill('D') },
  { label: '10', actions: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'] },
  { label: '9', actions: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
  { label: '8 or less', actions: Array(10).fill('H') },
];

const softTotals: StrategyRow[] = [
  { label: 'A,9', actions: ['S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'] },
  { label: 'A,8', actions: ['S', 'S', 'S', 'S', 'Ds', 'S', 'S', 'S', 'S', 'S'] },
  { label: 'A,7', actions: ['Ds', 'Ds', 'Ds', 'Ds', 'Ds', 'S', 'S', 'H', 'H', 'H'] },
  { label: 'A,6', actions: ['H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
  { label: 'A,5', actions: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
  { label: 'A,4', actions: ['H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
  { label: 'A,3', actions: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
  { label: 'A,2', actions: ['H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'] },
];

const pairs: StrategyRow[] = [
  { label: 'A,A', actions: Array(10).fill('P') },
  { label: '10,10', actions: Array(10).fill('S') },
  { label: '9,9', actions: ['P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'] },
  { label: '8,8', actions: Array(10).fill('P') },
  { label: '7,7', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
  { label: '6,6', actions: ['P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'] },
  { label: '5,5', actions: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'] },
  { label: '4,4', actions: ['H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'] },
  { label: '3,3', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
  { label: '2,2', actions: ['P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'] },
];

interface BasicStrategyModalProps {
  open: boolean;
  onClose: () => void;
}

export const BasicStrategyModal: React.FC<BasicStrategyModalProps> = ({ open, onClose }) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  if (!open) return null;

  const actionClasses: Record<string, string> = {
    S: 'bg-green-600 text-white font-extrabold shadow-sm dark:bg-green-500/10 dark:text-green-300',
    H: 'bg-orange-500 text-white font-extrabold shadow-sm dark:bg-orange-500/10 dark:text-orange-300',
    D: 'bg-blue-600 text-white font-extrabold shadow-sm dark:bg-blue-500/10 dark:text-blue-300',
    P: 'bg-purple-600 text-white font-extrabold shadow-sm dark:bg-purple-500/10 dark:text-purple-300',
    Ds: 'bg-slate-700 text-white font-extrabold shadow-sm dark:bg-slate-500/10 dark:text-slate-200',
  };

  const renderRow = (row: StrategyRow) => (
    <tr key={row.label}>
      <td className={`text-xs sm:text-sm font-semibold px-2 py-1 ${themeClasses.text}`}>{row.label}</td>
      {row.actions.map((action, idx) => (
        <td
          key={idx}
          className={`text-center text-xs sm:text-sm font-semibold px-2 py-1 border border-slate-200 dark:border-slate-700 rounded ${
            actionClasses[action] ?? ''
          }`}
        >
          {action}
        </td>
      ))}
    </tr>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-5xl max-h-[80vh] overflow-y-auto rounded-2xl border ${themeClasses.border} ${themeClasses.cardBg} shadow-2xl p-6`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
          aria-label="Close strategy chart"
        >
          <X className={`h-5 w-5 ${themeClasses.text}`} />
        </button>

        <div className="flex items-center justify-between mb-4 pr-8">
          <div>
            <p className={`text-sm ${themeClasses.textSecondary}`}>Full Basic Strategy</p>
            <h2 className={`text-2xl font-semibold ${themeClasses.text}`}>Chart Reference</h2>
          </div>
          <div className="text-xs sm:text-sm space-x-2 flex items-center">
            <span className="px-2 py-1 rounded bg-green-600 text-white font-semibold shadow-sm dark:bg-green-500/15 dark:text-green-200">S = Stand</span>
            <span className="px-2 py-1 rounded bg-orange-500 text-white font-semibold shadow-sm dark:bg-orange-500/15 dark:text-orange-200">H = Hit</span>
            <span className="px-2 py-1 rounded bg-blue-600 text-white font-semibold shadow-sm dark:bg-blue-500/15 dark:text-blue-200">D = Double</span>
            <span className="px-2 py-1 rounded bg-purple-600 text-white font-semibold shadow-sm dark:bg-purple-500/15 dark:text-purple-200">P = Split</span>
            <span className="px-2 py-1 rounded bg-slate-700 text-white font-semibold shadow-sm dark:bg-slate-500/15 dark:text-slate-100">Ds = Double if possible, otherwise Stand</span>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>Hard Totals</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="min-w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/60">
                  <tr>
                    <th className={`px-2 py-1 text-xs sm:text-sm font-semibold ${themeClasses.text}`}>Player</th>
                    {dealerHeaders.map((header) => (
                      <th key={header} className={`px-2 py-1 text-xs sm:text-sm font-semibold text-center ${themeClasses.text}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{hardTotals.map(renderRow)}</tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>Soft Totals (Hands with an Ace counted as 11)</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="min-w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/60">
                  <tr>
                    <th className={`px-2 py-1 text-xs sm:text-sm font-semibold ${themeClasses.text}`}>Player</th>
                    {dealerHeaders.map((header) => (
                      <th key={header} className={`px-2 py-1 text-xs sm:text-sm font-semibold text-center ${themeClasses.text}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{softTotals.map(renderRow)}</tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>Pairs</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="min-w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/60">
                  <tr>
                    <th className={`px-2 py-1 text-xs sm:text-sm font-semibold ${themeClasses.text}`}>Player</th>
                    {dealerHeaders.map((header) => (
                      <th key={header} className={`px-2 py-1 text-xs sm:text-sm font-semibold text-center ${themeClasses.text}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{pairs.map(renderRow)}</tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
