import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { gsap } from "gsap";

interface Point {
    x: number;
    y: number;
    originX: number;
    originY: number;
    closest?: Point[];
    active?: number;
    circle?: Circle;
}

class Circle {
    pos: Point;
    radius: number;
    color: string;
    active: number;

    constructor(pos: Point, rad: number, color: string) {
        this.pos = pos;
        this.radius = rad;
        this.color = color;
        this.active = 0;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.active) return;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = `rgba(156,217,249,${this.active})`;
        ctx.fill();
    }
}

export const AnimatedBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        let width: number, height: number;
        let canvas: HTMLCanvasElement;
        let ctx: CanvasRenderingContext2D;
        let points: Point[] = [];
        let target: Point = { x: 0, y: 0, originX: 0, originY: 0 };
        let animateHeader = true;

        function initHeader() {
            width = window.innerWidth;
            height = window.innerHeight;
            target = { x: width / 2, y: height / 2, originX: 0, originY: 0 };

            canvas = canvasRef.current!;
            canvas.width = width;
            canvas.height = height;
            ctx = canvas.getContext("2d")!;

            // create points
            points = [];
            for (let x = 0; x < width; x += width / 20) {
                for (let y = 0; y < height; y += height / 20) {
                    const px = x + Math.random() * width / 20;
                    const py = y + Math.random() * height / 20;
                    const p: Point = { x: px, originX: px, y: py, originY: py };
                    points.push(p);
                }
            }

            // find the 5 closest points for each point
            points.forEach((p1) => {
                const closest: Point[] = [];
                points.forEach((p2) => {
                    if (p1 !== p2) {
                        if (closest.length < 5) {
                            closest.push(p2);
                        } else {
                            closest.sort((a, b) => getDistance(p1, a) - getDistance(p1, b));
                            if (getDistance(p1, p2) < getDistance(p1, closest[4])) {
                                closest[4] = p2;
                            }
                        }
                    }
                });
                p1.closest = closest;
            });

            // assign a circle to each point
            points.forEach((p) => {
                const c = new Circle(p, 2 + Math.random() * 2, "rgba(255,255,255,0.3)");
                p.circle = c;
            });
        }

        function addListeners() {
            if (!("ontouchstart" in window)) {
                window.addEventListener("mousemove", mouseMove);
            }
            window.addEventListener("scroll", scrollCheck);
            window.addEventListener("resize", resize);
        }

        function mouseMove(e: MouseEvent) {
            let posx = 0,
                posy = 0;
            if (e.pageX || e.pageY) {
                posx = e.pageX;
                posy = e.pageY;
            } else if (e.clientX || e.clientY) {
                posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            target.x = posx;
            target.y = posy;
        }

        function scrollCheck() {
            animateHeader = document.body.scrollTop <= height;
        }

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        function initAnimation() {
            animate();
            points.forEach((p) => shiftPoint(p));
        }

        function animate() {
            if (animateHeader) {
                ctx.clearRect(0, 0, width, height);
                points.forEach((p) => {
                    // detect points in range
                    if (Math.abs(getDistance(target, p)) < 4000) {
                        p.active = 0.3;
                        p.circle!.active = 0.6;
                    } else if (Math.abs(getDistance(target, p)) < 20000) {
                        p.active = 0.1;
                        p.circle!.active = 0.3;
                    } else if (Math.abs(getDistance(target, p)) < 40000) {
                        p.active = 0.02;
                        p.circle!.active = 0.1;
                    } else {
                        p.active = 0;
                        p.circle!.active = 0;
                    }

                    drawLines(p);
                    p.circle!.draw(ctx);
                });
            }
            requestAnimationFrame(animate);
        }

        function shiftPoint(p: Point) {
            gsap.to(p, {
                x: p.originX - 50 + Math.random() * 100,
                y: p.originY - 50 + Math.random() * 100,
                duration: 1 + 1 * Math.random(),
                ease: "circ.inOut",
                onComplete: () => shiftPoint(p),
            });
        }

        function drawLines(p: Point) {
            if (!p.active) return;
            p.closest!.forEach((closestP) => {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(closestP.x, closestP.y);
                ctx.strokeStyle = `rgba(156,217,249,${p.active})`;
                ctx.stroke();
            });
        }

        function getDistance(p1: Point, p2: Point): number {
            return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
        }

        initHeader();
        initAnimation();
        addListeners();

        return () => {
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("scroll", scrollCheck);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <Box sx={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", zIndex: 1 }}>
            <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
        </Box>
    );
};
