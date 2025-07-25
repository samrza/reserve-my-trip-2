# How to Add Your Own Packages and Images

## 📦 Adding New Packages

### Step 1: Edit data.json
Open `data.json` and add your new package in this format:

```json
{
  "destination": "Your Destination Name",
  "price": 25000,
  "duration": "5 Days",
  "hotel": "4 Star",
  "flight": "Yes",
  "description": "Your package description here"
}
```

### Step 2: Add Package Details
- **destination**: Name of the destination (will be searchable)
- **price**: Price in rupees (number only)
- **duration**: Format like "3 Days", "5 Days", "7 Days"
- **hotel**: "2 Star", "3 Star", "4 Star", or "5 Star"
- **flight**: "Yes" or "No"
- **description**: Brief description of the package

### Example New Package:
```json
{
  "destination": "Rishikesh Adventure",
  "price": 12000,
  "duration": "4 Days",
  "hotel": "3 Star",
  "flight": "No",
  "description": "River rafting, yoga retreat, and spiritual experience in the yoga capital"
}
```

## 🖼️ Adding Custom Images

### Step 1: Upload Your Images
1. Create a folder called `images` in your project root
2. Upload your destination images to this folder
3. Use descriptive names like `manali-snow.jpg`, `goa-beach.jpg`

### Step 2: Update Image Mapping
Edit `js/packages.js` and add your image to the `imageMap`:

```javascript
function getDestinationImage(destination) {
  const imageMap = {
    // Your existing images...
    'Your Destination': './images/your-image.jpg',
    'Rishikesh Adventure': './images/rishikesh-river.jpg',
    'New Package': './images/new-package.jpg'
  };
  
  return imageMap[destination] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1';
}
```

### Step 3: Image Requirements
- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 800x600 pixels or larger
- **Aspect Ratio**: 4:3 or 16:9 works best
- **File Size**: Keep under 500KB for fast loading

## 🔍 Making Packages Searchable

### Add to Dropdown Options
Edit `index.html` and add your destination to the appropriate category:

```html
<optgroup label="Adventure & Wildlife">
  <option value="Your Destination">Your Destination</option>
  <!-- existing options -->
</optgroup>
```

### Add to Quick Search Popular Buttons
```html
<button onclick="quickSearchDestination('Your Destination')" 
        class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition">
  Your Destination
</button>
```

## 📋 Complete Example

### 1. Add to data.json:
```json
{
  "destination": "Munnar Tea Gardens",
  "price": 18000,
  "duration": "4 Days",
  "hotel": "4 Star",
  "flight": "No",
  "description": "Explore rolling tea plantations, misty hills, and colonial charm in Kerala's tea capital"
}
```

### 2. Add image mapping:
```javascript
'Munnar Tea Gardens': './images/munnar-tea-gardens.jpg'
```

### 3. Add to dropdown:
```html
<option value="Munnar Tea Gardens">Munnar Tea Gardens</option>
```

### 4. Add to popular buttons:
```html
<button onclick="quickSearchDestination('Munnar Tea Gardens')" 
        class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition">
  Munnar
</button>
```

## 🎯 Tips for Better Packages

1. **Descriptive Names**: Use clear, searchable destination names
2. **Realistic Pricing**: Set prices that match your market
3. **Varied Durations**: Offer 2-12 day packages
4. **Hotel Mix**: Include 2-5 star options
5. **Flight Options**: Mix of flight included/excluded packages
6. **Compelling Descriptions**: Write engaging, benefit-focused descriptions

## 🔧 Testing Your Changes

1. **Add your package** to data.json
2. **Refresh the page** (http://localhost:8000)
3. **Test search** with your destination name
4. **Check the packages page** to see your new package
5. **Verify images** load correctly

## 📁 File Structure
```
reserve-my-trip-2/
├── data.json          # Add your packages here
├── images/            # Add your images here
├── js/
│   └── packages.js    # Add image mappings here
└── index.html         # Add dropdown options here
```

## 🚀 Quick Start Checklist

- [ ] Add package to data.json
- [ ] Upload image to images/ folder
- [ ] Add image mapping to packages.js
- [ ] Add to dropdown in index.html
- [ ] Test search functionality
- [ ] Verify package displays correctly 