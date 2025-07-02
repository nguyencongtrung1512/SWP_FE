import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export interface ChatMessage {
  id: string
  sender: string
  text: string
  timestamp: Date
  appointmentId: string
}

class ChatService {
  private connection: HubConnection | null = null
  private messageCallbacks: ((message: ChatMessage) => void)[] = []
  private messages: ChatMessage[] = []
  private isConnected = false

  async connect(appointmentId: string) {
    if (this.connection) return true; // Already connected

    this.connection = new HubConnectionBuilder()
      .withUrl('http://localhost:5057/chatHub') // Change to your backend URL if needed
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    this.connection.on('ReceiveMessage', (message: ChatMessage) => {
      this.messageCallbacks.forEach(cb => cb(message));
    });

    await this.connection.start();
    await this.connection.invoke('JoinAppointment', appointmentId);
    return true;
  }

  async disconnect(appointmentId: string) {
    if (this.connection) {
      await this.connection.invoke('LeaveAppointment', appointmentId);
      await this.connection.stop();
      this.connection = null;
    }
  }

  async sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    if (!this.connection) return false;
    const msg: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    await this.connection.invoke('SendMessage', msg);
    return true;
  }

  onMessage(callback: (message: ChatMessage) => void) {
    this.messageCallbacks.push(callback);
  }

  offMessage(callback: (message: ChatMessage) => void) {
    this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback)
  }

  // Get all messages for this appointment
  getMessages(appointmentId: string): ChatMessage[] {
    return this.messages.filter(msg => msg.appointmentId === appointmentId)
  }

  // Clear messages for this appointment
  clearMessages(appointmentId: string) {
    this.messages = this.messages.filter(msg => msg.appointmentId !== appointmentId)
  }
}

export const chatService = new ChatService() 