'use client';

import { useEffect, useRef } from 'react';

const Background = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Configuration
        const PARTICLE_COUNT = 400; // Dense but performant
        const PARTICLE_SIZE_BASE = 1.2;
        const PARTICLE_SPEED_BASE = 0.2; // Very slow, premium feel
        const INTERACTION_RADIUS = 150;

        // Color Palette: Subtle Neon Green/Cyan mix for "Nvidia/Data" feel
        // hsla(150, 100%, 45%, alpha) is the site's neon green

        let mouse = { x: -1000, y: -1000, active: false };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            baseX: number;
            baseY: number;
            size: number;
            density: number;
            color: string;
            alpha: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * PARTICLE_SPEED_BASE;
                this.vy = (Math.random() - 0.5) * PARTICLE_SPEED_BASE;
                this.size = Math.random() * PARTICLE_SIZE_BASE + 0.5;
                this.density = (Math.random() * 30) + 1;
                this.alpha = Math.random() * 0.5 + 0.1; // Varying transparency
                // Randomize slightly between Cyan and Neon Green for depth
                const hue = Math.random() > 0.5 ? 150 : 170;
                this.color = `hsla(${hue}, 100%, 50%, ${this.alpha})`;
            }

            update() {
                // Natural drift
                this.x += this.vx;
                this.y += this.vy;

                // Mouse Interaction (Gentle repulsion/swirl)
                if (mouse.active) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < INTERACTION_RADIUS) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;

                        // Push away gently
                        const directionX = forceDirectionX * force * this.density * 0.6;
                        const directionY = forceDirectionY * force * this.density * 0.6;

                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }

                // Return to natural flow bounds or wrap
                if (this.x > width) this.x = 0;
                else if (this.x < 0) this.x = width;

                if (this.y > height) this.y = 0;
                else if (this.y < 0) this.y = height;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        let particles: Particle[] = [];
        const init = () => {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Deep, clean background (no gradient, just void)
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, width, height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        };

        const handleMouseLeave = () => {
            mouse.active = false;
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10"
            style={{ pointerEvents: 'none' }}
        />
    );
};

export default Background;
