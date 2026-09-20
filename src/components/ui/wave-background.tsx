'use client'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import { createNoise2D } from 'simplex-noise'

interface Point {
    x: number
    y: number
    wave: { x: number; y: number }
    cursor: {
        x: number
        y: number
        vx: number
        vy: number
    }
}

interface WavesProps {
    className?: string
    strokeColor?: string
    backgroundColor?: string
    /** Horizontal spacing between lines. Lower is denser and more expensive. */
    xGap?: number
    /** Vertical spacing between points on a line. */
    yGap?: number
}

/**
 * How far from the pointer the field reacts. A finger covers more of a phone
 * than a cursor covers a desktop, and it aims less precisely, so touch gets a
 * wider reach.
 */
const MOUSE_RADIUS = 200
const TOUCH_RADIUS = 260

/** Sideways force from how fast the pointer is travelling: the swipe. */
const DRAG_FORCE = 0.00045

/**
 * Force pushing points away from the pointer, regardless of speed. The drag
 * force alone is proportional to velocity, so a slow, careful drag - which is
 * most of what a thumb does - barely moved the field at all. This makes the
 * lines part under the pointer as long as it keeps moving.
 */
const PUSH_FORCE = 0.18

/** Divided by the restoration force, so this is the parting in px. */
const MAX_OFFSET = 50

/**
 * The pointer is followed through a lerp, not snapped, so the parting trails
 * it slightly. Touch tracks tighter: a thumb is already on the point it means
 * to move, and lag there reads as the field ignoring it.
 */
const MOUSE_FOLLOW = 0.16
const TOUCH_FOLLOW = 0.26

/**
 * Stop pushing once the pointer has been still this long (ms). Without it the
 * push would hold a permanent dent wherever the pointer was last seen,
 * including after the cursor has left the window entirely.
 */
const ENGAGE_TIMEOUT = 280

/**
 * Roughly how many points the field may carry, by viewport. Every point is
 * re-noised and every path re-serialised on the main thread each frame, so
 * this is the frame budget in disguise: a grid tuned to look right on a
 * desktop costs a phone far more than it can spend per frame, and the whole
 * field - pointer included - then moves in steps. Spacing is scaled up to stay
 * inside the budget, rather than the caller having to guess per screen.
 */
const POINT_BUDGET_NARROW = 1300
const POINT_BUDGET_WIDE = 8000

