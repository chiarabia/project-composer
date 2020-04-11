import React, { useRef, useEffect, useState } from 'react'
import './style.css'

let ctx: CanvasRenderingContext2D | null
let rect: DOMRect | null

interface Frame {
  note: Note,
  pitch: number,
  volume: number,
  time: number,
  type: OscillatorType
}

interface Note {
  name: string
  freq: number
  octave: number
}

interface Point {
  x: number,
  y: number
}

/**
 * This component builds a canvas with the lines for actual melody composition.
 * @param props notes, melody, update (callback)
 * @return JSX Canvas element
 */
function VolumeTimeline(props: any) {

  const CANVAS_W = props.options.width
  const CANVAS_H = 70 // in px

  const LEFT_PADDING = props.options.leftPadding
  
  const FRAME_W = props.options.frameSize

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [lastFrame, setLastFrame]: [Point, any] = useState({ x: 0, y: 0 })
  const [isDrawing, setIsDrawing]: [boolean, any] = useState(false)
  const [shiftValue, setShiftValue]: [number, any] = useState(-1)

  /**
   * This part renders the canvas after initialising it.
   */
  useEffect(() => {
    let canvas = canvasRef.current
    if (canvas) {
      // Init canvas space
      ctx = canvas.getContext('2d')
      rect = canvas.getBoundingClientRect()
      
      // Render "loop"
      drawBackground()
      drawLabels()
      drawVolumeFrames(props.melody)
    }
  })

  /**
   * Send new volume frame to parent component
   * @param time 
   * @param volume 
   */
  const addFrame = (time: number, volume: number) => {
    let percentVolume = volume / CANVAS_H // from px value to 0-1 value
    // update parent component
    console.log(volume + " >>> " + percentVolume)

    props.update({
      volume: percentVolume,
      time: time
    })
  }

  /**
   * Actions to do when you start holding down mouseclick on the canvas.
   */
  const onInputStart = (e: any) => {
    setIsDrawing(true)
    if (e.shiftKey)
      setShiftValue(
        getFrame(
          getInputPos(e)
        ).y
      )
  }

  /**
   * Actions to do when you stop holding down mouseclick on the canvas.
   */
  const onInputStop = (e: any) => {
    setIsDrawing(false)
    if (!e.shiftKey) setShiftValue(-1)
  }

  /**
   * Handle the input movement when you press down on the canvas and move the
   * cursor.
   * @param e Event
   */
  const onInputMove = (e: any) => {
    if (isDrawing) {
      let pos = getInputPos(e)
      if (pos.x > LEFT_PADDING) {
        let frame = getFrame(pos)
        // when I change cell...
        // optimized: only when cell changes
        if (shiftValue >= 0) {
          addFrame(frame.x - 1, shiftValue)
        } else if (lastFrame.x !== frame.x || lastFrame.y !== frame.y) {
          setLastFrame(frame)
          // Pass note to data structure
          addFrame(frame.x - 1, frame.y)
        }
      }
    }
  }

  /**
   * Get mouse relative position to canvas
   * @returns a Point object
   * @param e The event of a mouse interaction
   */
  const getInputPos = (e: any): Point => {
    if (rect) return {
      x: e.pageX - rect.left,
      y: e.pageY - rect.top
    }
    return { x: -1, y: -1 }
  }

  /**
   * Pass a mouse position and get the frame (a horizontal portion)
   * in simplified X and Y coordinates that contains it.
   * @returns a point corresponding to the coordinates of the frame
   * @param position A position on the canvas
   */
  const getFrame = (position: Point): Point => {
    return {
      x: Math.floor(position.x / FRAME_W),
      y: CANVAS_H - position.y
    }
  }

  /**
   * Draws the background for the canvas
   */
  const drawBackground = () => {
    if (ctx) {
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
    }
  }

  /**
   * Draws 100% - 0% values
   */
  const drawLabels = () => {
    if (ctx) {
      ctx.font = "12px sans-serif"
      ctx.fillStyle = "red"
      ctx.fillText("100", 2, 14)
      ctx.fillText("0", 2, CANVAS_H - 2)
      ctx.moveTo(FRAME_W, 0)
      ctx.lineTo(FRAME_W, CANVAS_H)
      ctx.stroke()
    }
  }

  /**
   * Draw a filled rectangle in the right position.
   * @param x The position of the x-esim cell
   * @param y The position of the y-esim cell
   * @param color Color of the rectangle
   */
  const drawRectangle = (x: number, y: number) => {
    if (ctx) {
      ctx.fillStyle = "green"
      ctx.fillRect(x * FRAME_W, CANVAS_H - y, FRAME_W, CANVAS_H)
    }
  }

  /**
   * Draws notes by color and position using their
   * pitch(y axis), time(x axis) and waveform(color)
   * @param melody Array of frames to render
   */
  const drawVolumeFrames = (melody: Frame[]) => {
    for (let index = 0; index < melody.length; index++) {
      const frame = melody[index]
      
      if (frame) {
        const volume = frame.volume * CANVAS_H // from 0-1 value to px value
        drawRectangle(index + 1, volume)
      }
    }
  }

  return (
    <canvas
      className="volumeCanvas"
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      onMouseMove={(e) => onInputMove(e)}
      onMouseDown={(e) =>onInputStart(e)}
      onMouseUp={(e) => onInputStop(e)}
      onMouseLeave={(e) => onInputStop(e)}
    ></canvas>
  )
}

export default VolumeTimeline