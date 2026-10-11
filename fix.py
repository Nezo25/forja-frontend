import sys

def fix_file(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    try:
        # First layer of corruption (utf-8 read as cp1252 and saved as utf-8)
        content = content.encode('cp1252', errors='ignore').decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"First layer failed: {e}")
        
    try:
        # Second layer of corruption (did it happen twice?)
        content = content.encode('cp1252', errors='ignore').decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Second layer failed: {e}")

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('Admin_Clean2.tsx', 'Admin_Fixed.tsx')
