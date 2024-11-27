"use client"

import React from 'react'
import clsx from 'clsx'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'orange'
}

const colorClasses: Record<string, string> = {
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  orange: 'bg-orange-100 text-orange-800',
}

export const Badge: React.FC<BadgeProps> = ({ color = 'gray', className, children, ...props }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colorClasses[color] || 'bg-gray-100 text-gray-800',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
