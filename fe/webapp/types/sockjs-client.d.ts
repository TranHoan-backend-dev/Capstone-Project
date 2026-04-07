declare module "sockjs-client" {
  class SockJS {
    constructor(url: string, options?: any);
    onopen?: (event: any) => void;
    onclose?: (event: any) => void;
    onmessage?: (event: any) => void;
    onerror?: (event: any) => void;
    close(): void;
    send(data: string | ArrayBuffer): void;
    readyState: number;
  }

  export default SockJS;
}
