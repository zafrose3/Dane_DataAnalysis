
import React, { useState, useEffect } from 'react';
import { NodeData, NodeType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getGeminiInsights, explainMLTask } from '../services/geminiService';
import { 
  Sparkles, 
  AlertCircle, 
  BarChart3, 
  BrainCircuit, 
  Code2, 
  Play, 
  HelpCircle, 
  Database,
  Filter,
  TrendingUp,
  Tags,
  Shapes,
  Shrink,
  Zap,
  Info,
  Camera,
  Smile,
  Eraser,
  Target,
  CalendarDays,
  BookOpen
} from 'lucide-react';

interface InspectorProps {
  node: NodeData;
  allNodes: NodeData[];
  onUpdate: (id: string, config: any) => void;
}

const NodeInspector: React.FC<InspectorProps> = ({ node, allNodes, onUpdate }) => {
  const [data, setData] = useState<any[]>([]);
  const [insight, setInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [mlExplanation, setMlExplanation] = useState<string>('');

  const findDataSource = (targetNode: NodeData): any[] => {
    if (targetNode.type === NodeType.DATA_SOURCE) return targetNode.config.data || [];
    if (!targetNode.inputFrom) return [];
    const prevNode = allNodes.find(n => n.id === targetNode.inputFrom);
    if (!prevNode) return [];
    return findDataSource(prevNode);
  };

  useEffect(() => {
    const currentData = findDataSource(node);
    setData(currentData);
    setMlExplanation('');
    setInsight('');
  }, [node, allNodes]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const result = [];
        const headers = lines[0].split(',').map(h => h.trim());
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i]) continue;
          const obj: any = {};
          const currentline = lines[i].split(',');
          headers.forEach((h, index) => {
            const val = currentline[index]?.trim();
            obj[h] = isNaN(Number(val)) ? val : Number(val);
          });
          result.push(obj);
        }
        onUpdate(node.id, { ...node.config, data: result, fileName: file.name });
      } catch (err) {
        alert("Oh no! Dane couldn't read that file.");
      }
    };
    reader.readAsText(file);
  };

  const getExplanation = (type: NodeType) => {
    switch (type) {
      case NodeType.DATA_SOURCE: return { title: "Data Input", text: "Bring your information into the lab to begin analysis.", icon: <Database size={16}/> };
      case NodeType.FILTER: return { title: "Super Filter", text: "Refine your dataset to focus only on relevant entries.", icon: <Filter size={16}/> };
      case NodeType.DATA_CLEANER: return { title: "Soap & Water", text: "Clean and standardize data for better accuracy.", icon: <Eraser size={16}/> };
      case NodeType.REGRESSION: return { title: "Guesser", text: "Predict numbers based on existing trends in your data.", icon: <TrendingUp size={16}/> };
      case NodeType.CLASSIFICATION: return { title: "Sorter", text: "Assign labels to items automatically based on patterns.", icon: <Tags size={16}/> };
      case NodeType.CLUSTERING: return { title: "Grouper", text: "Group similar items together to find hidden relationships.", icon: <Shapes size={16}/> };
      case NodeType.OUTLIER_FINDER: return { title: "Strange Spotter", text: "Locate unusual data points that stand out from the rest.", icon: <Target size={16}/> };
      case NodeType.SENTIMENT: return { title: "Mood Checker", text: "Determine the emotional tone of your text-based data.", icon: <Smile size={16}/> };
      case NodeType.IMAGE_AI: return { title: "Eye Spy", text: "Process and categorize visual information from images.", icon: <Camera size={16}/> };
      case NodeType.FORECASTER: return { title: "Future Seer", text: "Forecast future events based on chronological data history.", icon: <CalendarDays size={16}/> };
      case NodeType.VISUALIZER: return { title: "Chart Maker", text: "Create intuitive charts to visualize complex relationships.", icon: <BarChart3 size={16}/> };
      case NodeType.AI_INSIGHT: return { title: "Dane's Wisdom", text: "Get professional-level analysis of your data's story.", icon: <BrainCircuit size={16}/> };
      case NodeType.PYTHON_SCRIPT: return { title: "Python Code", text: "Apply custom scripts for advanced data transformations.", icon: <Code2 size={16}/> };
      case NodeType.DEEP_LEARNING: return { title: "Super Brain", text: "Solve complex tasks using advanced multi-layered networks.", icon: <Zap size={16}/> };
      default: return { title: "Help Block", text: "Specialized processing for your data workflow.", icon: <Info size={16}/> };
    }
  };

  const explanation = getExplanation(node.type);

  const renderContent = () => {
    switch (node.type) {
      case NodeType.DATA_SOURCE:
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-2xl border-2 border-dashed border-blue-200">
              <input type="file" accept=".csv" onChange={handleFileUpload} className="block w-full text-[10px] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-500 file:text-white" />
            </div>
            {node.config.fileName && (
              <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg">
                <p className="text-sm font-bold truncate">{node.config.fileName}</p>
                <p className="text-[10px] mt-2 font-black bg-white/20 px-2 py-1 rounded-full inline-block">{data.length} ROWS FOUND</p>
              </div>
            )}
          </div>
        );

      case NodeType.IMAGE_AI:
        return (
          <div className="space-y-4">
             <div className="bg-purple-100 p-4 rounded-2xl flex flex-col items-center gap-3">
                <Camera size={40} className="text-purple-600" />
                <p className="text-xs font-bold text-center text-purple-900 leading-tight">Drop images here to classify them using Vision AI!</p>
                <button className="w-full bg-purple-600 text-white p-2.5 rounded-xl font-bold text-xs">OPEN CAMERA</button>
             </div>
          </div>
        );

      case NodeType.SENTIMENT:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Text Column to Read</label>
              <input type="text" placeholder="e.g. Comments..." value={node.config.field || ''} onChange={(e) => onUpdate(node.id, { ...node.config, field: e.target.value })} className="w-full p-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-xs font-bold focus:border-pink-300 outline-none" />
            </div>
            <div className="bg-pink-50 p-4 rounded-2xl flex justify-around">
               <span className="text-2xl grayscale opacity-50">😢</span>
               <span className="text-2xl grayscale opacity-50">😐</span>
               <span className="text-2xl grayscale opacity-50">😊</span>
            </div>
          </div>
        );

      case NodeType.REGRESSION:
      case NodeType.CLASSIFICATION:
      case NodeType.CLUSTERING:
      case NodeType.DEEP_LEARNING:
      case NodeType.OUTLIER_FINDER:
      case NodeType.FORECASTER:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target or Column</label>
              <input type="text" placeholder="Field name..." value={node.config.target || ''} onChange={(e) => onUpdate(node.id, { ...node.config, target: e.target.value })} className="w-full p-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-xs font-bold outline-none" />
            </div>
            <button onClick={async () => {
              setIsLoading(true);
              const res = await explainMLTask(explanation.title, data, node.config.target);
              setMlExplanation(res || "");
              setIsLoading(false);
            }} className="w-full bg-slate-800 text-white p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
              {isLoading ? 'Processing...' : 'Get Analysis Logic'}
            </button>
            {mlExplanation && (
              <div className="bg-slate-100 p-4 rounded-2xl border-2 border-slate-300">
                <p className="text-[11px] font-bold text-slate-900 leading-relaxed whitespace-pre-wrap">
                  {mlExplanation}
                </p>
              </div>
            )}
          </div>
        );

      case NodeType.VISUALIZER:
        return (
          <div className="space-y-4">
             <div className="bg-white p-4 rounded-2xl border-2 border-slate-100 space-y-3">
                <select value={node.config.chartType || 'bar'} onChange={(e) => onUpdate(node.id, { ...node.config, chartType: e.target.value })} className="w-full p-2.5 border-2 border-slate-100 rounded-xl text-xs font-bold outline-none">
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="X Axis" value={node.config.xAxis || ''} onChange={(e) => onUpdate(node.id, { ...node.config, xAxis: e.target.value })} className="p-2.5 border-2 border-slate-100 rounded-xl text-[11px] font-bold outline-none" />
                  <input type="text" placeholder="Y Axis" value={node.config.yAxis || ''} onChange={(e) => onUpdate(node.id, { ...node.config, yAxis: e.target.value })} className="p-2.5 border-2 border-slate-100 rounded-xl text-[11px] font-bold outline-none" />
                </div>
             </div>
             <div className="bg-slate-50 rounded-2xl h-48 border-2 border-slate-100 flex items-center justify-center">
                {data.length > 0 && node.config.xAxis && node.config.yAxis ? <p className="text-[10px] font-black text-slate-400">Preview Active</p> : <BarChart3 size={32} className="text-slate-200" />}
             </div>
          </div>
        );

      case NodeType.AI_INSIGHT:
        return (
          <div className="space-y-4">
             <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl">
                <h3 className="font-black text-lg mb-2 uppercase tracking-tighter">Strategic Insight</h3>
                <button onClick={async () => {
                  setIsLoading(true);
                  const res = await getGeminiInsights(data);
                  setInsight(res || "");
                  setIsLoading(false);
                }} disabled={data.length === 0} className="w-full bg-white text-indigo-600 p-4 rounded-2xl font-black text-xs shadow-lg disabled:opacity-50">
                  {isLoading ? 'GENERATING INSIGHTS...' : 'ANALYZE PATTERNS'}
                </button>
             </div>
             {insight && (
               <div className="bg-slate-100 p-5 rounded-3xl border-2 border-slate-300">
                 <p className="text-[11px] font-bold text-slate-900 whitespace-pre-wrap leading-relaxed">
                   {insight}
                 </p>
               </div>
             )}
          </div>
        );

      default:
        return <div className="p-10 text-center opacity-20"><Info size={40} className="mx-auto" /></div>;
    }
  };

  return (
    <div className="w-96 bg-white border-l border-slate-200 h-full flex flex-col p-8 overflow-y-auto z-10 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-none">Workspace View</h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Data Lab Helper</p>
        </div>
        <div className="bg-slate-100 px-3 py-1.5 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest">
          {node.type.split('_').join(' ')}
        </div>
      </div>

      {/* Explanation Card */}
      <div className="bg-slate-50 border-2 border-slate-100 p-5 rounded-[2rem] mb-8 relative overflow-hidden group hover:bg-slate-100 transition-colors">
         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BookOpen size={80} />
         </div>
         <div className="flex items-center gap-2 text-slate-700 mb-2">
            {explanation.icon}
            <h3 className="font-black text-sm uppercase tracking-wider">{explanation.title} Summary</h3>
         </div>
         <p className="text-xs font-medium text-slate-600 leading-relaxed">{explanation.text}</p>
      </div>
      
      {renderContent()}

      <div className="mt-auto pt-8">
        <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Block ID</p>
            <code className="text-[9px] text-slate-400 font-mono">{node.id.split('-')[0]}</code>
          </div>
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-xs">🦕</div>
        </div>
      </div>
    </div>
  );
};

export default NodeInspector;
