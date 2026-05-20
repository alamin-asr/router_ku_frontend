import { useEffect, useRef, useState } from 'react';

export function useAnnouncementsSocket(onAnnouncement) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    let stompClient = null;

    const connect = async () => {
      try {
        const { Client } = await import('@stomp/stompjs');
        const { default: SockJS } = await import('sockjs-client');

        stompClient = new Client({
          webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/ws`),
          reconnectDelay: 5000,
          onConnect: () => {
            setConnected(true);
            stompClient.subscribe('/topic/announcements', msg => {
              try {
                const ann = JSON.parse(msg.body);
                onAnnouncement?.(ann);
              } catch {}
            });
          },
          onDisconnect: () => setConnected(false),
        });

        stompClient.activate();
        clientRef.current = stompClient;
      } catch (err) {
        console.warn('WebSocket connection failed:', err);
      }
    };

    connect();

    return () => {
      clientRef.current?.deactivate();
    };
  }, []);

  return { connected };
}