export function Waves({
    className = "",
    strokeColor = "#ffffff",  // White lines
    backgroundColor = "#000000",  // Black background
    xGap = 8,
    yGap = 8
}: WavesProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const mouseRef = useRef({
        x: -10,
        y: 0,
        lx: 0,
        ly: 0,
        sx: 0,
        sy: 0,
        vs: 0,
        a: 0,
        set: false,
        /** Pointer is down - the only way touch counts as engaged. */
        down: false,
        /** The last pointer was a finger, not a cursor. */
        touch: false,
        /** Timestamp of the last pointer event, on the rAF clock. */
        lastMove: -Infinity,
        /** Present and recent enough to be pushing the field. */
        engaged: false,
    })
    const pathsRef = useRef<SVGPathElement[]>([])
    const linesRef = useRef<Point[][]>([])
    const noiseRef = useRef<((x: number, y: number) => number) | null>(null)
    const rafRef = useRef<number | null>(null)
    const lastTimeRef = useRef<number | null>(null)
    const boundingRef = useRef<DOMRect | null>(null)

    // Initialization
    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return

        const container = containerRef.current

        // Initialize noise generator
        noiseRef.current = createNoise2D()

        // Initialize size and lines
        setSize()
        setLines()

        // Watch the element, not the window: the field's box also changes
        // without a resize — opening the mobile nav grows the header, which
        // shrinks this band and pushes it hundreds of pixels down the page.
        // A stale rect would map the pointer that far off the real cursor.
        const resize = new ResizeObserver(onResize)
        resize.observe(container)

        // Bind events. Pointer events cover cursor, pen and touch in one path;
        // touch drags stay alive because the container sets `touch-action:
        // none`, so nothing here has to block the main thread with a
        // non-passive preventDefault. The browser implicitly captures a touch
        // to the element it started on, so its moves still reach the window.
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('pointermove', onPointerMove, { passive: true })
        container.addEventListener('pointerdown', onPointerDown, { passive: true })
        window.addEventListener('pointerup', onPointerUp, { passive: true })
        window.addEventListener('pointercancel', onPointerUp, { passive: true })

        // Start animation
        rafRef.current = requestAnimationFrame(tick)

        // Pause while scrolled out of view — redrawing every line is the
        // page's most expensive paint, and it would otherwise keep running
        // behind the sections below.
        const visibility = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                if (rafRef.current === null) {
                    rafRef.current = requestAnimationFrame(tick)
                }
            } else if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current)
                rafRef.current = null
                lastTimeRef.current = null
            }
        })
        visibility.observe(container)

        return () => {
            visibility.disconnect()
            resize.disconnect()
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('pointermove', onPointerMove)
            container.removeEventListener('pointerdown', onPointerDown)
            window.removeEventListener('pointerup', onPointerUp)
            window.removeEventListener('pointercancel', onPointerUp)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Set SVG size
    const setSize = () => {
        if (!containerRef.current || !svgRef.current) return

        boundingRef.current = containerRef.current.getBoundingClientRect()
        const { width, height } = boundingRef.current

        svgRef.current.style.width = `${width}px`
        svgRef.current.style.height = `${height}px`
    }

    // Setup lines - more points for smoother curves
    const setLines = () => {
        if (!svgRef.current || !boundingRef.current) return

        const { width, height } = boundingRef.current
        linesRef.current = []

        // Clear existing paths
        pathsRef.current.forEach(path => {
            path.remove()
        })
        pathsRef.current = []

        // Spacing comes from props — smaller values give denser, smoother
        // results at a proportionally higher per-frame cost.
        const oWidth = width + 200
        const oHeight = height + 30

        // Thin the grid until it fits the frame budget. Point count goes with
        // the square of the spacing, so one scale factor on both axes keeps
        // the field's proportions while trading density for frame rate.
        const budget = width < 768 ? POINT_BUDGET_NARROW : POINT_BUDGET_WIDE
        const requested = Math.ceil(oWidth / xGap) * Math.ceil(oHeight / yGap)
        const scale = Math.max(1, Math.sqrt(requested / budget))

        const xSpacing = xGap * scale
        const ySpacing = yGap * scale

        const totalLines = Math.ceil(oWidth / xSpacing)
        const totalPoints = Math.ceil(oHeight / ySpacing)

        const xStart = (width - xSpacing * totalLines) / 2
        const yStart = (height - ySpacing * totalPoints) / 2

        // Create vertical lines
        for (let i = 0; i < totalLines; i++) {
            const points: Point[] = []

            for (let j = 0; j < totalPoints; j++) {
                const point: Point = {
                    x: xStart + xSpacing * i,
                    y: yStart + ySpacing * j,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                }

                points.push(point)
            }

            // Create SVG path
            const path = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'path'
            )
            path.classList.add('a__line')
            path.classList.add('js-line')
            path.setAttribute('fill', 'none')
            path.setAttribute('stroke', strokeColor)
            path.setAttribute('stroke-width', '1')

            svgRef.current.appendChild(path)
            pathsRef.current.push(path)

            // Add points
            linesRef.current.push(points)
        }
    }

    // Always re-measure — the cached rect is what maps the pointer into the
    // field. Only rebuild the lines when the box actually changed size, since
    // a ResizeObserver delivers one entry the moment it starts observing and
    // that first one has nothing to rebuild.
    const onResize = () => {
        const prev = boundingRef.current
        setSize()
        const next = boundingRef.current

        if (prev && next && prev.width === next.width && prev.height === next.height) {
            return
        }

        setLines()
    }

    // The cached rect's top is viewport-relative, so it goes stale the moment
    // the page scrolls. Without this the pointer maps to the wrong point once
    // the hero is only partly on screen. Width and height do not change here,
    // so the lines do not need rebuilding.
    const onScroll = () => {
        if (!containerRef.current) return
        boundingRef.current = containerRef.current.getBoundingClientRect()
    }

    // Pointer handler
    const onPointerMove = (e: PointerEvent) => {
        const mouse = mouseRef.current
        const touch = e.pointerType === 'touch'

        // A finger only counts while it is on the field itself. Otherwise a
        // swipe anywhere else on the page would reach in and stir it.
        if (touch && !mouse.down) return

        mouse.touch = touch
        updatePointerPosition(e.clientX, e.clientY, false)
    }

    // A new touch starts where it lands. Lerping across from wherever the
    // pointer was last seen would drag a furrow over everything in between.
    const onPointerDown = (e: PointerEvent) => {
        const mouse = mouseRef.current

        mouse.touch = e.pointerType === 'touch'
        mouse.down = true
        updatePointerPosition(e.clientX, e.clientY, mouse.touch)
    }

    const onPointerUp = () => {
        mouseRef.current.down = false
    }

    // Update pointer position
    const updatePointerPosition = (x: number, y: number, snap: boolean) => {
        if (!boundingRef.current) return

        const mouse = mouseRef.current
        mouse.x = x - boundingRef.current.left
        mouse.y = y - boundingRef.current.top

        if (!mouse.set || snap) {
            mouse.sx = mouse.x
            mouse.sy = mouse.y
            mouse.lx = mouse.x
            mouse.ly = mouse.y

            mouse.set = true
        }

        mouse.lastMove = performance.now()
    }

    /**
     * Move points - smoother wave motion. `dt` is elapsed frames at 60Hz, so
     * the field settles at the same rate on a 120Hz phone as on a 60Hz laptop;
     * otherwise every spring in here runs at twice the speed on half the
     * hardware.
     */
    const movePoints = (time: number, dt: number) => {
        const { current: lines } = linesRef
        const { current: mouse } = mouseRef
        const { current: noise } = noiseRef

        if (!noise) return

        // Hoisted out of the per-point loop: with thousands of points a frame,
        // anything constant across them is worth computing only once.
        const tx = time * 0.008
        const ty = time * 0.003
        const radius = Math.max(mouse.touch ? TOUCH_RADIUS : MOUSE_RADIUS, mouse.vs)
        const radiusSq = radius * radius
        const ca = Math.cos(mouse.a)
        const sa = Math.sin(mouse.a)
        const drag = mouse.vs * radius * DRAG_FORCE * dt
        const push = mouse.engaged ? PUSH_FORCE * dt : 0
        const restore = 0.01 * dt
        const damp = Math.pow(0.95, dt)

        lines.forEach((points) => {
            points.forEach((p: Point) => {
                // Wave movement - reduced amplitude for smoother waves
                const move = noise(
                    (p.x + tx) * 0.003,  // Adjusted frequency
                    (p.y + ty) * 0.002   // Adjusted frequency
                ) * 8  // Reduced amplitude for smoother waves

                p.wave.x = Math.cos(move) * 12  // Reduced horizontal amplitude
                p.wave.y = Math.sin(move) * 6   // Reduced vertical amplitude

                // Pointer effect - smoother response. Compare squared first,
                // so the far majority of points cost no square root.
                const dx = p.x - mouse.sx
                const dy = p.y - mouse.sy
                const dSq = dx * dx + dy * dy

                if (dSq < radiusSq) {
                    const d = Math.sqrt(dSq)
                    const s = 1 - d / radius
                    const f = Math.cos(d * 0.001) * s

                    // Along the swipe...
                    p.cursor.vx += ca * f * drag
                    p.cursor.vy += sa * f * drag

                    // ...and away from the pointer itself.
                    if (push > 0 && d > 0.001) {
                        const radial = (s * s * push) / d
                        p.cursor.vx += dx * radial
                        p.cursor.vy += dy * radial
                    }
                }

                p.cursor.vx += (0 - p.cursor.x) * restore   // Increased restoration force
                p.cursor.vy += (0 - p.cursor.y) * restore   // Increased restoration force

                p.cursor.vx *= damp  // Increased smoothness
                p.cursor.vy *= damp  // Increased smoothness

                p.cursor.x += p.cursor.vx * dt
                p.cursor.y += p.cursor.vy * dt

                p.cursor.x = Math.min(MAX_OFFSET, Math.max(-MAX_OFFSET, p.cursor.x))  // Limited deformation range
                p.cursor.y = Math.min(MAX_OFFSET, Math.max(-MAX_OFFSET, p.cursor.y))  // Limited deformation range
            })
        })
    }

    // Get moved point coordinates
    const moved = (point: Point, withCursorForce = true) => {
        const coords = {
            x: point.x + point.wave.x + (withCursorForce ? point.cursor.x : 0),
            y: point.y + point.wave.y + (withCursorForce ? point.cursor.y : 0),
        }

        return coords
    }

    // Draw lines - using line segments
    const drawLines = () => {
        const { current: lines } = linesRef
        const { current: paths } = pathsRef

        lines.forEach((points, lIndex) => {
            if (points.length < 2 || !paths[lIndex]) return;

            // First point
            const firstPoint = moved(points[0], false)
            let d = `M ${firstPoint.x} ${firstPoint.y}`

            // Connect points with lines
            for (let i = 1; i < points.length; i++) {
                const current = moved(points[i])
                d += `L ${current.x} ${current.y}`
            }

            paths[lIndex].setAttribute('d', d)
        })
    }

    // Animation logic
    const tick = (time: number) => {
        const { current: mouse } = mouseRef

        // Elapsed frames since the last tick, clamped: a tab that was
        // backgrounded, or a frame the phone dropped, must not arrive as one
        // enormous step that throws every point past its clamp at once.
        const elapsed = lastTimeRef.current === null ? 16.667 : time - lastTimeRef.current
        lastTimeRef.current = time
        const dt = Math.min(2.5, Math.max(0.4, elapsed / 16.667))

        // Smooth pointer movement
        const follow = 1 - Math.pow(1 - (mouse.touch ? TOUCH_FOLLOW : MOUSE_FOLLOW), dt)
        mouse.sx += (mouse.x - mouse.sx) * follow
        mouse.sy += (mouse.y - mouse.sy) * follow

        // Pointer velocity, measured per frame-at-60Hz rather than per actual
        // frame, so a high-refresh screen does not report half the speed for
        // the same swipe and stir the field half as hard.
        const dx = mouse.x - mouse.lx
        const dy = mouse.y - mouse.ly
        const speed = Math.hypot(dx, dy) / dt

        mouse.vs += (speed - mouse.vs) * (1 - Math.pow(0.9, dt))
        mouse.vs = Math.min(100, mouse.vs)

        // Previous pointer position
        mouse.lx = mouse.x
        mouse.ly = mouse.y

        // Pointer angle, held over when it stops rather than collapsing to
        // atan2(0, 0) and snapping the swipe direction to the right.
        if (speed > 0.01) {
            mouse.a = Math.atan2(dy, dx)
        }

        mouse.engaged =
            mouse.set &&
            (mouse.down || !mouse.touch) &&
            time - mouse.lastMove < ENGAGE_TIMEOUT

        movePoints(time, dt)
        drawLines()

        rafRef.current = requestAnimationFrame(tick)
    }

    return (
        <div
            ref={containerRef}
            className={`waves-component relative overflow-hidden ${className}`}
            style={{
                backgroundColor,
                position: 'absolute',
                top: 0,
                left: 0,
                margin: 0,
                padding: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                // The field takes the drag itself: without this the browser
                // claims the gesture as a scroll a few pixels in and cancels
                // the pointer, which is most of why it fought back on a phone.
                touchAction: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
            } as React.CSSProperties}
        >
            <svg
                ref={svgRef}
                className="block w-full h-full js-svg"
                xmlns="http://www.w3.org/2000/svg"
            />
        </div>
    )
}
