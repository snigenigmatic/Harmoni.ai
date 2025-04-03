// src/services/socketService.ts
class SocketService {
  private static instance: SocketService;
  private socket: WebSocket | null = null;
  private listeners: ((event: MessageEvent) => void)[] = [];
  private connectionUrl: string = '';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(url: string): Promise<boolean> {
    this.connectionUrl = url;
    return new Promise((resolve) => {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        resolve(true);
      };

      this.socket.onmessage = (event) => {
        this.listeners.forEach(listener => listener(event));
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.reconnect();
      };
    });
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.connect(this.connectionUrl), 3000 * this.reconnectAttempts);
    }
  }

  public send(message: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      return true;
    }
    console.error('WebSocket is not open');
    return false;
  }

  public addListener(listener: (event: MessageEvent) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const socketService = SocketService.getInstance();