
import React from 'react';
import { 
  X, 
  Database, 
  Filter, 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  ChefHat, 
  Binary,
  Map,
  MessageCircle,
  Share2
} from 'lucide-react';

interface HelpHubProps {
  onClose: () => void;
}

const HelpHub: React.FC<HelpHubProps> = ({ onClose }) => {
  const sections = [
    {
      title: "1. What is 'Data' anyway?",
      icon: <Database className="text-blue-500" />,
      analogy: "Think of Data as Ingredients",
      text: "Data is just a fancy word for 'information.' Imagine you have a big basket of different items: some are red apples, some are price tags, and some are notes about the weather. On their own, they are just things. But when we put them together in Dane, they become ingredients for a story!",
      tip: "Start by dropping a 'Data Input' block to bring your basket into the lab."
    },
    {
      title: "2. The Magic Blocks",
      icon: <ChefHat className="text-orange-500" />,
      analogy: "Blocks are your Kitchen Tools",
      text: "Just like a chef uses a knife to chop or a bowl to mix, you use 'Blocks' to change your data. A 'Filter' block is like a colander—it lets the small bits (the data you don't want) fall through while keeping the big bits you need. A 'Sorter' block puts everything in neat rows by color or size.",
      tip: "Each block has its own job. Try connecting them to see what happens!"
    },
    {
      title: "3. Machine Learning (AI)",
      icon: <Sparkles className="text-indigo-500" />,
      analogy: "Teaching a Puppy",
      text: "Machine Learning sounds scary, but it's just like teaching a puppy a trick. You show the puppy (the computer) lots of examples. If you show it 100 pictures of cats, it eventually learns what a 'cat' looks like. 'Regression' is just guessing a number based on what happened before—like guessing you'll be hungry at noon because you're hungry every day at noon!",
      tip: "Use the 'Guesser' block to predict the future!"
    },
    {
      title: "4. The Connections",
      icon: <Map className="text-slate-400" />,
      analogy: "Drawing the Map",
      text: "When you drag a line from one block to another, you are telling the data where to go. It's like a water pipe! Information flows out of the 'Data' pipe and into the 'Filter' pipe. You can build long, winding paths to discover amazing things.",
      tip: "Look for the little circles on the sides of blocks—those are the pipe connectors!"
    },
    {
      title: "5. Dane's Wisdom",
      icon: <MessageCircle className="text-pink-500" />,
      analogy: "The Data Translator",
      text: "Sometimes numbers are hard to read. That's why Dane is here! When you use an 'AI Insight' block, Dane looks at all your messy numbers and turns them into a story you can understand. He looks for 'secrets'—like finding out that people buy more ice cream when it's sunny!",
      tip: "Click 'Find Secrets' and Dane will explain everything in plain English."
    },
    {
      title: "6. Sharing Your Discovery",
      icon: <Share2 className="text-emerald-500" />,
      analogy: "The Final Masterpiece",
      text: "Once you've made a beautiful chart or found a cool secret, you can 'Export.' This takes your whole workspace and turns it into a tidy PDF report. It's like taking a photo of your finished LEGO castle so you can show your friends and family!",
      tip: "Click 'Export Report' at the bottom of the sidebar when you're done."
    }
  ];

  return (
    <div className="fixed inset-0 bg-indigo-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden relative border-8 border-white">
        
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-white relative flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-inner">🦕</div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">Dane's Discovery Guide</h2>
              <p className="text-indigo-100 font-medium opacity-80">Learn the secrets of data science, no math required!</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <X size={32} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
          <div className="grid md:grid-cols-2 gap-10">
            {sections.map((section, idx) => (
              <div key={idx} className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-800">{section.title}</h3>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-transparent group-hover:border-indigo-100 transition-all">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">{section.analogy}</p>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed mb-4">
                    {section.text}
                  </p>
                  <div className="bg-white p-3 rounded-xl flex items-start gap-2 border border-slate-100">
                    <Sparkles className="text-yellow-500 shrink-0" size={16} />
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Dane's Tip: {section.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 p-10 rounded-[3rem] text-center border-4 border-dashed border-indigo-200">
            <h4 className="text-2xl font-black text-indigo-900 mb-2 uppercase tracking-tighter">Ready to Start?</h4>
            <p className="text-indigo-700/70 font-bold mb-6 italic">"The best way to learn is to play. Drag a block and let's go!" — Dane</p>
            <button 
              onClick={onClose}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 active:scale-95 transition-all"
            >
              LET'S EXPLORE!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpHub;
