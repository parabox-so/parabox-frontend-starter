export type SSEConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error';

export interface SSEClientOptions {
  url: string;
  headers?: Record<string, string>;
  maxRetries?: number;
  initialRetryDelayMs?: number;
  maxRetryDelayMs?: number;
  onOpen?: () => void;
  onMessage?: (event: { data: string; eventType?: string }) => void;
  onError?: (error: any) => void;
  onStatusChange?: (status: SSEConnectionStatus) => void;
}

export class SSEClient {
  private url: string;
  private options: SSEClientOptions;
  private abortController: AbortController | null = null;
  private retryCount = 0;
  private retryTimer: any = null;
  private status: SSEConnectionStatus = 'disconnected';
  private isManuallyClosed = false;

  constructor(options: SSEClientOptions) {
    this.options = options;
    this.url = options.url;
  }

  public connect(): void {
    this.isManuallyClosed = false;
    this.setStatus(this.retryCount > 0 ? 'reconnecting' : 'connecting');

    this.abortController = new AbortController();

    const fetchUrl = this.url;
    const fetchHeaders: Record<string, string> = {
      Accept: 'text/event-stream',
      ...this.options.headers,
    };

    fetch(fetchUrl, {
      signal: this.abortController.signal,
      headers: fetchHeaders,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`SSE HTTP ${response.status}: ${response.statusText}`);
        }

        if (!response.body) {
          throw new Error('SSE Response has no body stream');
        }

        this.setStatus('connected');
        this.retryCount = 0;
        this.options.onOpen?.();

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const block of lines) {
            if (!block.trim()) continue;
            let eventType = 'message';
            let data = '';

            for (const line of block.split('\n')) {
              if (line.startsWith('event:')) {
                eventType = line.replace('event:', '').trim();
              } else if (line.startsWith('data:')) {
                data += line.replace('data:', '').trim();
              }
            }

            if (data) {
              this.options.onMessage?.({ data, eventType });
            }
          }
        }

        // Stream closed cleanly by server
        if (!this.isManuallyClosed) {
          this.scheduleReconnect();
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError' || this.isManuallyClosed) {
          return;
        }
        console.warn('SSE Client Connection Error:', err);
        this.options.onError?.(err);
        this.scheduleReconnect();
      });
  }

  public disconnect(): void {
    this.isManuallyClosed = true;
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.setStatus('disconnected');
  }

  private scheduleReconnect(): void {
    const maxRetries = this.options.maxRetries ?? 10;
    if (this.retryCount >= maxRetries) {
      this.setStatus('error');
      console.error(`SSE Client reached max retries (${maxRetries}).`);
      return;
    }

    this.setStatus('reconnecting');
    const initialDelay = this.options.initialRetryDelayMs ?? 1000;
    const maxDelay = this.options.maxRetryDelayMs ?? 30000;
    const exponential = Math.min(initialDelay * Math.pow(2, this.retryCount), maxDelay);
    // Add jitter +/- 20%
    const jitter = exponential * (0.8 + Math.random() * 0.4);

    this.retryCount++;
    this.retryTimer = setTimeout(() => {
      if (!this.isManuallyClosed) {
        this.connect();
      }
    }, jitter);
  }

  private setStatus(newStatus: SSEConnectionStatus): void {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.options.onStatusChange?.(newStatus);
    }
  }

  public getStatus(): SSEConnectionStatus {
    return this.status;
  }
}
