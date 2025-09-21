import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AiAssistantService, ChatMessage, ChatModel } from '../../shared/_services/messages/ai-assistant.service';

@Component({
  selector: 'app-ai-assistant',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss'
})
export class AiAssistantComponent {
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef;
  @ViewChild('messageInput', { static: false }) messageInput!: ElementRef;

  messages: ChatMessage[] = [];
  currentMessage = '';
  isLoading = false;
  isStreaming = false;

  selectedModel = 'llama3.2:1b';

  models: ChatModel[] = [
    { value: 'qwen2:0.5b', label: 'Qwen2 0.5B (Rất nhanh)', speed: 'fastest' },
    { value: 'llama3.2:1b', label: 'Llama 3.2 1B (Nhanh)', speed: 'fast' },
    { value: 'llama3.2:3b', label: 'Llama 3.2 3B (Cân bằng)', speed: 'balanced' },
    { value: 'llama3', label: 'Llama 3 8B (Chất lượng cao)', speed: 'quality' }
  ];

  // Component lifecycle
  private destroy$ = new Subject<void>();
  private shouldScrollToBottom = false;

  constructor(private aiAssistantService: AiAssistantService) {
    // Add welcome message
    this.messages.push({
      id: this.aiAssistantService.generateId(),
      content: 'Xin chào! Tôi là AI assistant. Bạn muốn trò chuyện về gì? 😊',
      sender: 'ai',
      timestamp: new Date()
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.focusInput();
    }, 100);
  }

  ngOnDestroy(): void {
    this.aiAssistantService.cleanup();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  // Send message
  async sendMessage(): Promise<void> {
    const message = this.currentMessage.trim();
    if (!message || this.isLoading) return;

    this.isLoading = true;
    this.currentMessage = '';

    // Add user message
    const userMessage: ChatMessage = {
      id: this.aiAssistantService.generateId(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    this.messages.push(userMessage);
    this.shouldScrollToBottom = true;

    try {
      // Get context
      const context = this.aiAssistantService.getChatContext(this.messages);

      if (this.isStreaming) {
        await this.sendStreamMessage(message, context);
      } else {
        await this.sendNormalMessage(message, context);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      this.addErrorMessage('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      this.isLoading = false;
    }
  }

  // Send normal message
  async sendNormalMessage(message: string, context: any[]): Promise<void> {
    this.aiAssistantService.sendChatMessage(message, context, this.selectedModel)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            const aiMessage: ChatMessage = {
              id: this.aiAssistantService.generateId(),
              content: response.response,
              sender: 'ai',
              timestamp: new Date()
            };

            this.messages.push(aiMessage);
            this.shouldScrollToBottom = true;
          } else {
            this.addErrorMessage('Lỗi từ server');
          }
        },
        error: (error) => {
          console.error('HTTP Error:', error);
          this.addErrorMessage('Lỗi kết nối đến server');
        }
      });
  }

  // Send streaming message
  async sendStreamMessage(message: string, context: any[]): Promise<void> {
    // Create AI message for streaming
    const aiMessage: ChatMessage = {
      id: this.aiAssistantService.generateId(),
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isStreaming: true
    };

    this.messages.push(aiMessage);
    this.shouldScrollToBottom = true;

    await this.aiAssistantService.sendStreamMessage(
      message,
      context,
      this.selectedModel,
      // onChunk callback
      (content: string) => {
        aiMessage.content += content;
        this.shouldScrollToBottom = true;
      },
      // onDone callback
      (fullResponse: string) => {
        aiMessage.isStreaming = false;

        // Update with full response if provided
        if (fullResponse.trim()) {
          aiMessage.content = fullResponse.trim();
        }

        console.log('Streaming completed:', aiMessage.content);
      },
      // onError callback
      (error: string) => {
        aiMessage.content = 'Lỗi: ' + error;
        aiMessage.isStreaming = false;
        console.error('Stream error:', error);
      }
    );
  }

  clearChat(): void {
    if (confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) {
      this.aiAssistantService.cancelStream();

      this.messages = [{
        id: this.aiAssistantService.generateId(),
        content: 'Lịch sử chat đã được xóa. Hãy bắt đầu cuộc trò chuyện mới! 😊',
        sender: 'ai',
        timestamp: new Date()
      }];
      this.shouldScrollToBottom = true;
    }
  }

  toggleStreaming(): void {
    this.aiAssistantService.cancelStream();
    this.isStreaming = !this.isStreaming;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  getModelInfo(modelValue: string): ChatModel {
    return this.models.find(m => m.value === modelValue) || this.models[0];
  }

  focusInput(): void {
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  addErrorMessage(content: string): void {
    const errorMessage: ChatMessage = {
      id: this.aiAssistantService.generateId(),
      content: content,
      sender: 'ai',
      timestamp: new Date()
    };
    this.messages.push(errorMessage);
    this.shouldScrollToBottom = true;
  }
}
