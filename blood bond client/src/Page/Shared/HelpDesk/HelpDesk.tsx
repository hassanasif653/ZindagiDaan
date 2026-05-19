import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Message } from "@/types/blog";

const HelpDesk: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      text: "This is a temporary AI assistant. For reliable medical guidance, please consult a qualified healthcare professional."
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
      }
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
  if (!inputValue.trim()) return;

  const userText = inputValue;

  const userMsg: Message = {
    id: Date.now(),
    role: "user",
    text: userText,
  };

  setMessages((prev) => [...prev, userMsg]);
  setInputValue("");
  setIsTyping(true);

  try {
   const res = await fetch( `${import.meta.env.VITE_API_URL}/chatbot`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userText,
      }),
    });

    const data = await res.json();

    const botMsg: Message = {
      id: Date.now() + 1,
      role: "bot",
      text: data.reply,
    };

    setMessages((prev) => [...prev, botMsg]);
  } catch (error) {
    const botMsg: Message = {
      id: Date.now() + 1,
      role: "bot",
      text: "BondBot is unavailable right now.",
    };

    setMessages((prev) => [...prev, botMsg]);
  } finally {
    setIsTyping(false);
  }
};

  return (
    <div className="fixed bottom-6 right-6 z-9999 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] md:w-[400px] origin-bottom-right">
            <Card className="shadow-2xl border-primary/10 backdrop-blur-md bg-card/95 overflow-hidden">
              {/* Header */}

              <CardHeader className="bg-primary p-4 flex  flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border-2  border-secondary">
                    <AvatarImage
                      className="bg-background"
                      src="https://www.shutterstock.com/image-vector/bot-icon-chatbot-flat-style-260nw-778683235.jpg"
                    />
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground tracking-tight">
                        BondBot
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-[9px] h-4 text-foreground/50 border border-secondary bg-background/10 px-1">
                        AI
                      </Badge>
                    </div>
                    <p className="text-[10px] text-foreground/70 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                      Always Active
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-foreground bg-background/50 rounded-full h-8 w-8">
                  <X size={18} />
                </Button>
              </CardHeader>

              {/* Chat Body */}
              <CardContent className="p-0">
                <ScrollArea ref={scrollRef} className="h-[280px] p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}>
                        <div
                          className={`p-3 rounded-2xl text-[13px] max-w-[85%] ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-muted text-foreground rounded-tl-none border border-border/50"
                          }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="h-1.5 w-1.5 bg-foreground/40 rounded-full"
                          />
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              delay: 0.2,
                            }}
                            className="h-1.5 w-1.5 bg-foreground/40 rounded-full"
                          />
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              delay: 0.4,
                            }}
                            className="h-1.5 w-1.5 bg-foreground/40 rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Footer */}
              <CardFooter className="p-3 border-t bg-background/50">
                <div className="flex w-full items-center gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Ask BondBot..."
                  />
                  <Button onClick={handleSend} size="icon">
                    <Send size={16} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-16 w-16 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-4 border-background p-0">
          {isOpen ? (
            <X size={28} />
          ) : (
            <div className="relative">
              <MessageCircle size={30} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default HelpDesk;
