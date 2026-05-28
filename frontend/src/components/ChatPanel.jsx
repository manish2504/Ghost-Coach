import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const SUGGESTIONS = [
  'How do I improve my front foot movement?',
  'Give me a wrist-strength drill.',
  'What should I practice tomorrow?',
];

export default function ChatPanel({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await chatAPI.getMessages(sessionId);
        setMessages(data.data.messages);
      } catch {
        setError('Failed to load chat history');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const sendMessage = async (text) => {
    if (!text.trim() || sending) return;

    setSending(true);
    setError('');
    const userMsg = { id: 'temp', role: 'user', message: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const { data } = await chatAPI.sendMessage(sessionId, text.trim());
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== 'temp');
        return [
          ...filtered,
          { id: data.data.userMessage.id, role: 'user', message: data.data.userMessage.message },
          data.data.assistantMessage,
        ];
      });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== 'temp'));
      setError(err.response?.data?.error || 'Failed to send message');
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner text="Loading chat..." />
      </div>
    );
  }

  return (
    <div className="flex h-[500px] flex-col rounded-2xl border border-white/10 bg-pitch-800/50">
      <div className="border-b border-white/10 px-4 py-3">
        <h3 className="font-display font-semibold text-white">AI Coach Chat</h3>
        <p className="text-xs text-gray-500">Ask follow-up questions about your stance</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && !sending && (
          <div className="space-y-3 py-4">
            <p className="text-center text-sm text-gray-500">
              Start a conversation with your AI coach
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition hover:border-ghost-500/30 hover:bg-ghost-500/10 hover:text-ghost-300"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'rounded-br-md bg-ghost-600 text-white'
                  : 'rounded-bl-md bg-white/10 text-gray-200'
              }`}
            >
              {msg.role === 'assistant' && (
                <span className="mb-1 block text-xs font-semibold text-ghost-400">
                  Ghost Coach
                </span>
              )}
              <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-white/10 px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-ghost-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-ghost-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-ghost-400 [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="px-4 text-xs text-red-400">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach..."
            className="input-field flex-1 py-2.5"
            disabled={sending}
          />
          <button type="submit" className="btn-primary px-5" disabled={sending || !input.trim()}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
