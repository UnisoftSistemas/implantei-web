import { auth } from "./firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// Tipos para resultados de teste de conexão
interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    status?: number;
    baseUrl?: string;
    duration?: string;
    [key: string]: string | number | boolean | undefined | null;
  };
}

// Simple API client with Firebase auth
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    console.log(`API Client inicializado com URL: ${baseURL}`);
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const user = auth.currentUser;
    if (!user) {
      return {
        "Content-Type": "application/json",
      };
    }

    try {
      const token = await user.getIdToken();
      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
    } catch (error) {
      console.error("Error getting auth token:", error);
      return {
        "Content-Type": "application/json",
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers = await this.getAuthHeaders();

    // Configure fetch baseado no tipo de rede
    const fetchOptions: RequestInit = {
      method: "GET",
      headers,
    };

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || response.statusText}`
      );
    }

    return response.json();
  }

  async post<T>(
    endpoint: string,
    data?: object
  ): Promise<T> {
    const headers = await this.getAuthHeaders();

    // Configure fetch baseado no tipo de rede
    const fetchOptions: RequestInit = {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || response.statusText}`
      );
    }

    return response.json();
  }

  async put<T>(
    endpoint: string,
    data?: object
  ): Promise<T> {
    const headers = await this.getAuthHeaders();

    // Configure fetch baseado no tipo de rede
    const fetchOptions: RequestInit = {
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || response.statusText}`
      );
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();

    // Configure fetch baseado no tipo de rede
    const fetchOptions: RequestInit = {
      method: "DELETE",
      headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || response.statusText}`
      );
    }

    return response.json();
  }

  async testConnection(): Promise<ConnectionTestResult> {
    try {
      const startTime = performance.now();

      // Usar rota health para teste
      const response = await fetch(`${this.baseURL}/health`, {
        method: "GET",
        ...{ credentials: "include" },
      });

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      if (!response.ok) {
        return {
          success: false,
          message: `Erro na conexão: ${response.status} ${response.statusText}`,
          details: {
            status: response.status,
            baseUrl: this.baseURL,
            duration: `${duration}ms`,
          },
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: `Conexão estabelecida com sucesso em ${duration}ms!`,
        details: {
          ...data,
          baseUrl: this.baseURL,
          duration: `${duration}ms`,
        },
      };
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      return {
        success: false,
        message: `Erro de conexão: ${
          error instanceof Error ? error.message : String(error)
        }`,
        details: {
          baseUrl: this.baseURL,
          error: String(error),
        },
      };
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export { API_BASE_URL };
