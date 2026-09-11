from PIL import Image

def make_square():
    img = Image.open('src/app/icon.png').convert("RGBA")
    width, height = img.size
    new_size = max(width, height)
    
    # Create a new image with transparent background
    new_img = Image.new("RGBA", (new_size, new_size), (0, 0, 0, 0))
    
    # Paste the original image into the center
    paste_x = (new_size - width) // 2
    paste_y = (new_size - height) // 2
    new_img.paste(img, (paste_x, paste_y))
    
    # Resize to 512x512 which is a multiple of 48 (Wait, 512 is not a multiple of 48! 48*10 = 480. 48*11 = 528. 512 is not. Let's use 528x528 or 192x192. 192 is 48*4. 144 is 48*3.)
    # Let's resize to 192x192.
    final_img = new_img.resize((192, 192), Image.Resampling.LANCZOS)
    
    # Save the result
    final_img.save('src/app/icon.png', 'PNG')
    final_img.save('public/icon.png', 'PNG') # update both
    
if __name__ == "__main__":
    make_square()
