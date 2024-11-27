"use client"

import * as RadixTooltip from '@radix-ui/react-tooltip'
import React from 'react'
import clsx from 'clsx'

interface TooltipProps {
  content: string
  children: React.ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Content
          className={clsx(
            'bg-gray-800 text-white text-sm rounded px-2 py-1',
            'shadow-lg',
            'data-[state=delayed-open]:animate-slide-up-fade',
            'data-[state=closed]:animate-slide-down-fade'
          )}
          sideOffset={5}
        >
          {content}
          <RadixTooltip.Arrow className="fill-gray-800" />
        </RadixTooltip.Content>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}
