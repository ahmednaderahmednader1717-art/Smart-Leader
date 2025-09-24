'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'

interface VirtualizedGridProps {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  itemHeight?: number
  containerHeight?: number
  gap?: number
  columns?: number
  className?: string
}

const VirtualizedGrid: React.FC<VirtualizedGridProps> = ({
  items,
  renderItem,
  itemHeight = 300,
  containerHeight = 600,
  gap = 16,
  columns = 3,
  className = ''
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const rowHeight = itemHeight + gap
    const startIndex = Math.floor(scrollTop / rowHeight) * columns
    const endIndex = Math.min(
      startIndex + Math.ceil((containerHeight / rowHeight) + 1) * columns,
      items.length
    )
    
    return { startIndex, endIndex }
  }, [scrollTop, containerHeight, itemHeight, gap, columns, items.length])

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex)
  }, [items, visibleRange])

  // Calculate total height
  const totalHeight = useMemo(() => {
    const rows = Math.ceil(items.length / columns)
    return rows * (itemHeight + gap) - gap
  }, [items.length, itemHeight, gap, columns])

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: Math.floor(visibleRange.startIndex / columns) * (itemHeight + gap),
            left: 0,
            right: 0,
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gap}px`,
            padding: '0 16px'
          }}
        >
          {visibleItems.map((item, index) => (
            <motion.div
              key={visibleRange.startIndex + index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.startIndex + index)}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VirtualizedGrid
