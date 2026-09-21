import { formatPresenceLog, handlePresenceRequest } from '../index';

// Polyfill Request and Response for Jest JSDOM/Node environment
if (typeof global.Request === 'undefined') {
  (global as any).Request = class {
    url: string;
    method: string;
    headers: Map<string, string>;
    private _body: string;

    constructor(input: string, init?: any) {
      this.url = input;
      this.method = init?.method || 'GET';
      this.headers = new Map(Object.entries(init?.headers || {}));
      this._body = init?.body || '';
    }

    async json() {
      return JSON.parse(this._body);
    }
  };
}

if (typeof global.Response === 'undefined') {
  (global as any).Response = class {
    body: string;
    status: number;
    headers: Map<string, string>;

    constructor(body: string, init?: any) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = new Map(Object.entries(init?.headers || {}));
    }

    async json() {
      return JSON.parse(this.body);
    }
  };
}

describe('Edge Function: presence-logger', () => {
  it('should format presence log message correctly for ONLINE status', () => {
    const payload = {
      user_id: 'user-123',
      user_name: 'Kauan Domingues',
      status: 'ONLINE' as const,
      timestamp: '2026-09-20T22:00:00.000Z',
    };

    const formatted = formatPresenceLog(payload);
    expect(formatted).toBe('[PRESENCE EVENT] Kauan Domingues (user-123) -> STATUS: ONLINE at 2026-09-20T22:00:00.000Z');
  });

  it('should format presence log message correctly for TRAINING status', () => {
    const payload = {
      user_id: 'user-456',
      user_name: 'Bro Partner',
      status: 'TRAINING' as const,
      timestamp: '2026-09-20T22:05:00.000Z',
    };

    const formatted = formatPresenceLog(payload);
    expect(formatted).toBe('[PRESENCE EVENT] Bro Partner (user-456) -> STATUS: TRAINING at 2026-09-20T22:05:00.000Z');
  });

  it('should return 200 and log message when valid POST request is received', async () => {
    const req = new Request('http://localhost/functions/v1/presence-logger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'user-789',
        user_name: 'Test Bro',
        status: 'ONLINE',
        timestamp: '2026-09-20T22:10:00.000Z',
      }),
    });

    const res = await handlePresenceRequest(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.logged).toContain('[PRESENCE EVENT] Test Bro (user-789) -> STATUS: ONLINE');
  });
});
