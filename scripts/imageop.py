#!/usr/bin/env python3
"""
Portfolio Image Optimizer
Automatically optimizes images for web portfolio with responsive sizes
"""

import os
import sys
from pathlib import Path
from PIL import Image
import json

class PortfolioImageOptimizer:
    """Optimize images for responsive web portfolio"""
    
    # Responsive breakpoints (widths in pixels)
    SIZES = {
        'thumbnail': 400,   # Grid thumbnails
        'medium': 800,      # Tablet view
        'large': 1200,      # Desktop view
        'xlarge': 1920,     # Full-screen / 4K
    }
    
    # Quality settings
    JPEG_QUALITY = 85
    WEBP_QUALITY = 85
    
    def __init__(self, input_dir, output_dir='optimized'):
        self.input_dir = Path(input_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Create size directories
        for size_name in self.SIZES.keys():
            (self.output_dir / size_name).mkdir(exist_ok=True)
        
        self.metadata = []
    
    def optimize_image(self, image_path):
        """Optimize single image to all sizes and formats"""
        print(f"\n📸 Processing: {image_path.name}")
        
        try:
            with Image.open(image_path) as img:
                # Convert RGBA to RGB if needed
                if img.mode == 'RGBA':
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[3])
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Get original dimensions
                original_width, original_height = img.size
                aspect_ratio = original_height / original_width
                
                print(f"   Original: {original_width}x{original_height}")
                
                # Generate all sizes
                image_data = {
                    'filename': image_path.stem,
                    'original_size': f"{original_width}x{original_height}",
                    'aspect_ratio': aspect_ratio,
                    'sizes': {}
                }
                
                for size_name, target_width in self.SIZES.items():
                    # Skip if original is smaller than target
                    if original_width < target_width:
                        continue
                    
                    # Calculate new dimensions
                    new_width = target_width
                    new_height = int(target_width * aspect_ratio)
                    
                    # Resize image
                    resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    
                    # Save as JPEG
                    jpeg_path = self.output_dir / size_name / f"{image_path.stem}.jpg"
                    resized.save(
                        jpeg_path,
                        'JPEG',
                        quality=self.JPEG_QUALITY,
                        optimize=True,
                        progressive=True
                    )
                    jpeg_size = jpeg_path.stat().st_size
                    
                    # Save as WebP
                    webp_path = self.output_dir / size_name / f"{image_path.stem}.webp"
                    resized.save(
                        webp_path,
                        'WEBP',
                        quality=self.WEBP_QUALITY,
                        method=6  # Highest quality compression
                    )
                    webp_size = webp_path.stat().st_size
                    
                    # Calculate savings
                    savings = ((jpeg_size - webp_size) / jpeg_size) * 100
                    
                    print(f"   {size_name}: {new_width}x{new_height} - "
                          f"JPEG: {jpeg_size//1024}KB, WebP: {webp_size//1024}KB "
                          f"({savings:.1f}% smaller)")
                    
                    image_data['sizes'][size_name] = {
                        'width': new_width,
                        'height': new_height,
                        'jpeg': str(jpeg_path.relative_to(self.output_dir)),
                        'webp': str(webp_path.relative_to(self.output_dir)),
                        'jpeg_size': jpeg_size,
                        'webp_size': webp_size
                    }
                
                self.metadata.append(image_data)
                print(f"   ✅ Completed!")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    def process_all(self):
        """Process all images in input directory"""
        # Supported formats
        image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp'}
        
        # Find all images
        image_files = [
            f for f in self.input_dir.iterdir()
            if f.suffix.lower() in image_extensions and f.is_file()
        ]
        
        if not image_files:
            print(f"❌ No images found in {self.input_dir}")
            return
        
        print(f"🎨 Found {len(image_files)} images to optimize")
        print(f"📁 Output directory: {self.output_dir}")
        print(f"🎯 Generating sizes: {', '.join(self.SIZES.keys())}")
        print("=" * 60)
        
        for image_file in image_files:
            self.optimize_image(image_file)
        
        # Save metadata
        self.save_metadata()
        
        # Generate HTML examples
        self.generate_html_examples()
        
        print("\n" + "=" * 60)
        print("✨ Optimization complete!")
        print(f"📊 Processed {len(self.metadata)} images")
        print(f"📝 Metadata saved to: {self.output_dir}/images.json")
        print(f"🌐 Example HTML: {self.output_dir}/example.html")
    
    def save_metadata(self):
        """Save image metadata to JSON"""
        metadata_path = self.output_dir / 'images.json'
        with open(metadata_path, 'w') as f:
            json.dump(self.metadata, f, indent=2)
    
    def generate_html_examples(self):
        """Generate example HTML for using optimized images"""
        
        html = """<!DOCTYPE html>
<html lang="da">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Billedegalleri</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f5f5f5;
            padding: 2rem;
        }
        
        h1 {
            text-align: center;
            margin-bottom: 2rem;
            color: #333;
        }
        
        /* Grid Gallery */
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .gallery-item {
            position: relative;
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .gallery-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        
        .gallery-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            aspect-ratio: 1 / 1;
        }
        
        /* Lazy loading blur effect */
        .gallery-item img {
            filter: blur(0);
            transition: filter 0.3s;
        }
        
        .gallery-item img[loading="lazy"]:not([src]) {
            filter: blur(10px);
        }
        
        /* Lightbox */
        .lightbox {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.95);
            z-index: 1000;
            padding: 2rem;
        }
        
        .lightbox.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .lightbox img {
            max-width: 90%;
            max-height: 90vh;
            object-fit: contain;
        }
        
        .lightbox-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .lightbox-close:hover {
            transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
            .gallery {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 1rem;
            }
            
            body {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <h1>📸 Portfolio Galleri</h1>
    
    <div class="gallery" id="gallery"></div>
    
    <div class="lightbox" id="lightbox">
        <button class="lightbox-close" onclick="closeLightbox()">×</button>
        <picture id="lightbox-picture"></picture>
    </div>
    
    <script>
        // Image data
        const images = """ + json.dumps(self.metadata, indent=8) + """;
        
        // Generate gallery
        const gallery = document.getElementById('gallery');
        
        images.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.onclick = () => openLightbox(index);
            
            // Create responsive picture element
            const picture = document.createElement('picture');
            
            // Add WebP sources
            if (img.sizes.thumbnail) {
                const webpSource = document.createElement('source');
                webpSource.srcset = `optimized/${img.sizes.thumbnail.webp}`;
                webpSource.type = 'image/webp';
                picture.appendChild(webpSource);
                
                // Add JPEG fallback
                const jpegImg = document.createElement('img');
                jpegImg.src = `optimized/${img.sizes.thumbnail.jpeg}`;
                jpegImg.alt = img.filename;
                jpegImg.loading = 'lazy';
                picture.appendChild(jpegImg);
            }
            
            item.appendChild(picture);
            gallery.appendChild(item);
        });
        
        // Lightbox functions
        function openLightbox(index) {
            const lightbox = document.getElementById('lightbox');
            const picture = document.getElementById('lightbox-picture');
            const img = images[index];
            
            picture.innerHTML = '';
            
            // Use largest available size
            const size = img.sizes.xlarge || img.sizes.large || img.sizes.medium;
            
            if (size) {
                // WebP source
                const webpSource = document.createElement('source');
                webpSource.srcset = `optimized/${size.webp}`;
                webpSource.type = 'image/webp';
                picture.appendChild(webpSource);
                
                // JPEG fallback
                const jpegImg = document.createElement('img');
                jpegImg.src = `optimized/${size.jpeg}`;
                jpegImg.alt = img.filename;
                picture.appendChild(jpegImg);
            }
            
            lightbox.classList.add('active');
        }
        
        function closeLightbox() {
            document.getElementById('lightbox').classList.remove('active');
        }
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
        
        // Close on background click
        document.getElementById('lightbox').addEventListener('click', (e) => {
            if (e.target.id === 'lightbox') closeLightbox();
        });
    </script>
</body>
</html>"""
        
        html_path = self.output_dir / 'example.html'
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html)


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Optimize portfolio images for responsive web display'
    )
    parser.add_argument(
        'input_dir',
        help='Directory containing original images'
    )
    parser.add_argument(
        '-o', '--output',
        default='optimized',
        help='Output directory (default: optimized)'
    )
    
    args = parser.parse_args()
    
    # Check if input directory exists
    input_path = Path(args.input_dir)
    if not input_path.exists():
        print(f"❌ Error: Directory '{args.input_dir}' not found")
        sys.exit(1)
    
    # Create optimizer and process
    optimizer = PortfolioImageOptimizer(input_path, args.output)
    optimizer.process_all()


if __name__ == '__main__':
    main()