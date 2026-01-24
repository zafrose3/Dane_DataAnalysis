
import React from 'react';
import { NodeType } from '../types';
import { 
  Database, 
  Filter, 
  BarChart3, 
  BrainCircuit, 
  Calculator, 
  X,
  ArrowRight,
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

interface NodeProps {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  title: string;
  hasInput: boolean;
  hasOutput: boolean;
}

const Node: React.FC<NodeProps> = ({ 
  id, 
  type, 
  position, 
  isSelected, 
  onSelect, 
  onDelete, 
  onDragStart,
  title,
  hasInput,
  hasOutput
}) => {
  const getIcon = () => {
    switch (type) {
      case NodeType.DATA_SOURCE: return <Database className="w-6 h-6 text-blue-500" />;
      case NodeType.FILTER: return <Filter className="w-6 h-6 text-orange-500" />;
      case NodeType.AGGREGATOR: return <Calculator className="w-6 h-6 text-purple-500" />;
      case NodeType.VISUALIZER: return <BarChart3 className="w-6 h-6 text-green-500" />;
      case NodeType.AI_INSIGHT: return <BrainCircuit className="w-6 h-6 text-pink-500" />;
      case NodeType.PYTHON_SCRIPT: return <Code2 className="w-6 h-6 text-yellow-600" />;
      case NodeType.REGRESSION: return <TrendingUp className="w-6 h-6 text-emerald-500" />;
      case NodeType.CLASSIFICATION: return <Tags className="w-6 h-6 text-indigo-500" />;
      case NodeType.CLUSTERING: return <Shapes className="w-6 h-6 text-amber-500" />;
      case NodeType.DIM_REDUCTION: return <Shrink className="w-6 h-6 text-fuchsia-500" />;
      case NodeType.DEEP_LEARNING: return <Zap className="w-6 h-6 text-rose-500" />;
      case NodeType.IMAGE_AI: return <Camera className="w-6 h-6 text-purple-600" />;
      case NodeType.SENTIMENT: return <Smile className="w-6 h-6 text-pink-400" />;
      case NodeType.DATA_CLEANER: return <Eraser className="w-6 h-6 text-cyan-500" />;
      case NodeType.OUTLIER_FINDER: return <Target className="w-6 h-6 text-red-500" />;
      case NodeType.FORECASTER: return <CalendarDays className="w-6 h-6 text-violet-500" />;
    }
  };

  const getColorClass = () => {
    switch (type) {
      case NodeType.DATA_SOURCE: return 'border-blue-200 bg-blue-50';
      case NodeType.FILTER: return 'border-orange-200 bg-orange-50';
      case NodeType.AGGREGATOR: return 'border-purple-200 bg-purple-50';
      case NodeType.VISUALIZER: return 'border-green-200 bg-green-50';
      case NodeType.AI_INSIGHT: return 'border-pink-200 bg-pink-50';
      case NodeType.PYTHON_SCRIPT: return 'border-yellow-300 bg-yellow-50';
      case NodeType.REGRESSION: return 'border-emerald-200 bg-emerald-50';
      case NodeType.CLASSIFICATION: return 'border-indigo-200 bg-indigo-50';
      case NodeType.CLUSTERING: return 'border-amber-200 bg-amber-50';
      case NodeType.DIM_REDUCTION: return 'border-fuchsia-200 bg-fuchsia-50';
      case NodeType.DEEP_LEARNING: return 'border-rose-200 bg-rose-50';
      case NodeType.IMAGE_AI: return 'border-purple-200 bg-purple-50';
      case NodeType.SENTIMENT: return 'border-pink-100 bg-pink-50';
      case NodeType.DATA_CLEANER: return 'border-cyan-200 bg-cyan-50';
      case NodeType.OUTLIER_FINDER: return 'border-red-200 bg-red-50';
      case NodeType.FORECASTER: return 'border-violet-200 bg-violet-50';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      onClick={() => onSelect(id)}
      style={{ left: position.x, top: position.y }}
      className={`absolute w-48 p-4 rounded-2xl border-4 transition-all cursor-move flex flex-col items-center gap-2 group ${getColorClass()} ${
        isSelected ? 'ring-4 ring-yellow-400 scale-105 z-30' : 'hover:scale-102 shadow-sm z-20'
      }`}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(id); }}
        className="absolute -top-3 -right-3 bg-white border-2 border-slate-200 text-slate-400 hover:text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>

      {hasInput && (
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center">
           <div className="w-2 h-2 bg-slate-300 rounded-full" />
        </div>
      )}

      {hasOutput && (
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center">
           <ArrowRight size={12} className="text-slate-400" />
        </div>
      )}

      <div className="bg-white p-3 rounded-xl shadow-inner">
        {getIcon()}
      </div>
      <span className="font-bold text-slate-700 text-[11px] text-center truncate w-full uppercase tracking-tight leading-none px-2">{title}</span>
    </div>
  );
};

export default Node;
