from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, output_path):
    """Create a simple OSINTEX icon."""
    
    # Create a new image with a dark background
    img = Image.new('RGB', (size, size), color='#1a1a2e')
    draw = ImageDraw.Draw(img)
    
    # Draw a magnifying glass-style circle
    circle_color = '#0f3460'
    accent_color = '#16213e'
    highlight_color = '#e94560'
    
    # Main circle (lens)
    margin = size // 6
    draw.ellipse([margin, margin, size - margin, size - margin], 
                 fill=circle_color, outline=highlight_color, width=max(2, size // 32))
    
    # Inner accent circle
    inner_margin = margin + size // 12
    draw.ellipse([inner_margin, inner_margin, size - inner_margin, size - inner_margin], 
                 fill=accent_color)
    
    # Handle of magnifying glass
    handle_start_x = size - margin - size // 16
    handle_start_y = size - margin - size // 16
    handle_end_x = size - margin // 3
    handle_end_y = size - margin // 3
    draw.line([handle_start_x, handle_start_y, handle_end_x, handle_end_y], 
              fill=highlight_color, width=max(2, size // 16))
    
    # Add search crosshair in center
    center = size // 2
    crosshair_size = size // 8
    draw.line([center - crosshair_size, center, center + crosshair_size, center], 
              fill=highlight_color, width=max(1, size // 64))
    draw.line([center, center - crosshair_size, center, center + crosshair_size], 
              fill=highlight_color, width=max(1, size // 64))
    
    # Save the image
    img.save(output_path, 'PNG')
    print(f'Created {size}x{size} icon: {output_path}')

def main():
    icons_dir = 'extension/icons'
    os.makedirs(icons_dir, exist_ok=True)
    
    sizes = [16, 32, 48, 128]
    
    for size in sizes:
        output_path = os.path.join(icons_dir, f'icon{size}.png')
        create_icon(size, output_path)
    
    print('\nAll icons created successfully!')

if __name__ == '__main__':
    main()
