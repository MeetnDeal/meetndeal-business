import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export interface LoginRequest {
  phoneNumber: string;
}

export interface LoginResponse {
  status: string;
  message: string | null;
  vendorId: string;
  token: string;
  newVendor: boolean;
}

export interface OtpVerifyRequest {
  phoneNumber: string;
  otp: string;
}

export interface RegistrationRequest {
  tempVendorId: string;
  basicInfo: {
    name: string;
    alternateMobile: string;
    address: {
      houseNumber: string;
      street: string;
      city: string;
      state: string;
      country: string;
      pinCode: string;
      landmark: string;
    };
    profilePhotoUrl: string;
  };
  identityVerification: {
    aadharNumber: string;
    aadharDocUrl: string;
    panNumber: string;
    panDocUrl: string;
    drivingLicenseUrl?: string;
  };
  businessDetails: {
    category: string;
    profession: string;
    services: Array<{
      serviceId: string;
      serviceName: string;
    }>;
    experience: string;
    experienceCertUrl?: string;
  };
  availability: {
    workingHours: {
      start: string;
      end: string;
    };
    onCallEmergency: boolean;
  };
  paymentDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    upiId?: string;
  };
  welcomeKit: {
    tshirtSize: string;
  };
  agreements: {
    pricingPolicyAccepted: boolean;
    termsConditionsAccepted: boolean;
  };
}

export interface RegistrationResponse {
  status: string;
  message: string;
  data: {
    registration_number: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://192.168.31.162:9091';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    // Load token from session storage on service initialization
    this.token = sessionStorage.getItem('token');
  }

  // Get auth headers
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    
    return headers;
  }

  // Store token
  private storeToken(token: string): void {
    this.token = token;
    sessionStorage.setItem('token', token);
  }

  // Clear token
  private clearToken(): void {
    this.token = null;
    sessionStorage.removeItem('token');
  }

  // Login API - Send OTP
  login(phoneNumber: string): Observable<any> {
    const url = `${this.baseUrl}/vendors/login`;
    
    // Ensure phone number has +91 prefix
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+91')) {
      formattedPhone = '+91' + formattedPhone;
    }
    
    const payload: LoginRequest = { phoneNumber: formattedPhone };
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*'
    });
    
    console.log('Sending OTP to phone:', formattedPhone);
    
    return this.http.post(url, payload, { 
      headers,
      responseType: 'text' // Handle empty responses
    }).pipe(
      map(response => {
        console.log('Raw response:', response);
        console.log('Response type:', typeof response);
        
        // If response is empty or just whitespace, return a success object
        if (!response || response.trim() === '') {
          return { status: 'SUCCESS', message: 'OTP sent successfully' };
        }
        
        // Try to parse as JSON if it's not empty
        try {
          return JSON.parse(response);
        } catch (e) {
          console.log('JSON parsing failed:', e);
          // If parsing fails, return a success object
          return { status: 'SUCCESS', message: 'OTP sent successfully' };
        }
      }),
      catchError(this.handleError)
    );
  }

  // Verify OTP API
  verifyOtp(phoneNumber: string, otp: string): Observable<LoginResponse> {
    const url = `${this.baseUrl}/vendors/login/verify-otp`;
    
    // Ensure phone number has +91 prefix
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+91')) {
      formattedPhone = '+91' + formattedPhone;
    }
    
    const payload: OtpVerifyRequest = { phoneNumber: formattedPhone, otp };
    
    console.log('Verifying OTP for phone:', formattedPhone);
    
    return this.http.post<LoginResponse>(url, payload).pipe(
      tap((response) => {
        if (response.status === 'VERIFIED') {
          // Store token and vendor ID
          this.storeToken(response.token);
          sessionStorage.setItem('mobile', formattedPhone);
          sessionStorage.setItem('vendorId', response.vendorId);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Registration API
  register(payload: RegistrationRequest): Observable<RegistrationResponse> {
    const url = `${this.baseUrl}/vendors/register`;
    
    return this.http.post<RegistrationResponse>(url, payload, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Get stored vendor ID
  getVendorId(): string | null {
    return sessionStorage.getItem('vendorId');
  }

  // Get stored token
  getToken(): string | null {
    return this.token;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token && !!sessionStorage.getItem('mobile');
  }

  // Logout
  logout(): void {
    this.clearToken();
    sessionStorage.removeItem('mobile');
    sessionStorage.removeItem('vendorId');
  }

  // Error handler
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 200 && error.error && typeof error.error === 'string') {
        // This is likely a parsing error with 200 status
        errorMessage = 'Response parsing failed. Please try again.';
      } else if (error.status === 0) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.status === 404) {
        errorMessage = 'API endpoint not found. Please check the server.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
} 