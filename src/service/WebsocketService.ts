
import SockJS from 'sockjs-client';
import { Client, type IMessage } from '@stomp/stompjs';
import type { ResetPomodoroPayload, ResumeRequestPayload, StartExistingPomodoroPayload, StartPomodoroPayload } from '@/types/pomodoro';

const baseUrl = import.meta.env.VITE_BACKEND_SERVER;
// const wsUrl = `${baseUrl}/productivity-suite/api/v1/auth/ws`;

let stompClient: Client | null = null;

const getCookie = (name: string): string | null  => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}
const token = getCookie('productivity_access_token') || '';
  console.log('before token',token)

export const connectWebSocket = (onMessageReceived: (message: any) => void) => {
   if (stompClient && stompClient.connected) {
    console.warn('WebSocket is already connected');
    return;
  }

  const token = getCookie('productivity_access_token') || '';
  if (!token) {
    console.warn('No access token found in cookies');
    return;
  }

  const correctWsUrl = `${baseUrl}/api/v1/auth/ws`; 
  const socket = new SockJS(correctWsUrl);

  stompClient = new Client({
    webSocketFactory: () => socket,
    debug: (str) => console.log('[STOMP DEBUG]:', str),
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  stompClient.onConnect = (frame) => {
    console.log('WebSocket Connected:', frame);
    stompClient?.subscribe('/user/queue/pomodoro', (message: IMessage) => {
      const response = JSON.parse(message.body);
      console.log('Pomodoro Event:', response);
        onMessageReceived(response);
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('Broker Error:', frame.headers['message']);
    console.error('Details:', frame.body);
  };

  stompClient.onWebSocketError = (error) => {
    console.error('WebSocket error:', error);
  };

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log('WebSocket disconnected');
  }
};

export const startPomodoro = (payload : StartPomodoroPayload | StartExistingPomodoroPayload) => {
  if (stompClient && stompClient.connected) {
    const token = getCookie('productivity_access_token') || '';
    stompClient.publish({
      destination: '/app/pomodoro/start',
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    console.warn('WebSocket is not connected yet.');
  }
};

export const stopPomodoro =() => {
  if(stompClient && stompClient.connected){
    stompClient.publish({
      destination : '/app/pomodoro/stop',
      body : JSON.stringify({}),
  })
  }
}

export const resumePomodoro = (payload : ResumeRequestPayload) => {
  if(stompClient && stompClient.connected){
    stompClient.publish({
      destination : "/app/pomodoro/resume",
      body : JSON.stringify(payload),
    })
  }
}

export const resettPomodoro = (payload : ResetPomodoroPayload) => {
  if(stompClient && stompClient.connected){
    stompClient.publish({
      destination: "/app/pomodoro/reset",
      body : JSON.stringify(payload),
    })
  }
}

