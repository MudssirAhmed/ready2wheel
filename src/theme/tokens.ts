// LiquidGlass design tokens and class helpers
export const glass = {
  card: 'backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl shadow-lg shadow-black/20',
  cardHover: 'hover:bg-white/15 dark:hover:bg-white/10 hover:border-white/30 transition-all duration-300',
  input: 'backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-xl focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all',
  button: {
    primary: 'bg-blue-600/80 hover:bg-blue-500/90 backdrop-blur-sm border border-blue-400/30 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40',
    secondary: 'bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold transition-all duration-200',
    danger: 'bg-red-600/80 hover:bg-red-500/90 backdrop-blur-sm border border-red-400/30 text-white rounded-xl font-semibold transition-all duration-200',
    ghost: 'hover:bg-white/10 rounded-xl transition-all duration-200',
  },
  nav: 'backdrop-blur-2xl bg-white/5 dark:bg-black/20 border-b border-white/10',
  modal: 'backdrop-blur-2xl bg-slate-900/90 dark:bg-black/80 border border-white/10 rounded-2xl shadow-2xl',
  badge: 'backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full border',
} as const;

export const gradients = {
  hero: 'bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900',
  card: 'bg-gradient-to-br from-white/10 to-white/5',
  text: 'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent',
  glow: 'bg-gradient-to-r from-blue-600/20 to-purple-600/20',
} as const;
