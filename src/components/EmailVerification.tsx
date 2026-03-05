import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Mail, 
  Shield, 
  Clock, 
  CheckCircle,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner@2.0.3';

interface EmailVerificationProps {
  email: string;
  userName: string;
  onBack: () => void;
  onVerified: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  email, 
  userName, 
  onBack, 
  onVerified 
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const { login } = useAuth();

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.verifyEmail(email, verificationCode);
      
      if (response.success && response.user && response.token) {
        login(response.user, response.token);
        toast.success('Email verified successfully! Welcome to StartBusiness!');
        onVerified();
      } else {
        setError(response.message || 'Verification failed');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      const response = await authApi.resendVerification(email);
      
      if (response.success) {
        toast.success('Verification code sent successfully!');
        setTimeLeft(900); // Reset timer
      } else {
        setError(response.message || 'Failed to resend code');
      }
    } catch (error) {
      setError('Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      if (error) setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            <CardTitle className="text-2xl text-white mb-2">
              Verify Your Email
            </CardTitle>
            <p className="text-gray-400">
              We've sent a verification code to
            </p>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white mt-2">
              {email}
            </Badge>
          </CardHeader>

          <CardContent>
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Check Your Email</h4>
                  <p className="text-gray-400 text-sm">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>
              </div>
              
              {timeLeft > 0 ? (
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400">
                    Code expires in {formatTime(timeLeft)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">
                    Verification code has expired
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-700 text-red-300">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="code" className="text-gray-300">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={handleInputChange}
                  className="text-center text-2xl font-mono bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 tracking-widest"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-500 text-center">
                  Enter the 6-digit code from your email
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl transform hover:scale-[1.02] transition-all duration-200 py-3"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Email
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">
                Didn't receive the code?
              </p>
              <Button 
                variant="outline"
                onClick={handleResendCode}
                disabled={isResending || timeLeft > 0}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                {isResending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>

            {/* Help Section */}
            <div className="mt-8 p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-600">
              <h4 className="text-white font-medium mb-2">💡 Need Help?</h4>
              <div className="text-sm text-gray-400 space-y-1">
                <p>• Check your spam/junk folder</p>
                <p>• Make sure {email} is correct</p>
                <p>• Code expires in 15 minutes</p>
                <p>• Contact support if issues persist</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};