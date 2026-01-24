
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { NodeType, NodeData } from './types';
import Sidebar from './components/Sidebar';
import Node from './components/Node';
import NodeInspector from './components/NodeInspector';
import HelpHub from './components/HelpHub';
import { Sparkles, MousePointer2, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isAiReady, setIsAiReady] = useState(!!process.env.API_KEY);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addNode = (type: NodeType) => {
    const newNode: NodeData = {
      id: `${type.toLowerCase()}-${Date.now()}`,
      type,
      position: { x: 100 + Math.random() * 50, y: 100 + Math.random() * 50 },
      config: {},
    };
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const deleteNode = (id: string) => {
    setNodes(prev => {
      const filtered = prev.filter(n => n.id !== id);
      return filtered.map(n => n.inputFrom === id ? { ...n, inputFrom: undefined } : n);
    });
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const updateNodeConfig = (id: string, config: any) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, config } : n));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('nodeId', id);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    e.dataTransfer.setData('offsetX', (e.clientX - rect.left).toString());
    e.dataTransfer.setData('offsetY', (e.clientY - rect.top).toString());
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('nodeId');
    const offsetX = parseFloat(e.dataTransfer.getData('offsetX'));
    const offsetY = parseFloat(e.dataTransfer.getData('offsetY'));

    if (canvasRef.current && id) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvasRect.left - offsetX;
      const y = e.clientY - canvasRect.top - offsetY;

      setNodes(prev => {
        const movedNode = prev.find(n => n.id === id);
        if (!movedNode) return prev;

        const updatedNodes = prev.map(n => {
          if (n.id === id) return { ...n, position: { x, y } };
          return n;
        });

        let bestCandidateId: string | undefined = undefined;
        let minDistance = 150; 

        updatedNodes.forEach(other => {
          if (other.id === id) return;
          const dist = Math.sqrt(Math.pow(x - (other.position.x + 180), 2) + Math.pow(y - other.position.y, 2));
          if (dist < minDistance) {
            minDistance = dist;
            bestCandidateId = other.id;
          }
        });

        if (bestCandidateId) {
          return updatedNodes.map(n => n.id === id ? { ...n, inputFrom: bestCandidateId } : n);
        }

        return updatedNodes;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const exportToPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 500);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-['Fredoka']">
      <style>{`
        @media print {
          aside, .inspector-panel, .floating-ui, .help-button { display: none !important; }
          .canvas-area { width: 100% !important; height: 100% !important; background: white !important; }
          .node-box { border: 2px solid #ccc !important; box-shadow: none !important; }
        }
      `}</style>

      <Sidebar 
        onAddNode={addNode} 
        onExport={exportToPDF} 
        isAiReady={isAiReady}
      />

      <main 
        ref={canvasRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex-1 relative flow-background canvas-area p-10 overflow-hidden"
      >
        <div className="absolute top-8 left-8 z-10 floating-ui">
          <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
               <MousePointer2 size={16} />
             </div>
             <p className="text-slate-600 font-bold text-sm">Drag blocks near each other to connect them!</p>
          </div>
        </div>

        <button 
          onClick={() => setShowHelp(true)}
          className="absolute bottom-8 left-8 z-30 help-button bg-indigo-600 text-white px-6 py-4 rounded-[2rem] font-black shadow-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-3"
        >
          <HelpCircle size={20} />
          <span>HELP ME DANE!</span>
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🦕</div>
        </button>

        <svg className="absolute inset-0 pointer-events-none w-full h-full">
          {nodes.map(node => {
            if (!node.inputFrom) return null;
            const source = nodes.find(n => n.id === node.inputFrom);
            if (!source) return null;
            
            const startX = source.position.x + 192; 
            const startY = source.position.y + 45; 
            const endX = node.position.x; 
            const endY = node.position.y + 45;

            return (
              <g key={`link-${node.id}`}>
                <path
                  d={`M ${startX} ${startY} C ${startX + 40} ${startY}, ${endX - 40} ${endY}, ${endX} ${endY}`}
                  stroke="#cbd5e1"
                  strokeWidth="4"
                  fill="transparent"
                  className="animate-dash"
                />
              </g>
            );
          })}
        </svg>

        {nodes.map((node) => (
          <Node
            key={node.id}
            {...node}
            isSelected={selectedNodeId === node.id}
            onSelect={setSelectedNodeId}
            onDelete={deleteNode}
            onDragStart={handleDragStart}
            title={node.config.fileName || node.type.replace('_', ' ')}
            hasInput={node.type !== NodeType.DATA_SOURCE}
            hasOutput={true}
          />
        ))}

        {nodes.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-6">
            <div className="relative">
               <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center">
                 <Sparkles size={64} className="animate-pulse" />
               </div>
               <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-2xl">
                 🦕
               </div>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-slate-400 mb-2 uppercase tracking-tighter">Workspace is Empty!</h3>
              <p className="text-slate-400 font-medium">Drag a block from the left to start your adventure.</p>
              <button 
                onClick={() => setShowHelp(true)}
                className="mt-6 text-indigo-500 font-black text-sm uppercase tracking-widest hover:underline"
              >
                Confused? Read the Discovery Guide
              </button>
            </div>
          </div>
        )}
      </main>

      <div className="inspector-panel">
        {selectedNode ? (
          <NodeInspector 
            node={selectedNode} 
            allNodes={nodes}
            onUpdate={updateNodeConfig}
          />
        ) : (
          <div className="w-96 bg-white border-l border-slate-200 h-full flex flex-col items-center justify-center p-8 text-slate-400 text-center gap-4">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                <MousePointer2 size={32} className="text-slate-200" />
             </div>
             <p className="font-bold text-sm uppercase tracking-widest">Select a block to inspect it</p>
          </div>
        )}
      </div>

      {isExporting && (
        <div className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center flex-col gap-4 animate-in fade-in duration-300">
           <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-2xl font-bold text-indigo-900">Dane is preparing your report...</p>
        </div>
      )}

      {showHelp && <HelpHub onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default App;
