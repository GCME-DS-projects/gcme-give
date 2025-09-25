const API_BASE_URL = process.env.API_URL || "http://localhost:3001";

export class BaseApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // required for Better Auth cookies
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMsg = `HTTP ${response.status}`;
      try {
        const errData = await response.json();
        errorMsg = errData.message || errorMsg;
      } catch {
        // fallback
      }
      throw new Error(errorMsg);
    }

    return response.json();
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", ...options });
  }

  public post<T, D = unknown>(
    endpoint: string,
    data?: D,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  public put<T, D = unknown>(
    endpoint: string,
    data?: D,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  public patch<T, D = unknown>(
    endpoint: string,
    data?: D,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", ...options });
  }

  public async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<T> {
    const config: RequestInit = {
      method: "POST",
      body: formData,
      credentials: "include", // ensure cookies are sent
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return await response.json();
  }
}

export const apiClient = new BaseApiClient();
