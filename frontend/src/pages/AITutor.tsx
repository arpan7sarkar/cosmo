import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Bot, ChevronRight, Send, Sparkles, User, Trophy, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { explainTopic, generateQuiz } from "../lib/api";

const TOPICS = [
  "Quantum Mechanics",
  "Organic Chemistry",
  "Calculus: Derivatives",
  "European History",
  "Macroeconomics"
];

const ANALOGIES = [
  { id: "marvel", label: "Marvel Universe", icon: "🛡️" },
  { id: "football", label: "Football", icon: "⚽" },
  { id: "cricket", label: "Cricket", icon: "🏏" },
  { id: "scifi", label: "Sci-Fi Movies", icon: "🚀" },
  { id: "reallife", label: "Real Life", icon: "🌍" },
];

interface Message {
  role: 'ai' | 'user';
  content: string;
  keyPoints?: string[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export function AITutor() {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [selectedAnalogy, setSelectedAnalogy] = useState(ANALOGIES[0].id);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hello! I'm your cosmic tutor. Pick a topic and an analogy style, and let's make learning legendary!" }
  ]);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await explainTopic(input, selectedAnalogy);
      
      if (response.success) {
        const aiResponse: Message = { 
          role: "ai", 
          content: response.data.analogyExplanation || response.data.simpleExplanation,
          keyPoints: response.data.keyPoints
        };
        setMessages(prev => [...prev, aiResponse]);
        setShowQuiz(true);
      }
    } catch (err: any) {
      const errorMsg: Message = {
        role: "ai",
        content: `Sorry, I couldn't explain that topic. ${err.message || 'Please try again.'}`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    try {
      const response = await generateQuiz(selectedTopic, 5);
      if (response.success && response.data.questions) {
        setQuiz(response.data.questions);
      }
    } catch (err) {
      console.error('Failed to generate quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex max-w-7xl mx-auto px-4 py-8 gap-6">
      {/* Sidebar - Topics & Settings */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-6 hidden md:flex">
        <Card className="bg-cosmic-blue/40 border-white/10 flex-1 overflow-auto">
          <CardContent className="p-4 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-highlight-cyan" /> Topics
              </h3>
              <div className="space-y-2">
                {TOPICS.map(topic => (
                  <Button
                    key={topic}
                    variant={selectedTopic === topic ? "neon" : "ghost"}
                    className={cn("w-full justify-start text-left", selectedTopic === topic ? "bg-highlight-cyan/10" : "")}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <ChevronRight className={cn("w-4 h-4 mr-2", selectedTopic === topic ? "opacity-100" : "opacity-0")} />
                    {topic}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-nebula-purple" /> Analogy Style
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {ANALOGIES.map(analogy => (
                  <button
                    key={analogy.id}
                    onClick={() => setSelectedAnalogy(analogy.id)}
                    className={cn(
                      "p-2 rounded-lg text-sm border transition-all flex flex-col items-center gap-1",
                      selectedAnalogy === analogy.id 
                        ? "bg-nebula-purple/20 border-nebula-purple text-white shadow-[0_0_10px_rgba(108,99,255,0.3)]" 
                        : "bg-space-black border-white/10 text-gray-400 hover:bg-white/5"
                    )}
                  >
                    <span className="text-xl">{analogy.icon}</span>
                    {analogy.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col gap-4">
        <Card className="flex-1 bg-cosmic-blue/20 border-white/10 flex flex-col overflow-hidden relative">
           {/* Header */}
           <div className="p-4 border-b border-white/10 flex justify-between items-center bg-space-black/30 backdrop-blur-md">
             <div>
               <h2 className="text-xl font-bold text-white">{selectedTopic}</h2>
               <p className="text-xs text-gray-400">Mode: {ANALOGIES.find(a => a.id === selectedAnalogy)?.label}</p>
             </div>
             {showQuiz && (
               <Button 
                 variant="outline" 
                 size="sm" 
                 className="gap-2 text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10"
                 onClick={handleGenerateQuiz}
                 disabled={quizLoading}
               >
                 {quizLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
                 Take Micro-Quiz
               </Button>
             )}
           </div>

           {/* Chat Messages */}
           <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
             {messages.map((msg, i) => (
               <div key={i} className={cn("flex gap-3 max-w-[80%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}>
                 <div className={cn(
                   "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                   msg.role === "ai" ? "bg-nebula-purple/20 text-nebula-purple border border-nebula-purple/50" : "bg-highlight-cyan/20 text-highlight-cyan border border-highlight-cyan/50"
                 )}>
                   {msg.role === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                 </div>
                 <div className={cn(
                   "p-3 rounded-lg text-sm leading-relaxed",
                   msg.role === "ai" ? "bg-cosmic-blue border border-white/5 text-gray-200" : "bg-nebula-purple text-white"
                 )}>
                   {msg.content}
                   {msg.keyPoints && (
                     <div className="mt-3 pt-3 border-t border-white/10">
                       <p className="text-xs font-bold text-highlight-cyan mb-2">Key Points:</p>
                       <ul className="text-xs space-y-1">
                         {msg.keyPoints.map((point, j) => (
                           <li key={j}>• {point}</li>
                         ))}
                       </ul>
                     </div>
                   )}
                 </div>
               </div>
             ))}
             {loading && (
               <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full flex items-center justify-center bg-nebula-purple/20 text-nebula-purple border border-nebula-purple/50">
                   <Bot className="w-5 h-5" />
                 </div>
                 <div className="p-3 rounded-lg bg-cosmic-blue border border-white/5">
                   <Loader2 className="w-5 h-5 animate-spin text-nebula-purple" />
                 </div>
               </div>
             )}
           </div>

           {/* Quiz Panel */}
           {quiz && quiz.length > 0 && (
             <div className="p-4 border-t border-white/10 bg-yellow-500/5 max-h-64 overflow-y-auto">
               <h4 className="text-sm font-bold text-yellow-400 mb-3">Quick Quiz</h4>
               {quiz.map((q, i) => (
                 <div key={q.id} className="mb-4">
                   <p className="text-sm text-white mb-2">{i + 1}. {q.question}</p>
                   <div className="grid grid-cols-2 gap-2">
                     {q.options.map((opt, j) => (
                       <button 
                         key={j} 
                         className="text-left text-xs p-2 rounded bg-space-black/50 border border-white/10 hover:border-yellow-400/50 text-gray-300"
                       >
                         {opt}
                       </button>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
           )}

           {/* Input Area */}
           <div className="p-4 border-t border-white/10 bg-space-black/30 backdrop-blur-md">
             <div className="flex gap-4">
               <Input 
                 placeholder="Ask a question..." 
                 className="bg-space-black/50 border-white/10 focus-visible:ring-nebula-purple"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === "Enter" && handleSend()}
                 disabled={loading}
               />
               <Button variant="neon" size="icon" onClick={handleSend} disabled={loading}>
                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
               </Button>
             </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
