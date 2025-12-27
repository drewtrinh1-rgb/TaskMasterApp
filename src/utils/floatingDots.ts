/**
 * Floating Dots Background - Creates individual shapes that float upward like snowflakes
 */

type ShapeType = 'circle' | 'star' | 'diamond' | 'square' | 'oval' | 'flower' | 'clover';

interface Dot {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeIn: boolean;
  life: number;
  shape: ShapeType;
  rotation: number;
  rotationSpeed: number;
}

type TabColor = 'hub' | 'tasks' | 'projects' | 'calendar' | 'settings';

export class FloatingDotsBackground {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private dots: Dot[] = [];
  private animationId: number | null = null;
  private maxDots = 80;
  private spawnRate = 0.8; // Higher probability of spawning dots
  private currentTab: TabColor = 'calendar'; // Default to calendar

  private tabColors: Record<TabColor, string> = {
    hub: 'rgba(100, 149, 237, OPACITY)', // Metallic blue (cornflower blue)
    tasks: 'rgba(46, 139, 87, OPACITY)', // Metallic green (sea green)
    projects: 'rgba(205, 127, 50, OPACITY)', // Bronze
    calendar: 'rgba(128, 0, 32, OPACITY)', // Metallic maroon
    settings: 'rgba(218, 165, 32, OPACITY)' // Gold
  };

  private shapes: ShapeType[] = ['circle', 'star', 'diamond', 'square', 'oval', 'flower', 'clover'];

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'floating-dots-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1';
    
    document.body.insertBefore(this.canvas, document.body.firstChild);
    
    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    
    // Create initial dots spread across the screen
    for (let i = 0; i < 30; i++) {
      const dot = this.createDot();
      dot.y = Math.random() * this.canvas.height; // Random Y position
      dot.opacity = Math.random() * 0.6; // Random opacity
      dot.fadeIn = false;
      this.dots.push(dot);
    }
    
    window.addEventListener('resize', () => this.resize());
  }

  private resize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private createDot(): Dot {
    const randomShape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
    return {
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + 20, // Start below viewport
      size: Math.random() * 6 + 4, // 4-10px - twice as big (was 2-5px)
      speedY: -(Math.random() * 0.6 + 0.5), // Faster upward speed: -0.5 to -1.1 (was -0.3 to -0.7)
      speedX: (Math.random() - 0.5) * 0.5, // Gentle side-to-side drift
      opacity: 0,
      fadeIn: true,
      life: 0,
      shape: randomShape,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    };
  }

  private updateDot(dot: Dot): boolean {
    // Move the dot
    dot.y += dot.speedY;
    dot.x += dot.speedX;
    dot.life++;
    dot.rotation += dot.rotationSpeed;

    // Fade in
    if (dot.fadeIn) {
      dot.opacity += 0.03;
      if (dot.opacity >= 0.6) { // More visible
        dot.fadeIn = false;
      }
    }

    // Fade out when near top or after living long enough
    if (dot.y < 100 || dot.life > 800) {
      dot.opacity -= 0.01;
    }

    // Add slight wave motion
    dot.x += Math.sin(dot.life * 0.02) * 0.2;

    // Remove if invisible or off screen
    return dot.opacity > 0 && dot.y > -20;
  }

  private drawDot(dot: Dot): void {
    const color = this.tabColors[this.currentTab].replace('OPACITY', dot.opacity.toString());
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1.5;

    this.ctx.save();
    this.ctx.translate(dot.x, dot.y);
    this.ctx.rotate(dot.rotation);

    switch (dot.shape) {
      case 'circle':
        this.drawCircle(dot.size);
        break;
      case 'star':
        this.drawStar(dot.size);
        break;
      case 'diamond':
        this.drawDiamond(dot.size);
        break;
      case 'square':
        this.drawSquare(dot.size);
        break;
      case 'oval':
        this.drawOval(dot.size);
        break;
      case 'flower':
        this.drawFlower(dot.size);
        break;
      case 'clover':
        this.drawClover(dot.size);
        break;
    }

    this.ctx.restore();
  }

  private drawCircle(size: number): void {
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawStar(size: number): void {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.5;

    this.ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawDiamond(size: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(0, -size);
    this.ctx.lineTo(size, 0);
    this.ctx.lineTo(0, size);
    this.ctx.lineTo(-size, 0);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawSquare(size: number): void {
    this.ctx.fillRect(-size, -size, size * 2, size * 2);
  }

  private drawOval(size: number): void {
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, size * 1.3, size * 0.8, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawFlower(size: number): void {
    const petals = 6;
    for (let i = 0; i < petals; i++) {
      const angle = (i * Math.PI * 2) / petals;
      this.ctx.beginPath();
      this.ctx.ellipse(
        Math.cos(angle) * size * 0.5,
        Math.sin(angle) * size * 0.5,
        size * 0.6,
        size * 0.4,
        angle,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    }
    // Center
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawClover(size: number): void {
    // Four-leaf clover
    const leaves = 4;
    for (let i = 0; i < leaves; i++) {
      const angle = (i * Math.PI * 2) / leaves;
      this.ctx.beginPath();
      this.ctx.arc(
        Math.cos(angle) * size * 0.6,
        Math.sin(angle) * size * 0.6,
        size * 0.5,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    }
    // Center
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private animate = (): void => {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw existing dots
    this.dots = this.dots.filter(dot => {
      const alive = this.updateDot(dot);
      if (alive) {
        this.drawDot(dot);
      }
      return alive;
    });

    // Spawn new dots
    if (this.dots.length < this.maxDots && Math.random() < this.spawnRate) {
      this.dots.push(this.createDot());
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  start(): void {
    if (!this.animationId) {
      this.animate();
    }
  }

  setTab(tab: TabColor): void {
    this.currentTab = tab;
  }

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy(): void {
    this.stop();
    this.canvas.remove();
  }
}
