import re
import json

def parse_readme_to_json(readme_path):
    """Parse the README.md file and extract all categories and search engines."""
    
    with open(readme_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all sections (categories)
    categories = []
    current_category = None
    
    # Split content into lines
    lines = content.split('\n')
    
    for i, line in enumerate(lines):
        # Check if it's a category header (### Header)
        if line.startswith('### '):
            category_name = line.replace('### ', '').strip()
            
            # Skip "Not working / Paused" section
            if category_name == "Not working / Paused":
                break
            
            # Skip "Unclassified" for now, we'll handle it separately
            if category_name in ["Unclassified"]:
                continue
                
            current_category = {
                'id': category_name.lower().replace(' ', '-').replace('&', 'and').replace('/', '-'),
                'name': category_name,
                'description': '',
                'items': []
            }
            
            # Try to get description (text before first list item)
            desc_lines = []
            j = i + 1
            while j < len(lines) and not lines[j].startswith('- ['):
                if lines[j].strip() and not lines[j].startswith('#'):
                    desc_lines.append(lines[j].strip())
                j += 1
            
            if desc_lines:
                current_category['description'] = ' '.join(desc_lines)
            
            categories.append(current_category)
        
        # Check if it's a list item with a link
        elif line.startswith('- [') and current_category:
            # Parse: - [Name](URL) - Description
            match = re.match(r'- \[([^\]]+)\]\(([^\)]+)\)(.*)', line)
            if match:
                name = match.group(1).strip()
                url = match.group(2).strip()
                description = match.group(3).strip()
                
                # Remove leading " - " from description
                if description.startswith(' - '):
                    description = description[3:].strip()
                
                item = {
                    'name': name,
                    'url': url,
                    'description': description
                }
                
                current_category['items'].append(item)
    
    # Create the final data structure
    data = {
        'version': '1.0.0',
        'lastUpdated': '2025-10-30',
        'categories': categories
    }
    
    return data

def main():
    readme_path = 'README.md'
    output_path = 'data.json'
    
    print('Parsing README.md...')
    data = parse_readme_to_json(readme_path)
    
    print(f'Found {len(data["categories"])} categories')
    total_items = sum(len(cat['items']) for cat in data['categories'])
    print(f'Found {total_items} search engines')
    
    # Save to JSON
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f'\nData saved to {output_path}')
    
    # Print summary
    print('\nCategories:')
    for cat in data['categories']:
        print(f'  - {cat["name"]}: {len(cat["items"])} items')

if __name__ == '__main__':
    main()
