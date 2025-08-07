import { auth } from "./firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// Simple API client with Firebase auth
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
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

    // CORREÇÃO: Adicionar credentials: 'include' para enviar cookies e headers de autenticação
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || response.statusText}`
      );
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const headers = await this.getAuthHeaders();

    // CORREÇÃO: Adicionar credentials: 'include'
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || response.statusText}`
      );
    }

    return response.json();
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const headers = await this.getAuthHeaders();

    // CORREÇÃO: Adicionar credentials: 'include'
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

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

    // CORREÇÃO: Adicionar credentials: 'include'
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers,
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || response.statusText}`
      );
    }

    return response.json();
  }

  // ADIÇÃO: Método para testar CORS
  async testCors(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/cors-test`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Falha no teste CORS: ${response.status} ${response.statusText}`,
        };
      }

      return { success: true, message: "CORS configurado corretamente!" };
    } catch (error) {
      console.error("Erro no teste CORS:", error);
      return {
        success: false,
        message: `Erro de CORS: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export { API_BASE_URL };
