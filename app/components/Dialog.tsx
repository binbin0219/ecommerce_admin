'use client'

import { useEffect, useState } from 'react'

export type DialogProps = {
  children?: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

export default function Dialog({ children, isOpen, onClose }: DialogProps) {
  const [show, setShow] = useState(isOpen)

  // When parent opens, show immediately
  useEffect(() => {
    if (isOpen) setShow(true)
  }, [isOpen])

  // Handle animation end when closing
  const handleAnimationEnd = () => {
    if (!isOpen) setShow(false)
  }

  if (!show) return null

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/40 backdrop-blur-sm
        dark:bg-black/60
        transition-opacity duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={onClose}
    >
      <div
        className={`
          card
          max-w-[90%] min-w-64
          mx-4
          transform transition-all duration-300
          ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={handleAnimationEnd}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  )
}
