import { Plus } from "lucide-react";

const faqs = [
  {
    question: "How does the AI Syllabus Parser work?",
    answer: "Simply upload your course PDF. Our AI analyzes the document structure, extracts key dates, topics, and readings, and automatically populates your study calendar."
  },
  {
    question: "Is Learn-Flow free to use?",
    answer: "We offer a generous free tier that includes syllabus parsing and basic scheduling. Our Pro plan unlocks the advanced AI Tutor and unlimited uploads."
  },
  {
    question: "Can I sync with my Google Calendar?",
    answer: "Yes! Learn-Flow supports seamless 2-way sync with Google Calendar, Outlook, and Apple Calendar so you never miss a deadline."
  },
  {
    question: "What subjects does the AI Tutor support?",
    answer: "The AI Tutor is powered by advanced LLMs capable of explaining concepts across virtually all academic disciplines, from Quantum Physics to Art History."
  }
];

export function FAQ() {
  return (
    <section className="py-24 px-6 max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-5xl font-medium text-white mb-12 text-center">Common Questions</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 open:bg-white/[0.04]">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none text-gray-200 font-medium hover:text-white transition-colors">
              {faq.question}
              <Plus className="w-4 h-4 text-gray-500 transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <div className="px-6 pb-6 text-gray-400 font-light leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
