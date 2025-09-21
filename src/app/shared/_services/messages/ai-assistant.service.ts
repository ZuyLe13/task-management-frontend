import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatStats {
  response_time_ms?: number;
  total_messages?: number;
  tokens_per_second?: number;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  response: string;
  model: string;
  stats?: ChatStats;
}

export interface StreamData {
  type: 'chunk' | 'done' | 'error';
  content?: string;
  full_response?: string;
  stats?: ChatStats;
  message?: string;
}

export interface ChatModel {
  value: string;
  label: string;
  speed: string;
}

export interface ModelsResponse {
  success: boolean;
  models: any[];
  recommended: any;
}

@Injectable({
  providedIn: 'root'
})
export class AiAssistantService {
  private apiUrl = `${environment.apiUrl}/chat`;
  private currentStreamController: AbortController | null = null;

  constructor(private http: HttpClient) { }

  sendChatMessage(message: string, context: ChatMessage[], model: string): Observable<ChatResponse> {
    const payload = { message, context, model };
    return this.http.post<ChatResponse>(this.apiUrl, payload);
  }

  async sendStreamMessage(
    message: string,
    context: any[],
    model: string,
    onChunk: (content: string) => void,
    onDone: (fullResponse: string, stats: ChatStats) => void,
    onError: (error: string) => void
  ): Promise<void> {

    // Cancel any existing stream
    if (this.currentStreamController) {
      this.currentStreamController.abort();
    }

    // Create new controller
    this.currentStreamController = new AbortController();

    const payload = {
      message,
      context,
      model
    };

    try {
      const response = await fetch(`${this.apiUrl}-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: this.currentStreamController.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Process complete lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer

          for (const line of lines) {
            if (line.trim() === '') continue;

            if (line.startsWith('data: ')) {
              try {
                const data: StreamData = JSON.parse(line.slice(6));

                // Handle different message types
                if (data.type === 'chunk' && data.content) {
                  onChunk(data.content);
                }

                if (data.type === 'done') {
                  const fullResponse = data.full_response || '';
                  const stats = data.stats || {};
                  onDone(fullResponse, stats);
                  return; // Exit the function
                }

                if (data.type === 'error') {
                  onError(data.message || 'Unknown streaming error');
                  return; // Exit the function
                }
              } catch (parseError) {
                console.error('JSON parsing error:', parseError, 'Line:', line);
              }
            }
          }
        }
      } finally {
        // Always ensure reader is released
        reader.releaseLock();
      }

    } catch (error: any) {
      // Don't call onError if request was aborted
      if (error.name !== 'AbortError') {
        console.error('Streaming error:', error);
        onError('Lỗi trong quá trình streaming: ' + error.message);
      }
    } finally {
      // Clean up controller
      this.currentStreamController = null;
    }
  }

  cancelStream(): void {
    if (this.currentStreamController) {
      this.currentStreamController.abort();
      this.currentStreamController = null;
    }
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Get chat context from messages
   */
  getChatContext(messages: ChatMessage[], excludeWelcome: boolean = true): any[] {
    const context = [];

    const userMessages = messages.filter(m => m.sender === 'user');

    let aiMessages = messages.filter(m => m.sender === 'ai');

    if (excludeWelcome) {
      aiMessages = aiMessages.filter(m =>
        !m.content.includes('Xin chào! Tôi là AI assistant') &&
        !m.content.includes('Lịch sử chat đã được xóa')
      );
    }

    // Combine user and ai messages in chronological order
    // -1 because we exclude current user message
    const minLength = Math.min(userMessages.length - 1, aiMessages.length);

    for (let i = 0; i < minLength; i++) {
      if (userMessages[i] && aiMessages[i]) {
        context.push({
          user: userMessages[i].content,
          assistant: aiMessages[i].content
        });
      }
    }

    return context;
  }

  cleanup(): void {
    this.cancelStream();
  }
}
