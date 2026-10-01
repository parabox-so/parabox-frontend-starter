export type WSConnectionState = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error';

export interface WSMessage<T = any> {
  channel: string;
  event: string;
  data: T;
  timestamp?: number;
}

export interface WSManagerOptions {
  url?: string;
  heartbeatIntervalMs?: number;
  reconnectIntervalMs?: number;
  authToken?: string;
  workspaceId?: string;
}

type ChannelHandler<T = any> = (payload: T, event: string) => void;

export class WebSocketManager {
  private url: string;
  private ws: WebSocket | null = null;
  private state: WSConnectionState = 'disconnected';
  private subscriptions: Map<string, Set<ChannelHandler<any>>> = new Map();
  private heartbeatTimer: any = null;
  private reconnectTimer: any = null;
  private options: WSManagerOptions;
  private isExplicitlyClosed = false;

  constructor(options?: WSManagerOptions) {
    this.options = options || {};
    this.url =
      this.options.url ||
      (typeof window !== 'undefined'
        ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`
        : 'ws://localhost:8080/ws');
  }

  public connect(customUrl?: string): void {
    if (customUrl) this.url = customUrl;
    if (typeof window === 'undefined') return;

    this.isExplicitlyClosed = false;
    this.setState('connecting');

    try {
      const parsedUrl = new URL(this.url);
      if (this.options.authToken) {
        parsedUrl.searchParams.set('token', this.options.authToken);
      }
      if (this.options.workspaceId) {
        parsedUrl.searchParams.set('workspace_id', this.options.workspaceId);
      }

      this.ws = new WebSocket(parsedUrl.toString());

      this.ws.onopen = () => {
        this.setState('connected');
        this.startHeartbeat();
        // Resubscribe to all active channels
        this.subscriptions.forEach((_, channel) => {
          this.send('subscribe', { channel });
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const msg: WSMessage = JSON.parse(event.data);
          if (msg.channel && this.subscriptions.has(msg.channel)) {
            const handlers = this.subscriptions.get(msg.channel);
            handlers?.forEach((h) => h(msg.data, msg.event));
          }
        } catch (e) {
          // Non-JSON message or raw ping
        }
      };

      this.ws.onclose = () => {
        this.stopHeartbeat();
        if (!this.isExplicitlyClosed) {
          this.setState('reconnecting');
          this.scheduleReconnect();
        } else {
          this.setState('disconnected');
        }
      };

      this.ws.onerror = (err) => {
        console.warn('WS Manager Encountered Error:', err);
        this.setState('error');
      };
    } catch (err) {
      console.warn('Failed to initiate WebSocket:', err);
      this.scheduleReconnect();
    }
  }

  public subscribe<T = any>(channel: string, handler: ChannelHandler<T>): () => void {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set());
      if (this.state === 'connected') {
        this.send('subscribe', { channel });
      }
    }
    this.subscriptions.get(channel)!.add(handler);

    return () => {
      const handlers = this.subscriptions.get(channel);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.subscriptions.delete(channel);
          if (this.state === 'connected') {
            this.send('unsubscribe', { channel });
          }
        }
      }
    };
  }

  public send(event: string, data: any, channel?: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const payload: WSMessage = {
        event,
        data,
        channel: channel || 'global',
        timestamp: Date.now(),
      };
      this.ws.send(JSON.stringify(payload));
    }
  }

  public disconnect(): void {
    this.isExplicitlyClosed = true;
    this.stopHeartbeat();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setState('disconnected');
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    const interval = this.options.heartbeatIntervalMs || 25000;
    this.heartbeatTimer = setInterval(() => {
      this.send('ping', { time: Date.now() }, 'system');
    }, interval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    const delay = this.options.reconnectIntervalMs || 3000;
    this.reconnectTimer = setTimeout(() => {
      if (!this.isExplicitlyClosed) {
        this.connect();
      }
    }, delay);
  }

  private setState(newState: WSConnectionState): void {
    this.state = newState;
  }

  public getState(): WSConnectionState {
    return this.state;
  }
}

export const wsManager = new WebSocketManager();
