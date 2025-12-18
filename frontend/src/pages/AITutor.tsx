import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Bot, ChevronRight, Send, Sparkles, User, Trophy, Loader2, CheckCircle, XCircle, LayoutDashboard } from "lucide-react";
import { cn } from "../lib/utils";
import { explainTopic, generateQuiz, submitQuiz, getChatHistory } from "../lib/api";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

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

interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  passed: boolean;
}

export function AITutor() {
  const navigate = useNavigate();
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
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await getChatHistory();
      if (response.success && response.data.length > 0) {
        // Transform backend messages to frontend format if needed
        // Assuming backed format matches or is close enough
        setMessages(prev => [
          prev[0], // Keep the initial greeting
          ...response.data.map((m: any) => ({
            role: m.role === 'model' ? 'ai' : m.role,
            content: m.content
          }))
        ]);
        setShowQuiz(true);
      }
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

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
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
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

  const handleOptionSelect = (questionId: number, option: string) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    // Calculate local results first to show immediate feedback (optional, but good for UX)
    // Then send to backend

    // Construct answers payload
    const formattedAnswers = quiz.map(q => {
      const selected = quizAnswers[q.id] || "";
      const match = selected.match(/^([A-Da-d])[\)\.]/);
      const selectedLetter = match ? match[1].toUpperCase() : "";
      const isCorrect = selectedLetter === q.correctAnswer;
      return {
        questionId: q.id,
        selectedAnswer: selected,
        isCorrect: isCorrect
      };
    });

    try {
      const response = await submitQuiz(selectedTopic, formattedAnswers);
      if (response.success) {
        setQuizResult(response.data);
        setQuizSubmitted(true);
      }
    } catch (err) {
      console.error("Failed to submit quiz", err);
    }
  };

  return (
    <>
      {/* Quiz Modal Overlay - Moved to Root */}
      {quiz && quiz.length > 0 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-7xl bg-cosmic-blue border-white/20 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-space-black/30">
              <h4 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                <Trophy className="w-6 h-6" /> Quick Quiz: {selectedTopic}
              </h4>
              <div className="flex items-center gap-3">
                {quizResult && (
                  <div className={cn("px-3 py-1 rounded-full text-sm font-bold", quizResult.score >= 70 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                    Score: {quizResult.score}%
                  </div>
                )}
                <button
                  onClick={() => setQuiz(null)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {quiz.map((q, i) => {
                return (
                  <div key={q.id} className="mb-8">
                    <div className="text-base font-medium text-white text-left mb-2">
                      <span className="font-bold mr-2">{i + 1}.</span>
                      <span className="inline-block">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                          components={{
                            p: ({ children }) => <span className="inline">{children}</span>
                          }}
                        >
                          {q.question}
                        </ReactMarkdown>
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, j) => {
                        let btnClass = "bg-space-black/50 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/5";
                        const match = opt.match(/^([A-Da-d])[\)\.]/);
                        const optLetter = match ? match[1].toUpperCase() : "";
                        const isCorrectOption = optLetter === q.correctAnswer;
                        const isSelected = opt === quizAnswers[q.id];

                        if (quizSubmitted) {
                          if (isCorrectOption) {
                            btnClass = "bg-green-500/20 border-green-500/50 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.2)]";
                          } else if (isSelected) {
                            btnClass = "bg-red-500/20 border-red-500/50 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
                          } else {
                            btnClass = "opacity-40";
                          }
                        } else if (isSelected) {
                          btnClass = "bg-yellow-500/20 border-yellow-400 text-yellow-200 shadow-[0_0_10px_rgba(250,204,21,0.2)]";
                        }

                        return (
                          <button
                            key={j}
                            onClick={() => handleOptionSelect(q.id, opt)}
                            disabled={quizSubmitted}
                            className={cn(
                              "text-left text-sm p-4 rounded-xl border transition-all flex justify-between items-center",
                              btnClass
                            )}
                          >
                            <div className="flex-1 pr-2">
                              <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                  p: ({ children }) => <span className="inline">{children}</span>
                                }}
                              >
                                {opt}
                              </ReactMarkdown>
                            </div>
                            {quizSubmitted && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
                            {quizSubmitted && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-400" />}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <div className="text-sm p-4 bg-yellow-500/10 rounded-xl text-gray-300 border-l-4 border-yellow-400">
                        <div className="mb-2 font-medium text-green-400 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" /> Correct Answer: {q.correctAnswer}
                        </div>
                        <span className="font-bold text-yellow-400 block mb-1">Explanation:</span>
                        <div className="inline">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              p: ({ children }) => <span className="inline">{children}</span>
                            }}
                          >
                            {q.explanation}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted && (
              <div className="p-4 border-t border-white/10 bg-space-black/30 flex justify-end">
                <Button
                  variant="neon"
                  size="lg"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length !== quiz.length}
                  className="w-full sm:w-auto"
                >
                  Submit Answers
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      <div className="h-[calc(100vh-4rem)] flex max-w-7xl mx-auto px-4 py-8 gap-6">
        {/* Sidebar - Topics & Settings */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-6 hidden md:flex">
          <Card className="bg-cosmic-blue/40 border-white/10 flex-1 overflow-auto">
            <CardContent className="p-4 space-y-6">
              <Button
                variant="outline"
                className="w-full justify-start text-left gap-2 border-white/20 hover:bg-white/10 mb-4"
                onClick={() => navigate('/dashboard')}
              >
                <LayoutDashboard className="w-5 h-5 text-highlight-cyan" />
                Back to Dashboard
              </Button>

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
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700"
            >
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3 max-w-[80%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    msg.role === "ai" ? "bg-nebula-purple/20 text-nebula-purple border border-nebula-purple/50" : "bg-highlight-cyan/20 text-highlight-cyan border border-highlight-cyan/50"
                  )}>
                    {msg.role === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl shadow-lg transition-all w-full",
                    msg.role === "user"
                      ? "bg-nebula-purple/20 text-white border border-nebula-purple/30 rounded-tr-sm"
                      : "bg-space-black/80 text-gray-200 border border-white/10 rounded-tl-sm"
                  )}>
                    <div className="text-left prose prose-invert max-w-none text-sm">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                    {msg.keyPoints && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs font-bold text-highlight-cyan mb-2">Key Points:</p>
                        <ul className="text-xs space-y-1">
                          {msg.keyPoints.map((point, j) => (
                            <li key={j} className="flex gap-2">
                              <span>•</span>
                              <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                  p: ({ children }) => <span className="inline">{children}</span>
                                }}
                              >
                                {point}
                              </ReactMarkdown>
                            </li>
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
        </div >
      </div >
    </>
  );
}
