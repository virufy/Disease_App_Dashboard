/**
 * Live data-access hook — the ONE place the app talks to the real pipeline.
 *
 * Connects to the DiseaseMapWebSocket, requests the existing dataset, and streams
 * live submissions. Everything is normalized to Submission[] (see ./submissions)
 * so a REST/GraphQL source could replace this behind the same return shape with
 * no change to the rest of the app.
 */
import { useEffect, useRef, useState } from "react";
import { WS_URL } from "./config";
import { normalizeRecord, RawRecord, Submission } from "./submissions";

export type ConnStatus = "idle" | "connecting" | "open" | "reconnecting" | "closed";

export interface LiveData {
  submissions: Submission[];
  status: ConnStatus;
  /** total received so far (for the live counter) */
  total: number;
}

const MAX_BACKOFF = 15000;
const reconnectDelay = (attempt: number) => Math.min(MAX_BACKOFF, 500 * 2 ** attempt);

export const useLiveData = (): LiveData => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [status, setStatus] = useState<ConnStatus>(WS_URL ? "connecting" : "idle");

  const wsRef = useRef<WebSocket | null>(null);
  const bufferRef = useRef<Submission[]>([]);
  const countRef = useRef(0);
  const attemptRef = useRef(0);
  const unmountedRef = useRef(false);
  const reconnectTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!WS_URL) {
      setStatus("idle");
      return;
    }
    unmountedRef.current = false;

    // flush buffered arrivals to state in batches (initial dump can be large)
    const flush = window.setInterval(() => {
      if (bufferRef.current.length) {
        const batch = bufferRef.current;
        bufferRef.current = [];
        setSubmissions((prev) => prev.concat(batch));
      }
    }, 150);

    const connect = () => {
      let ws: WebSocket;
      try {
        ws = new WebSocket(WS_URL);
      } catch {
        setStatus("reconnecting");
        scheduleReconnect();
        return;
      }
      wsRef.current = ws;

      ws.onopen = () => {
        attemptRef.current = 0;
        setStatus("open");
        ws.send(JSON.stringify({ action: "send_initial_data" }));
      };

      ws.onmessage = (event) => {
        let data: any;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }
        if (!data || data.message === "connected") return;
        const sub = normalizeRecord(data as RawRecord, countRef.current);
        if (sub) {
          countRef.current += 1;
          bufferRef.current.push(sub);
        }
      };

      ws.onerror = () => {
        /* handled by onclose */
      };

      ws.onclose = () => {
        if (unmountedRef.current) return;
        setStatus("reconnecting");
        scheduleReconnect();
      };
    };

    const scheduleReconnect = () => {
      if (unmountedRef.current) return;
      const delay = reconnectDelay(attemptRef.current++);
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      reconnectTimer.current = window.setTimeout(connect, delay);
    };

    connect();

    return () => {
      unmountedRef.current = true;
      window.clearInterval(flush);
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      const ws = wsRef.current;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        try {
          ws.close(1000, "unmount");
        } catch {
          /* noop */
        }
      }
    };
  }, []);

  return { submissions, status, total: submissions.length };
};
