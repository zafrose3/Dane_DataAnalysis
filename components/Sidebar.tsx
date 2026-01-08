
import React from 'react';
import { NodeType } from '../types';
import { 
  Database, 
  Filter, 
  BarChart3, 
  BrainCircuit, 
  Calculator,
  Download,
  Code2,
  TrendingUp,
  Tags,
  Shapes,
  Shrink,
  Zap,
  Camera,
  Smile,
  Eraser,
  Target,
  CalendarDays
} from 'lucide-react';

interface SidebarProps {
  onAddNode: (type: NodeType) => void;
  onExport: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddNode, onExport }) => {
  const blocks = [
    { section: 'The Basics', items: [
      { type: NodeType.DATA_SOURCE, label: 'Data Input', icon: <Database />, color: 'bg-blue-500', desc: 'Add some data!' },
      { type: NodeType.FILTER, label: 'Super Filter', icon: <Filter />, color: 'bg-orange-500', desc: 'Pick the best bits' },
      { type: NodeType.DATA_CLEANER, label: 'Soap & Water', icon: <Eraser />, color: 'bg-cyan-500', desc: 'Fix messy data' },
      { type: NodeType.PYTHON_SCRIPT, label: 'Python Code', icon: <Code2 />, color: 'bg-yellow-500', desc: 'Write custom scripts' },
    ]},
    { section: 'Machine Learning', items: [
      { type: NodeType.REGRESSION, label: 'Guesser', icon: <TrendingUp />, color: 'bg-emerald-500', desc: 'Predict numbers' },
      { type: NodeType.CLASSIFICATION, label: 'Sorter', icon: <Tags />, color: 'bg-indigo-500', desc: 'Label things' },
      { type: NodeType.CLUSTERING, label: 'Grouper', icon: <Shapes />, color: 'bg-amber-500', desc: 'Find families' },
      { type: NodeType.OUTLIER_FINDER, label: 'Strange Spotter', icon: <Target />, color: 'bg-red-500', desc: 'Find weird things' },
    ]},
    { section: 'Smart AI Tools', items: [
      { type: NodeType.DEEP_LEARNING, label: 'Super Brain', icon: <Zap />, color: 'bg-rose-500', desc: 'Complex patterns' },
      { type: NodeType.IMAGE_AI, label: 'Eye Spy', icon: <Camera />, color: 'bg-purple-600', desc: 'Look at pictures' },
      { type: NodeType.SENTIMENT, label: 'Mood Checker', icon: <Smile />, color: 'bg-pink-400', desc: 'Is it happy or sad?' },
      { type: NodeType.FORECASTER, label: 'Future Seer', icon: <CalendarDays />, color: 'bg-violet-500', desc: 'Guess tomorrow' },
    ]},
    { section: 'Output', items: [
      { type: NodeType.VISUALIZER, label: 'Chart Maker', icon: <BarChart3 />, color: 'bg-green-500', desc: 'See the picture' },
      { type: NodeType.AI_INSIGHT, label: 'Dane Insight', icon: <BrainCircuit />, color: 'bg-pink-500', desc: 'Ask Dane for help!' },
    ]}
  ];

  return (
    <aside className="w-80 bg-white border-r border-slate-200 h-full flex flex-col p-6 overflow-y-auto z-20 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
          D
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dane</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">AI Playground</p>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        {blocks.map((section) => (
          <div key={section.section}>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">{section.section}</h2>
            <div className="space-y-2">
              {section.items.map((block) => (
                <button
                  key={block.type}
                  onClick={() => onAddNode(block.type)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all text-left group"
                >
                  <div className={`${block.color} p-2 rounded-xl text-white shadow-sm transition-transform group-hover:scale-110 shrink-0`}>
                    {React.cloneElement(block.icon as React.ReactElement, { size: 18 })}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm leading-tight">{block.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{block.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <button 
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-black text-white p-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
        >
          <Download size={20} />
          Export Report
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
