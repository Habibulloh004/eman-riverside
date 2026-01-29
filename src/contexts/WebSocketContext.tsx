"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";

interface WebSocketMessage {
  type: string;
  payload: Record<string, unknown>;
}

interface NewSubmissionPayload {
  id: number;
  name: string;
  phone: string;
  source: string;
  estate_id?: number;
  message?: string;
  createdAt: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  newSubmissionsCount: number;
  lastSubmission: NewSubmissionPayload | null;
  clearNewSubmissionsCount: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// Heartbeat interval (30 seconds)
const HEARTBEAT_INTERVAL = 30000;
// Reconnect delay (starts at 1s, max 30s)
const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [newSubmissionsCount, setNewSubmissionsCount] = useState(0);
  const [lastSubmission, setLastSubmission] = useState<NewSubmissionPayload | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const clearNewSubmissionsCount = useCallback(() => {
    setNewSubmissionsCount(0);
  }, []);

  // Play notification sound - iPhone SMS style using Web Audio API
  const playNotificationSound = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();
      const now = ctx.currentTime;

      // iPhone SMS style - two-tone chime
      const playTone = (frequency: number, startTime: number, duration: number, volume: number) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, startTime);

        // Envelope - quick attack, smooth decay
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      // First tone - higher pitch (tri-tone start)
      playTone(1318.5, now, 0.15, 0.3); // E6

      // Second tone - lower pitch
      playTone(987.8, now + 0.15, 0.15, 0.25); // B5

      // Third tone - middle pitch (characteristic iPhone sound)
      playTone(1174.7, now + 0.3, 0.2, 0.2); // D6

      // Close context after sound finishes
      setTimeout(() => ctx.close(), 600);
    } catch {
      // Fallback to audio file if Web Audio fails
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio("/notification.mp3");
          audioRef.current.volume = 0.5;
        }
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      } catch {
        // Ignore all audio errors
      }
    }
  }, []);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080/ws";

    const startHeartbeat = (ws: WebSocket) => {
      // Clear existing heartbeat
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }

      // Send heartbeat every 30 seconds
      heartbeatIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send("ping");
        }
      }, HEARTBEAT_INTERVAL);
    };

    const stopHeartbeat = () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };

    const connect = () => {
      // Clear any pending reconnect
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      try {
        console.log("WebSocket connecting to:", wsUrl);
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket connected");
          setIsConnected(true);
          // Reset reconnect delay on successful connection
          reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;
          // Start heartbeat
          startHeartbeat(ws);
        };

        ws.onmessage = (event) => {
          // Handle pong response (text)
          if (event.data === "pong") {
            return;
          }

          try {
            const data: WebSocketMessage = JSON.parse(event.data);

            if (data.type === "new_submission") {
              const payload = data.payload as unknown as NewSubmissionPayload;
              setNewSubmissionsCount((prev) => prev + 1);
              setLastSubmission(payload);

              // Play notification sound
              playNotificationSound();

              // Show browser notification if permitted
              if (typeof Notification !== "undefined" && Notification.permission === "granted") {
                new Notification("Yangi zayavka!", {
                  body: `${payload.name} - ${payload.phone}`,
                  icon: "/logo.svg",
                  tag: `submission-${payload.id}`, // Prevent duplicate notifications
                });
              }
            }
          } catch (error) {
            console.error("WebSocket message parse error:", error);
          }
        };

        ws.onclose = (event) => {
          console.log("WebSocket disconnected, code:", event.code, "reason:", event.reason);
          setIsConnected(false);
          stopHeartbeat();

          // Don't reconnect if closed intentionally (code 1000)
          if (event.code === 1000) {
            return;
          }

          // Exponential backoff for reconnect
          const delay = reconnectDelayRef.current;
          console.log(`Reconnecting in ${delay}ms...`);
          reconnectTimeoutRef.current = setTimeout(connect, delay);

          // Increase delay for next attempt (exponential backoff)
          reconnectDelayRef.current = Math.min(
            reconnectDelayRef.current * 2,
            MAX_RECONNECT_DELAY
          );
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      } catch (error) {
        console.error("WebSocket connection error:", error);
        // Retry connection with backoff
        const delay = reconnectDelayRef.current;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
        reconnectDelayRef.current = Math.min(
          reconnectDelayRef.current * 2,
          MAX_RECONNECT_DELAY
        );
      }
    };

    // Request notification permission
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Preload audio
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.volume = 0.5;
    audioRef.current.load();

    connect();

    // Handle visibility change - reconnect when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          console.log("Tab visible, reconnecting WebSocket...");
          reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;
          connect();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopHeartbeat();
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmount");
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [playNotificationSound]);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        newSubmissionsCount,
        lastSubmission,
        clearNewSubmissionsCount,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
