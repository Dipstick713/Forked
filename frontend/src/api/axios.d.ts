declare const api: {
  get(endpoint: string): Promise<any>;
  post(endpoint: string, data?: any): Promise<any>;
  put(endpoint: string, data?: any): Promise<any>;
  delete(endpoint: string): Promise<any>;
};

export default api;
