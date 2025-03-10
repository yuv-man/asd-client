class SocketService {
    socket;
    eventHandlers = new Map();
    errorHandler;
  
    constructor() {
      this.connect();
    }
  
    setupErrorHandling() {
      if (this.socket) {
        this.socket.on('error', (error) => {
          console.error('Socket.IO error:', error);
          if (this.errorHandler) {
            this.errorHandler(new Error('Socket.IO error'));
          }
        });
      }
    }
  
    setErrorHandler(handler) {
      this.errorHandler = handler;
    }
  
    // Listen for events
    on(event, callback) {
      if (!this.socket) {
        console.error('Socket.IO is not initialized');
        return;
      }
  
      // Store the event handler
      if (!this.eventHandlers.has(event)) {
        this.eventHandlers.set(event, []);
      }
      this.eventHandlers.get(event).push(callback);
  
      // Set up Socket.IO event listener
      this.socket.on(event, (data) => {
        const handlers = this.eventHandlers.get(event) || [];
        handlers.forEach(handler => handler(data));
      });
    }
  
    // Emit events
    emit(event, data) {
      if (!this.socket) {
        console.error('Socket.IO is not initialized');
        return;
      }
      
      try {
        console.log('Sending Socket.IO message:', { event, data });
        this.socket.emit(event, data);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  
    // Remove event listener
    off(event, callback) {
      if (!this.eventHandlers.has(event)) return;
      
      const handlers = this.eventHandlers.get(event);
      const index = handlers.indexOf(callback);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
      
      if (handlers.length === 0) {
        this.eventHandlers.delete(event);
      }
    }
  
    // Disconnect socket
    disconnect() {
      if (!this.socket) {
        console.warn('Socket.IO is already disconnected');
        return;
      }
      this.socket.disconnect();
      this.eventHandlers.clear();
    }
  
    connect() {
      if (this.socket?.connected) {
        console.warn('Socket.IO is already connected');
        return;
      }
  
      this.socket = io('http://localhost:3000');
      
      this.setupErrorHandling();
      
      this.socket.on('connect', () => {
        console.log('Connected to server');
      });
  
      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
        // Socket.IO handles reconnection automatically by default
      });
    }
  
    isConnected() {
      return this.socket?.connected;
    }
  }
  
  // Export a singleton instance
  const socketService = new SocketService();
  export default socketService;