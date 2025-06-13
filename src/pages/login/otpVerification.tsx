import React, { useState, useRef, useEffect } from 'react'
import { Form, Button, Input } from 'antd'
import type { InputRef } from 'antd'
import { motion } from 'framer-motion'

interface OtpVerificationProps {
  onVerify: (otp: string) => Promise<void>
  loading: boolean
  email: string
  onResendOtp: () => Promise<void>
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ onVerify, loading, email, onResendOtp }) => {
  const [form] = Form.useForm()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = [
    useRef<InputRef>(null),
    useRef<InputRef>(null),
    useRef<InputRef>(null),
    useRef<InputRef>(null),
    useRef<InputRef>(null),
    useRef<InputRef>(null),
  ]
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleResendOtp = async () => {
    await onResendOtp()
    setCountdown(60)
    setCanResend(false)
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]
    }
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handleVerify = () => {
    const otpValue = otp.join('')
    if (otpValue.length === 6) {
      onVerify(otpValue)
    }
  }

  return (
    <motion.div
      key="otp-verification"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={formVariants}
      className="mt-2 w-full"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Xác thực OTP</h3>
        <p className="text-gray-500">
          Chúng tôi đã gửi mã OTP đến email <span className="font-medium">{email}</span>
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={inputRefs[index]}
              className="w-12 h-12 text-center text-xl font-bold"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </div>
      </div>

      <Form form={form} onFinish={handleVerify}>
        <Form.Item className="flex justify-center">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            disabled={otp.some(digit => !digit)}
            className="bg-blue-500 hover:bg-blue-600 hover:text-white h-12 text-base font-medium w-40"
          >
            Xác nhận
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center mt-4">
        <p className="text-gray-500">
          Không nhận được mã? {canResend ? (
            <Button
              type="link"
              onClick={handleResendOtp}
              className="p-0 font-medium"
              disabled={loading}
            >
              Gửi lại mã
            </Button>
          ) : (
            <span>Gửi lại mã sau {countdown}s</span>
          )}
        </p>
      </div>
    </motion.div>
  )
}

export default OtpVerification