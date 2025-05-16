import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

const BOT_ICON_BG = "bg-gradient-to-br from-teal-600 to-green-400 shadow-lg";

function BotIcon({ className = "" }: { className?: string }) {
  return (
    <div
      className={`${BOT_ICON_BG} rounded-full flex items-center justify-center`}
      style={{
        width: 56,
        height: 56,
        // Remove any default background or box shadows that create square edges
        backgroundClip: "padding-box",
        borderRadius: "9999px",
        overflow: "hidden",
      }}
    >
      {/* Bot icon with transparent background only */}
      {React.createElement(Bot, {
        className: `text-white w-8 h-8 ${className}`,
        // Make sure SVG fill is none except the paths (handled by lucide)
      })}
    </div>
  );
}

const EXAMPLES = [
  "I have chest pain and shortness of breath.",
  "I'm feeling persistent headaches and dizziness.",
  "My knee hurts after an injury.",
];

const AIChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchDoctorRecommendation(symptoms: string) {
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // IMPORTANT: Replace with your own Supabase serving key or secret if you want.
          // This demo expects an OPENAI_API_KEY in project for safe environments.
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY || "sk-REPLACE_ME"}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are a compassionate AI health assistant. Based on user symptoms, suggest the best type of doctor or specialist to see (like Cardiologist, Orthopedic, Dermatologist, Neurologist, etc). Explain your reasoning in one short paragraph. Reply in clear, plain language.",
            },
            { role: "user", content: symptoms },
          ],
          max_tokens: 150,
          temperature: 0.4,
        }),
      });
      if (!resp.ok) {
        throw new Error("API error. Please try again.");
      }
      const data = await resp.json();
      setAnswer(data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate an answer.");
    } catch (err: any) {
      setError(err.message ?? "An error occurred. Please try again.");
    }
    setLoading(false);
  }

  function handleAskAI(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    fetchDoctorRecommendation(question.trim());
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        aria-label="AI Doctor Recommendation"
        className="fixed z-50 right-6 bottom-6 transition-transform hover:scale-105 focus:outline-none"
        style={{ boxShadow: "0 8px 24px 0 rgba(56,200,140,0.23)" }}
        onClick={() => setOpen(true)}
      >
        <BotIcon />
      </button>

      {/* AI Chat Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-full rounded-2xl shadow-2xl px-0 py-0 animate-fade-in">
          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex items-center gap-2">
              <BotIcon className="w-7 h-7" />
              <DialogTitle className="text-lg">Doctor AI Assistant</DialogTitle>
            </div>
            <div className="text-xs text-gray-400 mt-1 px-1">
              Describe your symptoms and I'll suggest the right specialist!
            </div>
          </DialogHeader>
          <form onSubmit={handleAskAI} className="p-6 pt-3 space-y-4">
            <Input
              ref={inputRef}
              placeholder="Describe your symptoms..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              autoFocus
              maxLength={180}
              className="text-base"
            />
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <Button
                  key={ex}
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-2xl"
                  onClick={() => setQuestion(ex)}
                >
                  {ex}
                </Button>
              ))}
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-green-500 text-white font-semibold rounded-xl mt-2"
              disabled={loading || !question.trim()}
            >
              {loading ? "Thinking..." : "Ask the AI"}
            </Button>
          </form>
          {answer && (
            <div className="p-6 pt-0 border-t text-base text-gray-700 max-h-48 overflow-auto">
              <span className="font-semibold text-primary-blue">AI Suggestion:</span>
              <div>{answer}</div>
            </div>
          )}
          {error && (
            <div className="p-6 text-red-500">{error}</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIChat;
